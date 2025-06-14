
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, CheckCircle } from "lucide-react";

interface ProfileStrengthCardProps {
  profileData: any;
  completionPercentage: number;
}
const ProfileStrengthCard: React.FC<ProfileStrengthCardProps> = ({
  profileData,
  completionPercentage,
}) => (
  <Card className="mt-8 border-0 shadow-md">
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
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">{completionPercentage}%</div>
          <div className="text-xs text-gray-500">Complete</div>
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
          <CheckCircle className={`w-4 h-4 ${profileData?.full_name ? 'text-green-500' : 'text-gray-300'}`} />
          <span className={`text-sm ${profileData?.full_name ? 'text-gray-900' : 'text-gray-500'}`}>Basic Info</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className={`w-4 h-4 ${profileData?.projects?.length ? 'text-green-500' : 'text-gray-300'}`} />
          <span className={`text-sm ${profileData?.projects?.length ? 'text-gray-900' : 'text-gray-500'}`}>Projects</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className={`w-4 h-4 ${profileData?.special_skills?.length ? 'text-green-500' : 'text-gray-300'}`} />
          <span className={`text-sm ${profileData?.special_skills?.length ? 'text-gray-900' : 'text-gray-500'}`}>Skills</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className={`w-4 h-4 ${profileData?.media_assets?.length ? 'text-green-500' : 'text-gray-300'}`} />
          <span className={`text-sm ${profileData?.media_assets?.length ? 'text-gray-900' : 'text-gray-500'}`}>Portfolio</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default ProfileStrengthCard;
