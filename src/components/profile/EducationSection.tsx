import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, GraduationCap, BookOpen } from "lucide-react";

const educationSchema = z.object({
  qualification_name: z.string().min(1, "Qualification name is required"),
  institution: z.string().optional(),
  year_completed: z.number().min(1950).max(new Date().getFullYear()),
  is_academic: z.boolean(),
});

type EducationFormValues = z.infer<typeof educationSchema>;

interface EducationSectionProps {
  profileData: any;
  onUpdate: () => void;
  userId?: string;
}

const EducationSection = ({ profileData, onUpdate, userId }: EducationSectionProps) => {
  const { toast } = useToast();
  const [isAddingEducation, setIsAddingEducation] = useState(false);
  const [editingEducation, setEditingEducation] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      qualification_name: "",
      institution: "",
      year_completed: new Date().getFullYear(),
      is_academic: true,
    },
  });

  const education = profileData?.education_training || [];

  const resetForm = () => {
    form.reset({
      qualification_name: "",
      institution: "",
      year_completed: new Date().getFullYear(),
      is_academic: true,
    });
  };

  const onSubmit = async (values: EducationFormValues) => {
    if (!userId) return;

    try {
      setIsSaving(true);

      const educationData = {
        qualification_name: values.qualification_name,
        institution: values.institution || null,
        year_completed: values.year_completed,
        is_academic: values.is_academic,
        artist_id: userId,
      };

      if (editingEducation) {
        const { error } = await supabase
          .from("education_training")
          .update(educationData)
          .eq("id", editingEducation.id);

        if (error) throw error;
        toast({ title: "Education updated successfully" });
      } else {
        const { error } = await supabase
          .from("education_training")
          .insert(educationData);

        if (error) throw error;
        toast({ title: "Education added successfully" });
      }

      onUpdate();
      setIsAddingEducation(false);
      setEditingEducation(null);
      resetForm();
    } catch (error: any) {
      console.error("Error saving education:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save education",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (edu: any) => {
    setEditingEducation(edu);
    form.reset({
      qualification_name: edu.qualification_name,
      institution: edu.institution || "",
      year_completed: edu.year_completed,
      is_academic: edu.is_academic,
    });
    setIsAddingEducation(true);
  };

  const handleDelete = async (eduId: string) => {
    try {
      const { error } = await supabase
        .from("education_training")
        .delete()
        .eq("id", eduId);

      if (error) throw error;
      
      toast({ title: "Education deleted successfully" });
      onUpdate();
    } catch (error: any) {
      console.error("Error deleting education:", error);
      toast({
        title: "Error",
        description: "Failed to delete education",
        variant: "destructive",
      });
    }
  };

  const closeDialog = () => {
    setIsAddingEducation(false);
    setEditingEducation(null);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Education & Training ({education.length})</h2>
        <Button
          onClick={() => setIsAddingEducation(true)}
          className="bg-maasta-purple hover:bg-maasta-purple/90"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Education
        </Button>
      </div>

      {education.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <GraduationCap className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No education records yet</h3>
            <p className="text-gray-600 mb-4">Add your educational background and training</p>
            <Button
              onClick={() => setIsAddingEducation(true)}
              className="bg-maasta-purple hover:bg-maasta-purple/90"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Education
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {education.map((edu: any) => (
            <Card key={edu.id} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="border-l-4 border-maasta-orange pl-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-xl text-gray-900">{edu.qualification_name}</h3>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(edu)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(edu.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                      
                      {edu.institution && (
                        <p className="text-gray-600 mb-2">{edu.institution}</p>
                      )}
                      
                      <div className="flex items-center gap-3">
                        {edu.year_completed && (
                          <Badge variant="outline">
                            {edu.year_completed}
                          </Badge>
                        )}
                        <Badge 
                          className={edu.is_academic ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}
                        >
                          {edu.is_academic ? "Academic" : "Professional Training"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isAddingEducation} onOpenChange={closeDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingEducation ? "Edit Education" : "Add Education/Training"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="qualification_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qualification/Course Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Bachelor of Arts, Acting Workshop" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution/School</FormLabel>
                    <FormControl>
                      <Input placeholder="Name of institution" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year_completed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year Completed*</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="2024"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_academic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-4">
                    <div>
                      <FormLabel>Academic Qualification</FormLabel>
                      <p className="text-sm text-gray-600">
                        Toggle off for professional training/workshops
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-maasta-purple hover:bg-maasta-purple/90"
                >
                  {isSaving ? "Saving..." : editingEducation ? "Update" : "Add Education"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EducationSection;
