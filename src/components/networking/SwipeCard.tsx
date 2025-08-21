
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { X, Heart, MapPin } from "lucide-react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";

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
    "Primary Profession"?: string[];
  };
  onSwipeLeft: (userId: string) => void;
  onSwipeRight: (userId: string) => void;
  style?: React.CSSProperties;
}

const SwipeCard = ({ user, onSwipeLeft, onSwipeRight, style }: SwipeCardProps) => {
  const [exitX, setExitX] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -100 || velocity < -500) {
      setExitX(-1000);
      onSwipeLeft(user.id);
    } else if (offset > 100 || velocity > 500) {
      setExitX(1000);
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

  const getProfessions = () => {
    if (user["Primary Profession"] && user["Primary Profession"].length > 0) {
      return user["Primary Profession"];
    }
    return user.category ? [user.category] : ['Other'];
  };

  return (
    <motion.div
      style={{ x, rotate, opacity, ...style }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={{ x: exitX }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute inset-0"
    >
      <Card className="w-full h-full overflow-hidden bg-gradient-to-b from-white to-gray-50 shadow-xl">
        <div className="relative h-2/3">
          {user.profile_picture_url ? (
            <img
              src={user.profile_picture_url}
              alt={user.full_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-maasta-purple/20 to-maasta-purple/40 flex items-center justify-center">
              <div className="text-6xl font-bold text-maasta-purple/60">
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
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-gray-900">{user.full_name}</h3>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-2">
              {getProfessions().map((profession, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {profession}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
              <MapPin className="w-4 h-4" />
              <span>{getLocation()}</span>
            </div>

            {user.bio && (
              <p className="text-sm text-gray-700 line-clamp-2">{user.bio}</p>
            )}
          </div>

          <div className="flex gap-4 mt-4">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 border-red-200 hover:bg-red-50"
              onClick={() => onSwipeLeft(user.id)}
            >
              <X className="w-5 h-5 text-red-500" />
            </Button>
            <Button
              size="lg"
              className="flex-1 bg-maasta-purple hover:bg-maasta-purple/90"
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
