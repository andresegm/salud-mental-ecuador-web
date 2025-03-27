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
    if (!res.ok) throw new Error('Error al cargar los miembros');
    return res.json();
};

export default function AdminTeamMembersPage() {
    const { data = [], mutate, isLoading } = useSWR('/api/teamMembers/teamMembers', fetcher);
    const [editing, setEditing] = useState<string | null>(null);
    const [editData, setEditData] = useState<any>({});
    const [newMember, setNewMember] = useState<any>({ name: '', role: '', category: 'FUNDADORES', bio: '', image: '', order: 0 });

    const sensors = useSensors(useSensor(PointerSensor));

    const startEdit = (member: any) => {
        setEditing(member.id);
        setEditData(member);
    };

    const saveEdit = async (id: string) => {
        await fetch(`/api/teamMembers/teamMembers?id=${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editData),
        });
        setEditing(null);
        mutate();
    };

    const deleteMember = async (id: string) => {
        if (!confirm('¿Eliminar este miembro?')) return;
        await fetch(`/api/teamMembers/teamMembers?id=${id}`, { method: 'DELETE' });
        mutate();
    };

    const handleAdd = async () => {
        await fetch('/api/teamMembers/teamMembers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...newMember, order: data.length + 1 }),
        });
        setNewMember({ name: '', role: '', category: 'FUNDADORES', bio: '', image: '', order: 0 });
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
            updated.map((member) =>
                fetch(`/api/teamMembers/teamMembers?id=${member.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ order: member.order }),
                })
            )
        );

        mutate();
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setFn: Function) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => setFn((prev: any) => ({ ...prev, image: reader.result }));
        reader.readAsDataURL(file);
    };

    if (isLoading) return <p className="p-4">Cargando miembros...</p>;

    return (
        <>
            <Navbar />
            <div className="max-w-4xl mx-auto py-10 px-4">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Gestionar Miembros del Equipo</h1>

                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
                    <SortableContext items={data.map((m: any) => m.id)} strategy={verticalListSortingStrategy}>
                        <ul className="space-y-6 mb-12">
                            {[...data].sort((a, b) => a.order - b.order).map((member: any) => (
                                <SortableItem key={member.id} item={member}>
                                    {editing === member.id ? (
                                        <EditForm data={editData} setData={setEditData} onSave={() => saveEdit(member.id)} onCancel={() => setEditing(null)} />
                                    ) : (
                                        <div>
                                            <h2 className="text-lg font-semibold text-blue-900">{member.name} - {member.role}</h2>
                                            <p className="text-sm text-gray-600">Categoría: {member.category}</p>
                                            {member.image && <img src={member.image} alt="avatar" className="w-16 h-16 object-cover rounded-full mt-2" />}
                                            <p className="text-sm mt-2 text-gray-700 whitespace-pre-wrap">{member.bio}</p>
                                            <div className="flex gap-4 mt-2">
                                                <button onClick={() => startEdit(member)} className="text-sm text-blue-700 hover:underline">Editar</button>
                                                <button onClick={() => deleteMember(member.id)} className="text-sm text-red-700 hover:underline">Eliminar</button>
                                            </div>
                                        </div>
                                    )}
                                </SortableItem>
                            ))}
                        </ul>
                    </SortableContext>
                </DndContext>

                <h2 className="text-xl text-gray-900 font-semibold mb-2">Agregar nuevo miembro</h2>
                <div className="grid grid-cols-1 gap-3 mb-4">
                    <input
                        value={newMember.name}
                        onChange={(e) => setNewMember((p: any) => ({ ...p, name: e.target.value }))}
                        placeholder="Nombre"
                        className="p-2 border rounded placeholder-gray-500 text-gray-800"
                    />
                    <input
                        value={newMember.role}
                        onChange={(e) => setNewMember((p: any) => ({ ...p, role: e.target.value }))}
                        placeholder="Rol"
                        className="p-2 border rounded placeholder-gray-500 text-gray-800"
                        required
                    />
                    <select
                        value={newMember.category}
                        onChange={(e) => setNewMember((p: any) => ({ ...p, category: e.target.value }))}
                        className="p-2 border rounded text-gray-800"
                    >
                        <option value="FUNDADORES">Fundadores</option>
                        <option value="EQUIPO_ORGANIZACIONAL">Equipo Organizacional</option>
                        <option value="JUNTA_DIRECTIVA">Junta Directiva</option>
                        <option value="VOLUNTARIOS">Voluntarios</option>
                    </select>
                    <textarea
                        value={newMember.bio}
                        onChange={(e) => setNewMember((p: any) => ({ ...p, bio: e.target.value }))}
                        placeholder="Biografía (opcional)"
                        className="p-2 border rounded placeholder-gray-500 text-gray-800"
                    />
                    <label className="inline-block bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 mt-2">
                    Subir imagen
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () =>
                            setNewMember((prev: any) => ({ ...prev, image: reader.result }));
                            reader.readAsDataURL(file);
                        }
                        }}
                        className="hidden"
                    />
                    </label>
                    {newMember.image && (
                    <img
                        src={newMember.image}
                        alt="preview"
                        className="w-16 h-16 rounded-full object-cover mt-2"
                    />
                    )}
                </div>
                <button
                    onClick={handleAdd}
                    disabled={!newMember.name || !newMember.role}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    Agregar miembro
                </button>
            </div>
        </>
    );
}
function EditForm({ data, setData, onSave, onCancel }: any) {
    return (
        <div className="space-y-2">
            <input
            value={data.name}
            onChange={(e) => setData((p: any) => ({ ...p, name: e.target.value }))}
            placeholder="Nombre"
            className="w-full p-2 border border-gray-300 text-gray-800 rounded"
            />
            <input
            value={data.role}
            onChange={(e) => setData((p: any) => ({ ...p, role: e.target.value }))}
            placeholder="Rol"
            className="w-full p-2 border border-gray-300 text-gray-800 rounded"
            />
            <select
            value={data.category}
            onChange={(e) => setData((p: any) => ({ ...p, category: e.target.value }))}
            className="w-full p-2 border border-gray-300 text-gray-800 rounded"
            >
            <option value="FUNDADORES">Fundadores</option>
            <option value="EQUIPO_ORGANIZACIONAL">Equipo Organizacional</option>
            <option value="JUNTA_DIRECTIVA">Junta Directiva</option>
            <option value="VOLUNTARIOS">Voluntarios</option>
            </select>
            <textarea
            value={data.bio || ''}
            onChange={(e) => setData((p: any) => ({ ...p, bio: e.target.value }))}
            placeholder="Biografía"
            className="w-full p-2 border border-gray-300 text-gray-800 rounded"
            />
            <label className="inline-block bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700">
            Subir nueva imagen
            <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, setData)}
            className="hidden"
            />
            </label>
            {data.image && (
            <img
                src={data.image}
                alt="preview"
                className="w-16 h-16 rounded-full object-cover"
            />
            )}
            <div className="flex gap-3 mt-2">
            <button onClick={onSave} className="px-3 py-1 bg-green-600 text-white rounded">
                Guardar
            </button>
            <button onClick={onCancel} className="px-3 py-1 bg-gray-600 text-white rounded">
                Cancelar
            </button>
            </div>
        </div>
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
            className="border border-dashed border-gray-400 rounded p-2 bg-white hover:shadow-md"
        >
            <div
                {...listeners}
                className="cursor-grab text-gray-600 select-none text-sm mb-2"
            >
                ☰ Arrastrar
            </div>
            {children}
        </li>
    );
}

function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, setFn: Function) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () =>
        setFn((prev: any) => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(file);
}
