
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  is_online: boolean;
  date_start: string;
  date_end: string;
  ticket_type: string;
  ticket_price: number | null;
  ticket_limit: number | null;
  image_url: string | null;
  status: string;
  creator_id: string;
  registration_deadline: string | null;
  is_talent_needed: boolean;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTicketType, setSelectedTicketType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [sortOption, setSortOption] = useState("upcoming");
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("status", "published")
        .order("date_start", { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Get unique categories and locations for filters
  const uniqueCategories = Array.from(new Set(events.map(event => event.category).filter(Boolean)));
  const uniqueLocations = Array.from(new Set(events.map(event => 
    event.is_online ? "Online" : event.location
  ).filter(Boolean)));

  // Filter and sort events
  const filteredEvents = events
    .filter((event) => {
      const matchesSearch = 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
      const matchesTicketType = selectedTicketType === "all" || event.ticket_type === selectedTicketType;
      const matchesLocation = selectedLocation === "all" || 
        (selectedLocation === "Online" ? event.is_online : event.location.includes(selectedLocation));
      
      return matchesSearch && matchesCategory && matchesTicketType && matchesLocation;
    })
    .sort((a, b) => {
      if (sortOption === "upcoming") {
        return new Date(a.date_start).getTime() - new Date(b.date_start).getTime();
      }
      return 0;
    });

  const handleCreateEvent = () => {
    if (!user) {
      toast.error("Please sign in to create events");
      navigate("/sign-in");
      return;
    }
    navigate("/events/create");
  };

  const handleViewEventDetails = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const isEventExpired = (eventDate: string) => {
    return new Date(eventDate) < new Date();
  };

  const isRegistrationClosed = (event: Event) => {
    if (event.registration_deadline) {
      return new Date(event.registration_deadline) < new Date();
    }
    return isEventExpired(event.date_start);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <section className="bg-maasta-purple/5 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">Media Events</h1>
                  <p className="text-lg text-gray-600">
                    Discover workshops, courses, contests, and more
                  </p>
                </div>
                <Button className="bg-maasta-orange hover:bg-maasta-orange/90">
                  Create Event
                </Button>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-20" />
              </div>
            </div>
          </section>
          
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-3" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Header Section */}
        <section className="bg-maasta-purple/5 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Media Events</h1>
                <p className="text-lg text-gray-600">
                  Discover workshops, courses, contests, and more
                </p>
              </div>
              <Button 
                className="bg-maasta-orange hover:bg-maasta-orange/90"
                onClick={handleCreateEvent}
              >
                Create Event
              </Button>
            </div>
            
            {/* Search */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search events by title, description, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Events Listing */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedTicketType} onValueChange={setSelectedTicketType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Online">Online</SelectItem>
                  {uniqueLocations.filter(loc => loc !== "Online").map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortOption} onValueChange={setS ortOption}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming First</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Results display */}
            <div>
              <p className="text-sm text-gray-500 mb-4">
                Showing {filteredEvents.length} events
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => {
                  const eventDate = new Date(event.date_start);
                  const formattedDate = eventDate.toLocaleDateString('en-US', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                  });
                  const isExpired = isEventExpired(event.date_start);
                  const regClosed = isRegistrationClosed(event);
                  
                  return (
                    <Card key={event.id} className="overflow-hidden card-hover">
                      <div className="relative h-48">
                        <img
                          src={event.image_url || "https://images.unsplash.com/photo-1581905764498-f1b60bae941a?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3"}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 flex gap-2">
                          <Badge variant="secondary" className="bg-white/90 text-black">
                            {event.category?.charAt(0).toUpperCase() + event.category?.slice(1)}
                          </Badge>
                          <Badge 
                            variant={event.ticket_type === "free" ? "secondary" : "default"}
                            className={event.ticket_type === "free" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}
                          >
                            {event.ticket_type === "free" ? "Free" : `₹${event.ticket_price}`}
                          </Badge>
                        </div>
                        {isExpired && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge variant="destructive">Event Ended</Badge>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg line-clamp-2 mb-2">{event.title}</h3>
                        
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                          </svg>
                          {formattedDate}
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                          </svg>
                          {event.is_online ? (
                            <span className="flex items-center">
                              <Badge variant="outline" className="mr-1">Online</Badge>
                            </span>
                          ) : (
                            event.location
                          )}
                        </div>

                        {event.ticket_limit && (
                          <p className="text-xs text-gray-400 mb-3">
                            Limited to {event.ticket_limit} participants
                          </p>
                        )}

                        {regClosed && !isExpired && (
                          <p className="text-xs text-red-500 mb-3">Registration closed</p>
                        )}
                        
                        <Button 
                          variant="outline" 
                          className="w-full border-maasta-orange text-maasta-orange hover:bg-maasta-orange/5"
                          onClick={() => handleViewEventDetails(event.id)}
                          disabled={isExpired}
                        >
                          {isExpired ? "Event Ended" : "View Details"}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              {filteredEvents.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No events found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
                  <Button 
                    onClick={handleCreateEvent}
                    className="bg-maasta-orange hover:bg-maasta-orange/90"
                  >
                    Create the First Event
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Events;
