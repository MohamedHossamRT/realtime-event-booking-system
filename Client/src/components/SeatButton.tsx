import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type SeatStatus =
  | "default"
  | "selected"
  | "locked"
  | "booked"
  | "available";

interface SeatButtonProps {
  row: string;
  number: number;
  status: SeatStatus;
  price?: number;
  onSelect?: () => void;
  disabled?: boolean;
}

const statusMessages: Record<string, string> = {
  default: "Available - Click to select",
  available: "Available - Click to select",
  selected: "Selected - Click to deselect",
  locked: "Being held by another user",
  booked: "Already booked",
};

const statusVariants: Record<
  string,
  "seat" | "seatSelected" | "seatLocked" | "seatBooked"
> = {
  default: "seat",
  available: "seat",
  selected: "seatSelected",
  locked: "seatLocked",
  booked: "seatBooked",
};

export function SeatButton({
  row,
  number,
  status,
  price,
  onSelect,
  disabled,
}: SeatButtonProps) {
  const seatLabel = `${row}${number}`;

  const effectiveStatus = status === "available" ? "default" : status;

  const isInteractive =
    (effectiveStatus === "default" || effectiveStatus === "selected") &&
    !disabled;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={statusVariants[effectiveStatus] || "seat"}
          size="seat"
          disabled={disabled || !isInteractive}
          onClick={isInteractive ? onSelect : undefined}
          className={cn(
            "font-mono transition-all duration-200",
            isInteractive && "hover:scale-110",
            effectiveStatus === "selected" &&
              "ring-2 ring-primary/50 ring-offset-2 ring-offset-background"
          )}
          aria-label={`Seat ${seatLabel} - ${statusMessages[effectiveStatus]}`}
        >
          {seatLabel}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        <p className="font-medium">{seatLabel}</p>
        <p className="text-muted-foreground">
          {statusMessages[effectiveStatus]}
        </p>
        {price && effectiveStatus === "default" && (
          <p className="text-primary font-semibold">${price.toFixed(2)}</p>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
