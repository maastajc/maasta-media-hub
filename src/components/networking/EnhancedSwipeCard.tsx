
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Heart, MapPin, ExternalLink, ChevronDown, ChevronUp, Play } from "lucide-react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";

interface EnhancedSwipeCardProps {
  user: any;
  onSwipeLeft: (userId: string) => void;
  onSwipeRight: (userId: string) => void;
  isPreview?: boolean;
}

const EnhancedSwipeCard = ({ user, onSwipeLeft, onSwipeRight, isPreview = false }: EnhancedSwipeCardProps) => {
  const [exitX, setExitX] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (isPreview) return;
    
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
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
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

  const handleViewFullProfile = () => {
    window.open(`/artists/${user.id}`, '_blank');
  };

  const toggleExpanded = () => {
    if (!isPreview) {
      setIsExpanded(!isExpanded);
    }
  };

  if (isPreview) {
    return (
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
        </div>
        <div className="p-6 h-1/3 flex flex-col justify-center">
          <h3 className="text-xl font-bold text-gray-900">{user.full_name}</h3>
          <div className="flex flex-wrap gap-1 mt-2">
            {getProfessions().slice(0, 2).map((profession, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {profession}
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={{ x: exitX }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute inset-0"
    >
      <Card className="w-full h-full overflow-hidden bg-gradient-to-b from-white to-gray-50 shadow-xl">
        {/* Basic Profile View */}
        <div className={`transition-all duration-300 ${isExpanded ? 'h-1/3' : 'h-2/3'}`}>
          {user.profile_picture_url || (user.media_assets && user.media_assets.length > 0) ? (
            <div className="relative w-full h-full">
              <img
                src={user.profile_picture_url || user.media_assets?.[0]?.url}
                alt={user.full_name}
                className="w-full h-full object-cover"
              />
              {user.media_assets?.some(asset => asset.is_video) && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-black/50 text-white">
                    <Play className="w-3 h-3 mr-1" />
                    Video
                  </Badge>
                </div>
              )}
            </div>
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

        <div className={`p-6 transition-all duration-300 ${isExpanded ? 'h-2/3' : 'h-1/3'} flex flex-col`}>
          {/* Basic Info */}
          <div className="flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-900">{user.full_name}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleExpanded}
                className="p-1"
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
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
              <p className="text-sm text-gray-700 line-clamp-2 mb-4">{user.bio}</p>
            )}
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <ScrollArea className="flex-1 -mx-2 px-2">
              <div className="space-y-4">
                {/* Media Gallery */}
                {user.media_assets && user.media_assets.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Media</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {user.media_assets.slice(0, 6).map((asset, index) => (
                        <div key={index} className="relative aspect-square bg-gray-100 rounded overflow-hidden">
                          <img
                            src={asset.url}
                            alt={asset.description || 'Media'}
                            className="w-full h-full object-cover"
                          />
                          {asset.is_video && (
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                              <Play className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {user.projects && user.projects.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Recent Projects</h4>
                    <div className="space-y-2">
                      {user.projects.slice(0, 3).map((project, index) => (
                        <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                          <p className="font-medium">{project.project_name}</p>
                          <p className="text-gray-600">{project.role_in_project} • {project.year_of_release}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {user.special_skills && user.special_skills.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {user.special_skills.slice(0, 8).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill.skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Awards */}
                {user.awards && user.awards.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Awards</h4>
                    <div className="space-y-1">
                      {user.awards.slice(0, 3).map((award, index) => (
                        <div key={index} className="text-xs">
                          <p className="font-medium">{award.title}</p>
                          <p className="text-gray-600">{award.organization} • {award.year}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* View Full Profile Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewFullProfile}
                  className="w-full gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Full Profile
                </Button>
              </div>
            </ScrollArea>
          )}

          {/* Action Buttons */}
          {!isExpanded && (
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
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default EnhancedSwipeCard;
