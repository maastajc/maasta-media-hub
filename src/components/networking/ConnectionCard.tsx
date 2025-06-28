
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Users } from "lucide-react";

interface ConnectionCardProps {
  user: {
    id: string;
    full_name: string;
    profile_picture_url?: string;
    bio?: string;
    category?: string;
    city?: string;
    state?: string;
    verified?: boolean;
  };
  connectionStatus: 'none' | 'pending' | 'connected';
  onConnect: (userId: string) => void;
  onMessage: (userId: string) => void;
  onViewProfile: (userId: string) => void;
}

const ConnectionCard = ({
  user,
  connectionStatus,
  onConnect,
  onMessage,
  onViewProfile
}: ConnectionCardProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={user.profile_picture_url} alt={user.full_name} />
            <AvatarFallback className="text-lg">
              {getInitials(user.full_name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <h3 className="font-semibold text-lg">{user.full_name}</h3>
              {user.verified && (
                <Badge variant="secondary" className="text-xs">
                  Verified
                </Badge>
              )}
            </div>
            
            {user.category && (
              <Badge variant="outline" className="text-xs">
                {user.category}
              </Badge>
            )}
            
            {(user.city || user.state) && (
              <p className="text-sm text-gray-500">
                {[user.city, user.state].filter(Boolean).join(', ')}
              </p>
            )}
            
            {user.bio && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {user.bio}
              </p>
            )}
          </div>
          
          <div className="flex gap-2 w-full">
            {connectionStatus === 'none' && (
              <Button 
                onClick={() => onConnect(user.id)}
                className="flex-1"
                size="sm"
              >
                <Users className="w-4 h-4 mr-1" />
                Connect
              </Button>
            )}
            
            {connectionStatus === 'pending' && (
              <Button 
                variant="outline" 
                className="flex-1"
                size="sm"
                disabled
              >
                Pending
              </Button>
            )}
            
            {connectionStatus === 'connected' && (
              <Button 
                onClick={() => onMessage(user.id)}
                className="flex-1"
                size="sm"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                Message
              </Button>
            )}
            
            <Button 
              variant="outline" 
              onClick={() => onViewProfile(user.id)}
              size="sm"
            >
              View Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionCard;
