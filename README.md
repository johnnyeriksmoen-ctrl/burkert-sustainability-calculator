Bürkert Sustainability Value Calculator
A React + TypeScript application for evaluating the sustainability, energy efficiency, CO₂ impact, and financial performance of industrial automation products.

The calculator helps engineers, sales teams, and customers quantify environmental and economic benefits when selecting more efficient fluid control solutions.

Features
Sustainability Analysis
Annual energy consumption
Lifetime energy consumption
Annual CO₂ emissions
Lifetime CO₂ emissions
Embodied carbon impact
Sustainability scoring (A-E grade)
Material recyclability assessment
Financial Analysis
Annual operating cost
Annual cost savings
Energy savings
CO₂ reduction
ROI calculation
Investment payback analysis
Positive business case validation
Visualization
Sustainability score gauge
Payback and savings chart
Environmental impact summaries
Carbon equivalency calculations
Reporting
Customer information capture
Project information capture
PDF report generation
Chart export to PDF
Executive summary page
Technology Stack
Frontend
React 18
TypeScript
Vite
Tailwind CSS
Visualization
Recharts
Lucide React
Reporting
jsPDF
jsPDF AutoTable
html-to-image
Future Integrations
Supabase (planned)
Product database
Customer project storage
Recommendation engine
Project Structure
src/
├── components/
│   ├── EquivalencyCard.tsx
│   ├── ExecutiveSummary.tsx
│   ├── FinancialAnalysis.tsx
│   ├── ImpactSummary.tsx
│   ├── InputPanel.tsx
│   ├── PaybackChart.tsx
│   ├── ResultsPanel.tsx
│   └── ScoreGauge.tsx
│
├── data/
│   ├── calculator.ts
│   └── pdfReport.ts
│
├── App.tsx
├── main.tsx
└── index.css
Key Metrics
The calculator evaluates:

Energy Performance
Annual Energy Consumption (kWh)
Lifetime Energy Consumption (kWh)
Energy Reduction (%)
Environmental Impact
Annual CO₂ Emissions
Lifetime CO₂ Emissions
Embodied Carbon
Lifetime Carbon Impact
Financial Impact
Operating Cost
Annual Savings
ROI (%)
Payback Period (Years)
Supported Regions
Country-specific carbon intensity factors are available for:

Norway
Sweden
Denmark
Finland
Germany
EU Average
This allows calculations to reflect local electricity generation emissions.

Running Locally
Install dependencies:

npm install
Start development server:

npm run dev
Type checking:

npm run typecheck
Linting:

npm run lint
Production build:

npm run build
Preview production build:

npm run preview
Deployment
The application is designed for deployment on:

Vercel
Netlify
Azure Static Web Apps
Example:

npm run build
and deploy the generated dist folder.

Roadmap
Phase 1 (Current)
Sustainability calculations
Financial analysis
PDF reporting
KPI dashboards
Phase 2
Real Bürkert product database
Product comparison engine
Product recommendation engine
Phase 3
Customer project storage
Scenario management
Supabase integration
Multi-user access
Phase 4
ESG methodology documentation
Product lifecycle database
Automated proposal generation
Disclaimer
This tool provides indicative calculations for sustainability and financial assessments.

Actual performance, energy consumption, CO₂ emissions, and financial outcomes will depend on operating conditions, installation, maintenance, local utility prices, and product selection.

Always verify final engineering assumptions before making investment decisions.

Author
Developed for evaluation of sustainability and business value in industrial fluid control applications.
