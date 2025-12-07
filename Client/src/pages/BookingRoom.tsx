import { useState } from "react";
import { ArrowLeft, Info } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { SeatMap } from "@/components/SeatMap";
import { BookingSummary } from "@/components/BookingSummary";
import { MobileBookingSummary } from "@/components/MobileBookingSummary";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_EVENTS } from "@/data/mockEvents";
import { toast } from "@/hooks/use-toast";

interface SelectedSeat {
  row: string;
  number: number;
  price: number;
}

const BookingRoom = () => {
  const { eventId } = useParams();
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);

  // Find the event or use demo data
  const event = MOCK_EVENTS.find((e) => e.id === eventId) || {
    id: "demo",
    title: "Demo Event - Select Your Seats",
    date: "Saturday, Dec 14, 2024",
    time: "7:00 PM",
    venue: "Demo Venue",
    image: "",
    price: 79.99,
    availableSeats: 100,
    totalSeats: 100,
    category: "Demo",
  };

  const handleSelectionChange = (seats: SelectedSeat[]) => {
    setSelectedSeats(seats);
  };

  const handleCheckout = () => {
    // Logic: Handle checkout process
    toast({
      title: "Proceeding to Checkout",
      description: `${selectedSeats.length} seats selected for $${(
        selectedSeats.reduce((sum, s) => sum + s.price, 0) + selectedSeats.length * 2.5
      ).toFixed(2)}`,
    });
  };

  return (
    <div className="min-h-screen pb-24 lg:pb-0">
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
                <h1 className="font-semibold text-foreground line-clamp-1">{event.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {event.date} • {event.time}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                Live Updates
              </Badge>
              <Button variant="ghost" size="icon">
                <Info className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Seat Map Section */}
          <div className="flex-1">
            <div className="rounded-xl border border-border/50 bg-card p-4 sm:p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Select Your Seats</h2>
                <Badge variant="secondary">
                  {selectedSeats.length} selected
                </Badge>
              </div>
              <SeatMap onSelectionChange={handleSelectionChange} />
            </div>

            {/* Pricing Tiers */}
            <div className="mt-6 rounded-xl border border-border/50 bg-card p-4 sm:p-6">
              <h3 className="mb-4 text-sm font-semibold text-foreground">Pricing Tiers</h3>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Premium (A-C)</p>
                    <p className="text-xs text-muted-foreground">Front rows, best view</p>
                  </div>
                  <span className="text-lg font-bold text-primary">$89.99</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Standard (D-F)</p>
                    <p className="text-xs text-muted-foreground">Great balance</p>
                  </div>
                  <span className="text-lg font-bold text-foreground">$69.99</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Economy (G-J)</p>
                    <p className="text-xs text-muted-foreground">Budget friendly</p>
                  </div>
                  <span className="text-lg font-bold text-foreground">$49.99</span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Summary Sidebar */}
          <div className="hidden lg:block lg:w-80 xl:w-96">
            <div className="sticky top-36">
              <BookingSummary
                eventTitle={event.title}
                eventDate={event.date}
                eventTime={event.time}
                selectedSeats={selectedSeats}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Summary */}
      <MobileBookingSummary
        selectedSeats={selectedSeats}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

export default BookingRoom;
