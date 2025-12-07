import { Ticket, Calendar, MapPin, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Mock booking data
const MOCK_BOOKINGS = [
  {
    id: "1",
    eventTitle: "Rock Legends Live",
    eventDate: "Dec 15, 2024",
    eventTime: "8:00 PM",
    venue: "Madison Square Garden",
    seats: ["A1", "A2", "A3"],
    totalPrice: 225,
    status: "confirmed",
    bookedOn: "Nov 28, 2024",
  },
  {
    id: "2",
    eventTitle: "Jazz Night Special",
    eventDate: "Dec 20, 2024",
    eventTime: "7:30 PM",
    venue: "Blue Note Jazz Club",
    seats: ["B5", "B6"],
    totalPrice: 110,
    status: "confirmed",
    bookedOn: "Nov 25, 2024",
  },
  {
    id: "3",
    eventTitle: "Electronic Dreams Festival",
    eventDate: "Jan 5, 2025",
    eventTime: "9:00 PM",
    venue: "Avant Gardner",
    seats: ["C10", "C11", "C12", "C13"],
    totalPrice: 340,
    status: "confirmed",
    bookedOn: "Nov 20, 2024",
  },
];

export default function MyBookings() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <Ticket className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">My Bookings</h1>
            <p className="text-muted-foreground">View all your confirmed tickets</p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-border/50 bg-card/80">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{MOCK_BOOKINGS.length}</p>
              <p className="text-xs text-muted-foreground">Total Bookings</p>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/80">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">
                {MOCK_BOOKINGS.reduce((acc, b) => acc + b.seats.length, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Total Tickets</p>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/80">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">
                ${MOCK_BOOKINGS.reduce((acc, b) => acc + b.totalPrice, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Total Spent</p>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/80">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-success">{MOCK_BOOKINGS.length}</p>
              <p className="text-xs text-muted-foreground">Confirmed</p>
            </CardContent>
          </Card>
        </div>

        {/* Booking Cards */}
        <div className="space-y-4">
          {MOCK_BOOKINGS.map((booking, index) => (
            <Card 
              key={booking.id} 
              className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <CardTitle className="text-xl font-display">{booking.eventTitle}</CardTitle>
                  <Badge 
                    variant="outline" 
                    className="w-fit gap-1 border-success/50 bg-success/10 text-success"
                  >
                    <CheckCircle className="h-3 w-3" />
                    Confirmed
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Event Details */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{booking.eventDate} at {booking.eventTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{booking.venue}</span>
                  </div>
                </div>

                <Separator className="bg-border/50" />

                {/* Seats and Price */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Seats</p>
                    <div className="flex flex-wrap gap-2">
                      {booking.seats.map((seat) => (
                        <span 
                          key={seat}
                          className="px-3 py-1 text-sm font-medium rounded-md bg-primary/10 text-primary border border-primary/20"
                        >
                          {seat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Paid</p>
                    <p className="text-2xl font-bold text-foreground">${booking.totalPrice}</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Booking ID: #{booking.id.padStart(6, '0')}</span>
                  <span>Booked on {booking.bookedOn}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State (hidden when there are bookings) */}
        {MOCK_BOOKINGS.length === 0 && (
          <Card className="border-border/50 bg-card/80">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Ticket className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-lg font-medium text-foreground">No bookings yet</p>
              <p className="text-sm text-muted-foreground">Your confirmed tickets will appear here</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
