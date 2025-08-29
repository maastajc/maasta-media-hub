
import { supabase } from "@/integrations/supabase/client";

export interface Notification {
  id: string;
  user_id: string;
  type: 'audition' | 'booking' | 'networking' | 'event';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  related_id?: string;
  related_type?: string;
}

export const notificationService = {
  // Get notifications for the current user
  async getNotifications(limit?: number): Promise<Notification[]> {
    const query = supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (limit) {
      query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
    
    return data || [];
  },

  // Get unread notifications count
  async getUnreadCount(): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false);
    
    if (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
    
    return count || 0;
  },

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
    
    if (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  async markAllAsRead(): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('is_read', false);
    
    if (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Create a new notification (used by system/edge functions)
  async createNotification(notification: Omit<Notification, 'id' | 'created_at' | 'updated_at'>): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .insert([notification]);
    
    if (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  // Subscribe to real-time updates
  subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback(payload.new as Notification);
        }
      )
      .subscribe();

    return channel;
  }
};
