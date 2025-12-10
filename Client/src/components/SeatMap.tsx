import { useMemo } from "react";
import { SeatButton } from "@/components/SeatButton";
import { Seat } from "@/types/api";

interface SeatMapProps {
  seats: Seat[];
  onSeatClick: (seat: Seat) => void;
  currentUserId?: string; // If explicit ID checks
}

export function SeatMap({ seats, onSeatClick }: SeatMapProps) {
  // Grouping seats by Row { "A": [Seat, Seat], "B": [...] }
  // useMemo to prevent re-calculating on every render unless seats change
  const rows = useMemo(() => {
    return seats.reduce((acc, seat) => {
      if (!acc[seat.row]) acc[seat.row] = [];
      acc[seat.row].push(seat);
      return acc;
    }, {} as Record<string, Seat[]>);
  }, [seats]);

  // Sorting rows alphabetically (A, B, C...)
  const sortedRowKeys = Object.keys(rows).sort();

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Screen Visual (Preserved from Lovable) */}
      <div className="w-full max-w-md">
        <div className="screen-curve h-8 w-full flex items-end justify-center pb-1">
          <span className="text-xs font-medium text-primary/70 uppercase tracking-widest">
            Screen
          </span>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="overflow-x-auto w-full pb-4">
        <div className="inline-flex flex-col gap-2 min-w-max px-4">
          {sortedRowKeys.map((rowLabel) => (
            <div key={rowLabel} className="flex items-center gap-2">
              {/* Row Label (Left) */}
              <span className="w-6 text-center text-xs font-semibold text-muted-foreground">
                {rowLabel}
              </span>

              {/* Seats in this Row */}
              <div className="flex gap-1.5 sm:gap-2">
                {rows[rowLabel]
                  .sort((a, b) => a.number - b.number)
                  .map((seat) => {
                    // MAP BACKEND STATUS -> COMPONENT STATUS
                    // Backend: 'available' | 'locked' | 'booked' | 'selected' (from hook)
                    // Component: 'default' | 'locked' | 'booked' | 'selected'

                    let visualStatus:
                      | "default"
                      | "selected"
                      | "locked"
                      | "booked" = "default";

                    if (seat.status === "booked") visualStatus = "booked";
                    else if (seat.status === "locked")
                      visualStatus = "locked"; // Someone else
                    else if (seat.status === "selected")
                      visualStatus = "selected"; // Me (Blue)
                    else visualStatus = "default"; // Available

                    return (
                      <SeatButton
                        key={seat._id} // Using ID as key
                        row={seat.row}
                        number={seat.number}
                        status={visualStatus}
                        price={seat.price}
                        onSelect={() => onSeatClick(seat)}
                        // Disabling interaction if booked or locked by someone else
                        disabled={
                          visualStatus === "booked" || visualStatus === "locked"
                        }
                      />
                    );
                  })}
              </div>

              {/* Row Label (Right) */}
              <span className="w-6 text-center text-xs font-semibold text-muted-foreground">
                {rowLabel}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded border border-seat-default-border bg-seat-default" />
          <span className="text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-seat-selected border-2 border-seat-selected" />
          <span className="text-muted-foreground">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-seat-locked border border-seat-locked animate-seat-pulse" />
          <span className="text-muted-foreground">Held</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-seat-booked border border-seat-booked opacity-60" />
          <span className="text-muted-foreground">Booked</span>
        </div>
      </div>
    </div>
  );
}
