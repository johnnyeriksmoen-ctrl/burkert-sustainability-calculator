export interface ProductType {
  id: string;
  name: string;
  category: string;
  defaultPower: number;
  defaultHours: number;
  defaultLifetime: number;
  defaultWeight: number;
  defaultMaterial: string;
  defaultExistingPower: number;
  icon: string;
}

export const PRODUCTS: ProductType[] = [
  { id: 'solenoid-valve', name: 'Solenoid Valve', category: 'Valves', defaultPower: 12, defaultHours: 8760, defaultLifetime: 10, defaultWeight: 0.5, defaultMaterial: 'stainless-steel', defaultExistingPower: 20, icon: 'valve' },
  { id: 'process-valve', name: 'Process Valve', category: 'Valves', defaultPower: 24, defaultHours: 8760, defaultLifetime: 15, defaultWeight: 3.5, defaultMaterial: 'stainless-steel', defaultExistingPower: 40, icon: 'valve' },
  { id: 'pneumatic-actuator', name: 'Pneumatic Actuator', category: 'Actuators', defaultPower: 30, defaultHours: 8000, defaultLifetime: 12, defaultWeight: 5.0, defaultMaterial: 'aluminium', defaultExistingPower: 55, icon: 'actuator' },
  { id: 'flow-meter', name: 'Flow Meter', category: 'Sensors', defaultPower: 5, defaultHours: 8760, defaultLifetime: 10, defaultWeight: 1.2, defaultMaterial: 'stainless-steel', defaultExistingPower: 12, icon: 'sensor' },
  { id: 'pressure-transmitter', name: 'Pressure Transmitter', category: 'Sensors', defaultPower: 3, defaultHours: 8760, defaultLifetime: 10, defaultWeight: 0.3, defaultMaterial: 'stainless-steel', defaultExistingPower: 8, icon: 'sensor' },
  { id: 'temperature-sensor', name: 'Temperature Sensor', category: 'Sensors', defaultPower: 2, defaultHours: 8760, defaultLifetime: 12, defaultWeight: 0.2, defaultMaterial: 'stainless-steel', defaultExistingPower: 6, icon: 'sensor' },
  { id: 'ph-sensor', name: 'pH Sensor', category: 'Analytics', defaultPower: 4, defaultHours: 8760, defaultLifetime: 8, defaultWeight: 0.15, defaultMaterial: 'plastic', defaultExistingPower: 10, icon: 'sensor' },
  { id: 'controller', name: 'Process Controller', category: 'Controllers', defaultPower: 15, defaultHours: 8760, defaultLifetime: 12, defaultWeight: 2.0, defaultMaterial: 'aluminium', defaultExistingPower: 30, icon: 'controller' },
  { id: 'bus-node', name: 'Fieldbus Node', category: 'Networking', defaultPower: 8, defaultHours: 8760, defaultLifetime: 10, defaultWeight: 0.8, defaultMaterial: 'aluminium', defaultExistingPower: 18, icon: 'controller' },
  { id: 'air-cannon', name: 'Air Cannon System', category: 'Cleaning', defaultPower: 50, defaultHours: 2000, defaultLifetime: 15, defaultWeight: 8.0, defaultMaterial: 'aluminium', defaultExistingPower: 80, icon: 'actuator' },
];

export interface MaterialType {
  id: string;
  name: string;
  factor: number;
  recyclability: number;
}

export const MATERIALS: MaterialType[] = [
  { id: 'stainless-steel', name: 'Stainless Steel', factor: 6.15, recyclability: 90 },
  { id: 'aluminium', name: 'Aluminium', factor: 8.10, recyclability: 95 },
  { id: 'brass', name: 'Brass', factor: 4.50, recyclability: 85 },
  { id: 'plastic', name: 'Plastic', factor: 3.20, recyclability: 40 },
];

export function getMaterial(id: string): MaterialType {
  return MATERIALS.find((m) => m.id === id) || MATERIALS[0];
}

export interface CountryType {
  id: string;
  name: string;
  flag: string;
  co2Factor: number;
  defaultPrice: number;
}

export const COUNTRIES: CountryType[] = [
  { id: 'norway', name: 'Norway', flag: 'NO', co2Factor: 0.024, defaultPrice: 0.15 },
  { id: 'sweden', name: 'Sweden', flag: 'SE', co2Factor: 0.041, defaultPrice: 0.18 },
  { id: 'germany', name: 'Germany', flag: 'DE', co2Factor: 0.380, defaultPrice: 0.35 },
  { id: 'denmark', name: 'Denmark', flag: 'DK', co2Factor: 0.170, defaultPrice: 0.28 },
  { id: 'finland', name: 'Finland', flag: 'FI', co2Factor: 0.070, defaultPrice: 0.20 },
  { id: 'eu-average', name: 'EU Average', flag: 'EU', co2Factor: 0.421, defaultPrice: 0.30 },
];

export function getCountry(id: string): CountryType {
  return COUNTRIES.find((c) => c.id === id) || COUNTRIES[5];
}

export interface CustomerInfo {
  customerName: string;
  projectName: string;
  salesEngineer: string;
  reportNotes: string;
}

export const EMPTY_CUSTOMER: CustomerInfo = {
  customerName: '',
  projectName: '',
  salesEngineer: '',
  reportNotes: '',
};

export interface CalculatorInputs {
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
}

export interface CalculationResults {
  annualEnergyPerUnit: number;
  annualEnergyTotal: number;
  lifetimeEnergyTotal: number;
  annualCO2: number;
  lifetimeCO2: number;
  annualCost: number;
  lifetimeCost: number;
  embodiedCarbon: number;
  lifetimeCarbon: number;
  sustainabilityScore: number;
  sustainabilityGrade: string;
  scoreLabel: string;
  scoreColor: string;
  existingAnnualEnergy: number;
  annualEnergySavings: number;
  annualCO2Reduction: number;
  annualCostSavings: number;
  existingAnnualCO2: number;
  existingAnnualCost: number;
  energyReductionPct: number;
  co2ReductionPct: number;
  costReductionPct: number;
  lifetimeCostSavings: number;
  paybackYears: number;
  roiPercent: number;
  hasPositiveBusinessCase: boolean;
  hasValidPayback: boolean;
}

export function calculateResults(inputs: CalculatorInputs): CalculationResults {
  const { quantity, powerConsumption, operatingHours, lifetime, electricityPrice, material, weight, country, existingPowerConsumption, investmentCost } = inputs;

  const co2Factor = getCountry(country).co2Factor;

  const annualEnergyPerUnit = (powerConsumption * operatingHours) / 1000;
  const annualEnergyTotal = annualEnergyPerUnit * quantity;
  const lifetimeEnergyTotal = annualEnergyTotal * lifetime;

  const annualCO2 = annualEnergyTotal * co2Factor;
  const lifetimeCO2 = lifetimeEnergyTotal * co2Factor;

  const annualCost = annualEnergyTotal * electricityPrice;
  const lifetimeCost = annualEnergyTotal * electricityPrice * lifetime;

  const mat = getMaterial(material);
  const embodiedCarbon = weight * mat.factor * quantity;
  const lifetimeCarbon = lifetimeCO2 + embodiedCarbon;

  const existingAnnualEnergy = (existingPowerConsumption * operatingHours) / 1000 * quantity;
  const existingAnnualCO2 = existingAnnualEnergy * co2Factor;
  const existingAnnualCost = existingAnnualEnergy * electricityPrice;

  const annualEnergySavings = existingAnnualEnergy - annualEnergyTotal;
  const annualCO2Reduction = existingAnnualCO2 - annualCO2;
  const annualCostSavings = existingAnnualCost - annualCost;

  const energyReductionPct = existingAnnualEnergy > 0 ? (annualEnergySavings / existingAnnualEnergy) * 100 : 0;
  const co2ReductionPct = existingAnnualCO2 > 0 ? (annualCO2Reduction / existingAnnualCO2) * 100 : 0;
  const costReductionPct = existingAnnualCost > 0 ? (annualCostSavings / existingAnnualCost) * 100 : 0;

  const hasPositiveBusinessCase = annualCostSavings > 0;
  const lifetimeCostSavings = hasPositiveBusinessCase ? annualCostSavings * lifetime : 0;
  const paybackYears = hasPositiveBusinessCase ? investmentCost / annualCostSavings : 0;
  const validPayback = checkHasValidPayback(paybackYears, lifetime, hasPositiveBusinessCase);
  const roiPercent = hasPositiveBusinessCase && investmentCost > 0
    ? ((lifetimeCostSavings - investmentCost) / investmentCost) * 100
    : 0;

  const score = computeScore(
    powerConsumption, operatingHours, weight, mat.factor, mat.recyclability,
    quantity, lifetime, co2Factor, lifetimeCarbon
  );

  const { label, color } = scoreInfo(score);
  const grade = scoreToGrade(score);

  return {
    annualEnergyPerUnit,
    annualEnergyTotal,
    lifetimeEnergyTotal,
    annualCO2,
    lifetimeCO2,
    annualCost,
    lifetimeCost,
    embodiedCarbon,
    lifetimeCarbon,
    sustainabilityScore: score,
    sustainabilityGrade: grade,
    scoreLabel: label,
    scoreColor: color,
    existingAnnualEnergy,
    annualEnergySavings,
    annualCO2Reduction,
    annualCostSavings,
    existingAnnualCO2,
    existingAnnualCost,
    energyReductionPct,
    co2ReductionPct,
    costReductionPct,
    lifetimeCostSavings,
    paybackYears,
    roiPercent,
    hasPositiveBusinessCase,
    hasValidPayback: validPayback,
  };
}

function computeScore(
  power: number, hours: number, weight: number, materialFactor: number,
  recyclability: number, quantity: number, lifetime: number,
  co2Factor: number, lifetimeCarbon: number
): number {
  const annualEnergy = (power * hours) / 1000 * quantity;
  const annualCO2 = annualEnergy * co2Factor;
  const embodiedPerUnit = weight * materialFactor;

  const operationalScore = Math.max(0, 100 - power * 1.5 - (hours / 8760) * 20);
  const lifetimeCO2Score = Math.max(0, 100 - (lifetimeCarbon / 1000) * 20);
  const materialScore = Math.max(0, 100 - embodiedPerUnit * 3);
  const recyclabilityScore = recyclability;
  const lifetimeScore = Math.min(100, (lifetime / 15) * 100);

  return Math.round(
    operationalScore * 0.35 +
    lifetimeCO2Score * 0.25 +
    materialScore * 0.20 +
    recyclabilityScore * 0.10 +
    lifetimeScore * 0.10
  );
}

function scoreToGrade(score: number): string {
  if (score >= 80) return 'A';
  if (score >= 60) return 'B';
  if (score >= 40) return 'C';
  if (score >= 20) return 'D';
  return 'E';
}

function scoreInfo(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'Excellent', color: '#10b981' };
  if (score >= 60) return { label: 'Good', color: '#34d399' };
  if (score >= 40) return { label: 'Fair', color: '#f59e0b' };
  if (score >= 20) return { label: 'Poor', color: '#f97316' };
  return { label: 'High Impact', color: '#ef4444' };
}

export function formatNumber(value: number, decimals = 1): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function formatEnergy(kwh: number): string {
  if (kwh >= 1000000) return `${formatNumber(kwh / 1000000, 2)} GWh`;
  if (kwh >= 1000) return `${formatNumber(kwh / 1000, 2)} MWh`;
  return `${formatNumber(kwh, 0)} kWh`;
}

export function formatCO2(tons: number): string {
  if (tons >= 1000) return `${formatNumber(tons / 1000, 2)} kt`;
  if (tons >= 1) return `${formatNumber(tons, 1)} t`;
  return `${formatNumber(tons * 1000, 0)} kg`;
}

export function formatPct(value: number): string {
  return `${value >= 0 ? '' : ''}${value.toFixed(1)}%`;
}

export interface Equivalency {
  value: string;
  label: string;
  icon: string;
}

export function getEquivalencies(lifetimeCarbon: number): Equivalency[] {
  const trees = Math.round(lifetimeCarbon / 21);
  const carKm = Math.round(lifetimeCarbon / 0.12);
  const flights = Math.round(lifetimeCarbon / 0.25);
  const homeDays = Math.round(lifetimeCarbon / 8);

  return [
    { value: `${trees.toLocaleString()}`, label: 'Trees needed (1 year offset)', icon: 'tree' },
    { value: `${carKm.toLocaleString()} km`, label: 'Equivalent car emissions', icon: 'car' },
    { value: `${flights.toLocaleString()}`, label: 'Short-haul flights (500 km)', icon: 'plane' },
    { value: `${homeDays.toLocaleString()}`, label: 'Days of household energy', icon: 'home' },
  ];
}

export interface YearlyData {
  year: number;
  energy: number;
  co2: number;
  cost: number;
}

export function getYearlyData(inputs: CalculatorInputs, results: CalculationResults): YearlyData[] {
  return Array.from({ length: inputs.lifetime }, (_, i) => ({
    year: i + 1,
    energy: results.annualEnergyTotal * (i + 1),
    co2: results.annualCO2 * (i + 1),
    cost: results.annualCost * (i + 1),
  }));
}

export function checkHasValidPayback(
  paybackYears: number,
  lifetime: number,
  hasPositiveBusinessCase: boolean
): boolean {
  return hasPositiveBusinessCase && paybackYears > 0 && paybackYears <= lifetime;
}
