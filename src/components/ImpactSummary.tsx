import { TrendingDown, Zap, Cloud, Euro, ArrowRight } from 'lucide-react';
import { type CalculationResults, formatEnergy, formatCO2, formatCurrency, formatNumber } from '@/data/calculator';

interface ImpactSummaryProps {
  results: CalculationResults;
}

export default function ImpactSummary({ results }: ImpactSummaryProps) {
  const rows = [
    {
      icon: <Zap size={18} />,
      label: 'Energy Use',
      existing: formatEnergy(results.existingAnnualEnergy),
      burkert: formatEnergy(results.annualEnergyTotal),
      reduction: formatEnergy(results.annualEnergySavings),
      pct: results.energyReductionPct,
      color: '#006bb3',
    },
    {
      icon: <Cloud size={18} />,
      label: 'CO₂ Emissions',
      existing: formatCO2(results.existingAnnualCO2),
      burkert: formatCO2(results.annualCO2),
      reduction: formatCO2(results.annualCO2Reduction),
      pct: results.co2ReductionPct,
      color: '#6b7280',
    },
    {
      icon: <Euro size={18} />,
      label: 'Operating Cost',
      existing: formatCurrency(results.existingAnnualCost),
      burkert: formatCurrency(results.annualCost),
      reduction: formatCurrency(results.annualCostSavings),
      pct: results.costReductionPct,
      color: '#10b981',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-5">
        <TrendingDown size={20} className="text-eco-500" />
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Sustainability Impact Summary
        </h3>
      </div>

      {/* Table header */}
      <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
        <div className="col-span-3">Metric</div>
        <div className="col-span-3 text-center">Existing Solution</div>
        <div className="col-span-3 text-center">Bürkert Solution</div>
        <div className="col-span-3 text-right">Reduction</div>
      </div>

      {rows.map((row, i) => (
        <div
          key={i}
          className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 px-4 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors animate-slide-up"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          {/* Metric label */}
          <div className="col-span-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${row.color}15`, color: row.color }}>
              {row.icon}
            </span>
            <span className="text-sm font-medium text-gray-700">{row.label}</span>
          </div>

          {/* Existing */}
          <div className="col-span-3 flex items-center md:justify-center">
            <div>
              <p className="md:hidden text-xs text-gray-400">Existing</p>
              <p className="text-sm font-semibold text-gray-600">{row.existing}</p>
            </div>
          </div>

          {/* Bürkert */}
          <div className="col-span-3 flex items-center md:justify-center gap-1.5">
            <ArrowRight size={14} className="text-gray-300 hidden md:block" />
            <div>
              <p className="md:hidden text-xs text-gray-400">Bürkert</p>
              <p className="text-sm font-bold" style={{ color: row.color }}>{row.burkert}</p>
            </div>
          </div>

          {/* Reduction */}
          <div className="col-span-3 flex items-center md:justify-end">
            <div className="md:text-right">
              <p className="md:hidden text-xs text-gray-400">Reduction</p>
              <p className="text-sm font-bold text-eco-600">{row.reduction}</p>
              <div className="flex items-center md:justify-end gap-1 mt-0.5">
                <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-eco-600 bg-eco-50 px-2 py-0.5 rounded-full">
                  <TrendingDown size={11} />
                  {formatNumber(row.pct, 1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
