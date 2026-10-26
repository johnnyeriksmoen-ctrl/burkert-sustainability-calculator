import { useState } from 'react';
import { ChevronDown, Zap, Clock, Calendar, Euro, Package, Weight, Layers, Globe, GitCompare, Wallet, User, FolderOpen, FileText } from 'lucide-react';
import { PRODUCTS, MATERIALS, COUNTRIES, type CustomerInfo } from '@/data/calculator';

interface InputPanelProps {
  productId: string;
  quantity: number;
  powerConsumption: number;
  operatingHours: number;
  lifetime: number;
  electricityPrice: number;
  material: string;
  weight: number;
  country: string;
  existingPowerConsumption: number;
  investmentCost: number;
  customer: CustomerInfo;
  onCustomerChange: (field: string, value: string) => void;
  onChange: (field: string, value: number | string) => void;
}

export default function InputPanel({
  productId,
  quantity,
  powerConsumption,
  operatingHours,
  lifetime,
  electricityPrice,
  material,
  weight,
  country,
  existingPowerConsumption,
  investmentCost,
  customer,
  onCustomerChange,
  onChange,
}: InputPanelProps) {
  const [productMenuOpen, setProductMenuOpen] = useState(false);
  const selectedProduct = PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];

  const groupedProducts = PRODUCTS.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {} as Record<string, typeof PRODUCTS>);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-burkert-600 px-6 py-4">
        <h2 className="text-white font-semibold text-lg flex items-center gap-2">
          <Package size={20} />
          Configuration
        </h2>
        <p className="text-burkert-100 text-sm mt-0.5">Enter your product and operating parameters</p>
      </div>

      <div className="p-6 space-y-5">
        {/* Customer Information */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-burkert-600 uppercase tracking-wide flex items-center gap-1.5">
              <FileText size={14} /> Report Information
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <TextInput
            icon={<User size={16} />}
            label="Customer Name"
            placeholder="Company / customer"
            value={customer.customerName}
            onChange={(v) => onCustomerChange('customerName', v)}
          />
          <TextInput
            icon={<FolderOpen size={16} />}
            label="Project Name"
            placeholder="Project reference"
            value={customer.projectName}
            onChange={(v) => onCustomerChange('projectName', v)}
          />
          <TextInput
            icon={<User size={16} />}
            label="Sales Engineer"
            placeholder="Your name"
            value={customer.salesEngineer}
            onChange={(v) => onCustomerChange('salesEngineer', v)}
          />
          <TextAreaInput
            icon={<FileText size={16} />}
            label="Report Notes"
            placeholder="Optional notes for the report..."
            value={customer.reportNotes}
            onChange={(v) => onCustomerChange('reportNotes', v)}
          />
        </div>

        <div className="border-t border-gray-100 pt-4" />

        {/* Product selector */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
            Product Type
          </label>
          <div className="relative">
            <button
              onClick={() => setProductMenuOpen(!productMenuOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-left hover:border-burkert-300 transition-colors"
            >
              <span className="font-medium text-gray-800">{selectedProduct.name}</span>
              <ChevronDown
                size={18}
                className={`text-gray-400 transition-transform ${productMenuOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {productMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setProductMenuOpen(false)} />
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-72 overflow-y-auto animate-slide-up">
                  {Object.entries(groupedProducts).map(([category, products]) => (
                    <div key={category}>
                      <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase bg-gray-50">
                        {category}
                      </div>
                      {products.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            onChange('productId', p.id);
                            onChange('powerConsumption', p.defaultPower);
                            onChange('operatingHours', p.defaultHours);
                            onChange('lifetime', p.defaultLifetime);
                            onChange('weight', p.defaultWeight);
                            onChange('material', p.defaultMaterial);
                            onChange('existingPowerConsumption', p.defaultExistingPower);
                            setProductMenuOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 hover:bg-burkert-50 transition-colors ${
                            p.id === productId ? 'bg-burkert-50 text-burkert-700 font-medium' : 'text-gray-700'
                          }`}
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <NumberInput
          icon={<Package size={16} />}
          label="Quantity"
          unit="units"
          value={quantity}
          min={1}
          max={100000}
          onChange={(v) => onChange('quantity', v)}
        />

        {/* Country selector */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <span className="text-burkert-500"><Globe size={16} /></span>
            Country / Grid
          </label>
          <div className="grid grid-cols-3 gap-2">
            {COUNTRIES.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  onChange('country', c.id);
                  onChange('electricityPrice', c.defaultPrice);
                }}
                className={`px-2 py-2.5 rounded-lg text-xs font-medium transition-all border ${
                  country === c.id
                    ? 'bg-burkert-600 text-white border-burkert-600 shadow-sm'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-burkert-300'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Material selector */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <span className="text-burkert-500"><Layers size={16} /></span>
            Material
          </label>
          <div className="grid grid-cols-2 gap-2">
            {MATERIALS.map((m) => (
              <button
                key={m.id}
                onClick={() => onChange('material', m.id)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                  material === m.id
                    ? 'bg-burkert-600 text-white border-burkert-600 shadow-sm'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-burkert-300'
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Recyclability: {MATERIALS.find((m) => m.id === material)?.recyclability ?? 0}%
          </p>
        </div>

        <NumberInput
          icon={<Weight size={16} />}
          label="Product Weight"
          unit="kg"
          value={weight}
          min={0}
          max={1000}
          step={0.1}
          decimals={2}
          onChange={(v) => onChange('weight', v)}
        />

        <NumberInput
          icon={<Zap size={16} />}
          label="Power Consumption"
          unit="W"
          value={powerConsumption}
          min={0}
          max={10000}
          step={0.1}
          decimals={1}
          onChange={(v) => onChange('powerConsumption', v)}
        />

        <SliderInput
          icon={<Clock size={16} />}
          label="Operating Hours"
          unit="h/year"
          value={operatingHours}
          min={0}
          max={8760}
          step={100}
          onChange={(v) => onChange('operatingHours', v)}
        />

        <SliderInput
          icon={<Calendar size={16} />}
          label="Product Lifetime"
          unit="years"
          value={lifetime}
          min={1}
          max={30}
          step={1}
          onChange={(v) => onChange('lifetime', v)}
        />

        <NumberInput
          icon={<Euro size={16} />}
          label="Electricity Price"
          unit="€/kWh"
          value={electricityPrice}
          min={0}
          max={1}
          step={0.01}
          decimals={2}
          onChange={(v) => onChange('electricityPrice', v)}
        />

        {/* Price quick-select */}
        <div className="flex gap-2">
          {[0.25, 0.30, 0.35, 0.40].map((price) => (
            <button
              key={price}
              onClick={() => onChange('electricityPrice', price)}
              className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${
                electricityPrice === price
                  ? 'bg-burkert-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              €{price.toFixed(2)}
            </button>
          ))}
        </div>

        {/* Divider + Existing Solution Comparison */}
        <div className="pt-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs font-semibold text-burkert-600 uppercase tracking-wide flex items-center gap-1.5">
              <GitCompare size={14} /> Existing Solution
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <NumberInput
            icon={<Zap size={16} />}
            label="Existing Power Consumption"
            unit="W"
            value={existingPowerConsumption}
            min={0}
            max={10000}
            step={0.1}
            decimals={1}
            onChange={(v) => onChange('existingPowerConsumption', v)}
          />

          <NumberInput
            icon={<Wallet size={16} />}
            label="Investment Cost"
            unit="€"
            value={investmentCost}
            min={0}
            max={10000000}
            step={100}
            onChange={(v) => onChange('investmentCost', v)}
          />
        </div>
      </div>
    </div>
  );
}

interface TextInputProps {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}

function TextInput({ icon, label, placeholder, value, onChange }: TextInputProps) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
        <span className="text-burkert-500">{icon}</span>
        {label}
      </label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-medium text-sm focus:outline-none focus:border-burkert-400 focus:bg-white transition-colors"
      />
    </div>
  );
}

interface TextAreaInputProps {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}

function TextAreaInput({ icon, label, placeholder, value, onChange }: TextAreaInputProps) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
        <span className="text-burkert-500">{icon}</span>
        {label}
      </label>
      <textarea
        value={value}
        placeholder={placeholder}
        rows={2}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 text-sm focus:outline-none focus:border-burkert-400 focus:bg-white transition-colors resize-none"
      />
    </div>
  );
}

interface NumberInputProps {
  icon: React.ReactNode;
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  decimals?: number;
  onChange: (v: number) => void;
}

function NumberInput({ icon, label, unit, value, min, max, step = 1, decimals = 0, onChange }: NumberInputProps) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
        <span className="text-burkert-500">{icon}</span>
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            if (!isNaN(v)) onChange(v);
          }}
          className="w-full pl-4 pr-16 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-medium focus:outline-none focus:border-burkert-400 focus:bg-white transition-colors"
        />
        <span className="absolute right-4 text-sm text-gray-400 font-medium">{unit}</span>
      </div>
    </div>
  );
}

interface SliderInputProps {
  icon: React.ReactNode;
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}

function SliderInput({ icon, label, unit, value, min, max, step, onChange }: SliderInputProps) {
  const percentage = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
          <span className="text-burkert-500">{icon}</span>
          {label}
        </label>
        <span className="text-sm font-semibold text-burkert-700">
          {value.toLocaleString()} <span className="text-gray-400 font-normal">{unit}</span>
        </span>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #006bb3 0%, #006bb3 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
        }}
      />
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: white;
          border: 3px solid #006bb3;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: white;
          border: 3px solid #006bb3;
          border-radius: 50%;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
