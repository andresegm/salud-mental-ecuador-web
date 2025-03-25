'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Navbar from "../../components/navbar/Navbar";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminServicesPage() {
  const { data: services, mutate, isLoading, error } = useSWR('/api/homePage/services', fetcher);

  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editing, setEditing] = useState<{ [id: string]: boolean }>({});
  const [editValues, setEditValues] = useState<{ [id: string]: { title: string; description: string } }>({});

  const handleDelete = async (id: string) => {
    await fetch(`/api/homePage/services?id=${id}`, { method: 'DELETE' });
    mutate();
  };

  const handleAdd = async () => {
    await fetch('/api/homePage/services', {
      method: 'POST',
      body: JSON.stringify({ title: newTitle, description: newDescription }),
      headers: { 'Content-Type': 'application/json' },
    });
    setNewTitle('');
    setNewDescription('');
    mutate();
  };

  const handleEdit = async (id: string) => {
    const updates = editValues[id];
    await fetch(`/api/homePage/services?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
      headers: { 'Content-Type': 'application/json' },
    });
    setEditing((prev) => ({ ...prev, [id]: false }));
    mutate();
  };

  if (isLoading) return <p className="p-4">Cargando...</p>;
  if (error) return <p className="p-4 text-red-500">Error al cargar servicios.</p>;

  return (
    <>
    <Navbar />
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl text-gray-500 font-bold mb-6">Gestionar Servicios</h1>

      {/* Existing services list */}
      <div className="space-y-6">
        {services.map((service: any) => (
          <div key={service.id} className="border p-4 rounded-md bg-white shadow-sm">
            {editing[service.id] ? (
              <>
                <input
                  value={editValues[service.id]?.title || ''}
                  onChange={(e) =>
                    setEditValues((prev) => ({
                      ...prev,
                      [service.id]: { ...prev[service.id], title: e.target.value },
                    }))
                  }
                  placeholder="Título"
                  className="w-full mb-2 p-2 border rounded"
                />
                <textarea
                  value={editValues[service.id]?.description || ''}
                  onChange={(e) =>
                    setEditValues((prev) => ({
                      ...prev,
                      [service.id]: { ...prev[service.id], description: e.target.value },
                    }))
                  }
                  placeholder="Descripción"
                  className="w-full mb-2 p-2 border rounded"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(service.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditing((prev) => ({ ...prev, [service.id]: false }))}
                    className="bg-gray-300 px-3 py-1 rounded"
                  >
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-blue-700">{service.title}</h2>
                <p className="text-gray-700">{service.description}</p>
                <div className="mt-3 flex gap-3">
                  <button
                    onClick={() => {
                      setEditing((prev) => ({ ...prev, [service.id]: true }));
                      setEditValues((prev) => ({
                        ...prev,
                        [service.id]: { title: service.title, description: service.description },
                      }));
                    }}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add new service form */}
      <div className="mt-10 border-t pt-6">
        <h2 className="text-xl text-gray-500 font-semibold mb-2">Agregar nuevo servicio</h2>
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Título"
          className="w-full mb-2 p-2 placeholder-gray-400 border border-gray-300 rounded text-gray-600"
        />
        <textarea
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Descripción"
          className="w-full mb-2 p-2 placeholder-gray-400 border border-gray-300 rounded text-gray-600"
        />
        <button
          onClick={handleAdd}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Agregar Servicio
        </button>
      </div>
    </div>
    </>
  );
}
