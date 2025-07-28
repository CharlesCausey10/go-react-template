import { routes } from "../routes";
import type { Post, PostInput } from "../types";

export async function getPosts(): Promise<Post[]> {
    const res = await fetch(routes.posts);
    return res.json() ?? [];
}

export async function createPost(newPost: PostInput): Promise<Post> {
    const res = await fetch(routes.posts, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
    });
    return res.json();
}
