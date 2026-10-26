import { useEffect, useState, useRef, useCallback } from 'react';
import { Zap, Cloud, Euro, Calendar, Recycle, Atom, TrendingDown, Download, Loader2 } from 'lucide-react';
import {
  type CalculationResults,
  type CalculatorInputs,
  type CustomerInfo,
  formatNumber,
  formatCurrency,
  formatEnergy,
  formatCO2,
} from '@/data/calculator';
import { generatePDFReport } from '@/data/pdfReport';
import ScoreGauge from './ScoreGauge';
import PaybackChart from './PaybackChart';
import EquivalencyCard from './EquivalencyCard';
import ImpactSummary from './ImpactSummary';
import FinancialAnalysis from './FinancialAnalysis';
import ExecutiveSummary from './ExecutiveSummary';

interface ResultsPanelProps {
  results: CalculationResults;
  inputs: CalculatorInputs;
  customer: CustomerInfo;
}

export default function ResultsPanel({ results, inputs, customer }: ResultsPanelProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);

  const handleGeneratePDF = useCallback(async () => {
    setGenerating(true);
    try {
      let chartImage: string | undefined;
      const chartEl = document.getElementById('energy-chart-container');
      if (chartEl) {
        const { toPng } = await import('html-to-image');
        chartImage = await toPng(chartEl, {
          quality: 0.9,
          pixelRatio: 2,
          backgroundColor: '#ffffff',
        });
      }
      generatePDFReport(results, inputs, customer, chartImage);
    } catch {
      generatePDFReport(results, inputs, customer);
    } finally {
      setGenerating(false);
    }
  }, [results, inputs, customer]);

  return (
    <div className="space-y-6">
      {/* Executive Summary — most prominent element */}
      <ExecutiveSummary results={results} inputs={inputs} />

      {/* PDF Export button */}
      <div className="flex justify-end">
        <button
          onClick={handleGeneratePDF}
          disabled={generating}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-betaburka-600 text-white rounded-lg font-semibold text-sm hover:bg-betaburka-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {generating ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download size={18} />
              Generate PDF Report
            </>
          )}
        </button>
      </div>

      {/* Financial Analysis — directly below executive summary */}
      <FinancialAnalysis results={results} inputs={inputs} />

      {/* Score gauge + summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ScoreGauge
          score={results.sustainabilityScore}
          grade={results.sustainabilityGrade}
          label={results.scoreLabel}
          color={results.scoreColor}
        />

        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <MetricCard
            icon={<Zap size={20} />}
            label="Annual Energy"
            value={formatEnergy(results.annualEnergyTotal)}
            sublabel={`${formatNumber(results.annualEnergyPerUnit, 1)} kWh/unit`}
            color="betaburka"
          />
          <MetricCard
            icon={<Calendar size={20} />}
            label="Lifetime Energy"
            value={formatEnergy(results.lifetimeEnergyTotal)}
            sublabel={`${inputs.lifetime} years total`}
            color="betaburka"
          />
          <MetricCard
            icon={<Euro size={20} />}
            label="Annual Cost"
            value={formatCurrency(results.annualCost)}
            sublabel="operating cost/year"
            color="cost"
          />
          <MetricCard
            icon={<Atom size={20} />}
            label="Embodied Carbon"
            value={formatCO2(results.embodiedCarbon)}
            sublabel="manufacturing CO₂"
            color="embodied"
          />
          <MetricCard
            icon={<Recycle size={20} />}
            label="Lifetime Carbon"
            value={formatCO2(results.lifetimeCarbon)}
            sublabel="embodied + operational"
            color="carbon"
          />
          <MetricCard
            icon={<Cloud size={20} />}
            label="Annual CO₂"
            value={formatCO2(results.annualCO2)}
            sublabel="emissions per year"
            color="carbon"
          />
        </div>
      </div>

      {/* Savings KPI cards */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
          <TrendingDown size={16} className="text-eco-500" />
          Savings vs Existing Solution
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SavingsCard
            icon={<Zap size={18} />}
            label="Annual Energy Savings"
            value={formatEnergy(results.annualEnergySavings)}
            pct={results.energyReductionPct}
          />
          <SavingsCard
            icon={<Cloud size={18} />}
            label="Annual CO₂ Reduction"
            value={formatCO2(results.annualCO2Reduction)}
            pct={results.co2ReductionPct}
          />
          <SavingsCard
            icon={<Euro size={18} />}
            label="Annual Cost Savings"
            value={formatCurrency(results.annualCostSavings)}
            pct={results.costReductionPct}
          />
        </div>
      </div>

      {/* Impact summary table */}
      <ImpactSummary results={results} />

      {/* Investment & Payback chart */}
      <div id="energy-chart-container" ref={chartRef}>
        <PaybackChart results={results} inputs={inputs} />
      </div>

      {/* Equivalencies */}
      <EquivalencyCard lifetimeCarbon={results.lifetimeCarbon} />
    </div>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel: string;
  color: 'betaburka' | 'carbon' | 'cost' | 'embodied';
}

function MetricCard({ icon, label, value, sublabel, color }: MetricCardProps) {
  const [animatedValue, setAnimatedValue] = useState('');

  useEffect(() => {
    setAnimatedValue('');
    const timer = setTimeout(() => setAnimatedValue(value), 50);
    return () => clearTimeout(timer);
  }, [value]);

  const colorMap = {
    betaburka: { bg: 'bg-betaburka-50', text: 'text-betaburka-700', border: 'border-betaburka-100' },
    carbon: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
    cost: { bg: 'bg-eco-50', text: 'text-eco-700', border: 'border-eco-100' },
    embodied: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' },
  };
  const c = colorMap[color];

  return (
    <div className={`bg-white rounded-xl border ${c.border} p-5 hover:shadow-md transition-shadow animate-grow`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${c.bg} ${c.text} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900 transition-opacity" style={{ opacity: animatedValue ? 1 : 0 }}>
        {animatedValue || value}
      </p>
      <p className="text-xs text-gray-400 mt-1">{sublabel}</p>
    </div>
  );
}

interface SavingsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  pct: number;
}

function SavingsCard({ icon, label, value, pct }: SavingsCardProps) {
  return (
    <div className="bg-gradient-to-br from-eco-50 to-white rounded-xl border border-eco-100 p-5 hover:shadow-md transition-shadow animate-grow">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-eco-100 text-eco-600 flex items-center justify-center">
          {icon}
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-bold text-eco-600 bg-eco-100 px-2.5 py-1 rounded-full">
          <TrendingDown size={12} />
          {formatNumber(pct, 1)}%
        </span>
      </div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-bold text-eco-700">{value}</p>
    </div>
  );
}
