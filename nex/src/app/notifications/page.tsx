import NotificationsComponent from "@/components/Notifications";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tus notificaciones",
  description: "Tus notificaciones de Nex",
};

function NotificationsPage() {
  return <NotificationsComponent />;
}

export default NotificationsPage;
