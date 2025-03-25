'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Navbar from '../../components/navbar/Navbar';
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
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error al cargar los documentos');
  return res.json();
};

export default function AdminGovernancePage() {
  const { data = [], mutate, isLoading } = useSWR('/api/governance/governance', fetcher);
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState({ title: '', year: '', version: '', description: '', url: '' });
  const [newDoc, setNewDoc] = useState({ title: '', year: '', version: '', description: '', url: '' });

  const sensors = useSensors(useSensor(PointerSensor));

  const startEdit = (doc: any) => {
    setEditing(doc.id);
    setEditData(doc);
  };

  const saveEdit = async (id: string) => {
    await fetch(`/api/governance/governance?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    });
    setEditing(null);
    mutate();
  };

  const deleteDoc = async (id: string) => {
    if (!confirm('¿Eliminar este documento?')) return;
    await fetch(`/api/governance/governance?id=${id}`, { method: 'DELETE' });
    mutate();
  };

  const handleAdd = async () => {
    await fetch('/api/governance/governance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newDoc, order: data.length + 1 }),
    });
    setNewDoc({ title: '', year: '', version: '', description: '', url: '' });
    mutate();
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = data.findIndex((d: any) => d.id === active.id);
    const newIndex = data.findIndex((d: any) => d.id === over.id);
    const updated = arrayMove([...data], oldIndex, newIndex).map((d, i) => ({ ...d, order: i + 1 }));

    mutate(updated, false);

    await Promise.all(
      updated.map((doc) =>
        fetch(`/api/governance/governance?id=${doc.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: doc.order }),
        })
      )
    );

    mutate();
  };

  if (isLoading) return <p className="p-4">Cargando documentos...</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Gestionar Documentos de Gobernanza</h1>
  
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
          <SortableContext items={data.map((d: any) => d.id)} strategy={verticalListSortingStrategy}>
            <ul className="space-y-6 mb-12">
              {[...data].sort((a, b) => a.order - b.order).map((doc: any) => (
                <SortableItem key={doc.id} item={doc}>
                  {editing === doc.id ? (
                    <div className="space-y-2">
                      <input
                        value={editData.title}
                        onChange={(e) => setEditData((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Título"
                        className="w-full p-2 border rounded placeholder-gray-600"
                      />
                      <input
                        value={editData.year}
                        onChange={(e) => setEditData((prev) => ({ ...prev, year: e.target.value }))}
                        placeholder="Año"
                        className="w-full p-2 border rounded"
                      />
                      <input
                        value={editData.version}
                        onChange={(e) => setEditData((prev) => ({ ...prev, version: e.target.value }))}
                        placeholder="Versión"
                        className="w-full p-2 border rounded"
                      />
                      <textarea
                        value={editData.description}
                        onChange={(e) => setEditData((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Descripción"
                        className="w-full p-2 border rounded"
                      />
                      <input
                        value={editData.url}
                        onChange={(e) => setEditData((prev) => ({ ...prev, url: e.target.value }))}
                        placeholder="URL del PDF"
                        className="w-full p-2 border rounded"
                      />
                      <div className="flex gap-3 mt-2">
                        <button onClick={() => saveEdit(doc.id)} className="px-3 py-1 bg-blue-600 text-white rounded">
                          Guardar
                        </button>
                        <button onClick={() => setEditing(null)} className="px-3 py-1 bg-gray-600 rounded">
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-lg font-semibold text-blue-900">{doc.title}</h2>
                      <p className="text-sm text-gray-700">{doc.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Año: {doc.year} | Versión: {doc.version}
                      </p>
                      <a href={doc.url} target="_blank" className="text-sm text-blue-700 underline">
                        Ver documento
                      </a>
                      <div className="flex gap-4 mt-2">
                        <button onClick={() => startEdit(doc)} className="text-sm text-blue-700 hover:underline">
                          Editar
                        </button>
                        <button onClick={() => deleteDoc(doc.id)} className="text-sm text-red-700 hover:underline">
                          Eliminar
                        </button>
                      </div>
                    </div>
                  )}
                </SortableItem>
              ))}
            </ul>
          </SortableContext>
        </DndContext>
  
        <h2 className="text-xl text-gray-900 font-semibold mb-2">Agregar nuevo documento</h2>
        <div className="grid grid-cols-1 gap-3 mb-4 text-gray-900">
          <input
            value={newDoc.title}
            onChange={(e) => setNewDoc((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Título"
            className="p-2 border rounded placeholder-gray-600"
          />
          <input
            value={newDoc.year}
            onChange={(e) => setNewDoc((prev) => ({ ...prev, year: e.target.value }))}
            placeholder="Año"
            className="p-2 border rounded placeholder-gray-600"
          />
          <input
            value={newDoc.version}
            onChange={(e) => setNewDoc((prev) => ({ ...prev, version: e.target.value }))}
            placeholder="Versión"
            className="p-2 border rounded placeholder-gray-600"
          />
          <textarea
            value={newDoc.description}
            onChange={(e) => setNewDoc((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Descripción"
            className="p-2 border rounded placeholder-gray-600"
          />
          <input
            value={newDoc.url}
            onChange={(e) => setNewDoc((prev) => ({ ...prev, url: e.target.value }))}
            placeholder="URL del PDF (Google Drive, Dropbox, etc.)"
            className="p-2 border rounded placeholder-gray-600"
          />
  
          {newDoc.url && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-red-600">📄</span>
              <a
                href={newDoc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 underline hover:text-blue-800"
              >
                Ver PDF cargado
              </a>
            </div>
          )}
        </div>
  
        <button
          onClick={handleAdd}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Agregar documento
        </button>
      </div>
    </>
  );
  

function SortableItem({ item, children }: { item: any; children: React.ReactNode }) {
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
      className="border border-dashed border-gray-700 rounded p-2 bg-white hover:shadow-md"
    >
      <div {...listeners} className="cursor-grab text-gray-700 select-none text-sm mb-2">
        ☰ Arrastrar
      </div>
      {children}
    </li>
  );
}
}
