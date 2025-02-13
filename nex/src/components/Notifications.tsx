"use client";

import { useEffect, useState } from "react";
import { NotificationsSkeleton } from "@/components/NotificationSkeleton";
import {
  HeartIcon,
  MessageCircleIcon,
  UserPlusIcon,
  Repeat2,
} from "lucide-react";
import {
  getNotifications,
  markNotificationsAsRead,
} from "@/actions/notification.action";
import { toast } from "sonner";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNowStrict } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import Head from "next/head";

type Notifications = Awaited<ReturnType<typeof getNotifications>>;
type Notification = Notifications[number];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "LIKE":
      return <HeartIcon className="text-rose-500 fill-rose-500" size={20} />;
    case "COMMENT":
      return <MessageCircleIcon className="text-sky-500 fill-sky-500" size={20} />;
    case "FOLLOW":
      return <UserPlusIcon className="text-green-500 fill-green-500" size={20} />;
    case "REPOST":
      return <Repeat2 className="text-green-500" size={20} />;
    case "CITED":
      return <Repeat2 className="text-green-500" size={20} />;
    default:
      return null;
  }
};

function NotificationComponent() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const data = await getNotifications();
        setNotifications(data);

        const unreadIds = data.filter((n) => !n.read).map((n) => n.id);
        if (unreadIds.length > 0) await markNotificationsAsRead(unreadIds);
      } catch (error) {
        toast.error("Error al encontrar notificaciones");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (isLoading) return <NotificationsSkeleton />;

  return (
    <>
      <Head>
        <title>Tus notificaciones</title>
        <meta name="description" content="Tus notificaciones de Nex" />
      </Head>
      <div className="space-y-4 rounded-xl lg:border-b lg:border-l lg:border-r lg:border-t pt-2 overflow-hidden">
        <Card className="shadow-none rounded-none border-none">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle>Tus notificaciones</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {notifications.length === 0 ? (
              <div className="text-center text-muted-foreground  text-sm p-8">
                No tienes notificaciones
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 rounded-lg ${
                    index !== notifications.length - 1 ? "border-b" : ""
                  } rounded-b py-6 px-4 text-sm text-primary ${
                    !notification.read ? "bg-secondary/25" : ""
                  }`}
                >
                  <Link
                    href={`/profile/${notification.creator.username}`}
                    className="text-primary font-semibold"
                  >
                    <Avatar className="w-10 h-10 border-4 border-transparent">
                      <AvatarImage
                        src={notification.creator.image ?? "/avatar.png"}
                      />
                    </Avatar>
                  </Link>

                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-2">
                      {getNotificationIcon(notification.type)}

                      <Link href={`/profile/${notification.creator.username}`}>
                        <span className="font-semibold text-primary">
                          @{notification.creator.username}
                        </span>
                      </Link>

                      {notification.type === "FOLLOW"
                        ? "ha comenzado a seguirte"
                        : notification.type === "LIKE"
                        ? "ha dado me gusta a tu publicación"
                        : notification.type === "CITED"
                        ? "ha citado tu publicacion"
                        : notification.type === "REPOST"
                        ? "ha compartido tu publicación"
                        : "ha comentado tu publicación"}
                    </div>

                    {notification.post &&
                      (notification.type === "LIKE" ||
                        notification.type === "COMMENT" ||
                        notification.type === "CITED" ||
                        notification.type === "REPOST") && (
                        <div className="pl-6 space-y-2">
                          {notification.type === "COMMENT" &&
                            notification.comment && (
                              <>
                                <div
                                  className={`rounded-lg py-4
                                      ${
                                        !notification.read
                                          ? "bg-secondary/50"
                                          : "bg-secondary/25"
                                      }`}
                                >
                                  <div className="flex items-start gap-4  text-sm py-2 px-4 text-primary">
                                    {notification.comment.content}
                                  </div>

                                  {notification.comment.image && (
                                    <div className="flex items-center py-2 px-4">
                                      <Card className="rounded-lg overflow-hidden border-none shadow-none">
                                        <img
                                          src={
                                            notification.comment.image ||
                                            "/placeholder.svg"
                                          }
                                          alt="Contenido de la publicación"
                                          className="w-full h-auto object-cover max-h-[250px] max-w-[250px]"
                                        />
                                      </Card>
                                    </div>
                                  )}
                                </div>
                              </>
                            )}

                          {notification.type === "CITED" &&
                            notification.repost && (
                              <Link
                                href={`/repost/${notification.repost.id}`}
                                className="block"
                              >
                                <div
                                  className={`rounded-lg py-4
                                      ${
                                        !notification.read
                                          ? "bg-secondary/50"
                                          : "bg-secondary/25"
                                      }`}
                                >
                                  <div className="flex items-start gap-4  text-sm py-2 px-4 text-primary">
                                    {notification.repost.content}
                                  </div>
                                  {notification.repost.image && (
                                    <div className="flex items-center py-2 px-4">
                                      <Card className="rounded-lg overflow-hidden border-none shadow-none">
                                        <img
                                          src={
                                            notification.repost.image ||
                                            "/placeholder.svg"
                                          }
                                          alt="Contenido de la publicación"
                                          className="w-full h-auto object-cover max-h-[250px] max-w-[250px]"
                                        />
                                      </Card>
                                    </div>
                                  )}
                                </div>
                              </Link>
                            )}

                          <Link
                            href={`/post/${notification.post.id}`}
                            className="block"
                          >
                            <Card
                              className={`text-sm text-muted-foreground rounded-lg py-4 px-4 mt-2 shadow-none ${
                                notification.post.content ? "space-y-4" : ""
                              } rounded-b py-6 px-4 text-sm text-primary ${
                                !notification.read
                                  ? "bg-secondary/50 border-transparent"
                                  : ""
                              }`}
                            >
                              <p>{notification.post.content}</p>
                              {notification.post.image && (
                                <img
                                  src={notification.post.image}
                                  alt="Contenido de la publicación"
                                  className="rounded-lg w-full max-h-[250px] max-w-[250px] h-auto object-cover"
                                />
                              )}
                            </Card>
                          </Link>
                        </div>
                      )}

                    <p className="text-sm text-muted-foreground pl-6">
                      {formatDistanceToNowStrict(
                        new Date(notification.createdAt),
                        {
                          addSuffix: true,
                          locale: es,
                        }
                      )}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default NotificationComponent;
