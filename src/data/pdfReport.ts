import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  type CalculationResults,
  type CalculatorInputs,
  type CustomerInfo,
  PRODUCTS,
  getMaterial,
  getCountry,
  formatCurrency,
  formatEnergy,
  formatCO2,
  formatNumber,
} from './calculator';

const BURKERT_BLUE: [number, number, number] = [0, 107, 179];
const BURKERT_DARK: [number, number, number] = [0, 80, 133];
const LIGHT_GRAY: [number, number, number] = [245, 247, 250];
const MID_GRAY: [number, number, number] = [107, 114, 128];
const DARK_GRAY: [number, number, number] = [31, 41, 55];
const GREEN: [number, number, number] = [16, 185, 129];
const AMBER: [number, number, number] = [245, 158, 11];
const RED: [number, number, number] = [239, 68, 68];

interface TrafficLight {
  color: 'green' | 'yellow' | 'red';
  label: string;
  rgb: [number, number, number];
}

function getTrafficLight(results: CalculationResults): TrafficLight {
  if (!results.hasPositiveBusinessCase) {
    return { color: 'red', label: 'No Business Case', rgb: RED };
  }
  if (!results.hasValidPayback) {
    return { color: 'red', label: 'Weak Business Case', rgb: RED };
  }
  const { paybackYears, roiPercent } = results;
  if (paybackYears < 3 && roiPercent > 100) {
    return { color: 'green', label: 'Strong Business Case', rgb: GREEN };
  }
  if (paybackYears <= 5 || (roiPercent >= 25 && roiPercent <= 100)) {
    return { color: 'yellow', label: 'Moderate Business Case', rgb: AMBER };
  }
  return { color: 'red', label: 'Weak Business Case', rgb: RED };
}

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

export function generatePDFReport(
  results: CalculationResults,
  inputs: CalculatorInputs,
  customer: CustomerInfo,
  chartImage?: string
): void {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 42;

  const product = PRODUCTS.find((p) => p.id === inputs.productId) || PRODUCTS[0];
  const material = getMaterial(inputs.material);
  const country = getCountry(inputs.country);
  const light = getTrafficLight(results);

  // ==================== COVER PAGE ====================
  doc.setFillColor(...BURKERT_BLUE);
  doc.rect(0, 0, pageW, 120, 'F');

  doc.setFillColor(...BURKERT_DARK);
  doc.rect(0, 120, pageW, 6, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('BÜRKERT', margin, 50);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Fluid Control Systems', margin, 64);

  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text('Sustainability Value', margin, 210);
  doc.text('Assessment', margin, 242);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...MID_GRAY);
  doc.text('A comprehensive evaluation of sustainability performance', margin, 268);
  doc.text('and investment justification for Bürkert solutions', margin, 282);

  // Customer info box
  const boxY = 330;
  doc.setFillColor(...LIGHT_GRAY);
  doc.roundedRect(margin, boxY, pageW - margin * 2, 140, 6, 6, 'F');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BURKERT_BLUE);
  doc.text('PREPARED FOR', margin + 20, boxY + 25);

  doc.setFontSize(12);
  doc.setTextColor(...DARK_GRAY);
  doc.text(customer.customerName || '—', margin + 20, boxY + 42);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BURKERT_BLUE);
  doc.text('PROJECT', margin + 20, boxY + 62);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK_GRAY);
  doc.text(customer.projectName || '—', margin + 20, boxY + 78);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BURKERT_BLUE);
  doc.text('SALES ENGINEER', margin + 20, boxY + 98);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK_GRAY);
  doc.text(customer.salesEngineer || '—', margin + 20, boxY + 114);

  // Date on right side
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BURKERT_BLUE);
  doc.text('DATE GENERATED', pageW - margin - 140, boxY + 25);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK_GRAY);
  doc.text(today, pageW - margin - 140, boxY + 42);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BURKERT_BLUE);
  doc.text('PRODUCT', pageW - margin - 140, boxY + 62);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK_GRAY);
  doc.text(product.name, pageW - margin - 140, boxY + 78);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BURKERT_BLUE);
  doc.text('COUNTRY / GRID', pageW - margin - 140, boxY + 98);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK_GRAY);
  doc.text(country.name, pageW - margin - 140, boxY + 114);

  // Traffic light status at bottom
  const tlY = 520;
  doc.setFillColor(light.rgb[0], light.rgb[1], light.rgb[2]);
  doc.roundedRect(margin, tlY, pageW - margin * 2, 50, 6, 6, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('INVESTMENT STATUS', margin + 20, tlY + 20);
  doc.setFontSize(16);
  doc.text(light.label, margin + 20, tlY + 39);

  // Footer
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...MID_GRAY);
  doc.text('Confidential — For internal and customer use only', margin, pageH - 30);
  doc.text('Bürkert Sustainability Value Calculator', pageW - margin - 180, pageH - 30);

  // ==================== PAGE 2: EXECUTIVE SUMMARY ====================
  doc.addPage();

  drawPageHeader(doc, 'Executive Summary', pageW, margin);

  let y = 100;

  // KPI blocks
  const kpiData = [
    { label: 'Sustainability Grade', value: `Grade ${results.sustainabilityGrade}`, sub: results.scoreLabel, rgb: hexToRgb(results.scoreColor) },
    { label: 'Annual Energy Savings', value: formatEnergy(results.annualEnergySavings), sub: `${formatNumber(results.energyReductionPct, 1)}% reduction`, rgb: BURKERT_BLUE },
    { label: 'Annual CO₂ Reduction', value: formatCO2(results.annualCO2Reduction), sub: `${formatNumber(results.co2ReductionPct, 1)}% reduction`, rgb: MID_GRAY },
    { label: 'Annual Cost Savings', value: results.hasPositiveBusinessCase ? formatCurrency(results.annualCostSavings) : 'N/A', sub: results.hasPositiveBusinessCase ? `${formatNumber(results.costReductionPct, 1)}% reduction` : 'No savings', rgb: results.hasPositiveBusinessCase ? GREEN : RED },
    { label: 'Lifetime Savings', value: results.hasPositiveBusinessCase ? formatCurrency(results.lifetimeCostSavings) : 'N/A', sub: `over ${inputs.lifetime} years`, rgb: results.hasPositiveBusinessCase ? GREEN : MID_GRAY },
    { label: 'Payback Period', value: results.hasValidPayback ? `${formatNumber(results.paybackYears, 1)} years` : 'N/A', sub: results.hasValidPayback ? 'break-even point' : results.hasPositiveBusinessCase ? 'exceeds product lifetime' : 'No business case', rgb: results.hasValidPayback ? BURKERT_BLUE : RED },
    { label: 'ROI', value: results.hasPositiveBusinessCase ? `${formatNumber(results.roiPercent, 0)}%` : 'N/A', sub: `over ${inputs.lifetime} years`, rgb: results.hasPositiveBusinessCase ? GREEN : RED },
    { label: 'Traffic Light', value: light.label, sub: 'investment status', rgb: light.rgb },
  ];

  const kpiW = (pageW - margin * 2 - 12) / 4;
  const kpiH = 64;
  for (let i = 0; i < kpiData.length; i++) {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const x = margin + col * (kpiW + 4);
    const ky = y + row * (kpiH + 8);

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...LIGHT_GRAY);
    doc.setLineWidth(0.5);
    doc.roundedRect(x, ky, kpiW, kpiH, 4, 4, 'F');
    doc.setFillColor(kpiData[i].rgb[0], kpiData[i].rgb[1], kpiData[i].rgb[2]);
    doc.roundedRect(x, ky, 3, kpiH, 2, 2, 'F');

    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...MID_GRAY);
    doc.text(kpiData[i].label.toUpperCase(), x + 10, ky + 16);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(kpiData[i].rgb[0], kpiData[i].rgb[1], kpiData[i].rgb[2]);
    doc.text(kpiData[i].value, x + 10, ky + 36);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...MID_GRAY);
    doc.text(kpiData[i].sub, x + 10, ky + 52);
  }

  y += 2 * (kpiH + 8) + 20;

  // Recommendation section
  doc.setFillColor(...LIGHT_GRAY);
  doc.roundedRect(margin, y, pageW - margin * 2, 12, 3, 3, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BURKERT_BLUE);
  doc.text('MANAGEMENT RECOMMENDATION', margin + 10, y + 8);

  y += 24;

  const recText = buildRecommendationText(results, inputs, product.name, country.name);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK_GRAY);
  const recLines = doc.splitTextToSize(recText, pageW - margin * 2);
  doc.text(recLines, margin, y);
  y += recLines.length * 12 + 16;

  // Bullet points
  const bullets = buildBulletPoints(results, inputs);
  doc.setFontSize(9);
  for (const bullet of bullets) {
    doc.setFillColor(...GREEN);
    doc.circle(margin + 3, y - 3, 2, 'F');
    doc.setTextColor(...DARK_GRAY);
    const bLines = doc.splitTextToSize(bullet, pageW - margin * 2 - 16);
    doc.text(bLines, margin + 12, y);
    y += bLines.length * 12 + 4;
  }

  // Report notes
  if (customer.reportNotes.trim()) {
    y += 12;
    doc.setFillColor(...LIGHT_GRAY);
    doc.roundedRect(margin, y, pageW - margin * 2, 12, 3, 3, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...BURKERT_BLUE);
    doc.text('REPORT NOTES', margin + 10, y + 8);
    y += 24;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...DARK_GRAY);
    const noteLines = doc.splitTextToSize(customer.reportNotes, pageW - margin * 2);
    doc.text(noteLines, margin, y);
  }

  drawPageFooter(doc, pageW, pageH, margin, 2);

  // ==================== PAGE 3: CONFIGURATION + SUSTAINABILITY ====================
  doc.addPage();
  drawPageHeader(doc, 'Product Configuration & Sustainability Results', pageW, margin);

  y = 100;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BURKERT_BLUE);
  doc.text('Product Configuration', margin, y);
  y += 8;

  autoTable(doc, {
    startY: y,
    head: [['Parameter', 'Value']],
    body: [
      ['Product', product.name],
      ['Quantity', `${inputs.quantity} units`],
      ['Material', `${material.name} (${material.recyclability}% recyclable)`],
      ['Product Weight', `${formatNumber(inputs.weight, 2)} kg`],
      ['Country / Grid', `${country.name} (${country.co2Factor} kg CO₂/kWh)`],
      ['Power Consumption', `${formatNumber(inputs.powerConsumption, 1)} W`],
      ['Operating Hours', `${formatNumber(inputs.operatingHours, 0)} h/year`],
      ['Product Lifetime', `${inputs.lifetime} years`],
      ['Electricity Price', `€${formatNumber(inputs.electricityPrice, 2)}/kWh`],
      ['Existing Power Consumption', `${formatNumber(inputs.existingPowerConsumption, 1)} W`],
      ['Investment Cost', formatCurrency(inputs.investmentCost)],
    ],
    theme: 'striped',
    headStyles: { fillColor: BURKERT_BLUE, fontSize: 8, textColor: [255, 255, 255] },
    bodyStyles: { fontSize: 8, textColor: DARK_GRAY },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: margin, right: margin },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 200 } },
  });

  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 24;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BURKERT_BLUE);
  doc.text('Sustainability Results', margin, y);
  y += 8;

  autoTable(doc, {
    startY: y,
    head: [['Metric', 'Value', 'Details']],
    body: [
      ['Annual Energy', formatEnergy(results.annualEnergyTotal), `${formatNumber(results.annualEnergyPerUnit, 1)} kWh/unit`],
      ['Lifetime Energy', formatEnergy(results.lifetimeEnergyTotal), `over ${inputs.lifetime} years`],
      ['Annual CO₂', formatCO2(results.annualCO2), 'operational emissions/year'],
      ['Lifetime CO₂', formatCO2(results.lifetimeCO2), 'operational over lifetime'],
      ['Embodied Carbon', formatCO2(results.embodiedCarbon), 'manufacturing CO₂'],
      ['Lifetime Carbon', formatCO2(results.lifetimeCarbon), 'embodied + operational'],
      ['Sustainability Score', `${results.sustainabilityScore}/100`, results.scoreLabel],
      ['Sustainability Grade', `Grade ${results.sustainabilityGrade}`, results.scoreLabel],
    ],
    theme: 'striped',
    headStyles: { fillColor: BURKERT_BLUE, fontSize: 8, textColor: [255, 255, 255] },
    bodyStyles: { fontSize: 8, textColor: DARK_GRAY },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: margin, right: margin },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 140 } },
  });

  drawPageFooter(doc, pageW, pageH, margin, 3);

  // ==================== PAGE 4: COMPARISON + FINANCIAL ====================
  doc.addPage();
  drawPageHeader(doc, 'Comparison & Financial Analysis', pageW, margin);

  y = 100;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BURKERT_BLUE);
  doc.text('Existing Solution vs Bürkert Solution', margin, y);
  y += 8;

  autoTable(doc, {
    startY: y,
    head: [['Metric', 'Existing Solution', 'Bürkert Solution', 'Improvement']],
    body: [
      [
        'Energy Use',
        formatEnergy(results.existingAnnualEnergy),
        formatEnergy(results.annualEnergyTotal),
        `${formatEnergy(results.annualEnergySavings)} (${formatNumber(results.energyReductionPct, 1)}%)`,
      ],
      [
        'CO₂ Emissions',
        formatCO2(results.existingAnnualCO2),
        formatCO2(results.annualCO2),
        `${formatCO2(results.annualCO2Reduction)} (${formatNumber(results.co2ReductionPct, 1)}%)`,
      ],
      [
        'Operating Cost',
        formatCurrency(results.existingAnnualCost),
        formatCurrency(results.annualCost),
        `${formatCurrency(results.annualCostSavings)} (${formatNumber(results.costReductionPct, 1)}%)`,
      ],
    ],
    theme: 'striped',
    headStyles: { fillColor: BURKERT_BLUE, fontSize: 8, textColor: [255, 255, 255] },
    bodyStyles: { fontSize: 8, textColor: DARK_GRAY },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: margin, right: margin },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 100 } },
  });

  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 24;

  // Financial analysis KPI cards
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BURKERT_BLUE);
  doc.text('Financial Analysis', margin, y);
  y += 16;

  const finKPIs = [
    { label: 'Investment Cost', value: formatCurrency(inputs.investmentCost), rgb: BURKERT_BLUE },
    { label: 'Annual Savings', value: results.hasPositiveBusinessCase ? formatCurrency(results.annualCostSavings) : 'N/A', rgb: results.hasPositiveBusinessCase ? GREEN : RED },
    { label: 'Lifetime Savings', value: results.hasPositiveBusinessCase ? formatCurrency(results.lifetimeCostSavings) : 'N/A', rgb: results.hasPositiveBusinessCase ? GREEN : MID_GRAY },
    { label: 'Payback Period', value: results.hasValidPayback ? `${formatNumber(results.paybackYears, 1)} yrs` : 'N/A', rgb: results.hasValidPayback ? BURKERT_BLUE : RED },
    { label: 'ROI', value: results.hasPositiveBusinessCase ? `${formatNumber(results.roiPercent, 0)}%` : 'N/A', rgb: results.hasPositiveBusinessCase ? GREEN : RED },
  ];

  const finW = (pageW - margin * 2 - 16) / 5;
  for (let i = 0; i < finKPIs.length; i++) {
    const x = margin + i * (finW + 4);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...LIGHT_GRAY);
    doc.setLineWidth(0.5);
    doc.roundedRect(x, y, finW, 72, 4, 4, 'F');
    doc.setFillColor(finKPIs[i].rgb[0], finKPIs[i].rgb[1], finKPIs[i].rgb[2]);
    doc.roundedRect(x, y, finW, 4, 2, 2, 'F');

    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...MID_GRAY);
    doc.text(finKPIs[i].label.toUpperCase(), x + 8, y + 22);

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(finKPIs[i].rgb[0], finKPIs[i].rgb[1], finKPIs[i].rgb[2]);
    doc.text(finKPIs[i].value, x + 8, y + 44);
  }

  // Chart image
  if (chartImage) {
    y += 100;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...BURKERT_BLUE);
    doc.text('Investment & Payback Analysis', margin, y);
    y += 10;

    const chartW = pageW - margin * 2;
    const chartH = 180;
    try {
      doc.addImage(chartImage, 'PNG', margin, y, chartW, chartH);
    } catch {
      // If chart image fails, skip silently
    }
  }

  drawPageFooter(doc, pageW, pageH, margin, 4);

  // ==================== PAGE 5: METHODOLOGY & ASSUMPTIONS ====================
  doc.addPage();
  drawPageHeader(doc, 'Methodology & Assumptions', pageW, margin);

  y = 80;

  // Intro description
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK_GRAY);
  const introLines = doc.splitTextToSize(
    'The Bürkert Sustainability Value Calculator estimates environmental and financial impacts using user-provided operating parameters, material selections, electricity cost assumptions and country-specific emission factors. Results are intended for decision support and comparative evaluation of alternative solutions.',
    pageW - margin * 2
  );
  doc.text(introLines, margin, y);
  y += introLines.length * 12 + 16;

  // ENERGY METHODOLOGY
  y = drawMethodologySection(doc, y, 'Energy Methodology', [
    'Annual Energy Consumption (kWh):',
    'Power Consumption (W) × Operating Hours/Year × Quantity ÷ 1000',
    'Lifetime Energy Consumption:',
    'Annual Energy Consumption × Product Lifetime',
  ], pageW, margin);

  // CO2 METHODOLOGY
  y = drawMethodologySection(doc, y, 'Carbon Methodology', [
    'Operational CO₂ emissions are calculated using country-specific electricity emission factors.',
    'Energy Consumption (kWh) × CO₂ Factor (kg CO₂/kWh)',
    'Emission factors vary by selected country or electricity grid.',
  ], pageW, margin);

  // MATERIAL IMPACT METHODOLOGY
  y = drawMethodologySection(doc, y, 'Material Impact Methodology', [
    'Embodied carbon estimates are based on generic emission factors associated with product materials.',
    'Materials considered: Stainless Steel, Aluminium, Brass, Plastic',
    'Embodied Carbon = Product Weight × Material Carbon Factor × Quantity',
    'These values provide indicative estimates and are not Environmental Product Declarations (EPDs).',
  ], pageW, margin);

  // FINANCIAL METHODOLOGY
  y = drawMethodologySection(doc, y, 'Financial Methodology', [
    'Operating Cost = Energy Consumption × Electricity Price',
    'Lifetime Savings = Annual Cost Savings × Product Lifetime',
    'Payback Period = Investment Cost ÷ Annual Savings',
    'ROI = (Lifetime Savings - Investment Cost) ÷ Investment Cost × 100',
  ], pageW, margin);

  // SUSTAINABILITY SCORING MODEL
  y = drawMethodologySection(doc, y, 'Sustainability Scoring Model', [
    'The score is based on: 35% Operational Energy Impact, 25% Lifetime Carbon Impact,',
    '20% Material Impact, 10% Recyclability, 10% Product Lifetime',
    'Grades: A = Excellent, B = Good, C = Fair, D = Poor, E = High Impact',
  ], pageW, margin);

  // LIMITATIONS — highlighted warning box
  y += 6;
  doc.setFillColor(255, 248, 230);
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(1);
  doc.roundedRect(margin, y, pageW - margin * 2, 12, 3, 3, 'FD');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...AMBER);
  doc.text('LIMITATIONS & ASSUMPTIONS', margin + 10, y + 8);
  y += 22;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK_GRAY);
  const limitText = 'The values presented in this report are estimates and should be used for comparative and decision-support purposes only. Actual performance may vary depending on: Operating conditions, Installation quality, Product configuration, Maintenance practices, Electricity tariff structures, Site-specific energy mix. Results do not constitute a contractual guarantee of savings, emissions reductions or financial performance.';
  const limitLines = doc.splitTextToSize(limitText, pageW - margin * 2);
  doc.text(limitLines, margin, y);
  y += limitLines.length * 11 + 16;

  // DATA SOURCES
  y = drawMethodologySection(doc, y, 'Data Sources', [
    'This report uses: User-entered operating parameters, Generic material emission factors,',
    'Country-specific electricity emission factors, Internal calculator assumptions',
    'Where available, future versions may incorporate: Environmental Product Declarations (EPDs),',
    'Product Carbon Footprints (PCFs), Verified Bürkert product lifecycle data',
  ], pageW, margin);

  drawPageFooter(doc, pageW, pageH, margin, 5);

  // ==================== SAVE ====================
  const fileDate = new Date().toISOString().split('T')[0];
  const fileName = `Burkert_Sustainability_Report_${customer.customerName || customer.projectName || product.id}_${fileDate}.pdf`
    .replace(/[^a-zA-Z0-9_\-\.]/g, '_');
  doc.save(fileName);
}

function drawPageHeader(doc: jsPDF, title: string, pageW: number, margin: number): void {
  doc.setFillColor(...BURKERT_BLUE);
  doc.rect(0, 0, pageW, 56, 'F');
  doc.setFillColor(...BURKERT_DARK);
  doc.rect(0, 56, pageW, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title, margin, 36);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('Bürkert Sustainability Value Assessment', pageW - margin - 150, 36);
}

function drawPageFooter(doc: jsPDF, pageW: number, pageH: number, margin: number, pageNum: number): void {
  doc.setDrawColor(...LIGHT_GRAY);
  doc.setLineWidth(0.5);
  doc.line(margin, pageH - 36, pageW - margin, pageH - 36);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...MID_GRAY);
  doc.text('Bürkert Fluid Control Systems — Confidential', margin, pageH - 22);
  doc.text(`Page ${pageNum}`, pageW - margin - 40, pageH - 22);
  doc.text('Generated by Sustainability Value Calculator', margin, pageH - 12);
}

function drawMethodologySection(
  doc: jsPDF,
  y: number,
  heading: string,
  lines: string[],
  pageW: number,
  margin: number
): number {
  doc.setFillColor(...LIGHT_GRAY);
  doc.roundedRect(margin, y, pageW - margin * 2, 14, 3, 3, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BURKERT_BLUE);
  doc.text(heading, margin + 10, y + 9);
  y += 22;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK_GRAY);
  for (const line of lines) {
    const wrapped = doc.splitTextToSize(line, pageW - margin * 2);
    doc.text(wrapped, margin, y);
    y += wrapped.length * 11;
  }
  y += 10;
  return y;
}

function buildBulletPoints(results: CalculationResults, inputs: CalculatorInputs): string[] {
  const bullets: string[] = [
    `Reduce annual energy consumption by ${formatNumber(results.energyReductionPct, 1)}%`,
    `Reduce annual CO₂ emissions by ${formatNumber(results.co2ReductionPct, 1)}%`,
  ];

  if (results.hasPositiveBusinessCase) {
    bullets.push(`Save ${formatCurrency(results.annualCostSavings)} annually`);
    bullets.push(`Generate ${formatCurrency(results.lifetimeCostSavings)} lifetime savings over ${inputs.lifetime} years`);
    if (results.hasValidPayback) {
      bullets.push(`Achieve payback within ${formatNumber(results.paybackYears, 1)} years`);
    } else {
      bullets.push('Payback period exceeds the expected product lifetime');
    }
    bullets.push(`Deliver ${formatNumber(results.roiPercent, 0)}% ROI over the product lifetime`);
  } else {
    bullets.push('No positive business case based on current assumptions — consider adjusting parameters');
  }

  bullets.push(`Achieve Sustainability Grade ${results.sustainabilityGrade} (${results.scoreLabel})`);

  return bullets;
}

function buildRecommendationText(
  results: CalculationResults,
  inputs: CalculatorInputs,
  productName: string,
  countryName: string
): string {
  const { hasPositiveBusinessCase, hasValidPayback, paybackYears, roiPercent, annualCostSavings, lifetimeCostSavings } = results;

  if (!hasPositiveBusinessCase) {
    return `Based on the current configuration, switching to ${productName} (${inputs.quantity} units) in ${countryName} does not yield a positive business case. The Bürkert solution consumes similar or more power than the existing setup. Consider reviewing product selection, quantity, or operating parameters. The sustainability rating is Grade ${results.sustainabilityGrade}.`;
  }

  if (!hasValidPayback) {
    return `Although annual savings of ${formatCurrency(annualCostSavings)} are positive, the estimated payback period of ${formatNumber(paybackYears, 1)} years exceeds the expected product lifetime of ${inputs.lifetime} years and therefore the investment may not be financially justified under the current assumptions. The ${productName} configuration in ${countryName} delivers lifetime savings of ${formatCurrency(lifetimeCostSavings)} over ${inputs.lifetime} years, but the investment is not recovered before end of expected lifecycle. Consider reducing investment cost, increasing units, or extending the product lifetime. The sustainability rating is Grade ${results.sustainabilityGrade}.`;
  }

  if (paybackYears < 3 && roiPercent > 100) {
    return `This solution provides a strong business case and significant sustainability benefits. Switching to ${productName} (${inputs.quantity} units) in ${countryName} delivers ${formatCurrency(annualCostSavings)} in annual savings with payback in ${formatNumber(paybackYears, 1)} years and ${formatNumber(roiPercent, 0)}% ROI. Recommendation: Proceed with investment.`;
  }

  if (paybackYears <= 5 || (roiPercent >= 25 && roiPercent <= 100)) {
    return `This solution offers a moderate business case. The ${productName} configuration in ${countryName} achieves ${formatCurrency(annualCostSavings)} in annual savings with payback in ${formatNumber(paybackYears, 1)} years and ${formatNumber(roiPercent, 0)}% ROI over ${inputs.lifetime} years. Recommendation: Proceed if capital is available and sustainability targets are a priority.`;
  }

  return `This solution presents a weak business case under current assumptions. The ${productName} investment of ${formatCurrency(inputs.investmentCost)} has a payback period of ${formatNumber(paybackYears, 1)} years with only ${formatNumber(roiPercent, 0)}% ROI. Annual savings of ${formatCurrency(annualCostSavings)} are positive but insufficient. Consider reducing investment cost or increasing units. Lifetime savings: ${formatCurrency(lifetimeCostSavings)} over ${inputs.lifetime} years.`;
}
