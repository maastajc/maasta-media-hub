
import { useState, useRef, useEffect } from "react";
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
  const [startY, setStartY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  // Handle touch events for scroll-to-expand with better gesture detection
  useEffect(() => {
    const card = cardRef.current;
    if (!card || isPreview) return;

    let startTouchY = 0;
    let startTouchX = 0;
    let isVerticalScroll = false;
    let isHorizontalSwipe = false;

    const handleTouchStart = (e: TouchEvent) => {
      startTouchY = e.touches[0].clientY;
      startTouchX = e.touches[0].clientX;
      isVerticalScroll = false;
      isHorizontalSwipe = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = e.touches[0].clientY - startTouchY;
      const deltaX = e.touches[0].clientX - startTouchX;
      
      // Determine the primary direction of movement
      if (!isVerticalScroll && !isHorizontalSwipe) {
        if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 20) {
          isVerticalScroll = true;
          // Only handle vertical scroll when not in an expanded scrollable area
          const target = e.target as Element;
          const scrollArea = target.closest('[data-radix-scroll-area-viewport]');
          
          if (!scrollArea) {
            if (deltaY > 60 && !isExpanded) {
              setIsExpanded(true);
            } else if (deltaY < -60 && isExpanded) {
              setIsExpanded(false);
            }
          }
        } else if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 20) {
          isHorizontalSwipe = true;
        }
      }
    };

    card.addEventListener('touchstart', handleTouchStart, { passive: true });
    card.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      card.removeEventListener('touchstart', handleTouchStart);
      card.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isExpanded, isPreview]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (isPreview || isExpanded) return;
    
    console.log('Drag ended with offset:', info.offset.x, 'velocity:', info.velocity.x);
    
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    // More sensitive thresholds for better mobile experience
    if (offset < -80 || velocity < -300) {
      console.log('Swiping left');
      setExitX(-1000);
      setTimeout(() => onSwipeLeft(user.id), 150);
    } else if (offset > 80 || velocity > 300) {
      console.log('Swiping right');
      setExitX(1000);
      setTimeout(() => onSwipeRight(user.id), 150);
    }
  };

  const handleSwipeLeft = () => {
    if (isExpanded) return;
    console.log('Manual swipe left');
    setExitX(-1000);
    setTimeout(() => onSwipeLeft(user.id), 150);
  };

  const handleSwipeRight = () => {
    if (isExpanded) return;
    console.log('Manual swipe right');
    setExitX(1000);
    setTimeout(() => onSwipeRight(user.id), 150);
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
      ref={cardRef}
      style={{ x, rotate, opacity }}
      drag={!isExpanded ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      animate={exitX !== 0 ? { x: exitX, opacity: 0 } : { x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute inset-0"
      dragMomentum={false}
      whileDrag={!isExpanded ? { scale: 1.05, zIndex: 10 } : {}}
    >
      <Card className="w-full h-full overflow-hidden bg-gradient-to-b from-white to-gray-50 shadow-xl">
        {/* Basic Profile View */}
        <div className={`relative transition-all duration-500 ease-in-out ${isExpanded ? 'h-1/4' : 'h-2/3'}`}>
          {user.profile_picture_url || (user.media_assets && user.media_assets.length > 0) ? (
            <div className="relative w-full h-full overflow-hidden">
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

          {/* Expand/Collapse indicator */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleExpanded}
              className="bg-white/80 backdrop-blur-sm hover:bg-white/90 rounded-full p-2"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'h-3/4' : 'h-1/3'} flex flex-col`}>
          {/* Basic Info - Always visible */}
          <div className="flex-shrink-0 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-900">{user.full_name}</h3>
              {user.years_of_experience && (
                <Badge variant="secondary" className="text-xs">
                  {user.years_of_experience}+ years
                </Badge>
              )}
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
              <p className="text-sm text-gray-700 line-clamp-2 mb-2">{user.bio}</p>
            )}
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full px-4 pb-4">
                <div className="space-y-6">
                  {/* About Section */}
                  {(user.about || user.headline) && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2">About</h4>
                      {user.headline && (
                        <p className="text-sm font-medium text-gray-800 mb-2">{user.headline}</p>
                      )}
                      {user.about && (
                        <p className="text-sm text-gray-700">{user.about}</p>
                      )}
                    </div>
                  )}

                  {/* Media Gallery */}
                  {user.media_assets && user.media_assets.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-3">Media Portfolio</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {user.media_assets.slice(0, 8).map((asset, index) => (
                          <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={asset.url}
                              alt={asset.description || 'Portfolio media'}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                            />
                            {asset.is_video && (
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <Play className="w-6 h-6 text-white" />
                              </div>
                            )}
                            {asset.description && (
                              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1">
                                {asset.description}
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
                      <h4 className="font-semibold text-sm mb-3">Recent Projects</h4>
                      <div className="space-y-3">
                        {user.projects.slice(0, 4).map((project, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex justify-between items-start mb-1">
                              <p className="font-medium text-sm">{project.project_name}</p>
                              {project.year_of_release && (
                                <Badge variant="outline" className="text-xs">
                                  {project.year_of_release}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mb-1">{project.role_in_project}</p>
                            {project.project_type && (
                              <p className="text-xs text-gray-500">{project.project_type}</p>
                            )}
                            {project.director_producer && (
                              <p className="text-xs text-gray-500">Dir/Prod: {project.director_producer}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {user.special_skills && user.special_skills.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-3">Skills & Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {user.special_skills.slice(0, 12).map((skill, index) => (
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
                      <h4 className="font-semibold text-sm mb-3">Awards & Recognition</h4>
                      <div className="space-y-2">
                        {user.awards.slice(0, 4).map((award, index) => (
                          <div key={index} className="border-l-2 border-maasta-purple pl-3">
                            <p className="font-medium text-sm">{award.title}</p>
                            <p className="text-xs text-gray-600">
                              {award.organization} {award.year && `• ${award.year}`}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {user.education_training && user.education_training.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-3">Education & Training</h4>
                      <div className="space-y-2">
                        {user.education_training.slice(0, 3).map((edu, index) => (
                          <div key={index} className="text-sm">
                            <p className="font-medium">{edu.qualification_name}</p>
                            <p className="text-gray-600 text-xs">
                              {edu.institution} {edu.year_completed && `• ${edu.year_completed}`}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tools & Software */}
                  {user.tools_software && user.tools_software.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-3">Tools & Software</h4>
                      <div className="flex flex-wrap gap-2">
                        {user.tools_software.slice(0, 8).map((tool, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tool.tool_name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* View Full Profile Button */}
                  <div className="pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleViewFullProfile}
                      className="w-full gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Complete Profile
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Action Buttons - Always visible at bottom */}
          {!isExpanded && (
            <div className="flex gap-4 p-4 mt-auto">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 border-red-200 hover:bg-red-50 active:scale-95 transition-transform"
                onClick={handleSwipeLeft}
              >
                <X className="w-5 h-5 text-red-500" />
              </Button>
              <Button
                size="lg"
                className="flex-1 bg-maasta-purple hover:bg-maasta-purple/90 active:scale-95 transition-transform"
                onClick={handleSwipeRight}
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
