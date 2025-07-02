import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Artist } from "@/types/artist";
import ProfilePictureUpload from "./ProfilePictureUpload";
import CoverImageUpload from "./CoverImageUpload";
import MediaSection from "./MediaSection";

const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(/^[a-z0-9_]+$/, "Username must be lowercase and can only contain letters, numbers, and underscores"),
  bio: z.string().min(10, "Bio must be at least 10 characters long"),
  date_of_birth: z.date({
    required_error: "Date of birth is required",
  }),
  category: z.string().min(1, "Category is required"),
  experience_level: z.string().min(1, "Experience level is required"),
  years_of_experience: z.number().min(0).optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Province is required"),
  country: z.string().min(1, "Country is required"),
  phone_number: z.string().regex(/^\+91\d{10}$/, "Phone number must be in format +91XXXXXXXXXX"),
  personal_website: z.string().optional(),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
  youtube_vimeo: z.string().optional(),
  imdb_profile: z.string().optional(),
  behance: z.string().optional(),
  work_preference: z.string().optional(),
  preferred_domains: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileEditFormProps {
  profileData: Artist;
  onClose: () => void;
  onUpdate: () => void;
  userId?: string;
}

const ProfileEditForm = ({ profileData, onClose, onUpdate, userId }: ProfileEditFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(profileData.profile_picture_url);
  const [coverImageUrl, setCoverImageUrl] = useState(profileData.cover_image_url);
  const [showOtherCategory, setShowOtherCategory] = useState(false);
  const [otherCategoryValue, setOtherCategoryValue] = useState('');

  const { register, handleSubmit, setValue, watch, control, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profileData.full_name || "",
      username: profileData.username || "",
      bio: profileData.bio || "",
      date_of_birth: profileData.date_of_birth ? new Date(profileData.date_of_birth) : undefined,
      category: profileData.category || "",
      experience_level: profileData.experience_level || "",
      years_of_experience: profileData.years_of_experience || 0,
      city: profileData.city || "",
      state: profileData.state || "",
      country: profileData.country || "",
      phone_number: profileData.phone_number || "",
      personal_website: profileData.personal_website || "",
      instagram: profileData.instagram || "",
      linkedin: profileData.linkedin || "",
      youtube_vimeo: profileData.youtube_vimeo || "",
      imdb_profile: profileData.imdb_profile || "",
      behance: profileData.behance || "",
      work_preference: profileData.work_preference || "",
      preferred_domains: profileData.preferred_domains || "",
    }
  });

  const selectedDate = watch("date_of_birth");

  const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!userId) return;
    
    try {
      setIsSubmitting(true);
      
      // Check if username is already taken by another user
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', data.username)
        .neq('id', userId)
        .maybeSingle();

      if (checkError) throw checkError;
      
      if (existingUser) {
        toast.error("Username is already taken. Please choose a different one.");
        return;
      }

      // Calculate age from date of birth
      const age = calculateAge(data.date_of_birth);

      // Prepare update data with other category handling
      const updateData = {
        ...data,
        date_of_birth: data.date_of_birth.toISOString().split('T')[0], // Store as date string
        profile_picture_url: profileImageUrl,
        cover_image_url: coverImageUrl,
        updated_at: new Date().toISOString()
      };

      // If "other" category selected, store the custom category suggestion
      if (data.category === "other" && otherCategoryValue.trim()) {
        updateData.category = otherCategoryValue.trim();
        // TODO: In future, we could also store this in a separate suggestions table for admin review
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);

      if (error) throw error;

      toast.success("Profile updated successfully!");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Cover Image Section */}
          <Card>
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
            </CardHeader>
            <CardContent>
              <CoverImageUpload
                currentImageUrl={coverImageUrl}
                onImageUpdate={setCoverImageUrl}
                userId={userId || ""}
              />
            </CardContent>
          </Card>

          {/* Profile Picture Section */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfilePictureUpload
                currentImageUrl={profileImageUrl}
                onImageUpdate={setProfileImageUrl}
                userId={userId || ""}
              />
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    {...register("full_name")}
                    className="mt-1"
                  />
                  {errors.full_name && (
                    <p className="text-sm text-red-600 mt-1">{errors.full_name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    {...register("username")}
                    className="mt-1"
                    placeholder="lowercase_username_only"
                    onChange={(e) => {
                      setValue("username", e.target.value.toLowerCase());
                    }}
                  />
                  {errors.username && (
                    <p className="text-sm text-red-600 mt-1">{errors.username.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="phone_number">Phone Number *</Label>
                <div className="flex mt-1">
                  <div className="flex items-center px-3 bg-gray-100 border border-r-0 rounded-l-md">
                    <span className="text-sm text-gray-600">+91</span>
                  </div>
                  <Input
                    id="phone_number"
                    {...register("phone_number")}
                    className="rounded-l-none"
                    placeholder="Enter 10-digit phone number"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.startsWith('+91')) {
                        setValue("phone_number", value);
                      } else {
                        const digits = value.replace(/\D/g, '');
                        if (digits.length <= 10) {
                          setValue("phone_number", `+91${digits}`);
                        }
                      }
                    }}
                  />
                </div>
                {errors.phone_number && (
                  <p className="text-sm text-red-600 mt-1">{errors.phone_number.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="date_of_birth">Date of Birth *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => setValue("date_of_birth", date!)}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.date_of_birth && (
                  <p className="text-sm text-red-600 mt-1">{errors.date_of_birth.message}</p>
                )}
                {selectedDate && (
                  <p className="text-sm text-gray-500 mt-1">
                    Age: {calculateAge(selectedDate)} years
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="bio">Bio *</Label>
                <Textarea
                  id="bio"
                  {...register("bio")}
                  className="mt-1"
                  rows={4}
                  placeholder="Tell us about yourself... (minimum 10 characters)"
                />
                {errors.bio && (
                  <p className="text-sm text-red-600 mt-1">{errors.bio.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    {...register("city")}
                    className="mt-1"
                  />
                  {errors.city && (
                    <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="state">State/Province *</Label>
                  <Input
                    id="state"
                    {...register("state")}
                    className="mt-1"
                  />
                  {errors.state && (
                    <p className="text-sm text-red-600 mt-1">{errors.state.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    {...register("country")}
                    className="mt-1"
                  />
                  {errors.country && (
                    <p className="text-sm text-red-600 mt-1">{errors.country.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media Portfolio Section */}
          <Card>
            <CardHeader>
              <CardTitle>Media Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              <MediaSection 
                profileData={profileData} 
                onUpdate={onUpdate}
                userId={userId}
              />
            </CardContent>
          </Card>

          {/* Work Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Work Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={watch("category")} 
                    onValueChange={(value) => {
                      setValue("category", value);
                      setShowOtherCategory(value === "other");
                      if (value !== "other") {
                        setOtherCategoryValue('');
                      }
                    }}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="actor">Actor</SelectItem>
                      <SelectItem value="director">Director</SelectItem>
                      <SelectItem value="cinematographer">Cinematographer</SelectItem>
                      <SelectItem value="musician">Musician</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="art_director">Art Director</SelectItem>
                      <SelectItem value="stunt_coordinator">Stunt Coordinator</SelectItem>
                      <SelectItem value="producer">Producer</SelectItem>
                      <SelectItem value="writer">Writer</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
                  )}
                  
                  {/* Other Category Input */}
                  {showOtherCategory && (
                    <div className="mt-3">
                      <Label htmlFor="other_category">Suggest a new category</Label>
                      <Input
                        id="other_category"
                        value={otherCategoryValue}
                        onChange={(e) => setOtherCategoryValue(e.target.value)}
                        placeholder="Enter your category suggestion"
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        This will be reviewed for inclusion in future category options
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="experience_level">Experience Level *</Label>
                  <Select value={watch("experience_level")} onValueChange={(value) => setValue("experience_level", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="fresher">Fresher</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                      <SelectItem value="veteran">Veteran</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.experience_level && (
                    <p className="text-sm text-red-600 mt-1">{errors.experience_level.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="years_of_experience">Years of Experience</Label>
                  <Input
                    id="years_of_experience"
                    type="number"
                    min="0"
                    {...register("years_of_experience", { valueAsNumber: true })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="work_preference">Work Preference</Label>
                  <Select value={watch("work_preference")} onValueChange={(value) => setValue("work_preference", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select work preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="freelance">Freelance</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="full_time">Full Time</SelectItem>
                      <SelectItem value="any">Any</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="preferred_domains">What can we reach out to you for?</Label>
                <Textarea
                  id="preferred_domains"
                  {...register("preferred_domains")}
                  className="mt-1"
                  rows={2}
                  placeholder="E.g., Acting opportunities, directing projects, collaborations..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Links */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="personal_website">Personal Website</Label>
                  <Input
                    id="personal_website"
                    {...register("personal_website")}
                    className="mt-1"
                    placeholder="https://your-website.com"
                  />
                </div>

                <div>
                  <Label htmlFor="imdb_profile">IMDb Profile</Label>
                  <Input
                    id="imdb_profile"
                    {...register("imdb_profile")}
                    className="mt-1"
                    placeholder="https://imdb.com/name/..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    {...register("instagram")}
                    className="mt-1"
                    placeholder="https://instagram.com/username"
                  />
                </div>

                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    {...register("linkedin")}
                    className="mt-1"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="youtube_vimeo">YouTube/Vimeo</Label>
                  <Input
                    id="youtube_vimeo"
                    {...register("youtube_vimeo")}
                    className="mt-1"
                    placeholder="https://youtube.com/channel/..."
                  />
                </div>

                <div>
                  <Label htmlFor="behance">Behance</Label>
                  <Input
                    id="behance"
                    {...register("behance")}
                    className="mt-1"
                    placeholder="https://behance.net/username"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-maasta-orange hover:bg-maasta-orange/90"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditForm;
