
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import ProfilePictureUpload from "./ProfilePictureUpload";
import { toast } from "sonner";

// Enhanced validation schema with comprehensive rules
const profileSchema = z.object({
  full_name: z.string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Full name can only contain letters, spaces, hyphens, and apostrophes"),
  bio: z.string()
    .max(1000, "Bio must be less than 1000 characters")
    .optional(),
  city: z.string()
    .max(100, "City name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]*$/, "City can only contain letters, spaces, hyphens, and apostrophes")
    .optional(),
  state: z.string()
    .max(100, "State name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]*$/, "State can only contain letters, spaces, hyphens, and apostrophes")
    .optional(),
  country: z.string()
    .max(100, "Country name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]*$/, "Country can only contain letters, spaces, hyphens, and apostrophes")
    .optional(),
  phone_number: z.string()
    .regex(/^\+?[\d\s\-\(\)\.]{10,}$/, "Please enter a valid phone number with at least 10 digits")
    .optional()
    .or(z.literal("")),
  date_of_birth: z.string()
    .refine((date) => {
      if (!date) return true;
      const birthDate = new Date(date);
      const today = new Date();
      const minAge = new Date();
      minAge.setFullYear(today.getFullYear() - 120);
      return birthDate <= today && birthDate >= minAge;
    }, "Please enter a valid date of birth")
    .optional(),
  gender: z.string().optional(),
  willing_to_relocate: z.boolean().default(false),
  work_preference: z.enum(["freelance", "contract", "full_time", "any"]).default("any"),
  category: z.enum(["actor", "director", "cinematographer", "musician", "editor", "art_director", "stunt_coordinator", "producer", "writer", "other"]).optional(),
  experience_level: z.enum(["beginner", "fresher", "intermediate", "expert", "veteran"]).default("beginner"),
  years_of_experience: z.number()
    .min(0, "Years of experience cannot be negative")
    .max(100, "Years of experience cannot exceed 100")
    .optional(),
  association_membership: z.string()
    .max(200, "Association membership must be less than 200 characters")
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileEditFormProps {
  profileData: any;
  onClose: () => void;
  onUpdate: () => void;
  userId?: string;
}

const ProfileEditForm = ({ profileData, onClose, onUpdate, userId }: ProfileEditFormProps) => {
  const { toast: useToastHook } = useToast();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState(profileData?.profile_picture_url || "");

  // Get signup data from user metadata or existing profile
  const getSignupFullName = () => {
    // First try user metadata from signup
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    // Fallback to existing profile data
    if (profileData?.full_name && profileData.full_name !== 'New User') {
      return profileData.full_name;
    }
    // Last fallback to empty string for new input
    return '';
  };

  const getSignupEmail = () => {
    // Always use the user's email from auth
    return user?.email || '';
  };

  // Safe default values for new users
  const defaultValues = {
    full_name: getSignupFullName(),
    bio: profileData?.bio || "",
    city: profileData?.city || "",
    state: profileData?.state || "",
    country: profileData?.country || "",
    phone_number: profileData?.phone_number || "",
    date_of_birth: profileData?.date_of_birth || "",
    gender: profileData?.gender || "",
    willing_to_relocate: profileData?.willing_to_relocate || false,
    work_preference: profileData?.work_preference || "any",
    category: profileData?.category || "actor",
    experience_level: profileData?.experience_level || "beginner",
    years_of_experience: profileData?.years_of_experience || 0,
    association_membership: profileData?.association_membership || "",
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
    mode: "onChange", // Enable real-time validation
  });

  const onSubmit = async (values: ProfileFormValues) => {
    if (!userId || !user?.email) {
      toast.error("User information is required to update profile");
      return;
    }

    try {
      setIsSaving(true);

      console.log('Updating profile with values:', values);

      // Additional server-side validation
      if (values.phone_number && !/^\+?[\d\s\-\(\)\.]{10,}$/.test(values.phone_number)) {
        throw new Error("Invalid phone number format. Please use a valid phone number with at least 10 digits.");
      }

      if (values.date_of_birth) {
        const birthDate = new Date(values.date_of_birth);
        if (birthDate > new Date()) {
          throw new Error("Date of birth cannot be in the future.");
        }
      }

      // Prepare data for unified_profiles table with all required fields
      const unifiedProfileData = {
        id: userId,
        full_name: values.full_name,
        email: getSignupEmail(), // Use signup email
        bio: values.bio || null,
        city: values.city || null,
        state: values.state || null,
        country: values.country || null,
        phone_number: values.phone_number || null,
        date_of_birth: values.date_of_birth || null,
        gender: values.gender || null,
        willing_to_relocate: values.willing_to_relocate,
        work_preference: values.work_preference,
        category: values.category,
        experience_level: values.experience_level,
        years_of_experience: values.years_of_experience || 0,
        association_membership: values.association_membership || null,
        profile_picture_url: profilePictureUrl || null,
        updated_at: new Date().toISOString()
      };

      // Update unified_profiles
      const { error: profileError } = await supabase
        .from("unified_profiles")
        .upsert(unifiedProfileData, {
          onConflict: 'id'
        });

      if (profileError) {
        console.error('Error updating unified_profiles:', profileError);
        
        // Handle specific database constraint violations
        if (profileError.message.includes('valid_email')) {
          throw new Error("Please enter a valid email address.");
        }
        if (profileError.message.includes('valid_phone')) {
          throw new Error("Please enter a valid phone number with at least 10 digits.");
        }
        if (profileError.message.includes('valid_experience_years')) {
          throw new Error("Years of experience must be between 0 and 100.");
        }
        if (profileError.message.includes('valid_date_of_birth')) {
          throw new Error("Date of birth cannot be in the future.");
        }
        
        throw profileError;
      }

      toast.success("Profile updated successfully!");
      useToastHook({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });

      onUpdate();
      onClose();
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      const errorMessage = error.message || "Failed to update profile";
      toast.error(errorMessage);
      useToastHook({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {!profileData?.full_name || profileData?.full_name === 'New User' ? 'Set Up Your Profile' : 'Edit Profile'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* Profile Picture Section */}
          <div className="flex justify-center">
            <ProfilePictureUpload
              currentImageUrl={profilePictureUrl}
              userId={userId || ""}
              onImageUpdate={setProfilePictureUrl}
              fullName={form.watch("full_name") || getSignupFullName()}
            />
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name*</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your full name" 
                          {...field}
                          className={form.formState.errors.full_name ? "border-red-500" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email Display (Read-only) */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Email</label>
                  <Input 
                    value={getSignupEmail()} 
                    disabled 
                    className="bg-gray-50 text-gray-600"
                  />
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your phone number (e.g., +1234567890)" 
                          {...field}
                          className={form.formState.errors.phone_number ? "border-red-500" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-gray-500">Format: +1234567890 or (123) 456-7890</p>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date_of_birth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field}
                          max={new Date().toISOString().split('T')[0]}
                          className={form.formState.errors.date_of_birth ? "border-red-500" : ""}
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your city" 
                          {...field}
                          className={form.formState.errors.city ? "border-red-500" : ""}
                        />
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
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your state" 
                          {...field}
                          className={form.formState.errors.state ? "border-red-500" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your country" 
                          {...field}
                          className={form.formState.errors.country ? "border-red-500" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Bio */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us about yourself..." 
                        className={`min-h-24 ${form.formState.errors.bio ? "border-red-500" : ""}`}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-gray-500">Maximum 1000 characters</p>
                  </FormItem>
                )}
              />

              {/* Artist Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Artist Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your category" />
                            </SelectTrigger>
                          </FormControl>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                            min="0"
                            max="100"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            className={form.formState.errors.years_of_experience ? "border-red-500" : ""}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-gray-500">Must be between 0 and 100</p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="association_membership"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Association Membership</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., SAG-AFTRA, DGA" 
                            {...field}
                            className={form.formState.errors.association_membership ? "border-red-500" : ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Work Preferences */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Work Preferences</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="work_preference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Work Preference</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select work preference" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="freelance">Freelance</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="full_time">Full Time</SelectItem>
                            <SelectItem value="any">Any</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="willing_to_relocate"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Willing to Relocate</FormLabel>
                          <div className="text-sm text-gray-600">
                            Are you open to relocating for work?
                          </div>
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
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSaving || !form.formState.isValid} 
                  className="bg-maasta-orange hover:bg-maasta-orange/90"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditForm;
