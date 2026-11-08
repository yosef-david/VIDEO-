:root {
  --bg: #050b14;
  --panel: rgba(11, 18, 31, 0.8);
  --panel-strong: #0b1220;
  --card: rgba(15, 23, 42, 0.82);
  --muted: #9db0c7;
  --text: #eaf6ff;
  --primary: #65d9ff;
  --secondary: #7d6bff;
  --success: #42d4b0;
  --warning: #ffd166;
  --danger: #ff5f7a;
  --border: rgba(148, 163, 184, 0.2);
  --shadow: 0 30px 80px rgba(8, 12, 24, 0.65);
}

* { box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  margin: 0;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background:
    radial-gradient(circle at top, rgba(101, 217, 255, 0.18), transparent 35%),
    radial-gradient(circle at bottom right, rgba(125, 107, 255, 0.15), transparent 30%),
    var(--bg);
  color: var(--text);
  min-height: 100vh;
}

a { color: inherit; text-decoration: none; }
button, input, select, textarea { font: inherit; }

.page-shell {
  width: min(1440px, calc(100vw - 32px));
  margin: 24px auto 80px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: rgba(7, 13, 22, 0.7);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 14px 18px;
  backdrop-filter: blur(10px);
  position: sticky;
  top: 12px;
  z-index: 20;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 800;
}

.brand-mark {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  display: grid;
  place-items: center;
  color: #04111e;
  font-weight: 900;
}

nav {
  display: flex;
  gap: 12px;
  align-items: center;
}

.nav-button,
.primary-button,
.secondary-button,
.ghost-button {
  border-radius: 12px;
  border: 1px solid var(--border);
  background: rgba(15, 23, 42, 0.6);
  color: var(--text);
  padding: 10px 14px;
  cursor: pointer;
  transition: 180ms ease;
}

.primary-button {
  background: linear-gradient(135deg, var(--primary), #3bb5ff 30%, var(--secondary));
  color: #061521;
  font-weight: 800;
  border: none;
}

.secondary-button {
  background: rgba(111, 245, 204, 0.08);
  border-color: rgba(91, 223, 191, 0.3);
  color: var(--text);
}

.ghost-button {
  background: transparent;
}

.nav-button:hover,
.primary-button:hover,
.secondary-button:hover,
.ghost-button:hover {
  transform: translateY(-1px);
}

.hero {
  display: grid;
  grid-template-columns: 1.3fr 0.7fr;
  gap: 30px;
  align-items: center;
  padding: 52px 0 28px;
}

.hero-copy h1 {
  font-size: clamp(2.7rem, 5vw, 5rem);
  line-height: 1.05;
  margin: 0 0 18px;
}

.hero-copy p {
  color: var(--muted);
  font-size: 1.08rem;
  line-height: 1.8;
  margin: 0 0 22px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 26px;
}

.quick-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(120px, 1fr));
  gap: 16px;
}

.metric-box {
  background: rgba(12, 18, 28, 0.78);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 18px 16px;
}

.metric-box strong {
  display: block;
  font-size: 1.5rem;
  margin-bottom: 6px;
}

.metric-box span {
  color: var(--muted);
  font-size: 0.85rem;
}

.preview-card {
  background: linear-gradient(180deg, rgba(14, 23, 36, 0.8), rgba(8, 11, 18, 0.8));
  border: 1px solid var(--border);
  border-radius: 24px;
  box-shadow: var(--shadow);
  padding: 14px;
}

.preview-stage {
  min-height: 440px;
  border-radius: 18px;
  background:
    linear-gradient(160deg, rgba(36, 76, 119, 0.9), rgba(17, 24, 39, 0.95)),
    linear-gradient(135deg, rgba(66, 212, 176, 0.18), rgba(125, 107, 255, 0.18));
  border: 1px solid rgba(255,255,255,0.08);
  display: grid;
  place-items: center;
  overflow: hidden;
  position: relative;
}

.preview-panel {
  background: rgba(4, 7, 12, 0.55);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  padding: 18px;
  width: min(90%, 320px);
}

.preview-panel h3 {
  margin: 0 0 10px;
}

.preview-panel .bar {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: rgba(255,255,255,0.08);
  overflow: hidden;
}

.preview-panel .fill {
  width: 72%;
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--success));
  border-radius: inherit;
}

.content-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 24px;
  margin-top: 20px;
}

.panel {
  background: rgba(10, 17, 29, 0.75);
  border: 1px solid var(--border);
  border-radius: 22px;
  padding: 20px;
  box-shadow: var(--shadow);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(180px, 1fr));
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field label {
  color: var(--muted);
  font-size: 0.81rem;
}

.field input,
.field select,
.field textarea,
.field button {
  width: 100%;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid var(--border);
  border-radius: 12px;
  color: var(--text);
  padding: 12px 14px;
}

.field textarea {
  min-height: 100px;
  resize: vertical;
}

.checkbox-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
}

.checkbox {
  display: flex;
  gap: 8px;
  align-items: center;
  color: var(--muted);
}

.checkbox input {
  width: 16px;
  height: 16px;
}

.metrics-line {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.pill {
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 8px 12px;
  background: rgba(255,255,255,0.02);
  color: var(--muted);
  font-size: 0.85rem;
}

.project-list,
.timeline {
  display: grid;
  gap: 14px;
}

.project-item,
.scene-item {
  background: rgba(12, 18, 29, 0.78);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 16px;
}

.project-header,
.scene-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.scene-actions,
.project-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.status-badge {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
  border: 1px solid transparent;
}

.status-draft { background: rgba(148,163,184,0.12); color: #dce7ff; border-color: rgba(148,163,184,0.36); }
.status-queued { background: rgba(125,107,255,0.12); color: #d4c8ff; border-color: rgba(125,107,255,0.36); }
.status-rendering { background: rgba(65, 221, 255, 0.12); color: #dff9ff; border-color: rgba(65,221,255,0.32); }
.status-ready { background: rgba(66, 212, 176, 0.12); color: #d5ffef; border-color: rgba(66,212,176,0.32); }
.status-failed { background: rgba(255,95,122,0.1); color: #ffd4dc; border-color: rgba(255,95,122,0.32); }

.alert {
  border: 1px solid rgba(255, 209, 102, 0.4);
  background: rgba(255, 209, 102, 0.08);
  color: #ffe8aa;
  padding: 12px 14px;
  border-radius: 12px;
  margin-top: 16px;
}

.editor-shell {
  display: grid;
  gap: 20px;
}

.editor-tools {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.inline-button {
  border: 1px solid var(--border);
  background: rgba(255,255,255,0.02);
  color: var(--text);
  padding: 8px 12px;
  border-radius: 12px;
  cursor: pointer;
}

@media (max-width: 920px) {
  .hero,
  .content-grid {
    grid-template-columns: 1fr;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .quick-stats {
    grid-template-columns: 1fr;
  }

  .topbar {
    flex-direction: column;
    align-items: stretch;
  }

  nav {
    flex-wrap: wrap;
  }
}
