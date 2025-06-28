
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
  
  const { artists, isLoading } = useArtists();

  // Filter artists for networking (exclude current user)
  const filteredArtists = artists
    .filter(artist => artist.id !== user?.id)
    .filter(artist => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          artist.full_name?.toLowerCase().includes(searchLower) ||
          artist.bio?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .filter(artist => !categoryFilter || artist.category === categoryFilter)
    .filter(artist => {
      if (!locationFilter) return true;
      const locationLower = locationFilter.toLowerCase();
      return (
        artist.city?.toLowerCase().includes(locationLower) ||
        artist.state?.toLowerCase().includes(locationLower) ||
        artist.country?.toLowerCase().includes(locationLower)
      );
    })
    .filter(artist => !experienceFilter || artist.experience_level === experienceFilter);

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
    const user = artists.find(a => a.id === userId);
    if (user) {
      setSelectedChatUser({
        id: user.id,
        full_name: user.full_name,
        profile_picture_url: user.profile_picture_url
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
                    Array(8).fill(0).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-gray-200 rounded-lg h-64"></div>
                      </div>
                    ))
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
