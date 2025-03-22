'use client';

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useRef } from "react";

export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 text-gray-900">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-100 to-blue-200 py-24 text-center">
        <h1 className="text-4xl font-extrabold text-blue-800">
            Mereces felicidad. Mereces una buena salud mental.
          </h1>
          <p className="mt-4 text-blue-700 font-medium text-lg max-w-2xl mx-auto">
            Porque el bienestar emocional es un derecho, no un privilegio.
          </p>
        </section>

        {/* Stats */}
        <section className="bg-white py-12 border-b border-gray-200">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-extrabold text-blue-700">94</p>
              <p className="text-sm text-gray-600 mt-2">Alianzas Nacionales e Internacionales</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-blue-700">1.424.371</p>
              <p className="text-sm text-gray-600 mt-2">Personas alcanzadas</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-blue-700">7.751</p>
              <p className="text-sm text-gray-600 mt-2">Chats en vivo de PAP</p>
            </div>
          </div>
        </section>

        {/* About / Mission / Vision as Cards */}
        <section className="bg-white py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Nuestra Fundación
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg border border-gray-200 shadow hover:shadow-lg transition-shadow p-6">
                <h3 className="text-xl font-semibold text-blue-700 mb-4">Acerca de SME</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  La Fundación Salud Mental Ecuador, ganadora del Reconocimiento Quito Sostenible e Inclusivo 2022, fue creada en tiempos de pandemia en julio del 2020 con la intención de ofrecer un servicio de atención en salud mental de calidad a la comunidad.
                </p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 shadow hover:shadow-lg transition-shadow p-6">
                <h3 className="text-xl font-semibold text-blue-700 mb-4">Misión</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Mejorar la salud mental en todo el Ecuador mediante servicios gratuitos y de bajo costo.
                </p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 shadow hover:shadow-lg transition-shadow p-6">
                <h3 className="text-xl font-semibold text-blue-700 mb-4">Visión</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Un Ecuador que valore la salud mental al mismo nivel que la salud física, eliminando así los estigmas asociados con el cuidado de esta y fomentando la implementación del bienestar mental en todas las instituciones del país.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Services (Static placeholders for now) */}
        <section className="bg-white py-16 border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-8 text-gray-800">Servicios destacados</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">Terapias virtuales</h3>
                <p className="text-sm text-gray-600">Accede a terapia profesional desde cualquier lugar a bajo costo.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">Primeros Auxilios Psicológicos</h3>
                <p className="text-sm text-gray-600">Chat en vivo con profesionales para orientación inmediata.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">Talleres y grupos de apoyo</h3>
                <p className="text-sm text-gray-600">Participa en espacios seguros para aprender, compartir y sanar.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline – Fancy Horizontal Slider */}
        <section className="bg-blue-50 py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">Hitos de la Fundación SME</h2>
            <div ref={scrollRef} className="flex space-x-6 overflow-x-auto scrollbar-hide px-2 snap-x snap-mandatory">
              {[
                { year: "2020", event: "Creación de la Fundación Salud Mental Ecuador (SME)" },
                { year: "2020", event: "Programas semanales sobre salud mental en El As y La Pluma" },
                { year: "2021", event: "Primer artículo publicado en la revista VIVE LIGHT" },
                { year: "2021", event: "Conferencistas para convocatorias de ley en la Asamblea Nacional" },
                { year: "2022", event: "Conferencistas en el primer evento del año de Impaqto" },
                { year: "2022", event: "Ganadores del Reconocimiento Quito Sostenible e Inclusivo 2022 de CONQUITO" },
                { year: "2022", event: "Únicos conferencistas y participantes de salud mental en el evento de tecnologías médicas 2022 (TECHMED 2022)" },
                { year: "2023", event: "77,500 personas alcanzadas con nuestras campañas por el mes de la salud mental" },
                { year: "2023", event: "Taller al Tribunal Contencioso Electoral (TCE) en consecuencia a la muerte cruzada de Guillermo Lasso" },
                { year: "2023", event: "Creación del primer turismo comunitario con salud mental en Chilla Grande, Cotopaxi" },
                { year: "2023", event: "Primera entrevista de radio (Radio Élite)" },
                { year: "2023", event: "Mérito Emprendimiento Social Telesucesos" },
                { year: "2023", event: "Transmisión en Teleamazonas (Te Veo Ecuador)" },
                { year: "2024", event: "Evento Anual" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="snap-center flex-shrink-0 w-64 bg-white border border-blue-200 rounded-lg shadow p-4"
                >
                  <p className="text-sm text-blue-600 font-bold">{item.year}</p>
                  <p className="text-gray-700 text-sm mt-2">{item.event}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}