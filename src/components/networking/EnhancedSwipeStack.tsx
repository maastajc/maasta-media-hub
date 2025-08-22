
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import EnhancedSwipeCard from "./EnhancedSwipeCard";
import { Button } from "@/components/ui/button";
import { RefreshCw, Heart } from "lucide-react";

interface EnhancedSwipeStackProps {
  users: any[];
  onRefresh: () => void;
}

const PRELOAD_COUNT = 5; // Number of profiles to preload

const EnhancedSwipeStack = ({ users, onRefresh }: EnhancedSwipeStackProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [swipedUsers, setSwipedUsers] = useState(new Set<string>());
  const [preloadedProfiles, setPreloadedProfiles] = useState(new Map());
  const { user } = useAuth();

  // Preload profiles for better performance
  useEffect(() => {
    if (users.length > 0 && currentIndex < users.length) {
      preloadNextProfiles();
    }
  }, [currentIndex, users]);

  const preloadNextProfiles = async () => {
    const startIndex = currentIndex;
    const endIndex = Math.min(currentIndex + PRELOAD_COUNT, users.length);
    const profilesToLoad = users.slice(startIndex, endIndex);
    
    const newPreloaded = new Map(preloadedProfiles);
    
    for (const profile of profilesToLoad) {
      if (!newPreloaded.has(profile.id)) {
        try {
          // Load full profile data including media, projects, etc.
          const { data: fullProfile, error } = await supabase
            .from('profiles')
            .select(`
              *,
              media_assets (id, url, file_type, is_video, description),
              projects (id, project_name, role_in_project, project_type, year_of_release, director_producer),
              special_skills (id, skill),
              awards (id, title, organization, year),
              education_training (id, qualification_name, institution, year_completed),
              tools_software (id, tool_name)
            `)
            .eq('id', profile.id)
            .single();

          if (error) {
            console.error('Error preloading profile:', error);
            continue;
          }

          newPreloaded.set(profile.id, fullProfile);
        } catch (error) {
          console.error('Error preloading profile:', error);
        }
      }
    }
    
    setPreloadedProfiles(newPreloaded);
  };

  const handleSwipeLeft = async (userId: string) => {
    if (!user) return;
    
    console.log('Handling swipe left for user:', userId);
    
    setSwipedUsers(prev => new Set(prev).add(userId));
    
    // Move to next profile immediately for better UX
    setCurrentIndex(prev => prev + 1);
    
    // Store rejected connections in background (fire and forget)
    const insertRejection = async () => {
      try {
        await supabase
          .from('connections')
          .insert({
            user_id: user.id,
            target_user_id: userId,
            status: 'rejected'
          });
        console.log('Rejection stored successfully');
      } catch (error) {
        console.error('Error storing rejection:', error);
      }
    };
    insertRejection();
  };

  const handleSwipeRight = async (userId: string) => {
    if (!user) return;
    
    console.log('Handling swipe right for user:', userId);
    
    setLoading(true);
    setSwipedUsers(prev => new Set(prev).add(userId));
    
    // Move to next profile immediately for better UX
    setCurrentIndex(prev => prev + 1);
    
    try {
      // Create connection with timeout
      const insertPromise = supabase
        .from('connections')
        .insert({
          user_id: user.id,
          target_user_id: userId,
          status: 'pending'
        });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 5000)
      );

      await Promise.race([insertPromise, timeoutPromise]);

      // Check for mutual connection with timeout
      const checkPromise = supabase
        .from('connections')
        .select('*')
        .eq('user_id', userId)
        .eq('target_user_id', user.id)
        .eq('status', 'pending')
        .maybeSingle();

      const { data: existingConnection } = await Promise.race([
        checkPromise, 
        new Promise((resolve) => setTimeout(() => resolve({ data: null }), 3000))
      ]) as { data: any };

      if (existingConnection) {
        // Mutual connection! Update both to connected
        await Promise.race([
          Promise.all([
            supabase
              .from('connections')
              .update({ status: 'connected' })
              .eq('id', existingConnection.id),
            supabase
              .from('connections')
              .update({ status: 'connected' })
              .eq('user_id', user.id)
              .eq('target_user_id', userId)
          ]),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Update timeout')), 3000)
          )
        ]);

        toast.success("It's a match! You can now chat with this person.");
      } else {
        toast.success("Connection request sent!");
      }
    } catch (error) {
      console.error('Error creating connection:', error);
      if (error.message === 'Request timeout') {
        toast.error("Connection is slow, but your request was sent!");
      } else {
        toast.error("Failed to send connection request");
      }
    } finally {
      setLoading(false);
    }
  };

  const currentUser = users[currentIndex];
  const nextUser = users[currentIndex + 1];
  const hasMoreUsers = currentIndex < users.length;

  // Get preloaded profile data
  const currentUserData = currentUser ? preloadedProfiles.get(currentUser.id) || currentUser : null;
  const nextUserData = nextUser ? preloadedProfiles.get(nextUser.id) || nextUser : null;

  if (!hasMoreUsers) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <Heart className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold mb-2">No more profiles</h3>
        <p className="text-gray-600 mb-6">You've seen all available profiles. Check back later for new people!</p>
        <Button onClick={onRefresh} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Next card (underneath) */}
      {nextUserData && (
        <div className="absolute inset-0 transform scale-95 opacity-50 z-0 pointer-events-none">
          <EnhancedSwipeCard
            user={nextUserData}
            onSwipeLeft={() => {}}
            onSwipeRight={() => {}}
            isPreview={true}
          />
        </div>
      )}
      
      {/* Current card */}
      {currentUserData && (
        <div className="relative z-10">
          <EnhancedSwipeCard
            user={currentUserData}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            isPreview={false}
          />
        </div>
      )}
      
      {loading && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-20">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="animate-spin w-6 h-6 border-2 border-maasta-purple border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-sm">Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedSwipeStack;
