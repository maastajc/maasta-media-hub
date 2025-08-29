
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { NotificationItem } from "./NotificationItem";
import { Notification } from "@/services/notificationService";
import { Loader2 } from "lucide-react";

interface NotificationDropdownProps {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationDropdown = ({
  notifications,
  unreadCount,
  isLoading,
  onMarkAsRead,
  onMarkAllAsRead
}: NotificationDropdownProps) => {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold text-lg">Notifications</h3>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMarkAllAsRead}
            className="text-xs"
          >
            Mark all read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <ScrollArea className="max-h-96">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center text-gray-500 p-8">
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="py-2">
            {notifications.map((notification, index) => (
              <div key={notification.id}>
                <NotificationItem
                  notification={notification}
                  onMarkAsRead={onMarkAsRead}
                />
                {index < notifications.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      {notifications.length > 0 && (
        <>
          <Separator />
          <div className="p-3">
            <Link to="/notifications">
              <Button variant="ghost" className="w-full text-sm">
                View All Notifications
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};
