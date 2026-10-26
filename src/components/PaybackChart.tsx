import { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ReferenceLine, ResponsiveContainer,
} from 'recharts';
import { TrendingUp, CheckCircle2 } from 'lucide-react';
import { type CalculationResults, type CalculatorInputs, formatCurrency, formatNumber } from '@/data/calculator';

interface PaybackChartProps {
  results: CalculationResults;
  inputs: CalculatorInputs;
}

interface ChartDatum {
  year: number;
  cumulativeSavings: number;
  investment: number;
}

interface TooltipPayloadItem {
  dataKey?: string | number | ((obj: unknown) => unknown);
  value?: number | string | Array<number | string>;
  color?: string;
  name?: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: readonly unknown[];
  label?: number | string;
}

export default function PaybackChart({ results, inputs }: PaybackChartProps) {
  const { annualCostSavings, hasPositiveBusinessCase, hasValidPayback, paybackYears } = results;
  const investmentCost = inputs.investmentCost;
  const lifetime = inputs.lifetime;

  const data = useMemo<ChartDatum[]>(() => {
    return Array.from({ length: lifetime }, (_, i) => {
      const year = i + 1;
      return {
        year,
        cumulativeSavings: hasPositiveBusinessCase ? annualCostSavings * year : 0,
        investment: investmentCost,
      };
    });
  }, [annualCostSavings, investmentCost, lifetime, hasPositiveBusinessCase]);

  const tickFormatter = (v: number) => formatCurrency(v).replace(/\.\d+/, '');
  const hasData = hasPositiveBusinessCase && annualCostSavings > 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp size={20} className="text-burkert-600" />
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Investment & Payback Analysis
          </h3>
        </div>

        {hasValidPayback && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-eco-700 bg-eco-50 border border-eco-200">
            <CheckCircle2 size={14} />
            Payback in {formatNumber(paybackYears, 1)} years
          </div>
        )}
      </div>

      {hasData ? (
        <>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                  label={{ value: 'Year', position: 'insideBottom', offset: -4, style: { fontSize: 11, fill: '#9ca3af' } }}
                />
                <YAxis
                  tickFormatter={tickFormatter}
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                  width={70}
                />
                <Tooltip
                  content={({ active, payload, label }: TooltipProps) => {
                    if (!active || !payload || payload.length === 0) return null;
                    const yearLabel = Number(label ?? 0);
                    return (
                      <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
                        <div className="font-semibold mb-1">Year {yearLabel}</div>
                        {payload.map((item, idx) => {
                          const entry = item as TooltipPayloadItem;
                          return (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                              <span className="text-gray-300">{entry.name}:</span>
                              <span className="font-semibold">{formatCurrency(Number(entry.value))}</span>
                            </div>
                          );
                        })}
                        {hasValidPayback && yearLabel >= Math.ceil(paybackYears) && (
                          <div className="mt-1 text-eco-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 size={11} /> Investment recovered
                          </div>
                        )}
                      </div>
                    );
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                  iconType="line"
                />
                {hasValidPayback && (
                  <ReferenceLine
                    x={Math.ceil(paybackYears)}
                    stroke="#10b981"
                    strokeDasharray="5 4"
                    strokeWidth={1.5}
                    label={{
                      value: 'Payback',
                      position: 'top',
                      fill: '#10b981',
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="investment"
                  name="Investment Cost"
                  stroke="#006bb3"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: '#006bb3' }}
                />
                <Line
                  type="monotone"
                  dataKey="cumulativeSavings"
                  name="Cumulative Savings"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-5 border-t border-gray-100">
            <ChartStat label="Investment Cost" value={formatCurrency(investmentCost)} color="#006bb3" />
            <ChartStat label="Annual Savings" value={hasPositiveBusinessCase ? formatCurrency(annualCostSavings) : 'N/A'} color="#10b981" />
            <ChartStat
              label="Payback Period"
              value={hasValidPayback ? `${formatNumber(paybackYears, 1)} years` : 'N/A'}
              sub={hasValidPayback ? 'investment recovered' : hasPositiveBusinessCase ? 'exceeds product lifetime' : 'no savings'}
              color={hasValidPayback ? '#10b981' : '#ef4444'}
            />
          </div>
        </>
      ) : (
        <div className="h-72 flex flex-col items-center justify-center text-center px-6">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <TrendingUp size={24} className="text-gray-400" />
          </div>
          <p className="text-sm font-semibold text-gray-600 mb-1">No payback analysis available</p>
          <p className="text-xs text-gray-400 max-w-xs">
            This configuration does not produce positive annual cost savings. Adjust the parameters to see when the investment pays for itself.
          </p>
        </div>
      )}
    </div>
  );
}

interface ChartStatProps {
  label: string;
  value: string;
  sub?: string;
  color: string;
}

function ChartStat({ label, value, sub, color }: ChartStatProps) {
  return (
    <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="text-lg font-bold mt-0.5" style={{ color }}>{value}</p>
      {sub && <p className="text-[11px] text-gray-500 mt-0.5">{sub}</p>}
    </div>
  );
}
