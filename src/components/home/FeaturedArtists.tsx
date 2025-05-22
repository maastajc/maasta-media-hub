
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Mock data for featured artists
const featuredArtists = [
  {
    id: 1,
    name: "Priya Sharma",
    profession: "Actress & Dancer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3",
    tags: ["Acting", "Dance", "Voice"],
    verified: true,
  },
  {
    id: 2,
    name: "Arjun Kapoor",
    profession: "Music Producer",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3",
    tags: ["Music", "Production", "Vocals"],
    verified: true,
  },
  {
    id: 3,
    name: "Zoya Patel",
    profession: "Photographer",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
    tags: ["Photography", "Direction"],
    verified: true,
  },
  {
    id: 4,
    name: "Rahul Desai",
    profession: "Director",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3",
    tags: ["Direction", "Screenplay", "Production"],
    verified: false,
  },
];

const FeaturedArtists = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Featured Artists</h2>
          <Link to="/artists">
            <Button variant="ghost" className="text-maasta-purple hover:text-maasta-purple/90 hover:bg-maasta-purple/10">
              View all artists
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredArtists.map((artist) => (
            <Card key={artist.id} className="overflow-hidden card-hover">
              <div className="relative h-64">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
                {artist.verified && (
                  <div className="absolute top-2 right-2 bg-maasta-purple text-white text-xs p-1 px-2 rounded-full flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                    </svg>
                    Verified
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">{artist.name}</h3>
                <p className="text-gray-500 text-sm mb-3">{artist.profession}</p>
                <div className="flex flex-wrap">
                  {artist.tags.map((tag, idx) => (
                    <span key={idx} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link to={`/artists/${artist.id}`}>
                  <Button variant="outline" className="w-full mt-4 border-maasta-orange text-maasta-orange hover:bg-maasta-orange/5">
                    View Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedArtists;
