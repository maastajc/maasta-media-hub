
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { uploadFile } from "@/utils/fileUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Categories for auditions
const AUDITION_CATEGORIES = [
  "Acting", "Voiceover", "Dancing", "Singing", "Modeling",
  "Music", "Direction", "Production", "Writing",
  "Animation", "Editing", "Photography", "Cinematography",
  "Makeup", "Costume", "Set Design", "Sound Design", "Other"
];

// Gender options
const GENDER_OPTIONS = [
  "Male", "Female", "Non-binary", "Any"
];

// Experience levels
const EXPERIENCE_LEVELS = [
  "Beginner", "Intermediate", "Advanced", "Professional", "Any"
];

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  requirements: z.string().optional(),
  location: z.string().min(2, "Location is required"),
  compensation: z.string().optional(),
  projectDetails: z.string().optional(),
  auditionDate: z.date().optional(),
  deadline: z.date().optional(),
  category: z.string({
    required_error: "Please select a category",
  }),
  ageRange: z.string().optional(),
  gender: z.string().optional(),
  experienceLevel: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CreateAudition = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      requirements: "",
      location: "",
      compensation: "",
      projectDetails: "",
      category: "",
      ageRange: "",
      gender: "",
      experienceLevel: "",
    },
  });
  
  const handleImageUpload = async (file: File) => {
    setCoverImage(file);
    setUploadingImage(true);
    
    try {
      // Generate a preview URL for immediate display
      const objectUrl = URL.createObjectURL(file);
      setCoverImageUrl(objectUrl);
    } catch (error) {
      console.error("Error creating preview:", error);
      toast({
        title: "Preview error",
        description: "Failed to create image preview",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };
  
  const handleRemoveImage = () => {
    setCoverImage(null);
    setCoverImageUrl("");
  };
  
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (tags.includes(tagInput.trim())) {
        toast({
          title: "Duplicate tag",
          description: "This tag is already added",
          variant: "destructive",
        });
        return;
      }
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to post an audition",
        variant: "destructive",
      });
      navigate("/sign-in");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Upload cover image if provided
      let finalCoverImageUrl = "";
      if (coverImage) {
        const { url, error } = await uploadFile(coverImage, "audition_covers");
        if (error) {
          throw new Error(`Error uploading cover image: ${error}`);
        }
        finalCoverImageUrl = url;
      }
      
      // Process form values
      const auditionData = {
        title: values.title,
        description: values.description,
        requirements: values.requirements || null,
        location: values.location,
        compensation: values.compensation || null,
        project_details: values.projectDetails || null,
        creator_id: user.id,
        audition_date: values.auditionDate ? values.auditionDate.toISOString() : null,
        deadline: values.deadline ? values.deadline.toISOString() : null,
        status: "open",
        cover_image_url: finalCoverImageUrl || null,
        tags: tags.length > 0 ? tags : null,
        category: values.category,
        age_range: values.ageRange || null,
        gender: values.gender || null,
        experience_level: values.experienceLevel || null,
      };
      
      const { data, error } = await supabase
        .from("auditions")
        .insert(auditionData)
        .select("id")
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Audition posted successfully",
        description: "Your audition has been published",
      });
      
      navigate(`/auditions/${data.id}`);
    } catch (error: any) {
      console.error("Error posting audition:", error.message);
      toast({
        title: "Error posting audition",
        description: error.message || "An error occurred while posting the audition",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate(-1)}
          >
            ← Back
          </Button>
          
          <Card>
            <CardHeader>
              <CardTitle>Post an Audition</CardTitle>
              <CardDescription>
                Fill out the form below to create and publish your audition call
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Cover Image Upload */}
                  <div className="mb-6">
                    <FormLabel className="block mb-2">Cover Image (Optional)</FormLabel>
                    <FileUpload
                      onFileUpload={handleImageUpload}
                      previewUrl={coverImageUrl}
                      isLoading={uploadingImage}
                      onRemove={handleRemoveImage}
                      buttonText="Upload cover image"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      A compelling image will help your audition stand out
                    </p>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Audition Title*</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Lead Actor for Feature Film" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category*</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {AUDITION_CATEGORIES.map((category) => (
                              <SelectItem key={category} value={category.toLowerCase()}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description*</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the role and audition process"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Tags Input */}
                  <div className="space-y-2">
                    <FormLabel>Tags</FormLabel>
                    <div className="flex items-center">
                      <Input
                        placeholder="Add tags (press Enter to add)"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                      />
                    </div>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {tags.map(tag => (
                          <Badge key={tag} variant="outline" className="flex items-center gap-1">
                            {tag}
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => handleRemoveTag(tag)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Add relevant tags to improve discoverability (e.g., Commercial, Theater, Lead Role)
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender Preference</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {GENDER_OPTIONS.map((gender) => (
                                <SelectItem key={gender} value={gender.toLowerCase()}>
                                  {gender}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="ageRange"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age Range</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 18-25, 30-40" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="experienceLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Experience Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select experience level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {EXPERIENCE_LEVELS.map((level) => (
                                <SelectItem key={level} value={level.toLowerCase()}>
                                  {level}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location*</FormLabel>
                          <FormControl>
                            <Input placeholder="City, Venue, or Online" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="requirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Requirements</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Skills needed, physical traits, etc."
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="compensation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Compensation</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Paid, Non-paid, Profit Share" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="projectDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Details</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Information about the project (film, TV show, etc.)"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="auditionDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Audition Date (Optional)</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Select date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="deadline"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Application Deadline (Optional)</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Select date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="mr-2"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-maasta-purple hover:bg-maasta-purple/90"
                    >
                      {isSubmitting ? "Posting..." : "Post Audition"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateAudition;
