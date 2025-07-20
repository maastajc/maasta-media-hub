import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Star, CheckCircle, ChevronRight, X } from "lucide-react";
import { useProfileStrength } from "@/hooks/useProfileStrength";
import { Artist } from "@/types/artist";
import { useNavigate } from "react-router-dom";

interface ProfileStrengthPopupProps {
  artist: Artist | null;
  open: boolean;
  onClose: () => void;
}

const motivationalMessages = [
  {
    icon: "🟠",
    title: "You're almost there!",
    subtitle: "Complete your portfolio to unlock more auditions and boost your visibility."
  },
  {
    icon: "🎬", 
    title: "You're in the spotlight!",
    subtitle: "Production houses are reviewing profiles — complete yours now to stand out."
  },
  {
    icon: "⭐",
    title: "Only a few steps left…",
    subtitle: "Update your media, add projects, and unlock your full Maasta profile."
  }
];

const ProfileStrengthPopup = ({ artist, open, onClose }: ProfileStrengthPopupProps) => {
  const navigate = useNavigate();
  const { totalStrength, incompleteSections, getStrengthColor } = useProfileStrength(artist);
  const [currentMessage] = useState(() => 
    motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
  );

  const handleCompleteProfile = () => {
    onClose();
    navigate('/profile');
  };

  const handleRemindLater = () => {
    onClose();
    // Store reminder preference in localStorage with timestamp
    localStorage.setItem('profile_reminder_dismissed', Date.now().toString());
  };

  const handleSkipForNow = () => {
    onClose();
    // Permanently dismiss the popup
    localStorage.setItem('profile_strength_popup_skipped', 'true');
  };

  if (!artist || totalStrength >= 100) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-2 border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Target className="w-8 h-8 text-primary" />
          </div>
          
          <div>
            <DialogTitle className="text-xl font-bold flex items-center justify-center gap-2">
              {currentMessage.icon} {currentMessage.title}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {currentMessage.subtitle}
            </p>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Progress Section */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Profile Strength</span>
              <Badge variant={totalStrength >= 70 ? "default" : totalStrength >= 40 ? "secondary" : "destructive"}>
                {totalStrength}%
              </Badge>
            </div>
            
            <Progress value={totalStrength} className="h-2" />
            
            <div className="text-xs text-muted-foreground">
              <strong>{incompleteSections.length}</strong> sections remaining to complete
            </div>
          </div>

          {/* Top Missing Sections */}
          {incompleteSections.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Star size={14} className="text-primary" />
                Quick wins to boost your profile:
              </h4>
              <div className="space-y-1">
                {incompleteSections.slice(0, 3).map((section) => (
                  <div key={section.name} className="flex items-center justify-between text-xs bg-muted/20 rounded px-2 py-1">
                    <span>{section.name}</span>
                    <Badge variant="outline" className="text-xs">
                      +{section.weight}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <Button 
              onClick={handleCompleteProfile}
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              size="lg"
            >
              Complete My Profile
              <ChevronRight size={16} className="ml-2" />
            </Button>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleRemindLater}
                variant="ghost" 
                size="sm"
                className="flex-1 text-muted-foreground hover:text-foreground"
              >
                Remind me later
              </Button>
              
              <Button 
                onClick={handleSkipForNow}
                variant="outline" 
                size="sm"
                className="flex-1"
              >
                Skip for now
              </Button>
            </div>
          </div>
        </div>

        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 w-8 h-8"
        >
          <X size={16} />
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileStrengthPopup;