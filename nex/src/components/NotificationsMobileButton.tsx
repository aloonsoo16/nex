"use client";

import { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationsAsRead,
} from "@/actions/notification.action";
import { Button } from "./ui/button";
import Link from "next/link";
import { BellIcon } from "lucide-react";

type Notifications = Awaited<ReturnType<typeof getNotifications>>;
type Notification = Notifications[number];

function NotificationsMobileButton() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
        const unread = data.filter((n) => !n.read).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error("Error al obtener notificaciones:", error);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    if (unreadIds.length > 0) {
      try {
        setUnreadCount(0);
      } catch (error) {
        console.error("Error al marcar notificaciones como leídas:", error);
      }
    }
  };

  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start space-x-2 rounded-full"
      asChild
      onClick={handleMarkAsRead}
    >
      <Link href="/notifications">
        <div className="relative">
          <BellIcon size={40} />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <span className="text-sm">Notificaciones</span>
      </Link>
    </Button>
  );
}

export default NotificationsMobileButton;
