'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Navbar from "../../components/Navbar";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AdminStatsPage() {
  const { data: stats, mutate, isLoading } = useSWR('/api/homePage/stats', fetcher);

  const [editMode, setEditMode] = useState<{ [id: string]: boolean }>({});
  const [editValues, setEditValues] = useState<{ [id: string]: { label: string; value: number; unit?: string } }>({});
  const [newStat, setNewStat] = useState({ label: '', value: '', unit: '' });

  const handleDelete = async (id: string) => {
    await fetch(`/api/homePage/stats?id=${id}`, { method: 'DELETE' });
    mutate();
  };

  const handleEdit = async (id: string) => {
    const { label, value, unit } = editValues[id];
    await fetch(`/api/homePage/stats?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label, value: Number(value), unit }),
    });
    setEditMode((prev) => ({ ...prev, [id]: false }));
    mutate();
  };

  const handleAdd = async () => {
    await fetch('/api/homePage/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        label: newStat.label,
        value: Number(newStat.value),
        unit: newStat.unit || undefined,
      }),
    });
    setNewStat({ label: '', value: '', unit: '' });
    mutate();
  };

  if (isLoading) return <p className="p-4">Cargando estadísticas...</p>;

return (
    <>
        <Navbar />
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">Editar Estadísticas</h1>

            <table className="w-full text-sm border border-gray-300">
                <thead className="bg-gray-200 text-left">
                    <tr>
                        <th className="p-2 border border-gray-300 text-gray-900">Label</th>
                        <th className="p-2 border border-gray-300 text-gray-900">Value</th>
                        <th className="p-2 border border-gray-300 text-gray-900">Unit</th>
                        <th className="p-2 border border-gray-300 text-gray-900">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {stats?.map((stat: any) => (
                        <tr key={stat.id} className="border-t border-gray-300">
                            <td className="p-2 border border-gray-300 text-gray-900">
                                {editMode[stat.id] ? (
                                    <input
                                        value={editValues[stat.id]?.label || ''}
                                        onChange={(e) =>
                                            setEditValues((prev) => ({
                                                ...prev,
                                                [stat.id]: { ...prev[stat.id], label: e.target.value },
                                            }))
                                        }
                                        className="w-full border border-gray-300 px-2 py-1 rounded text-gray-900"
                                    />
                                ) : (
                                    stat.label
                                )}
                            </td>
                            <td className="p-2 border border-gray-300 text-gray-900">
                                {editMode[stat.id] ? (
                                    <input
                                        type="number"
                                        value={editValues[stat.id]?.value || ''}
                                        onChange={(e) =>
                                            setEditValues((prev) => ({
                                                ...prev,
                                                [stat.id]: { ...prev[stat.id], value: Number(e.target.value) },
                                            }))
                                        }
                                        className="w-full border border-gray-300 px-2 py-1 rounded text-gray-900"
                                    />
                                ) : (
                                    stat.value
                                )}
                            </td>
                            <td className="p-2 border border-gray-300 text-gray-900">
                                {editMode[stat.id] ? (
                                    <input
                                        value={editValues[stat.id]?.unit || ''}
                                        onChange={(e) =>
                                            setEditValues((prev) => ({
                                                ...prev,
                                                [stat.id]: { ...prev[stat.id], unit: e.target.value },
                                            }))
                                        }
                                        className="w-full border border-gray-300 px-2 py-1 rounded text-gray-900"
                                    />
                                ) : (
                                    stat.unit || '-'
                                )}
                            </td>
                            <td className="p-2 border border-gray-300 flex gap-2 text-gray-900">
                                {editMode[stat.id] ? (
                                    <>
                                        <button
                                            onClick={() => handleEdit(stat.id)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Guardar
                                        </button>
                                        <button
                                            onClick={() => setEditMode((prev) => ({ ...prev, [stat.id]: false }))}
                                            className="text-gray-600 hover:underline"
                                        >
                                            Cancelar
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => {
                                                setEditMode((prev) => ({ ...prev, [stat.id]: true }));
                                                setEditValues((prev) => ({
                                                    ...prev,
                                                    [stat.id]: {
                                                        label: stat.label,
                                                        value: stat.value,
                                                        unit: stat.unit || '',
                                                    },
                                                }));
                                            }}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(stat.id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Eliminar
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Add new stat row */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-2 text-gray-900">Agregar nueva estadística</h2>
                <div className="grid grid-cols-3 gap-4 mb-2">
                    <input
                        value={newStat.label}
                        onChange={(e) => setNewStat((prev) => ({ ...prev, label: e.target.value }))}
                        placeholder="Label"
                        className="border border-gray-300 p-2 rounded text-gray-900"
                    />
                    <input
                        type="number"
                        value={newStat.value}
                        onChange={(e) => setNewStat((prev) => ({ ...prev, value: e.target.value }))}
                        placeholder="Value"
                        className="border border-gray-300 p-2 rounded text-gray-900"
                    />
                    <input
                        value={newStat.unit}
                        onChange={(e) => setNewStat((prev) => ({ ...prev, unit: e.target.value }))}
                        placeholder="Unit (opcional)"
                        className="border border-gray-300 p-2 rounded text-gray-900"
                    />
                </div>
                <button
                    onClick={handleAdd}
                    className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                    Agregar estadística
                </button>
            </div>
        </div>
    </>
);
}
