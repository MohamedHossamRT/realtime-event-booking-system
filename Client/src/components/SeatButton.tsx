import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type SeatStatus = "default" | "selected" | "locked" | "booked";

interface SeatButtonProps {
  row: string;
  number: number;
  status: SeatStatus;
  price?: number;
  onSelect?: () => void;
}

const statusMessages: Record<SeatStatus, string> = {
  default: "Available - Click to select",
  selected: "Selected - Click to deselect",
  locked: "Being held by another user",
  booked: "Already booked",
};

const statusVariants: Record<SeatStatus, "seat" | "seatSelected" | "seatLocked" | "seatBooked"> = {
  default: "seat",
  selected: "seatSelected",
  locked: "seatLocked",
  booked: "seatBooked",
};

export function SeatButton({ row, number, status, price, onSelect }: SeatButtonProps) {
  const seatLabel = `${row}${number}`;
  const isInteractive = status === "default" || status === "selected";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={statusVariants[status]}
          size="seat"
          disabled={!isInteractive}
          onClick={isInteractive ? onSelect : undefined}
          className={cn(
            "font-mono transition-all duration-200",
            isInteractive && "hover:scale-110",
            status === "selected" && "ring-2 ring-primary/50 ring-offset-2 ring-offset-background"
          )}
          aria-label={`Seat ${seatLabel} - ${statusMessages[status]}`}
        >
          {seatLabel}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        <p className="font-medium">{seatLabel}</p>
        <p className="text-muted-foreground">{statusMessages[status]}</p>
        {price && status === "default" && (
          <p className="text-primary font-semibold">${price.toFixed(2)}</p>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
