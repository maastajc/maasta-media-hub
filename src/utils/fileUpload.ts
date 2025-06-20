
import { supabase } from "@/integrations/supabase/client";

export interface UploadResult {
  url: string;
  fileName: string;
}

export const uploadMultipleFiles = async (
  files: File[],
  folder: string = 'uploads'
): Promise<UploadResult[]> => {
  const uploadPromises = files.map(file => uploadSingleFile(file, folder));
  return Promise.all(uploadPromises);
};

export const uploadSingleFile = async (
  file: File,
  folder: string = 'uploads'
): Promise<UploadResult> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('media-assets')
    .upload(filePath, file);

  if (error) {
    throw new Error(`Failed to upload ${file.name}: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('media-assets')
    .getPublicUrl(data.path);

  return {
    url: publicUrl,
    fileName: file.name
  };
};

export const uploadAuditionCover = async (file: File): Promise<string> => {
  const result = await uploadSingleFile(file, 'audition-covers');
  return result.url;
};
