
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PlusCircle, Calendar, Users, ClipboardList } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [userEvents, setUserEvents] = useState<any[]>([]);
  const [userAuditions, setUserAuditions] = useState<any[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);
  const [auditionApplications, setAuditionApplications] = useState<any[]>([]);
  
  useEffect(() => {
    if (!user) {
      navigate("/sign-in");
      return;
    }
    
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch events created by the user
        const { data: events, error: eventsError } = await supabase
          .from("events")
          .select("*")
          .eq("creator_id", user.id);
          
        if (eventsError) throw eventsError;
        
        // Fetch auditions posted by the user
        const { data: auditions, error: auditionsError } = await supabase
          .from("auditions")
          .select("*")
          .eq("creator_id", user.id);
          
        if (auditionsError) throw auditionsError;
        
        // Fetch events the user is registered for
        const { data: registrations, error: registrationsError } = await supabase
          .from("event_attendees")
          .select("*, events(*)")
          .eq("user_id", user.id);
          
        if (registrationsError) throw registrationsError;
        
        // Fetch auditions the user has applied to
        const { data: applications, error: applicationsError } = await supabase
          .from("audition_applications")
          .select("*, auditions(*)")
          .eq("artist_id", user.id);
          
        if (applicationsError) throw applicationsError;
        
        setUserEvents(events || []);
        setUserAuditions(auditions || []);
        setRegisteredEvents(registrations || []);
        setAuditionApplications(applications || []);
        
      } catch (error: any) {
        console.error("Error fetching user data:", error.message);
        toast({
          title: "Error",
          description: "Failed to load your dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [user, navigate, toast]);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">My Dashboard</h1>
            <p className="text-gray-500 mt-2">Manage your events, auditions, and applications</p>
          </header>
          
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
                <Button 
                  onClick={() => navigate("/artists")} 
                  variant="outline"
                  className="mt-4 border-green-600 text-green-600 hover:bg-green-50 w-full"
                >
                  View Artists
                </Button>
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
                      <CardContent className="p-0">
                        <Skeleton className="h-48 rounded-t-lg" />
                        <div className="p-4">
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/2 mb-4" />
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-10 w-full mt-4" />
                        </div>
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
                          <Button 
                            variant="destructive" 
                            size="sm"
                          >
                            Delete
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
                          <Button 
                            variant="destructive" 
                            size="sm"
                          >
                            Delete
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
