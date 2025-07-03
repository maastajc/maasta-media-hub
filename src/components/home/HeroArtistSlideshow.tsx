
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const staticImages = [
  {
    id: '1',
    url: '/lovable-uploads/979dd046-df26-4909-8770-94811e8b8bb4.png',
    name: 'A.R. Rahman',
    category: 'Music Director',
    city: 'Chennai'
  },
  {
    id: '2', 
    url: '/lovable-uploads/364dea32-c41b-481c-b9be-85bfd2527137.png',
    name: 'Ilaiyaraaja',
    category: 'Music Composer',
    city: 'Chennai'
  },
  {
    id: '3',
    url: '/lovable-uploads/b17c8eea-6ca4-47e9-8bb6-78e0dc2ef0dc.png',
    name: 'Vetrimaaran',
    category: 'Director',
    city: 'Chennai'
  },
  {
    id: '4',
    url: '/lovable-uploads/3f2b7600-4607-482e-b255-d7b3206b6aa2.png',
    name: 'K. Balachander',
    category: 'Director',
    city: 'Chennai'
  },
  {
    id: '5',
    url: '/lovable-uploads/0fd6eadc-11af-4bc7-ba45-407a18405763.png',
    name: 'Ajith Kumar',
    category: 'Actor',
    city: 'Chennai'
  },
  {
    id: '6',
    url: '/lovable-uploads/7e463092-6803-48ec-9f5b-d17704010136.png',
    name: 'Vijay',
    category: 'Actor',
    city: 'Chennai'
  },
  {
    id: '7',
    url: '/lovable-uploads/76a29572-bd52-4fd3-ba5c-2e1431ad588f.png',
    name: 'Kamal Haasan',
    category: 'Actor',
    city: 'Chennai'
  },
  {
    id: '8',
    url: '/https://igimage.indiaglitz.com/tamil/home/annamalai27062022m.jpg',
    name: 'Rajinikanth',
    category: 'Actor',
    city: 'Chennai'
  }
];

const HeroArtistSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % staticImages.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % staticImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + staticImages.length) % staticImages.length);
  };

  const currentArtist = staticImages[currentSlide];

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-maasta-orange/30 to-maasta-purple/30 rounded-3xl blur-xl transform rotate-3"></div>
      <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-500 border-4 border-white/50">
        <div className="relative h-64 md:h-80">
          <img 
            src={currentArtist.url}
            alt={`${currentArtist.name} - ${currentArtist.category}`}
            className="w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <div className="text-xl font-bold mb-1">{currentArtist.name}</div>
            <div className="text-sm opacity-90 flex items-center gap-2">
              <span className="w-2 h-2 bg-maasta-orange rounded-full"></span>
              {currentArtist.category} • {currentArtist.city}
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
            {staticImages.map((_, index) => (
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
