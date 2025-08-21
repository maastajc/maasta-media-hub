
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface NetworkingPreferencesProps {
  onPreferencesUpdate: () => void;
}

const NetworkingPreferences = ({ onPreferencesUpdate }: NetworkingPreferencesProps) => {
  const [open, setOpen] = useState(false);
  const [preferences, setPreferences] = useState({
    preferred_roles: [] as string[],
    preferred_location: "",
    preferred_experience: "",
    age_range_min: "",
    age_range_max: "",
    max_distance_km: ""
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const roles = [
    "actor", "director", "musician", "producer", "writer", 
    "cinematographer", "editor", "sound_engineer", "dancer", "singer"
  ];

  const experienceLevels = [
    "beginner", "intermediate", "advanced", "professional"
  ];

  useEffect(() => {
    if (open && user) {
      loadPreferences();
    }
  }, [open, user]);

  const loadPreferences = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('network_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading preferences:', error);
        return;
      }

      if (data) {
        setPreferences({
          preferred_roles: data.preferred_roles || [],
          preferred_location: data.preferred_location || "",
          preferred_experience: data.preferred_experience || "",
          age_range_min: data.age_range_min?.toString() || "",
          age_range_max: data.age_range_max?.toString() || "",
          max_distance_km: data.max_distance_km?.toString() || ""
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreferences = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const preferencesData = {
        user_id: user.id,
        preferred_roles: preferences.preferred_roles,
        preferred_location: preferences.preferred_location || null,
        preferred_experience: preferences.preferred_experience || null,
        age_range_min: preferences.age_range_min ? parseInt(preferences.age_range_min) : null,
        age_range_max: preferences.age_range_max ? parseInt(preferences.age_range_max) : null,
        max_distance_km: preferences.max_distance_km ? parseInt(preferences.max_distance_km) : null
      };

      const { error } = await supabase
        .from('network_preferences')
        .upsert(preferencesData, { onConflict: 'user_id' });

      if (error) throw error;

      toast.success("Preferences saved successfully!");
      setOpen(false);
      onPreferencesUpdate();
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error("Failed to save preferences");
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = (role: string) => {
    setPreferences(prev => ({
      ...prev,
      preferred_roles: prev.preferred_roles.includes(role)
        ? prev.preferred_roles.filter(r => r !== role)
        : [...prev.preferred_roles, role]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Networking Preferences</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Preferred Roles</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {roles.map((role) => (
                <Button
                  key={role}
                  variant={preferences.preferred_roles.includes(role) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleRole(role)}
                  className="text-xs"
                >
                  {role}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="location">Preferred Location</Label>
            <Input
              id="location"
              placeholder="e.g., Mumbai, Chennai"
              value={preferences.preferred_location}
              onChange={(e) => setPreferences(prev => ({ ...prev, preferred_location: e.target.value }))}
            />
          </div>

          <div>
            <Label>Experience Level</Label>
            <Select
              value={preferences.preferred_experience}
              onValueChange={(value) => setPreferences(prev => ({ ...prev, preferred_experience: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any experience level</SelectItem>
                {experienceLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="min-age">Min Age</Label>
              <Input
                id="min-age"
                type="number"
                placeholder="18"
                value={preferences.age_range_min}
                onChange={(e) => setPreferences(prev => ({ ...prev, age_range_min: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="max-age">Max Age</Label>
              <Input
                id="max-age"
                type="number"
                placeholder="65"
                value={preferences.age_range_max}
                onChange={(e) => setPreferences(prev => ({ ...prev, age_range_max: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="distance">Max Distance (km)</Label>
            <Input
              id="distance"
              type="number"
              placeholder="50"
              value={preferences.max_distance_km}
              onChange={(e) => setPreferences(prev => ({ ...prev, max_distance_km: e.target.value }))}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={savePreferences} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NetworkingPreferences;
