import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Brain } from "lucide-react";
import { useProfileSections } from "@/hooks/useProfileSections";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SkillsSectionProps {
  profileData: any;
  onUpdate: () => void;
  userId?: string;
}

const SkillsSection = ({ profileData, onUpdate, userId }: SkillsSectionProps) => {
  const [newSkill, setNewSkill] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [newLanguageProficiency, setNewLanguageProficiency] = useState("beginner");
  const [newTool, setNewTool] = useState("");
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [isAddingLanguage, setIsAddingLanguage] = useState(false);
  const [isAddingTool, setIsAddingTool] = useState(false);

  const { 
    saveSkill, 
    deleteSkill, 
    saveLanguage, 
    deleteLanguage, 
    saveTool, 
    deleteTool,
    isSaving,
    isDeleting 
  } = useProfileSections(userId);

  const skills = profileData?.special_skills || [];
  const languages = profileData?.language_skills || [];
  const tools = profileData?.tools_software || [];

  const handleAddSkill = async () => {
    if (!newSkill.trim() || !userId) return;

    try {
      setIsAddingSkill(true);
      await saveSkill({ skill: newSkill.trim() });
      setNewSkill("");
      onUpdate();
      toast.success("Skill added successfully");
    } catch (error: any) {
      console.error("Error adding skill:", error.message);
      toast.error("Failed to add skill");
    } finally {
      setIsAddingSkill(false);
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    try {
      await deleteSkill(skillId);
      onUpdate();
      toast.success("Skill deleted successfully");
    } catch (error: any) {
      console.error("Error deleting skill:", error.message);
      toast.error("Failed to delete skill");
    }
  };

  const handleAddLanguage = async () => {
    if (!newLanguage.trim() || !userId) return;

    try {
      setIsAddingLanguage(true);
      await saveLanguage({ 
        language: newLanguage.trim(), 
        proficiency: newLanguageProficiency 
      });
      setNewLanguage("");
      setNewLanguageProficiency("beginner");
      onUpdate();
      toast.success("Language added successfully");
    } catch (error: any) {
      console.error("Error adding language:", error.message);
      toast.error("Failed to add language");
    } finally {
      setIsAddingLanguage(false);
    }
  };

  const handleDeleteLanguage = async (languageId: string) => {
    try {
      await deleteLanguage(languageId);
      onUpdate();
      toast.success("Language deleted successfully");
    } catch (error: any) {
      console.error("Error deleting language:", error.message);
      toast.error("Failed to delete language");
    }
  };

  const handleAddTool = async () => {
    if (!newTool.trim() || !userId) return;

    try {
      setIsAddingTool(true);
      await saveTool({ tool_name: newTool.trim() });
      setNewTool("");
      onUpdate();
      toast.success("Tool added successfully");
    } catch (error: any) {
      console.error("Error adding tool:", error.message);
      toast.error("Failed to add tool");
    } finally {
      setIsAddingTool(false);
    }
  };

  const handleDeleteTool = async (toolId: string) => {
    try {
      await deleteTool(toolId);
      onUpdate();
      toast.success("Tool deleted successfully");
    } catch (error: any) {
      console.error("Error deleting tool:", error.message);
      toast.error("Failed to delete tool");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <Brain className="mr-2 text-maasta-purple" size={28} />
          Skills & Expertise
        </h2>
      </div>

      {/* Special Skills Section */}
      <Card>
        <CardHeader>
          <CardTitle>Special Skills ({skills.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a special skill..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
            />
            <Button 
              onClick={handleAddSkill}
              disabled={!newSkill.trim() || isAddingSkill || isSaving}
              className="bg-maasta-purple hover:bg-maasta-purple/90"
            >
              <Plus size={16} className="mr-1" />
              {isAddingSkill ? "Adding..." : "Add"}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill: any) => (
              <Badge 
                key={skill.id} 
                variant="outline" 
                className="flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 border-purple-200"
              >
                {skill.skill}
                <button
                  onClick={() => handleDeleteSkill(skill.id)}
                  disabled={isDeleting}
                  className="ml-1 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={12} />
                </button>
              </Badge>
            ))}
          </div>

          {skills.length === 0 && (
            <p className="text-gray-500 text-center py-4">No special skills added yet</p>
          )}
        </CardContent>
      </Card>

      {/* Languages Section */}
      <Card>
        <CardHeader>
          <CardTitle>Languages ({languages.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a language..."
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              className="flex-1"
            />
            <select
              value={newLanguageProficiency}
              onChange={(e) => setNewLanguageProficiency(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="native">Native</option>
            </select>
            <Button 
              onClick={handleAddLanguage}
              disabled={!newLanguage.trim() || isAddingLanguage || isSaving}
              className="bg-maasta-orange hover:bg-maasta-orange/90"
            >
              <Plus size={16} className="mr-1" />
              {isAddingLanguage ? "Adding..." : "Add"}
            </Button>
          </div>

          <div className="space-y-2">
            {languages.map((language: any) => (
              <div key={language.id} className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                <div>
                  <span className="font-medium">{language.language}</span>
                  <Badge className="ml-2 text-xs bg-orange-100 text-orange-700">
                    {language.proficiency}
                  </Badge>
                </div>
                <button
                  onClick={() => handleDeleteLanguage(language.id)}
                  disabled={isDeleting}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {languages.length === 0 && (
            <p className="text-gray-500 text-center py-4">No languages added yet</p>
          )}
        </CardContent>
      </Card>

      {/* Tools & Software Section */}
      <Card>
        <CardHeader>
          <CardTitle>Tools & Software ({tools.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a tool or software..."
              value={newTool}
              onChange={(e) => setNewTool(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTool()}
            />
            <Button 
              onClick={handleAddTool}
              disabled={!newTool.trim() || isAddingTool || isSaving}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus size={16} className="mr-1" />
              {isAddingTool ? "Adding..." : "Add"}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {tools.map((tool: any) => (
              <Badge 
                key={tool.id} 
                variant="outline" 
                className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 border-green-200"
              >
                {tool.tool_name}
                <button
                  onClick={() => handleDeleteTool(tool.id)}
                  disabled={isDeleting}
                  className="ml-1 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={12} />
                </button>
              </Badge>
            ))}
          </div>

          {tools.length === 0 && (
            <p className="text-gray-500 text-center py-4">No tools or software added yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillsSection;
