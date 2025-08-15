import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, UserPlus, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function UnauthenticatedProfile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-primary/20">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Join Maasta
          </CardTitle>
          <p className="text-muted-foreground">
            Create your profile to showcase your talent and connect with the entertainment industry
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={() => navigate('/sign-up')}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 font-semibold"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Sign Up
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Already have an account?</span>
            </div>
          </div>
          
          <Button 
            onClick={() => navigate('/sign-in')}
            variant="outline"
            className="w-full h-12 font-semibold border-primary/20 hover:bg-primary/5"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Sign In
          </Button>
          
          <div className="text-center text-sm text-muted-foreground pt-4">
            <p>Join thousands of talented artists building their careers on Maasta</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}