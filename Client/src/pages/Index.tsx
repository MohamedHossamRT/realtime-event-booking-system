import { useState, useEffect } from "react";
import { Zap, Sparkles, Users, Clock } from "lucide-react";
import { EventCard } from "@/components/EventCard";
import { EventCardSkeleton } from "@/components/EventCardSkeleton";
import { MOCK_EVENTS } from "@/data/mockEvents";
import { Button } from "@/components/ui/button";

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

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-accent/30 via-background to-background">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.1),transparent_50%)]" />
        </div>

        <div className="container relative py-16 md:py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary animate-fade-in">
              Real-Time Seat Booking
            </div>

            {/* Heading */}
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl animate-fade-in-up">
              Experience <span className="text-gradient">Real-Time</span>{" "}
              Booking
            </h1>

            {/* Subtext */}
            <p
              className="mb-8 text-lg text-muted-foreground md:text-xl animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              Watch seats update live. No refresh needed. Book your perfect spot
              before anyone else with lightning-fast, synchronized reservations.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col gap-4 sm:flex-row sm:justify-center animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <Button variant="hero" size="xl">
                Browse Events
              </Button>
            </div>
          </div>

          {/* Feature Cards */}
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

      {/* Events Section */}
      <section className="py-16 md:py-20">
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
            <Button variant="ghost" className="text-primary">
              View All Events →
            </Button>
          </div>

          {/* Events Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <EventCardSkeleton key={i} />
                ))
              : MOCK_EVENTS.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
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
          <Button variant="hero" size="xl">
            Get Started Free
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
