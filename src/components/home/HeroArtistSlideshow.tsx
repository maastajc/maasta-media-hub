
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Artist {
  id: string;
  full_name: string;
  profile_picture_url?: string;
  category?: string;
  city?: string;
}

const HeroArtistSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedArtists = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, profile_picture_url, category, city')
          .eq('role', 'artist')
          .eq('status', 'active')
          .not('profile_picture_url', 'is', null)
          .limit(8)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching artists:', error);
          return;
        }

        if (data && data.length > 0) {
          setArtists(data);
        }
      } catch (error) {
        console.error('Error fetching featured artists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedArtists();
  }, []);

  useEffect(() => {
    if (artists.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % artists.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [artists.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % artists.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + artists.length) % artists.length);
  };

  if (loading || artists.length === 0) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-maasta-orange/30 to-maasta-purple/30 rounded-3xl blur-xl transform rotate-3"></div>
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-500 border-4 border-white/50">
          <div className="h-64 md:h-80 bg-gray-200 animate-pulse flex items-center justify-center">
            <span className="text-gray-500">Loading artists...</span>
          </div>
        </div>
      </div>
    );
  }

  const currentArtist = artists[currentSlide];

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-maasta-orange/30 to-maasta-purple/30 rounded-3xl blur-xl transform rotate-3"></div>
      <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-500 border-4 border-white/50">
        <div className="relative h-64 md:h-80">
          <img 
            src={currentArtist.profile_picture_url || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=face`}
            alt={`${currentArtist.full_name} - ${currentArtist.category || 'Artist'}`}
            className="w-full h-full object-cover transition-all duration-500"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=face`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <div className="text-xl font-bold mb-1">{currentArtist.full_name}</div>
            <div className="text-sm opacity-90 flex items-center gap-2">
              <span className="w-2 h-2 bg-maasta-orange rounded-full"></span>
              {currentArtist.category || 'Artist'} {currentArtist.city && `• ${currentArtist.city}`}
            </div>
          </div>
          
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
          
          {/* Slide Indicators */}
          <div className="absolute bottom-3 right-6 flex space-x-2">
            {artists.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Industry-Specific Floating Cards */}
      <div className="absolute -top-6 -right-6 bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-xl p-4 transform rotate-6 hover:rotate-12 transition-transform duration-300 border-l-4 border-maasta-orange">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
          <div>
            <div className="text-sm font-bold text-gray-800">Featured Artist</div>
            <div className="text-xs text-gray-600">Verified Profile</div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-xl p-4 transform -rotate-6 hover:-rotate-12 transition-transform duration-300 border-l-4 border-maasta-purple">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-maasta-orange to-maasta-purple rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">★</span>
          </div>
          <div>
            <div className="text-sm font-bold text-gray-800">Tamil Cinema</div>
            <div className="text-xs text-gray-600">Rising Star</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroArtistSlideshow;
