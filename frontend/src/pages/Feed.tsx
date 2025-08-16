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
        if (!user) return; // Ensure user is logged in
        e.preventDefault();
        createPostM.mutate({ title, content, userId: user.id });
        setTitle("");
        setContent("");
    }

    if (postsQ.loading) return <p className="text-gray-600 text-center mt-8">Loading...</p>
    if (postsQ.error) return <p className="text-red-600 text-center mt-8">Error loading posts: {postsQ.error.message}</p>

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">My Feed</h1>
            {user && (
                <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <input 
                        className="w-full border border-gray-300 bg-white text-gray-900 p-3 placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        placeholder="What's on your mind?" 
                        value={title} 
                        onChange={e => setTitle(e.target.value)} 
                    />
                    <textarea 
                        className="w-full border border-gray-300 bg-white text-gray-900 p-3 placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        placeholder="Share your thoughts..." 
                        rows={4} 
                        value={content} 
                        onChange={e => setContent(e.target.value)} 
                    />
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors">
                        Post
                    </button>
                </form>
            )}
            <div className="space-y-4">
                {posts.map((post) => (
                    <div key={post.id} className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                    {post.username.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-medium text-gray-700">@{post.username}</span>
                            </div>
                            <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
                        </div>
                        <h2 className="text-xl font-semibold mb-2 text-gray-900">{post.title}</h2>
                        <p className="text-gray-700 leading-relaxed">{post.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
