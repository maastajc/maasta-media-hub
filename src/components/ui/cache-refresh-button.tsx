
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { cacheManager } from "@/utils/cacheManager";
import { toast } from "sonner";
import { useState } from "react";

interface CacheRefreshButtonProps {
  onRefresh?: () => void;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
}

export const CacheRefreshButton = ({ 
  onRefresh, 
  variant = "outline", 
  size = "sm",
  className 
}: CacheRefreshButtonProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Clear all caches
      cacheManager.clearAllCaches();
      cacheManager.updateVersion();
      
      // Call custom refresh function if provided
      if (onRefresh) {
        await onRefresh();
      }
      
      // Force reload the page to ensure fresh data
      window.location.reload();
      
      toast.success("Cache cleared and data refreshed");
    } catch (error) {
      console.error("Error refreshing cache:", error);
      toast.error("Failed to refresh cache");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleRefresh}
      disabled={isRefreshing}
      className={className}
    >
      <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
      {isRefreshing ? 'Refreshing...' : 'Refresh'}
    </Button>
  );
};
