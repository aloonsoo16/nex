"use client";
import {
  getProfileByUsername,
  getUserPosts,
  getUserRepostedPosts,
} from "@/actions/profile.action";
import PostCard from "@/components/PostCard";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { es } from "date-fns/locale";
import { TableOfContents, Heart, Repeat2 } from "lucide-react";
import UserReposts from "./UserReposts";
import { useUser } from "@clerk/nextjs";

type ownUser = Awaited<ReturnType<typeof getProfileByUsername>>;
type Posts = Awaited<ReturnType<typeof getUserPosts>>;
type Reposts = Awaited<ReturnType<typeof getUserRepostedPosts>>;

interface UserTabProps {
  ownUser: NonNullable<ownUser>;
  posts: Posts;
  likedPosts: Posts;
  repostedPosts: Reposts;
  isFollowing: boolean;
  dbUserId: string | null;
}

function UserTab({
  likedPosts,
  repostedPosts,
  posts,
  ownUser,
  dbUserId,
}: UserTabProps) {
  return (
    <div>
      <div className="grid grid-cols-1 gap-6">
        <Tabs defaultValue="posts" className="w-full">
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
            <div className="space-y-6">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    dbUserId={dbUserId}
                    text={""}
                    direction={""}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Sin publicaciones marcadas como me gusta
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="likes" className="mt-0">
            <div className="space-y-6">
              {likedPosts.length > 0 ? (
                likedPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    dbUserId={dbUserId}
                    text={""}
                    direction={""}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Sin publicaciones marcadas como me gusta
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="reposts" className="mt-0">
            <TabsContent value="reposts" className="mt-0">
              <div>
                {repostedPosts.length > 0 ? (
                  repostedPosts.map((repost) => {
                    return (
                      <UserReposts
                        key={repost.id}
                        repost={repost}
                        dbUserId={dbUserId}
                        ownUser={ownUser}
                      />
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Sin publicaciones compartidas.
                  </div>
                )}
              </div>
            </TabsContent>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default UserTab;
