/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/axios";
import { ApiResponse, Event, Seat } from "@/types/api";

interface CreateEventDTO {
  title: string;
  date: string;
  venue: string;
  venueConfig: {
    rows: number;
    cols: number;
    price: number;
  };
}

export const EventService = {
  // GET /events
  getAllEvents: async () => {
    return api.get<any, ApiResponse<{ events: Event[] }>>("/events");
  },

  // GET /events/:id
  getEventById: async (id: string) => {
    return api.get<any, ApiResponse<{ event: Event }>>(`/events/${id}`);
  },

  // POST /events (Admins Only)
  createEvent: async (data: CreateEventDTO) => {
    return api.post<any, ApiResponse<{ event: Event }>>("/events", data);
  },

  // GET /events/:id/seats (The Merged Map)
  getEventSeats: async (eventId: string) => {
    return api.get<any, ApiResponse<{ seats: Seat[] }>>(
      `/events/${eventId}/seats`
    );
  },
};
