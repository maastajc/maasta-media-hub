
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Award, 
  Camera, 
  GraduationCap, 
  Star,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  Share2
} from "lucide-react";
import { Artist } from "@/types/artist";
import { useToast } from "@/hooks/use-toast";

interface ProfileStatsProps {
  artist: Artist;
}

const ProfileStats = ({ artist }: ProfileStatsProps) => {
  const { toast } = useToast();

  const stats = [
    {
      icon: Award,
      label: "Projects",
      value: artist.projects?.length || 0,
      color: "text-maasta-orange",
      bgColor: "bg-orange-50"
    },
    {
      icon: Camera,
      label: "Media Assets",
      value: artist.media_assets?.length || 0,
      color: "text-maasta-purple",
      bgColor: "bg-purple-50"
    },
    {
      icon: Star,
      label: "Skills",
      value: artist.special_skills?.length || 0,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      icon: GraduationCap,
      label: "Education",
      value: artist.education_training?.length || 0,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    }
  ];

  const completionPercentage = Math.round(
    (stats.reduce((acc, stat) => acc + (stat.value > 0 ? 1 : 0), 0) / stats.length) * 100
  );

  const handleShare = async () => {
    const profileUrl = `${window.location.origin}/artists/${artist.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${artist.full_name} - Artist Profile`,
          text: `Check out ${artist.full_name}'s profile on Maasta`,
          url: profileUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(profileUrl);
      toast({
        title: "Link copied",
        description: "Profile link copied to clipboard",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Profile Completion */}
      <Card className="mb-8 border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Profile Strength</h3>
                <p className="text-sm text-gray-600">Complete your profile to attract more opportunities</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{completionPercentage}%</div>
                <div className="text-xs text-gray-500">Complete</div>
              </div>
              <Button 
                onClick={handleShare}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share Profile
              </Button>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className={`w-4 h-4 ${artist.full_name ? 'text-green-500' : 'text-gray-300'}`} />
              <span className={`text-sm ${artist.full_name ? 'text-gray-900' : 'text-gray-500'}`}>
                Basic Info
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className={`w-4 h-4 ${artist.projects?.length ? 'text-green-500' : 'text-gray-300'}`} />
              <span className={`text-sm ${artist.projects?.length ? 'text-gray-900' : 'text-gray-500'}`}>
                Projects
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className={`w-4 h-4 ${artist.special_skills?.length ? 'text-green-500' : 'text-gray-300'}`} />
              <span className={`text-sm ${artist.special_skills?.length ? 'text-gray-900' : 'text-gray-500'}`}>
                Skills
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className={`w-4 h-4 ${artist.media_assets?.length ? 'text-green-500' : 'text-gray-300'}`} />
              <span className={`text-sm ${artist.media_assets?.length ? 'text-gray-900' : 'text-gray-500'}`}>
                Portfolio
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileStats;
