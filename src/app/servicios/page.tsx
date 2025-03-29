'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ServiciosPage() {
  const { data, error, isLoading } = useSWR('/api/homePage/services', fetcher);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (error) return <div className="text-center text-red-500 mt-8">Error al cargar servicios</div>;
  if (isLoading || !data) return <div className="text-center mt-8">Cargando servicios...</div>;

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
          Todos los Servicios
        </motion.h1>

        <div className="flex flex-wrap gap-6 justify-center">
          {data.map((service: any, i: number) => {
            const isExpanded = expandedId === service.id;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                viewport={{ once: true }}
                onClick={() => toggleExpand(service.id)}
                className={`w-[260px] bg-gradient-to-br from-white via-slate-50 to-blue-50 shadow-md rounded-lg p-4 border border-cyan-200 hover:shadow-lg transition-shadow cursor-pointer ${isExpanded ? 'ring-2 ring-indigo-300' : ''}`}
              >
                {service.image && (
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-40 object-cover rounded mb-3 border border-blue-100"
                  />
                )}
                <h3 className="text-lg font-semibold text-slate-800 text-center">{service.title}</h3>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-2"
                    >
                      <p className="text-sm text-gray-700 text-justify whitespace-pre-wrap">{service.description}</p>
                      {service.price && (
                        <p className="text-sm text-gray-500 mt-2">Precio: {service.price}</p>
                      )}
                      {service.section && (
                        <p className="text-xs text-gray-400">Sección: {service.section}</p>
                      )}
                      {service.buttonLabel && service.buttonUrl && (
                        <a
                        href={
                          service.buttonUrl?.startsWith('http://') || service.buttonUrl?.startsWith('https://')
                            ? service.buttonUrl
                            : `https://${service.buttonUrl}`
                        }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-3 text-sm text-blue-600 underline"
                        >
                          {service.buttonLabel}
                        </a>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
      <Footer />
    </>
  );
}