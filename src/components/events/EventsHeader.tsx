import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const EventsHeader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="relative bg-gradient-to-br from-primary to-secondary py-16 mb-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
      </div>
      
      <div className="relative text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
          Maasta Events
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl mx-auto">
          Discover amazing contests, concerts, meetups, cultural fests, and workshops. 
          Book your seats and join the media & entertainment community.
        </p>
        
        {user && (
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 transform hover:scale-105 transition-all duration-300"
            onClick={() => navigate('/events/create')}
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Event
          </Button>
        )}
      </div>
    </div>
  );
};

export { EventsHeader };