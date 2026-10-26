import { Euro, Wallet, Calendar, TrendingUp, PiggyBank } from 'lucide-react';
import { type CalculationResults, type CalculatorInputs, formatCurrency, formatNumber } from '@/data/calculator';

interface FinancialAnalysisProps {
  results: CalculationResults;
  inputs: CalculatorInputs;
}

export default function FinancialAnalysis({ results, inputs }: FinancialAnalysisProps) {
  const { hasPositiveBusinessCase, hasValidPayback, paybackYears, roiPercent, annualCostSavings, lifetimeCostSavings, costReductionPct } = results;

  const paybackDisplay = hasValidPayback ? `${formatNumber(paybackYears, 1)} years` : 'N/A';
  const paybackSub = hasValidPayback ? 'break-even point' : hasPositiveBusinessCase ? 'Exceeds product lifetime' : 'No positive business case';

  const roiDisplay = hasPositiveBusinessCase ? `${formatNumber(roiPercent, 0)}%` : 'N/A';
  const roiSub = hasPositiveBusinessCase ? `over ${inputs.lifetime} years` : 'No positive business case';

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
        <Wallet size={16} className="text-betaburka-600" />
        Financial Analysis
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <FinancialCard
          icon={<Euro size={20} />}
          label="Investment Cost"
          value={formatCurrency(inputs.investmentCost)}
          sublabel="upfront capital"
          color="blue"
        />
        <FinancialCard
          icon={<PiggyBank size={20} />}
          label="Annual Savings"
          value={hasPositiveBusinessCase ? formatCurrency(annualCostSavings) : 'N/A'}
          sublabel={hasPositiveBusinessCase ? `${formatNumber(costReductionPct, 1)}% vs existing` : 'No positive business case'}
          color={hasPositiveBusinessCase ? 'green' : 'gray'}
        />
        <FinancialCard
          icon={<Wallet size={20} />}
          label="Lifetime Savings"
          value={hasPositiveBusinessCase ? formatCurrency(lifetimeCostSavings) : 'N/A'}
          sublabel={hasPositiveBusinessCase ? `over ${inputs.lifetime} years` : 'No positive business case'}
          color={hasPositiveBusinessCase ? 'green' : 'gray'}
        />
        <FinancialCard
          icon={<Calendar size={20} />}
          label="Payback Period"
          value={paybackDisplay}
          sublabel={paybackSub}
          color={hasValidPayback ? 'blue' : 'gray'}
        />
        <FinancialCard
          icon={<TrendingUp size={20} />}
          label="ROI"
          value={roiDisplay}
          sublabel={roiSub}
          color={hasPositiveBusinessCase ? 'green' : 'gray'}
        />
      </div>
    </div>
  );
}

interface FinancialCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel: string;
  color: 'blue' | 'green' | 'gray';
}

function FinancialCard({ icon, label, value, sublabel, color }: FinancialCardProps) {
  const colorMap = {
    blue: {
      bg: 'bg-betaburka-50',
      text: 'text-betaburka-700',
      border: 'border-betaburka-100',
      gradient: 'from-betaburka-50 to-white',
      valueText: 'text-betaburka-800',
    },
    green: {
      bg: 'bg-eco-50',
      text: 'text-eco-700',
      border: 'border-eco-100',
      gradient: 'from-eco-50 to-white',
      valueText: 'text-eco-700',
    },
    gray: {
      bg: 'bg-gray-100',
      text: 'text-gray-500',
      border: 'border-gray-200',
      gradient: 'from-gray-50 to-white',
      valueText: 'text-gray-400',
    },
  };
  const c = colorMap[color];

  return (
    <div className={`bg-gradient-to-br ${c.gradient} rounded-xl border ${c.border} p-5 hover:shadow-md transition-shadow animate-grow`}>
      <div className={`w-10 h-10 rounded-lg ${c.bg} ${c.text} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-bold ${c.valueText}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-1">{sublabel}</p>
    </div>
  );
}
