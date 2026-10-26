import { TreePine, Car, Plane, Home } from 'lucide-react';
import { getEquivalencies } from '@/data/calculator';

interface EquivalencyCardProps {
  lifetimeCarbon: number;
}

const iconMap = {
  tree: <TreePine size={24} />,
  car: <Car size={24} />,
  plane: <Plane size={24} />,
  home: <Home size={24} />,
};

export default function EquivalencyCard({ lifetimeCarbon }: EquivalencyCardProps) {
  const equivalencies = getEquivalencies(lifetimeCarbon);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          What Does This Mean?
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          Real-world equivalents of total lifetime carbon (embodied + operational)
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {equivalencies.map((eq, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-burkert-50 to-white rounded-xl p-5 border border-burkert-100 hover:shadow-md transition-shadow animate-slide-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="w-12 h-12 rounded-xl bg-burkert-100 text-burkert-600 flex items-center justify-center mb-3">
              {iconMap[eq.icon as keyof typeof iconMap]}
            </div>
            <p className="text-2xl font-bold text-burkert-800">{eq.value}</p>
            <p className="text-xs text-gray-500 mt-1">{eq.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
