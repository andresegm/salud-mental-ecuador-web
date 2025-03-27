'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const CATEGORY_LABELS: Record<string, string> = {
  FUNDADORES: 'Fundadores y Asesores',
  EQUIPO_ORGANIZACIONAL: 'Equipo Organizacional',
  JUNTA_DIRECTIVA: 'Junta Directiva',
  VOLUNTARIOS: 'Voluntarios y Voluntarias',
};

export default function EquipoPage() {
  const { data, error, isLoading } = useSWR('/api/teamMembers/teamMembers', fetcher);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const members = Array.isArray(data) ? data : [];

  const grouped = members.reduce((acc: any, member: any) => {
    if (!acc[member.category]) acc[member.category] = [];
    acc[member.category].push(member);
    return acc;
  }, {});

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-sky-800 mb-6"
        >
          Nuestro Equipo
        </motion.h1>

        {isLoading ? (
          <p className="text-gray-600">Cargando miembros...</p>
        ) : error ? (
          <p className="text-red-600">Error al cargar el equipo.</p>
        ) : (
          Object.entries(grouped).map(([category, members]: any, i) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-16 p-4 rounded-lg bg-gradient-to-br from-sky-50 via-white to-slate-50 border border-blue-100 shadow-sm"
            >
              <h2 className="text-2xl font-semibold text-indigo-700 mb-4">{CATEGORY_LABELS[category]}</h2>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {members.map((member: any, j: number) => {
                  const isExpanded = expandedId === member.id;
                  return (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: j * 0.05, duration: 0.4 }}
                      viewport={{ once: true }}
                      onClick={() => toggleExpand(member.id)}
                      className={`min-w-[200px] max-w-[240px] bg-gradient-to-br from-white via-slate-50 to-blue-50 shadow-md rounded-lg p-4 border border-cyan-200 hover:shadow-lg transition-shadow cursor-pointer ${isExpanded ? 'ring-2 ring-indigo-300' : ''}`}
                    >
                      {member.image && (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-24 h-24 object-cover rounded-full mx-auto mb-2 border border-blue-100"
                        />
                      )}
                      <h3 className="text-lg font-semibold text-center text-slate-800">{member.name}</h3>
                      <p className="text-sm text-center text-sky-600">{member.role}</p>
                      <AnimatePresence>
                        {isExpanded && member.bio && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-xs text-slate-600 mt-2 text-justify whitespace-pre-wrap"
                          >
                            {member.bio}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))
        )}
      </div>
      <Footer />
    </>
  );
}
