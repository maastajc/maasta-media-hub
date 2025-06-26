
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';

interface PosterProfile {
  id: string;
  full_name: string;
  profile_picture?: string;
  bio?: string;
}

interface AuditionPosterProfileProps {
  posterProfile: PosterProfile;
}

export const AuditionPosterProfile = ({ posterProfile }: AuditionPosterProfileProps) => {
  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Posted By</h3>
        <Link 
          to={`/artists/${posterProfile.id}`}
          className="flex items-center space-x-4 hover:bg-gray-50 p-3 rounded-lg transition-colors"
        >
          <Avatar className="h-12 w-12">
            <AvatarImage 
              src={posterProfile.profile_picture} 
              alt={posterProfile.full_name}
            />
            <AvatarFallback>
              <User className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <p className="text-base font-medium text-gray-900 hover:text-maasta-purple transition-colors">
              {posterProfile.full_name}
            </p>
            <p className="text-sm text-maasta-purple font-medium">View Profile →</p>
          </div>
        </Link>
        
        {posterProfile.bio && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 line-clamp-3">{posterProfile.bio}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
