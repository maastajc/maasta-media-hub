
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";

interface SessionDebugProps {
  showDetails?: boolean;
}

export const SessionDebug = ({ showDetails = false }: SessionDebugProps) => {
  const { session, sessionValid, user, loading, refreshSession } = useAuth();

  if (!showDetails && sessionValid) {
    return null; // Don't show when everything is working
  }

  const getSessionStatus = () => {
    if (loading) return { status: 'loading', color: 'secondary', icon: RefreshCw };
    if (!session) return { status: 'no session', color: 'destructive', icon: AlertTriangle };
    if (!sessionValid) return { status: 'invalid', color: 'destructive', icon: AlertTriangle };
    return { status: 'valid', color: 'success', icon: CheckCircle };
  };

  const { status, color, icon: Icon } = getSessionStatus();

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Icon className="h-4 w-4" />
          Session Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant={color === 'success' ? 'default' : 'destructive'}>
            {status}
          </Badge>
          {!sessionValid && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={refreshSession}
              className="h-6 px-2 text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
          )}
        </div>
        
        {showDetails && (
          <div className="text-xs text-gray-600 space-y-1">
            <div>User: {user ? 'Logged in' : 'Not logged in'}</div>
            <div>Session: {session ? 'Present' : 'Missing'}</div>
            {session && (
              <div>Expires: {new Date(session.expires_at! * 1000).toLocaleString()}</div>
            )}
          </div>
        )}
        
        {!sessionValid && (
          <p className="text-xs text-orange-700">
            Try refreshing your session or clearing browser data if issues persist.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
