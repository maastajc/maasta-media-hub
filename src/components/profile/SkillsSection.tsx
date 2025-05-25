import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Star, Languages, Wrench } from "lucide-react";

// Define valid proficiency levels based on the database enum
const PROFICIENCY_LEVELS = ["basic", "intermediate", "fluent", "native"] as const;

const skillSchema = z.object({
  skill: z.string().min(1, "Skill is required"),
});

const languageSchema = z.object({
  language: z.string().min(1, "Language is required"),
  proficiency: z.enum(PROFICIENCY_LEVELS, { errorMap: () => ({ message: "Please select a valid proficiency level" }) }),
});

const toolSchema = z.object({
  tool_name: z.string().min(1, "Tool name is required"),
});

type SkillFormValues = z.infer<typeof skillSchema>;
type LanguageFormValues = z.infer<typeof languageSchema>;
type ToolFormValues = z.infer<typeof toolSchema>;

interface SkillsSectionProps {
  profileData: any;
  onUpdate: () => void;
  userId?: string;
}

const SkillsSection = ({ profileData, onUpdate, userId }: SkillsSectionProps) => {
  const { toast } = useToast();
  const [activeDialog, setActiveDialog] = useState<'skill' | 'language' | 'tool' | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const skillForm = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: { skill: "" },
  });

  const languageForm = useForm<LanguageFormValues>({
    resolver: zodResolver(languageSchema),
    defaultValues: { language: "", proficiency: "intermediate" },
  });

  const toolForm = useForm<ToolFormValues>({
    resolver: zodResolver(toolSchema),
    defaultValues: { tool_name: "" },
  });

  const skills = profileData?.special_skills || [];
  const languages = profileData?.language_skills || [];
  const tools = profileData?.tools_software || [];

  const handleAddSkill = async (values: SkillFormValues) => {
    if (!userId) return;

    try {
      setIsSaving(true);
      
      const skillData = {
        skill: values.skill,
        artist_id: userId,
      };

      if (editingItem) {
        const { error } = await supabase
          .from("special_skills")
          .update(skillData)
          .eq("id", editingItem.id);
        if (error) throw error;
        toast({ title: "Skill updated successfully" });
      } else {
        const { error } = await supabase
          .from("special_skills")
          .insert(skillData);
        if (error) throw error;
        toast({ title: "Skill added successfully" });
      }

      onUpdate();
      closeDialog();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save skill",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddLanguage = async (values: LanguageFormValues) => {
    if (!userId) return;

    try {
      setIsSaving(true);
      
      const languageData = {
        language: values.language,
        proficiency: values.proficiency,
        artist_id: userId,
      };

      if (editingItem) {
        const { error } = await supabase
          .from("language_skills")
          .update(languageData)
          .eq("id", editingItem.id);
        if (error) throw error;
        toast({ title: "Language updated successfully" });
      } else {
        const { error } = await supabase
          .from("language_skills")
          .insert(languageData);
        if (error) throw error;
        toast({ title: "Language added successfully" });
      }

      onUpdate();
      closeDialog();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save language",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTool = async (values: ToolFormValues) => {
    if (!userId) return;

    try {
      setIsSaving(true);
      
      const toolData = {
        tool_name: values.tool_name,
        artist_id: userId,
      };

      if (editingItem) {
        const { error } = await supabase
          .from("tools_software")
          .update(toolData)
          .eq("id", editingItem.id);
        if (error) throw error;
        toast({ title: "Tool updated successfully" });
      } else {
        const { error } = await supabase
          .from("tools_software")
          .insert(toolData);
        if (error) throw error;
        toast({ title: "Tool added successfully" });
      }

      onUpdate();
      closeDialog();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save tool",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (table: string, id: string) => {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Item deleted successfully" });
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (type: 'skill' | 'language' | 'tool', item: any) => {
    setEditingItem(item);
    setActiveDialog(type);
    
    if (type === 'skill') {
      skillForm.reset({ skill: item.skill });
    } else if (type === 'language') {
      languageForm.reset({ language: item.language, proficiency: item.proficiency });
    } else if (type === 'tool') {
      toolForm.reset({ tool_name: item.tool_name });
    }
  };

  const closeDialog = () => {
    setActiveDialog(null);
    setEditingItem(null);
    skillForm.reset({ skill: "" });
    languageForm.reset({ language: "", proficiency: "intermediate" });
    toolForm.reset({ tool_name: "" });
  };

  return (
    <div className="space-y-8">
      {/* Special Skills */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold flex items-center">
            <Star className="mr-2 text-maasta-orange" size={20} />
            Special Skills ({skills.length})
          </h3>
          <Button
            onClick={() => setActiveDialog('skill')}
            size="sm"
            className="bg-maasta-orange hover:bg-maasta-orange/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        </div>
        
        {skills.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600 mb-4">No special skills added yet</p>
              <Button
                onClick={() => setActiveDialog('skill')}
                className="bg-maasta-orange hover:bg-maasta-orange/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Skill
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-wrap gap-3">
            {skills.map((skill: any) => (
              <div key={skill.id} className="group relative">
                <Badge 
                  className="bg-gradient-to-r from-maasta-purple to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => openEditDialog('skill', skill)}
                >
                  {skill.skill}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDelete('special_skills', skill.id)}
                >
                  <Trash2 size={12} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Languages */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold flex items-center">
            <Languages className="mr-2 text-maasta-purple" size={20} />
            Languages ({languages.length})
          </h3>
          <Button
            onClick={() => setActiveDialog('language')}
            size="sm"
            className="bg-maasta-purple hover:bg-maasta-purple/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Language
          </Button>
        </div>
        
        {languages.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600 mb-4">No languages added yet</p>
              <Button
                onClick={() => setActiveDialog('language')}
                className="bg-maasta-purple hover:bg-maasta-purple/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Language
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {languages.map((lang: any) => (
              <div key={lang.id} className="group flex justify-between items-center bg-gray-50 p-4 rounded-lg hover:shadow-md transition-all">
                <div>
                  <span className="font-medium text-gray-900">{lang.language}</span>
                  <Badge 
                    variant="outline" 
                    className="ml-3 capitalize bg-white border-gray-200"
                  >
                    {lang.proficiency}
                  </Badge>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog('language', lang)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete('language_skills', lang.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tools & Software */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold flex items-center">
            <Wrench className="mr-2 text-blue-600" size={20} />
            Tools & Software ({tools.length})
          </h3>
          <Button
            onClick={() => setActiveDialog('tool')}
            size="sm"
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Tool
          </Button>
        </div>
        
        {tools.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600 mb-4">No tools or software added yet</p>
              <Button
                onClick={() => setActiveDialog('tool')}
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Tool
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-wrap gap-3">
            {tools.map((tool: any) => (
              <div key={tool.id} className="group relative">
                <Badge 
                  variant="outline"
                  className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 px-4 py-2 rounded-full hover:shadow-md transition-all cursor-pointer"
                  onClick={() => openEditDialog('tool', tool)}
                >
                  {tool.tool_name}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDelete('tools_software', tool.id)}
                >
                  <Trash2 size={12} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <Dialog open={activeDialog === 'skill'} onOpenChange={closeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Skill" : "Add Special Skill"}</DialogTitle>
          </DialogHeader>
          <Form {...skillForm}>
            <form onSubmit={skillForm.handleSubmit(handleAddSkill)} className="space-y-4">
              <FormField
                control={skillForm.control}
                name="skill"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skill*</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Dancing, Singing, Martial Arts" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : editingItem ? "Update" : "Add Skill"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === 'language'} onOpenChange={closeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Language" : "Add Language"}</DialogTitle>
          </DialogHeader>
          <Form {...languageForm}>
            <form onSubmit={languageForm.handleSubmit(handleAddLanguage)} className="space-y-4">
              <FormField
                control={languageForm.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language*</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., English, Hindi, Spanish" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={languageForm.control}
                name="proficiency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proficiency*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select proficiency level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="fluent">Fluent</SelectItem>
                        <SelectItem value="native">Native</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : editingItem ? "Update" : "Add Language"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === 'tool'} onOpenChange={closeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Tool" : "Add Tool/Software"}</DialogTitle>
          </DialogHeader>
          <Form {...toolForm}>
            <form onSubmit={toolForm.handleSubmit(handleAddTool)} className="space-y-4">
              <FormField
                control={toolForm.control}
                name="tool_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tool/Software*</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Photoshop, Final Cut Pro, Pro Tools" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : editingItem ? "Update" : "Add Tool"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SkillsSection;
