'use client';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function ServicesSection() {
  const { data, error, isLoading } = useSWR('/api//homePage/services', fetcher);

  if (error) return <div className="text-center text-red-500">Error al cargar servicios</div>;
  if (isLoading || !data) return <div className="text-center">Cargando servicios...</div>;

  return (
    <section className="bg-white py-16 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-8 text-gray-800">Servicios destacados</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.map((service: { id: string; title: string; description: string }) => (
            <div
              key={service.id}
              className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-blue-700 mb-2">{service.title}</h3>
              <p className="text-sm text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
