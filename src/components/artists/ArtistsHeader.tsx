
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ArtistsHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onRefresh: () => void;
}

const ArtistsHeader = ({ searchTerm, setSearchTerm, onRefresh }: ArtistsHeaderProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleJoinAsArtist = () => {
    if (user) {
      navigate("/profile");
    } else {
      navigate("/sign-up");
    }
  };

  return (
    <section className="bg-maasta-purple/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Discover Artists</h1>
            <p className="text-lg text-gray-600 mb-8">
              Connect with talented professionals from across the media industry
            </p>
          </div>
          <Button 
            className="bg-maasta-orange hover:bg-maasta-orange/90"
            onClick={handleJoinAsArtist}
          >
            Join as an Artist
          </Button>
        </div>
        
        {/* Search and filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search by name or bio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="hidden md:block">
            <Button 
              className="bg-maasta-orange hover:bg-maasta-orange/90"
              onClick={onRefresh}
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtistsHeader;
