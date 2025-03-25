'use client';

import useSWR from 'swr';
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function GovernancePage() {
  const { data = [], error, isLoading } = useSWR('/api/governance/governance', fetcher);

  return (
   <>
    <Navbar /> 
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Gobernanza</h1>
      <p className="text-gray-700 mb-4">
        Salud Mental Ecuador (SME) es una organización registrada en Ecuador. Somos gobernados por nuestra junta directiva y seguimos los procesos requeridos internacionalmente. Documentos adicionales están disponibles bajo solicitud.
      </p>

      {isLoading ? (
        <p className="text-gray-600">Cargando documentos...</p>
      ) : error ? (
        <p className="text-red-600">Error al cargar los documentos.</p>
      ) : (
        <ul className="space-y-4">
          {data.map((doc: any) => (
            <li key={doc.id} className="border-b pb-4">
              <h2 className="text-lg font-semibold text-blue-700">{doc.title}</h2>
              <p className="text-sm text-gray-600">{doc.description}</p>
              <p className="text-xs text-gray-500">
                Año: {doc.year} | Versión: {doc.version}
              </p>
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 underline mt-1 inline-block"
              >
                Ver PDF
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
<Footer />
</>
  );
}
