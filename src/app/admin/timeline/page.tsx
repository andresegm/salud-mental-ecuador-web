'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Navbar from "../../components/navbar/Navbar";
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

const fetcher = async (url: string) => {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
};

export default function AdminTimelinePage() {
  const { data = [], mutate, isLoading } = useSWR('/api/homePage/timeline', fetcher);
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState({ year: '', event: '', category: '', image: '' });
  const [newEvent, setNewEvent] = useState({ year: '', event: '', category: '', image: '' });

  const sensors = useSensors(useSensor(PointerSensor));

  const startEdit = (item: any) => {
    setEditing(item.id);
    setEditData({
      year: item.year,
      event: item.event,
      category: item.category || '',
      image: item.image || '',
    });
  };

  const saveEdit = async (id: string) => {
    await fetch(`/api/homePage/timeline?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    });
    setEditing(null);
    mutate();
  };

  const deleteEvent = async (id: string) => {
    if (!confirm('¿Eliminar este evento?')) return;
    await fetch(`/api/homePage/timeline?id=${id}`, { method: 'DELETE' });
    mutate();
  };

  const handleAdd = async () => {
    await fetch('/api/homePage/timeline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newEvent,
        order: data.length + 1,
      }),
    });
    setNewEvent({ year: '', event: '', category: '', image: '' });
    mutate();
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = data.findIndex((s: any) => s.id === active.id);
    const newIndex = data.findIndex((s: any) => s.id === over.id);
    const updated = arrayMove([...data], oldIndex, newIndex).map((item, i) => ({
      ...item,
      order: i + 1,
    }));

    mutate(updated, false);

    await Promise.all(
      updated.map((item) =>
        fetch(`/api/homePage/timeline?id=${item.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: item.order }),
        })
      )
    );

    mutate();
  };

  const handleImageUpload = (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.onloadend = () => callback(reader.result as string);
    reader.readAsDataURL(file);
  };

  if (isLoading) return <p className="p-4">Cargando eventos...</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Editar Línea de Tiempo</h1>

        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
          <SortableContext
            items={[...data].sort((a, b) => a.order - b.order).map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="space-y-6 mb-12">
              {[...data].sort((a, b) => a.order - b.order).map((item: any) => (
                <SortableItem key={item.id} item={item}>
                  {editing === item.id ? (
                    <>
                      <input
                        value={editData.year}
                        onChange={(e) => setEditData((prev) => ({ ...prev, year: e.target.value }))}
                        placeholder="Año"
                        className="w-full mb-2 p-2 border rounded font-semibold text-gray-900"
                      />
                      <textarea
                        value={editData.event}
                        onChange={(e) => setEditData((prev) => ({ ...prev, event: e.target.value }))}
                        placeholder="Descripción del evento"
                        className="w-full mb-2 p-2 border rounded text-sm text-gray-900"
                      />
                      <input
                        value={editData.category}
                        onChange={(e) => setEditData((prev) => ({ ...prev, category: e.target.value }))}
                        placeholder="Categoría"
                        className="w-full mb-2 p-2 border rounded text-sm text-gray-900"
                      />
                      <label className="inline-block bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700">
                        Subir imagen
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(file, (base64) =>
                                setEditData((prev) => ({ ...prev, image: base64 }))
                              );
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                      {editData.image && (
                        <div className="mt-2">
                          <img src={editData.image} alt="Preview" className="rounded max-h-40 mb-2" />
                          <button
                            onClick={() => setEditData((prev) => ({ ...prev, image: '' }))}
                            className="text-sm text-red-600 underline hover:text-red-800"
                            type="button"
                          >
                            Eliminar imagen
                          </button>
                        </div>
                      )}
                      <div className="flex gap-3 mt-3">
                        <button onClick={() => saveEdit(item.id)} className="px-3 py-1 bg-blue-600 text-white rounded">
                          Guardar
                        </button>
                        <button onClick={() => setEditing(null)} className="px-3 py-1 bg-gray-300 text-gray-900 rounded">
                          Cancelar
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-lg font-semibold text-blue-800">{item.year}</h2>
                      <p className="text-sm text-gray-900 whitespace-pre-line">{item.event}</p>
                      {item.category && (
                        <p className="text-xs text-gray-500 italic mt-1">Categoría: {item.category}</p>
                      )}
                      {item.image && (
                        <img src={item.image} alt="Evento" className="mt-2 rounded max-h-48" />
                      )}
                      <div className="flex gap-4 mt-3">
                        <button onClick={() => startEdit(item)} className="text-sm text-blue-700 hover:underline">
                          Editar
                        </button>
                        <button onClick={() => deleteEvent(item.id)} className="text-sm text-red-700 hover:underline">
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

        <h2 className="text-xl text-gray-900 font-semibold mb-2">Agregar evento</h2>
        <div className="grid grid-cols-1 gap-3 mb-4">
          <input
            value={newEvent.year}
            onChange={(e) => setNewEvent((prev) => ({ ...prev, year: e.target.value }))}
            placeholder="Año"
            className="border border-gray-300 p-2 rounded text-gray-900 placeholder:text-gray-700"
          />
          <textarea
            value={newEvent.event}
            onChange={(e) => setNewEvent((prev) => ({ ...prev, event: e.target.value }))}
            placeholder="Descripción"
            className="border border-gray-300 p-2 rounded text-gray-900 placeholder:text-gray-700"
            rows={3}
          />
          <input
            value={newEvent.category}
            onChange={(e) => setNewEvent((prev) => ({ ...prev, category: e.target.value }))}
            placeholder="Categoría (opcional)"
            className="border border-gray-300 p-2 rounded text-gray-900 placeholder:text-gray-700"
          />
          <label className="inline-block bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700">
            Subir imagen
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleImageUpload(file, (base64) =>
                    setNewEvent((prev) => ({ ...prev, image: base64 }))
                  );
                }
              }}
              className="hidden"
            />
          </label>
          {newEvent.image && (
        <div className="mt-2">
          <img src={newEvent.image} alt="Preview" className="rounded max-h-40 mb-2" />
          <button
            onClick={() => setNewEvent((prev) => ({ ...prev, image: '' }))}
            className="text-sm text-red-600 underline hover:text-red-800"
            type="button"
          >
            Eliminar imagen
          </button>
        </div>
      )}
        </div>
        <button
          onClick={handleAdd}
          className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Agregar evento
        </button>
      </div>
    </>
  );
}

function SortableItem({
  item,
  children,
}: {
  item: any;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

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
