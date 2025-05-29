
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

// Get formatted deadline status
export const getDeadlineStatus = (deadlineStr: string | null): string => {
  if (!deadlineStr) return 'Open until filled';
  
  const daysRemaining = getDaysRemaining(deadlineStr);
  if (daysRemaining === null) return 'Open until filled';
  
  if (daysRemaining < 0) {
    return 'Deadline passed';
  } else if (daysRemaining === 0) {
    return 'Deadline today';
  } else if (daysRemaining === 1) {
    return '1 day remaining';
  } else {
    return `${daysRemaining} days remaining`;
  }
};

// Get formatted audition date status
export const getAuditionDateStatus = (auditionDateStr: string | null): string => {
  if (!auditionDateStr) return 'To be announced';
  
  const today = new Date();
  const auditionDate = new Date(auditionDateStr);
  const diffTime = auditionDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return 'Audition completed';
  } else if (diffDays === 0) {
    return 'Audition today';
  } else if (diffDays === 1) {
    return 'Tomorrow';
  } else {
    return auditionDate.toLocaleDateString();
  }
};

// Default cover image
export const DEFAULT_COVER = "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?q=80&w=320";
