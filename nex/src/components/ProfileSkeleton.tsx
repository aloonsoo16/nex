import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader, TableOfContents, Heart, Repeat2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProfileSkeleton() {
  const skeletonItems = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div>
      <Card className="border-b-0 border-l-0 border-t-0 border-r-0 overflow-hidden shadow-none rounded-none">
        {/* Header */}
        <Skeleton className="h-32  overflow-hidden border border-secondary rounded-none" />

        <CardContent className="relative pt-0 border-l border-r">
          <div className="flex flex-col">
            {/* Avatar */}
            <Skeleton className="w-24 h-24 rounded-full absolute -top-12 left-4" />

            {/* Boton de follow y edit */}
            <div className="flex justify-end mt-4">
              <Skeleton className="h-10 w-28 rounded-full" />
            </div>

            {/* Informacion del usuario */}
            <div className="mt-6">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-32 mb-4" />
              <Skeleton className="h-4 w-full max-w-md mb-4" />

              {/* Localizacion, membresia y website */}
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-40" />
              </div>

              {/* Siguiendo, seguidores, posts */}
              <div className="flex mt-4 space-x-4">
                <div>
                  <Skeleton className="h-5 w-12 mb-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div>
                  <Skeleton className="h-5 w-12 mb-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div>
                  <Skeleton className="h-5 w-12 mb-1" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Tabs
        defaultValue="posts"
        className="w-full px-1 lg:border-l lg:border-r rounded-b-lg"
      >
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent border-none resize-none">
          <TabsTrigger
            value="posts"
            className="flex items-center text-muted-foreground gap-2 border-b-2 border-transparent mx-2 rounded-none data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary px-6 font-semibold "
          >
            <TableOfContents size={20} />
            <span className="hidden xl:block">Publicaciones</span>
          </TabsTrigger>
          <TabsTrigger
            value="likes"
            className="flex items-center text-muted-foreground gap-2 border-b-2 border-transparent mx-2 rounded-none data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary px-6 font-semibold "
          >
            <Heart size={20} />
            <span className="hidden xl:block">Me gusta</span>
          </TabsTrigger>
          <TabsTrigger
            value="reposts"
            className="flex items-center text-muted-foreground gap-2 border-b-2 border-transparent mx-2 rounded-none data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary px-6 font-semibold "
          >
            <Repeat2 size={20} />
            <span className="hidden xl:block">Compartidos</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-0">
          <Card className="border-none rounded-none shadow-none">
            <CardContent className="p-0">
              {skeletonItems.map((index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 lg:border-b"
                >
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                    <div className="pl-6 space-y-2">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="likes" className="mt-0">
          <Card className="border-none rounded-none shadow-none">
            <CardContent className="p-0">
              {skeletonItems.map((index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 lg:border-b"
                >
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                    <div className="pl-6 space-y-2">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reposts" className="mt-0">
          <Card className="border-none rounded-none shadow-none">
            <CardContent className="p-0">
              {skeletonItems.map((index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 lg:border-b"
                >
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                    <div className="pl-6 space-y-2">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
