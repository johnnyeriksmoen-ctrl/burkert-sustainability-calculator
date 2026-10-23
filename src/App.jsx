import { useMemo, useState } from 'react';

const productFamilies = [
  { label: 'Control valves', energyFactor: 1.0, efficiency: 0.95 },
  { label: 'Solenoid valves', energyFactor: 1.15, efficiency: 0.9 },
  { label: 'Flow meters', energyFactor: 0.9, efficiency: 1.05 },
  { label: 'Pumps', energyFactor: 1.25, efficiency: 0.8 },
  { label: 'Sensors', energyFactor: 0.82, efficiency: 1.12 },
  { label: 'Mixing systems', energyFactor: 1.35, efficiency: 0.75 },
];

const HOURS_PER_YEAR = 24 * 365;
const CARBON_INTENSITY_KG_PER_KWH = 0.43;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const formatNumber = (value, digits = 1) =>
  new Intl.NumberFormat('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);

const formatCompact = (value) => {
  if (value >= 1000) {
    return `${formatNumber(value / 1000, 1)} t`;
  }
  return `${formatNumber(value, 0)} kg`;
};

function App() {
  const [form, setForm] = useState({
    family: productFamilies[0].label,
    power: 120,
    lifetime: 10,
    quantity: 25,
  });

  const results = useMemo(() => {
    const selectedFamily =
      productFamilies.find((item) => item.label === form.family) ?? productFamilies[0];

    const power = Number(form.power) || 0;
    const lifetime = Number(form.lifetime) || 0;
    const quantity = Number(form.quantity) || 0;

    const annualEnergyKwh = ((power * HOURS_PER_YEAR * quantity) / 1000) * selectedFamily.energyFactor;
    const lifetimeEnergyKwh = annualEnergyKwh * lifetime;
    const estimatedCo2Kg = lifetimeEnergyKwh * CARBON_INTENSITY_KG_PER_KWH;
    const sustainabilityScore = clamp(
      100 - (lifetimeEnergyKwh / 12000) * (1 / selectedFamily.efficiency) * 6,
      0,
      100,
    );

    const scoreLabel =
      sustainabilityScore >= 80
        ? 'Excellent'
        : sustainabilityScore >= 60
          ? 'Good'
          : sustainabilityScore >= 40
            ? 'Moderate'
            : 'Needs attention';

    return {
      annualEnergyKwh,
      lifetimeEnergyKwh,
      estimatedCo2Kg,
      sustainabilityScore,
      scoreLabel,
      selectedFamily,
    };
  }, [form]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  return (
    <div className="page-shell">
      <div className="app-card">
        <header className="topbar">
          <div className="brand-group">
            <div className="brand-mark" aria-label="Burkert logo">
              B
            </div>
            <div>
              <p className="eyebrow">Burkert</p>
              <h1>Sustainability Calculator</h1>
            </div>
          </div>
          <div className="badge">Energy & CO₂ impact</div>
        </header>

        <div className="content-grid">
          <section className="panel form-panel">
            <div className="panel-header">
              <p className="mini-label">Configuration</p>
              <h2>Product details</h2>
            </div>

            <div className="field-group">
              <label htmlFor="family">Product family</label>
              <select id="family" name="family" value={form.family} onChange={handleChange}>
                {productFamilies.map((family) => (
                  <option key={family.label} value={family.label}>
                    {family.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label htmlFor="power">Power consumption (W)</label>
              <input
                id="power"
                name="power"
                type="number"
                min="0"
                step="1"
                value={form.power}
                onChange={handleChange}
              />
            </div>

            <div className="field-row">
              <div className="field-group">
                <label htmlFor="lifetime">Lifetime (years)</label>
                <input
                  id="lifetime"
                  name="lifetime"
                  type="number"
                  min="1"
                  step="1"
                  value={form.lifetime}
                  onChange={handleChange}
                />
              </div>

              <div className="field-group">
                <label htmlFor="quantity">Quantity</label>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  step="1"
                  value={form.quantity}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="feature-chip">
              <span className="chip-dot" />
              {results.selectedFamily.label} efficiency profile
            </div>
          </section>

          <section className="panel results-panel">
            <div className="summary-header">
              <div>
                <p className="mini-label alt">Estimated overall impact</p>
                <h2>{Math.round(results.sustainabilityScore)} / 100</h2>
              </div>
              <div
                className={`score-pill ${
                  results.sustainabilityScore >= 80
                    ? 'excellent'
                    : results.sustainabilityScore >= 60
                      ? 'good'
                      : results.sustainabilityScore >= 40
                        ? 'moderate'
                        : 'low'
                }`}
              >
                {results.scoreLabel}
              </div>
            </div>

            <div className="metric-grid">
              <article className="metric-card">
                <span>Annual energy usage</span>
                <strong>{formatNumber(results.annualEnergyKwh, 1)} kWh</strong>
              </article>

              <article className="metric-card">
                <span>Lifetime energy usage</span>
                <strong>{formatNumber(results.lifetimeEnergyKwh, 1)} kWh</strong>
              </article>

              <article className="metric-card accent">
                <span>Estimated CO₂ emissions</span>
                <strong>{formatCompact(results.estimatedCo2Kg)}</strong>
              </article>

              <article className="metric-card">
                <span>Sustainability score</span>
                <strong>{results.sustainabilityScore.toFixed(1)} / 100</strong>
              </article>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
