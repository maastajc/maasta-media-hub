import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import ProfilePictureUpload from "./ProfilePictureUpload";
import { toast } from "sonner";

const profileSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  bio: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  phone_number: z.string().optional(),
  date_of_birth: z.string().optional(),
  gender: z.string().optional(),
  willing_to_relocate: z.boolean().default(false),
  work_preference: z.enum(["freelance", "contract", "full_time", "any"]).default("any"),
  // Artist details
  category: z.enum(["actor", "director", "cinematographer", "musician", "editor", "art_director", "stunt_coordinator", "producer", "writer", "other"]).optional(),
  experience_level: z.enum(["beginner", "fresher", "intermediate", "expert", "veteran"]).default("beginner"),
  years_of_experience: z.number().min(0).optional(),
  association_membership: z.string().optional(),
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
  const [isSaving, setIsSaving] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState(profileData?.profile_picture_url || "");

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profileData?.full_name || "",
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
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    if (!userId) return;

    try {
      setIsSaving(true);

      // Update artist details with all profile fields
      const { error: artistError } = await supabase
        .from("artist_details")
        .update({
          ...values,
          profile_picture_url: profilePictureUrl,
          updated_at: new Date().toISOString()
        })
        .eq("id", userId);

      if (artistError) throw artistError;

      toast.success("Profile updated successfully!");
      useToastHook({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });

      onUpdate();
      onClose();
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      toast.error(error.message || "Failed to update profile");
      useToastHook({
        title: "Error",
        description: error.message || "Failed to update profile",
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
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* Profile Picture Section */}
          <div className="flex justify-center">
            <ProfilePictureUpload
              currentImageUrl={profilePictureUrl}
              userId={userId || ""}
              onImageUpdate={setProfilePictureUrl}
              fullName={form.watch("full_name")}
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
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your phone number" {...field} />
                      </FormControl>
                      <FormMessage />
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
                        <Input type="date" {...field} />
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
                        <Input placeholder="Enter your city" {...field} />
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
                        <Input placeholder="Enter your state" {...field} />
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
                        <Input placeholder="Enter your country" {...field} />
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
                        className="min-h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
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
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
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
                          <Input placeholder="e.g., SAG-AFTRA, DGA" {...field} />
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
                <Button type="submit" disabled={isSaving} className="bg-maasta-orange hover:bg-maasta-orange/90">
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
