"use client";

import {
  HomeIcon,
  LogOutIcon,
  MenuIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useAuth, SignInButton, SignOutButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import Link from "next/link";
import NotificationsMobileButton from "./NotificationsMobileButton";
import CreatePostDialog from "./CreatePostDialog";
import { type getUserByClerkId } from "@/actions/user.action";
import { Avatar, AvatarImage } from "./ui/avatar";

type User = Awaited<ReturnType<typeof getUserByClerkId>>;

function MobileNavbar({ user }: { user: User }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { isSignedIn } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex md:hidden items-center space-x-2">
      {!isSignedIn ? (
        <SignInButton mode="modal">
          <Button variant="default" className="rounded-full">
            <LogIn size={20} />
          </Button>
        </SignInButton>
      ) : (
        <CreatePostDialog />
      )}
      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="rounded-full">
            <MenuIcon size={20} />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[300px] flex flex-col justify-between px-6 py-0 bg-background border-none"
        >
          <nav className="flex flex-col space-y-4  flex-grow">
            {isSignedIn ? (
              <>
                <div className="py-8 border-b">
                  <div className="flex flex-col space-y-4">
                    <Link
                      href={`/profile/${user?.username}`}
                      className="flex flex-col space-y-4"
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user?.image ?? "/avatar.png"} />
                      </Avatar>

                      <div className="space-y-0">
                        <h3 className="font-semibold">{user?.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          @{user?.username}
                        </p>
                      </div>
                    </Link>

                    <div className="w-full">
                      <div className="flex  space-x-2">
                        <div className="flex  space-x-1">
                          <p className="font-medium text-sm font-primary">
                            {user?._count.following}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Siguiendo
                          </p>
                        </div>

                        <div className="flex space-x-1">
                          <p className="font-medium text-sm text-primary">
                            {user?._count.followers}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Seguidores
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-full space-y-6">
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 justify-start rounded-full"
                    asChild
                  >
                    <Link href="/">
                      <HomeIcon size={20} />
                      Ir a inicio
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 justify-start rounded-full"
                    asChild
                  >
                    <Link href={`/profile/${user?.username}`}>
                      <UserIcon className="w-4 h-4" />
                      Perfil
                    </Link>
                  </Button>

                  <NotificationsMobileButton />

                  <SignOutButton>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-3 justify-start w-full rounded-full"
                    >
                      <LogOutIcon className="w-4 h-4" />
                      Cerrar sesión
                    </Button>
                  </SignOutButton>
                </div>
              </>
            ) : (
              <>
                <div className="py-8 border-b">
                  <div className="flex flex-col space-y-4 px-4">
                    <h1>Menú</h1>
                  </div>
                </div>

                <div className="h-full space-y-6">
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 justify-start rounded-full"
                    asChild
                  >
                    <Link href="/">
                      <HomeIcon size={20} />
                      Ir a inicio
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </nav>

          {/* Botón de cambiar tema */}
          <div className="flex w-full justify-start border-t py-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Cambiar tema</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileNavbar;
