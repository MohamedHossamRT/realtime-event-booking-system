import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  image: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  category: string;
}

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const availabilityPercent = (event.availableSeats / event.totalSeats) * 100;
  const isLowAvailability = availabilityPercent < 20;

  return (
    <Card className="group overflow-hidden border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 animate-fade-in-up">
      {/* Event Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        <Badge
          variant="secondary"
          className="absolute left-3 top-3 bg-background/90 backdrop-blur-sm"
        >
          {event.category}
        </Badge>
        {isLowAvailability && (
          <Badge
            variant="destructive"
            className="absolute right-3 top-3 animate-pulse"
          >
            Few seats left!
          </Badge>
        )}
      </div>

      <CardHeader className="pb-2">
        <h3 className="line-clamp-2 text-lg font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
          {event.title}
        </h3>
      </CardHeader>

      <CardContent className="space-y-3 pb-4">
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>

        {/* Availability Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-3 w-3" />
              {event.availableSeats} available
            </span>
            <span className="font-semibold text-primary">
              ${event.price.toFixed(2)}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isLowAvailability ? "bg-destructive" : "bg-primary"
              }`}
              style={{ width: `${100 - availabilityPercent}%` }}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button asChild variant="default" className="w-full">
          <Link to={`/booking/${event.id}`}>Select Seats</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
