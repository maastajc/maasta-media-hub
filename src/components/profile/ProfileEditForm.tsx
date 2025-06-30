
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
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Artist } from "@/types/artist";
import ProfilePictureUpload from "./ProfilePictureUpload";
import CoverImageUpload from "./CoverImageUpload";

const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().optional(),
  category: z.string().optional(),
  experience_level: z.string().optional(),
  years_of_experience: z.number().min(0).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  phone_number: z.string().optional(),
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

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profileData.full_name || "",
      bio: profileData.bio || "",
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

  const onSubmit = async (data: ProfileFormData) => {
    if (!userId) return;
    
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          ...data,
          profile_picture_url: profileImageUrl,
          cover_image_url: coverImageUrl,
          updated_at: new Date().toISOString()
        })
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
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    {...register("phone_number")}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  {...register("bio")}
                  className="mt-1"
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    {...register("city")}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    {...register("state")}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    {...register("country")}
                    className="mt-1"
                  />
                </div>
              </div>
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
                  <Label htmlFor="category">Category</Label>
                  <Select value={watch("category")} onValueChange={(value) => setValue("category", value)}>
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
                </div>

                <div>
                  <Label htmlFor="experience_level">Experience Level</Label>
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
