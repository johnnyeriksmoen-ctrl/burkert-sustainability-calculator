import { CheckCircle2, AlertTriangle, XCircle, TrendingUp, Calendar, Euro, Leaf, Wallet, CircleCheck } from 'lucide-react';
import { type CalculationResults, type CalculatorInputs, formatCurrency, formatNumber, checkHasValidPayback } from '@/data/calculator';
import { PRODUCTS, getCountry, getMaterial } from '@/data/calculator';

interface ExecutiveSummaryProps {
  results: CalculationResults;
  inputs: CalculatorInputs;
}

type LightColor = 'green' | 'yellow' | 'red';

interface Recommendation {
  light: LightColor;
  icon: React.ReactNode;
  statusLabel: string;
  text: string;
  borderColor: string;
  bgColor: string;
  iconBg: string;
  iconColor: string;
  accentBar: string;
  badgeBg: string;
  badgeText: string;
}

export default function ExecutiveSummary({ results, inputs }: ExecutiveSummaryProps) {
  const product = PRODUCTS.find((p) => p.id === inputs.productId) || PRODUCTS[0];
  const country = getCountry(inputs.country);
  const material = getMaterial(inputs.material);

  const rec = generateRecommendation(results, inputs, product.name, country.name, material.name);

  const hasCase = results.hasPositiveBusinessCase;
  const validPayback = results.hasValidPayback;
  const paybackDisplay = validPayback
    ? `${formatNumber(results.paybackYears, 1)} years`
    : 'N/A';
  const roiDisplay = hasCase ? `${formatNumber(results.roiPercent, 0)}%` : 'N/A';

  return (
    <div className={`rounded-2xl border-2 overflow-hidden animate-slide-up shadow-lg ${rec.borderColor} ${rec.bgColor}`}>
      {/* Accent bar */}
      <div className={`h-2 ${rec.accentBar}`} />

      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${rec.iconBg} ${rec.iconColor} shadow-sm`}>
            {rec.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h3 className="text-xl font-extrabold text-gray-800 tracking-tight">
                Recommended Action
              </h3>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${rec.badgeBg} ${rec.badgeText}`}>
                <span className={`w-2 h-2 rounded-full ${rec.accentBar}`} />
                {rec.statusLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Checklist metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          <ChecklistItem
            icon={<Leaf size={16} />}
            label="Sustainability Grade"
            value={`Grade ${results.sustainabilityGrade}`}
            sub={results.scoreLabel}
            positive={true}
            color={results.scoreColor}
          />
          <ChecklistItem
            icon={<Euro size={16} />}
            label="Annual Savings"
            value={hasCase ? formatCurrency(results.annualCostSavings) : 'N/A'}
            sub={hasCase ? `${formatNumber(results.costReductionPct, 1)}% reduction` : 'no savings'}
            positive={hasCase}
            color={hasCase ? '#10b981' : '#ef4444'}
          />
          <ChecklistItem
            icon={<Wallet size={16} />}
            label="Lifetime Savings"
            value={hasCase ? formatCurrency(results.lifetimeCostSavings) : 'N/A'}
            sub={hasCase ? `over ${inputs.lifetime} years` : 'no savings'}
            positive={hasCase}
            color={hasCase ? '#10b981' : '#ef4444'}
          />
          <ChecklistItem
            icon={<Calendar size={16} />}
            label="Payback"
            value={paybackDisplay}
            sub={validPayback ? 'break-even point' : hasCase ? 'exceeds product lifetime' : '—'}
            positive={validPayback}
            color={validPayback ? '#10b981' : '#ef4444'}
          />
          <ChecklistItem
            icon={<TrendingUp size={16} />}
            label="ROI"
            value={roiDisplay}
            sub={hasCase ? `over ${inputs.lifetime} years` : '—'}
            positive={hasCase}
            color={hasCase ? '#10b981' : '#ef4444'}
          />
        </div>

        {/* Recommendation text */}
        <div className={`rounded-xl p-4 border ${rec.borderColor} bg-white/70`}>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <CircleCheck size={14} className={rec.iconColor} />
            Recommendation
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            {rec.text}
          </p>
        </div>
      </div>
    </div>
  );
}

interface ChecklistItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  positive: boolean;
  color: string;
}

function ChecklistItem({ icon, label, value, sub, positive, color }: ChecklistItemProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/60 shadow-sm flex items-start gap-2.5">
      <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
        {positive ? (
          <CheckCircle2 size={18} style={{ color }} />
        ) : (
          <XCircle size={18} style={{ color: '#ef4444' }} />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1">
          <span style={{ color }}>{icon}</span>
          {label}
        </p>
        <p className="text-base font-bold leading-tight mt-0.5" style={{ color }}>{value}</p>
        <p className="text-[11px] text-gray-500 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

function generateRecommendation(
  results: CalculationResults,
  inputs: CalculatorInputs,
  productName: string,
  countryName: string,
  _materialName: string
): Recommendation {
  const { hasPositiveBusinessCase, hasValidPayback, paybackYears, roiPercent, annualCostSavings, lifetimeCostSavings, sustainabilityGrade, co2ReductionPct, energyReductionPct } = results;
  const grade = sustainabilityGrade;

  if (!hasPositiveBusinessCase) {
    return {
      light: 'red',
      icon: <XCircle size={28} />,
      statusLabel: 'No Business Case',
      text: `No positive business case based on the current assumptions. Switching to ${productName} (${inputs.quantity} units) in ${countryName} does not yield operational cost savings — the betaburka solution consumes similar or more power than the existing setup. Consider reviewing product selection, quantity, or operating parameters. The sustainability rating is Grade ${grade}.`,
      borderColor: 'border-red-300',
      bgColor: 'bg-red-50/60',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      accentBar: 'bg-red-500',
      badgeBg: 'bg-red-100',
      badgeText: 'text-red-700',
    };
  }

  if (!hasValidPayback) {
    return {
      light: 'red',
      icon: <XCircle size={28} />,
      statusLabel: 'Weak Business Case',
      text: `Although annual savings of ${formatCurrency(annualCostSavings)} are positive, the estimated payback period of ${formatNumber(paybackYears, 1)} years exceeds the expected product lifetime of ${inputs.lifetime} years and therefore the investment may not be financially justified under the current assumptions. The ${productName} configuration in ${countryName} delivers ${formatNumber(energyReductionPct, 1)}% energy reduction and ${formatNumber(co2ReductionPct, 1)}% CO₂ reduction, with a sustainability grade of ${grade}. Consider reducing investment cost, increasing units, or extending the product lifetime to achieve payback within the operational horizon.`,
      borderColor: 'border-red-300',
      bgColor: 'bg-red-50/60',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      accentBar: 'bg-red-500',
      badgeBg: 'bg-red-100',
      badgeText: 'text-red-700',
    };
  }

  const isGreen = paybackYears < 3 && roiPercent > 100;
  const isYellow = !isGreen && (paybackYears <= 5 || (roiPercent >= 25 && roiPercent <= 100));

  if (isGreen) {
    return {
      light: 'green',
      icon: <CheckCircle2 size={28} />,
      statusLabel: 'Strong Business Case',
      text: `This betaburka solution provides a strong business case with significant sustainability benefits and a short payback period. Switching to ${productName} (${inputs.quantity} units) in ${countryName} delivers ${formatCurrency(annualCostSavings)} in annual savings and ${formatCurrency(lifetimeCostSavings)} over ${inputs.lifetime} years. Payback in ${formatNumber(paybackYears, 1)} years with ${formatNumber(roiPercent, 0)}% ROI. Energy use drops by ${formatNumber(energyReductionPct, 1)}% and CO₂ emissions by ${formatNumber(co2ReductionPct, 1)}% annually. Sustainability grade: ${grade}.`,
      borderColor: 'border-eco-300',
      bgColor: 'bg-eco-50/60',
      iconBg: 'bg-eco-100',
      iconColor: 'text-eco-600',
      accentBar: 'bg-eco-500',
      badgeBg: 'bg-eco-100',
      badgeText: 'text-eco-700',
    };
  }

  if (isYellow) {
    return {
      light: 'yellow',
      icon: <AlertTriangle size={28} />,
      statusLabel: 'Moderate Business Case',
      text: `This betaburka solution offers a moderate business case. The ${productName} configuration in ${countryName} achieves ${formatCurrency(annualCostSavings)} in annual savings with payback in ${formatNumber(paybackYears, 1)} years and ${formatNumber(roiPercent, 0)}% ROI over ${inputs.lifetime} years. The payback period is within an acceptable range but requires capital commitment. Sustainability benefits include Grade ${grade} with ${formatNumber(co2ReductionPct, 1)}% CO₂ reduction. Recommendation: Proceed if capital is available and sustainability targets are a priority.`,
      borderColor: 'border-amber-300',
      bgColor: 'bg-amber-50/60',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      accentBar: 'bg-amber-500',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-700',
    };
  }

  return {
    light: 'red',
    icon: <XCircle size={28} />,
    statusLabel: 'Weak Business Case',
    text: `This betaburka solution presents a weak business case under current assumptions. The ${productName} investment of ${formatCurrency(inputs.investmentCost)} in ${countryName} has a payback period of ${formatNumber(paybackYears, 1)} years with only ${formatNumber(roiPercent, 0)}% ROI over ${inputs.lifetime} years. Annual savings of ${formatCurrency(annualCostSavings)} are positive but insufficient to justify the investment within the product lifetime. Consider reducing investment cost, increasing units, or selecting a more efficient product. Sustainability rating: Grade ${grade} with ${formatNumber(co2ReductionPct, 1)}% CO₂ reduction.`,
    borderColor: 'border-red-300',
    bgColor: 'bg-red-50/60',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    accentBar: 'bg-red-500',
    badgeBg: 'bg-red-100',
    badgeText: 'text-red-700',
  };
}
