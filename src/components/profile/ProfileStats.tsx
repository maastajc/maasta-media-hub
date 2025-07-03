
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, Award, User } from "lucide-react";
import { Artist } from "@/types/artist";

interface ProfileStatsProps {
  artist: Artist;
}

const ProfileStats = ({ artist }: ProfileStatsProps) => {
  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    const fields = [
      artist.full_name,
      artist.bio,
      artist.phone_number,
      artist.city,
      artist.category,
      artist.experience_level,
      artist.profile_picture_url,
      artist.projects && artist.projects.length > 0,
      artist.education && artist.education.length > 0,
      artist.special_skills && artist.special_skills.length > 0,
      artist.media_assets && artist.media_assets.length > 0,
    ];
    
    const completedFields = fields.filter(Boolean).length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const profileCompletion = calculateProfileCompletion();
  
  // Calculate stats
  const stats = {
    projects: artist.projects?.length || 0,
    skills: artist.special_skills?.length || 0,
    education: (artist.education?.length || 0) + (artist.education_training?.length || 0),
    awards: artist.awards?.length || 0,
  };

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getCompletionBadgeColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-100 text-green-800";
    if (percentage >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Profile Completion */}
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <User size={16} />
                Profile Strength
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-2xl font-bold ${getCompletionColor(profileCompletion)}`}>
                  {profileCompletion}%
                </span>
                <Badge className={getCompletionBadgeColor(profileCompletion)}>
                  {profileCompletion >= 80 ? "Strong" : profileCompletion >= 60 ? "Good" : "Needs Work"}
                </Badge>
              </div>
              <Progress value={profileCompletion} className="h-2" />
              <p className="text-xs text-gray-500 mt-2">
                Complete your profile to attract more opportunities
              </p>
            </CardContent>
          </Card>

          {/* Projects */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <TrendingUp size={16} />
                Projects
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-maasta-orange">{stats.projects}</div>
              <p className="text-xs text-gray-500">Total projects</p>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Star size={16} />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-maasta-purple">{stats.skills}</div>
              <p className="text-xs text-gray-500">Special skills</p>
            </CardContent>
          </Card>

          {/* Awards */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Award size={16} />
                Awards
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-yellow-600">{stats.awards}</div>
              <p className="text-xs text-gray-500">Achievements</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;
