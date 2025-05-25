
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Brain, Globe, Wrench } from "lucide-react";

const skillSchema = z.object({
  skill: z.string().min(1, "Skill name is required"),
});

const languageSchema = z.object({
  language: z.string().min(1, "Language is required"),
  proficiency: z.enum(["basic", "conversational", "fluent", "native"]),
});

const toolSchema = z.object({
  tool_name: z.string().min(1, "Tool/Software name is required"),
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
  const [activeDialog, setActiveDialog] = useState<"skill" | "language" | "tool" | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const skillForm = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: { skill: "" },
  });

  const languageForm = useForm<LanguageFormValues>({
    resolver: zodResolver(languageSchema),
    defaultValues: { language: "", proficiency: "basic" },
  });

  const toolForm = useForm<ToolFormValues>({
    resolver: zodResolver(toolSchema),
    defaultValues: { tool_name: "" },
  });

  const skills = profileData?.special_skills || [];
  const languages = profileData?.language_skills || [];
  const tools = profileData?.tools_software || [];

  const resetForms = () => {
    skillForm.reset({ skill: "" });
    languageForm.reset({ language: "", proficiency: "basic" });
    toolForm.reset({ tool_name: "" });
  };

  const onSubmitSkill = async (values: SkillFormValues) => {
    if (!userId) return;

    try {
      setIsSaving(true);
      const skillData = { skill: values.skill, artist_id: userId };

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
      console.error("Error saving skill:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save skill",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmitLanguage = async (values: LanguageFormValues) => {
    if (!userId) return;

    try {
      setIsSaving(true);
      const languageData = { 
        language: values.language, 
        proficiency: values.proficiency, 
        artist_id: userId 
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
      console.error("Error saving language:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save language",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmitTool = async (values: ToolFormValues) => {
    if (!userId) return;

    try {
      setIsSaving(true);
      const toolData = { tool_name: values.tool_name, artist_id: userId };

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
      console.error("Error saving tool:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save tool",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (item: any, type: "skill" | "language" | "tool") => {
    setEditingItem(item);
    setActiveDialog(type);

    if (type === "skill") {
      skillForm.reset({ skill: item.skill });
    } else if (type === "language") {
      languageForm.reset({ language: item.language, proficiency: item.proficiency });
    } else if (type === "tool") {
      toolForm.reset({ tool_name: item.tool_name });
    }
  };

  const handleDelete = async (itemId: string, table: string, type: string) => {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq("id", itemId);

      if (error) throw error;
      
      toast({ title: `${type} deleted successfully` });
      onUpdate();
    } catch (error: any) {
      console.error(`Error deleting ${type}:`, error);
      toast({
        title: "Error",
        description: `Failed to delete ${type}`,
        variant: "destructive",
      });
    }
  };

  const closeDialog = () => {
    setActiveDialog(null);
    setEditingItem(null);
    resetForms();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Skills & Abilities</h2>
      </div>

      {/* Special Skills */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Brain className="mr-2 text-maasta-purple" size={24} />
            Special Skills ({skills.length})
          </CardTitle>
          <Button
            onClick={() => setActiveDialog("skill")}
            size="sm"
            className="bg-maasta-purple hover:bg-maasta-purple/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        </CardHeader>
        <CardContent>
          {skills.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No special skills added yet</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill: any) => (
                <Badge
                  key={skill.id}
                  variant="outline"
                  className="group hover:bg-red-50 hover:border-red-200 cursor-pointer p-2"
                >
                  {skill.skill}
                  <div className="ml-2 opacity-0 group-hover:opacity-100 flex gap-1">
                    <button
                      onClick={() => handleEdit(skill, "skill")}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id, "special_skills", "Skill")}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Language Skills */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Globe className="mr-2 text-maasta-orange" size={24} />
            Languages ({languages.length})
          </CardTitle>
          <Button
            onClick={() => setActiveDialog("language")}
            size="sm"
            className="bg-maasta-orange hover:bg-maasta-orange/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Language
          </Button>
        </CardHeader>
        <CardContent>
          {languages.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No languages added yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {languages.map((lang: any) => (
                <div
                  key={lang.id}
                  className="group border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{lang.language}</h4>
                      <Badge className="mt-1 capitalize">{lang.proficiency}</Badge>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                      <button
                        onClick={() => handleEdit(lang, "language")}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(lang.id, "language_skills", "Language")}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tools & Software */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Wrench className="mr-2 text-green-600" size={24} />
            Tools & Software ({tools.length})
          </CardTitle>
          <Button
            onClick={() => setActiveDialog("tool")}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Tool
          </Button>
        </CardHeader>
        <CardContent>
          {tools.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No tools or software added yet</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tools.map((tool: any) => (
                <Badge
                  key={tool.id}
                  variant="outline"
                  className="group hover:bg-red-50 hover:border-red-200 cursor-pointer p-2"
                >
                  {tool.tool_name}
                  <div className="ml-2 opacity-0 group-hover:opacity-100 flex gap-1">
                    <button
                      onClick={() => handleEdit(tool, "tool")}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(tool.id, "tools_software", "Tool")}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skill Dialog */}
      <Dialog open={activeDialog === "skill"} onOpenChange={() => activeDialog === "skill" && closeDialog()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Skill" : "Add Special Skill"}</DialogTitle>
          </DialogHeader>
          <Form {...skillForm}>
            <form onSubmit={skillForm.handleSubmit(onSubmitSkill)} className="space-y-4">
              <FormField
                control={skillForm.control}
                name="skill"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skill Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Horse Riding, Sword Fighting" {...field} />
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

      {/* Language Dialog */}
      <Dialog open={activeDialog === "language"} onOpenChange={() => activeDialog === "language" && closeDialog()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Language" : "Add Language"}</DialogTitle>
          </DialogHeader>
          <Form {...languageForm}>
            <form onSubmit={languageForm.handleSubmit(onSubmitLanguage)} className="space-y-4">
              <FormField
                control={languageForm.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language*</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Spanish, French, Hindi" {...field} />
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
                    <FormLabel>Proficiency Level*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select proficiency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="conversational">Conversational</SelectItem>
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

      {/* Tool Dialog */}
      <Dialog open={activeDialog === "tool"} onOpenChange={() => activeDialog === "tool" && closeDialog()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Tool" : "Add Tool/Software"}</DialogTitle>
          </DialogHeader>
          <Form {...toolForm}>
            <form onSubmit={toolForm.handleSubmit(onSubmitTool)} className="space-y-4">
              <FormField
                control={toolForm.control}
                name="tool_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tool/Software Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Adobe Premiere, Final Cut Pro" {...field} />
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
