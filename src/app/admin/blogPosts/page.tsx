'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Navbar from '../../components/navbar/Navbar';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminBlogPostsPage() {
  const { data = [], mutate, isLoading } = useSWR('/api/blogPosts/blogPosts', fetcher);
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [newPost, setNewPost] = useState<any>({
    title: '',
    content: '',
    author: '',
    category: '',
    coverImage: '',
    status: 'draft',
  });

  const slugify = (str: string) =>
    str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setFn: Function) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setFn((prev: any) => ({ ...prev, coverImage: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleAdd = async () => {
    const slug = slugify(newPost.title);
    await fetch('/api/blogPosts/blogPosts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newPost, slug, publishedAt: new Date() }),
    });
    setNewPost({
      title: '',
      content: '',
      author: '',
      category: '',
      coverImage: '',
      status: 'draft',
    });
    mutate();
  };

  const handleEdit = async (id: string) => {
    await fetch(`/api/blogPosts/blogPosts?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    });
    setEditing(null);
    mutate();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este blog post?')) return;
    await fetch(`/api/blogPosts/blogPosts?id=${id}`, { method: 'DELETE' });
    mutate();
  };

  if (isLoading) return <p className="p-4">Cargando blogs...</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Administrar Blog Posts</h1>

        <ul className="space-y-6 mb-12">
          {data.map((post: any) => (
            <li key={post.id} className="border border-dashed border-gray-300 rounded p-2 bg-white hover:shadow-md">
              {editing === post.id ? (
                <div className="space-y-2">
                  <input
                    value={editData.title ?? ''}
                    onChange={(e) => setEditData((p: any) => ({ ...p, title: e.target.value }))}
                    placeholder="Título"
                    className="w-full p-2 border rounded text-gray-800"
                  />
                  <textarea
                    value={editData.content ?? ''}
                    onChange={(e) => setEditData((p: any) => ({ ...p, content: e.target.value }))}
                    placeholder="Contenido"
                    className="w-full p-2 border rounded text-gray-800"
                    rows={4}
                  />
                  <input
                    value={editData.author ?? ''}
                    onChange={(e) => setEditData((p: any) => ({ ...p, author: e.target.value }))}
                    placeholder="Autor"
                    className="w-full p-2 border rounded text-gray-800"
                  />
                  <input
                    value={editData.category ?? ''}
                    onChange={(e) => setEditData((p: any) => ({ ...p, category: e.target.value }))}
                    placeholder="Categoría"
                    className="w-full p-2 border rounded text-gray-800"
                  />
                  {editData.slug && (
                    <p className="text-sm text-gray-500">
                      Slug: <code>{editData.slug}</code>
                    </p>
                  )}
                  <select
                    value={editData.status ?? ''}
                    onChange={(e) => setEditData((p: any) => ({ ...p, status: e.target.value }))}
                    className="w-full p-2 border rounded text-gray-800"
                  >
                    <option value="draft">Borrador</option>
                    <option value="published">Publicado</option>
                  </select>

                  <label className="inline-block bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700">
                    Subir imagen
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, setEditData)}
                      className="hidden"
                    />
                  </label>
                  {editData.coverImage && (
                    <img
                      src={editData.coverImage}
                      alt="preview"
                      className="w-24 h-24 object-cover mt-2 rounded"
                    />
                  )}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEdit(post.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="bg-gray-600 text-white px-4 py-2 rounded"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-lg font-semibold text-blue-800">{post.title}</h2>
                  <p className="text-sm text-gray-700">{post.content?.slice(0, 100)}...</p>
                  <p className="text-xs text-gray-500">
                    Categoría: {post.category} | Estado: {post.status}
                  </p>
                  {post.coverImage && (
                    <img
                      src={post.coverImage}
                      alt="cover"
                      className="mt-2 w-20 h-20 rounded object-cover"
                    />
                  )}
                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => {
                        setEditing(post.id);
                        setEditData(post);
                      }}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mb-2 text-gray-800">Agregar nuevo blog post</h2>
        <div className="grid grid-cols-1 gap-3 mb-4">
          {['title', 'author', 'category'].map((field) => (
            <input
              key={field}
              value={newPost[field]}
              onChange={(e) => setNewPost((p: any) => ({ ...p, [field]: e.target.value }))}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="p-2 border rounded text-gray-800"
            />
          ))}
          <textarea
            value={newPost.content}
            onChange={(e) => setNewPost((p: any) => ({ ...p, content: e.target.value }))}
            placeholder="Contenido"
            className="p-2 border rounded text-gray-800"
            rows={4}
          />
          <select
            value={newPost.status}
            onChange={(e) => setNewPost((p: any) => ({ ...p, status: e.target.value }))}
            className="p-2 border rounded text-gray-800"
          >
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
          </select>
          <label className="inline-block bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700">
            Subir imagen
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, setNewPost)}
              className="hidden"
            />
          </label>
          {newPost.coverImage && (
            <img
              src={newPost.coverImage}
              alt="preview"
              className="w-24 h-24 object-cover rounded"
            />
          )}
        </div>
        <button
          onClick={handleAdd}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Agregar blog post
        </button>
      </div>
    </>
  );
}
