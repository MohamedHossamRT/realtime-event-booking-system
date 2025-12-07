import { useState } from "react";
import { Ticket, CreditCard, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SelectedSeat {
  row: string;
  number: number;
  price: number;
}

interface MobileBookingSummaryProps {
  selectedSeats: SelectedSeat[];
  onCheckout?: () => void;
}

export function MobileBookingSummary({ selectedSeats, onCheckout }: MobileBookingSummaryProps) {
  const [expanded, setExpanded] = useState(false);
  
  const subtotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const serviceFee = selectedSeats.length * 2.5;
  const total = subtotal + serviceFee;

  if (selectedSeats.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-lg shadow-2xl animate-slide-in-bottom lg:hidden">
      {/* Expandable Details */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          expanded ? "max-h-64" : "max-h-0"
        )}
      >
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Selected Seats</span>
            <Badge variant="secondary">{selectedSeats.length} seats</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedSeats.map((seat) => (
              <Badge
                key={`${seat.row}${seat.number}`}
                variant="outline"
                className="border-primary/30 bg-primary/5"
              >
                {seat.row}{seat.number} · ${seat.price}
              </Badge>
            ))}
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-border">
            <span className="text-muted-foreground">Subtotal + Fees</span>
            <span>${subtotal.toFixed(2)} + ${serviceFee.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="flex items-center justify-between p-4 gap-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-3 flex-1 min-w-0"
        >
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
            <Ticket className="h-5 w-5 text-primary" />
          </div>
          <div className="text-left min-w-0">
            <p className="text-xs text-muted-foreground">
              {selectedSeats.length} {selectedSeats.length === 1 ? "seat" : "seats"} selected
            </p>
            <p className="text-lg font-bold text-foreground truncate">
              ${total.toFixed(2)}
            </p>
          </div>
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground ml-auto shrink-0" />
          ) : (
            <ChevronUp className="h-4 w-4 text-muted-foreground ml-auto shrink-0" />
          )}
        </button>

        <Button
          variant="hero"
          size="lg"
          className="gap-2 shrink-0"
          onClick={onCheckout}
        >
          <CreditCard className="h-4 w-4" />
          Checkout
        </Button>
      </div>
    </div>
  );
}
