
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { PlusCircle } from "lucide-react";

const AuditionsHeader = () => {
  const { profile } = useAuth();
  const isRecruiter = profile?.role === 'recruiter';

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Audition Listings</h1>
            <p className="mt-1 text-md text-gray-600">
              Discover your next role from our curated list of opportunities.
            </p>
          </div>
          {isRecruiter && (
             <Button asChild>
                <Link to="/auditions/create">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Post an Audition
                </Link>
              </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditionsHeader;
