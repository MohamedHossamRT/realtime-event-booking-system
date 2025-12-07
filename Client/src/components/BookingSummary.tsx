import { Ticket, CreditCard, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface SelectedSeat {
  row: string;
  number: number;
  price: number;
}

interface BookingSummaryProps {
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  selectedSeats: SelectedSeat[];
  onCheckout?: () => void;
}

export function BookingSummary({
  eventTitle,
  eventDate,
  eventTime,
  selectedSeats,
  onCheckout,
}: BookingSummaryProps) {
  const subtotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const serviceFee = selectedSeats.length * 2.5;
  const total = subtotal + serviceFee;

  return (
    <Card className="border-border/50 bg-card shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Ticket className="h-5 w-5 text-primary" />
          Booking Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Event Info */}
        <div className="space-y-1">
          <h3 className="font-semibold text-foreground">{eventTitle}</h3>
          <p className="text-sm text-muted-foreground">
            {eventDate} • {eventTime}
          </p>
        </div>

        <Separator />

        {/* Selected Seats */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Selected Seats
            </span>
            <Badge variant="secondary" className="text-xs">
              {selectedSeats.length} {selectedSeats.length === 1 ? "seat" : "seats"}
            </Badge>
          </div>

          {selectedSeats.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map((seat) => (
                <Badge
                  key={`${seat.row}${seat.number}`}
                  variant="outline"
                  className="border-primary/30 bg-primary/5 text-foreground"
                >
                  {seat.row}
                  {seat.number}
                  <span className="ml-1 text-primary">${seat.price}</span>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No seats selected. Click on available seats to add them.
            </p>
          )}
        </div>

        {selectedSeats.length > 0 && (
          <>
            <Separator />

            {/* Price Breakdown */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service Fee</span>
                <span className="text-foreground">${serviceFee.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-base font-semibold">
                <span className="text-foreground">Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Timer Warning */}
            <div className="flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/10 p-3">
              <Clock className="h-4 w-4 text-warning" />
              <p className="text-xs text-warning">
                Your seats are held for <span className="font-semibold">10:00</span> minutes
              </p>
            </div>
          </>
        )}
      </CardContent>

      <CardFooter>
        <Button
          variant="hero"
          size="lg"
          className="w-full gap-2"
          disabled={selectedSeats.length === 0}
          onClick={onCheckout}
        >
          <CreditCard className="h-4 w-4" />
          Proceed to Checkout
        </Button>
      </CardFooter>
    </Card>
  );
}
