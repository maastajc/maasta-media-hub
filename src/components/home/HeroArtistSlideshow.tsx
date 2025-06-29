
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HeroArtistSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const artistImages = [
    {
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=face",
      name: "Raj Kumar",
      category: "Lead Actor"
    },
    {
      url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=400&fit=crop&crop=face",
      name: "Priya Sharma",
      category: "Classical Dancer"
    },
    {
      url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=400&fit=crop&crop=face",
      name: "Arjun Singh",
      category: "Music Director"
    },
    {
      url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=400&fit=crop&crop=face",
      name: "Kavya Menon",
      category: "Playback Singer"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % artistImages.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [artistImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % artistImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + artistImages.length) % artistImages.length);
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-maasta-orange/30 to-maasta-purple/30 rounded-3xl blur-xl transform rotate-3 animate-pulse"></div>
      <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-500 border-4 border-white/50">
        <div className="relative h-64 md:h-80">
          <img 
            src={artistImages[currentSlide].url}
            alt={`${artistImages[currentSlide].name} - ${artistImages[currentSlide].category}`}
            className="w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <div className="text-xl font-bold mb-1">{artistImages[currentSlide].name}</div>
            <div className="text-sm opacity-90 flex items-center gap-2">
              <span className="w-2 h-2 bg-maasta-orange rounded-full animate-pulse"></span>
              {artistImages[currentSlide].category}
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
            {artistImages.map((_, index) => (
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
      <div className="absolute -top-6 -right-6 bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-xl p-4 transform rotate-6 hover:rotate-12 transition-transform duration-300 animate-fade-in border-l-4 border-maasta-orange" style={{ animationDelay: '1s' }}>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full animate-pulse"></div>
          <div>
            <div className="text-sm font-bold text-gray-800">Featured Artist</div>
            <div className="text-xs text-gray-600">Verified Profile</div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-xl p-4 transform -rotate-6 hover:-rotate-12 transition-transform duration-300 animate-fade-in border-l-4 border-maasta-purple" style={{ animationDelay: '1.2s' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-maasta-orange to-maasta-purple rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">⭐</span>
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
