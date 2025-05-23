
// Helper function to determine if a deadline is urgent (within 5 days)
export const isUrgent = (deadlineStr: string): boolean => {
  const today = new Date();
  const deadline = new Date(deadlineStr);
  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 && diffDays <= 5;
};

// Calculate days remaining until deadline
export const getDaysRemaining = (deadlineStr: string | null): number | null => {
  if (!deadlineStr) return null;
  
  const today = new Date();
  const deadline = new Date(deadlineStr);
  const diffTime = deadline.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Default cover image
export const DEFAULT_COVER = "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?q=80&w=320";
