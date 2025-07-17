
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
import { Artist, CustomLink } from "@/types/artist";
import ProfilePictureUpload from "./ProfilePictureUpload";
import CoverImageUpload from "./CoverImageUpload";

const formSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  headline: z.string().min(1, "Headline/Bio is required").max(150, "Headline must be less than 150 characters"),
  phone_number: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  date_of_birth: z.date({
    required_error: "Date of birth is required"
  }).refine((date) => date < new Date(), "Date of birth must be in the past"),
  gender: z.string().optional(),
  category: z.string().min(1, "Primary profession is required"),
  work_preference: z.string().min(1, "Work preference is required"),
  experience_level: z.string().min(1, "Experience level is required"),
  instagram: z.string().optional(),
  youtube_vimeo: z.string().optional(),
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
      headline: profileData.headline || profileData.bio || "",
      phone_number: profileData.phone_number || "",
      city: profileData.city || "",
      state: profileData.state || "",
      country: profileData.country || "",
      date_of_birth: profileData.date_of_birth ? new Date(profileData.date_of_birth) : undefined,
      gender: profileData.gender || "",
      category: profileData.category || "",
      work_preference: profileData.work_preference || "",
      experience_level: profileData.experience_level || "",
      instagram: profileData.instagram || "",
      youtube_vimeo: profileData.youtube_vimeo || "",
    },
  });

  // Check if mandatory fields are filled
  const checkMandatoryFields = () => {
    const values = form.getValues();
    return !!(
      profilePicture &&
      values.headline &&
      values.category &&
      values.work_preference &&
      values.date_of_birth
    );
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

    setIsSubmitting(true);

    try {
      const updateData = {
        full_name: values.full_name,
        headline: values.headline,
        bio: values.headline, // Use headline as bio
        phone_number: values.phone_number || null,
        city: values.city || null,
        state: values.state || null,
        country: values.country || null,
        date_of_birth: values.date_of_birth ? values.date_of_birth.toISOString().split('T')[0] : null,
        gender: values.gender || null,
        category: values.category,
        work_preference: values.work_preference,
        experience_level: values.experience_level,
        instagram: values.instagram || null,
        youtube_vimeo: values.youtube_vimeo || null,
        custom_links: JSON.stringify(customLinks.filter(link => link.title && link.url)) as any,
        profile_picture_url: profilePicture || null,
        cover_image_url: coverImage || null,
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
                          readOnly={!!profileData.full_name}
                          className={profileData.full_name ? "bg-gray-50" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

            {/* Profession & Preferences Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-maasta-orange" />
                <h3 className="text-lg font-semibold">Profession & Preferences</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Profession *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select profession" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {professionOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
                  name="work_preference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Preference *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select preference" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {workPreferenceOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
                  name="experience_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience Level *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {experienceLevelOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option.replace(/\b\w/g, l => l.toUpperCase())}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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

            <div className="flex justify-center pt-6 border-t">
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
