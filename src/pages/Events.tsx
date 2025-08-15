import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EventsHeader } from "@/components/events/EventsHeader";
import { EventCard } from "@/components/events/EventCard";
import { EventFilters } from "@/components/events/EventFilters";
import { FeaturedEventsCarousel } from "@/components/events/FeaturedEventsCarousel";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { Search, MapPin, Calendar, Filter } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  banner_url?: string;
  category?: string;
  ticketing_enabled: boolean;
  ticket_price?: number;
  max_attendees?: number;
  status: string;
  created_at: string;
  creator_id: string;
  organizer_info?: string;
}

interface Filters {
  search: string;
  category: string;
  location: string;
  dateRange: string;
  priceRange: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    category: '',
    location: '',
    dateRange: '',
    priceRange: ''
  });
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const eventsData = data || [];
      setEvents(eventsData);
      
      // Set featured events (first 5 events)
      setFeaturedEvents(eventsData.slice(0, 5));
    } catch (error: any) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to load events. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedEvents = React.useMemo(() => {
    let filtered = events.filter(event => {
      const matchesSearch = !filters.search || 
        event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.location.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesCategory = !filters.category || event.category === filters.category;
      
      const matchesLocation = !filters.location || 
        event.location.toLowerCase().includes(filters.location.toLowerCase());
      
      const eventDate = new Date(event.event_date);
      const now = new Date();
      const matchesDateRange = !filters.dateRange || (() => {
        switch (filters.dateRange) {
          case 'today':
            return eventDate.toDateString() === now.toDateString();
          case 'weekend':
            const weekendStart = new Date(now);
            weekendStart.setDate(now.getDate() + (6 - now.getDay()));
            const weekendEnd = new Date(weekendStart);
            weekendEnd.setDate(weekendStart.getDate() + 1);
            return eventDate >= weekendStart && eventDate <= weekendEnd;
          case 'week':
            const weekEnd = new Date(now);
            weekEnd.setDate(now.getDate() + 7);
            return eventDate >= now && eventDate <= weekEnd;
          default:
            return true;
        }
      })();
      
      const matchesPriceRange = !filters.priceRange || (() => {
        switch (filters.priceRange) {
          case 'free':
            return !event.ticketing_enabled || event.ticket_price === 0;
          case 'paid':
            return event.ticketing_enabled && (event.ticket_price || 0) > 0;
          default:
            return true;
        }
      })();
      
      return matchesSearch && matchesCategory && matchesLocation && matchesDateRange && matchesPriceRange;
    });

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'price_low':
          const priceA = a.ticketing_enabled ? a.ticket_price || 0 : 0;
          const priceB = b.ticketing_enabled ? b.ticket_price || 0 : 0;
          return priceA - priceB;
        case 'price_high':
          const priceA2 = a.ticketing_enabled ? a.ticket_price || 0 : 0;
          const priceB2 = b.ticketing_enabled ? b.ticket_price || 0 : 0;
          return priceB2 - priceA2;
        case 'date':
          return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [events, filters, sortBy]);

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      location: '',
      dateRange: '',
      priceRange: ''
    });
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12">
        <div className="container mx-auto px-4">
          <EventsHeader />
          
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search events, categories, or locations..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 h-12"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={filters.location} onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}>
                <SelectTrigger className="w-40">
                  <MapPin className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Locations</SelectItem>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="bangalore">Bangalore</SelectItem>
                  <SelectItem value="hyderabad">Hyderabad</SelectItem>
                  <SelectItem value="pune">Pune</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="whitespace-nowrap"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {['🎭 Contests', '🎤 Concerts', '🤝 Meetups', '🎓 Cultural Fests', '🎬 Screenings', '🎨 Workshops', '🎟 Live Shows'].map((category) => {
              const categoryValue = category.split(' ')[1].toLowerCase();
              const isActive = filters.category === categoryValue;
              return (
                <Badge
                  key={category}
                  variant={isActive ? "default" : "secondary"}
                  className={`cursor-pointer transition-colors ${
                    isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary/80'
                  }`}
                  onClick={() => setFilters(prev => ({ 
                    ...prev, 
                    category: isActive ? '' : categoryValue 
                  }))}
                >
                  {category}
                </Badge>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filters Panel */}
      {showFilters && (
        <EventFilters
          filters={filters}
          setFilters={setFilters}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onClear={clearFilters}
        />
      )}

      {/* Featured Events Carousel */}
      {featuredEvents.length > 0 && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Featured Events</h2>
            <FeaturedEventsCarousel events={featuredEvents} />
          </div>
        </section>
      )}

      {/* Events Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {filteredAndSortedEvents.length > 0 
                ? `${filteredAndSortedEvents.length} Events Found`
                : 'No Events Found'
              }
            </h2>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="date">By Date</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="bg-muted h-48 rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="bg-muted h-4 mb-2 rounded"></div>
                    <div className="bg-muted h-3 mb-2 rounded w-3/4"></div>
                    <div className="bg-muted h-3 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredAndSortedEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-lg mb-4">
                No events match your search criteria
              </div>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Events;