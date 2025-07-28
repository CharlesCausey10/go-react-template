import { useState } from 'react';
import { useMutation } from '../hooks/useMutation';
import { useQuery } from '../hooks/useQuery';
import type { Post, PostInput } from '../types';
import { createPost } from '../api/posts';
import { routes } from '../routes';
import { useAuth } from '../context/AuthContext';

export default function Feed() {
    const { user } = useAuth();
    const postsQ = useQuery<Post[]>({ endpoint: routes.posts });
    const posts = postsQ.data ?? [];
    const createPostM = useMutation<PostInput, Post>({
        mutation: createPost,
        onSuccess: postsQ.refetch
    });
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        createPostM.mutate({ title, content });
        setTitle("");
        setContent("");
    }

    if (postsQ.loading) return <p>Loading...</p>
    if (postsQ.error) return <p>Error loading posts: {postsQ.error.message}</p>

    return <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 mt-15 text-white">My Feed</h1>
        {user && <form onSubmit={handleSubmit} className="mb-6 space-y-2">
            <input className="w-full border border-gray-600 bg-gray-700 text-white p-2 placeholder-gray-400 rounded" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
            <textarea className="w-full border border-gray-600 bg-gray-700 text-white p-2 placeholder-gray-400 rounded" placeholder="Content" rows={4} value={content} onChange={e => setContent(e.target.value)} />
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Post</button>
        </form>}
        <div className="space-y-4">
            {posts.map((post) => (
                <div key={post.id} className="p-4 border border-gray-600 bg-gray-800 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-750 transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                {post.username.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-200">@{post.username}</span>
                        </div>
                        <p className="text-sm text-gray-400">{new Date(post.createdAt).toLocaleString()}</p>
                    </div>
                    <h2 className="text-xl font-semibold mb-2 text-white">{post.title}</h2>
                    <p className="text-gray-300">{post.content}</p>
                </div>
            ))}
        </div>
    </div>
}
