import { useEffect, useState } from 'react';
import { Leaf } from 'lucide-react';

interface ScoreGaugeProps {
  score: number;
  grade: string;
  label: string;
  color: string;
}

export default function ScoreGauge({ score, grade, label, color }: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    setAnimatedScore(0);
    const duration = 800;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(interval);
      } else {
        setAnimatedScore(current);
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [score]);

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center justify-center animate-grow">
      <div className="flex items-center gap-2 mb-4">
        <Leaf size={18} className="text-eco-500" />
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Sustainability Grade</h3>
      </div>

      <div className="relative">
        <svg width="200" height="200" className="transform -rotate-90">
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="14"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.05s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-extrabold" style={{ color }}>
            {grade}
          </span>
          <span className="text-sm text-gray-500 mt-0.5 font-medium">{Math.round(animatedScore)}/100</span>
        </div>
      </div>

      <div
        className="mt-4 px-4 py-1.5 rounded-full text-sm font-semibold"
        style={{ backgroundColor: `${color}20`, color }}
      >
        {label}
      </div>
    </div>
  );
}
