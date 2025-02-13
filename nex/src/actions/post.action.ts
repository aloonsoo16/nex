"use server";

import prisma from "@/lib/prisma";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";

export async function createPost(content: string, image: string) {
  try {
    const userId = await getDbUserId();

    if (!userId) return;

    const post = await prisma.post.create({
      data: {
        content,
        image,
        authorId: userId,
      },
    });

    revalidatePath("");
    return { success: true, post };
  } catch (error) {
    console.log("Error al crear la publicación:", error);
    return { success: false, error: "Error al crear la publicación" };
  }
}

export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                image: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        reposts: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            reposts: true,
          },
        },
      },
    });

    return posts;
  } catch (error) {
    console.log("Error en getPosts", error);
    throw new Error("Error al encontrar publicaciones");
  }
}

export async function toggleLike(postId: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return;

    // Chekear si el like existe
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) throw new Error("Publicación no encontrada");

    if (existingLike) {
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
    } else {
      await prisma.$transaction([
        prisma.like.create({
          data: {
            userId,
            postId,
          },
        }),
        ...(post.authorId !== userId
          ? [
              prisma.notification.create({
                data: {
                  type: "LIKE",
                  userId: post.authorId,
                  creatorId: userId,
                  postId,
                },
              }),
            ]
          : []),
      ]);
    }

    revalidatePath("");
    return { success: true };
  } catch (error) {
    console.error("Error al dar o quitar like", error);
    return { success: false, error: "Error al dar o quitar like" };
  }
}

export async function createComment(
  postId: string,
  content: string,
  image?: string
) {
  try {
    const userId = await getDbUserId();

    if (!userId) return;
    if (!content && !image)
      throw new Error("Es necesario introducir contenido en el comentario");

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) throw new Error("Publicación no encontrada");

    // Crear el comentario y su notificación
    const [comment] = await prisma.$transaction(async (tx) => {
      const newComment = await tx.comment.create({
        data: {
          content,
          image,
          authorId: userId,
          postId,
        },
      });

      if (post.authorId !== userId) {
        await tx.notification.create({
          data: {
            type: "COMMENT",
            userId: post.authorId,
            creatorId: userId,
            postId,
            commentId: newComment.id,
          },
        });
      }

      return [newComment];
    });

    revalidatePath("");
    return { success: true, comment };
  } catch (error) {
    console.error("Error al publicar el comentario:", error);
    return { success: false, error: "Error al publicar el comentario" };
  }
}

export async function deletePost(postId: string) {
  try {
    const userId = await getDbUserId();

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) throw new Error("Publicación no encontrada");
    if (post.authorId !== userId)
      throw new Error("No tienes permiso para eliminar esta publicación");

    await prisma.post.delete({
      where: { id: postId },
    });

    revalidatePath("");
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar la publicación:", error);
    return { success: false, error: "Error al eliminar la publicación" };
  }
}

export async function deleteComment(commentId: string) {
  try {
    const userId = await getDbUserId();

    if (!userId) return { success: false, error: "Usuario no autenticado" };

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true, postId: true },
    });

    if (!comment) throw new Error("Comentario no encontrado");
    if (comment.authorId !== userId)
      throw new Error("No tienes permiso para eliminar este comentario");

    await prisma.comment.delete({
      where: { id: commentId },
    });

    revalidatePath("");
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar el comentario:", error);
    return { success: false, error: "Error al eliminar el comentario" };
  }
}

export async function getPostById(postId: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                image: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        reposts: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            reposts: true,
          },
        },
      },
    });

    if (!post) {
      return { success: false, error: "Publicación no encontrada" };
    }

    return { success: true, post };
  } catch (error) {
    console.error("Error en getPostById", error);
    return { success: false, error: "Error al obtener la publicación" };
  }
}

export async function toggleRepost(postId: string) {
  try {
    const userId = await getDbUserId();

    if (!userId) return { success: false, error: "Usuario no encontrado" };

    // Verificar si el usuario ya ha hecho repost de este post
    const existingRepost = await prisma.repost.findUnique({
      where: {
        userId_postId: {
          userId: userId,
          postId: postId,
        },
      },
    });

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) throw new Error("Publicación no encontrada");

    if (existingRepost) {
      // Si ya existe, quitar el repost
      await prisma.repost.delete({
        where: {
          userId_postId: {
            userId: userId,
            postId: postId,
          },
        },
      });
    } else {
      // Si no existe, crear un repost
      await prisma.$transaction([
        prisma.repost.create({
          data: {
            userId: userId,
            postId: postId,
          },
        }),
        ...(post.authorId !== userId
          ? [
              prisma.notification.create({
                data: {
                  type: "REPOST",
                  userId: post.authorId,
                  creatorId: userId,
                  postId,
                },
              }),
            ]
          : []),
      ]);
    }

    revalidatePath("");
    return { success: true };
  } catch (error) {
    console.log("Error al alternar repost", error);
    return { success: false, error: "Error al alternar repost" };
  }
}

export async function getReposts() {
  try {
    const reposts = await prisma.repost.findMany({
      include: {
        user: {
          // Información del usuario que hizo el repost
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
        post: {
          // Información del post original
          include: {
            author: {
              // Información del autor del post original
              select: {
                id: true,
                username: true,
                name: true,
                image: true,
              },
            },
            comments: {
              // Comentarios del post original
              include: {
                author: {
                  select: {
                    id: true,
                    username: true,
                    name: true,
                    image: true,
                  },
                },
              },
              orderBy: {
                createdAt: "asc",
              },
            },
            likes: {
              // Likes del post original
              select: {
                userId: true,
              },
            },
            _count: {
              // Contadores de likes, comentarios y reposts del post original
              select: {
                likes: true,
                comments: true,
                reposts: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Ordenamos los reposts por fecha
      },
    });

    return reposts; // Devuelves los reposts con toda la información asociada
  } catch (error) {
    console.log("Error en getReposts", error);
    throw new Error("Error al obtener los reposts");
  }
}

export async function getRepostById(repostId: string) {
  try {
    const repost = await prisma.repost.findUnique({
      where: { id: repostId },
      include: {
        user: {
          // Información del usuario que hizo el repost
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
        post: {
          // Información del post original
          include: {
            author: {
              // Información del autor del post original
              select: {
                id: true,
                username: true,
                name: true,
                image: true,
              },
            },
            comments: {
              // Comentarios del post original
              include: {
                author: {
                  select: {
                    id: true,
                    username: true,
                    name: true,
                    image: true,
                  },
                },
              },
              orderBy: {
                createdAt: "asc",
              },
            },
            likes: {
              // Likes del post original
              select: {
                userId: true,
              },
            },
            reposts: {
              select: {
                userId: true,
              },
            },
            _count: {
              // Contadores de likes, comentarios y reposts del post original
              select: {
                likes: true,
                comments: true,
                reposts: true,
              },
            },
          },
        },
      },
    });

    if (!repost) {
      return { success: false, error: "Repost no encontrado" };
    }

    return { success: true, repost };
  } catch (error) {
    console.error("Error en getRepostById", error);
    return { success: false, error: "Error al obtener el repost" };
  }
}

export async function createRepost(
  postId: string,
  content: string,
  image: string
) {
  try {
    const userId = await getDbUserId();
    if (!userId) return { success: false, error: "Usuario no encontrado" };

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) throw new Error("Publicación no encontrada");

    const [repost] = await prisma.$transaction(async (tx) => {
      const newRepost = await tx.repost.create({
        data: {
          userId,
          postId,
          content,
          image,
        },
      });

      if (post.authorId !== userId) {
        await tx.notification.create({
          data: {
            type: "CITED",
            userId: post.authorId,
            creatorId: userId,
            repostId: newRepost.id,
            postId,
          },
        });
      }

      return [newRepost];
    });

    revalidatePath("");
    return { success: true, repost };
  } catch (error) {
    console.error("Error al crear repost:", error);
    return { success: false, error: "Error al crear repost" };
  }
}

export async function deleteRepost(postId: string) {
  try {
    const userId = await getDbUserId();

    if (!userId) return { success: false, error: "Usuario no encontrado" };

    // Verificar si el repost existe
    const existingRepost = await prisma.repost.findFirst({
      where: {
        userId: userId,
        postId: postId,
      },
    });

    if (!existingRepost) {
      return { success: false, error: "Citado no encontrado" };
    }

    // Eliminar el repost
    await prisma.repost.delete({
      where: { id: existingRepost.id },
    });

    revalidatePath("");

    return { success: true, action: "removed" };
  } catch (error) {
    console.log("Error al eliminar repost", error);
    return { success: false, error: "Error al eliminar repost" };
  }
}
