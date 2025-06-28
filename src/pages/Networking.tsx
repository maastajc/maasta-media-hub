
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NetworkingFilters from "@/components/networking/NetworkingFilters";
import ConnectionCard from "@/components/networking/ConnectionCard";
import ChatInterface from "@/components/networking/ChatInterface";
import { useAuth } from "@/contexts/AuthContext";
import { useArtists } from "@/hooks/useArtists";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";

const Networking = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [connections, setConnections] = useState(new Map());
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { artists, isLoading, isError, error } = useArtists();

  // Filter artists for networking (exclude current user and handle filtering properly)
  const filteredArtists = (() => {
    console.log('Networking page - Current user:', user?.id);
    console.log('Networking page - All artists:', artists.length);
    
    if (!artists || !Array.isArray(artists)) {
      console.warn('Artists data is not an array:', artists);
      return [];
    }

    // First filter out current user
    const otherArtists = artists.filter(artist => {
      if (!artist || !artist.id) {
        console.warn('Invalid artist object:', artist);
        return false;
      }
      return artist.id !== user?.id;
    });

    console.log('Artists after removing current user:', otherArtists.length);

    // Then apply other filters
    const filtered = otherArtists.filter(artist => {
      // Search filter
      if (searchTerm && searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        const nameMatch = artist.full_name?.toLowerCase().includes(searchLower);
        const bioMatch = artist.bio?.toLowerCase().includes(searchLower);
        if (!nameMatch && !bioMatch) {
          return false;
        }
      }

      // Category filter
      if (categoryFilter && artist.category !== categoryFilter) {
        return false;
      }

      // Location filter
      if (locationFilter && locationFilter.trim()) {
        const locationLower = locationFilter.toLowerCase();
        const locationMatch = artist.location?.toLowerCase().includes(locationLower);
        const cityMatch = artist.city?.toLowerCase().includes(locationLower);
        const stateMatch = artist.state?.toLowerCase().includes(locationLower);
        const countryMatch = artist.country?.toLowerCase().includes(locationLower);
        
        if (!locationMatch && !cityMatch && !stateMatch && !countryMatch) {
          return false;
        }
      }

      // Experience filter
      if (experienceFilter && artist.experience_level !== experienceFilter) {
        return false;
      }

      return true;
    });

    console.log('Final filtered artists for networking:', filtered.length);
    return filtered;
  })();

  const handleConnect = (userId: string) => {
    // Simulate connection request
    setConnections(prev => new Map(prev.set(userId, 'pending')));
    toast.success("Connection request sent!");
    
    // Simulate auto-acceptance for demo
    setTimeout(() => {
      setConnections(prev => new Map(prev.set(userId, 'connected')));
      toast.success("Connection accepted!");
    }, 2000);
  };

  const handleMessage = (userId: string) => {
    const artist = artists.find(a => a.id === userId);
    if (artist) {
      setSelectedChatUser({
        id: artist.id,
        full_name: artist.full_name,
        profile_picture_url: artist.profile_picture_url
      });
      // Load messages for this user (simulate for demo)
      setMessages([
        {
          id: '1',
          sender_id: userId,
          receiver_id: user?.id || '',
          content: "Hi! I saw your profile and would love to connect.",
          created_at: new Date().toISOString()
        }
      ]);
    }
  };

  const handleSendMessage = (content: string) => {
    if (!selectedChatUser || !user) return;
    
    const newMessage = {
      id: Date.now().toString(),
      sender_id: user.id,
      receiver_id: selectedChatUser.id,
      content,
      created_at: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newMessage]);
    toast.success("Message sent!");
  };

  const handleViewProfile = (userId: string) => {
    navigate(`/artists/${userId}`);
  };

  // Show sign in prompt if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Sign in to Network</h2>
            <p className="text-gray-600">You need to be signed in to connect with other artists.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show error state if there's an error
  if (isError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <div className="bg-maasta-purple/10 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Network & Connect</h1>
              <p className="text-lg text-gray-600">
                Discover and connect with talented professionals in the entertainment industry
              </p>
            </div>
          </div>
          
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center py-12">
                <p className="text-red-600 text-lg">Error loading artists: {error?.message || 'Unknown error'}</p>
                <p className="text-gray-500 mt-2">Please try refreshing the page.</p>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-maasta-purple/10 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Network & Connect</h1>
            <p className="text-lg text-gray-600">
              Discover and connect with talented professionals in the entertainment industry
            </p>
          </div>
        </div>
        
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="discover" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="discover">Discover People</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
              </TabsList>
              
              <TabsContent value="discover" className="space-y-6">
                <NetworkingFilters
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  categoryFilter={categoryFilter}
                  setCategoryFilter={setCategoryFilter}
                  locationFilter={locationFilter}
                  setLocationFilter={setLocationFilter}
                  experienceFilter={experienceFilter}
                  setExperienceFilter={setExperienceFilter}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {isLoading ? (
                    <div className="col-span-full flex justify-center py-12">
                      <div className="text-center">
                        <LoadingSpinner size="lg" />
                        <p className="mt-4 text-gray-600">Loading artists...</p>
                      </div>
                    </div>
                  ) : filteredArtists.length > 0 ? (
                    filteredArtists.map((artist) => (
                      <ConnectionCard
                        key={artist.id}
                        user={artist}
                        connectionStatus={connections.get(artist.id) || 'none'}
                        onConnect={handleConnect}
                        onMessage={handleMessage}
                        onViewProfile={handleViewProfile}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-500">No artists found matching your criteria</p>
                      {(searchTerm || categoryFilter || locationFilter || experienceFilter) && (
                        <p className="text-gray-400 mt-2">Try adjusting your filters to see more results</p>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="messages" className="h-[600px]">
                <ChatInterface
                  selectedUser={selectedChatUser}
                  messages={messages}
                  currentUserId={user.id}
                  onSendMessage={handleSendMessage}
                  onBack={() => setSelectedChatUser(null)}
                />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Networking;
