
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

const profileFormSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  bio: z.string().optional(),
  phone_number: z.string().optional(),
  gender: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  date_of_birth: z.date().optional(),
  profile_picture_url: z.string().optional(),
  willing_to_relocate: z.boolean().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const socialLinksSchema = z.object({
  imdb_profile: z.string().optional(),
  youtube_vimeo: z.string().optional(),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
  personal_website: z.string().optional(),
});

type SocialLinksValues = z.infer<typeof socialLinksSchema>;

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingSocial, setIsSavingSocial] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: "",
      bio: "",
      phone_number: "",
      gender: "",
      city: "",
      state: "",
      country: "",
      profile_picture_url: "",
      willing_to_relocate: false,
    },
  });
  
  const socialLinksForm = useForm<SocialLinksValues>({
    resolver: zodResolver(socialLinksSchema),
    defaultValues: {
      imdb_profile: "",
      youtube_vimeo: "",
      instagram: "",
      linkedin: "",
      personal_website: "",
    },
  });
  
  useEffect(() => {
    if (!user) {
      navigate("/sign-in");
      return;
    }
    
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        
        if (error) throw error;
        
        setProfileData(data);
        
        // Set form values
        profileForm.reset({
          full_name: data.full_name || "",
          bio: data.bio || "",
          phone_number: data.phone_number || "",
          gender: data.gender || "",
          city: data.city || "",
          state: data.state || "",
          country: data.country || "",
          date_of_birth: data.date_of_birth ? new Date(data.date_of_birth) : undefined,
          profile_picture_url: data.profile_picture_url || "",
          willing_to_relocate: data.willing_to_relocate || false,
        });
        
        socialLinksForm.reset({
          imdb_profile: data.imdb_profile || "",
          youtube_vimeo: data.youtube_vimeo || "",
          instagram: data.instagram || "",
          linkedin: data.linkedin || "",
          personal_website: data.personal_website || "",
        });
      } catch (error: any) {
        console.error("Error fetching profile:", error.message);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [user, navigate, toast, profileForm, socialLinksForm]);
  
  const onSaveProfile = async (values: ProfileFormValues) => {
    if (!user) return;
    
    try {
      setIsSavingProfile(true);
      
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: values.full_name,
          bio: values.bio,
          phone_number: values.phone_number,
          gender: values.gender,
          city: values.city,
          state: values.state,
          country: values.country,
          date_of_birth: values.date_of_birth ? values.date_of_birth.toISOString().split('T')[0] : null,
          profile_picture_url: values.profile_picture_url,
          willing_to_relocate: values.willing_to_relocate,
        })
        .eq("id", user.id);
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };
  
  const onSaveSocialLinks = async (values: SocialLinksValues) => {
    if (!user) return;
    
    try {
      setIsSavingSocial(true);
      
      const { error } = await supabase
        .from("profiles")
        .update({
          imdb_profile: values.imdb_profile,
          youtube_vimeo: values.youtube_vimeo,
          instagram: values.instagram,
          linkedin: values.linkedin,
          personal_website: values.personal_website,
        })
        .eq("id", user.id);
      
      if (error) throw error;
      
      toast({
        title: "Social links updated",
        description: "Your social media links have been updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating social links:", error.message);
      toast({
        title: "Error",
        description: error.message || "Failed to update social links",
        variant: "destructive",
      });
    } finally {
      setIsSavingSocial(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96 mt-2" />
            </div>
            
            <Skeleton className="h-12 w-full mb-6" />
            
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </Button>
          
          <header className="mb-6">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-gray-500">Manage your personal information and preferences</p>
          </header>
          
          <Tabs defaultValue="personal" className="mb-6">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="social">Social Links</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="space-y-6">
                      <FormField
                        control={profileForm.control}
                        name="full_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name*</FormLabel>
                            <FormControl>
                              <Input placeholder="Your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={profileForm.control}
                          name="phone_number"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="+91 xxxxxxxx" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                  <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={profileForm.control}
                        name="date_of_birth"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date of Birth</FormLabel>
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
                                  disabled={(date) => date > new Date()}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us about yourself"
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Separator className="my-4" />
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Location</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={profileForm.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your city" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your state" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your country" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={profileForm.control}
                          name="willing_to_relocate"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-4">
                              <div>
                                <FormLabel>Willing to Relocate</FormLabel>
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
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <FormField
                        control={profileForm.control}
                        name="profile_picture_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Profile Picture URL</FormLabel>
                            <FormControl>
                              <Input placeholder="URL to your profile picture" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          disabled={isSavingProfile}
                          className="bg-maasta-orange hover:bg-maasta-orange/90"
                        >
                          {isSavingProfile ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="social">
              <Card>
                <CardHeader>
                  <CardTitle>Social Media & Professional Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...socialLinksForm}>
                    <form onSubmit={socialLinksForm.handleSubmit(onSaveSocialLinks)} className="space-y-6">
                      <FormField
                        control={socialLinksForm.control}
                        name="imdb_profile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>IMDB Profile</FormLabel>
                            <FormControl>
                              <Input placeholder="https://www.imdb.com/name/..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={socialLinksForm.control}
                        name="youtube_vimeo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>YouTube/Vimeo</FormLabel>
                            <FormControl>
                              <Input placeholder="Link to your channel or profile" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={socialLinksForm.control}
                        name="instagram"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Instagram</FormLabel>
                            <FormControl>
                              <Input placeholder="https://www.instagram.com/..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={socialLinksForm.control}
                        name="linkedin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>LinkedIn</FormLabel>
                            <FormControl>
                              <Input placeholder="https://www.linkedin.com/in/..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={socialLinksForm.control}
                        name="personal_website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Personal Website</FormLabel>
                            <FormControl>
                              <Input placeholder="https://..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          disabled={isSavingSocial}
                          className="bg-maasta-orange hover:bg-maasta-orange/90"
                        >
                          {isSavingSocial ? "Saving..." : "Save Links"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="portfolio">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio & Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Media Assets</h3>
                      <Button variant="outline" size="sm">
                        Add Media
                      </Button>
                    </div>
                    
                    <p className="text-sm text-gray-500">
                      No media assets found. Add photos and videos to showcase your work.
                    </p>
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Projects</h3>
                      <Button variant="outline" size="sm">
                        Add Project
                      </Button>
                    </div>
                    
                    <p className="text-sm text-gray-500">
                      No projects found. Add your work experience to showcase your portfolio.
                    </p>
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Education & Training</h3>
                      <Button variant="outline" size="sm">
                        Add Education
                      </Button>
                    </div>
                    
                    <p className="text-sm text-gray-500">
                      No education or training records found. Add your qualifications and training.
                    </p>
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Skills</h3>
                      <Button variant="outline" size="sm">
                        Add Skills
                      </Button>
                    </div>
                    
                    <p className="text-sm text-gray-500">
                      No skills found. Add your special skills and talents.
                    </p>
                    
                    <div className="text-center">
                      <p className="text-gray-500 mb-4">
                        Complete your portfolio to attract casting directors and event organizers
                      </p>
                      <Button className="bg-maasta-purple hover:bg-maasta-purple/90">
                        Set Up Portfolio
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
