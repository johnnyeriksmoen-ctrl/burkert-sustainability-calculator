import { useState, useMemo } from 'react';
import { Leaf, Gauge, Shield, Recycle, Factory, Layers, Globe, TrendingDown } from 'lucide-react';
import InputPanel from '@/components/InputPanel';
import ResultsPanel from '@/components/ResultsPanel';
import { PRODUCTS, MATERIALS, COUNTRIES, calculateResults, type CalculatorInputs, type CustomerInfo, EMPTY_CUSTOMER } from '@/data/calculator';

function App() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    productId: 'solenoid-valve',
    quantity: 10,
    powerConsumption: 12,
    operatingHours: 8760,
    lifetime: 10,
    electricityPrice: 0.30,
    material: 'stainless-steel',
    weight: 0.5,
    country: 'eu-average',
    existingPowerConsumption: 20,
    investmentCost: 5000,
  });

  const [customer, setCustomer] = useState<CustomerInfo>(EMPTY_CUSTOMER);

  const results = useMemo(() => calculateResults(inputs), [inputs]);

  const handleChange = (field: string, value: number | string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleCustomerChange = (field: string, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  };

  const selectedProduct = PRODUCTS.find((p) => p.id === inputs.productId) || PRODUCTS[0];
  const selectedMaterial = MATERIALS.find((m) => m.id === inputs.material) || MATERIALS[0];
  const selectedCountry = COUNTRIES.find((c) => c.id === inputs.country) || COUNTRIES[5];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-burkert-800 sticky top-0 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Factory size={22} className="text-burkert-700" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg leading-tight">BetaBurka</h1>
                <p className="text-burkert-200 text-xs leading-tight">Sustainability Value Calculator</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <HeaderStat icon={<Leaf size={16} />} label="Grade" value={results.sustainabilityGrade} />
              <HeaderStat icon={<Recycle size={16} />} label="Lifetime Carbon" value={formatTons(results.lifetimeCarbon)} />
              <HeaderStat icon={<TrendingDown size={16} />} label="CO₂ Reduction" value={`${results.co2ReductionPct.toFixed(1)}%`} />
            </div>
          </div>
        </div>
      </header>

      {/* Sub-header banner */}
      <div className="bg-gradient-to-r from-burkert-700 to-burkert-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-burkert-50 text-xs">
            <span className="flex items-center gap-1.5">
              <Gauge size={14} /> {selectedProduct.name}
            </span>
            <span className="flex items-center gap-1.5">
              <Factory size={14} /> {inputs.quantity} units
            </span>
            <span className="flex items-center gap-1.5">
              <Layers size={14} /> {selectedMaterial.name}
            </span>
            <span className="flex items-center gap-1.5">
              <Globe size={14} /> {selectedCountry.name}
            </span>
            <span className="flex items-center gap-1.5">
              <Leaf size={14} /> Grade {results.sustainabilityGrade} — {results.scoreLabel}
            </span>
            <span className="flex items-center gap-1.5">
              <Shield size={14} /> {inputs.lifetime} year lifecycle
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input sidebar */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="lg:sticky lg:top-24">
              <InputPanel
                productId={inputs.productId}
                quantity={inputs.quantity}
                powerConsumption={inputs.powerConsumption}
                operatingHours={inputs.operatingHours}
                lifetime={inputs.lifetime}
                electricityPrice={inputs.electricityPrice}
                material={inputs.material}
                weight={inputs.weight}
                country={inputs.country}
                existingPowerConsumption={inputs.existingPowerConsumption}
                investmentCost={inputs.investmentCost}
                customer={customer}
                onCustomerChange={handleCustomerChange}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-8 xl:col-span-9">
            <ResultsPanel results={results} inputs={inputs} customer={customer} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-burkert-900 text-burkert-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Factory size={18} className="text-burkert-400" />
              <span className="text-sm font-medium">BetaBurka Fluid Control Systems</span>
            </div>
            <p className="text-xs text-burkert-300">
              CO₂ factor: {selectedCountry.co2Factor} kg/kWh ({selectedCountry.name}) · Embodied carbon + recyclability per material · Estimates are indicative only
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function formatTons(tons: number): string {
  if (tons >= 1000) return `${(tons / 1000).toFixed(2)} kt`;
  if (tons >= 1) return `${tons.toFixed(1)} t`;
  return `${(tons * 1000).toFixed(0)} kg`;
}

function HeaderStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-burkert-300">{icon}</span>
      <div className="leading-tight">
        <p className="text-[10px] text-burkert-300 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}

export default App;
