
import { useState } from 'react';
import { toast } from 'sonner';

interface UseProfileSectionUpdateOptions {
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: () => void;
}

export const useProfileSectionUpdate = (options: UseProfileSectionUpdateOptions = {}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async <T>(
    submitFn: () => Promise<T>,
    customOptions?: Partial<UseProfileSectionUpdateOptions>
  ): Promise<T | null> => {
    if (isSubmitting) {
      return null; // Prevent duplicate submissions
    }

    const {
      successMessage = 'Updated successfully!',
      errorMessage = 'Failed to update. Please try again.',
      onSuccess
    } = { ...options, ...customOptions };

    setIsSubmitting(true);

    try {
      const result = await submitFn();
      toast.success(successMessage);
      onSuccess?.();
      return result;
    } catch (error: any) {
      console.error('Profile section update error:', error);
      toast.error(error.message || errorMessage);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting
  };
};
