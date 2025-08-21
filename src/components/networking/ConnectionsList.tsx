
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Users } from "lucide-react";

interface Connection {
  id: string;
  status: string;
  created_at: string;
  target_user: {
    id: string;
    full_name: string;
    profile_picture_url?: string;
    category?: string;
    city?: string;
    state?: string;
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
      loadConnections();
    }
  }, [user]);

  const loadConnections = async () => {
    if (!user) return;

    try {
      // Get connections where current user is either sender or receiver and status is connected
      const { data, error } = await supabase
        .from('connections')
        .select(`
          id,
          status,
          created_at,
          user_id,
          target_user_id,
          profiles!connections_target_user_id_fkey (
            id,
            full_name,
            profile_picture_url,
            category,
            city,
            state
          )
        `)
        .or(`user_id.eq.${user.id},target_user_id.eq.${user.id}`)
        .eq('status', 'connected');

      if (error) throw error;

      // Transform the data to get the other user's profile
      const transformedConnections = data?.map(connection => {
        const isCurrentUserSender = connection.user_id === user.id;
        return {
          id: connection.id,
          status: connection.status,
          created_at: connection.created_at,
          target_user: connection.profiles
        };
      }) || [];

      setConnections(transformedConnections);
    } catch (error) {
      console.error('Error loading connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No connections yet</h3>
        <p className="text-gray-600">Start swiping to connect with other professionals!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {connections.map((connection) => (
        <Card key={connection.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={connection.target_user.profile_picture_url} />
                  <AvatarFallback>
                    {getInitials(connection.target_user.full_name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h4 className="font-semibold">{connection.target_user.full_name}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {connection.target_user.category && (
                      <Badge variant="outline" className="text-xs">
                        {connection.target_user.category}
                      </Badge>
                    )}
                    {(connection.target_user.city || connection.target_user.state) && (
                      <span>
                        {[connection.target_user.city, connection.target_user.state]
                          .filter(Boolean)
                          .join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <Button
                onClick={() => onStartChat(connection.target_user)}
                size="sm"
                className="gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Chat
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ConnectionsList;
