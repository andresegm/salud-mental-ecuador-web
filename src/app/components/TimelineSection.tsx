'use client';
import { useRef } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function TimelineSection() {
  const { data, error, isLoading } = useSWR('/api/timeline', fetcher);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (error) return <div className="text-center text-red-500">Error al cargar la línea de tiempo</div>;
  if (isLoading || !data) return <div className="text-center">Cargando línea de tiempo...</div>;

  return (
    <section className="bg-blue-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">Hitos de la Fundación SME</h2>

        <div
          ref={scrollRef}
          className="flex space-x-6 overflow-x-auto scrollbar-hide px-2 snap-x snap-mandatory"
        >
          {data.map((item: { id: string; year: string; event: string }) => (
            <div
              key={item.id}
              className="snap-center flex-shrink-0 w-64 bg-white border border-blue-200 rounded-lg shadow p-4"
            >
              <p className="text-sm text-blue-600 font-bold">{item.year}</p>
              <p className="text-gray-700 text-sm mt-2">{item.event}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TimelineSection;
