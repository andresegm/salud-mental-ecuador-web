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
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error fetching data');
  return res.json();
};

export default function AdminServicesPage() {
  const { data = [], mutate, isLoading } = useSWR('/api/homePage/services', fetcher);
  console.log('Fetched services:', data);

  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({
    title: '',
    description: '',
    section: '',
    price: '',
    buttonLabel: '',
    buttonUrl: ''
  });
  const [newService, setNewService] = useState<any>({
    title: '',
    description: '',
    section: '',
    price: '',
    buttonLabel: '',
    buttonUrl: ''
  });

  const sensors = useSensors(useSensor(PointerSensor));

  const handleAdd = async () => {
    await fetch('/api/homePage/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newService, order: data.length + 1 }),
    });
    setNewService({ title: '', description: '', section: '', price: '', buttonLabel: '', buttonUrl: '' });
    mutate();
  };

  const handleEdit = async (id: string) => {
    await fetch(`/api/homePage/services?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    });
    setEditing(null);
    mutate();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este servicio?')) return;
    await fetch(`/api/homePage/services?id=${id}`, { method: 'DELETE' });
    mutate();
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = data.findIndex((s: any) => s.id === active.id);
    const newIndex = data.findIndex((s: any) => s.id === over.id);

    const reordered = arrayMove([...data], oldIndex, newIndex).map((s, i) => ({
      ...s,
      order: i + 1,
    }));

    mutate(reordered, false);

    await Promise.all(
      reordered.map((s) =>
        fetch(`/api/homePage/services?id=${s.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: s.order }),
        })
      )
    );

    mutate();
  };

  if (isLoading) return <p className="p-4">Cargando servicios...</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestionar Servicios</h1>

        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
          <SortableContext
            items={[...data].sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999)).map((s: any) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="space-y-6 mb-10">
              {[...data].sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999)).map((service: any) => (
                <SortableItem key={service.id} item={service}>
                  {editing === service.id ? (
                    <div className="space-y-2">
                      <input
                        value={editData.title}
                        onChange={(e) => setEditData((p: any) => ({ ...p, title: e.target.value }))}
                        placeholder="Título"
                        className="w-full p-2 border rounded border-gray-300 rounded text-gray-700"
                      />
                      <textarea
                        value={editData.description}
                        onChange={(e) => setEditData((p: any) => ({ ...p, description: e.target.value }))}
                        placeholder="Descripción"
                        className="w-full p-2 border rounded border-gray-300 rounded text-gray-700"
                      />
                      <input
                        value={editData.section}
                        onChange={(e) => setEditData((p: any) => ({ ...p, section: e.target.value }))}
                        placeholder="Sección"
                        className="w-full p-2 border rounded border-gray-300 rounded text-gray-700"
                      />
                      <input
                        value={editData.price}
                        onChange={(e) => setEditData((p: any) => ({ ...p, price: e.target.value }))}
                        placeholder="Precio"
                        className="w-full p-2 border rounded border-gray-300 rounded text-gray-700"
                      />
                      <input
                        value={editData.buttonLabel}
                        onChange={(e) => setEditData((p: any) => ({ ...p, buttonLabel: e.target.value }))}
                        placeholder="Texto del botón"
                        className="w-full p-2 border rounded border-gray-300 rounded text-gray-700"
                      />
                      <input
                        value={editData.buttonUrl}
                        onChange={(e) => setEditData((p: any) => ({ ...p, buttonUrl: e.target.value }))}
                        placeholder="URL del botón"
                        className="w-full p-2 border rounded border-gray-300 rounded text-gray-700"
                      />
                      <div className="flex gap-3">
                        <button onClick={() => handleEdit(service.id)} className="bg-blue-600 text-white px-3 py-1 rounded">
                          Guardar
                        </button>
                        <button onClick={() => setEditing(null)} className="bg-gray-300 px-3 py-1 rounded">
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-lg font-semibold text-blue-700">{service.title}</h2>
                      <p className="text-sm text-gray-700">{service.description}</p>
                      {service.section && <p className="text-xs text-gray-500">Sección: {service.section}</p>}
                      {service.price && <p className="text-xs text-gray-500">Precio: {service.price}</p>}
                      {service.buttonLabel && service.buttonUrl && (
                        <a href={service.buttonUrl} className="text-sm text-blue-600 underline block mt-1" target="_blank">
                          {service.buttonLabel}
                        </a>
                      )}
                      <div className="flex gap-4 mt-2">
                        <button onClick={() => {
                          setEditing(service.id);
                          setEditData({
                            title: service.title,
                            description: service.description,
                            section: service.section || '',
                            price: service.price || '',
                            buttonLabel: service.buttonLabel || '',
                            buttonUrl: service.buttonUrl || '',
                          });
                        }} className="text-sm text-blue-600 hover:underline">
                          Editar
                        </button>
                        <button onClick={() => handleDelete(service.id)} className="text-sm text-red-600 hover:underline">
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

        <h2 className="text-xl font-semibold mb-2 text-gray-700">Agregar nuevo servicio</h2>
        <div className="grid grid-cols-1 gap-3 mb-4">
          <input
            value={newService.title}
            onChange={(e) => setNewService((p: any) => ({ ...p, title: e.target.value }))}
            placeholder="Título"
            className="p-2 border rounded border-gray-300 rounded text-gray-700"
          />
          <textarea
            value={newService.description}
            onChange={(e) => setNewService((p: any) => ({ ...p, description: e.target.value }))}
            placeholder="Descripción"
            className="p-2 border rounded border-gray-300 rounded text-gray-700"
          />
          <input
            value={newService.section}
            onChange={(e) => setNewService((p: any) => ({ ...p, section: e.target.value }))}
            placeholder="Sección"
            className="p-2 border rounded border-gray-300 rounded text-gray-700"
          />
          <input
            value={newService.price}
            onChange={(e) => setNewService((p: any) => ({ ...p, price: e.target.value }))}
            placeholder="Precio"
            className="p-2 border rounded border-gray-300 rounded text-gray-700"
          />
          <input
            value={newService.buttonLabel}
            onChange={(e) => setNewService((p: any) => ({ ...p, buttonLabel: e.target.value }))}
            placeholder="Texto del botón"
            className="p-2 border rounded border-gray-300 rounded text-gray-700"
          />
          <input
            value={newService.buttonUrl}
            onChange={(e) => setNewService((p: any) => ({ ...p, buttonUrl: e.target.value }))}
            placeholder="URL del botón"
            className="p-2 border border-gray-300 rounded text-gray-700"
          />
        </div>
        <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded">
          Agregar servicio
        </button>
      </div>
    </>
  );
}

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
      className="border border-dashed border-gray-300 rounded p-2 bg-white hover:shadow-md"
    >
      <div {...listeners} className="cursor-grab text-gray-400 select-none text-sm mb-2">
        ☰ Arrastrar
      </div>
      {children}
    </li>
  );
}
