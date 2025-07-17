import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { User, HelpCircle, ChevronRight } from "lucide-react";
import { useProfileStrength } from "@/hooks/useProfileStrength";
import { Artist } from "@/types/artist";
import { useNavigate } from "react-router-dom";

interface ProfileStrengthMeterProps {
  artist: Artist | null;
  showActionButton?: boolean;
  compact?: boolean;
}

const ProfileStrengthMeter = ({ 
  artist, 
  showActionButton = false, 
  compact = false 
}: ProfileStrengthMeterProps) => {
  const navigate = useNavigate();
  const { totalStrength, incompleteSections, getStrengthColor, getStrengthStatus } = useProfileStrength(artist);

  const handleCompleteProfile = () => {
    navigate('/profile');
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-background to-muted/50 rounded-lg border">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">Profile Strength</span>
            <Badge variant={totalStrength >= 70 ? "default" : totalStrength >= 40 ? "secondary" : "destructive"}>
              {totalStrength}%
            </Badge>
          </div>
          <Progress value={totalStrength} className="h-2" />
        </div>
        {showActionButton && totalStrength < 100 && (
          <Button 
            size="sm" 
            onClick={handleCompleteProfile}
            className="ml-2"
          >
            Complete
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-background to-muted/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <User size={16} />
          Profile Strength
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle size={14} className="text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <div className="space-y-2">
                  <p className="font-medium">Improve your profile to:</p>
                  <ul className="text-xs space-y-1">
                    <li>• Get discovered for more auditions</li>
                    <li>• Build trust with casting directors</li>
                    <li>• Showcase your full potential</li>
                  </ul>
                  {incompleteSections.length > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-xs font-medium mb-1">Missing sections:</p>
                      <ul className="text-xs space-y-1">
                        {incompleteSections.slice(0, 3).map((section) => (
                          <li key={section.name}>• {section.name} (+{section.weight}%)</li>
                        ))}
                        {incompleteSections.length > 3 && (
                          <li className="text-muted-foreground">
                            +{incompleteSections.length - 3} more sections
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-3">
          <span className={`text-3xl font-bold ${getStrengthColor()}`}>
            {totalStrength}%
          </span>
          <Badge 
            variant={totalStrength >= 70 ? "default" : totalStrength >= 40 ? "secondary" : "destructive"}
            className="text-xs px-2"
          >
            {getStrengthStatus()}
          </Badge>
        </div>
        
        <div className="space-y-2 mb-3">
          <Progress 
            value={totalStrength} 
            className="h-3"
          />
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Profile {totalStrength}% Complete</span>
            <span className="font-medium">
              {totalStrength < 40 ? '🔴' : totalStrength < 70 ? '🟡' : '🟢'}
            </span>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground mb-3">
          {totalStrength === 100 ? (
            <span className="text-success font-medium">
              🎉 Perfect! Your profile is complete
            </span>
          ) : (
            <>
              Complete your profile to attract more opportunities
              {incompleteSections.length > 0 && (
                <span className="block mt-1">
                  <strong>{incompleteSections.length}</strong> sections remaining
                </span>
              )}
            </>
          )}
        </div>
        
        {showActionButton && totalStrength < 100 && (
          <Button 
            onClick={handleCompleteProfile}
            className="w-full text-sm"
            size="sm"
          >
            Complete My Profile
            <ChevronRight size={14} className="ml-1" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileStrengthMeter;