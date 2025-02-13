import { getRandomUsers } from "@/actions/user.action";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import FollowButton from "./FollowButton";
import { Github, Linkedin } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

async function WhoToFollow() {
  const users = await getRandomUsers();
  const technologies = [
    "Next.js",
    "React",
    "TypeScript",
    "TailwindCSS",
    "Shadcn/ui",
    "Clerk",
    "Uploadthing",
    "Postgres",
    "Prisma"
  ];

  return (
    <Card className="shadow-none sticky top-20">
      <CardHeader>
        <CardTitle>A quién seguir</CardTitle>
      </CardHeader>
      <CardContent>
        {users.length > 0 ? (
          <div className="space-y-4 mb-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex flex-nowrap gap-2 items-center justify-between"
              >
                <div className="flex items-center gap-2 min-w-0 flex-grow">
                  <Link href={`/profile/${user.username}`}>
                    <Avatar className="w-12 h-12 border-4 border-transparent">
                      <AvatarImage src={user?.image ?? "/avatar.png"} />
                    </Avatar>
                  </Link>
                  <div className="flex flex-col text-sm space-y-1 min-w-0">
                    <Link
                      href={`/profile/${user.username}`}
                      className="font-medium cursor-pointer"
                    >
                      <p className="text-primary font-semibold truncate">
                        {user.name}
                      </p>
                    </Link>
                    <p className="text-muted-foreground truncate">
                      @{user.username}
                    </p>
                  </div>
                </div>
                <FollowButton userId={user.id} isFollowing={false} />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 mb-4">
            <p className="text-sm text-muted-foreground">
              Nada que mostrar por aquí
            </p>
          </div>
        )}
        <Separator />
        <div className="flex flex-wrap gap-3 py-4">
          <h3 className="text-sm font-semibold">
            Proyecto desarrollado por Alonso Mangas:
          </h3>
          <div className="flex flex-col flex-wrap justify-center items-start gap-4 py-2">
            <Button
              className="flex items-center justify-center gap-2 text-fuchsia-500 rounded-full text-sm bg-fuchsia-500/10 hover:bg-fuchsia-500/10 hover:text-fuchsia-500 shadow-none"
              size="sm"
              variant="default"
            >
              <a
                href="https://www.linkedin.com/in/alonsomangas/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Linkedin size={16} /> Mi perfil de Linkedin
              </a>
            </Button>

            <Button
              className="flex items-center justify-center gap-2 text-sky-500 rounded-full text-sm bg-sky-500/10 hover:bg-sky-500/10 hover:text-sky-500 shadow-none"
              size="sm"
              variant="default"
            >
              <a
                href="https://github.com/aloonsoo16"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github size={16} /> Mi perfil de Github
              </a>
            </Button>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold mb-2">
              Tecnologías utilizadas:
            </h3>
            <div className="flex flex-wrap gap-3">
              {technologies.map((tech) => (
                <Badge
                  className="py-1 hover:bg-secondary text-xs font-semibold rounded-full"
                  key={tech}
                  variant="secondary"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default WhoToFollow;
