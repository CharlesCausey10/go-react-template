import { routes } from "../routes";
import type { Post, PostInput } from "../types";
import httpPost from "../util/httpPost";

export async function getPosts(): Promise<Post[]> {
    const res = await fetch(routes.posts);
    return res.json() ?? [];
}

export async function createPost(newPost: PostInput): Promise<Post> {
    const res = await httpPost(routes.posts, newPost);
    if (!res.ok) {
        const errorText = await res.text().catch(() => "Failed to create post");
        throw new Error(errorText || "Failed to create post");
    }
    return res.json();
}
