
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Star, Code, Languages } from "lucide-react";
import { Artist } from "@/types/artist";
import { saveRelatedData, deleteRelatedData } from "@/services/profileService";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileSectionUpdate } from "@/hooks/useProfileSectionUpdate";
import { validateSkillEntry, validateToolEntry, validateLanguageEntry } from "@/utils/profileValidation";
import { toast } from "sonner";

interface SkillsSectionProps {
  artist: Artist;
  isOwner: boolean;
  isEditing: boolean;
}

const SkillsSection = ({ artist, isOwner, isEditing }: SkillsSectionProps) => {
  const { user } = useAuth();
  const [newSkill, setNewSkill] = useState("");
  const [newTool, setNewTool] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [newProficiency, setNewProficiency] = useState("");

  const { handleSubmit: handleSkillSubmit, isSubmitting: isSkillSubmitting } = useProfileSectionUpdate({
    successMessage: "Skill added successfully!",
    errorMessage: "Failed to add skill. Please try again."
  });

  const { handleSubmit: handleToolSubmit, isSubmitting: isToolSubmitting } = useProfileSectionUpdate({
    successMessage: "Tool added successfully!",
    errorMessage: "Failed to add tool. Please try again."
  });

  const { handleSubmit: handleLanguageSubmit, isSubmitting: isLanguageSubmitting } = useProfileSectionUpdate({
    successMessage: "Language added successfully!",
    errorMessage: "Failed to add language. Please try again."
  });

  const handleAddSkill = async () => {
    if (!newSkill.trim() || !user?.id) return;

    const validation = validateSkillEntry(newSkill.trim(), artist.special_skills || []);
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    await handleSkillSubmit(async () => {
      await saveRelatedData('special_skills', { skill: newSkill.trim() }, user.id);
      setNewSkill("");
      window.location.reload();
    });
  };

  const handleDeleteSkill = async (skillId: string) => {
    if (!user?.id) return;

    await handleSkillSubmit(async () => {
      await deleteRelatedData('special_skills', skillId, user.id);
      window.location.reload();
    }, {
      successMessage: "Skill removed successfully!",
      errorMessage: "Failed to remove skill. Please try again."
    });
  };

  const handleAddTool = async () => {
    if (!newTool.trim() || !user?.id) return;

    const validation = validateToolEntry(newTool.trim(), artist.tools_software || []);
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    await handleToolSubmit(async () => {
      await saveRelatedData('tools_software', { tool_name: newTool.trim() }, user.id);
      setNewTool("");
      window.location.reload();
    });
  };

  const handleDeleteTool = async (toolId: string) => {
    if (!user?.id) return;

    await handleToolSubmit(async () => {
      await deleteRelatedData('tools_software', toolId, user.id);
      window.location.reload();
    }, {
      successMessage: "Tool removed successfully!",
      errorMessage: "Failed to remove tool. Please try again."
    });
  };

  const handleAddLanguage = async () => {
    if (!newLanguage.trim() || !newProficiency || !user?.id) return;

    const validation = validateLanguageEntry(newLanguage.trim(), newProficiency, artist.language_skills || []);
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    await handleLanguageSubmit(async () => {
      await saveRelatedData('language_skills', { 
        language: newLanguage.trim(), 
        proficiency: newProficiency 
      }, user.id);
      setNewLanguage("");
      setNewProficiency("");
      window.location.reload();
    });
  };

  const handleDeleteLanguage = async (languageId: string) => {
    if (!user?.id) return;

    await handleLanguageSubmit(async () => {
      await deleteRelatedData('language_skills', languageId, user.id);
      window.location.reload();
    }, {
      successMessage: "Language removed successfully!",
      errorMessage: "Failed to remove language. Please try again."
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Special Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="w-5 h-5 mr-2" />
            Special Skills
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {artist.special_skills?.map((skill) => (
              <div key={skill.id} className="flex items-center justify-between">
                <Badge variant="secondary">{skill.skill}</Badge>
                {isEditing && isOwner && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteSkill(skill.id)}
                    disabled={isSkillSubmitting}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            
            {isEditing && isOwner && (
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                />
                <Button
                  onClick={handleAddSkill}
                  size="sm"
                  disabled={isSkillSubmitting}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tools & Software */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Code className="w-5 h-5 mr-2" />
            Tools & Software
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {artist.tools_software?.map((tool) => (
              <div key={tool.id} className="flex items-center justify-between">
                <Badge variant="outline">{tool.tool_name}</Badge>
                {isEditing && isOwner && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTool(tool.id)}
                    disabled={isToolSubmitting}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            
            {isEditing && isOwner && (
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tool"
                  value={newTool}
                  onChange={(e) => setNewTool(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTool()}
                />
                <Button
                  onClick={handleAddTool}
                  size="sm"
                  disabled={isToolSubmitting}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Languages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Languages className="w-5 h-5 mr-2" />
            Languages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {artist.language_skills?.map((lang) => (
              <div key={lang.id} className="flex items-center justify-between">
                <div>
                  <span className="font-medium">{lang.language}</span>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {lang.proficiency}
                  </Badge>
                </div>
                {isEditing && isOwner && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteLanguage(lang.id)}
                    disabled={isLanguageSubmitting}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            
            {isEditing && isOwner && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Language"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={newProficiency} onValueChange={setNewProficiency}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="fluent">Fluent</SelectItem>
                      <SelectItem value="native">Native</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleAddLanguage}
                  size="sm"
                  className="w-full"
                  disabled={isLanguageSubmitting}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Language
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillsSection;
