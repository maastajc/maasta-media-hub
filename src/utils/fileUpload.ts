
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

export type FileUploadResult = {
  path: string;
  url: string;
  error: string | null;
};

/**
 * Uploads a file to the specified Supabase storage bucket
 */
export async function uploadFile(
  file: File,
  bucketName: string,
  folder: string = ""
): Promise<FileUploadResult> {
  try {
    if (!file) {
      return { path: "", url: "", error: "No file provided" };
    }

    // Create a unique file name to prevent collisions
    const fileExt = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error("Error uploading file:", error);
      return { path: "", url: "", error: error.message };
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    return { 
      path: data.path, 
      url: urlData.publicUrl, 
      error: null 
    };
  } catch (error: any) {
    console.error("Unexpected error during file upload:", error);
    return { 
      path: "", 
      url: "", 
      error: error.message || "Failed to upload file" 
    };
  }
}

/**
 * Uploads a profile picture using the standardized bucket
 */
export async function uploadProfilePicture(
  file: File,
  userId: string
): Promise<FileUploadResult> {
  return uploadFile(file, 'profile-pictures', userId);
}

/**
 * Uploads an audition cover image using the photos bucket
 */
export async function uploadAuditionCover(
  file: File
): Promise<FileUploadResult> {
  return uploadFile(file, 'photos', 'audition-covers');
}

/**
 * Deletes a file from Supabase storage
 */
export async function deleteFile(path: string, bucketName: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([path]);

    if (error) {
      console.error("Error deleting file:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Unexpected error during file deletion:", error);
    return false;
  }
}
