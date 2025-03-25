'use client';

import 'react-vertical-timeline-component/style.min.css';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import useSWR from 'swr';
import { FaRegCalendarAlt } from 'react-icons/fa';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TimelineSection() {
  const { data, error, isLoading } = useSWR('/api/homePage/timeline', fetcher);

  if (error) return <div className="text-center text-red-500">Error al cargar la línea de tiempo</div>;
  if (isLoading || !data) return <div className="text-center">Cargando línea de tiempo...</div>;

  return (
    <section className="bg-blue-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-800 text-center mb-12">Nuestra Historia</h2>

        <VerticalTimeline lineColor="#3B82F6">
          {data
            .sort((a: any, b: any) => a.order - b.order)
            .map((item: any) => (
              <VerticalTimelineElement
                key={item.id}
                date={item.year}
                icon={<FaRegCalendarAlt />}
                iconStyle={{ background: '#3B82F6', color: '#fff' }}
                contentStyle={{
                  background: '#fff',
                  border: '1px solid #cbd5e1',
                  boxShadow: '0 3px 8px rgba(0,0,0,0.05)',
                }}
                contentArrowStyle={{ borderRight: '7px solid #cbd5e1' }}
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt="Evento"
                    className="w-20 h-20 object-cover rounded-full mx-auto mb-4 border-4 border-blue-200"
                  />
                )}
                <h3 className="text-lg font-semibold text-blue-800 mb-1">{item.year}</h3>
                <p className="text-sm text-gray-800 whitespace-pre-line">{item.event}</p>
                {item.category && (
                  <p className="text-xs text-gray-500 italic mt-2">Categoría: {item.category}</p>
                )}
              </VerticalTimelineElement>
            ))}
        </VerticalTimeline>
      </div>
    </section>
  );
}