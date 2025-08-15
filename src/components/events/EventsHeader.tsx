import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const EventsHeader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Maasta Events
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
        Discover amazing contests, concerts, meetups, cultural fests, and workshops. 
        Book your seats and join the media & entertainment community.
      </p>
      
      {user && (
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          onClick={() => navigate('/events/create')}
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Event
        </Button>
      )}
    </div>
  );
};

export { EventsHeader };