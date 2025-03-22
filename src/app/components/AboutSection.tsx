'use client';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

function AboutSection() {
  const { data, error, isLoading } = useSWR('/api/about', fetcher);

  if (error) return <div className="text-center text-red-500">Failed to load about section</div>;
  if (isLoading || !data) return <div className="text-center">Loading...</div>;

  return (
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Nuestra Fundación</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.map((section: { id: string; title: string; content: string }) => (
            <div
              key={section.id}
              className="bg-white rounded-lg border border-gray-200 shadow hover:shadow-lg transition-shadow p-6"
            >
              <h3 className="text-xl font-semibold text-blue-700 mb-4">{section.title}</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
