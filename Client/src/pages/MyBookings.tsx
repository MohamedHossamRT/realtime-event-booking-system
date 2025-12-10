/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { BookingService } from "@/services/bookingService";
import { Link } from "react-router-dom";
import {
  Ticket,
  Calendar,
  MapPin,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function MyBookings() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: BookingService.getMyBookings,
  });

  const bookings = data?.data?.bookings || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your tickets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="border-destructive/50 bg-destructive/5 max-w-md w-full">
          <CardContent className="pt-6 text-center flex flex-col items-center gap-4">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <p className="text-destructive font-medium">
              Failed to load bookings
            </p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalBookings = bookings.length;
  const totalTickets = bookings.reduce(
    (acc: number, b: any) => acc + (b.seats?.length || 0),
    0
  );
  const totalSpent = bookings.reduce(
    (acc: number, b: any) => acc + b.totalAmount,
    0
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <Ticket className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              My Bookings
            </h1>
            <p className="text-muted-foreground">
              View all your confirmed tickets
            </p>
          </div>
        </div>

        {/* Stats Bar (Dynamic) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-border/50 bg-card/80">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{totalBookings}</p>
              <p className="text-xs text-muted-foreground">Total Bookings</p>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/80">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{totalTickets}</p>
              <p className="text-xs text-muted-foreground">Total Tickets</p>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/80">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">
                ${totalSpent.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">Total Spent</p>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/80">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-success">{totalBookings}</p>
              <p className="text-xs text-muted-foreground">Confirmed</p>
            </CardContent>
          </Card>
        </div>

        {/* Booking Cards */}
        <div className="space-y-4">
          {bookings.map((booking: any, index: number) => {
            const eventDate = booking.event?.date
              ? new Date(booking.event.date)
              : new Date();

            return (
              <Card
                key={booking._id}
                className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden animate-fade-in-up transition-all hover:border-primary/30"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="pb-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Real Event Title */}
                    <CardTitle className="text-xl font-display">
                      {booking.event?.title || "Event No Longer Available"}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className="w-fit gap-1 border-success/50 bg-success/10 text-success"
                    >
                      <CheckCircle className="h-3 w-3" />
                      {booking.status || "Confirmed"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Event Details */}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      {/* Real Date & Time */}
                      <span>
                        {eventDate.toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                        {" at "}
                        {eventDate.toLocaleTimeString(undefined, {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      {/* Real Venue */}
                      <span>{booking.event?.venue || "Pulse Main Hall"}</span>
                    </div>
                  </div>

                  <Separator className="bg-border/50" />

                  {/* Seats and Price */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        Seats
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {/* Real Seat Labels */}
                        {booking.seats?.map((seat: any) => (
                          <span
                            key={seat._id}
                            className="px-3 py-1 text-sm font-medium rounded-md bg-primary/10 text-primary border border-primary/20"
                          >
                            {seat.label}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        Total Paid
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        ${booking.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Booking ID: #{booking._id.slice(-6).toUpperCase()}
                    </span>
                    <span>
                      Booked on{" "}
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {bookings.length === 0 && (
          <Card className="border-border/50 bg-card/80">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Ticket className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-lg font-medium text-foreground">
                No bookings yet
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Your confirmed tickets will appear here
              </p>
              <Link to="/">
                <Button variant="hero">Browse Events</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
