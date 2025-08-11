
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Info, User, Briefcase, Phone, Instagram, Youtube, Globe, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Artist, CustomLink, ExperienceLevel } from "@/types/artist";
import { MultiSelect } from "@/components/ui/multi-select";
import { Checkbox } from "@/components/ui/checkbox";
import { WORK_PREFERENCE_CATEGORIES } from "@/constants/workPreferences";
import ProfilePictureUpload from "./ProfilePictureUpload";
import CoverImageUpload from "./CoverImageUpload";

const formSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
    .refine((val) => !val.includes(" "), "Username cannot contain spaces"),
  headline: z.string().min(1, "Headline/Bio is required").max(150, "Headline must be less than 150 characters"),
  phone_number: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  date_of_birth: z.date({
    required_error: "Date of birth is required"
  }).refine((date) => date < new Date(), "Date of birth must be in the past"),
  gender: z.string().optional(),
  instagram: z.string().optional(),
  youtube_vimeo: z.string().optional(),
  // Work preferences fields
  work_preferences: z.array(z.string()).min(1, "Please select at least one profession").max(5, "You can select up to 5 professions"),
  experience_level: z.enum(["beginner", "fresher", "intermediate", "expert", "veteran"]).optional(),
  years_of_experience: z.number().min(0).max(50).optional(),
  work_preference: z.string().optional(),
  preferred_domains: z.string().optional(),
  willing_to_relocate: z.boolean().optional(),
});

interface ProfileEditFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  profileData: Artist;
}

const ProfileEditForm = ({ open, onClose, onSuccess, profileData }: ProfileEditFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(
    profileData.date_of_birth ? new Date(profileData.date_of_birth) : undefined
  );
  const [customLinks, setCustomLinks] = useState<CustomLink[]>(() => {
    if (!profileData?.custom_links) return [];
    try {
      return Array.isArray(profileData.custom_links) 
        ? profileData.custom_links 
        : JSON.parse(profileData.custom_links as string);
    } catch {
      return [];
    }
  });
  const [profilePicture, setProfilePicture] = useState(profileData.profile_picture_url || "");
  const [coverImage, setCoverImage] = useState(profileData.cover_image_url || "");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: profileData.full_name || "",
      username: profileData.username || "",
      headline: profileData.headline || profileData.bio || "",
      phone_number: profileData.phone_number || "",
      city: profileData.city || "",
      state: profileData.state || "",
      country: profileData.country || "",
      date_of_birth: profileData.date_of_birth ? new Date(profileData.date_of_birth) : undefined,
      gender: profileData.gender || "",
      instagram: profileData.instagram || "",
      youtube_vimeo: profileData.youtube_vimeo || "",
      // Work preferences fields
      work_preferences: (profileData as any)["Primary Profession"] || profileData.work_preferences || (profileData.category ? [profileData.category] : []),
      experience_level: profileData.experience_level as ExperienceLevel,
      years_of_experience: profileData.years_of_experience || 0,
      work_preference: profileData.work_preference || "",
      preferred_domains: profileData.preferred_domains || "",
      willing_to_relocate: profileData.willing_to_relocate || false,
    },
  });

  // Check if mandatory fields are filled
  const checkMandatoryFields = () => {
    const values = form.getValues();
    return !!(
      profilePicture &&
      values.username &&
      values.headline &&
      values.date_of_birth &&
      values.work_preferences &&
      values.work_preferences.length > 0
    );
  };

  // Check if username is already taken
  const checkUsernameAvailability = async (username: string) => {
    if (!username || username === profileData.username) return true;
    
    const { data, error } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", username)
      .neq("id", profileData.id);
    
    if (error) {
      console.error("Error checking username:", error);
      return false;
    }
    
    return data.length === 0;
  };

  const validateUrl = (url: string) => {
    if (!url) return true;
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const addCustomLink = () => {
    if (customLinks.length < 5) {
      setCustomLinks([...customLinks, { id: Date.now().toString(), title: '', url: '' }]);
    }
  };

  const updateCustomLink = (index: number, field: 'title' | 'url', value: string) => {
    const updatedLinks = [...customLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setCustomLinks(updatedLinks);
  };

  const removeCustomLink = (index: number) => {
    setCustomLinks(customLinks.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!checkMandatoryFields()) {
      toast({
        title: "Missing Required Fields",
        description: "Please complete all mandatory fields before saving.",
        variant: "destructive",
      });
      return;
    }

    // Check username availability
    const isUsernameAvailable = await checkUsernameAvailability(values.username);
    if (!isUsernameAvailable) {
      toast({
        title: "Username Not Available",
        description: "This username is already taken. Please choose a different one.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const updateData = {
        full_name: values.full_name,
        username: values.username,
        headline: values.headline,
        bio: values.headline, // Use headline as bio
        phone_number: values.phone_number || null,
        city: values.city || null,
        state: values.state || null,
        country: values.country || null,
        date_of_birth: values.date_of_birth ? values.date_of_birth.toISOString().split('T')[0] : null,
        gender: values.gender || null,
        instagram: values.instagram || null,
        youtube_vimeo: values.youtube_vimeo || null,
        custom_links: JSON.stringify(customLinks.filter(link => link.title && link.url)) as any,
        profile_picture_url: profilePicture || null,
        cover_image_url: coverImage || null,
        // Work preferences fields
        "Primary Profession": values.work_preferences,
        category: values.work_preferences[0] || null, // Keep first work preference as category for backward compatibility
        experience_level: values.experience_level,
        years_of_experience: values.years_of_experience,
        work_preference: values.work_preference || null,
        preferred_domains: values.preferred_domains || null,
        willing_to_relocate: values.willing_to_relocate,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", profileData.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile completed successfully! You can now continue using the app.",
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate years for dropdown (from 1920 to current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1920 + 1 }, (_, i) => currentYear - i);

  const handleYearSelect = (year: string) => {
    const currentDate = calendarDate || new Date();
    const newDate = new Date(parseInt(year), currentDate.getMonth(), currentDate.getDate());
    setCalendarDate(newDate);
    form.setValue("date_of_birth", newDate);
  };

  const professionOptions = [
    "actor", "director", "cinematographer", "musician", "editor", 
    "art_director", "stunt_coordinator", "producer", "writer", "other"
  ];

  const workPreferenceOptions = [
    "freelance", "contract", "full_time", "any"
  ];

  const experienceLevelOptions = [
    "beginner", "fresher", "intermediate", "expert", "veteran"
  ];

  const genderOptions = [
    "Male", "Female", "Non-binary", "Other", "Prefer not to say"
  ];

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto [&>button]:hidden" 
      >
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
        </DialogHeader>

        {/* Info Banner */}
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Complete these basic details to continue using your profile and be visible in auditions.
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Profile Images Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-maasta-orange" />
                <h3 className="text-lg font-semibold">Profile Images</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-medium">Profile Picture *</Label>
                  <div className="flex justify-center">
                    <ProfilePictureUpload
                      currentImageUrl={profilePicture}
                      userId={profileData.id}
                      onImageUpdate={setProfilePicture}
                      fullName={profileData.full_name}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="font-medium">Cover Image</Label>
                  <CoverImageUpload
                    currentImageUrl={coverImage}
                    onImageUpdate={setCoverImage}
                    userId={profileData.id}
                  />
                </div>
              </div>
            </div>

            {/* Basic Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-maasta-orange" />
                <h3 className="text-lg font-semibold">Basic Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your full name" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter unique username" 
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-gray-500">
                        Used for your artist page: /artist/{field.value || 'username'}
                      </p>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {genderOptions.map((option) => (
                            <SelectItem key={option} value={option.toLowerCase()}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="headline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headline / Bio *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us about yourself in a few words..."
                        className="min-h-[80px]"
                        maxLength={150}
                        {...field} 
                      />
                    </FormControl>
                    <div className="text-sm text-gray-500 text-right">
                      {field.value?.length || 0}/150
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date_of_birth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth *</FormLabel>
                    <div className="flex gap-2">
                      <Select onValueChange={handleYearSelect} value={calendarDate?.getFullYear()?.toString() || ""}>
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent className="max-h-40">
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "flex-1 pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd-MM-yyyy")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              setCalendarDate(date);
                            }}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                            className="p-3 pointer-events-auto"
                            defaultMonth={calendarDate}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="New York" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State/Province</FormLabel>
                      <FormControl>
                        <Input placeholder="NY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>


            {/* Contact Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-maasta-orange" />
                <h3 className="text-lg font-semibold">Contact (Optional)</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="1234567890" 
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 10) {
                              field.onChange(value);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center">
                  <p className="text-sm text-gray-600">
                    Email: {profileData.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Work Preferences Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-maasta-orange" />
                <h3 className="text-lg font-semibold">Profession & Preferences</h3>
              </div>
              
              <FormField
                control={form.control}
                name="work_preferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Profession * (Select up to 5)</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={WORK_PREFERENCE_CATEGORIES}
                        selected={field.value || []}
                        onChange={(values) => {
                          if (values.length <= 5) {
                            field.onChange(values);
                          }
                        }}
                        placeholder="Select your primary professions..."
                        searchPlaceholder="Search professions..."
                        emptyText="No professions found."
                        maxDisplay={2}
                      />
                    </FormControl>
                    {field.value && field.value.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {field.value.length}/5 professions selected
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="experience_level"
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
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="fresher">Fresher</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                          <SelectItem value="veteran">Veteran</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="years_of_experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="work_preference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Preference Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select work preference type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="full_time">Full Time</SelectItem>
                        <SelectItem value="part_time">Part Time</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="any">Any</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferred_domains"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available For</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Films, TV Shows, Commercials..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="willing_to_relocate"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Willing to relocate</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Social Links Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-maasta-orange" />
                <h3 className="text-lg font-semibold">Social Links</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Instagram className="w-4 h-4" />
                        Instagram
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://instagram.com/yourusername" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="youtube_vimeo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Youtube className="w-4 h-4" />
                        YouTube
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://youtube.com/channel/yourchannel" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Custom Links */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Custom Links</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCustomLink}
                    disabled={customLinks.length >= 5}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Link ({customLinks.length}/5)
                  </Button>
                </div>
                
                {customLinks.map((link, index) => (
                  <div key={link.id || index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium">Custom Link {index + 1}</h5>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCustomLink(index)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`custom-title-${index}`}>Title</Label>
                        <Input
                          id={`custom-title-${index}`}
                          value={link.title}
                          onChange={(e) => updateCustomLink(index, 'title', e.target.value)}
                          placeholder="e.g., My Portfolio"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`custom-url-${index}`}>URL</Label>
                        <Input
                          id={`custom-url-${index}`}
                          type="url"
                          value={link.url}
                          onChange={(e) => updateCustomLink(index, 'url', e.target.value)}
                          placeholder="https://yourlink.com"
                          className={!validateUrl(link.url) && link.url ? "border-red-300" : ""}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  onClose();
                }}
                disabled={isSubmitting}
                className="px-8 py-3"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !checkMandatoryFields()}
                className="px-8 py-3 bg-maasta-orange hover:bg-maasta-orange/90 text-white font-medium"
              >
                {isSubmitting ? "Saving..." : "✅ Save & Continue"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditForm;
