
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PlusCircle, Calendar, Users, ClipboardList, FileText, AlertCircle } from "lucide-react";

const Dashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEvents, setUserEvents] = useState<any[]>([]);
  const [userAuditions, setUserAuditions] = useState<any[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);
  const [auditionApplications, setAuditionApplications] = useState<any[]>([]);
  
  useEffect(() => {
    if (!user) {
      navigate("/sign-in");
      return;
    }
    
    fetchUserData();
  }, [user, navigate]);

  const fetchUserData = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching dashboard data for user:', user.id);
      
      // Use Promise.allSettled to handle partial failures gracefully
      const results = await Promise.allSettled([
        fetchUserEvents(),
        fetchUserAuditions(),
        fetchRegisteredEvents(),
        fetchAuditionApplications()
      ]);

      // Check if any critical operations failed
      const failures = results.filter(result => result.status === 'rejected');
      if (failures.length > 0) {
        console.warn('Some dashboard data failed to load:', failures);
        // Still continue with partial data rather than failing completely
      }

    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Please try refreshing the page.");
      toast({
        title: "Error",
        description: "Some dashboard data may not be available",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserEvents = async () => {
    try {
      console.log('Fetching user events...');
      const { data, error } = await supabase
        .from("events")
        .select("id, title, event_date, location, created_at, status")
        .eq("creator_id", user!.id)
        .order('created_at', { ascending: false })
        .limit(10); // Limit results for better performance
        
      if (error) throw error;
      setUserEvents(data || []);
    } catch (error: any) {
      console.error("Error fetching user events:", error);
      setUserEvents([]);
    }
  };

  const fetchUserAuditions = async () => {
    try {
      console.log('Fetching user auditions...');
      const { data, error } = await supabase
        .from("auditions")
        .select("id, title, status, created_at, location, deadline, description")
        .eq("creator_id", user!.id)
        .order('created_at', { ascending: false })
        .limit(10); // Limit results for better performance
        
      if (error) throw error;
      setUserAuditions(data || []);
    } catch (error: any) {
      console.error("Error fetching user auditions:", error);
      setUserAuditions([]);
    }
  };

  const fetchRegisteredEvents = async () => {
    try {
      console.log('Fetching registered events...');
      const { data, error } = await supabase
        .from("event_attendees")
        .select(`
          id,
          attendance_status,
          registered_at,
          event_id,
          events!inner(
            id,
            title,
            event_date,
            location
          )
        `)
        .eq("user_id", user!.id)
        .order('registered_at', { ascending: false })
        .limit(10); // Limit results for better performance
        
      if (error) throw error;
      setRegisteredEvents(data || []);
    } catch (error: any) {
      console.error("Error fetching registered events:", error);
      setRegisteredEvents([]);
    }
  };

  const fetchAuditionApplications = async () => {
    try {
      console.log('Fetching audition applications...');
      const { data, error } = await supabase
        .from("audition_applications")
        .select(`
          id,
          status,
          application_date,
          audition_id,
          notes,
          auditions!inner(
            id,
            title,
            location
          )
        `)
        .eq("artist_id", user!.id)
        .order('application_date', { ascending: false })
        .limit(10); // Limit results for better performance
        
      if (error) throw error;
      setAuditionApplications(data || []);
    } catch (error: any) {
      console.error("Error fetching audition applications:", error);
      setAuditionApplications([]);
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // If there's a critical error, show error state
  if (error && isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-6 text-center">
              <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
              <h2 className="text-xl font-semibold mb-2">Dashboard Unavailable</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={fetchUserData} className="w-full">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">My Dashboard</h1>
            <p className="text-gray-500 mt-2">Manage your events, auditions, and applications</p>
          </header>

          {/* Show partial error if some data failed to load */}
          {error && !isLoading && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Some dashboard data may not be up to date. <Button variant="link" onClick={fetchUserData} className="p-0 h-auto">Refresh</Button>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-maasta-orange/10 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-maasta-orange" />
                </div>
                <h3 className="font-medium text-lg mb-1">My Events</h3>
                <p className="text-3xl font-bold">{isLoading ? "-" : userEvents.length}</p>
                <Button 
                  onClick={() => navigate("/events/create")} 
                  className="mt-4 bg-maasta-orange hover:bg-maasta-orange/90 w-full"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Event
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-maasta-purple/10 flex items-center justify-center mb-4">
                  <ClipboardList className="h-6 w-6 text-maasta-purple" />
                </div>
                <h3 className="font-medium text-lg mb-1">My Auditions</h3>
                <p className="text-3xl font-bold">{isLoading ? "-" : userAuditions.length}</p>
                <Button 
                  onClick={() => navigate("/auditions/create")} 
                  className="mt-4 bg-maasta-purple hover:bg-maasta-purple/90 w-full"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Post Audition
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-medium text-lg mb-1">Participations</h3>
                <p className="text-3xl font-bold">
                  {isLoading ? "-" : registeredEvents.length + auditionApplications.length}
                </p>
                {profile?.role === 'recruiter' ? (
                  <Button 
                    onClick={() => navigate("/auditions/applications")} 
                    variant="outline"
                    className="mt-4 border-green-600 text-green-600 hover:bg-green-50 w-full"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    View Applications
                  </Button>
                ) : (
                  <Button 
                    onClick={() => navigate("/artists")} 
                    variant="outline"
                    className="mt-4 border-green-600 text-green-600 hover:bg-green-50 w-full"
                  >
                    View Artists
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="events" className="mt-6">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="events">My Events</TabsTrigger>
              <TabsTrigger value="auditions">My Auditions</TabsTrigger>
              <TabsTrigger value="registered">Registered Events</TabsTrigger>
              <TabsTrigger value="applications">Audition Applications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="events">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-4" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-10 w-full mt-4" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : userEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userEvents.map((event) => (
                    <Card key={event.id} className="overflow-hidden">
                      <div className={`h-12 bg-maasta-orange flex items-center px-4`}>
                        <h3 className="font-semibold text-white">{event.title}</h3>
                      </div>
                      <CardContent className="p-4">
                        <div className="mb-4">
                          <p className="text-sm"><span className="font-medium">Date:</span> {formatDate(event.event_date)}</p>
                          <p className="text-sm"><span className="font-medium">Location:</span> {event.location}</p>
                          <p className="text-sm"><span className="font-medium">Created:</span> {formatDate(event.created_at)}</p>
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <Button 
                            onClick={() => navigate(`/events/${event.id}`)}
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                          >
                            View
                          </Button>
                          <Button 
                            onClick={() => navigate(`/events/edit/${event.id}`)}
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                          >
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500 mb-4">You haven't created any events yet</p>
                    <Button 
                      onClick={() => navigate("/events/create")} 
                      className="bg-maasta-orange hover:bg-maasta-orange/90"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Your First Event
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="auditions">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-4" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-10 w-full mt-4" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : userAuditions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userAuditions.map((audition) => (
                    <Card key={audition.id}>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-1">{audition.title}</h3>
                        <div className="flex items-center mb-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            audition.status === 'open' ? 'bg-green-100 text-green-800' :
                            audition.status === 'closed' ? 'bg-red-100 text-red-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {audition.status.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            Created: {formatDate(audition.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                          {audition.description || "No description available"}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Location:</span> {audition.location || "Not specified"}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Deadline:</span> {audition.deadline ? formatDate(audition.deadline) : "No deadline"}
                        </p>
                        <div className="flex space-x-2 mt-4">
                          <Button 
                            onClick={() => navigate(`/auditions/${audition.id}`)}
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                          >
                            View
                          </Button>
                          <Button 
                            onClick={() => navigate(`/auditions/edit/${audition.id}`)}
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                          >
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500 mb-4">You haven't created any auditions yet</p>
                    <Button 
                      onClick={() => navigate("/auditions/create")} 
                      className="bg-maasta-purple hover:bg-maasta-purple/90"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Post Your First Audition
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="registered">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-4" />
                        <Skeleton className="h-4 w-full mb-2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : registeredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {registeredEvents.map((registration) => (
                    <Card key={registration.id}>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-1">{registration.events.title}</h3>
                        <div className="mb-3">
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                            {registration.attendance_status.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            Registered: {formatDate(registration.registered_at)}
                          </span>
                        </div>
                        <p className="text-sm">
                          <span className="font-medium">Date:</span> {formatDate(registration.events.event_date)}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Location:</span> {registration.events.location}
                        </p>
                        <Button 
                          onClick={() => navigate(`/events/${registration.event_id}`)}
                          variant="outline" 
                          size="sm" 
                          className="mt-4"
                        >
                          View Event
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500 mb-4">You haven't registered for any events yet</p>
                    <Button 
                      onClick={() => navigate("/events")} 
                      className="bg-maasta-orange hover:bg-maasta-orange/90"
                    >
                      Browse Events
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="applications">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-4" />
                        <Skeleton className="h-4 w-full mb-2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : auditionApplications.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {auditionApplications.map((application) => (
                    <Card key={application.id}>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-1">{application.auditions.title}</h3>
                        <div className="mb-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            application.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                            application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {application.status.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            Applied: {formatDate(application.application_date)}
                          </span>
                        </div>
                        <p className="text-sm">
                          <span className="font-medium">Location:</span> {application.auditions.location || "Not specified"}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Notes:</span> {application.notes || "No notes"}
                        </p>
                        <Button 
                          onClick={() => navigate(`/auditions/${application.audition_id}`)}
                          variant="outline" 
                          size="sm" 
                          className="mt-4"
                        >
                          View Audition
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500 mb-4">You haven't applied to any auditions yet</p>
                    <Button 
                      onClick={() => navigate("/auditions")} 
                      className="bg-maasta-purple hover:bg-maasta-purple/90"
                    >
                      Browse Auditions
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
