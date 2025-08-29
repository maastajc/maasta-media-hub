
import { notificationService } from "@/services/notificationService";

export const useNotifications = () => {
  const createNotification = async (
    userId: string,
    type: 'audition' | 'booking' | 'networking' | 'event',
    title: string,
    message: string,
    relatedId?: string,
    relatedType?: string
  ) => {
    try {
      await notificationService.createNotification({
        user_id: userId,
        type,
        title,
        message,
        is_read: false,
        related_id: relatedId,
        related_type: relatedType
      });
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  // Specific notification creators
  const notifyAuditionPosted = (userId: string, auditionTitle: string, category: string) => {
    return createNotification(
      userId,
      'audition',
      'New Audition Posted',
      `A new audition "${auditionTitle}" has been posted in ${category}`
    );
  };

  const notifyAuditionApplicationUpdate = (userId: string, auditionTitle: string, status: string) => {
    return createNotification(
      userId,
      'audition',
      'Application Update',
      `Your application for "${auditionTitle}" has been ${status}`
    );
  };

  const notifyBookingRequest = (userId: string, bookerName: string, projectType: string) => {
    return createNotification(
      userId,
      'booking',
      'New Booking Request',
      `${bookerName} sent you a booking request for ${projectType}`
    );
  };

  const notifyBookingUpdate = (userId: string, status: string, projectType: string) => {
    return createNotification(
      userId,
      'booking',
      'Booking Update',
      `Your booking request for "${projectType}" has been ${status}`
    );
  };

  const notifyConnectionRequest = (userId: string, requesterName: string) => {
    return createNotification(
      userId,
      'networking',
      'New Connection Request',
      `${requesterName} sent you a connection request`
    );
  };

  const notifyConnectionAccepted = (userId: string, accepterName: string) => {
    return createNotification(
      userId,
      'networking',
      'Connection Accepted',
      `${accepterName} accepted your connection request`
    );
  };

  const notifyEventRegistration = (userId: string, eventTitle: string) => {
    return createNotification(
      userId,
      'event',
      'Event Registration Confirmed',
      `You have successfully registered for "${eventTitle}"`
    );
  };

  const notifyEventReminder = (userId: string, eventTitle: string, startTime: string) => {
    return createNotification(
      userId,
      'event',
      'Event Reminder',
      `"${eventTitle}" starts tomorrow at ${startTime}`
    );
  };

  return {
    createNotification,
    notifyAuditionPosted,
    notifyAuditionApplicationUpdate,
    notifyBookingRequest,
    notifyBookingUpdate,
    notifyConnectionRequest,
    notifyConnectionAccepted,
    notifyEventRegistration,
    notifyEventReminder
  };
};
