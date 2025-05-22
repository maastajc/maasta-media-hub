
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Mock data for upcoming events
const upcomingEvents = [
  {
    id: 1,
    title: "Master Class with Filmmaking Legends",
    organizer: "Film Academy India",
    date: "2025-06-15",
    time: "10:00 AM - 4:00 PM",
    location: "Mumbai Film City",
    image: "https://images.unsplash.com/photo-1581905764498-f1b60bae941a?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3",
    category: "Workshop",
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
    category: "Course",
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
    category: "Contest",
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
    category: "Workshop",
    tags: ["Photography", "Outdoor"],
  },
];

const UpcomingEvents = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Upcoming Events</h2>
          <Link to="/events">
            <Button variant="ghost" className="text-maasta-purple hover:text-maasta-purple/90 hover:bg-maasta-purple/10">
              View all events
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {upcomingEvents.map((event) => {
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
                      {event.category}
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
                  
                  <Link to={`/events/${event.id}`}>
                    <Button variant="outline" className="w-full mt-4 border-maasta-orange text-maasta-orange hover:bg-maasta-orange/5">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
