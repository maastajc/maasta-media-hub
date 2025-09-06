import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SwipeCard from "./SwipeCard";
import { Button } from "@/components/ui/button";
import { RefreshCw, Heart } from "lucide-react";

interface SwipeStackProps {
  users: any[];
  onRefresh: () => void;
}

const SwipeStack = ({ users, onRefresh }: SwipeStackProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSwipeLeft = async (userId: string) => {
    if (!user) return;
    
    setCurrentIndex(prev => prev + 1);
    
    try {
      await supabase
        .from('connections')
        .insert({
          user_id: user.id,
          target_user_id: userId,
          status: 'rejected'
        });
    } catch (error) {
      console.error('Error storing rejection:', error);
    }
  };

  const handleSwipeRight = async (userId: string) => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Create connection request
      const { error: insertError } = await supabase
        .from('connections')
        .insert({
          user_id: user.id,
          target_user_id: userId,
          status: 'pending'
        });

      if (insertError) throw insertError;

      // Check for mutual connection
      const { data: existingConnection, error: checkError } = await supabase
        .from('connections')
        .select('*')
        .eq('user_id', userId)
        .eq('target_user_id', user.id)
        .eq('status', 'pending')
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingConnection) {
        // Mutual connection! Update both to connected
        await supabase
          .from('connections')
          .update({ status: 'connected' })
          .eq('id', existingConnection.id);

        await supabase
          .from('connections')
          .update({ status: 'connected' })
          .eq('user_id', user.id)
          .eq('target_user_id', userId);

        toast.success("It's a match! You can now chat with this person.");
      } else {
        toast.success("Connection request sent!");
      }
    } catch (error) {
      console.error('Error creating connection:', error);
      toast.error("Failed to send connection request");
    } finally {
      setLoading(false);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const currentUser = users[currentIndex];
  const hasMoreUsers = currentIndex < users.length;

  if (!hasMoreUsers) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <Heart className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No more profiles</h3>
        <p className="text-muted-foreground mb-6">You've seen all available profiles. Check back later for new people!</p>
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
      {users[currentIndex + 1] && (
        <div className="absolute inset-0 transform scale-95 opacity-50">
          <SwipeCard
            user={users[currentIndex + 1]}
            onSwipeLeft={() => {}}
            onSwipeRight={() => {}}
          />
        </div>
      )}
      
      {/* Current card */}
      <SwipeCard
        user={currentUser}
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
      />
      
      {loading && (
        <div className="absolute inset-0 bg-background/20 flex items-center justify-center">
          <div className="bg-card p-4 rounded-lg shadow-lg">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-sm">Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwipeStack;