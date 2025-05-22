
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Mock data for artists
const allArtists = [
  {
    id: 1,
    name: "Priya Sharma",
    profession: "Actress & Dancer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3",
    tags: ["Acting", "Dance", "Voice"],
    category: "performer",
    verified: true,
  },
  {
    id: 2,
    name: "Arjun Kapoor",
    profession: "Music Producer",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3",
    tags: ["Music", "Production", "Vocals"],
    category: "technical",
    verified: true,
  },
  {
    id: 3,
    name: "Zoya Patel",
    profession: "Photographer",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
    tags: ["Photography", "Direction"],
    category: "technical",
    verified: true,
  },
  {
    id: 4,
    name: "Rahul Desai",
    profession: "Director",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3",
    tags: ["Direction", "Screenplay", "Production"],
    category: "creative",
    verified: false,
  },
  {
    id: 5,
    name: "Meera Nair",
    profession: "Choreographer",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
    tags: ["Dance", "Choreography", "Direction"],
    category: "performer",
    verified: true,
  },
  {
    id: 6,
    name: "Vikram Singh",
    profession: "Sound Engineer",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3",
    tags: ["Sound", "Music", "Production"],
    category: "technical",
    verified: false,
  },
  {
    id: 7,
    name: "Ananya Das",
    profession: "Costume Designer",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3",
    tags: ["Fashion", "Design", "Styling"],
    category: "creative",
    verified: true,
  },
  {
    id: 8,
    name: "Sameer Khanna",
    profession: "Actor",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3",
    tags: ["Acting", "Voice", "Theater"],
    category: "performer",
    verified: true,
  },
];

const Artists = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState("all");
  
  // Extract unique tags from all artists
  const uniqueTags = Array.from(
    new Set(allArtists.flatMap((artist) => artist.tags))
  ).sort();
  
  // Filter artists based on search term, selected tags, and current tab
  const filteredArtists = allArtists.filter((artist) => {
    const matchesSearch = 
      artist.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      artist.profession.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTags = 
      selectedTags.length === 0 || 
      selectedTags.some((tag) => artist.tags.includes(tag));
    
    const matchesCategory = 
      currentTab === "all" || artist.category === currentTab;
    
    return matchesSearch && matchesTags && matchesCategory;
  });
  
  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Header Section */}
        <section className="bg-maasta-purple/10 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Discover Artists</h1>
            <p className="text-lg text-gray-600 mb-8">
              Connect with talented professionals from across the media industry
            </p>
            
            {/* Search and filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search by name or profession..."
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
        
        {/* Artists Listing */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category tabs */}
            <Tabs defaultValue="all" className="mb-8" onValueChange={setCurrentTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Artists</TabsTrigger>
                <TabsTrigger value="performer">Performers</TabsTrigger>
                <TabsTrigger value="creative">Creative</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* Tags filter */}
            <div className="mb-8">
              <h3 className="text-sm font-medium mb-2">Filter by skills:</h3>
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
            
            {/* Results display */}
            <div>
              <p className="text-sm text-gray-500 mb-4">
                Showing {filteredArtists.length} artists
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredArtists.map((artist) => (
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
                      <Button variant="outline" className="w-full mt-4 border-maasta-orange text-maasta-orange hover:bg-maasta-orange/5">
                        View Profile
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {filteredArtists.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No artists found</h3>
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

export default Artists;
