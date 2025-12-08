/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/axios";
import { ApiResponse, Booking } from "@/types/api";

export const BookingService = {
  // POST /events/:eventId/seats
  bookSeats: async (
    eventId: string,
    seatIds: string[],
    totalAmount: number
  ) => {
    return api.post<any, ApiResponse<{ booking: Booking }>>(
      `/events/${eventId}/seats`,
      {
        seatIds,
        totalAmount,
      }
    );
  },

  // GET /bookings/me
  getMyBookings: async () => {
    return api.get<any, ApiResponse<{ bookings: Booking[] }>>("/bookings/me");
  },
};
