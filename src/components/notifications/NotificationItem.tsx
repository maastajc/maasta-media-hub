
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Notification } from "@/services/notificationService";
import { 
  User, 
  Calendar, 
  Briefcase, 
  Users, 
  Eye,
  EyeOff
} from "lucide-react";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (notificationId: string) => void;
}

export const NotificationItem = ({ notification, onMarkAsRead }: NotificationItemProps) => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'audition':
        return <Briefcase className="h-4 w-4 text-maasta-purple" />;
      case 'booking':
        return <Calendar className="h-4 w-4 text-maasta-orange" />;
      case 'networking':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'event':
        return <Calendar className="h-4 w-4 text-green-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!notification.is_read) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div 
      className={cn(
        "flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors cursor-pointer",
        !notification.is_read && "bg-blue-50 border-l-4 border-l-blue-500"
      )}
      onClick={handleMarkAsRead}
    >
      <div className="flex-shrink-0 mt-1">
        {getNotificationIcon(notification.type)}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className={cn(
          "text-sm font-medium text-gray-900",
          !notification.is_read && "font-semibold"
        )}>
          {notification.title}
        </h4>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {notification.message}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
        </p>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleMarkAsRead}
        className="flex-shrink-0 p-1"
      >
        {notification.is_read ? (
          <EyeOff className="h-3 w-3 text-gray-400" />
        ) : (
          <Eye className="h-3 w-3 text-blue-500" />
        )}
      </Button>
    </div>
  );
};
