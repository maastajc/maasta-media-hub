
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Mock data for events
const allEvents = [
  {
    id: 1,
    title: "Master Class with Filmmaking Legends",
    organizer: "Film Academy India",
    date: "2025-06-15",
    time: "10:00 AM - 4:00 PM",
    location: "Mumbai Film City",
    image: "https://images.unsplash.com/photo-1581905764498-f1b60bae941a?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3",
    category: "workshop",
    tags: ["Direction", "Filmmaking", "Masterclass"],
  },
  {
    id: 2,
    title: "Music Production Intensive Course",
    organizer: "Rhythm Studios",
    date: "2025-06-20",
    time: "Weekends for 4 weeks",
    location: "Online",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3",
    category: "course",
    tags: ["Music", "Production", "Online"],
  },
  {
    id: 3,
    title: "National Dance Competition 2025",
    organizer: "Dance India Dance",
    date: "2025-07-10",
    time: "9:00 AM onwards",
    location: "Delhi Convention Center",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3",
    category: "contest",
    tags: ["Dance", "Competition", "Performance"],
  },
  {
    id: 4,
    title: "Photography Workshop: Natural Light",
    organizer: "Capture Collective",
    date: "2025-06-25",
    time: "2:00 PM - 6:00 PM",
    location: "Bangalore",
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3",
    category: "workshop",
    tags: ["Photography", "Outdoor"],
  },
  {
    id: 5,
    title: "Documentary Filmmaking Course",
    organizer: "Documentary Guild",
    date: "2025-07-05",
    time: "10:00 AM - 1:00 PM",
    location: "Chennai Film Institute",
    image: "https://images.unsplash.com/photo-1601710208082-16673411d2bc?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3",
    category: "course",
    tags: ["Documentary", "Filmmaking", "Storytelling"],
  },
  {
    id: 6,
    title: "Classical Music Concert Series",
    organizer: "Harmony Foundation",
    date: "2025-07-15",
    time: "6:30 PM onwards",
    location: "National Centre for Performing Arts, Mumbai",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    category: "concert",
    tags: ["Music", "Classical", "Live Performance"],
  },
  {
    id: 7,
    title: "Annual Art & Photography Exhibition",
    organizer: "Creative Minds Gallery",
    date: "2025-06-30",
    time: "11:00 AM - 8:00 PM",
    location: "Lalit Kala Akademi, New Delhi",
    image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    category: "event",
    tags: ["Art", "Photography", "Exhibition"],
  },
  {
    id: 8,
    title: "Scriptwriting Workshop with Industry Experts",
    organizer: "Screenplay Association",
    date: "2025-07-08",
    time: "11:00 AM - 5:00 PM",
    location: "Hyderabad",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3",
    category: "workshop",
    tags: ["Writing", "Screenplay", "Film"],
  },
];

const Events = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState("all");
  const [sortOption, setSortOption] = useState("upcoming");
  const navigate = useNavigate();
  
  // Extract unique tags from all events
  const uniqueTags = Array.from(
    new Set(allEvents.flatMap((event) => event.tags))
  ).sort();
  
  // Filter and sort events
  const filteredEvents = allEvents
    .filter((event) => {
      const matchesSearch = 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        event.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTags = 
        selectedTags.length === 0 || 
        selectedTags.some((tag) => event.tags.includes(tag));
      
      const matchesCategory = 
        currentTab === "all" || event.category === currentTab;
      
      return matchesSearch && matchesTags && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOption === "upcoming") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      return 0;
    });
  
  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleCreateEvent = () => {
    navigate("/events/create");
  };

  const handleViewEventDetails = (eventId: number) => {
    navigate(`/events/${eventId}`);
  };

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
            
            {/* Search and filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search events by title, organizer, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="hidden md:block">
                <Button className="bg-maasta-orange hover:bg-maasta-orange/90">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Events Listing */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category tabs */}
            <Tabs defaultValue="all" className="mb-8" onValueChange={setCurrentTab}>
              <TabsList className="grid grid-cols-4 lg:grid-cols-7">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="workshop">Workshops</TabsTrigger>
                <TabsTrigger value="course">Courses</TabsTrigger>
                <TabsTrigger value="contest">Contests</TabsTrigger>
                <TabsTrigger value="concert">Concerts</TabsTrigger>
                <TabsTrigger value="event">Events</TabsTrigger>
                <TabsTrigger value="audition">Auditions</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* Tags filter and sorting */}
            <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
              <div className="flex-1">
                <h3 className="text-sm font-medium mb-2">Filter by tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {uniqueTags.map((tag) => (
                    <Button
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      size="sm"
                      className={selectedTags.includes(tag) 
                        ? "bg-maasta-purple hover:bg-maasta-purple/90" 
                        : "hover:bg-maasta-purple/10 hover:text-maasta-purple"
                      }
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="w-full md:w-48">
                <h3 className="text-sm font-medium mb-2">Sort by:</h3>
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Results display */}
            <div>
              <p className="text-sm text-gray-500 mb-4">
                Showing {filteredEvents.length} events
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => {
                  // Format date
                  const eventDate = new Date(event.date);
                  const formattedDate = eventDate.toLocaleDateString('en-US', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                  });
                  
                  return (
                    <Card key={event.id} className="overflow-hidden card-hover">
                      <div className="relative h-48">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <span className="event-category">
                            {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg line-clamp-2">{event.title}</h3>
                        <p className="text-maasta-purple text-sm mt-1">{event.organizer}</p>
                        
                        <div className="mt-3 flex items-center text-sm text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                          </svg>
                          {formattedDate}
                        </div>
                        
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                          </svg>
                          {event.location}
                        </div>
                        
                        <div className="mt-3 flex flex-wrap">
                          {event.tags.map((tag, idx) => (
                            <span key={idx} className="tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <Button 
                          variant="outline" 
                          className="w-full mt-4 border-maasta-orange text-maasta-orange hover:bg-maasta-orange/5"
                          onClick={() => handleViewEventDetails(event.id)}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              {filteredEvents.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No events found</h3>
                  <p className="text-gray-500">Try adjusting your search or filters</p>
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
