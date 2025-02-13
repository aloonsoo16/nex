"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HomeIcon, ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-[80vh] grid place-items-start px-4">
      <Card className="w-full max-w-md shadow-none">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            {/* Error 404 */}
            <p className="text-8xl font-bold text-primary font-mono">404</p>

            {/* Mensaje*/}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">
                Publicación no encontrada
              </h1>
              <p className="text-muted-foreground">
                La publicación que buscas no está disponible
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="rounded-full" variant="default" asChild>
                <Link href="/">
                  <HomeIcon className="mr-2 size-4" />
                  Volver a inicio
                </Link>
              </Button>

              <Button
                className="rounded-full"
                variant="outline"
                onClick={() => router.back()}
              >
                <ArrowLeftIcon className="mr-2 size-4" />
                Volver atrás
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
