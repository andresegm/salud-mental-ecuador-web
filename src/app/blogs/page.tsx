'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { Heart } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function BlogPage() {
  const { user } = useAuth();
  const { data = [], mutate } = useSWR('/api/blogPosts/blogPosts', fetcher);
  const [liking, setLiking] = useState<string | null>(null);

  const handleLike = async (postId: string) => {
    if (!user) return alert('Debes iniciar sesión para dar like.');

    setLiking(postId);
    await fetch(`/api/blogPosts/likes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId }),
    });
    setLiking(null);
    mutate();
  };

  return (
    <>
      <Navbar />
      <section className="bg-white py-16 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-10">Blog</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data
              .filter((post: any) => post.status === 'published')
              .sort((a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
              .map((post: any) => {
                const isLiked = post.likedBy?.some((u: any) => u.id === user?.id);
                return (
                  <div key={post.id} className="bg-gradient-to-br from-sky-50 to-white p-5 rounded-xl shadow border hover:shadow-lg transition-all">
                    {post.coverImage && (
                      <img src={post.coverImage} alt={post.title} className="rounded mb-4 w-full h-40 object-cover" />
                    )}
                    <h2 className="text-lg font-semibold text-blue-700">{post.title}</h2>
                    <p className="text-sm text-gray-600 mt-1 mb-2 line-clamp-3">{post.content}</p>
                    <p className="text-xs text-gray-500 italic">
                      {post.author} – {new Date(post.publishedAt).toLocaleDateString('es-ES')}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-gray-500">❤️ {post.likedBy?.length || 0} Me gusta</p>
                      <button
                        onClick={() => handleLike(post.id)}
                        disabled={liking === post.id}
                        className={`flex items-center gap-1 text-sm px-3 py-1 rounded ${
                          isLiked ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Heart size={16} className={isLiked ? 'fill-pink-500' : 'fill-none'} />
                        {isLiked ? 'Quitar' : 'Me gusta'}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
