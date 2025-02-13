import { currentUser } from "@clerk/nextjs/server";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { getUserByClerkId } from "@/actions/user.action";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import { LinkIcon, MapPinIcon } from "lucide-react";

async function Sidebar() {
  const authUser = await currentUser();
  if (!authUser) return <UnAuthenticatedSidebar />;

  const user = await getUserByClerkId(authUser.id);
  if (!user) return null;

  return (
    <div className="sticky top-20">
      <Card className="shadow-none">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <Link
              href={`/profile/${user.username}`}
              className="flex flex-col items-center justify-center"
            >
              <Avatar className="w-20 h-20 border-8 border-transparent">
                <AvatarImage src={user.image ?? "/avatar.png"} />
              </Avatar>

              <div className="mt-4 space-y-1">
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-muted-foreground">
                  @{user.username}
                </p>
              </div>
            </Link>

            {user.bio && (
              <p className="mt-3 text-sm text-primary">{user.bio}</p>
            )}

            <div className="w-full">
              <div className="flex justify-between py-4">
                <div>
                  <p className="font-medium text-sm font-primary">
                    {user._count.following}
                  </p>
                  <p className="text-sm text-muted-foreground">Siguiendo</p>
                </div>

                <div>
                  <p className="font-medium text-sm text-primary">
                    {user._count.followers}
                  </p>
                  <p className="text-sm text-muted-foreground">Seguidores</p>
                </div>
              </div>
            </div>

            <div className="w-full py-4 space-y-2 text-sm">
              <div className="flex items-center text-muted-foreground">
                <MapPinIcon className="w-4 h-4 mr-2" />
                {user.location || "Sin ubicación"}
              </div>
              <div className="flex items-center text-muted-foreground">
                <LinkIcon className="w-4 h-4 mr-2 shrink-0" />
                {user.website ? (
                  <a
                    href={
                      user.website.startsWith("http")
                        ? user.website
                        : `https://${user.website}`
                    }
                    className="text-muted-foreground hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {user.website}
                  </a>
                ) : (
                  "Sin URL a su sitio web"
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Sidebar;

const UnAuthenticatedSidebar = () => (
  <div className="sticky top-20">
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="text-center text-xl font-semibold">
          Conecta con otros usuarios ahora
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground mb-4 text-sm">
          Inicia sesión para publicar lo que quieras y conectar con otros
          usuarios.
        </p>
        <SignInButton mode="modal">
          <Button className="w-full rounded-full" variant="outline">
            Iniciar sesión
          </Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button className="w-full mt-4 rounded-full" variant="default">
            Registrarse
          </Button>
        </SignUpButton>
      </CardContent>
    </Card>
  </div>
);
