/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Plus,
  LayoutGrid,
  Settings,
  Clock,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

import { EventService } from "@/services/eventService";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState<Date>();
  const [eventTime, setEventTime] = useState("19:00"); // Default time
  const [venueName, setVenueName] = useState("");
  const [rows, setRows] = useState(10);
  const [columns, setColumns] = useState(10);
  const [pricePerSeat, setPricePerSeat] = useState(25);

  const handleGenerateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!eventDate || !eventTitle || !venueName) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill in all required fields.",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Constructing Date Object (Combine Date + Time)
      const dateString = format(eventDate, "yyyy-MM-dd");
      const combinedDate = new Date(`${dateString}T${eventTime}:00`);

      // Calling the endpoint
      await EventService.createEvent({
        title: eventTitle,
        venue: venueName,
        date: combinedDate.toISOString(),
        venueConfig: {
          rows: Number(rows),
          cols: Number(columns),
          price: Number(pricePerSeat),
        },
      });

      toast({
        title: "Event Created Successfully! 🎉",
        description: `"${eventTitle}" is now live with ${
          rows * columns
        } seats.`,
      });

      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to create event",
        description: error.message || "Something went wrong.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage events and seat configurations
          </p>
        </div>

        {/* Tab Navigation */}
        <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="bg-secondary/50 border border-border">
            <TabsTrigger
              value="create"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Plus className="h-4 w-4" />
              Create Event
            </TabsTrigger>
            <TabsTrigger
              value="manage"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <LayoutGrid className="h-4 w-4" />
              Manage Events
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Create Event Tab */}
          <TabsContent value="create" className="animate-fade-in">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Event Form */}
              <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-display">
                    Create New Event
                  </CardTitle>
                  <CardDescription>
                    Fill in the details to generate a new event
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleGenerateEvent} className="space-y-6">
                    {/* Event Title */}
                    <div className="space-y-2">
                      <Label htmlFor="title">Event Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Rock Concert 2024"
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                        className="bg-background/50"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    {/* Date & Time Picker */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Event Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              disabled={isLoading}
                              className={cn(
                                "w-full justify-start text-left font-normal bg-background/50",
                                !eventDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {eventDate
                                ? format(eventDate, "PPP")
                                : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={eventDate}
                              onSelect={setEventDate}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="time">Start Time</Label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="time"
                            type="time"
                            value={eventTime}
                            onChange={(e) => setEventTime(e.target.value)}
                            className="pl-10 bg-background/50"
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Venue Name */}
                    <div className="space-y-2">
                      <Label htmlFor="venue">Venue Name</Label>
                      <Input
                        id="venue"
                        placeholder="e.g., Madison Square Garden"
                        value={venueName}
                        onChange={(e) => setVenueName(e.target.value)}
                        className="bg-background/50"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    {/* Grid Configuration */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rows">Rows (A-Z)</Label>
                        <Input
                          id="rows"
                          type="number"
                          min={1}
                          max={26}
                          value={rows}
                          onChange={(e) => setRows(Number(e.target.value))}
                          className="bg-background/50"
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="columns">Columns</Label>
                        <Input
                          id="columns"
                          type="number"
                          min={1}
                          max={50}
                          value={columns}
                          onChange={(e) => setColumns(Number(e.target.value))}
                          className="bg-background/50"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    {/* Price per Seat */}
                    <div className="space-y-2">
                      <Label htmlFor="price">Price per Seat ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        min={0}
                        step={0.01}
                        value={pricePerSeat}
                        onChange={(e) =>
                          setPricePerSeat(Number(e.target.value))
                        }
                        className="bg-background/50"
                        disabled={isLoading}
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="hero"
                      className="w-full gap-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Generate Event
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Preview Card */}
              <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-display">
                    Preview
                  </CardTitle>
                  <CardDescription>
                    See how your event will look
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Grid Preview */}
                  <div className="aspect-video bg-muted/30 rounded-lg border border-border/50 flex items-center justify-center overflow-hidden p-4">
                    <div
                      className="grid gap-1"
                      style={{
                        gridTemplateColumns: `repeat(${Math.min(
                          columns,
                          15
                        )}, minmax(0, 1fr))`,
                      }}
                    >
                      {Array.from({
                        length: Math.min(rows * columns, 225),
                      }).map((_, i) => (
                        <div
                          key={i}
                          className="w-3 h-3 md:w-4 md:h-4 rounded-sm bg-seat-default border border-seat-default-border"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                      <p className="text-2xl font-bold text-primary">
                        {rows * columns}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Total Seats
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                      <p className="text-2xl font-bold text-primary">
                        ${pricePerSeat}
                      </p>
                      <p className="text-xs text-muted-foreground">Per Seat</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                      <p className="text-2xl font-bold text-primary">
                        ${(rows * columns * pricePerSeat).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Max Revenue
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Manage Events Tab */}
          <TabsContent value="manage" className="animate-fade-in">
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Manage Events</CardTitle>
                <CardDescription>View and edit existing events</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center min-h-[200px]">
                <p className="text-muted-foreground">
                  Feature coming soon in v1.1
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="animate-fade-in">
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>
                  Configure your admin preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center min-h-[200px]">
                <p className="text-muted-foreground">
                  Settings available in v1.1
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
