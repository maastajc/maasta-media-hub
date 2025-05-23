
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Mock data for auditions
const allAuditions = [
  {
    id: 1,
    title: "Lead Actress for Feature Film",
    company: "Stellar Productions",
    location: "Mumbai",
    deadline: "2025-06-15",
    requirements: "Female, 25-35 years, Hindi & English speaking",
    tags: ["Acting", "Film", "Lead Role"],
    category: "film",
    urgent: true,
    date: "2025-05-15",
  },
  {
    id: 2,
    title: "Music Composer for Web Series",
    company: "Digital Dreams",
    location: "Remote",
    deadline: "2025-06-10",
    requirements: "3+ years experience, portfolio required",
    tags: ["Music", "Composition", "Web Series"],
    category: "web",
    urgent: false,
    date: "2025-05-18",
  },
  {
    id: 3,
    title: "Dancers for Music Video",
    company: "Rhythm Productions",
    location: "Delhi",
    deadline: "2025-06-20",
    requirements: "Proficient in contemporary and hip-hop styles",
    tags: ["Dance", "Music Video", "Contemporary"],
    category: "music",
    urgent: true,
    date: "2025-05-20",
  },
  {
    id: 4,
    title: "Voice Over Artist for Animation",
    company: "Toon Studios",
    location: "Bangalore",
    deadline: "2025-06-25",
    requirements: "Versatile voice, experience in character voices preferred",
    tags: ["Voice", "Animation", "Character"],
    category: "animation",
    urgent: false,
    date: "2025-05-22",
  },
  {
    id: 5,
    title: "Camera Operator for Documentary",
    company: "Real Visions",
    location: "Chennai",
    deadline: "2025-06-18",
    requirements: "5+ years experience, own equipment preferred",
    tags: ["Camera", "Documentary", "Filming"],
    category: "film",
    urgent: false,
    date: "2025-05-23",
  },
  {
    id: 6,
    title: "Theatre Actors for Stage Play",
    company: "Stage Lights Theatre",
    location: "Kolkata",
    deadline: "2025-06-30",
    requirements: "Theatre background, available for 3 months",
    tags: ["Acting", "Theatre", "Performance"],
    category: "theatre",
    urgent: true,
    date: "2025-05-25",
  },
  {
    id: 7,
    title: "Costume Designer for Historical Drama",
    company: "Heritage Productions",
    location: "Mumbai",
    deadline: "2025-07-05",
    requirements: "Knowledge of historical costumes, portfolio required",
    tags: ["Fashion", "Costume", "Design"],
    category: "film",
    urgent: false,
    date: "2025-05-26",
  },
  {
    id: 8,
    title: "Background Dancers for Award Show",
    company: "Star Events",
    location: "Multiple Cities",
    deadline: "2025-07-10",
    requirements: "High energy, quick learner, previous stage experience",
    tags: ["Dance", "Live Performance", "Event"],
    category: "events",
    urgent: true,
    date: "2025-05-27",
  },
];

const Auditions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Extract unique tags from all auditions
  const uniqueTags = Array.from(
    new Set(allAuditions.flatMap((audition) => audition.tags))
  ).sort();
  
  // Filter and sort auditions
  const filteredAuditions = allAuditions
    .filter((audition) => {
      const matchesSearch = 
        audition.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        audition.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        audition.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTags = 
        selectedTags.length === 0 || 
        selectedTags.some((tag) => audition.tags.includes(tag));
      
      const matchesCategory = 
        currentTab === "all" || audition.category === currentTab;
      
      return matchesSearch && matchesTags && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOption === "deadline") {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      } else if (sortOption === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
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

  const handlePostAudition = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "You need to sign in to post an audition",
        variant: "default",
      });
      navigate("/sign-in");
      return;
    }
    navigate("/auditions/create");
  };

  const handleApplyNow = (auditionId: number) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "You need to sign in to apply for auditions",
        variant: "default",
      });
      navigate("/sign-in");
      return;
    }
    
    // In a real application, you would navigate to an application form
    // or submit an application directly
    toast({
      title: "Application submitted",
      description: "Your application has been received. Check your dashboard for updates.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Header Section */}
        <section className="bg-maasta-orange/10 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Audition Calls</h1>
                <p className="text-lg text-gray-600">
                  Find genuine casting opportunities from verified production houses
                </p>
              </div>
              <Button 
                className="bg-maasta-purple hover:bg-maasta-purple/90"
                onClick={handlePostAudition}
              >
                Post an Audition
              </Button>
            </div>
            
            {/* Search and filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search auditions by title, company, or location..."
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
        
        {/* Auditions Listing */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category tabs */}
            <Tabs defaultValue="all" className="mb-8" onValueChange={setCurrentTab}>
              <TabsList className="grid grid-cols-4 lg:grid-cols-7">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="film">Film</TabsTrigger>
                <TabsTrigger value="web">Web Series</TabsTrigger>
                <TabsTrigger value="music">Music</TabsTrigger>
                <TabsTrigger value="animation">Animation</TabsTrigger>
                <TabsTrigger value="theatre">Theatre</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
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
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="deadline">Closest Deadline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Results display */}
            <div>
              <p className="text-sm text-gray-500 mb-4">
                Showing {filteredAuditions.length} audition calls
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAuditions.map((audition) => {
                  // Calculate days remaining until deadline
                  const today = new Date();
                  const deadline = new Date(audition.deadline);
                  const daysRemaining = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <Card key={audition.id} className="card-hover">
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-lg">{audition.title}</h3>
                          {audition.urgent && (
                            <Badge className="bg-red-500">Urgent</Badge>
                          )}
                        </div>
                        <p className="text-maasta-purple font-medium text-sm mt-1">{audition.company}</p>
                        
                        <div className="mt-3 flex items-center text-sm text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                          </svg>
                          {audition.location}
                        </div>
                        
                        <div className="mt-2 text-sm">
                          <p className="font-medium">Requirements:</p>
                          <p className="text-gray-600">{audition.requirements}</p>
                        </div>
                        
                        <div className="mt-4 flex flex-wrap">
                          {audition.tags.map((tag, idx) => (
                            <span key={idx} className="tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-sm">
                            <span className="font-medium">Deadline:</span> 
                            <span className={`ml-1 ${daysRemaining <= 5 ? "text-red-500" : "text-gray-600"}`}>
                              {daysRemaining} days left
                            </span>
                          </div>
                          <Button 
                            size="sm" 
                            className="bg-maasta-purple hover:bg-maasta-purple/90"
                            onClick={() => handleApplyNow(audition.id)}
                          >
                            Apply Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              {filteredAuditions.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No audition calls found</h3>
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

export default Auditions;
