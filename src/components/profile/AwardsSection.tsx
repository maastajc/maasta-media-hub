
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Award } from "lucide-react";
import { Artist } from "@/types/artist";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useProfileSectionUpdate } from "@/hooks/useProfileSectionUpdate";
import { validateAwardEntry } from "@/utils/profileValidation";
import { toast } from "sonner";

interface AwardsSectionProps {
  artist: Artist;
  isOwner: boolean;
  isEditing: boolean;
}

const AwardsSection = ({ artist, isOwner, isEditing }: AwardsSectionProps) => {
  const { user } = useAuth();
  const [newAward, setNewAward] = useState({
    title: "",
    organization: "",
    year: "",
    description: ""
  });

  const { handleSubmit, isSubmitting } = useProfileSectionUpdate({
    successMessage: "Award updated successfully!",
    errorMessage: "Failed to update award. Please try again."
  });

  const handleAddAward = async () => {
    if (!newAward.title.trim() || !user?.id) return;

    const yearNum = newAward.year ? parseInt(newAward.year) : undefined;
    const validation = validateAwardEntry(
      newAward.title.trim(),
      newAward.organization.trim(),
      yearNum || 0,
      artist.awards || []
    );

    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    await handleSubmit(async () => {
      const { error } = await supabase
        .from('awards')
        .insert({
          artist_id: user.id,
          title: newAward.title.trim(),
          organization: newAward.organization.trim() || null,
          year: yearNum || null,
          description: newAward.description.trim() || null
        });

      if (error) throw error;

      setNewAward({ title: "", organization: "", year: "", description: "" });
      window.location.reload();
    });
  };

  const handleDeleteAward = async (awardId: string) => {
    if (!user?.id) return;

    await handleSubmit(async () => {
      const { error } = await supabase
        .from('awards')
        .delete()
        .eq('id', awardId)
        .eq('artist_id', user.id);

      if (error) throw error;
      window.location.reload();
    }, {
      successMessage: "Award removed successfully!",
      errorMessage: "Failed to remove award. Please try again."
    });
  };

  if (!isEditing && (!artist.awards || artist.awards.length === 0)) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Award className="w-5 h-5 mr-2" />
          Awards & Recognition
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {artist.awards?.map((award) => (
            <div key={award.id} className="border-l-4 border-maasta-purple pl-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold">{award.title}</h4>
                  {award.organization && (
                    <p className="text-sm text-gray-600">{award.organization}</p>
                  )}
                  {award.year && (
                    <p className="text-sm text-gray-500">{award.year}</p>
                  )}
                  {award.description && (
                    <p className="text-sm text-gray-700 mt-1">{award.description}</p>
                  )}
                </div>
                {isEditing && isOwner && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAward(award.id)}
                    disabled={isSubmitting}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}

          {isEditing && isOwner && (
            <div className="border-t pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="award-title">Award Title *</Label>
                  <Input
                    id="award-title"
                    placeholder="e.g., Best Actor Award"
                    value={newAward.title}
                    onChange={(e) => setNewAward({ ...newAward, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="award-organization">Organization</Label>
                  <Input
                    id="award-organization"
                    placeholder="e.g., Film Festival Name"
                    value={newAward.organization}
                    onChange={(e) => setNewAward({ ...newAward, organization: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="award-year">Year</Label>
                  <Input
                    id="award-year"
                    type="number"
                    placeholder="2023"
                    value={newAward.year}
                    onChange={(e) => setNewAward({ ...newAward, year: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="award-description">Description</Label>
                  <Input
                    id="award-description"
                    placeholder="Brief description (optional)"
                    value={newAward.description}
                    onChange={(e) => setNewAward({ ...newAward, description: e.target.value })}
                  />
                </div>
              </div>
              <Button
                onClick={handleAddAward}
                disabled={isSubmitting}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Award
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AwardsSection;
