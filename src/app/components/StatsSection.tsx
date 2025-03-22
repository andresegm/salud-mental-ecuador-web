'use client';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function StatsSection() {
  const { data, error, isLoading } = useSWR('/api/stats', fetcher);

  if (error) return <div className="text-center text-red-500">Failed to load stats</div>;
  if (isLoading || !data) return <div className="text-center">Loading stats...</div>;

  return (
    <section className="bg-white py-12 border-b border-gray-200">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        {data.map((stat: { id: string; label: string; value: number; unit?: string }) => (
          <div key={stat.id}>
            <p className="text-6xl font-extrabold text-blue-700">
              {stat.value.toLocaleString()} {stat.unit || ''}
            </p>
            <p className="text-sm text-gray-600 mt-2">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StatsSection;
