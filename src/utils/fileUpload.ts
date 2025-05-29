
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

    // Check if the bucket exists before uploading
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error("Error checking buckets:", bucketsError);
      return { path: "", url: "", error: "Error accessing storage: " + bucketsError.message };
    }
    
    // Check if the bucket exists in the list
    const bucketExists = buckets.some(bucket => bucket.name === bucketName);
    
    // If bucket doesn't exist, return an error
    if (!bucketExists) {
      console.error(`Bucket "${bucketName}" does not exist`);
      return { path: "", url: "", error: `Storage bucket "${bucketName}" does not exist` };
    }

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
  const fileExt = file.name.split('.').pop();
  const fileName = `profile.${fileExt}`;
  return uploadFile(file, 'profile-pictures', userId);
}

/**
 * Uploads an audition cover image using the standardized bucket
 */
export async function uploadAuditionCover(
  file: File,
  auditionId: string
): Promise<FileUploadResult> {
  const fileExt = file.name.split('.').pop();
  const fileName = `cover.${fileExt}`;
  return uploadFile(file, 'audition-covers', auditionId);
}

/**
 * Deletes a file from Supabase storage
 */
export async function deleteFile(path: string, bucketName: string): Promise<boolean> {
  try {
    // Check if the bucket exists before trying to delete
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error("Error checking buckets:", bucketsError);
      return false;
    }
    
    // Check if the bucket exists in the list
    const bucketExists = buckets.some(bucket => bucket.name === bucketName);
    
    // If bucket doesn't exist, return an error
    if (!bucketExists) {
      console.error(`Bucket "${bucketName}" does not exist`);
      return false;
    }
    
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
