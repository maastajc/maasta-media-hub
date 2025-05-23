
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock data for upcoming events
const mockEvents = [
  {
    id: "1",
    title: "Film Industry Workshop",
    location: "Mumbai Film City",
    date: "June 20, 2025",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    category: "Workshop"
  },
  {
    id: "2",
    title: "Music Production Masterclass",
    location: "Bangalore Music Studio",
    date: "June 28, 2025",
    imageUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    category: "Masterclass" 
  },
  {
    id: "3",
    title: "Short Film Festival",
    location: "Chennai Convention Center",
    date: "July 5, 2025",
    imageUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    category: "Festival"
  },
];

const UpcomingEvents = () => {
  const [events, setEvents] = useState(mockEvents);
  const [loading, setLoading] = useState(false);

  // In a real implementation, you would fetch events from your API
  // useEffect(() => {
  //   const fetchEvents = async () => {
  //     setLoading(true);
  //     try {
  //       // Replace with actual API call
  //       const response = await fetch('/api/events');
  //       const data = await response.json();
  //       setEvents(data);
  //     } catch (error) {
  //       console.error('Error fetching events:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //
  //   fetchEvents();
  // }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Upcoming Events</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover workshops, masterclasses, and networking opportunities in the media industry
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <Link to={`/events/${event.id}`} key={event.id} className="block hover:no-underline">
              <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={event.imageUrl} 
                    alt={event.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                </div>
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <Badge className="bg-maasta-purple">{event.category}</Badge>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {event.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    {event.date}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link to="/events">
            <Button className="bg-maasta-purple hover:bg-maasta-purple/90">
              View All Events
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
