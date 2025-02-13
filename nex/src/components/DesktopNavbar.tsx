import { LogIn, HomeIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignInButton, UserButton } from "@clerk/nextjs";
import ModeToggle from "./ModeToggle";
import { currentUser } from "@clerk/nextjs/server";
import NotificationsButton from "./NotificationsButton";
import CreatePostDialog from "./CreatePostDialog";

async function DesktopNavbar() {
  const user = await currentUser();

  return (
    <div className="hidden md:flex items-center space-x-4">
      <ModeToggle />

      {user ? null : (
        <SignInButton mode="modal">
          <Button variant="default" className="rounded-full">
            <LogIn className="block lg:hidden" size={20} />
            <span className="hidden lg:inline">Iniciar sesión</span>
          </Button>
        </SignInButton>
      )}

      {user ? (
        <>
          <Button
            variant="ghost"
            className="flex items-center space-x-2 rounded-full"
            asChild
          >
            {user && <NotificationsButton />}
          </Button>
          <Button
            variant="ghost"
            className="flex items-center gap-2 rounded-full"
            asChild
          >
            <Link
              href={`/profile/${
                user.username ??
                user.emailAddresses[0].emailAddress.split("@")[0]
              }`}
            >
              <UserIcon size={20} />
              <span className="hidden lg:inline">Perfil</span>
            </Link>
          </Button>
          <CreatePostDialog />
          <UserButton />
        </>
      ) : null}
    </div>
  );
}
export default DesktopNavbar;
