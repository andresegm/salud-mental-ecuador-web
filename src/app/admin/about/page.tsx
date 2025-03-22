'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Navbar from "../../components/Navbar";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminAboutPage() {
  const { data = [], mutate, isLoading } = useSWR('/api/homePage/about', fetcher);
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ title: string; content: string }>({
    title: '',
    content: '',
  });

  const [newSection, setNewSection] = useState({
    title: '',
    content: '',
    slug: '',
  });

  const sensors = useSensors(useSensor(PointerSensor));

  const startEdit = (section: any) => {
    setEditing(section.id);
    setEditData({
      title: section.title,
      content: section.content,
    });
  };

  const saveEdit = async (id: string) => {
    await fetch(`/api/homePage/about?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    });
    setEditing(null);
    mutate();
  };

  const deleteSection = async (id: string) => {
    if (!confirm('¿Estás seguro que deseas eliminar esta sección?')) return;
    await fetch(`/api/homePage/about?id=${id}`, { method: 'DELETE' });
    mutate();
  };

  const handleAddSection = async () => {
    await fetch('/api/homePage/about', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newSection,
        order: data.length + 1,
      }),
    });
    setNewSection({ title: '', content: '', slug: '' });
    mutate();
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
  
    const oldIndex = data.findIndex((s: any) => s.id === active.id);
    const newIndex = data.findIndex((s: any) => s.id === over.id);
  
    const updated = arrayMove([...data], oldIndex, newIndex).map((s, i) => ({
      ...s,
      order: i + 1,
    }));
  
    mutate(updated, false); // Optimistic update
  
    await Promise.all(
      updated.map((section) =>
        fetch(`/api/homePage/about?id=${section.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: section.order }),
        })
      )
    );
  
    mutate(); // Sync from DB
  };
  
  function slugify(text: string) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

  if (isLoading) return <p className="p-4">Cargando secciones...</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Editar Secciones</h1>

        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
        <SortableContext
  items={[...data].sort((a, b) => a.order - b.order).map((s: any) => s.id)}
  strategy={verticalListSortingStrategy}
>
  <ul className="space-y-6 mb-12">
    {[...data].sort((a, b) => a.order - b.order).map((section: any) => (
      <SortableItem key={section.id} section={section}>
        {editing === section.id ? (
          <>
            <input
              value={editData.title}
              onChange={(e) => setEditData((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full mb-2 p-2 border rounded font-semibold text-gray-900"
            />
            <textarea
              value={editData.content}
              onChange={(e) => setEditData((prev) => ({ ...prev, content: e.target.value }))}
              className="w-full mb-3 p-2 border rounded text-sm text-gray-900"
              rows={5}
            />
            <div className="flex gap-3">
              <button
                onClick={() => saveEdit(section.id)}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Guardar
              </button>
              <button
                onClick={() => setEditing(null)}
                className="px-3 py-1 bg-gray-300 text-gray-900 rounded"
              >
                Cancelar
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-blue-800">{section.title}</h2>
            <p className="text-sm text-gray-900 mt-1 whitespace-pre-line">{section.content}</p>
            <div className="flex gap-4 mt-3">
              <button
                onClick={() => startEdit(section)}
                className="text-sm text-blue-700 hover:underline"
              >
                Editar
              </button>
              <button
                onClick={() => deleteSection(section.id)}
                className="text-sm text-red-700 hover:underline"
              >
                Eliminar
              </button>
            </div>
          </>
        )}
      </SortableItem>
    ))}
  </ul>
</SortableContext>
        </DndContext>

        <h2 className="text-xl text-gray-900 font-semibold mb-2">Agregar nueva sección</h2>
        <div className="grid grid-cols-1 gap-3 mb-2">
          <input
            value={newSection.title}
            onChange={(e) =>
              setNewSection((prev) => ({
                ...prev,
                title: e.target.value,
                slug: slugify(e.target.value),
              }))
            }
            placeholder="Título"
            className="border border-gray-300 p-2 rounded text-gray-900 placeholder:text-gray-700"
          />
          <textarea
            value={newSection.content}
            onChange={(e) => setNewSection((prev) => ({ ...prev, content: e.target.value }))}
            placeholder="Contenido"
            className="border border-gray-300 p-2 rounded text-gray-900 placeholder:text-gray-700"
            rows={4}
          />
        </div>
        <button
          onClick={handleAddSection}
          className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Agregar sección
        </button>
      </div>
    </>
  );
}

function SortableItem({
    section,
    children,
  }: {
    section: any;
    children: React.ReactNode;
  }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id });
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
  
    return (
      <li
        ref={setNodeRef}
        style={style}
        {...attributes}
        className="border border-dashed border-gray-300 rounded p-2 bg-white hover:shadow-md"
      >
        <div {...listeners} className="cursor-grab text-gray-400 select-none text-sm mb-2">
          ☰ Arrastrar
        </div>
        {children}
      </li>
    );
  }
  
