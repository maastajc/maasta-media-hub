import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SwipeCardProps {
  user: {
    id: string;
    full_name: string;
    profile_picture_url?: string;
    bio?: string;
    category?: string;
    city?: string;
    state?: string;
    country?: string;
    verified?: boolean;
  };
  onSwipeLeft: (userId: string) => void;
  onSwipeRight: (userId: string) => void;
}

const SwipeCard = ({ user, onSwipeLeft, onSwipeRight }: SwipeCardProps) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-30, 30]);
  const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -100 || velocity < -500) {
      onSwipeLeft(user.id);
    } else if (offset > 100 || velocity > 500) {
      onSwipeRight(user.id);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getLocation = () => {
    const location = [user.city, user.state, user.country].filter(Boolean);
    return location.length > 0 ? location.join(', ') : 'Location not specified';
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
    >
      <Card className="w-full h-full overflow-hidden bg-card shadow-xl">
        <div className="relative h-2/3">
          {user.profile_picture_url ? (
            <img
              src={user.profile_picture_url}
              alt={user.full_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
              <div className="text-6xl font-bold text-primary/60">
                {getInitials(user.full_name)}
              </div>
            </div>
          )}
          
          {user.verified && (
            <Badge className="absolute top-4 right-4 bg-blue-500">
              Verified
            </Badge>
          )}
        </div>

        <div className="p-6 h-1/3 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">{user.full_name}</h3>
            
            {user.category && (
              <Badge variant="outline" className="mb-2">
                {user.category}
              </Badge>
            )}

            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
              <MapPin className="w-4 h-4" />
              <span>{getLocation()}</span>
            </div>

            {user.bio && (
              <p className="text-sm text-muted-foreground line-clamp-2">{user.bio}</p>
            )}
          </div>

          <div className="flex gap-4 mt-4">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 border-destructive/30 hover:bg-destructive/10"
              onClick={() => onSwipeLeft(user.id)}
            >
              <X className="w-5 h-5 text-destructive" />
            </Button>
            <Button
              size="lg"
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={() => onSwipeRight(user.id)}
            >
              <Heart className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default SwipeCard;