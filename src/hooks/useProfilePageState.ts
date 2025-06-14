
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useArtistProfile } from "@/hooks/useArtistProfile";
import { useSafeProfile } from "@/hooks/useSafeProfile";

/**
 * Encapsulate all state and data loading logic for the profile page.
 * Exposes: user, profileData, error/loading/welcome/editing states, and actions (tab switching, share, etc).
 */
export const useProfilePageState = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Data loading
  const { profile: rawProfileData, isLoading, isError, error, refetch } = useArtistProfile();
  const profileData = useSafeProfile(rawProfileData, user?.id);

  useEffect(() => {
    if (!user) {
      navigate("/sign-in");
      return;
    }

    if (!isLoading && !isError && (!rawProfileData || !rawProfileData.full_name || rawProfileData.full_name === 'New User')) {
      setShowWelcome(true);
    }
    setIsInitializing(false);
  }, [user, navigate, isLoading, isError, rawProfileData]);

  useEffect(() => {
    if (isError || !user) {
      console.error("[ProfilePage] Error status:", error, "user:", user);
    }
    if (error) {
      console.error("[ProfilePage] Profile load error:", error);
    }
  }, [isError, error, user]);
  
  useEffect(() => {
    if (!isLoading && profileData) {
      console.log("[ProfilePage] profileData:", profileData);
      if (!profileData.id) {
        console.warn("[ProfilePage] Missing profileData.id!", profileData);
      }
    }
  }, [isLoading, profileData]);

  // Return all props needed by the page and child components
  return {
    user,
    profileData,
    rawProfileData,
    isLoading,
    isError,
    error,
    showWelcome,
    setShowWelcome,
    isInitializing,
    setIsInitializing,
    isEditingProfile,
    setIsEditingProfile,
    activeTab,
    setActiveTab,
    refetch,
    toast,
    navigate,
  };
};
