
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Award, Calendar } from "lucide-react";
import { useProfileSections } from "@/hooks/useProfileSections";
import { useToast } from "@/hooks/use-toast";

interface AwardsSectionProps {
  profileData: any;
  onUpdate: () => void;
  userId?: string;
}

const AwardsSection = ({ profileData, onUpdate, userId }: AwardsSectionProps) => {
  const [newAward, setNewAward] = useState({
    title: "",
    organization: "",
    year: "",
    description: ""
  });
  const [isAddingAward, setIsAddingAward] = useState(false);
  const { toast } = useToast();

  const { 
    saveAward, 
    deleteAward,
    isSaving,
    isDeleting 
  } = useProfileSections(userId);

  const awards = profileData?.awards || [];

  const handleAddAward = async () => {
    if (!newAward.title.trim() || !userId) return;

    try {
      setIsAddingAward(true);
      await saveAward({
        title: newAward.title.trim(),
        organization: newAward.organization.trim(),
        year: newAward.year ? parseInt(newAward.year) : null,
        description: newAward.description.trim()
      });
      setNewAward({ title: "", organization: "", year: "", description: "" });
      onUpdate();
      toast({
        title: "✅ Award added successfully!",
        description: "Your award has been updated in your profile.",
      });
    } catch (error: any) {
      console.error("Error adding award:", error.message);
      toast({
        title: "❌ Failed to add award",
        description: error.message || "Failed to add award. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAddingAward(false);
    }
  };

  const handleDeleteAward = async (awardId: string) => {
    try {
      await deleteAward(awardId);
      onUpdate();
      toast({
        title: "✅ Award deleted",
        description: "Award has been removed from your profile.",
      });
    } catch (error: any) {
      console.error("Error deleting award:", error.message);
      toast({
        title: "❌ Failed to delete award",
        description: error.message || "Failed to delete award. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5 text-maasta-purple" />
          Awards & Achievements ({awards.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Award Form */}
        <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              placeholder="Award title..."
              value={newAward.title}
              onChange={(e) => setNewAward(prev => ({ ...prev, title: e.target.value }))}
            />
            <Input
              placeholder="Organization..."
              value={newAward.organization}
              onChange={(e) => setNewAward(prev => ({ ...prev, organization: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              placeholder="Year (optional)..."
              type="number"
              value={newAward.year}
              onChange={(e) => setNewAward(prev => ({ ...prev, year: e.target.value }))}
            />
            <Input
              placeholder="Description (optional)..."
              value={newAward.description}
              onChange={(e) => setNewAward(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <Button 
            onClick={handleAddAward}
            disabled={!newAward.title.trim() || isAddingAward || isSaving}
            className="bg-maasta-purple hover:bg-maasta-purple/90 w-full"
          >
            <Plus size={16} className="mr-1" />
            {isAddingAward ? "Adding..." : "Add Award"}
          </Button>
        </div>

        {/* Awards List */}
        <div className="space-y-4">
          {awards.map((award: any) => (
            <div key={award.id} className="border-l-4 border-maasta-purple pl-4 py-3 bg-white rounded-lg border border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{award.title}</h4>
                  {award.organization && (
                    <p className="text-maasta-orange font-medium">{award.organization}</p>
                  )}
                  {award.description && (
                    <p className="text-gray-600 mt-1">{award.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {award.year && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Calendar size={12} />
                      {award.year}
                    </Badge>
                  )}
                  <button
                    onClick={() => handleDeleteAward(award.id)}
                    disabled={isDeleting}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {awards.length === 0 && (
          <p className="text-gray-500 text-center py-8">No awards or achievements added yet</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AwardsSection;
