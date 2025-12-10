/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { EventService } from "@/services/eventService";
import SocketService from "@/lib/socket";
import { Seat } from "@/types/api";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/authStore";

export const useRealTimeEvent = (eventId: string | undefined) => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const { user } = useAuthStore();
  const { toast } = useToast();

  // Fetching Event Details
  const { data: eventData, isLoading: isEventLoading } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => EventService.getEventById(eventId!),
    enabled: !!eventId,
  });

  // Fetching Initial Seat Map
  const { data: seatsData, isLoading: isSeatsLoading } = useQuery({
    queryKey: ["seats", eventId],
    queryFn: () => EventService.getEventSeats(eventId!),
    enabled: !!eventId,
  });

  // Syncing API Data to Local State
  useEffect(() => {
    if (seatsData?.data?.seats) {
      setSeats(seatsData.data.seats);
    }
  }, [seatsData]);

  // Socket Connection & Event Listeners
  useEffect(() => {
    if (!eventId || !user) return;

    const socket = SocketService.connect();

    // Join the Room
    socket.emit("join_event", eventId);

    // Listen: Seat Locked by someone else
    const handleSeatLocked = (payload: {
      seatId: string;
      lockedBy: string;
    }) => {
      setSeats((prev) =>
        prev.map((seat) => {
          if (seat._id === payload.seatId) {
            // If *I* locked it, it's 'selected'. If *Someone else*, it's 'locked'.
            const isMyLock = payload.lockedBy === user._id;
            return {
              ...seat,
              status: isMyLock ? "selected" : "locked",
            } as Seat;
          }
          return seat;
        })
      );
    };

    // Listen: Seat Released
    const handleSeatReleased = (payload: { seatId: string }) => {
      setSeats((prev) =>
        prev.map((seat) =>
          seat._id === payload.seatId ? { ...seat, status: "available" } : seat
        )
      );
    };

    // Handle Booked Event (Live Confirmation)
    const handleSeatsBooked = (payload: { seatIds: string[] }) => {
      setSeats((prev) =>
        prev.map((seat) =>
          payload.seatIds.includes(seat._id)
            ? { ...seat, status: "booked" }
            : seat
        )
      );
    };

    // Listen: Lock Failed (Race Condition)
    const handleLockFailed = (payload: { seatId: string; message: string }) => {
      toast({
        variant: "destructive",
        title: "Seat Unavailable",
        description: payload.message,
      });
      // Reverting that specific seat to 'locked' or 'booked' to reflect the state
      setSeats((prev) =>
        prev.map((seat) =>
          seat._id === payload.seatId ? { ...seat, status: "locked" } : seat
        )
      );
    };

    socket.on("seat_locked", handleSeatLocked);
    socket.on("seat_released", handleSeatReleased);
    socket.on("seats_booked", handleSeatsBooked);
    socket.on("lock_failed", handleLockFailed);

    // Cleanup
    return () => {
      socket.emit("leave_event", eventId);
      socket.off("seat_locked", handleSeatLocked);
      socket.off("seat_released", handleSeatReleased);
      socket.off("seats_booked", handleSeatsBooked);
      socket.off("lock_failed", handleLockFailed);
    };
  }, [eventId, user, toast]);

  // User Interaction Actions
  const handleSeatClick = useCallback(
    (seat: Seat) => {
      const socket = SocketService.get();
      if (!socket) return;

      if (seat.status === "available") {
        // Optimistic
        setSeats((prev) =>
          prev.map((s) =>
            s._id === seat._id ? { ...s, status: "selected" } : s
          )
        );
        socket.emit("request_lock", { eventId, seatId: seat._id });
      } else if (seat.status === "selected") {
        // Release my own selection
        socket.emit("release_lock", { eventId, seatId: seat._id });
        // Optimistic
        setSeats((prev) =>
          prev.map((s) =>
            s._id === seat._id ? { ...s, status: "available" } : s
          )
        );
      }
    },
    [eventId, user]
  );

  return {
    event: eventData?.data?.event,
    seats,
    isLoading: isEventLoading || isSeatsLoading,
    handleSeatClick,
  };
};
