import { useState } from "react";
import { SeatButton, SeatStatus } from "@/components/SeatButton";
import { cn } from "@/lib/utils";

interface Seat {
  row: string;
  number: number;
  status: SeatStatus;
  price: number;
}

interface SeatMapProps {
  onSelectionChange?: (seats: Seat[]) => void;
}

// Generate mock seat data with 10x10 grid
const generateMockSeats = (): Seat[][] => {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  
  return rows.map((row, rowIndex) => {
    return Array.from({ length: 10 }, (_, i) => {
      // Create some variety in seat states
      let status: SeatStatus = "default";
      const seatNum = rowIndex * 10 + i;
      
      // Some seats are booked
      if ([3, 15, 24, 35, 47, 58, 66, 72, 81, 89].includes(seatNum)) {
        status = "booked";
      }
      // Some seats are locked (simulating real-time holds)
      else if ([7, 22, 34, 45, 67].includes(seatNum)) {
        status = "locked";
      }
      
      // Price tiers based on row
      const price = rowIndex < 3 ? 89.99 : rowIndex < 6 ? 69.99 : 49.99;

      return {
        row,
        number: i + 1,
        status,
        price,
      };
    });
  });
};

export function SeatMap({ onSelectionChange }: SeatMapProps) {
  const [seats, setSeats] = useState<Seat[][]>(generateMockSeats);

  const handleSeatClick = (rowIndex: number, seatIndex: number) => {
    setSeats((prevSeats) => {
      const newSeats = prevSeats.map((row, rIdx) =>
        row.map((seat, sIdx) => {
          if (rIdx === rowIndex && sIdx === seatIndex) {
            const newStatus: SeatStatus =
              seat.status === "default" ? "selected" : 
              seat.status === "selected" ? "default" : 
              seat.status;
            return { ...seat, status: newStatus };
          }
          return seat;
        })
      );

      // Notify parent of selection changes
      const selectedSeats = newSeats.flat().filter((s) => s.status === "selected");
      onSelectionChange?.(selectedSeats);

      return newSeats;
    });
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Screen */}
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
          {seats.map((row, rowIndex) => (
            <div key={row[0].row} className="flex items-center gap-2">
              {/* Row Label */}
              <span className="w-6 text-center text-xs font-semibold text-muted-foreground">
                {row[0].row}
              </span>
              
              {/* Seats */}
              <div className="flex gap-1.5 sm:gap-2">
                {row.map((seat, seatIndex) => (
                  <SeatButton
                    key={`${seat.row}${seat.number}`}
                    row={seat.row}
                    number={seat.number}
                    status={seat.status}
                    price={seat.price}
                    onSelect={() => handleSeatClick(rowIndex, seatIndex)}
                  />
                ))}
              </div>
              
              {/* Row Label (right side) */}
              <span className="w-6 text-center text-xs font-semibold text-muted-foreground">
                {row[0].row}
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
