
import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { notificationService, Notification } from "@/services/notificationService";
import { NotificationDropdown } from "./NotificationDropdown";

export const NotificationBell = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch initial notifications and unread count
  useEffect(() => {
    if (!user?.id) return;

    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const [notifs, count] = await Promise.all([
          notificationService.getNotifications(10),
          notificationService.getUnreadCount()
        ]);
        setNotifications(notifs);
        setUnreadCount(count);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [user?.id]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!user?.id) return;

    const channel = notificationService.subscribeToNotifications(
      user.id,
      (newNotification) => {
        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
        setUnreadCount(prev => prev + 1);
      }
    );

    return () => {
      channel?.unsubscribe();
    };
  }, [user?.id]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, is_read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <NotificationDropdown
          notifications={notifications}
          unreadCount={unreadCount}
          isLoading={isLoading}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
