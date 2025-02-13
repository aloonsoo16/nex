"use client";
import { Button } from "./ui/button";
import { MessageCircleIcon } from "lucide-react";
import { getPosts } from "@/actions/post.action";
import { useState } from "react";

type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];

function CommentsButton({
    post,
    showComments,
    setShowComments,
  }: {
    post: Post;
    showComments: boolean;
    setShowComments: (value: boolean) => void;
  }) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={`text-muted-foreground rounded-full flex justify-start p-2 hover:text-sky-500 hover:bg-sky-500/10 ${
          showComments ? "fill-sky-500 bg-sky-500/10 text-sky-500" : ""
        }`}
        onClick={() => setShowComments(!showComments)}
      >
        <MessageCircleIcon
          className={` ${showComments ? "fill-sky-500 text-sky-500" : ""}`}
          size={20}
        />
        <span>{post.comments.length}</span>
      </Button>
    );
  }
  
  export default CommentsButton;
  
