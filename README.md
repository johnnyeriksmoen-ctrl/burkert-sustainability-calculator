* {
  box-sizing: border-box;
}

:root {
  font-family: 'Inter', sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color: #e5eef9;
  background: linear-gradient(180deg, #061726 0%, #0b1f2f 100%);
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  --bg: #061726;
  --panel: rgba(12, 27, 38, 0.9);
  --panel-soft: #12293d;
  --primary: #6ed3c7;
  --primary-strong: #2ca6a2;
  --accent: #8ac4ff;
  --text: #ecf3fb;
  --muted: #a9bfd4;
  --border: rgba(145, 174, 201, 0.2);
  --shadow: 0 24px 60px rgba(0, 0, 0, 0.28);
}

html, body, #root {
  margin: 0;
  min-height: 100%;
  min-height: 100vh;
  background: var(--bg);
}

body {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

button, input, select {
  font: inherit;
}

.page-shell {
  width: min(1200px, 100%);
}

.app-card {
  width: min(1100px, 100%);
  margin: 0 auto;
  background: rgba(10, 19, 28, 0.86);
  border: 1px solid var(--border);
  border-radius: 28px;
  box-shadow: var(--shadow);
  overflow: hidden;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 28px 32px 20px;
  border-bottom: 1px solid var(--border);
  background: linear-gradient(135deg, rgba(16, 43, 61, 0.9), rgba(10, 26, 36, 0.9));
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--primary);
}

.eyebrow.alt {
  color: var(--accent);
}

h1, h2, p {
  margin-top: 0;
}

h1 {
  margin-bottom: 0;
  font-size: clamp(2rem, 4vw, 2.8rem);
  line-height: 1.1;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 14px;
  border-radius: 999px;
  color: var(--text);
  background: rgba(110, 211, 199, 0.12);
  border: 1px solid rgba(110, 211, 199, 0.4);
  font-size: 0.8rem;
  letter-spacing: 0.04em;
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 0;
}

.panel {
  padding: 32px;
}

.form-panel {
  background: rgba(14, 23, 33, 0.8);
  border-right: 1px solid var(--border);
}

.form-panel h2,
.results-panel h2 {
  margin-bottom: 24px;
  font-size: 1.4rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 22px;
}

.field-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

label {
  font-size: 0.9rem;
  color: var(--muted);
  font-weight: 600;
}

input, select {
  border: 1px solid var(--border);
  background: rgba(18, 41, 61, 0.7);
  color: var(--text);
  border-radius: 14px;
  padding: 14px 16px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

input:focus, select:focus {
  outline: none;
  border-color: rgba(138, 196, 255, 0.8);
  box-shadow: 0 0 0 4px rgba(138, 196, 255, 0.18);
}

.family-note {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
  padding: 10px 14px;
  color: var(--muted);
  border-radius: 999px;
  background: rgba(138, 196, 255, 0.08);
  border: 1px solid rgba(138, 196, 255, 0.2);
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  box-shadow: 0 0 18px rgba(138, 196, 255, 0.6);
}

.results-panel {
  background: linear-gradient(180deg, rgba(15, 31, 42, 0.9), rgba(9, 16, 24, 0.9));
}

.summary-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.score-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.score-pill.excellent {
  background: rgba(110, 211, 199, 0.12);
  border-color: rgba(110, 211, 199, 0.3);
  color: #9ef8ea;
}

.score-pill.good {
  background: rgba(138, 196, 255, 0.12);
  border-color: rgba(138, 196, 255, 0.3);
  color: #b4dcff;
}

.score-pill.moderate {
  background: rgba(243, 182, 75, 0.12);
  border-color: rgba(243, 182, 75, 0.32);
  color: #ffdca8;
}

.score-pill.low {
  background: rgba(252, 99, 98, 0.12);
  border-color: rgba(252, 99, 98, 0.32);
  color: #ffb7b6;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.metric-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 18px;
  border-radius: 18px;
  background: rgba(20, 36, 49, 0.9);
  border: 1px solid var(--border);
}

.metric-card.accent {
  background: linear-gradient(135deg, rgba(40, 92, 102, 0.7), rgba(25, 58, 82, 0.8));
}

.metric-card span {
  color: var(--muted);
  font-size: 0.8rem;
  letter-spacing: 0.02em;
}

.metric-card strong {
  font-size: clamp(1.2rem, 2vw, 1.8rem);
  line-height: 1.2;
  word-break: break-word;
}

@media (max-width: 840px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .form-panel {
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
}

@media (max-width: 560px) {
  body {
    padding: 16px;
  }

  .topbar,
  .panel {
    padding: 20px 18px;
  }

  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .field-row,
  .metric-grid {
    grid-template-columns: 1fr;
  }

  .summary-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
