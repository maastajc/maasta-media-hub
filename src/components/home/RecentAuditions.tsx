import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton"; 
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Default cover image
const DEFAULT_COVER = "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?q=80&w=320";

interface Audition {
  id: string;
  title: string;
  location: string;
  deadline: string | null;
  requirements: string | null;
  tags: string[] | null;
  urgent: boolean;
  cover_image_url: string | null;
  company: string;
}

const RecentAuditions = () => {
  const [auditions, setAuditions] = useState<Audition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentAuditions = async () => {
      try {
        // Proceed with the main query
        const { data, error } = await supabase
          .from('auditions')
          .select(`
            id,
            title,
            location,
            deadline,
            requirements,
            tags,
            cover_image_url,
            creator_id,
            profiles:profiles(full_name)
          `)
          .eq('status', 'open')
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) {
          // Check if the error is specifically about missing columns
          if (error.message?.includes("column 'tags' does not exist") || 
              error.message?.includes("column 'cover_image_url' does not exist")) {
            console.warn("Using fallback query for auditions due to missing columns:", error.message);
            
            // Fallback query without the new columns
            const { data: fallbackData, error: fallbackError } = await supabase
              .from('auditions')
              .select(`
                id,
                title,
                location,
                deadline,
                requirements,
                creator_id,
                profiles:profiles(full_name)
              `)
              .eq('status', 'open')
              .order('created_at', { ascending: false })
              .limit(3);
              
            if (fallbackError) {
              console.error("Fallback query also failed:", fallbackError);
              throw fallbackError;
            }
            
            if (fallbackData) {
              // Transform the data to match our component's expected format
              const formattedAuditions = fallbackData.map(item => ({
                id: item.id,
                title: item.title,
                location: item.location,
                deadline: item.deadline,
                requirements: item.requirements,
                tags: [] as string[], // Empty array as fallback
                urgent: item.deadline ? isUrgent(item.deadline) : false,
                cover_image_url: null, // Null as fallback
                company: item.profiles?.full_name || 'Unknown Company'
              }));
              
              setAuditions(formattedAuditions);
            } else {
              setAuditions([]);
            }
          } else {
            // Handle other types of errors
            throw error;
          }
        } else if (data) {
          // Transform the data to match our component's expected format
          const formattedAuditions = data.map(item => ({
            id: item.id,
            title: item.title,
            location: item.location,
            deadline: item.deadline,
            requirements: item.requirements,
            tags: item.tags || [],
            urgent: item.deadline ? isUrgent(item.deadline) : false,
            cover_image_url: item.cover_image_url,
            company: item.profiles?.full_name || 'Unknown Company'
          }));

          setAuditions(formattedAuditions);
        } else {
          setAuditions([]);
        }
      } catch (error) {
        console.error("Error fetching recent auditions:", error);
        toast.error("Failed to load recent auditions");
        setAuditions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentAuditions();
  }, []);

  // Helper function to determine if a deadline is urgent (within 5 days)
  const isUrgent = (deadlineStr: string): boolean => {
    const today = new Date();
    const deadline = new Date(deadlineStr);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 5;
  };

  // Calculate days remaining until deadline
  const getDaysRemaining = (deadlineStr: string | null): number | null => {
    if (!deadlineStr) return null;
    
    const today = new Date();
    const deadline = new Date(deadlineStr);
    const diffTime = deadline.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Recent Audition Calls</h2>
          <Link to="/auditions">
            <Button variant="ghost" className="text-maasta-purple hover:text-maasta-purple/90 hover:bg-maasta-purple/10">
              View all auditions
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            // Skeleton loading states
            Array(3).fill(0).map((_, i) => (
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
            ))
          ) : auditions.length > 0 ? (
            auditions.map((audition) => {
              const daysRemaining = getDaysRemaining(audition.deadline);
              
              return (
                <Card key={audition.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {/* Cover image */}
                  <div className="h-32 overflow-hidden">
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
                  </div>
                  
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
                        {daysRemaining !== null ? (
                          <>
                            <span className="font-medium">Deadline:</span> 
                            <span className={`ml-1 ${daysRemaining <= 5 ? "text-red-500" : "text-gray-600"}`}>
                              {daysRemaining} days left
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-600">Open until filled</span>
                        )}
                      </div>
                      <Link to={`/auditions/${audition.id}`}>
                        <Button size="sm" className="bg-maasta-purple hover:bg-maasta-purple/90">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-12">
              <h3 className="text-lg font-medium mb-1">No auditions available</h3>
              <p className="text-gray-500 mb-4">Check back soon for new opportunities</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RecentAuditions;
