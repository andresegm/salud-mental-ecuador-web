'use client';

import Link from 'next/link';
import Navbar from "../components/navbar/Navbar";

export default function AdminDashboard() {
  return (
    <>
    <Navbar />
    <div className="min-h-screen p-8 bg-gray-600">
      <h1 className="text-3xl font-bold mb-6">Panel de Administrador</h1>
      <p className="text-gray-200 mb-8">Bienvenido. Selecciona una sección para administrar el contenido.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AdminCard title="Editar Estadísticas" href="/admin/stats" />
        <AdminCard title="Gestionar Línea de Tiempo" href="/admin/timeline" />
        <AdminCard title="Editar Acerca / Misión / Visión" href="/admin/about" />
        <AdminCard title="Gestionar Servicios" href="/admin/services" />
        <AdminCard title="Documentos de Gobernanza" href="/admin/governance" />
        {/* Add more cards for Blog, Team, Testimonials, etc. */}
      </div>
    </div>
    </>
  );
}

function AdminCard({ title, href }: { title: string; href: string }) {
  return (
    <Link
      href={href}
      className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 hover:border-blue-500"
    >
      <h2 className="text-lg font-semibold text-blue-700">{title}</h2>
      <p className="text-sm text-gray-600 mt-2">Administrar contenido relacionado.</p>
    </Link>
  );
}
