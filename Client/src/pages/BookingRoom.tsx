/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { SeatMap } from "@/components/SeatMap";
import { BookingSummary } from "@/components/BookingSummary";
import { MobileBookingSummary } from "@/components/MobileBookingSummary";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useRealTimeEvent } from "@/hooks/useRealTimeEvent";
import { useAuthStore } from "@/stores/authStore";
import { BookingService } from "@/services/bookingService";

const BookingRoom = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuthStore();

  const { event, seats, isLoading, handleSeatClick } =
    useRealTimeEvent(eventId);
  const [isProcessing, setIsProcessing] = useState(false);

  const mySeats = seats.filter((seat) => seat.status === "selected");

  const handleCheckout = async () => {
    if (mySeats.length === 0) return;

    setIsProcessing(true);
    try {
      const seatIds = mySeats.map((s) => s._id);
      const totalAmount = mySeats.reduce((sum, s) => sum + s.price, 0);

      await BookingService.bookSeats(eventId!, seatIds, totalAmount);

      toast({
        title: "Booking Confirmed! 🎉",
        description: "Your seats have been successfully reserved.",
      });

      navigate("/my-bookings");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: error.message || "Could not complete reservation.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) return <div className="p-10 text-center">Event not found</div>;

  return (
    <div className="min-h-screen pb-24 lg:pb-0 bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-16 z-30 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="font-semibold text-foreground line-clamp-1">
                  {event.title}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {/* THE FIX: Use event.venue dynamically */}
                  {new Date(event.date).toLocaleDateString()} • {event.venue}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="gap-1 bg-green-500/10 text-green-600 border-green-200"
              >
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Live Socket
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* LEFT: Seat Map Section */}
          <div className="flex-1">
            <div className="rounded-xl border border-border/50 bg-card p-4 sm:p-6 overflow-hidden shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  Select Your Seats
                </h2>
                <Badge variant="secondary">{mySeats.length} selected</Badge>
              </div>

              <div className="flex justify-center">
                <SeatMap
                  seats={seats}
                  onSeatClick={handleSeatClick}
                  currentUserId={user?._id || ""}
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Desktop Summary Sidebar */}
          <div className="hidden lg:block lg:w-80 xl:w-96">
            <div className="sticky top-36">
              <BookingSummary
                eventTitle={event.title}
                eventDate={new Date(event.date).toLocaleDateString()}
                eventTime={new Date(event.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                selectedSeats={mySeats.map((s) => ({
                  row: s.row,
                  number: s.number,
                  price: s.price,
                }))}
                onCheckout={handleCheckout}
                isLoading={isProcessing}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Summary */}
      <MobileBookingSummary
        selectedSeats={mySeats.map((s) => ({
          row: s.row,
          number: s.number,
          price: s.price,
        }))}
        onCheckout={handleCheckout}
        isLoading={isProcessing}
      />
    </div>
  );
};

export default BookingRoom;
