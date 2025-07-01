
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "./badge";

export const SessionStatus = () => {
  const { user, session, isSessionRestored, loading } = useAuth();

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white/90 backdrop-blur-sm border rounded-lg p-3 shadow-lg text-sm">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">Auth Status:</span>
          <Badge variant={loading ? "secondary" : isSessionRestored ? "default" : "destructive"}>
            {loading ? "Loading" : isSessionRestored ? "Ready" : "Restoring"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Session:</span>
          <Badge variant={session ? "default" : "secondary"}>
            {session ? "Active" : "None"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">User:</span>
          <Badge variant={user ? "default" : "secondary"}>
            {user ? "Signed In" : "Anonymous"}
          </Badge>
        </div>
      </div>
    </div>
  );
};
