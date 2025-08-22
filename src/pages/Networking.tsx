import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EnhancedSwipeStack from "@/components/networking/EnhancedSwipeStack";
import ConnectionsList from "@/components/networking/ConnectionsList";
import ChatInterface from "@/components/networking/ChatInterface";
import NetworkingPreferences from "@/components/networking/NetworkingPreferences";
import NetworkingFilters from "@/components/networking/NetworkingFilters";
import { useAuth } from "@/contexts/AuthContext";
import { useArtists } from "@/hooks/useArtists";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Users, Zap, Search } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const Networking = () => {
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [swipedUserIds, setSwipedUserIds] = useState(new Set());
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("all");
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const { artists, isLoading, refetch } = useArtists();

  useEffect(() => {
    if (user && artists.length > 0) {
      filterUsersForSwipe();
    }
  }, [artists, user, refreshTrigger, searchTerm, categoryFilter, locationFilter, experienceFilter]);

  const filterUsersForSwipe = async () => {
    if (!user || !artists.length) return;

    try {
      const { data: swipedConnections, error } = await supabase
        .from('connections')
        .select('target_user_id')
        .eq('user_id', user.id);

      if (error) throw error;

      const swipedIds = new Set(swipedConnections?.map(c => c.target_user_id) || []);
      
      let availableUsers = artists
        .filter(artist => artist.id !== user.id)
        .filter(artist => !swipedIds.has(artist.id))
        .filter(artist => artist.status === 'active');

      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        availableUsers = availableUsers.filter(artist =>
          artist.full_name?.toLowerCase().includes(searchLower) ||
          artist.bio?.toLowerCase().includes(searchLower) ||
          artist.category?.toLowerCase().includes(searchLower) ||
          artist.skills?.some(skill => skill.toLowerCase().includes(searchLower))
        );
      }

      if (categoryFilter && categoryFilter !== 'all') {
        availableUsers = availableUsers.filter(artist => 
          artist.category === categoryFilter
        );
      }

      if (locationFilter) {
        const locationLower = locationFilter.toLowerCase();
        availableUsers = availableUsers.filter(artist =>
          artist.city?.toLowerCase().includes(locationLower) ||
          artist.state?.toLowerCase().includes(locationLower) ||
          artist.country?.toLowerCase().includes(locationLower)
        );
      }

      if (experienceFilter && experienceFilter !== 'all') {
        availableUsers = availableUsers.filter(artist =>
          artist.experience_level === experienceFilter
        );
      }
      
      setFilteredUsers(availableUsers);
    } catch (error) {
      console.error('Error filtering users:', error);
      setFilteredUsers(artists.filter(artist => artist.id !== user.id));
    }
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    refetch();
  };

  const handlePreferencesUpdate = () => {
    filterUsersForSwipe();
  };

  const handleStartChat = async (chatUser: any) => {
    if (!user) return;

    setSelectedChatUser({
      id: chatUser.id,
      full_name: chatUser.full_name,
      profile_picture_url: chatUser.profile_picture_url
    });

    try {
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${chatUser.id}),and(sender_id.eq.${chatUser.id},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(messagesData || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedChatUser || !user) return;
    
    try {
      const newMessage = {
        sender_id: user.id,
        receiver_id: selectedChatUser.id,
        content,
        message_type: 'text'
      };

      const { data, error } = await supabase
        .from('messages')
        .insert(newMessage)
        .select()
        .single();

      if (error) throw error;

      setMessages(prev => [...prev, data]);
      toast.success("Message sent!");
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Sign in to Network</h2>
            <p className="text-gray-600">You need to be signed in to connect with other professionals.</p>
          </div>
        </main>
        {!isMobile && <Footer />}
      </div>
    );
  }

  if (selectedChatUser) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <ChatInterface
              selectedUser={selectedChatUser}
              messages={messages}
              currentUserId={user.id}
              onSendMessage={handleSendMessage}
              onBack={() => setSelectedChatUser(null)}
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pb-20 md:pb-0">
        <div className="bg-gradient-to-br from-maasta-purple/10 to-purple-50 py-6 md:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold mb-2">
                  Network & Connect
                </h1>
                <p className="text-sm md:text-lg text-gray-600">
                  Discover and connect with talented professionals
                </p>
              </div>
              <NetworkingPreferences onPreferencesUpdate={handlePreferencesUpdate} />
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name, skill, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Collapsible Filters */}
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
          </div>
        </div>
        
        <section className="py-4 md:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="discover" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 md:mb-8">
                <TabsTrigger value="discover" className="gap-2">
                  <Zap className="w-4 h-4" />
                  Discover
                </TabsTrigger>
                <TabsTrigger value="connections" className="gap-2">
                  <Users className="w-4 h-4" />
                  My Connections
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="discover">
                <div className="max-w-sm mx-auto">
                  <div className="aspect-[3/4] relative">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin w-8 h-8 border-4 border-maasta-purple border-t-transparent rounded-full"></div>
                      </div>
                    ) : (
                      <EnhancedSwipeStack
                        users={filteredUsers}
                        onRefresh={handleRefresh}
                      />
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="connections">
                <div className="max-w-2xl mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Your Connections</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedChatUser(null)}
                      className="gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Messages
                    </Button>
                  </div>
                  <ConnectionsList onStartChat={handleStartChat} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Networking;
