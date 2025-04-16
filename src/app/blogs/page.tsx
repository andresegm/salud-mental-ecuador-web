'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { Heart } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author?: string;
  category?: string;
  coverImage?: string;
  publishedAt: string;
  status: string;
  likedBy?: { id: string }[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function BlogPage() {
  const { user } = useAuth();
  const { data = [], mutate } = useSWR<BlogPost[]>('/api/blogPosts/blogPosts', fetcher);
  const [liking, setLiking] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const handleLike = async (postId: string) => {
    if (!user) return alert('Debes iniciar sesión para dar like.');
  
    setLiking(postId);
  
    const res = await fetch(`/api/blogPosts/likes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId }),
    });
  
    const updatedPost = await res.json();
  
    // Update cache for blog list
    mutate((posts: BlogPost[] | undefined) => {
      if (!posts) return posts;
      return posts.map((post) => (post.id === updatedPost.id ? updatedPost : post));
    }, false);
  
    // Also update the selected post if it matches
    setSelectedPost((prev) => (prev?.id === updatedPost.id ? updatedPost : prev));
  
    setLiking(null);
  };
  

  return (
    <>
      <Navbar />
      <section className="bg-white py-16 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-10">Blog</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data
              .filter((post) => post.status === 'published')
              .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
              .map((post) => {
                const isLiked = post.likedBy?.some((u) => u.id === user?.id);
                return (
                  <div
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className="bg-gradient-to-br from-sky-50 to-white p-5 rounded-xl shadow border hover:shadow-lg transition-all cursor-pointer"
                  >
                    {post.coverImage && (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-40 object-contain rounded mb-4"
                      />
                    )}
                    <h2 className="text-lg font-semibold text-blue-700">{post.title}</h2>
                    <p className="text-sm text-gray-600 mt-1 mb-2 line-clamp-3">{post.content}</p>
                    <p className="text-xs text-gray-500 italic">
                      {post.author} – {new Date(post.publishedAt).toLocaleDateString('es-ES')}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-gray-500">❤️ {post.likedBy?.length || 0} Me gusta</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(post.id);
                        }}
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

      {/* ✅ Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white max-w-2xl w-full p-6 rounded-xl shadow-lg relative overflow-y-auto max-h-[90vh]"
            >
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl"
              >
                &times;
              </button>
              {selectedPost.coverImage && (
                <img
                  src={selectedPost.coverImage}
                  alt={selectedPost.title}
                  className="max-h-[400px] w-full object-contain rounded"
                />
              )}
              <h2 className="text-2xl font-bold text-blue-800 mb-2">{selectedPost.title}</h2>
              <p className="text-sm text-gray-500 italic mb-4">
                {selectedPost.author} –{' '}
                {new Date(selectedPost.publishedAt).toLocaleDateString('es-ES')}
              </p>
              <p className="text-gray-800 whitespace-pre-wrap mb-6">{selectedPost.content}</p>

              <div className="flex justify-end items-center">
                <p className="text-xs text-gray-500 mr-3">
                  ❤️ {selectedPost.likedBy?.length || 0} Me gusta
                </p>
                <button
                  onClick={() => handleLike(selectedPost.id)}
                  className="flex items-center gap-1 px-3 py-1 rounded text-sm bg-pink-100 text-pink-600 hover:bg-pink-200"
                >
                  <Heart size={16} className="fill-pink-500" />
                  Me gusta
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
