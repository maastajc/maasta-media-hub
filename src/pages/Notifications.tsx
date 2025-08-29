
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { notificationService, Notification } from "@/services/notificationService";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { Loader2, Bell } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (!user?.id) return;

    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const [notifs, count] = await Promise.all([
          notificationService.getNotifications(),
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
        setNotifications(prev => [newNotification, ...prev]);
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

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    return notif.type === filter;
  });

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p>Please sign in to view notifications.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-8 w-8 text-maasta-purple" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                  <p className="text-gray-600 mt-1">
                    Stay updated with your latest activities
                  </p>
                </div>
              </div>
              {unreadCount > 0 && (
                <Button onClick={handleMarkAllAsRead} variant="outline">
                  Mark All as Read ({unreadCount})
                </Button>
              )}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>All Notifications</span>
                {unreadCount > 0 && (
                  <Badge variant="destructive">{unreadCount} unread</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={filter} onValueChange={setFilter}>
                <div className="px-6 pt-6">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="audition">Auditions</TabsTrigger>
                    <TabsTrigger value="booking">Bookings</TabsTrigger>
                    <TabsTrigger value="networking">Networking</TabsTrigger>
                    <TabsTrigger value="event">Events</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value={filter} className="mt-0">
                  {isLoading ? (
                    <div className="flex items-center justify-center p-12">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : filteredNotifications.length === 0 ? (
                    <div className="text-center p-12 text-gray-500">
                      <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium mb-2">No notifications</p>
                      <p>
                        {filter === 'all' 
                          ? "You're all caught up! No new notifications."
                          : `No ${filter} notifications found.`
                        }
                      </p>
                    </div>
                  ) : (
                    <div>
                      {filteredNotifications.map((notification, index) => (
                        <div key={notification.id}>
                          <NotificationItem
                            notification={notification}
                            onMarkAsRead={handleMarkAsRead}
                          />
                          {index < filteredNotifications.length - 1 && <Separator />}
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Notifications;
