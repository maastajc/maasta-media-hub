import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton"; 
import { MapPin, Calendar, Clock, Users, DollarSign, Briefcase, Search, Filter } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

// Audition categories
const CATEGORIES = [
  { value: "all", label: "All Categories" },
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

interface AuditionData {
  audition_date: string;
  compensation: string;
  created_at: string;
  creator_id: string;
  deadline: string;
  description: string;
  id: string;
  location: string;
  project_details: string;
  requirements: string;
  status: string;
  title: string;
  updated_at: string;
  creator_profile: {
    full_name: string;
  };
  tags?: string[] | null;
  category?: string | null;
  age_range?: string | null;
  gender?: string | null;
  experience_level?: string | null;
}

const Auditions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [auditions, setAuditions] = useState<AuditionData[]>([]);
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
          throw error;
        }
        
        if (data && data.length > 0) {
          const processedAuditions = data.map(item => ({
            ...item,
            tags: item.tags || [],
            category: item.category || null,
            age_range: item.age_range || null,
            gender: item.gender || null,
            experience_level: item.experience_level || null
          }));
          
          setAuditions(processedAuditions);
          
          const allTags = processedAuditions
            .flatMap(audition => audition.tags || [])
            .filter(Boolean);
          
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

  const handleViewDetails = (auditionId: string) => {
    navigate(`/auditions/${auditionId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-maasta-purple to-maasta-orange py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Next Role</h1>
              <p className="text-xl mb-8 opacity-90">
                Discover genuine casting opportunities from verified production houses
              </p>
              <Button 
                onClick={handlePostAudition}
                variant="outline"
                className="bg-white text-maasta-purple border-white hover:bg-gray-100 font-semibold px-8 py-3"
              >
                Post an Audition
              </Button>
            </div>
            
            {/* Search */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by title, description, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 py-4 text-lg bg-white border-0 shadow-lg rounded-xl"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Auditions Listing */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category tabs */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <Tabs defaultValue="all" onValueChange={setCurrentTab}>
                <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 h-auto p-1 bg-gray-100">
                  {CATEGORIES.map(category => (
                    <TabsTrigger 
                      key={category.value} 
                      value={category.value}
                      className="data-[state=active]:bg-maasta-purple data-[state=active]:text-white py-3 px-4 text-sm"
                    >
                      {category.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            
            {/* Filters and sorting */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <h3 className="text-sm font-semibold text-gray-700">Filter by Skills:</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {isLoading ? (
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
                            ? "bg-maasta-purple hover:bg-maasta-purple/90 text-white" 
                            : "hover:bg-maasta-purple/10 hover:text-maasta-purple hover:border-maasta-purple"
                          }
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </Button>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No skills found</p>
                    )}
                  </div>
                </div>
                
                <div className="w-full lg:w-48">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Sort by:</h3>
                  <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="deadline">Closest Deadline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Results */}
            <div className="mb-6">
              <p className="text-lg font-medium text-gray-700">
                {isLoading 
                  ? "Loading auditions..." 
                  : `${filteredAuditions.length} audition${filteredAuditions.length !== 1 ? 's' : ''} found`
                }
              </p>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <Card key={i} className="overflow-hidden shadow-md">
                    <div className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-3" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <div className="space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                      <Skeleton className="h-10 w-full mt-6" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAuditions.map((audition) => {
                  const today = new Date();
                  const deadline = audition.deadline ? new Date(audition.deadline) : null;
                  const daysRemaining = deadline 
                    ? Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                    : null;
                  
                  const isDeadlineUrgent = daysRemaining !== null && daysRemaining <= 5;
                  
                  return (
                    <Card 
                      key={audition.id} 
                      className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-0 shadow-md"
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-maasta-purple/10 rounded-lg">
                              <Briefcase className="w-4 h-4 text-maasta-purple" />
                            </div>
                            {audition.category && (
                              <Badge className="bg-maasta-purple/10 text-maasta-purple font-medium">
                                {audition.category}
                              </Badge>
                            )}
                          </div>
                          {isDeadlineUrgent && (
                            <Badge variant="destructive" className="animate-pulse">Urgent</Badge>
                          )}
                        </div>
                        
                        <h3 className="font-bold text-xl mb-2 line-clamp-2 text-gray-900">{audition.title}</h3>
                        
                        {audition.creator_profile && (
                          <p className="text-maasta-purple font-medium text-sm mb-4">
                            by {audition.creator_profile.full_name}
                          </p>
                        )}
                        
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-3 text-maasta-orange flex-shrink-0" />
                            <span className="font-medium">{audition.location}</span>
                          </div>
                          
                          {audition.audition_date && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-4 h-4 mr-3 text-maasta-purple flex-shrink-0" />
                              <span className="font-medium">{format(new Date(audition.audition_date), 'MMM dd, yyyy')}</span>
                            </div>
                          )}
                          
                          {audition.experience_level && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Users className="w-4 h-4 mr-3 text-maasta-purple flex-shrink-0" />
                              <span className="capitalize font-medium">{audition.experience_level} level</span>
                            </div>
                          )}
                          
                          {audition.compensation && (
                            <div className="flex items-center text-sm text-green-700">
                              <DollarSign className="w-4 h-4 mr-3 text-green-600 flex-shrink-0" />
                              <span className="font-medium">{audition.compensation}</span>
                            </div>
                          )}
                        </div>
                        
                        {audition.requirements && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-600 line-clamp-2">{audition.requirements}</p>
                          </div>
                        )}
                        
                        {audition.tags && audition.tags.length > 0 && (
                          <div className="mb-6 flex flex-wrap gap-1">
                            {audition.tags.slice(0, 3).map((tag, idx) => (
                              <span 
                                key={idx} 
                                className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-medium text-gray-700"
                              >
                                {tag}
                              </span>
                            ))}
                            {audition.tags.length > 3 && (
                              <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-medium text-gray-700">
                                +{audition.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-sm">
                            {deadline ? (
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2 text-maasta-orange" />
                                <span className={`font-medium ${isDeadlineUrgent ? "text-red-600" : "text-gray-600"}`}>
                                  {daysRemaining} days left
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-600">Open until filled</span>
                            )}
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => handleViewDetails(audition.id)}
                          className="w-full bg-gradient-to-r from-maasta-purple to-maasta-orange hover:from-maasta-purple/90 hover:to-maasta-orange/90 text-white font-semibold py-3 rounded-lg transition-all duration-300"
                        >
                          View Details & Apply
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
            
            {!isLoading && filteredAuditions.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl shadow-md">
                <div className="p-8">
                  <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">No auditions found</h3>
                  <p className="text-gray-500 mb-6">Try adjusting your search criteria or filters</p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedTags([]);
                      setCurrentTab("all");
                    }}
                    className="mr-4"
                  >
                    Clear filters
                  </Button>
                  <Button 
                    onClick={handlePostAudition}
                    className="bg-gradient-to-r from-maasta-purple to-maasta-orange hover:from-maasta-purple/90 hover:to-maasta-orange/90"
                  >
                    Post an Audition
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Auditions;
