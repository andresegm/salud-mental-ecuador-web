'use client';
import useSWR from 'swr';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ServiciosPage() {
  const { data, error, isLoading } = useSWR('/api/homePage/services', fetcher);

  if (error) return <div className="text-center text-red-500 mt-8">Error al cargar servicios</div>;
  if (isLoading || !data) return <div className="text-center mt-8">Cargando servicios...</div>;

  return (
    <>
      <Navbar />
      <section className="bg-white py-16 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Todos los Servicios</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.map((service: any) => (
              <div
                key={service.id}
                className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold text-blue-700 mb-2">{service.title}</h3>
                <p className="text-sm text-gray-600">{service.description}</p>
                {service.price && (
                  <p className="text-sm text-gray-500 mt-2">Precio: {service.price}</p>
                )}
                {service.section && (
                  <p className="text-xs text-gray-400 mt-1">Sección: {service.section}</p>
                )}
                {service.buttonLabel && service.buttonUrl && (
                  <a
                    href={service.buttonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-sm text-blue-600 underline"
                  >
                    {service.buttonLabel}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
