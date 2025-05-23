
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton"; 
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// A more realistic placeholder image
const DEFAULT_COVER = "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?q=80&w=320";

// Audition categories
const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "acting", label: "Acting" },
  { value: "voiceover", label: "Voiceover" },
  { value: "dancing", label: "Dancing" },
  { value: "singing", label: "Singing" },
  { value: "modeling", label: "Modeling" },
  { value: "music", label: "Music" },
  { value: "direction", label: "Direction" },
  { value: "production", label: "Production" },
  { value: "other", label: "Other" }
];

interface Audition {
  id: string;
  title: string;
  description: string;
  location: string;
  compensation: string | null;
  requirements: string | null;
  tags: string[] | null;
  deadline: string | null;
  cover_image_url: string | null;
  category: string | null;
  status: string;
  created_at: string;
  age_range?: string | null;
  gender?: string | null;
  experience_level?: string | null;
  creator_profile?: {
    full_name: string;
    profile_picture_url: string | null;
  }
}

const Auditions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [auditions, setAuditions] = useState<Audition[]>([]);
  const [uniqueTags, setUniqueTags] = useState<string[]>([]);
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast: uiToast } = useToast();

  // Fetch auditions from Supabase
  useEffect(() => {
    const fetchAuditions = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('auditions')
          .select(`
            *,
            creator_profile:profiles(full_name, profile_picture_url)
          `)
          .eq('status', 'open')
          .order('created_at', { ascending: false });
        
        if (error) {
          // If we get an error about missing columns, we need to handle it gracefully
          if (error.message?.includes("column 'tags' does not exist") || 
              error.message?.includes("column 'cover_image_url' does not exist") ||
              error.message?.includes("column 'category' does not exist")) {
            
            console.warn("Using fallback query for auditions due to missing columns:", error.message);
            
            // Fallback query without the new columns
            const { data: fallbackData, error: fallbackError } = await supabase
              .from('auditions')
              .select(`
                id,
                title,
                description,
                location,
                compensation,
                requirements,
                deadline,
                status,
                created_at,
                creator_id,
                creator_profile:profiles(full_name, profile_picture_url)
              `)
              .eq('status', 'open')
              .order('created_at', { ascending: false });
              
            if (fallbackError) throw fallbackError;
            
            // Transform the data to match our component's expected format
            const processedAuditions = fallbackData?.map(item => ({
              ...item,
              tags: [] as string[], // Empty array as fallback
              cover_image_url: null, // Null as fallback
              category: null, // Null as fallback
              age_range: null,
              gender: null,
              experience_level: null
            })) || [];
            
            setAuditions(processedAuditions);
            setUniqueTags([]);
            setIsLoading(false);
            return;
          } else {
            throw error;
          }
        }
        
        // Process the audition data
        if (data && data.length > 0) {
          // Add default values for potentially missing fields
          const processedAuditions = data.map(item => ({
            ...item,
            tags: item.tags || [],
            cover_image_url: item.cover_image_url || null,
            category: item.category || null,
            age_range: item.age_range || null,
            gender: item.gender || null,
            experience_level: item.experience_level || null
          }));
          
          setAuditions(processedAuditions);
          
          // Extract all tags to create a unique set
          const allTags = processedAuditions
            .flatMap(audition => audition.tags || [])
            .filter(Boolean); // Filter out any undefined or null values
          
          const uniqueTagsSet = Array.from(new Set(allTags)).sort();
          setUniqueTags(uniqueTagsSet);
        } else {
          setAuditions([]);
          setUniqueTags([]);
        }
      } catch (error: any) {
        console.error('Error fetching auditions:', error);
        toast.error("Failed to load auditions");
        setAuditions([]);
        setUniqueTags([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAuditions();
  }, []);
  
  // Filter and sort auditions
  const filteredAuditions = auditions
    .filter((audition) => {
      const matchesSearch = 
        audition.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (audition.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (audition.location || "").toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTags = 
        selectedTags.length === 0 || 
        (audition.tags && selectedTags.some(tag => audition.tags?.includes(tag)));
      
      const matchesCategory = 
        currentTab === "all" || 
        (audition.category?.toLowerCase() === currentTab);
      
      return matchesSearch && matchesTags && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOption === "deadline" && a.deadline && b.deadline) {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      } else if (sortOption === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
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
      uiToast({
        title: "Sign in required",
        description: "You need to sign in to post an audition",
        variant: "default",
      });
      navigate("/sign-in");
      return;
    }
    navigate("/auditions/create");
  };

  const handleApplyNow = (auditionId: string) => {
    if (!user) {
      uiToast({
        title: "Sign in required",
        description: "You need to sign in to apply for auditions",
        variant: "default",
      });
      navigate("/sign-in");
      return;
    }
    
    // Navigate to details page with correct ID
    navigate(`/auditions/${auditionId}`);
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
                  placeholder="Search auditions by title, description, or location..."
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
              <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-10">
                {CATEGORIES.map(category => (
                  <TabsTrigger key={category.value} value={category.value}>
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            
            {/* Tags filter and sorting */}
            <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
              <div className="flex-1">
                <h3 className="text-sm font-medium mb-2">Filter by tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {isLoading ? (
                    // Skeleton loading for tags
                    Array(8).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-8 w-20 rounded-full" />
                    ))
                  ) : uniqueTags.length > 0 ? (
                    uniqueTags.map((tag) => (
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
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No tags found</p>
                  )}
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
                {isLoading 
                  ? "Loading auditions..." 
                  : `Showing ${filteredAuditions.length} audition call${filteredAuditions.length !== 1 ? 's' : ''}`
                }
              </p>
              
              {isLoading ? (
                // Skeleton loading for audition cards
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array(6).fill(0).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="h-32 w-full" />
                      <div className="p-5">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-4" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                        <div className="flex justify-between mt-4">
                          <Skeleton className="h-4 w-1/3" />
                          <Skeleton className="h-8 w-24" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAuditions.map((audition) => {
                    // Calculate days remaining until deadline
                    const today = new Date();
                    const deadline = audition.deadline ? new Date(audition.deadline) : null;
                    const daysRemaining = deadline 
                      ? Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                      : null;
                    
                    // Check if the deadline is urgent (5 days or less)
                    const isDeadlineUrgent = daysRemaining !== null && daysRemaining <= 5;
                    
                    return (
                      <Card 
                        key={audition.id} 
                        className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                      >
                        {/* Cover image */}
                        <div className="h-32 overflow-hidden relative">
                          <img
                            src={audition.cover_image_url || DEFAULT_COVER}
                            alt={audition.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = DEFAULT_COVER;
                            }}
                          />
                          {/* Category badge */}
                          {audition.category && (
                            <Badge className="absolute top-2 left-2 bg-white/80 text-maasta-purple">
                              {audition.category}
                            </Badge>
                          )}
                        </div>
                        
                        <CardContent className="p-5">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-lg">{audition.title}</h3>
                            {isDeadlineUrgent && (
                              <Badge variant="destructive">Urgent</Badge>
                            )}
                          </div>
                          
                          {/* Creator info if available */}
                          {audition.creator_profile && (
                            <p className="text-maasta-purple font-medium text-sm mt-1">
                              {audition.creator_profile.full_name}
                            </p>
                          )}
                          
                          <div className="mt-3 flex items-center text-sm text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                            {audition.location}
                          </div>
                          
                          {audition.requirements && (
                            <div className="mt-2 text-sm">
                              <p className="font-medium">Requirements:</p>
                              <p className="text-gray-600 line-clamp-2">{audition.requirements}</p>
                            </div>
                          )}
                          
                          {audition.tags && audition.tags.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-1">
                              {audition.tags.slice(0, 3).map((tag, idx) => (
                                <span 
                                  key={idx} 
                                  className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs font-medium text-gray-700"
                                >
                                  {tag}
                                </span>
                              ))}
                              {audition.tags.length > 3 && (
                                <span className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs font-medium text-gray-700">
                                  +{audition.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                          
                          <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm">
                              {deadline ? (
                                <>
                                  <span className="font-medium">Deadline:</span> 
                                  <span className={`ml-1 ${isDeadlineUrgent ? "text-red-500" : "text-gray-600"}`}>
                                    {daysRemaining} days left
                                  </span>
                                </>
                              ) : (
                                <span className="text-gray-600">Open until filled</span>
                              )}
                            </div>
                            <Button 
                              size="sm" 
                              className="bg-maasta-purple hover:bg-maasta-purple/90"
                              onClick={() => handleApplyNow(audition.id)}
                            >
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
              
              {!isLoading && filteredAuditions.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">No audition calls found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedTags([]);
                      setCurrentTab("all");
                    }}
                  >
                    Clear filters
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

export default Auditions;
