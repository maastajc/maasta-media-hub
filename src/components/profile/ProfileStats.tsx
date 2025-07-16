
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, TrendingUp, Award } from "lucide-react";
import { Artist } from "@/types/artist";
import ProfileStrengthMeter from "./ProfileStrengthMeter";

interface ProfileStatsProps {
  artist: Artist;
}

const ProfileStats = ({ artist }: ProfileStatsProps) => {
  // Calculate stats
  const stats = {
    projects: artist.projects?.length || 0,
    skills: artist.special_skills?.length || 0,
    education: (artist.education?.length || 0) + (artist.education_training?.length || 0),
    awards: artist.awards?.length || 0,
  };

  return (
    <div className="bg-background border-b">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Profile Strength */}
          <div className="col-span-1 lg:col-span-2">
            <ProfileStrengthMeter 
              artist={artist} 
              showActionButton={true}
            />
          </div>

          {/* Projects */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp size={16} />
                Projects
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-primary">{stats.projects}</div>
              <p className="text-xs text-muted-foreground">Total projects</p>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Star size={16} />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-secondary">{stats.skills}</div>
              <p className="text-xs text-muted-foreground">Special skills</p>
            </CardContent>
          </Card>

          {/* Awards */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Award size={16} />
                Awards
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-accent">{stats.awards}</div>
              <p className="text-xs text-muted-foreground">Achievements</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;
