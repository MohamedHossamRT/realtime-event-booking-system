/* eslint-disable @typescript-eslint/no-explicit-any */
import { Zap, Users, Clock, AlertCircle } from "lucide-react";
import { EventCard, Event as FrontendEvent } from "@/components/EventCard";
import { EventCardSkeleton } from "@/components/EventCardSkeleton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import { EventService } from "@/services/eventService";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";

const features = [
  {
    icon: Zap,
    title: "Real-Time Updates",
    description: "See seat availability change live as others book",
  },
  {
    icon: Users,
    title: "Collaborative Booking",
    description: "Book with friends and see their selections instantly",
  },
  {
    icon: Clock,
    title: "Smart Holds",
    description: "Your seats are secured while you complete checkout",
  },
];

// Helper -> Deterministic Image Picker
// Since the backend doesn't store images, picking one based on the Event ID
const EVENT_IMAGES = [
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Concert
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Crowd
  "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Party
  "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Cinema
];

// Background URLs
const BG_URL_LIGHT =
  "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80"; // Light
const BG_URL_DARK =
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80"; // Dark

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Fetching Events
  const { data, isLoading, error } = useQuery({
    queryKey: ["events"],
    queryFn: EventService.getAllEvents,
  });

  const scrollToEvents = () => {
    const element = document.getElementById("events");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleStartBooking = () => {
    if (user) {
      scrollToEvents();
    } else {
      navigate("/login");
    }
  };

  const handleGetStarted = () => {
    if (user) {
      scrollToEvents();
    } else {
      navigate("/register");
    }
  };

  // Data Transformation from Backend to Frontend
  const events: FrontendEvent[] =
    data?.data?.events.map((beEvent: any) => {
      const totalSeats = beEvent.venueConfig.rows * beEvent.venueConfig.cols;
      const realAvailable =
        beEvent.availableSeats !== undefined
          ? beEvent.availableSeats
          : totalSeats;

      const dateObj = new Date(beEvent.date);

      return {
        id: beEvent._id,
        title: beEvent.title,
        date: dateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        time: dateObj.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),

        venue: beEvent.venue || "Pulse Main Hall",

        image:
          EVENT_IMAGES[
            beEvent._id.charCodeAt(beEvent._id.length - 1) % EVENT_IMAGES.length
          ],
        price: beEvent.venueConfig.price,

        availableSeats: realAvailable,
        totalSeats: totalSeats,
        category: "Live Event",
      };
    }) || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Theme-Aware Background */}
      <section
        className="relative overflow-hidden border-b border-border/50 bg-cover bg-center transition-all duration-500"
        style={
          {
            // We use a CSS variable trick or conditional class.
            // Tailwind's `dark:` modifier is cleaner for bg images if defined in config,
            // but inline style works best for dynamic URLs.
            // We will use a pseudo-element overlay for readability.
          }
        }
      >
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          {/* Light Mode BG */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-100 dark:opacity-0 transition-opacity duration-700"
            style={{ backgroundImage: `url(${BG_URL_LIGHT})` }}
          />
          {/* Dark Mode BG */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-0 dark:opacity-100 transition-opacity duration-700"
            style={{ backgroundImage: `url(${BG_URL_DARK})` }}
          />
          {/* Overlay Gradient for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/60 to-background/90" />
        </div>

        <div className="container relative py-16 md:py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary animate-fade-in">
              Real-Time Seat Booking
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl animate-fade-in-up">
              Experience <span className="text-gradient">Real-Time</span>{" "}
              Booking
            </h1>

            <p
              className="mb-8 text-lg text-muted-foreground md:text-xl animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              Watch seats update live. No refresh needed. Book your perfect spot
              before anyone else with lightning-fast, synchronized reservations.
            </p>

            {/* Smart Logic CTA */}
            <div
              className="flex flex-col gap-4 sm:flex-row sm:justify-center animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <Button onClick={handleStartBooking} variant="hero" size="xl">
                Start Booking
              </Button>
            </div>
          </div>

          <div
            className="mt-16 grid gap-6 sm:grid-cols-3 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section (Added ID for scrolling) */}
      <section className="py-16 md:py-20" id="events">
        <div className="container">
          <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                Upcoming Events
              </h2>
              <p className="mt-1 text-muted-foreground">
                Discover and book your next unforgettable experience
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <EventCardSkeleton key={i} />
              ))
            ) : error ? (
              <div className="col-span-full flex flex-col items-center justify-center p-10 text-center border rounded-lg bg-destructive/5 border-destructive/20">
                <AlertCircle className="h-10 w-10 text-destructive mb-4" />
                <h3 className="text-lg font-semibold text-destructive">
                  Failed to load events
                </h3>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </div>
            ) : events.length === 0 ? (
              <div className="col-span-full text-center py-20 text-muted-foreground">
                <p>No events found. Log in as Admin to create one!</p>
              </div>
            ) : (
              events.map((event) => <EventCard key={event.id} event={event} />)
            )}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-border/50 bg-accent/30 py-16">
        <div className="container text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">
            Ready to experience real-time booking?
          </h2>
          <p className="mb-8 text-muted-foreground">
            Join thousands of fans who never miss out on their favorite events.
          </p>
          {/* Smart Logic Footer Button */}
          <Button onClick={handleGetStarted} variant="hero" size="xl">
            Get Started Free
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
