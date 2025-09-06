import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, User } from "lucide-react";

interface Connection {
  id: string;
  user_id: string;
  target_user_id: string;
  status: string;
  created_at: string;
  target_user: {
    id: string;
    full_name: string;
    profile_picture_url?: string;
    bio?: string;
    category?: string;
    verified?: boolean;
  };
}

interface ConnectionsListProps {
  onStartChat: (user: any) => void;
}

const ConnectionsList = ({ onStartChat }: ConnectionsListProps) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchConnections();
    }
  }, [user]);

  const fetchConnections = async () => {
    if (!user) return;

    try {
      // Get connections and then fetch profile data separately
      const { data: connectionsData, error: connectionsError } = await supabase
        .from('connections')
        .select('id, user_id, target_user_id, status, created_at')
        .eq('user_id', user.id)
        .eq('status', 'connected')
        .order('created_at', { ascending: false });

      if (connectionsError) throw connectionsError;

      if (!connectionsData || connectionsData.length === 0) {
        setConnections([]);
        return;
      }

      // Get profile data for target users
      const targetUserIds = connectionsData.map(c => c.target_user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, profile_picture_url, bio, category, verified')
        .in('id', targetUserIds);

      if (profilesError) throw profilesError;

      // Map connections with profile data
      const connectionsWithProfiles = connectionsData.map(connection => {
        const targetUser = profilesData?.find(profile => profile.id === connection.target_user_id);
        return {
          ...connection,
          target_user: targetUser || {
            id: connection.target_user_id,
            full_name: 'Unknown User',
            profile_picture_url: null,
            bio: null,
            category: null,
            verified: false
          }
        };
      });

      setConnections(connectionsWithProfiles);
    } catch (error) {
      console.error('Error fetching connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No connections yet</h3>
        <p className="text-muted-foreground">Start swiping to find and connect with people!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {connections.map((connection) => (
        <Card key={connection.id} className="p-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={connection.target_user.profile_picture_url} />
              <AvatarFallback>{getInitials(connection.target_user.full_name)}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold">{connection.target_user.full_name}</h4>
                {connection.target_user.verified && (
                  <Badge variant="secondary" className="text-xs">Verified</Badge>
                )}
              </div>
              
              {connection.target_user.category && (
                <p className="text-sm text-muted-foreground">{connection.target_user.category}</p>
              )}
              
              {connection.target_user.bio && (
                <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                  {connection.target_user.bio}
                </p>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onStartChat(connection.target_user)}
              className="gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Chat
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ConnectionsList;