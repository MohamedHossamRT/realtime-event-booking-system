export interface ApiResponse<T> {
  status: string;
  results?: number;
  token?: string;
  data: T;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface Event {
  _id: string;
  title: string;
  venue: string;
  date: string;
  status: "draft" | "active" | "ended" | "cancelled";
  venueConfig: {
    rows: number;
    cols: number;
    price: number;
  };
}

export interface Seat {
  _id: string;
  row: string;
  number: number;
  label: string;
  price: number;
  status: "available" | "locked" | "booked" | "selected" | "default";
  isTemporarilyHeld?: boolean; // From frontend logic
}

export interface Booking {
  _id: string;
  event: Event; // Populated
  seats: Seat[]; // Populated
  totalAmount: number;
  createdAt: string;
}
