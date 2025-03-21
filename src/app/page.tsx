import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 text-gray-900">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-100 to-blue-200 py-24 text-center">
          <h1 className="text-4xl font-extrabold text-blue-800">
            Fundación Salud Mental Ecuador
          </h1>
          <p className="mt-6 text-lg text-blue-900 max-w-2xl mx-auto">
            Por una salud mental accesible, humana y transformadora.
          </p>
        </section>

        {/* About/Intro Section */}
        <section className="max-w-4xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-semibold mb-4 text-gray-800">
            Nuestra misión
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Brindar apoyo integral a la salud mental a través de programas
            gratuitos y de bajo costo como terapias virtuales, talleres, grupos
            de apoyo y más.
          </p>
        </section>

        {/* Featured Services Section */}
        <section className="bg-white py-16 border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-8 text-gray-800">
              Servicios destacados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">
                  Terapias virtuales
                </h3>
                <p className="text-sm text-gray-600">
                  Accede a terapia profesional desde cualquier lugar a bajo costo.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">
                  Primeros Auxilios Psicológicos
                </h3>
                <p className="text-sm text-gray-600">
                  Chat en vivo con profesionales para orientación inmediata.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">
                  Talleres y grupos de apoyo
                </h3>
                <p className="text-sm text-gray-600">
                  Participa en espacios seguros para aprender, compartir y sanar.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
