/**
 * Deepseek Bot Army for DeepSeek Harness — Apple-style Bots workbench.
 *
 * Visual language adapted from the OpenDesign "Apple HIG" project:
 * SF typography, 8pt rhythm, translucent sidebar/context materials,
 * inset grouped lists, segmented controls, sheets and a light/dark
 * appearance that follows the Harness theme.
 */
window.__ModuleLoader__.load({
  id: '@local/deepseek-bot-army',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const NS = 'deepseek-bot-army';
    const PANEL_ID = 'deepseek-bot-army';
    const CSS = "\n/* ─────────────────────────────────────────────────────────────\n   Apple design system — bound tokens (light contract)\n   ───────────────────────────────────────────────────────────── */\n.gpb-root {\n  --bg: #ffffff;\n  --surface: #f5f5f7;\n  --surface-warm: #fbfbfd;\n  --fg: #1d1d1f;\n  --fg-2: #424245;\n  --muted: #6e6e73;\n  --meta: #86868b;\n  --border: #d2d2d7;\n  --border-soft: #e8e8ed;\n  --accent: #0071e3;\n  --accent-on: #ffffff;\n  --accent-hover: #0077ed;\n  --accent-active: #0066cc;\n  --success: #16a34a;\n  --warn: #eab308;\n  --danger: #dc2626;\n  --font-display: \"SF Pro Display\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  --font-body: \"SF Pro Text\", \"SF Pro Icons\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  --font-mono: \"SF Mono\", ui-monospace, \"JetBrains Mono\", Menlo, Monaco, Consolas, monospace;\n  --text-xs: 12px;\n  --text-sm: 14px;\n  --text-base: 17px;\n  --text-lg: 21px;\n  --text-xl: 28px;\n  --text-2xl: 40px;\n  --text-3xl: 56px;\n  --text-4xl: 80px;\n  --leading-body: 1.47;\n  --leading-tight: 1.05;\n  --tracking-display: -0.015em;\n  --space-1: 4px;\n  --space-2: 8px;\n  --space-3: 12px;\n  --space-4: 16px;\n  --space-5: 20px;\n  --space-6: 24px;\n  --space-8: 32px;\n  --space-12: 48px;\n  --section-y-desktop: 100px;\n  --section-y-tablet: 64px;\n  --section-y-phone: 40px;\n  --radius-sm: 8px;\n  --radius-md: 12px;\n  --radius-lg: 18px;\n  --radius-pill: 980px;\n  --elev-flat: none;\n  --elev-ring: 0 0 0 1px var(--border);\n  --elev-raised: 0 12px 32px rgba(0, 0, 0, 0.08);\n  --focus-ring: 0 0 0 4px color-mix(in oklab, var(--accent), transparent 65%);\n  --motion-fast: 150ms;\n  --motion-base: 220ms;\n  --ease-standard: cubic-bezier(0.28, 0, 0.22, 1);\n  --container-max: 1024px;\n  --container-gutter-desktop: 22px;\n  --container-gutter-tablet: 18px;\n  --container-gutter-phone: 16px;\n}\n\n/* ─────────────────────────────────────────────────────────────\n   Bots app layer — light\n   ───────────────────────────────────────────────────────────── */\n.gpb-root {\n  color-scheme: light;\n  --font-ui: -apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"PingFang SC\", \"Hiragino Sans GB\", \"Microsoft YaHei\", sans-serif;\n  --font-display-cn: \"SF Pro Display\", -apple-system, BlinkMacSystemFont, \"PingFang SC\", \"Hiragino Sans GB\", \"Microsoft YaHei\", sans-serif;\n  --window: #ffffff;\n  --thread: #fbfbfd;\n  --page-bg: #f5f5f7;\n  --card: #ffffff;\n  --surface-2: #f2f2f5;\n  --surface-3: #e9e9ed;\n  --chrome: rgba(252, 252, 253, 0.78);\n  --sidebar: rgba(247, 247, 249, 0.82);\n  --panel: rgba(250, 250, 252, 0.80);\n  --hairline: rgba(0, 0, 0, 0.08);\n  --hairline-2: rgba(0, 0, 0, 0.055);\n  --fill-1: rgba(0, 0, 0, 0.04);\n  --fill-2: rgba(0, 0, 0, 0.065);\n  --fill-3: rgba(0, 0, 0, 0.10);\n  --accent-soft: color-mix(in oklab, var(--accent) 10%, transparent);\n  --accent-soft-2: color-mix(in oklab, var(--accent) 20%, transparent);\n  --accent-fill: #0071e3;\n  --accent-fill-hover: #006fe2;\n  --accent-fill-active: #0066cc;\n  --accent-text: #0066cc;\n  --bubble: #0071e3;\n  --bubble-fg: #ffffff;\n  --chip-on: #1d1d1f;\n  --chip-on-fg: #ffffff;\n  --btn-dark: #1d1d1f;\n  --btn-dark-hover: #333336;\n  --btn-dark-fg: #ffffff;\n  --btn-secondary: #f2f2f5;\n  --btn-secondary-hover: #e8e8ed;\n  --switch-off: rgba(120, 120, 128, 0.42);\n  --switch-knob: #ffffff;\n  --field-border: #86868b;\n  --seg-active: #ffffff;\n  --shadow-seg: 0 1px 2px rgba(0, 0, 0, 0.12), 0 0 0 0.5px rgba(0, 0, 0, 0.05);\n  --shadow-card: 0 1px 2px rgba(0, 0, 0, 0.04);\n  --shadow-pop: 0 18px 50px rgba(0, 0, 0, 0.18), 0 0 0 0.5px rgba(0, 0, 0, 0.08);\n  --shadow-sheet: 0 40px 120px rgba(0, 0, 0, 0.30), 0 0 0 0.5px rgba(0, 0, 0, 0.10);\n  --shadow-window: 0 30px 80px rgba(0, 0, 0, 0.20), 0 2px 10px rgba(0, 0, 0, 0.08);\n  --shadow-raise: 0 8px 24px rgba(0, 0, 0, 0.10);\n  --scrim: rgba(20, 20, 22, 0.30);\n  --toast-bg: #1d1d1f;\n  --toast-fg: #f5f5f7;\n  --toast-action: #6cb6ff;\n  --success-text: #1a7f3c;\n  --danger-text: #c81e1e;\n  --scroll-thumb: rgba(120, 120, 128, 0.34);\n  --desktop: #e9e9ee;\n  --window-border: rgba(0, 0, 0, 0.12);\n  --traffic-close: #ff5f57;\n  --traffic-min: #febc2e;\n  --traffic-max: #28c840;\n  --highlight: rgba(255, 255, 255, 0.65);\n  --sw-1: #48484a;\n  --sw-2: #0071e3;\n  --sw-3: #7d4bc4;\n  --sw-4: #d1467f;\n  --sw-5: #c2410c;\n  --sw-6: #1a7f3c;\n  --ctx-w: 300px;\n  --side-w: 260px;\n  --bar-h: 56px;\n}\n\n/* dark is a separately composed appearance, not an inversion */\n.gpb-root[data-theme=\"dark\"] {\n  color-scheme: dark;\n  --bg: #1c1c1e;\n  --surface: #2c2c2e;\n  --surface-warm: #242426;\n  --fg: #f5f5f7;\n  --fg-2: #d1d1d6;\n  --muted: #a1a1a6;\n  --meta: #8e8e93;\n  --border: #3a3a3c;\n  --border-soft: #2f2f31;\n  --accent: #0a84ff;\n  --accent-on: #ffffff;\n  --accent-hover: #3d9bff;\n  --accent-active: #0060df;\n  --success: #30d158;\n  --warn: #ffd60a;\n  --danger: #ff453a;\n  --window: #1c1c1e;\n  --thread: #1c1c1e;\n  --page-bg: #1c1c1e;\n  --card: #2c2c2e;\n  --surface-2: #3a3a3c;\n  --surface-3: #48484a;\n  --chrome: rgba(30, 30, 32, 0.78);\n  --sidebar: rgba(32, 32, 34, 0.82);\n  --panel: rgba(30, 30, 32, 0.80);\n  --hairline: rgba(255, 255, 255, 0.09);\n  --hairline-2: rgba(255, 255, 255, 0.06);\n  --fill-1: rgba(255, 255, 255, 0.06);\n  --fill-2: rgba(255, 255, 255, 0.09);\n  --fill-3: rgba(255, 255, 255, 0.14);\n  --accent-soft: color-mix(in oklab, var(--accent) 14%, transparent);\n  --accent-soft-2: color-mix(in oklab, var(--accent) 26%, transparent);\n  --accent-fill: #0a6ad4;\n  --accent-fill-hover: #0a66cc;\n  --accent-fill-active: #0060bf;\n  --accent-text: #64b5ff;\n  --bubble: #0a6ad4;\n  --bubble-fg: #ffffff;\n  --chip-on: #f5f5f7;\n  --chip-on-fg: #1c1c1e;\n  --btn-dark: #f5f5f7;\n  --btn-dark-hover: #ffffff;\n  --btn-dark-fg: #1c1c1e;\n  --btn-secondary: #3a3a3c;\n  --btn-secondary-hover: #48484a;\n  --switch-off: rgba(120, 120, 128, 0.50);\n  --switch-knob: #ffffff;\n  --field-border: #7c7c80;\n  --seg-active: #636366;\n  --shadow-seg: 0 1px 3px rgba(0, 0, 0, 0.42);\n  --shadow-card: 0 1px 2px rgba(0, 0, 0, 0.28);\n  --shadow-pop: 0 18px 50px rgba(0, 0, 0, 0.62), 0 0 0 0.5px rgba(255, 255, 255, 0.12);\n  --shadow-sheet: 0 40px 120px rgba(0, 0, 0, 0.72), 0 0 0 0.5px rgba(255, 255, 255, 0.12);\n  --shadow-window: 0 30px 90px rgba(0, 0, 0, 0.66), 0 2px 10px rgba(0, 0, 0, 0.40);\n  --shadow-raise: 0 10px 30px rgba(0, 0, 0, 0.42);\n  --scrim: rgba(0, 0, 0, 0.55);\n  --toast-bg: #3a3a3c;\n  --toast-fg: #f5f5f7;\n  --toast-action: #64b5ff;\n  --success-text: #30d158;\n  --danger-text: #ff6b60;\n  --scroll-thumb: rgba(235, 235, 245, 0.28);\n  --desktop: #0e0e10;\n  --window-border: rgba(255, 255, 255, 0.10);\n  --highlight: rgba(255, 255, 255, 0.08);\n}\n\n/* ─── base ─────────────────────────────────────────────────── */\n.gpb-root *, .gpb-root *::before, .gpb-root *::after { box-sizing: border-box; }\n.gpb-root [hidden] { display: none !important; }\n.gpb-root { height: 100%; }\n.gpb-root {\n  margin: 0;\n  overflow: hidden;\n  background: var(--desktop);\n  color: var(--fg);\n  font-family: var(--font-ui);\n  font-size: 13.5px;\n  line-height: 1.65;\n  font-weight: 400;\n  -webkit-font-smoothing: antialiased;\n  text-rendering: optimizeLegibility;\n}\n.gpb-root h1, .gpb-root h2, .gpb-root h3, .gpb-root p, .gpb-root figure { margin: 0; }\n.gpb-root p { text-wrap: pretty; }\n.gpb-root h1, .gpb-root h2, .gpb-root h3 { font-family: var(--font-display-cn); font-weight: 590; text-wrap: balance; }\n.gpb-root button { font: inherit; color: inherit; background: none; border: 0; padding: 0; cursor: pointer; }\n.gpb-root input, .gpb-root textarea, .gpb-root select { font: inherit; color: inherit; }\n.gpb-root svg { display: block; }\n.gpb-root ::selection { background: var(--accent-soft-2); }\n.gpb-root :where(button, a, input, textarea, select, [tabindex]):focus-visible {\n  outline: 2px solid var(--accent);\n  outline-offset: 2px;\n}\n.gpb-root * { scrollbar-width: thin; scrollbar-color: var(--scroll-thumb) transparent; }\n.gpb-root *::-webkit-scrollbar { width: 8px; height: 8px; }\n.gpb-root *::-webkit-scrollbar-thumb { background: var(--scroll-thumb); border-radius: 8px; border: 2px solid transparent; background-clip: content-box; }\n.gpb-root *::-webkit-scrollbar-track { background: transparent; }\n.gpb-root .ic { width: 16px; height: 16px; flex: none; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }\n.gpb-root .ic-12 { width: 12px; height: 12px; }\n.gpb-root .ic-14 { width: 14px; height: 14px; }\n.gpb-root .ic-18 { width: 18px; height: 18px; }\n.gpb-root .mono { font-family: var(--font-mono); font-variant-numeric: tabular-nums; }\n.gpb-root .muted { color: var(--muted); }\n.gpb-root .truncate { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.gpb-root .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }\n\n/* ─── window shell ─────────────────────────────────────────── */\n.gpb-root .desktop { height: 100%; padding: 20px; }\n.gpb-root .window {\n  height: 100%;\n  display: grid;\n  grid-template-rows: var(--bar-h) minmax(0, 1fr);\n  background: var(--window);\n  border: 1px solid var(--window-border);\n  border-radius: 12px;\n  box-shadow: var(--shadow-window);\n  overflow: hidden;\n  transition: background-color var(--motion-base) var(--ease-standard), border-color var(--motion-base) var(--ease-standard);\n}\n.gpb-root .app-body { display: grid; grid-template-columns: var(--side-w) minmax(0, 1fr); min-height: 0; position: relative; }\n.gpb-root .workspace { display: flex; min-width: 0; min-height: 0; background: var(--window); }\n\n/* ─── toolbar ──────────────────────────────────────────────── */\n.gpb-root .toolbar {\n  position: relative;\n  z-index: 20;\n  display: grid;\n  grid-template-columns: 1fr auto 1fr;\n  align-items: center;\n  gap: 16px;\n  height: var(--bar-h);\n  padding: 0 14px;\n  background: var(--chrome);\n  -webkit-backdrop-filter: blur(24px) saturate(180%);\n  backdrop-filter: blur(24px) saturate(180%);\n  border-bottom: 1px solid var(--hairline);\n  box-shadow: inset 0 1px 0 var(--highlight);\n}\n.gpb-root .tb-left { display: flex; align-items: center; gap: 12px; min-width: 0; }\n.gpb-root .tb-right { display: flex; align-items: center; justify-content: flex-end; gap: 6px; min-width: 0; }\n.gpb-root .traffic { display: flex; align-items: center; gap: 8px; padding-right: 4px; }\n.gpb-root .traffic i { width: 12px; height: 12px; border-radius: 50%; display: block; box-shadow: inset 0 0 0 0.5px rgba(0, 0, 0, 0.12); }\n.gpb-root .traffic i:nth-child(1) { background: var(--traffic-close); }\n.gpb-root .traffic i:nth-child(2) { background: var(--traffic-min); }\n.gpb-root .traffic i:nth-child(3) { background: var(--traffic-max); }\n.gpb-root .tb-sep { width: 1px; height: 18px; background: var(--hairline); }\n.gpb-root .app-title { font-family: var(--font-display-cn); font-size: 22px; line-height: 1.1; font-weight: 590; letter-spacing: -0.01em; white-space: nowrap; }\n.gpb-root .tb-center { display: flex; justify-content: center; }\n.gpb-root .tb-right .avatar-me { margin-left: 4px; }\n\n.gpb-root .icon-btn {\n  width: 28px; height: 28px;\n  display: inline-flex; align-items: center; justify-content: center;\n  border-radius: 7px;\n  color: var(--muted);\n  transition: background-color var(--motion-fast) var(--ease-standard), color var(--motion-fast) var(--ease-standard), transform var(--motion-fast) var(--ease-standard);\n}\n.gpb-root .icon-btn:hover { background: var(--fill-1); color: var(--fg); }\n.gpb-root .icon-btn:active { transform: scale(0.94); }\n.gpb-root .icon-btn.is-on { background: var(--fill-2); color: var(--fg); }\n\n.gpb-root .avatar {\n  width: 28px; height: 28px; border-radius: 50%;\n  display: inline-grid; place-items: center;\n  background: var(--surface-2);\n  color: var(--fg);\n  font-size: 11px; font-weight: 590;\n  box-shadow: inset 0 0 0 1px var(--hairline);\n  flex: none;\n}\n.gpb-root .avatar-me { background: var(--surface-3); }\n\n/* segmented control */\n.gpb-root .seg {\n  display: inline-flex;\n  align-items: center;\n  gap: 1px;\n  padding: 2px;\n  background: var(--fill-1);\n  border-radius: 9px;\n  box-shadow: inset 0 0 0 0.5px var(--hairline-2);\n}\n.gpb-root .seg button {\n  min-height: 28px;\n  padding: 0 14px;\n  border-radius: 7px;\n  font-size: 12.5px;\n  font-weight: 510;\n  color: var(--muted);\n  display: inline-flex; align-items: center; justify-content: center; gap: 5px;\n  transition: background-color var(--motion-fast) var(--ease-standard), color var(--motion-fast) var(--ease-standard), box-shadow var(--motion-fast) var(--ease-standard);\n  white-space: nowrap;\n}\n.gpb-root .seg button:hover { color: var(--fg); }\n.gpb-root .seg button[aria-selected=\"true\"], .gpb-root .seg button[aria-pressed=\"true\"] {\n  background: var(--seg-active);\n  color: var(--fg);\n  font-weight: 590;\n  box-shadow: var(--shadow-seg);\n}\n.gpb-root .seg .count { font-family: var(--font-mono); font-size: 10px; color: var(--muted); font-weight: 400; }\n.gpb-root .seg-4 { display: flex; width: 100%; }\n.gpb-root .seg-4 button { flex: 1; padding: 0 4px; font-size: 11.5px; }\n.gpb-root .appearance { display: inline-flex; padding: 2px; background: var(--fill-1); border-radius: 8px; box-shadow: inset 0 0 0 0.5px var(--hairline-2); }\n.gpb-root .appearance button { width: 26px; height: 24px; border-radius: 6px; display: grid; place-items: center; color: var(--muted); transition: background-color var(--motion-fast), color var(--motion-fast); }\n.gpb-root .appearance button:hover { color: var(--fg); }\n.gpb-root .appearance button[aria-pressed=\"true\"] { background: var(--seg-active); color: var(--fg); box-shadow: var(--shadow-seg); }\n.gpb-root .theme-single { display: none; }\n\n/* ─── buttons ──────────────────────────────────────────────── */\n.gpb-root .btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; border-radius: 8px; font-weight: 510; white-space: nowrap; transition: background-color var(--motion-fast) var(--ease-standard), color var(--motion-fast), border-color var(--motion-fast), transform var(--motion-fast), box-shadow var(--motion-fast); }\n.gpb-root .btn:active { transform: scale(0.97); }\n.gpb-root .btn-primary { background: var(--accent-fill); color: var(--accent-on); }\n.gpb-root .btn-primary:hover { background: var(--accent-fill-hover); }\n.gpb-root .btn-primary:active { background: var(--accent-fill-active); }\n.gpb-root .btn-dark { background: var(--btn-dark); color: var(--btn-dark-fg); }\n.gpb-root .btn-dark:hover { background: var(--btn-dark-hover); }\n.gpb-root .btn-secondary { background: var(--btn-secondary); color: var(--fg); }\n.gpb-root .btn-outline { background: var(--card); border: 1px solid var(--border); }\n.gpb-root .btn-outline:hover { background: var(--surface-2); border-color: var(--field-border); }\n.gpb-root .btn-secondary:hover { background: var(--btn-secondary-hover); }\n.gpb-root .btn-plain { color: var(--muted); }\n.gpb-root .btn-plain:hover { color: var(--fg); background: var(--fill-1); }\n.gpb-root .btn-28 { height: 28px; padding: 0 11px; font-size: 12.5px; }\n.gpb-root .btn-30 { height: 30px; padding: 0 13px; font-size: 13px; }\n.gpb-root .btn-32 { height: 32px; padding: 0 15px; font-size: 13px; }\n.gpb-root .btn-24 { height: 24px; padding: 0 8px; font-size: 11.5px; border-radius: 6px; }\n.gpb-root .btn[disabled], .gpb-root .btn[aria-disabled=\"true\"] { opacity: 0.45; cursor: default; pointer-events: none; }\n.gpb-root .btn.is-added[disabled] { opacity: 1; background: transparent; border: 1px solid var(--border-soft); color: var(--muted); }\n.gpb-root .btn .ic { margin-left: -1px; }\n\n/* badges, tags, kbd */\n.gpb-root .badge { min-width: 18px; height: 18px; padding: 0 5px; border-radius: 9px; display: inline-flex; align-items: center; justify-content: center; background: var(--fill-2); color: var(--fg); font-family: var(--font-mono); font-size: 10px; font-weight: 500; }\n.gpb-root .badge-accent { background: var(--accent-soft); color: var(--fg); }\n.gpb-root .tag { display: inline-flex; align-items: center; gap: 3px; height: 20px; padding: 0 6px; border-radius: 5px; border: 1px solid var(--hairline); color: var(--muted); font-size: 10.5px; font-weight: 510; white-space: nowrap; }\n.gpb-root .tag .ic { width: 10px; height: 10px; }\n.gpb-root .tag-accent { color: var(--accent-text); border-color: var(--accent-soft-2); background: var(--accent-soft); }\n.gpb-root .kbd { display: inline-flex; align-items: center; justify-content: center; min-width: 16px; height: 16px; padding: 0 4px; border-radius: 4px; border: 1px solid var(--hairline); background: var(--fill-1); color: var(--muted); font-family: var(--font-mono); font-size: 10px; }\n\n/* switch */\n.gpb-root .switch { position: relative; width: 38px; height: 22px; border-radius: 11px; background: var(--switch-off); position: relative; flex: none; transition: background-color var(--motion-base) var(--ease-standard); }\n.gpb-root .switch::before { content: \"\"; position: absolute; inset: -7px -3px; }\n.gpb-root .switch::after { content: \"\"; position: absolute; top: 2px; left: 2px; width: 18px; height: 18px; border-radius: 50%; background: var(--switch-knob); box-shadow: 0 1px 2px rgba(0, 0, 0, 0.24); transition: transform var(--motion-base) var(--ease-standard); }\n.gpb-root .switch[aria-checked=\"true\"] { background: var(--accent); }\n.gpb-root .switch[aria-checked=\"true\"]::after { transform: translateX(16px); }\n\n/* ─── sidebar ──────────────────────────────────────────────── */\n.gpb-root .sidebar {\n  display: flex; flex-direction: column; min-height: 0;\n  background: var(--sidebar);\n  -webkit-backdrop-filter: blur(24px) saturate(180%);\n  backdrop-filter: blur(24px) saturate(180%);\n  border-right: 1px solid var(--hairline);\n  box-shadow: inset 1px 0 0 var(--highlight);\n  transition: background-color var(--motion-base) var(--ease-standard), transform var(--motion-base) var(--ease-standard);\n}\n.gpb-root .sidebar-scroll { flex: 1; min-height: 0; overflow-y: auto; padding: 10px 10px 4px; }\n.gpb-root .side-head { display: flex; align-items: center; justify-content: space-between; gap: 6px; padding: 12px 8px 5px; }\n.gpb-root .side-head:first-child { padding-top: 2px; }\n.gpb-root .side-head h2 { font-size: 11px; font-weight: 590; color: var(--muted); letter-spacing: 0.02em; font-family: var(--font-ui); }\n.gpb-root .side-head .icon-btn { width: 22px; height: 22px; border-radius: 6px; }\n.gpb-root .side-head .icon-btn .ic { width: 14px; height: 14px; }\n.gpb-root .nav-row { width: 100%; display: grid; grid-template-columns: 30px minmax(0, 1fr) auto; align-items: center; gap: 9px; min-height: 44px; padding: 5px 8px; border-radius: 8px; text-align: left; color: var(--fg); transition: background-color var(--motion-fast) var(--ease-standard); }\n.gpb-root .nav-row:hover { background: var(--fill-1); }\n.gpb-root .nav-row.is-active { background: var(--accent-soft); }\n.gpb-root .nav-row .bot-avatar { width: 30px; height: 30px; border-radius: 8px; font-size: 15px; }\n.gpb-root .nav-text { min-width: 0; display: flex; flex-direction: column; gap: 0; }\n.gpb-root .nav-name { font-size: 13px; font-weight: 510; line-height: 1.35; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 5px; }\n.gpb-root .nav-row.is-active .nav-name { font-weight: 590; }\n.gpb-root .nav-sub { font-size: 11px; color: var(--muted); line-height: 1.45; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.gpb-root .nav-row.is-working .nav-sub { color: var(--accent-text); }\n.gpb-root .nav-row.is-active .nav-sub { color: var(--fg-2); }\n.gpb-root .nav-row.is-active.is-working .nav-sub { color: var(--accent-text); }\n.gpb-root .nav-end { display: flex; align-items: center; gap: 4px; }\n.gpb-root .unread-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); flex: none; }\n.gpb-root .nav-row .icon-btn { width: 20px; height: 20px; opacity: 0; }\n.gpb-root .nav-row:hover .icon-btn, .gpb-root .nav-row.is-active .icon-btn { opacity: 1; }\n.gpb-root .bot-avatar { display: inline-grid; place-items: center; background: var(--fill-2); border-radius: 8px; line-height: 1; flex: none; box-shadow: inset 0 0 0 0.5px var(--hairline-2); }\n.gpb-root .tint-blue { --av: var(--sw-2); } .gpb-root .tint-purple { --av: var(--sw-3); } .gpb-root .tint-pink { --av: var(--sw-4); }\n.gpb-root .tint-orange { --av: var(--sw-5); } .gpb-root .tint-green { --av: var(--sw-6); } .gpb-root .tint-graphite { --av: var(--sw-1); }\n.gpb-root .tint-blue, .gpb-root .tint-purple, .gpb-root .tint-pink, .gpb-root .tint-orange, .gpb-root .tint-green, .gpb-root .tint-graphite { background: color-mix(in oklab, var(--av) 16%, transparent); }\n.gpb-root .pulse { display: inline-block; vertical-align: 1px; width: 7px; height: 7px; border-radius: 50%; background: var(--accent); position: relative; flex: none; margin-right: 3px; }\n.gpb-root .pulse::after { content: \"\"; position: absolute; inset: -3px; border-radius: 50%; border: 1px solid var(--accent); opacity: 0.55; animation: gpb-pulse 1.9s ease-out infinite; }\n.gpb-root .room-avatar { background: var(--fill-2); color: var(--muted); }\n.gpb-root .room-avatar .ic { width: 15px; height: 15px; }\n.gpb-root .side-foot { border-top: 1px solid var(--hairline); padding: 7px 10px 11px; background: color-mix(in oklab, var(--sidebar) 60%, transparent); }\n.gpb-root .nav-link { display: grid; grid-template-columns: 22px minmax(0, 1fr) auto; align-items: center; gap: 8px; width: 100%; min-height: 36px; padding: 4px 8px; border-radius: 7px; color: var(--muted); font-size: 12.5px; font-weight: 510; text-align: left; transition: background-color var(--motion-fast), color var(--motion-fast); }\n.gpb-root .nav-link:hover { background: var(--fill-1); color: var(--fg); }\n.gpb-root .nav-link.is-active { background: var(--fill-2); color: var(--fg); font-weight: 590; }\n.gpb-root .nav-link .ic { width: 15px; height: 15px; }\n.gpb-root .nav-link .badge { background: transparent; color: var(--muted); font-size: 10px; padding: 0 2px; }\n.gpb-root .sync-line { display: flex; align-items: center; gap: 6px; padding: 6px 8px 2px; font-size: 10.5px; color: var(--muted); }\n.gpb-root .dot-green { width: 6px; height: 6px; border-radius: 50%; background: var(--success); flex: none; }\n\n/* ─── workbench / thread ───────────────────────────────────── */\n.gpb-root .workbench { flex: 1; display: grid; grid-template-columns: minmax(0, 1fr) var(--ctx-w); min-height: 0; min-width: 0; position: relative; }\n.gpb-root .thread-col { display: flex; flex-direction: column; min-width: 0; min-height: 0; background: var(--thread); transition: background-color var(--motion-base) var(--ease-standard); }\n.gpb-root .thread-head { flex: 0 0 var(--bar-h); height: var(--bar-h); display: flex; align-items: center; gap: 10px; padding: 0 18px; border-bottom: 1px solid var(--hairline); background: color-mix(in oklab, var(--thread) 86%, transparent); }\n.gpb-root .thread-head .bot-avatar { width: 32px; height: 32px; border-radius: 9px; font-size: 16px; }\n.gpb-root .th-text { min-width: 0; display: flex; flex-direction: column; }\n.gpb-root .th-name, .gpb-root .th-sub { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.gpb-root .th-name { font-size: 13.5px; font-weight: 590; line-height: 1.35; display: flex; align-items: center; gap: 5px; }\n.gpb-root .th-sub { font-size: 11px; color: var(--muted); line-height: 1.4; }\n.gpb-root .th-actions { margin-left: auto; display: flex; align-items: center; gap: 6px; }\n.gpb-root .th-actions .tag { height: 24px; border-radius: 6px; padding: 0 7px; font-size: 10.5px; }\n.gpb-root .th-actions .icon-btn { width: 26px; height: 26px; }\n.gpb-root .ctx-toggle { display: none; }\n.gpb-root .thread { flex: 1; min-height: 0; overflow-y: auto; overflow-x: hidden; scroll-behavior: auto; }\n.gpb-root .thread.is-empty { display: flex; flex-direction: column; }\n.gpb-root .thread-inner { max-width: 720px; margin: 0 auto; padding: 16px 24px 10px; display: flex; flex-direction: column; gap: 13px; }\n.gpb-root .day-div { display: flex; align-items: center; gap: 10px; justify-content: center; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.04em; color: var(--muted); }\n.gpb-root .day-div::before, .gpb-root .day-div::after { content: \"\"; height: 1px; width: 24px; background: var(--hairline); }\n.gpb-root .msg-user { align-self: flex-end; max-width: 78%; display: flex; flex-direction: column; align-items: flex-end; gap: 2px; animation: gpb-msgIn var(--motion-base) var(--ease-standard); }\n.gpb-root .msg-user .bubble { overflow-wrap: anywhere; background: var(--bubble); color: var(--bubble-fg); padding: 8px 12px; border-radius: 16px 16px 5px 16px; font-size: 13.5px; line-height: 1.6; box-shadow: var(--shadow-card); }\n.gpb-root .msg-time { font-family: var(--font-mono); font-size: 10px; color: var(--muted); }\n.gpb-root .msg-bot { display: grid; grid-template-columns: 26px minmax(0, 1fr); gap: 9px; animation: gpb-msgIn var(--motion-base) var(--ease-standard); }\n.gpb-root .msg-bot .bot-avatar { width: 26px; height: 26px; border-radius: 7px; font-size: 13px; margin-top: 1px; }\n.gpb-root .msg-bot .msg-body { min-width: 0; }\n.gpb-root .msg-meta { display: flex; align-items: baseline; gap: 6px; margin-bottom: 1px; }\n.gpb-root .msg-name { font-size: 12px; font-weight: 590; }\n.gpb-root .msg-meta .msg-time { font-size: 10px; }\n.gpb-root .msg-text { font-size: 13.5px; line-height: 1.7; color: var(--fg); max-width: 62ch; text-wrap: pretty; overflow-wrap: anywhere; }\n.gpb-root .msg-text a { color: var(--accent-text); text-decoration: underline; text-underline-offset: 2px; }\n.gpb-root .caret { display: inline-block; width: 2px; height: 13px; margin-left: 2px; vertical-align: -2px; background: var(--accent); animation: gpb-blink 1.05s steps(1) infinite; }\n.gpb-root .msg-system { align-self: center; display: inline-flex; align-items: center; gap: 5px; font-family: var(--font-mono); font-size: 10px; color: var(--muted); text-align: center; padding: 1px 0; }\n.gpb-root .msg-system .ic { width: 11px; height: 11px; }\n.gpb-root .activity { display: grid; grid-template-columns: 26px minmax(0, 1fr); gap: 9px; align-items: center; border: 1px solid var(--border-soft); background: var(--card); border-radius: 10px; padding: 7px 10px; box-shadow: var(--shadow-card); }\n.gpb-root .activity-mark { width: 26px; height: 26px; border-radius: 7px; background: var(--accent-soft); display: grid; place-items: center; }\n.gpb-root .bars { display: flex; align-items: flex-end; gap: 2px; height: 13px; }\n.gpb-root .bars i { width: 2.5px; border-radius: 2px; background: var(--accent); animation: gpb-bar 1.05s ease-in-out infinite; }\n.gpb-root .bars i:nth-child(1) { height: 6px; }\n.gpb-root .bars i:nth-child(2) { height: 13px; animation-delay: 0.12s; }\n.gpb-root .bars i:nth-child(3) { height: 9px; animation-delay: 0.24s; }\n.gpb-root .activity-text { min-width: 0; display: flex; align-items: baseline; gap: 6px; }\n.gpb-root .activity-label { font-size: 12px; font-weight: 510; white-space: nowrap; }\n.gpb-root .activity-detail { font-family: var(--font-mono); font-size: 10px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.gpb-root .dots { display: inline-flex; gap: 2px; margin-left: 1px; }\n.gpb-root .dots i { width: 2.5px; height: 2.5px; border-radius: 50%; background: var(--muted); animation: gpb-dot 1.25s ease-in-out infinite; }\n.gpb-root .dots i:nth-child(2) { animation-delay: 0.15s; }\n.gpb-root .dots i:nth-child(3) { animation-delay: 0.3s; }\n\n/* approval card */\n.gpb-root .approval { background: var(--card); border: 1px solid var(--border); border-radius: 14px; box-shadow: var(--shadow-card); overflow: hidden; transition: border-color var(--motion-base), background-color var(--motion-base); }\n.gpb-root .ap-head { display: flex; align-items: center; gap: 6px; padding: 9px 13px 0; font-size: 10.5px; font-weight: 590; color: var(--muted); }\n.gpb-root .ap-head .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }\n.gpb-root .ap-head time { margin-left: auto; font-family: var(--font-mono); font-size: 10px; font-weight: 400; }\n.gpb-root .ap-body { padding: 6px 13px 12px; }\n.gpb-root .ap-title-row { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }\n.gpb-root .ap-title { font-size: 14px; font-weight: 590; line-height: 1.5; overflow-wrap: anywhere; }\n.gpb-root .ap-meta { margin-top: 2px; font-size: 11px; color: var(--muted); }\n.gpb-root .diff { margin: 9px 0 0; padding: 6px 9px; background: var(--surface-2); border-radius: 9px; display: flex; flex-direction: column; gap: 3px; list-style: none; }\n.gpb-root .diff li { display: flex; gap: 7px; align-items: baseline; font-size: 11.5px; line-height: 1.5; color: var(--fg-2); }\n.gpb-root .diff .op { font-family: var(--font-mono); font-size: 11px; width: 8px; flex: none; }\n.gpb-root .diff .op.add { color: var(--accent-text); }\n.gpb-root .diff .op.edit { color: var(--muted); }\n.gpb-root .ap-actions { display: flex; align-items: center; gap: 6px; margin-top: 11px; padding-top: 10px; border-top: 1px solid var(--hairline-2); flex-wrap: wrap; }\n.gpb-root .ap-actions .spacer { flex: 1; }\n.gpb-root .ap-actions .btn-plain { height: 28px; padding: 0 9px; border-radius: 7px; font-size: 12px; }\n.gpb-root .revise { margin-top: 10px; display: flex; flex-direction: column; gap: 7px; }\n.gpb-root .revise textarea { width: 100%; min-height: 52px; resize: vertical; padding: 7px 9px; border-radius: 8px; border: 1px solid var(--field-border); background: var(--window); font-size: 12.5px; line-height: 1.55; outline: none; }\n.gpb-root .revise textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }\n.gpb-root .revise textarea[aria-invalid=\"true\"] { border-color: var(--danger); }\n.gpb-root .revise-actions { display: flex; gap: 6px; justify-content: flex-end; }\n.gpb-root .approval.is-approved .ap-head { color: var(--success-text); }\n.gpb-root .approval.is-approved .ap-head .dot { background: var(--success); }\n.gpb-root .ap-done { display: flex; align-items: center; gap: 5px; margin-top: 10px; font-size: 11px; color: var(--muted); }\n.gpb-root .ap-done .ic { color: var(--success-text); }\n.gpb-root .approval.is-ignored { display: flex; align-items: center; gap: 8px; padding: 9px 13px; background: transparent; border-style: dashed; box-shadow: none; }\n.gpb-root .approval.is-ignored .ig-text { font-size: 12px; color: var(--muted); }\n.gpb-root .approval.is-ignored .btn-plain { margin-left: auto; height: 24px; padding: 0 7px; font-size: 11.5px; }\n.gpb-root .ap-note { margin-top: 9px; padding: 7px 9px; border-radius: 8px; background: var(--surface-2); font-size: 11.5px; line-height: 1.6; color: var(--fg-2); white-space: pre-wrap; overflow-wrap: anywhere; }\n.gpb-root .is-flash { animation: gpb-flash 1.15s var(--ease-standard); }\n\n/* empty state */\n.gpb-root .empty { max-width: 420px; margin: auto; padding: 44px 20px 60px; text-align: center; display: flex; flex-direction: column; align-items: center; }\n.gpb-root .empty-mark { width: 40px; height: 40px; border-radius: 11px; display: grid; place-items: center; background: var(--accent-soft); color: var(--accent); margin-bottom: 12px; }\n.gpb-root .empty h2 { font-size: 17px; font-weight: 590; line-height: 1.5; }\n.gpb-root .empty p { margin-top: 5px; font-size: 12.5px; line-height: 1.65; color: var(--muted); max-width: 32ch; }\n.gpb-root .starters { display: flex; flex-direction: column; gap: 6px; margin-top: 16px; width: 100%; max-width: 300px; }\n.gpb-root .starter { width: 100%; min-height: 36px; padding: 7px 11px; border-radius: 9px; border: 1px solid var(--border); background: var(--card); font-size: 12px; text-align: left; color: var(--fg-2); transition: background-color var(--motion-fast), border-color var(--motion-fast), transform var(--motion-fast); display: flex; align-items: center; gap: 7px; }\n.gpb-root .starter:hover { background: var(--surface-2); border-color: var(--border); }\n.gpb-root .starter:active { transform: scale(0.99); }\n.gpb-root .starter .ic { width: 13px; height: 13px; color: var(--muted); }\n.gpb-root .starter span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n\n/* composer */\n.gpb-root .composer-wrap { flex: 0 0 auto; padding: 8px 24px 11px; border-top: 1px solid var(--hairline-2); background: var(--thread); }\n.gpb-root .composer { max-width: 720px; margin: 0 auto; background: var(--card); border: 1px solid var(--border); border-radius: 13px; padding: 7px 8px 7px; box-shadow: var(--shadow-card); transition: border-color var(--motion-fast), box-shadow var(--motion-fast), background-color var(--motion-base); }\n.gpb-root .composer:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }\n.gpb-root .composer textarea { display: block; width: 100%; min-height: 34px; max-height: 120px; resize: none; border: 0; outline: none; background: transparent; padding: 5px 5px 2px; font-size: 13.5px; line-height: 1.55; color: var(--fg); }\n.gpb-root .composer textarea::placeholder { color: var(--muted); }\n.gpb-root .composer-bar { display: flex; align-items: center; gap: 2px; margin-top: 1px; }\n.gpb-root .composer-bar .icon-btn { width: 26px; height: 26px; }\n.gpb-root .composer-chip { display: inline-flex; align-items: center; gap: 4px; height: 24px; padding: 0 7px; border-radius: 6px; color: var(--muted); font-size: 10.5px; transition: background-color var(--motion-fast), color var(--motion-fast); }\n.gpb-root .composer-chip:hover { background: var(--fill-1); color: var(--fg); }\n.gpb-root .composer-chip .ic { width: 12px; height: 12px; }\n.gpb-root .send { width: 28px; height: 28px; border-radius: 50%; background: var(--btn-dark); color: var(--btn-dark-fg); display: grid; place-items: center; margin-left: 4px; transition: background-color var(--motion-fast), transform var(--motion-fast), opacity var(--motion-fast); }\n.gpb-root .send:hover { background: var(--btn-dark-hover); }\n.gpb-root .send:active { transform: scale(0.92); }\n.gpb-root .send[aria-disabled=\"true\"] { background: var(--fill-2); color: var(--muted); pointer-events: none; }\n.gpb-root .composer-note { max-width: 720px; margin: 5px auto 0; font-size: 10px; line-height: 1.5; color: var(--muted); display: flex; align-items: center; gap: 5px; }\n.gpb-root .composer-note .dot { width: 4px; height: 4px; border-radius: 50%; background: var(--muted); flex: none; }\n.gpb-root .composer-hint { margin-left: auto; display: flex; align-items: center; gap: 3px; font-size: 10px; color: var(--muted); }\n.gpb-root .composer { position: relative; }\n.gpb-root .at-glyph { font-size: 15px; font-weight: 590; line-height: 1; }\n.gpb-root .mention-pop { position: absolute; left: 6px; right: 6px; bottom: calc(100% + 8px); z-index: 70; max-height: 264px; overflow-y: auto; padding: 5px; background: color-mix(in oklab, var(--card) 96%, transparent); -webkit-backdrop-filter: blur(20px) saturate(180%); backdrop-filter: blur(20px) saturate(180%); border: 1px solid var(--hairline); border-radius: 12px; box-shadow: var(--shadow-pop); animation: gpb-popIn 150ms var(--ease-standard); }\n.gpb-root .mention-head { padding: 5px 8px 3px; font-size: 9.5px; font-weight: 590; color: var(--muted); letter-spacing: 0.02em; }\n.gpb-root .mention-row { width: 100%; display: grid; grid-template-columns: 24px minmax(0, 1fr) auto; align-items: center; gap: 8px; padding: 6px 8px; border-radius: 7px; text-align: left; }\n.gpb-root .mention-row:hover, .gpb-root .mention-row.is-cursor { background: var(--fill-1); }\n.gpb-root .mention-row .bot-avatar { width: 24px; height: 24px; border-radius: 6px; font-size: 12px; }\n.gpb-root .mention-row-icon { width: 24px; height: 24px; border-radius: 6px; display: grid; place-items: center; background: var(--fill-2); color: var(--muted); }\n.gpb-root .mention-row-text { min-width: 0; display: flex; flex-direction: column; }\n.gpb-root .mention-name { font-size: 12px; font-weight: 510; line-height: 1.4; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.gpb-root .mention-sub { font-size: 10px; color: var(--muted); line-height: 1.4; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.gpb-root .mention-empty { padding: 18px 10px; text-align: center; font-size: 11.5px; color: var(--muted); }\n.gpb-root .mention-foot { display: flex; align-items: center; gap: 4px; margin-top: 4px; padding: 6px 8px 4px; border-top: 1px solid var(--hairline-2); font-size: 10px; color: var(--muted); }\n.gpb-root .mention-foot .kbd { margin-left: 2px; }\n.gpb-root .mention-tags { display: flex; flex-wrap: wrap; gap: 4px; padding: 5px 5px 1px; }\n.gpb-root .mention-tag { display: inline-flex; align-items: center; gap: 4px; height: 22px; padding: 0 3px 0 5px; border-radius: 6px; background: var(--accent-soft); color: var(--accent-text); font-size: 10.5px; font-weight: 510; }\n.gpb-root .mention-tag.is-everyone { background: var(--fill-2); color: var(--fg-2); }\n.gpb-root .mention-tag .mt-avatar { width: 16px; height: 16px; border-radius: 4px; display: grid; place-items: center; font-size: 10px; background: var(--fill-2); }\n.gpb-root .mention-tag .ic { width: 12px; height: 12px; }\n.gpb-root .mention-tag .mt-name { max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.gpb-root .mt-x { width: 16px; height: 16px; border-radius: 4px; display: grid; place-items: center; color: inherit; opacity: 0.65; }\n.gpb-root .mt-x:hover { opacity: 1; background: color-mix(in oklab, currentColor 14%, transparent); }\n.gpb-root .mt-x .ic { width: 10px; height: 10px; }\n.gpb-root .msg-text .mention { display: inline; padding: 0 3px; border-radius: 4px; background: var(--accent-soft); color: var(--accent-text); font-weight: 510; }\n.gpb-root .msg-text .mention-all { background: var(--fill-2); color: var(--fg-2); font-weight: 590; }\n.gpb-root .msg-user .mention { display: inline; padding: 0 3px; border-radius: 4px; background: color-mix(in oklab, var(--bubble-fg) 16%, transparent); color: var(--bubble-fg); font-weight: 510; }\n.gpb-root .msg-user .mention-all { background: color-mix(in oklab, var(--bubble-fg) 26%, transparent); }\n\n/* ─── context panel ────────────────────────────────────────── */\n.gpb-root .context { display: flex; flex-direction: column; min-height: 0; border-left: 1px solid var(--hairline); background: var(--panel); -webkit-backdrop-filter: blur(24px) saturate(180%); backdrop-filter: blur(24px) saturate(180%); box-shadow: inset -1px 0 0 var(--highlight); }\n.gpb-root .ctx-head { flex: 0 0 var(--bar-h); height: var(--bar-h); display: flex; align-items: center; gap: 8px; padding: 0 12px; border-bottom: 1px solid var(--hairline); }\n.gpb-root .ctx-head .seg { flex: 1; }\n.gpb-root .ctx-close { display: none; }\n.gpb-root .ctx-body { flex: 1; min-height: 0; overflow-y: auto; padding: 12px; }\n.gpb-root .ctx-section-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 2px 2px 8px; }\n.gpb-root .ctx-section-head h3 { font-size: 11px; font-weight: 590; color: var(--muted); letter-spacing: 0.02em; font-family: var(--font-ui); }\n.gpb-root .ctx-section-head .count { font-family: var(--font-mono); font-size: 10px; color: var(--muted); }\n.gpb-root .ctx-group { background: var(--card); border: 1px solid var(--border-soft); border-radius: 11px; overflow: hidden; }\n.gpb-root .ctx-task { width: 100%; display: block; text-align: left; padding: 9px 11px; border-bottom: 1px solid var(--hairline-2); transition: background-color var(--motion-fast); }\n.gpb-root .ctx-task:last-child { border-bottom: 0; }\n.gpb-root .ctx-task:hover { background: var(--fill-1); }\n.gpb-root .ctx-task-top { display: flex; align-items: center; gap: 6px; }\n.gpb-root .ctx-task-title { font-size: 12px; font-weight: 510; line-height: 1.45; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.gpb-root .status-dot { width: 6px; height: 6px; border-radius: 50%; flex: none; background: var(--muted); }\n.gpb-root .status-dot.pending { background: var(--accent); }\n.gpb-root .status-dot.active { background: var(--success); }\n.gpb-root .status-dot.done { background: var(--meta); }\n.gpb-root .ctx-task-meta { margin-top: 2px; display: flex; align-items: center; gap: 5px; font-size: 10.5px; color: var(--muted); font-family: var(--font-mono); }\n.gpb-root .ctx-task-meta .tag { height: 18px; font-size: 10px; padding: 0 4px; border-radius: 4px; }\n.gpb-root .mem-update { display: flex; align-items: flex-start; gap: 6px; padding: 2px 2px 9px; font-size: 10.5px; line-height: 1.5; color: var(--muted); }\n.gpb-root .mem-update .ic { width: 12px; height: 12px; color: var(--accent); margin-top: 2px; flex: none; }\n.gpb-root .mem-list { background: var(--card); border: 1px solid var(--border-soft); border-radius: 11px; overflow: hidden; }\n.gpb-root .mem-row { padding: 8px 11px; border-bottom: 1px solid var(--hairline-2); }\n.gpb-root .mem-row:last-child { border-bottom: 0; }\n.gpb-root .mem-key { font-size: 10px; color: var(--muted); letter-spacing: 0.02em; }\n.gpb-root .mem-val { font-size: 11.5px; line-height: 1.55; color: var(--fg); margin-top: 1px; }\n.gpb-root .routine { background: var(--card); border: 1px solid var(--border-soft); border-radius: 11px; padding: 9px 11px 8px; margin-bottom: 8px; }\n.gpb-root .routine-head { display: flex; align-items: flex-start; gap: 8px; }\n.gpb-root .routine-title { font-size: 12px; font-weight: 510; line-height: 1.5; flex: 1; }\n.gpb-root .routine-meta { font-size: 10px; color: var(--muted); font-family: var(--font-mono); margin-top: 2px; }\n.gpb-root .routine-foot { display: flex; align-items: center; gap: 8px; margin-top: 7px; padding-top: 7px; border-top: 1px solid var(--hairline-2); }\n.gpb-root .routine-foot .runs { font-size: 10px; color: var(--muted); font-family: var(--font-mono); }\n.gpb-root .run-btn { margin-left: auto; display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 510; color: var(--accent-text); height: 24px; padding: 0 6px; border-radius: 6px; }\n.gpb-root .run-btn:hover { background: var(--accent-soft); color: var(--fg); }\n.gpb-root .run-btn .ic { width: 10px; height: 10px; }\n.gpb-root .path-row { padding: 8px 11px; border-bottom: 1px solid var(--hairline-2); }\n.gpb-root .path-row:last-child { border-bottom: 0; }\n.gpb-root .path-label { font-size: 10px; color: var(--muted); }\n.gpb-root .path-value { display: flex; align-items: center; gap: 6px; margin-top: 1px; }\n.gpb-root .path-value code { font-family: var(--font-mono); font-size: 10.5px; color: var(--fg-2); min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.gpb-root .copy-btn { width: 20px; height: 20px; border-radius: 5px; display: grid; place-items: center; color: var(--muted); margin-left: auto; flex: none; }\n.gpb-root .copy-btn:hover { background: var(--fill-2); color: var(--fg); }\n.gpb-root .copy-btn .ic { width: 11px; height: 11px; }\n.gpb-root .file-row { width: 100%; display: grid; grid-template-columns: 20px minmax(0, 1fr) auto; align-items: center; gap: 7px; padding: 7px 11px; border-bottom: 1px solid var(--hairline-2); text-align: left; }\n.gpb-root .file-row:last-child { border-bottom: 0; }\n.gpb-root .file-row .ic { width: 14px; height: 14px; color: var(--muted); }\n.gpb-root .file-name { font-family: var(--font-mono); font-size: 10.5px; color: var(--fg); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.gpb-root .file-meta { font-size: 10px; color: var(--muted); font-family: var(--font-mono); }\n.gpb-root .ctx-foot { padding: 6px 0 0; }\n.gpb-root .ctx-foot .btn { width: 100%; }\n.gpb-root .ctx-link { width: 100%; height: 30px; display: flex; align-items: center; justify-content: center; gap: 4px; border-radius: 7px; font-size: 11px; color: var(--muted); }\n.gpb-root .ctx-link:hover { background: var(--fill-1); color: var(--fg); }\n.gpb-root .ctx-link .ic { width: 11px; height: 11px; }\n.gpb-root .ctx-empty { padding: 28px 12px; text-align: center; color: var(--muted); font-size: 11.5px; line-height: 1.6; }\n\n/* ─── pages ────────────────────────────────────────────────── */\n.gpb-root .page { flex: 1; min-width: 0; overflow-y: auto; background: var(--page-bg); transition: background-color var(--motion-base) var(--ease-standard); }\n.gpb-root .page-inner { max-width: 980px; margin: 0 auto; padding: 26px 40px 48px; }\n.gpb-root .page-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; }\n.gpb-root .page-title { font-size: 28px; line-height: 1.35; font-weight: 590; letter-spacing: 0; }\n.gpb-root .page-sub { margin-top: 4px; max-width: 64ch; font-size: 13px; color: var(--muted); line-height: 1.55; }\n.gpb-root .page-head .btn { flex: none; margin-bottom: 2px; }\n.gpb-root .filter-bar { display: flex; align-items: center; gap: 12px; margin-top: 18px; flex-wrap: wrap; }\n.gpb-root .filter-bar .seg { background: var(--fill-1); }\n.gpb-root .filter-bar .seg button { padding: 0 12px; }\n.gpb-root .filter-note { margin-left: auto; font-size: 11px; color: var(--muted); font-family: var(--font-mono); }\n.gpb-root .group-label { display: flex; align-items: center; gap: 7px; margin: 22px 4px 7px; font-size: 11px; font-weight: 590; color: var(--muted); letter-spacing: 0.02em; }\n.gpb-root .group-label .n { font-family: var(--font-mono); font-size: 10px; font-weight: 400; color: var(--muted); }\n.gpb-root .list-card { background: var(--card); border: 1px solid var(--border-soft); border-radius: 13px; overflow: hidden; box-shadow: var(--shadow-card); }\n.gpb-root .task-row { display: grid; grid-template-columns: 32px minmax(0, 1fr) auto; align-items: center; gap: 12px; min-height: 64px; padding: 10px 15px; border-bottom: 1px solid var(--hairline-2); }\n.gpb-root .task-row:last-child { border-bottom: 0; }\n.gpb-root .task-row:hover { background: var(--fill-1); }\n.gpb-root .task-row .bot-avatar { width: 32px; height: 32px; border-radius: 8px; font-size: 15px; }\n.gpb-root .task-title { font-size: 13px; font-weight: 590; line-height: 1.5; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; overflow-wrap: anywhere; }\n.gpb-root .task-meta { margin-top: 2px; display: flex; align-items: center; gap: 5px; flex-wrap: wrap; font-size: 10.5px; color: var(--muted); line-height: 1.5; }\n.gpb-root .task-meta .sep { width: 2px; height: 2px; border-radius: 50%; background: var(--meta); }\n.gpb-root .task-actions { display: flex; align-items: center; gap: 6px; justify-content: flex-end; }\n.gpb-root .task-status { display: inline-flex; align-items: center; gap: 5px; font-size: 10.5px; color: var(--muted); font-family: var(--font-mono); white-space: nowrap; }\n.gpb-root .task-status.pending { color: var(--accent-text); }\n.gpb-root .task-status.active { color: var(--success-text); }\n.gpb-root .task-empty { padding: 44px 20px; text-align: center; color: var(--muted); font-size: 12.5px; }\n\n/* marketplace / skills */\n.gpb-root .tool-row { display: flex; align-items: center; gap: 10px; margin-top: 18px; flex-wrap: wrap; }\n.gpb-root .search-field { position: relative; display: flex; align-items: center; width: 236px; }\n.gpb-root .search-field .ic { position: absolute; left: 9px; width: 13px; height: 13px; color: var(--muted); pointer-events: none; }\n.gpb-root .search-field input { width: 100%; height: 30px; padding: 0 10px 0 28px; border-radius: 8px; border: 1px solid var(--field-border); background: var(--card); font-size: 12px; color: var(--fg); outline: none; transition: border-color var(--motion-fast), box-shadow var(--motion-fast); }\n.gpb-root .search-field input::placeholder { color: var(--muted); }\n.gpb-root .search-field input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }\n.gpb-root .chips { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; }\n.gpb-root .chip { height: 27px; padding: 0 10px; border-radius: 7px; font-size: 11.5px; font-weight: 510; color: var(--muted); background: transparent; border: 1px solid transparent; transition: background-color var(--motion-fast), color var(--motion-fast), border-color var(--motion-fast); }\n.gpb-root .chip:hover { background: var(--fill-1); color: var(--fg); }\n.gpb-root .chip[aria-pressed=\"true\"] { background: var(--chip-on); color: var(--chip-on-fg); font-weight: 590; }\n.gpb-root .card-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-top: 16px; }\n.gpb-root .bot-card { display: flex; flex-direction: column; min-height: 196px; padding: 14px; background: var(--card); border: 1px solid var(--border-soft); border-radius: 13px; box-shadow: var(--shadow-card); transition: transform var(--motion-fast) var(--ease-standard), box-shadow var(--motion-fast), border-color var(--motion-fast); }\n.gpb-root .bot-card:hover { transform: translateY(-1px); box-shadow: var(--shadow-raise); border-color: var(--border); }\n.gpb-root .bc-head { display: flex; align-items: flex-start; gap: 10px; }\n.gpb-root .bc-head .bot-avatar { width: 40px; height: 40px; border-radius: 10px; font-size: 20px; }\n.gpb-root .bc-name { font-size: 13.5px; font-weight: 590; line-height: 1.4; }\n.gpb-root .bc-role { font-size: 10.5px; color: var(--muted); line-height: 1.45; margin-top: 1px; }\n.gpb-root .bc-desc { margin-top: 9px; font-size: 12px; line-height: 1.65; color: var(--muted); flex: 1; overflow-wrap: anywhere; }\n.gpb-root .bc-foot { display: flex; align-items: center; gap: 8px; margin-top: 11px; padding-top: 10px; border-top: 1px solid var(--hairline-2); }\n.gpb-root .bc-meta { font-size: 10px; color: var(--muted); font-family: var(--font-mono); }\n.gpb-root .bc-foot .btn { margin-left: auto; }\n.gpb-root .skill-card { display: flex; flex-direction: column; min-height: 250px; padding: 14px; background: var(--card); border: 1px solid var(--border-soft); border-radius: 13px; box-shadow: var(--shadow-card); transition: transform var(--motion-fast) var(--ease-standard), box-shadow var(--motion-fast), border-color var(--motion-fast); }\n.gpb-root .skill-card:hover { transform: translateY(-1px); box-shadow: var(--shadow-raise); border-color: var(--border); }\n.gpb-root .sk-top { display: flex; align-items: flex-start; gap: 8px; }\n.gpb-root .sk-title { font-size: 13.5px; font-weight: 590; line-height: 1.4; flex: 1; }\n.gpb-root .sk-body { margin-top: 8px; flex: 1; }\n.gpb-root .sk-label { font-size: 10px; color: var(--muted); letter-spacing: 0.02em; margin-top: 7px; }\n.gpb-root .sk-when { font-size: 12px; line-height: 1.6; color: var(--fg-2); }\n.gpb-root .sk-steps { list-style: none; margin: 2px 0 0; padding: 0; display: flex; flex-direction: column; gap: 3px; counter-reset: step; }\n.gpb-root .sk-steps li { display: grid; grid-template-columns: 14px minmax(0, 1fr); gap: 5px; font-size: 11.5px; line-height: 1.55; color: var(--muted); }\n.gpb-root .sk-steps .n { font-family: var(--font-mono); font-size: 10px; color: var(--muted); padding-top: 1px; }\n.gpb-root .sk-foot { display: flex; align-items: center; gap: 6px; margin-top: 10px; padding-top: 8px; border-top: 1px solid var(--hairline-2); }\n.gpb-root .sk-users { font-size: 10px; color: var(--muted); font-family: var(--font-mono); }\n.gpb-root .sk-del { margin-left: auto; display: inline-flex; align-items: center; gap: 4px; height: 24px; padding: 0 6px; border-radius: 6px; font-size: 10.5px; color: var(--muted); }\n.gpb-root .sk-del:hover { color: var(--danger-text); background: color-mix(in oklab, var(--danger) 9%, transparent); }\n.gpb-root .sk-del .ic { width: 11px; height: 11px; }\n.gpb-root .grid-empty { grid-column: 1 / -1; padding: 48px 20px; text-align: center; font-size: 12px; color: var(--muted); border: 1px dashed var(--border); border-radius: 12px; }\n\n/* ─── popover ──────────────────────────────────────────────── */\n.gpb-root .popover { position: absolute; top: 84px; right: 78px; z-index: 90; width: 380px; max-width: calc(100vw - 24px); background: color-mix(in oklab, var(--card) 92%, transparent); -webkit-backdrop-filter: blur(28px) saturate(180%); backdrop-filter: blur(28px) saturate(180%); border: 1px solid var(--hairline); border-radius: 12px; box-shadow: var(--shadow-pop); overflow: hidden; animation: gpb-popIn 180ms var(--ease-standard); }\n.gpb-root .pop-search { display: flex; align-items: center; gap: 7px; padding: 9px 11px; border-bottom: 1px solid var(--hairline); }\n.gpb-root .pop-search .ic { width: 14px; height: 14px; color: var(--muted); flex: none; }\n.gpb-root .pop-search input { flex: 1; min-width: 0; border: 0; outline: none; background: transparent; font-size: 13px; height: 22px; color: var(--fg); }\n.gpb-root .pop-search input::placeholder { color: var(--muted); }\n.gpb-root .pop-body { max-height: 380px; overflow-y: auto; padding: 5px; }\n.gpb-root .pop-group { padding: 6px 8px 3px; font-size: 9.5px; font-weight: 590; color: var(--muted); letter-spacing: 0.02em; }\n.gpb-root .pop-row { width: 100%; display: grid; grid-template-columns: 24px minmax(0, 1fr) auto; align-items: center; gap: 8px; padding: 6px 8px; border-radius: 7px; text-align: left; }\n.gpb-root .pop-row:hover, .gpb-root .pop-row.is-cursor { background: var(--fill-1); }\n.gpb-root .pop-row .bot-avatar, .gpb-root .pop-row .pop-icon { width: 24px; height: 24px; border-radius: 6px; font-size: 12px; }\n.gpb-root .pop-icon { display: grid; place-items: center; background: var(--fill-2); color: var(--muted); }\n.gpb-root .pop-icon .ic { width: 13px; height: 13px; }\n.gpb-root .pop-name { display: block; font-size: 12px; font-weight: 510; line-height: 1.4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.gpb-root .pop-sub { display: block; font-size: 10px; color: var(--muted); line-height: 1.4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.gpb-root .pop-empty { padding: 26px 12px; text-align: center; font-size: 11.5px; color: var(--muted); }\n.gpb-root .pop-foot { display: flex; align-items: center; gap: 8px; padding: 7px 10px; border-top: 1px solid var(--hairline); font-size: 10px; color: var(--muted); }\n.gpb-root .pop-foot .kbd { margin-left: 3px; }\n\n/* ─── sheets ───────────────────────────────────────────────── */\n.gpb-root .modal-layer { position: absolute; inset: 0; z-index: 100; display: flex; align-items: center; justify-content: center; padding: 24px; }\n.gpb-root .modal-backdrop { position: absolute; inset: 0; background: var(--scrim); -webkit-backdrop-filter: blur(10px) saturate(120%); backdrop-filter: blur(10px) saturate(120%); opacity: 0; transition: opacity 240ms var(--ease-standard); }\n.gpb-root .sheet { position: relative; z-index: 1; width: 600px; max-width: 100%; max-height: calc(100% - 48px); display: flex; flex-direction: column; background: var(--card); border: 1px solid var(--hairline); border-radius: 16px; box-shadow: var(--shadow-sheet); opacity: 0; transform: translateY(10px) scale(0.985); transition: opacity 240ms var(--ease-standard), transform 240ms var(--ease-standard); }\n.gpb-root .sheet-wide { width: 620px; }\n.gpb-root .modal-layer.is-open .modal-backdrop { opacity: 1; }\n.gpb-root .modal-layer.is-open .sheet { opacity: 1; transform: none; }\n.gpb-root .sheet-head { display: flex; align-items: flex-start; gap: 16px; padding: 20px 22px 14px; }\n.gpb-root .sheet-head h2 { font-size: 17px; line-height: 1.4; font-weight: 590; }\n.gpb-root .sheet-head p { margin-top: 3px; font-size: 12px; line-height: 1.55; color: var(--muted); max-width: 48ch; }\n.gpb-root .sheet-head .icon-btn { margin-left: auto; background: var(--fill-1); border-radius: 50%; width: 26px; height: 26px; flex: none; }\n.gpb-root .sheet-body { padding: 0 22px 18px; overflow-y: auto; min-height: 0; display: flex; flex-direction: column; gap: 13px; }\n.gpb-root .sheet-foot { display: flex; align-items: center; gap: 7px; padding: 13px 22px; border-top: 1px solid var(--hairline); background: color-mix(in oklab, var(--card) 94%, transparent); border-radius: 0 0 16px 16px; }\n.gpb-root .sheet-foot .hint { margin-right: auto; font-size: 10px; color: var(--muted); line-height: 1.5; }\n.gpb-root .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 11px; }\n.gpb-root .field { display: flex; flex-direction: column; gap: 5px; border: 0; padding: 0; margin: 0; min-width: 0; }\n.gpb-root .field > span, .gpb-root .field > legend { font-size: 10.5px; font-weight: 510; color: var(--muted); letter-spacing: 0.02em; padding: 0; }\n.gpb-root .field input, .gpb-root .field textarea, .gpb-root .field select { width: 100%; height: 34px; padding: 0 10px; border-radius: 8px; border: 1px solid var(--field-border); background: var(--window); color: var(--fg); font-size: 13px; outline: none; transition: border-color var(--motion-fast), box-shadow var(--motion-fast); }\n.gpb-root .field textarea { height: auto; min-height: 62px; padding: 8px 10px; resize: vertical; line-height: 1.55; }\n.gpb-root .field select { appearance: none; background-image: linear-gradient(45deg, transparent 50%, var(--muted) 50%), linear-gradient(135deg, var(--muted) 50%, transparent 50%); background-position: calc(100% - 14px) 14px, calc(100% - 10px) 14px; background-size: 4px 4px, 4px 4px; background-repeat: no-repeat; padding-right: 28px; }\n.gpb-root .field input::placeholder, .gpb-root .field textarea::placeholder, .gpb-root .step-row input::placeholder { color: var(--muted); }\n.gpb-root .field input:focus, .gpb-root .field textarea:focus, .gpb-root .field select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }\n.gpb-root .field input[aria-invalid=\"true\"] { border-color: var(--danger); }\n.gpb-root .field-error { font-size: 10.5px; line-height: 1.5; color: var(--danger-text); }\n.gpb-root .emoji-grid { display: flex; gap: 6px; flex-wrap: wrap; }\n.gpb-root .emoji-opt { width: 34px; height: 34px; border-radius: 8px; border: 1px solid var(--border); background: var(--window); font-size: 17px; display: grid; place-items: center; transition: border-color var(--motion-fast), background-color var(--motion-fast), transform var(--motion-fast); }\n.gpb-root .emoji-opt:hover { background: var(--surface-2); }\n.gpb-root .emoji-opt[aria-pressed=\"true\"] { border-color: var(--accent); background: var(--accent-soft); box-shadow: 0 0 0 2px var(--accent-soft); }\n.gpb-root .swatches { display: flex; gap: 9px; align-items: center; }\n.gpb-root .swatch { width: 22px; height: 22px; border-radius: 50%; background: var(--sw); position: relative; transition: transform var(--motion-fast); }\n.gpb-root .swatch:hover { transform: scale(1.08); }\n.gpb-root .swatch[aria-pressed=\"true\"]::after { content: \"\"; position: absolute; inset: -4px; border-radius: 50%; border: 1.5px solid var(--accent); }\n.gpb-root .swatch .ic { position: absolute; inset: 0; margin: auto; width: 11px; height: 11px; color: var(--accent-on); opacity: 0; }\n.gpb-root .swatch[aria-pressed=\"true\"] .ic { opacity: 1; }\n.gpb-root .sw-1 { --sw: var(--sw-1); } .gpb-root .sw-2 { --sw: var(--sw-2); } .gpb-root .sw-3 { --sw: var(--sw-3); }\n.gpb-root .sw-4 { --sw: var(--sw-4); } .gpb-root .sw-5 { --sw: var(--sw-5); } .gpb-root .sw-6 { --sw: var(--sw-6); }\n.gpb-root .bot-preview { display: flex; align-items: center; gap: 10px; padding: 9px 11px; border-radius: 10px; background: var(--surface-2); border: 1px solid var(--hairline-2); }\n.gpb-root .bot-preview .bot-avatar { width: 34px; height: 34px; border-radius: 9px; font-size: 17px; }\n.gpb-root .bp-name { font-size: 12.5px; font-weight: 590; line-height: 1.4; }\n.gpb-root .bp-label { font-size: 10.5px; color: var(--muted); line-height: 1.4; }\n.gpb-root .bot-pick { display: flex; gap: 6px; flex-wrap: wrap; }\n.gpb-root .bot-pick button { display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 9px 0 5px; border-radius: 8px; border: 1px solid var(--border); font-size: 11.5px; font-weight: 510; color: var(--fg-2); transition: border-color var(--motion-fast), background-color var(--motion-fast); }\n.gpb-root .bot-pick button:hover { background: var(--fill-1); }\n.gpb-root .bot-pick button[aria-pressed=\"true\"] { border-color: var(--accent); background: var(--accent-soft); color: var(--fg); }\n.gpb-root .bot-pick .bot-avatar { width: 22px; height: 22px; border-radius: 6px; font-size: 12px; }\n.gpb-root .steps { display: flex; flex-direction: column; gap: 6px; }\n.gpb-root .step-row { display: grid; grid-template-columns: 20px minmax(0, 1fr) 24px; align-items: center; gap: 6px; }\n.gpb-root .step-row .n { font-family: var(--font-mono); font-size: 10px; color: var(--muted); text-align: center; }\n.gpb-root .step-row input { width: 100%; height: 32px; padding: 0 9px; border-radius: 7px; border: 1px solid var(--field-border); background: var(--window); font-size: 12.5px; outline: none; }\n.gpb-root .step-row input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }\n.gpb-root .step-del { width: 24px; height: 24px; border-radius: 6px; display: grid; place-items: center; color: var(--muted); }\n.gpb-root .step-del:hover { background: var(--fill-2); color: var(--fg); }\n.gpb-root .add-step { align-self: flex-start; display: inline-flex; align-items: center; gap: 4px; height: 26px; padding: 0 8px; border-radius: 6px; font-size: 11px; color: var(--accent-text); }\n.gpb-root .add-step:hover { background: var(--accent-soft); color: var(--fg); }\n.gpb-root .add-step .ic { width: 11px; height: 11px; }\n\n/* ─── toast ────────────────────────────────────────────────── */\n.gpb-root .toast { position: absolute; left: 50%; bottom: 132px; transform: translate(-50%, 10px); z-index: 200; display: flex; align-items: center; gap: 10px; min-height: 34px; padding: 7px 10px 7px 13px; border-radius: 10px; background: var(--toast-bg); color: var(--toast-fg); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3); font-size: 12px; opacity: 0; pointer-events: none; transition: opacity var(--motion-base) var(--ease-standard), transform var(--motion-base) var(--ease-standard); max-width: calc(100vw - 32px); }\n.gpb-root .toast.is-on { opacity: 1; transform: translate(-50%, 0); pointer-events: auto; }\n.gpb-root .toast .ic { width: 13px; height: 13px; color: var(--toast-action); }\n.gpb-root .toast-action { color: var(--toast-action); font-size: 11.5px; font-weight: 590; padding: 2px 5px; border-radius: 4px; }\n.gpb-root .toast-action:hover { background: color-mix(in oklab, var(--toast-fg) 12%, transparent); }\n\n/* mobile navigation + scrims */\n.gpb-root .mobile-tabs { display: none; }\n.gpb-root .drawer-scrim, .gpb-root .ctx-scrim { position: absolute; inset: 0; z-index: 35; background: var(--scrim); -webkit-backdrop-filter: blur(2px); backdrop-filter: blur(2px); }\n.gpb-root .ctx-scrim { z-index: 25; }\n.gpb-root .menu-btn { display: none; }\n\n/* ─── responsive ───────────────────────────────────────────── */\n@media (max-width: 1180px) {\n  .gpb-root .workbench { grid-template-columns: minmax(0, 1fr); }\n  .gpb-root .context { position: absolute; top: 0; right: 0; bottom: 0; width: var(--ctx-w); z-index: 30; transform: translateX(102%); transition: transform var(--motion-base) var(--ease-standard), background-color var(--motion-base); box-shadow: var(--shadow-pop); }\n  .gpb-root .context.is-open { transform: none; }\n  .gpb-root .ctx-toggle, .gpb-root .ctx-close { display: inline-flex; }\n}\n@media (max-width: 1080px) {\n  .gpb-root .page-inner { max-width: 100%; padding: 24px 28px 44px; }\n  .gpb-root .card-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n}\n@media (max-width: 960px) {\n  .gpb-root .app-body { grid-template-columns: minmax(0, 1fr); }\n  .gpb-root .sidebar { position: absolute; top: 0; left: 0; bottom: 0; width: var(--side-w); z-index: 40; transform: translateX(-102%); transition: transform var(--motion-base) var(--ease-standard); box-shadow: var(--shadow-pop); }\n  .gpb-root .sidebar.is-open { transform: none; }\n  .gpb-root .menu-btn { display: inline-flex; }\n  .gpb-root .traffic { display: none; }\n  .gpb-root .tb-sep { display: none; }\n}\n@media (max-width: 820px) {\n  .gpb-root .desktop { padding: 0; }\n  .gpb-root .window { border-radius: 0; border: 0; }\n  .gpb-root .toolbar { padding: 0 10px; gap: 10px; }\n  .gpb-root .app-title { font-size: 19px; }\n  .gpb-root .popover { top: 64px; }\n  .gpb-root .seg button { padding: 0 9px; font-size: 12px; }\n  .gpb-root .appearance { display: none; }\n  .gpb-root .theme-single { display: inline-flex; }\n  .gpb-root .page-inner { padding: 20px 20px 96px; }\n  .gpb-root .page-title { font-size: 24px; }\n  .gpb-root .page-head { align-items: flex-start; }\n  .gpb-root .page-head .btn { margin-top: 2px; }\n  .gpb-root .thread-inner { padding: 14px 18px 8px; }\n  .gpb-root .composer-wrap { padding: 8px 14px 10px; }\n  .gpb-root .composer-hint { display: none; }\n  .gpb-root .msg-user { max-width: 88%; }\n}\n@media (max-width: 760px) {\n  .gpb-root .window { grid-template-rows: 52px minmax(0, 1fr) calc(54px + env(safe-area-inset-bottom)); }\n  .gpb-root { --bar-h: 52px; }\n  .gpb-root .tb-center { display: none; }\n  .gpb-root .tb-right .avatar-me { display: none; }\n  .gpb-root .toolbar { grid-template-columns: minmax(0, 1fr) auto; }\n  .gpb-root .mobile-tabs { display: grid; grid-template-columns: repeat(4, 1fr); align-items: center; background: var(--chrome); -webkit-backdrop-filter: blur(24px) saturate(180%); backdrop-filter: blur(24px) saturate(180%); border-top: 1px solid var(--hairline); box-shadow: inset 0 1px 0 var(--highlight); padding: 2px 6px calc(2px + env(safe-area-inset-bottom)); z-index: 45; }\n  .gpb-root .mobile-tabs button { min-height: 44px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; font-size: 10px; font-weight: 510; color: var(--muted); border-radius: 8px; }\n  .gpb-root .mobile-tabs button .ic { width: 18px; height: 18px; }\n  .gpb-root .mobile-tabs button[aria-current=\"page\"] { color: var(--accent-text); }\n  .gpb-root .thread-head { padding: 0 12px; }\n  .gpb-root .th-actions .tag { display: none; }\n  .gpb-root .card-grid { grid-template-columns: 1fr; }\n  .gpb-root .form-grid { grid-template-columns: 1fr; }\n  .gpb-root .sheet { border-radius: 14px; max-height: calc(100% - 24px); }\n  .gpb-root .emoji-grid { gap: 5px; }\n  .gpb-root .emoji-opt { width: 32px; height: 32px; }\n  .gpb-root .modal-layer { padding: 12px; }\n  .gpb-root .sheet-head { padding: 16px 16px 12px; }\n  .gpb-root .sheet-body { padding: 0 16px 16px; }\n  .gpb-root .sheet-foot { padding: 12px 16px; border-radius: 0 0 14px 14px; }\n  .gpb-root .sheet-foot .hint { display: none; }\n  .gpb-root .search-field { width: 100%; }\n  .gpb-root .tool-row .chips { width: 100%; overflow-x: auto; flex-wrap: nowrap; padding-bottom: 2px; }\n  .gpb-root .task-row { grid-template-columns: 30px minmax(0, 1fr); gap: 10px; padding: 11px 13px; }\n  .gpb-root .task-actions { grid-column: 2; justify-content: flex-start; }\n  .gpb-root .page-head { flex-direction: column; gap: 10px; }\n  .gpb-root .task-meta { font-size: 10px; }\n  .gpb-root .toolbar .icon-btn { width: 34px; height: 34px; }\n  .gpb-root .send { width: 40px; height: 40px; }\n  .gpb-root .ap-actions .btn-28, .gpb-root .revise-actions .btn-28 { height: 34px; }\n  .gpb-root .chip { height: 32px; }\n  .gpb-root .filter-bar .seg button { min-height: 32px; }\n  .gpb-root .search-field input { height: 36px; }\n  .gpb-root .field input, .gpb-root .field select, .gpb-root .step-row input { min-height: 38px; }\n  .gpb-root .field input, .gpb-root .field textarea, .gpb-root .field select, .gpb-root .search-field input, .gpb-root .step-row input, .gpb-root .composer textarea { font-size: 16px; }\n  .gpb-root .composer .icon-btn { width: 32px; height: 32px; }\n  .gpb-root .composer-chip { height: 28px; }\n  .gpb-root .sheet-foot .btn { height: 40px; padding: 0 15px; }\n  .gpb-root .sheet-head .icon-btn { width: 32px; height: 32px; }\n  .gpb-root .nav-row { min-height: 48px; }\n  .gpb-root .nav-link { min-height: 44px; }\n  .gpb-root .task-actions .btn-24 { height: 34px; padding: 0 12px; font-size: 12px; }\n  .gpb-root .starter { min-height: 42px; }\n  .gpb-root .copy-btn { width: 28px; height: 28px; }\n  .gpb-root .popover { top: 58px; right: 10px; left: 10px; width: auto; max-width: none; }\n  .gpb-root .toast { bottom: 188px; }\n}\n@media (max-width: 420px) {\n  .gpb-root .toolbar { padding: 0 8px; }\n  .gpb-root .app-title { font-size: 18px; }\n  .gpb-root .tb-left { gap: 6px; }\n  .gpb-root .tb-right { gap: 2px; }\n  .gpb-root .thread-inner { padding: 12px 14px 6px; }\n  .gpb-root .thread-head { gap: 8px; }\n  .gpb-root .msg-user { max-width: 92%; }\n  .gpb-root .ap-actions .spacer { flex-basis: 100%; height: 0; }\n  .gpb-root .ap-actions .btn-plain { margin-left: auto; }\n  .gpb-root .page-inner { padding: 16px 14px 96px; }\n  .gpb-root .empty { padding: 28px 8px 40px; }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .gpb-root *, .gpb-root *::before, .gpb-root *::after { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }\n  .gpb-root .pulse::after { display: none; }\n}\n\n@keyframes gpb-pulse { 0% { transform: scale(0.7); opacity: 0.6; } 70% { transform: scale(1.6); opacity: 0; } 100% { opacity: 0; } }\n@keyframes gpb-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }\n@keyframes gpb-bar { 0%, 100% { transform: scaleY(0.55); } 50% { transform: scaleY(1); } }\n@keyframes gpb-dot { 0%, 100% { opacity: 0.25; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-1px); } }\n@keyframes gpb-msgIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }\n@keyframes gpb-popIn { from { opacity: 0; transform: translateY(-4px) scale(0.99); } to { opacity: 1; transform: none; } }\n@keyframes gpb-flash { 0%, 100% { box-shadow: var(--shadow-card); } 30% { box-shadow: 0 0 0 3px var(--accent-soft-2); } }\n.gpb-root { position: relative; height: 100%; overflow: hidden; background: var(--window); }\n.gpb-root .desktop { padding: 0; height: 100%; background: var(--window); }\n.gpb-root .window { height: 100%; border: 0; border-radius: 0; box-shadow: none; }\n.gpb-root .traffic, .gpb-root .tb-sep, .gpb-root .appearance, .gpb-root .theme-single { display: none; }\n.gpb-root .popover { position: absolute; top: 58px; right: 12px; }\n.gpb-root .modal-layer { position: absolute; }\n.gpb-root .toast { position: absolute; bottom: 20px; }\n.gpb-root .sheet { max-height: calc(100% - 32px); }\n.gpb-root .msg-text p + p { margin-top: 7px; }\n.gpb-root .msg-text ul, .gpb-root .msg-text ol { margin: 5px 0 2px; padding-left: 17px; display: flex; flex-direction: column; gap: 3px; }\n.gpb-root .msg-text pre { margin: 6px 0; padding: 9px 11px; background: var(--surface-2); border-radius: 8px; overflow-x: auto; font-family: var(--font-mono); font-size: 11px; line-height: 1.55; }\n.gpb-root .msg-text code { font-family: var(--font-mono); font-size: 11.5px; background: var(--fill-1); padding: 1px 4px; border-radius: 4px; }\n.gpb-root .msg-text strong { color: var(--fg); font-weight: 590; }\n.gpb-root .ap-note { margin-top: 8px; font-size: 11px; line-height: 1.5; color: var(--muted); }\n.gpb-root .is-flash { animation: gpb-flash 1.3s var(--ease-standard); }\n.gpb-root .preview-text { margin: 0; white-space: pre-wrap; overflow-wrap: anywhere; font-family: var(--font-mono); font-size: 11px; line-height: 1.6; color: var(--fg-2); background: var(--surface-2); border: 1px solid var(--hairline); border-radius: 10px; padding: 12px; max-height: 46vh; overflow: auto; }\n.gpb-root .gpb-loading, .gpb-root .gpb-error { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; color: var(--muted); font-size: 13px; }\n.gpb-root .member-row { display: flex; align-items: center; gap: 9px; padding: 8px 11px; border-bottom: 1px solid var(--hairline-2); }\n.gpb-root .member-row:last-child { border-bottom: 0; }\n.gpb-root .member-name { font-size: 12px; font-weight: 510; }\n.gpb-root .member-role { font-size: 10.5px; color: var(--muted); }\n.gpb-root .group-member-pick { display: flex; flex-direction: column; border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }\n.gpb-root .group-member-pick label { display: flex; align-items: center; gap: 9px; padding: 8px 11px; border-bottom: 1px solid var(--hairline-2); cursor: pointer; font-size: 12px; }\n.gpb-root .group-member-pick label:last-child { border-bottom: 0; }\n.gpb-root .group-member-pick input { accent-color: var(--accent); }\n@media (max-width: 760px) { .gpb-root .mention-row { min-height: 40px; } .gpb-root .mention-tag { height: 26px; } .gpb-root .mt-x { width: 20px; height: 20px; } .gpb-root .mention-pop { max-height: 46vh; } }\n\n/* ─── heartbeat ───────────────────────────────────────────── */\n.gpb-root .seg-5 { display: flex; width: 100%; }\n.gpb-root .seg-5 button { flex: 1; min-width: 0; padding: 0 3px; font-size: 11px; overflow: hidden; text-overflow: ellipsis; }\n.gpb-root .hb-tags { display: inline-flex; flex-wrap: wrap; gap: 4px; align-items: center; }\n.gpb-root .hb-block { padding: 10px 11px; border: 1px solid var(--border-soft); border-radius: 11px; background: var(--card); gap: 9px; }\n.gpb-root .hb-block-head { display: flex; align-items: flex-start; gap: 10px; }\n.gpb-root .hb-block-head .hb-label { flex: 1; min-width: 0; }\n.gpb-root .hb-label { display: flex; flex-direction: column; gap: 2px; min-width: 0; }\n.gpb-root .hb-label > span:first-child { font-size: 12px; font-weight: 510; color: var(--fg); }\n.gpb-root .hb-sub { font-size: 10.5px; line-height: 1.5; color: var(--muted); }\n.gpb-root .hb-quiet-row { display: flex; align-items: center; gap: 9px; min-height: 34px; }\n.gpb-root .hb-global { display: flex; flex-direction: column; gap: 10px; padding: 10px 11px; border: 1px solid var(--border-soft); border-radius: 11px; background: var(--card); }\n.gpb-root .hb-switch-row { display: flex; align-items: center; gap: 10px; }\n.gpb-root .hb-switch-row .hb-label { flex: 1; }\n.gpb-root .hb-checkin { border-color: var(--accent-soft-2); }\n.gpb-root .hb-question { margin: 8px 0 0; padding: 8px 10px; border-radius: 9px; border: 1px solid var(--hairline-2); background: var(--surface-2); max-height: 172px; overflow-y: auto; font-size: 12.5px; line-height: 1.6; color: var(--fg-2); white-space: pre-wrap; overflow-wrap: anywhere; }\n.gpb-root .nav-row.is-checking .nav-sub { color: var(--accent-text); }\n.gpb-root .activity.is-checking .activity-mark { background: var(--fill-2); color: var(--accent-text); }\n@media (max-width: 760px) {\n  .gpb-root .seg-5 button { font-size: 10px; padding: 0 2px; }\n  .gpb-root .hb-block { padding: 9px 10px; }\n  .gpb-root .hb-quiet-row { min-height: 38px; }\n  .gpb-root .ctx-head { padding: 0 8px; gap: 6px; }\n  .gpb-root .hb-question { max-height: 132px; }\n}\n";
    const SPRITE = "\n  <symbol id=\"i-search\" viewBox=\"0 0 24 24\"><circle cx=\"10.5\" cy=\"10.5\" r=\"6.5\"/><path d=\"M15.6 15.6 20 20\"/></symbol>\n  <symbol id=\"i-plus\" viewBox=\"0 0 24 24\"><path d=\"M12 5v14M5 12h14\"/></symbol>\n  <symbol id=\"i-sun\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4\"/></symbol>\n  <symbol id=\"i-moon\" viewBox=\"0 0 24 24\"><path d=\"M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z\"/></symbol>\n  <symbol id=\"i-chevron-down\" viewBox=\"0 0 24 24\"><path d=\"m6 9 6 6 6-6\"/></symbol>\n  <symbol id=\"i-chevron-right\" viewBox=\"0 0 24 24\"><path d=\"m9 6 6 6-6 6\"/></symbol>\n  <symbol id=\"i-check\" viewBox=\"0 0 24 24\"><path d=\"m5 12.5 4.5 4.5L19 7.5\"/></symbol>\n  <symbol id=\"i-check-circle\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"8.5\"/><path d=\"m8 12.3 2.6 2.6 5.4-5.4\"/></symbol>\n  <symbol id=\"i-x\" viewBox=\"0 0 24 24\"><path d=\"M6 6l12 12M18 6 6 18\"/></symbol>\n  <symbol id=\"i-arrow-up\" viewBox=\"0 0 24 24\"><path d=\"M12 19V5M6 11l6-6 6 6\"/></symbol>\n  <symbol id=\"i-arrow-right\" viewBox=\"0 0 24 24\"><path d=\"M5 12h14M13 6l6 6-6 6\"/></symbol>\n  <symbol id=\"i-paperclip\" viewBox=\"0 0 24 24\"><path d=\"M20 11.5 12.2 19.3a5 5 0 0 1-7-7l8-8a3.5 3.5 0 1 1 5 5l-8 8a2 2 0 0 1-2.8-2.8l7.4-7.4\"/></symbol>\n  <symbol id=\"i-users\" viewBox=\"0 0 24 24\"><circle cx=\"9\" cy=\"8\" r=\"3.2\"/><path d=\"M3.5 19.5a5.5 5.5 0 0 1 11 0\"/><path d=\"M16 5.4a3 3 0 0 1 0 5.2M17.5 14.6a5 5 0 0 1 3 4.9\"/></symbol>\n  <symbol id=\"i-bubble\" viewBox=\"0 0 24 24\"><path d=\"M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H9l-5 4v-4.5A2.5 2.5 0 0 1 4 13.5v-7Z\"/></symbol>\n  <symbol id=\"i-checklist\" viewBox=\"0 0 24 24\"><path d=\"M9.5 7h10M9.5 12h10M9.5 17h10\"/><path d=\"m3 7 1.5 1.5L7.2 5.8M3 12l1.5 1.5 2.7-2.7M3 17l1.5 1.5 2.7-2.7\"/></symbol>\n  <symbol id=\"i-grid\" viewBox=\"0 0 24 24\"><rect x=\"4\" y=\"4\" width=\"7\" height=\"7\" rx=\"1.6\"/><rect x=\"13\" y=\"4\" width=\"7\" height=\"7\" rx=\"1.6\"/><rect x=\"4\" y=\"13\" width=\"7\" height=\"7\" rx=\"1.6\"/><rect x=\"13\" y=\"13\" width=\"7\" height=\"7\" rx=\"1.6\"/></symbol>\n  <symbol id=\"i-layers\" viewBox=\"0 0 24 24\"><path d=\"m12 3.5 8.5 4.6-8.5 4.6-8.5-4.6L12 3.5Z\"/><path d=\"m3.5 12.2 8.5 4.6 8.5-4.6M3.5 16.8l8.5 4.6 8.5-4.6\"/></symbol>\n  <symbol id=\"i-folder\" viewBox=\"0 0 24 24\"><path d=\"M3.5 7.5A2.5 2.5 0 0 1 6 5h3l2 2.5h7A2.5 2.5 0 0 1 20.5 10v7a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2V7.5Z\"/></symbol>\n  <symbol id=\"i-computer\" viewBox=\"0 0 24 24\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"12\" rx=\"2\"/><path d=\"M9 20h6M12 16v4\"/></symbol>\n  <symbol id=\"i-clock\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"8.5\"/><path d=\"M12 7.5V12l3 2\"/></symbol>\n  <symbol id=\"i-play\" viewBox=\"0 0 24 24\"><path d=\"m9 6.5 8 5.5-8 5.5v-11Z\"/></symbol>\n  <symbol id=\"i-trash\" viewBox=\"0 0 24 24\"><path d=\"M4 7h16M9 7V4.8h6V7M6 7l1 13h10l1-13M10 11v5M14 11v5\"/></symbol>\n  <symbol id=\"i-pencil\" viewBox=\"0 0 24 24\"><path d=\"M4 20h4L20 8l-4-4L4 16v4Z\"/><path d=\"m14.5 5.5 4 4\"/></symbol>\n  <symbol id=\"i-more\" viewBox=\"0 0 24 24\"><circle cx=\"5\" cy=\"12\" r=\"1.3\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"12\" cy=\"12\" r=\"1.3\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"19\" cy=\"12\" r=\"1.3\" fill=\"currentColor\" stroke=\"none\"/></symbol>\n  <symbol id=\"i-menu\" viewBox=\"0 0 24 24\"><path d=\"M4 7h16M4 12h16M4 17h16\"/></symbol>\n  <symbol id=\"i-panel\" viewBox=\"0 0 24 24\"><rect x=\"3.5\" y=\"4.5\" width=\"17\" height=\"15\" rx=\"2.5\"/><path d=\"M15 4.5v15\"/></symbol>\n  <symbol id=\"i-link\" viewBox=\"0 0 24 24\"><path d=\"M10.5 13.5a4 4 0 0 0 5.7 0l2.3-2.3a4 4 0 0 0-5.7-5.7L11.5 6.8\"/><path d=\"M13.5 10.5a4 4 0 0 0-5.7 0l-2.3 2.3a4 4 0 0 0 5.7 5.7l1.3-1.3\"/></symbol>\n  <symbol id=\"i-undo\" viewBox=\"0 0 24 24\"><path d=\"M9 14 4 9l5-5\"/><path d=\"M4 9h9a7 7 0 0 1 0 14h-1\"/></symbol>\n  <symbol id=\"i-calendar\" viewBox=\"0 0 24 24\"><rect x=\"3.5\" y=\"5\" width=\"17\" height=\"15\" rx=\"2.5\"/><path d=\"M8 3v4M16 3v4M3.5 10h17\"/></symbol>\n  <symbol id=\"i-copy\" viewBox=\"0 0 24 24\"><rect x=\"8\" y=\"8\" width=\"12\" height=\"12\" rx=\"2.5\"/><path d=\"M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2\"/></symbol>\n  <symbol id=\"i-file\" viewBox=\"0 0 24 24\"><path d=\"M6 3.5h7l5 5v12H6v-17Z\"/><path d=\"M13 3.5v5h5\"/></symbol>\n  <symbol id=\"i-sync\" viewBox=\"0 0 24 24\"><path d=\"M20 11a8 8 0 0 0-13.7-5L4 8\"/><path d=\"M4 4v4h4\"/><path d=\"M4 13a8 8 0 0 0 13.7 5L20 16\"/><path d=\"M20 20v-4h-4\"/></symbol>\n  <symbol id=\"i-hash\" viewBox=\"0 0 24 24\"><path d=\"M9 3 7.5 21M16.5 3 15 21M4 8.5h16M3.5 15.5h16\"/></symbol>\n";

    const TINT_BY_TEMPLATE = {
      'chief-of-staff': 'blue',
      'sales-outbound': 'green',
      engineer: 'purple',
      researcher: 'pink',
      'account-health': 'orange',
      'talent-scout': 'graphite',
      'paid-media': 'pink',
      'product-performance': 'orange',
      'expense-manager': 'green',
      'ops-desk': 'graphite',
    };
    const TINT_BY_CATEGORY = {
      研究: 'purple',
      增长: 'green',
      工程: 'blue',
      设计: 'pink',
      运营: 'orange',
      支持: 'orange',
      通用: 'graphite',
    };
    const CATEGORY_LABELS = {
      General: '通用',
      Sales: '增长',
      Engineering: '工程',
      'Customer Success': '支持',
      Recruiting: '运营',
      Marketing: '增长',
      Operations: '运营',
    };
    const EMOJIS = ['🧭', '🔎', '📈', '🛠️', '🎨', '🧾', '🧠', '🛰️'];
    const SWATCHES = [
      ['graphite', 'sw-1', '#48484a'],
      ['blue', 'sw-2', '#0071e3'],
      ['purple', 'sw-3', '#7d4bc4'],
      ['pink', 'sw-4', '#d1467f'],
      ['orange', 'sw-5', '#c2410c'],
      ['green', 'sw-6', '#1a7f3c'],
    ];

    const DICT = {
      en: {
        'app.chat': 'Chat',
        'app.tasks': 'Tasks',
        'app.market': 'Marketplace',
        'app.title': 'Bots',
        'app.search': 'Search',
        'app.newBot': 'New Bot',
        'app.you': 'You',
        'side.team': 'Team',
        'side.rooms': 'Group chats',
        'side.market': 'Marketplace',
        'side.tasks': 'Team tasks',
        'side.skills': 'Skills',
        'side.sync': 'Workspace Hub connected · two-way sync',
        'side.newBot': 'New Bot',
        'side.newRoom': 'New group chat',
        'side.bots': '{n} Bots',
        'side.roomSub': '{n} Bots',
        'thread.teach': 'Teach',
        'thread.synced': 'Synced to Workspace Hub',
        'thread.placeholder': 'Message {name}, or hand over a task…',
        'thread.placeholderGroup': 'Message the team, or @ a Bot…',
        'thread.note': 'Bots work on the shared computer and come back here for approval.',
        'thread.send': 'Send',
        'thread.hintSend': 'send',
        'thread.hintNewline': 'new line',
        'thread.computer': 'Shared Computer',
        'thread.attach': 'Attach a file',
        'thread.stop': 'Stop',
        'thread.working': 'Working',
        'thread.idle': 'Idle',
        'thread.needsYou': 'Needs you',
        'thread.mention': 'Mention a Bot',
        'thread.mentionHint': 'mention',
        'mention.title': 'Mention a Bot',
        'mention.bot': 'Bot',
        'mention.everyone': 'Everyone',
        'mention.everyoneSub': 'Wake every Bot in this chat',
        'mention.empty': 'No Bot matches that name',
        'mention.hintMove': 'move',
        'mention.hintPick': 'tag',
        'mention.hintClose': 'close',
        'mention.remove': 'Remove mention',
        'ctx.tasks': 'Tasks',
        'ctx.memory': 'Memory',
        'ctx.routine': 'Routine',
        'ctx.computer': 'Computer',
        'ctx.members': 'Members',
        'ctx.pendingCount': '{n} open',
        'ctx.taskEmpty': 'No tasks here yet.',
        'ctx.viewAll': 'View all tasks',
        'ctx.review': 'Review',
        'ctx.memoryUpdated': 'Memory for {name} was updated today',
        'ctx.memoryEmpty': 'No memory yet. Approvals write back here.',
        'ctx.memoryKey': 'Note {n}',
        'ctx.fromYou': 'from you',
        'ctx.fromBot': 'noted by Bot',
        'ctx.teamMemory': 'Team memory',
        'ctx.teamMemoryEmpty': 'No shared memory yet.',
        'ctx.teamMemoryPlaceholder': 'Something the whole team should know…',
        'ctx.addTeamMemory': 'Add team note',
        'ctx.addMemory': 'Add a note',
        'ctx.memoryPlaceholder': 'Something it should remember…',
        'ctx.routineEmpty': 'No routines yet. Teach it once.',
        'ctx.teach': 'Teach',
        'ctx.runNow': 'Run now',
        'ctx.runCount': 'Ran {n} times',
        'ctx.routineOn': 'Runs on schedule',
        'ctx.routineOff': 'Paused',
        'ctx.sharedComputer': 'Shared Computer',
        'ctx.fileCount': '{n} items',
        'ctx.deliverables': 'Deliverables',
        'ctx.projectWorkspace': 'Project workspace',
        'ctx.fileEmpty': 'The deliverables folder is empty.',
        'ctx.copy': 'Copy',
        'ctx.teachRoutine': 'Teach this as a routine',
        'routine.when': 'When',
        'routine.manual': 'Manually',
        'routine.schedule': 'On a schedule',
        'routine.onTaskDone': 'After a task completes',
        'routine.interval': 'Every N minutes',
        'routine.daily': 'Every day',
        'routine.weekdays': 'Weekdays',
        'routine.minutes': 'Minutes',
        'routine.time': 'Time',
        'routine.next': 'Next {time}',
        'routine.none': 'not scheduled',
        'routine.failed': 'Last run failed',
        'routine.latest': 'latest: {status}',
        'routine.running': 'running',
        'routine.statusDone': 'ok',
        'routine.statusFailed': 'failed',
        'routine.statusCancelled': 'cancelled',
        'routine.history': 'Latest run',
        'suggestion.title': 'Save this run as a routine?',
        'suggestion.sub': 'I recorded the steps from this actual run. Reuse them later.',
        'suggestion.routine': 'Save as routine',
        'suggestion.skill': 'Save as skill',
        'suggestion.dismiss': 'Dismiss',
        'suggestion.steps': 'Recorded steps',
        'ctx.memberSub': '{n} Bots in this room',
        'ap.pending': 'Waiting for you',
        'ap.approved': 'Approved',
        'ap.changes': 'Sent back for changes',
        'ap.ignored': 'Ignored',
        'ap.undo': 'Undo',
        'ap.approve': 'Approve',
        'ap.revise': 'Request changes',
        'ap.ignore': 'Ignore',
        'ap.cancel': 'Cancel',
        'ap.submit': 'Submit request',
        'ap.placeholder': 'Say what should change, e.g. fill in the owner before publishing.',
        'ap.writeMemory': 'Written to Memory',
        'ap.sync': 'Synced to Workspace Hub',
        'ap.waiting': 'Waiting for {name}',
        'ap.diffSource': 'Source: {source}',
        'ap.diffWork': '{name} finished in the shared computer',
        'ap.diffBoard': 'Card linked to the Workspace Hub board',
        'ap.localTask': 'Local task',
        'intent.title': 'Confirm what you meant',
        'intent.sub': 'I could not tell whether you want this executed or just discussed.',
        'intent.task': 'Run as a task',
        'intent.chat': 'Just chat',
        'intent.dismiss': 'Leave it',
        'intent.suggestion': 'My guess',
        'actionApproval.title': 'Permission needed',
        'actionApproval.allowOnce': 'Allow once',
        'actionApproval.alwaysAllow': 'Always allow',
        'actionApproval.deny': 'Deny',
        'actionApproval.expired': 'Expired',
        'actionApproval.waiting': 'Waiting for your decision…',
        'actionApproval.inputs': 'Inputs',
        'actionApproval.allowed': 'Allowed',
        'action.write': 'Change a file',
        'action.bash': 'Run a command',
        'action.board': 'Update the Workspace Hub board',
        'action.send': 'Send a message on your behalf',
        'action.tool': 'Run {name}',
        'settings.autoReview': 'Auto-review',
        'settings.askFirst': 'Ask before sensitive actions',
        'settings.allowAll': 'Allow all actions automatically',
        'settings.grants': 'Always allowed',
        'settings.noGrants': 'No always-allowed actions yet.',
        'settings.revoke': 'Revoke',
        'empty.title': 'Hand {name} the first job',
        'empty.body': 'Explain it like you would to a teammate. It works on the shared computer and comes back here for approval.',
        'tasks.title': 'Team tasks',
        'tasks.sub': 'Everything Bots finish on the shared computer lands here. Approving writes back to Memory and Workspace Hub.',
        'tasks.teach': 'Teach a task',
        'tasks.all': 'All',
        'tasks.pending': 'Needs review',
        'tasks.active': 'In progress',
        'tasks.done': 'Done',
        'tasks.note': '{n} items · updated just now',
        'tasks.approve': 'Approve',
        'tasks.review': 'Review',
        'tasks.empty': 'No tasks in this filter.',
        'tasks.failed': 'Failed',
        'tasks.source': 'via {source}',
        'market.title': 'Add a teammate',
        'market.sub': 'Hire a ready-made Bot. It works on the shared computer and uses the team skills.',
        'market.search': 'Search Bots or roles',
        'market.all': 'All',
        'market.add': 'Add',
        'market.added': 'Added',
        'market.skills': '{n} skills',
        'market.empty': 'No matching Bots. Try another keyword, or create one yourself.',
        'skills.title': 'Shared skills',
        'skills.sub': 'Save a process that went right. Every Bot on the team can reuse it, and you can delete it any time.',
        'skills.search': 'Search skills',
        'skills.when': 'When to use',
        'skills.steps': 'Steps',
        'skills.delete': 'Delete',
        'skills.shared': 'Shared',
        'skills.empty': 'No matching skills. Try another keyword.',
        'skills.new': 'New skill',
        'skills.userMeta': '{n} steps · team-wide',
        'modal.close': 'Close',
        'modal.cancel': 'Cancel',
        'newBot.title': 'New Bot',
        'newBot.sub': 'Give it a name and a job. It joins the team immediately.',
        'newBot.name': 'Name',
        'newBot.namePlaceholder': 'e.g. Research',
        'newBot.label': 'Label',
        'newBot.labelPlaceholder': 'e.g. Research & competitors',
        'newBot.desc': 'Description',
        'newBot.descPlaceholder': 'What it owns, and when to call on it.',
        'newBot.workspace': 'Workspace',
        'newBot.workspacePlaceholder': 'Shared Computer (leave empty) or /path/to/project',
        'newBot.avatar': 'Avatar',
        'newBot.accent': 'Accent',
        'newBot.previewName': 'Unnamed teammate',
        'newBot.previewLabel': 'Research & competitors',
        'newBot.create': 'Create Bot',
        'newBot.hint': 'You can change it later',
        'settings.title': 'Bot settings',
        'settings.save': 'Save',
        'settings.delete': 'Delete Bot',
        'settings.deleteConfirm': 'Delete this Bot and its chat?',
        'settings.saved': 'Bot updated',
        'settings.deleted': 'Bot deleted',
        'teach.title': 'Teach a task',
        'teach.sub': 'Walk it through once. It becomes a routine the Bot can follow later.',
        'teach.chooseBot': 'Choose a Bot',
        'teach.goal': 'Goal',
        'teach.goalPlaceholder': 'e.g. Check the launch checklist before every release',
        'teach.steps': 'Steps',
        'teach.stepPlaceholder': 'Describe one step…',
        'teach.addStep': 'Add step',
        'teach.save': 'Save routine',
        'teach.hint': 'It appears in that Bot\'s routines',
        'teach.saved': 'Routine saved',
        'group.title': 'New group chat',
        'group.editTitle': 'Edit group chat',
        'group.name': 'Name',
        'group.namePlaceholder': 'e.g. Launch room',
        'group.members': 'Members',
        'group.min': 'Pick at least two Bots.',
        'group.save': 'Save',
        'group.create': 'Create',
        'group.created': 'Group chat created',
        'skill.title': 'New skill',
        'skill.sub': 'A shared instruction every Bot can use.',
        'skill.name': 'Name',
        'skill.when': 'When to use',
        'skill.steps': 'Steps',
        'skill.stepPlaceholder': 'Describe one step…',
        'skill.save': 'Save skill',
        'skill.saved': 'Skill saved',
        'file.title': 'File preview',
        'file.loading': 'Reading the file…',
        'file.error': 'Could not read this file.',
        'revise.title': 'Request changes',
        'revise.sub': 'Tell the Bot what should change. It resumes on the shared computer.',
        'revise.submit': 'Send request',
        'search.placeholder': 'Search teammates, tasks, skills',
        'search.bots': 'Teammates',
        'search.tasks': 'Tasks',
        'search.skills': 'Skills',
        'search.empty': 'No matches.',
        'search.hint': 'Filter by name or content',
        'toast.approved': 'Approved',
        'toast.ignored': 'Ignored',
        'toast.copied': 'Copied',
        'toast.error': 'Something went wrong',
        'toast.market': 'Added to the team',
        'toast.deleted': 'Bot deleted',
        'loading': 'Loading the team…',
        'error.load': 'Cannot reach the Deepseek Bot Army host.',
        'error.retry': 'Retry',
        'time.today': 'Today',
        'ctx.heartbeat': 'Heartbeat',
        'hb.settings': 'Heartbeat',
        'hb.enabled': 'Heartbeat',
        'hb.hint': 'When idle, the Bot checks unfinished work and picks it back up.',
        'hb.interval': 'Check every',
        'hb.minutes': '{n} min',
        'hb.quietHours': 'Quiet hours',
        'hb.quietStart': 'Start',
        'hb.quietEnd': 'End',
        'hb.caps': 'Daily caps',
        'hb.maxPulses': 'Pulses per day',
        'hb.maxResumes': 'Resumes per day',
        'hb.on': 'On',
        'hb.off': 'Off',
        'hb.checking': 'Checking in…',
        'hb.checkNow': 'Check now',
        'hb.nextCheck': 'Next check',
        'hb.nextCheckNone': 'Not scheduled',
        'hb.lastVerdict': 'Last verdict',
        'hb.lastReason': 'Last reason',
        'hb.todayPulses': 'Pulses today',
        'hb.todayResumes': 'Resumes today',
        'hb.notEnabled': 'Heartbeat is off for this Bot.',
        'hb.mode': 'Mode',
        'hb.modeOff': 'Off',
        'hb.modeTriage': 'Triage only',
        'hb.modeShadow': 'Shadow',
        'hb.modeResume': 'Resume',
        'hb.autoResume': 'Auto-resume after restart',
        'hb.autoResumeHint': 'Continue interrupted work after a restart.',
        'hb.global': 'Global heartbeat',
        'hb.globalStats': '{p} pulses · {r} resumes',
        'hb.verdict.idle': 'Idle',
        'hb.verdict.wait': 'Waiting',
        'hb.verdict.resume': 'Resume',
        'hb.verdict.ask_user': 'Needs you',
        'hb.verdictNone': 'No verdict yet',
        'hb.activityDetail': 'Heartbeat pulse',
        'hb.checkinTitle': 'Heartbeat needs you',
        'hb.checkinSub': 'The Bot paused to ask you something.',
        'hb.checkinGotIt': 'Got it',
        'hb.checkinResolved': 'Check-in cleared',
        'hb.toastNow': 'Heartbeat: {verdict}',
        'hb.toastSkipped': 'Heartbeat skipped',
        'time.now': 'just now',
        'time.min': '{n}m ago',
        'time.hour': '{n}h ago',
        'time.day': '{n}d ago',
      },
      zh: {
        'app.chat': '对话',
        'app.tasks': '任务',
        'app.market': '集市',
        'app.title': 'Bots',
        'app.search': '搜索',
        'app.newBot': '新建 Bot',
        'app.you': '你',
        'side.team': '团队',
        'side.rooms': '群聊',
        'side.market': '集市',
        'side.tasks': '团队任务',
        'side.skills': '技能',
        'side.sync': 'Workspace Hub 已连接 · 双向同步',
        'side.newBot': '新建 Bot',
        'side.newRoom': '新建群聊',
        'side.bots': '{n} 位 Bot',
        'side.roomSub': '{n} 位 Bot',
        'thread.teach': '教一次',
        'thread.synced': '已同步 Workspace Hub',
        'thread.placeholder': '给 {name} 发消息，或派一件事…',
        'thread.placeholderGroup': '给团队发消息，或输入 @ 提及一位 Bot…',
        'thread.note': 'Bot 在共享 Computer 上执行，完成后回到这里等你审批。',
        'thread.send': '发送',
        'thread.hintSend': '发送',
        'thread.hintNewline': '换行',
        'thread.computer': '共享 Computer',
        'thread.attach': '添加附件',
        'thread.stop': '停止',
        'thread.working': 'Working',
        'thread.idle': '空闲',
        'thread.needsYou': '需要你处理',
        'thread.mention': '提及 Bot',
        'thread.mentionHint': '提及',
        'mention.title': '提及 Bot',
        'mention.bot': 'Bot',
        'mention.everyone': '所有人',
        'mention.everyoneSub': '唤醒这个对话里的所有 Bot',
        'mention.empty': '没有匹配的 Bot',
        'mention.hintMove': '选择',
        'mention.hintPick': '提及',
        'mention.hintClose': '关闭',
        'mention.remove': '移除提及',
        'ctx.tasks': '任务',
        'ctx.memory': '记忆',
        'ctx.routine': '例程',
        'ctx.computer': '电脑',
        'ctx.members': '成员',
        'ctx.pendingCount': '{n} 项待处理',
        'ctx.taskEmpty': '这里还没有任务。',
        'ctx.viewAll': '查看全部任务',
        'ctx.review': '审阅',
        'ctx.memoryUpdated': '今天更新了 {name} 的记忆',
        'ctx.memoryEmpty': '还没有记忆。审批通过后会写进来。',
        'ctx.memoryKey': '记忆 {n}',
        'ctx.fromYou': '来自你',
        'ctx.fromBot': 'Bot 记录',
        'ctx.teamMemory': '团队记忆',
        'ctx.teamMemoryEmpty': '还没有团队共享记忆。',
        'ctx.teamMemoryPlaceholder': '整个团队都应该知道的事…',
        'ctx.addTeamMemory': '添加团队记忆',
        'ctx.addMemory': '添加记忆',
        'ctx.memoryPlaceholder': '下次应该记住什么…',
        'ctx.routineEmpty': '还没有例程。演示一遍，让它学会。',
        'ctx.teach': '教一次',
        'ctx.runNow': '立即运行',
        'ctx.runCount': '已运行 {n} 次',
        'ctx.routineOn': '按计划自动执行',
        'ctx.routineOff': '已暂停',
        'ctx.sharedComputer': '共享 Computer',
        'ctx.fileCount': '{n} 项',
        'ctx.deliverables': '交付目录',
        'ctx.projectWorkspace': '项目工作区',
        'ctx.fileEmpty': '交付目录还是空的。',
        'ctx.copy': '复制',
        'ctx.teachRoutine': '把这项工作教成例程',
        'routine.when': '触发方式',
        'routine.manual': '仅手动',
        'routine.schedule': '按计划',
        'routine.onTaskDone': '任务完成后',
        'routine.interval': '每隔 N 分钟',
        'routine.daily': '每天',
        'routine.weekdays': '工作日',
        'routine.minutes': '分钟',
        'routine.time': '时间',
        'routine.next': '下次 {time}',
        'routine.none': '未排期',
        'routine.failed': '上次运行失败',
        'routine.latest': '最近：{status}',
        'routine.running': '运行中',
        'routine.statusDone': '成功',
        'routine.statusFailed': '失败',
        'routine.statusCancelled': '取消',
        'routine.history': '最近运行',
        'suggestion.title': '把这次运行存成例程？',
        'suggestion.sub': '我从这次实际执行里记录了步骤，以后可以按它复用。',
        'suggestion.routine': '保存为例程',
        'suggestion.skill': '存为技能',
        'suggestion.dismiss': '忽略',
        'suggestion.steps': '录制步骤',
        'ctx.memberSub': '这个群有 {n} 位 Bot',
        'ap.pending': '等你审批',
        'ap.approved': '已通过',
        'ap.changes': '已发回修改',
        'ap.ignored': '已忽略',
        'ap.undo': '撤销',
        'ap.approve': '通过',
        'ap.revise': '要求修改',
        'ap.ignore': '忽略',
        'ap.cancel': '取消',
        'ap.submit': '提交要求',
        'ap.placeholder': '说明哪里需要改，例如：负责人先不要留空，改成 @Growth 和你。',
        'ap.writeMemory': '已写入 Memory',
        'ap.sync': '已同步 Workspace Hub',
        'ap.waiting': '等待 {name} 处理',
        'ap.diffSource': '来源：{source}',
        'ap.diffWork': '{name} 已在共享 Computer 完成执行',
        'ap.diffBoard': '任务卡已关联 Workspace Hub 看板',
        'ap.localTask': '本地任务',
        'intent.title': '确认这条消息的意图',
        'intent.sub': '我不太确定你是想让我执行，还是只是聊聊。',
        'intent.task': '派成任务',
        'intent.chat': '只是聊天',
        'intent.dismiss': '暂不处理',
        'intent.suggestion': '我的判断',
        'actionApproval.title': '需要你的许可',
        'actionApproval.allowOnce': '仅允许这一次',
        'actionApproval.alwaysAllow': '总是允许',
        'actionApproval.deny': '拒绝',
        'actionApproval.expired': '已过期',
        'actionApproval.waiting': '等待你的决定…',
        'actionApproval.inputs': '输入',
        'actionApproval.allowed': '已允许',
        'action.write': '修改文件',
        'action.bash': '运行命令',
        'action.board': '更新 Workspace Hub 看板',
        'action.send': '代表你发送消息',
        'action.tool': '执行 {name}',
        'settings.autoReview': 'Auto-review',
        'settings.askFirst': '敏感操作先问我',
        'settings.allowAll': '全部操作自动允许',
        'settings.grants': '总是允许的操作',
        'settings.noGrants': '还没有总是允许的操作。',
        'settings.revoke': '撤销',
        'empty.title': '给 {name} 派第一件活',
        'empty.body': '像给同事发消息一样说清楚要什么。它会在共享 Computer 上做，完成后回到这里等你审批。',
        'tasks.title': '团队任务',
        'tasks.sub': 'Bot 在共享 Computer 上做完的事，都会回到这里等你确认。通过后写回 Memory 与 Workspace Hub。',
        'tasks.teach': '教一次任务',
        'tasks.all': '全部',
        'tasks.pending': '待审批',
        'tasks.active': '进行中',
        'tasks.done': '已完成',
        'tasks.note': '{n} 项 · 刚刚更新',
        'tasks.approve': '通过',
        'tasks.review': '审阅',
        'tasks.empty': '这个筛选下还没有任务。',
        'tasks.failed': '失败',
        'tasks.source': '来自 {source}',
        'market.title': '给团队加一位新同事',
        'market.sub': '从集市请一位现成的同事，加入后就能直接派活。它会在共享 Computer 上工作，也会用团队已有的技能。',
        'market.search': '搜索 Bot 或职责',
        'market.all': '全部',
        'market.add': '添加',
        'market.added': '已添加',
        'market.skills': '{n} 项技能',
        'market.empty': '没有匹配的同事。换个关键词，或自己新建一个。',
        'skills.title': '共享技能',
        'skills.sub': '把一次做对的过程存下来。团队里的每位 Bot 都能复用，也可以随时删掉。',
        'skills.search': '搜索技能',
        'skills.when': '何时使用',
        'skills.steps': '步骤',
        'skills.delete': '删除',
        'skills.shared': '共享',
        'skills.empty': '没有匹配的技能。换个关键词试试。',
        'skills.new': '新建技能',
        'skills.userMeta': '{n} 个步骤 · 全员可用',
        'modal.close': '关闭',
        'modal.cancel': '取消',
        'newBot.title': '新建 Bot',
        'newBot.sub': '给它一个名字和职责。创建后会出现在团队列表里，马上就能派活。',
        'newBot.name': '名称',
        'newBot.label': '标签',
        'newBot.namePlaceholder': '例如 Research',
        'newBot.labelPlaceholder': '例如 研究与竞品',
        'newBot.desc': '描述',
        'newBot.descPlaceholder': '它会负责什么，什么时候找它。',
        'newBot.workspace': '工作区',
        'newBot.workspacePlaceholder': '共享 Computer（留空）或 /path/to/project',
        'newBot.avatar': '头像',
        'newBot.accent': '强调色',
        'newBot.previewName': '未命名同事',
        'newBot.previewLabel': '研究与竞品',
        'newBot.create': '创建 Bot',
        'newBot.hint': '创建后可以随时修改',
        'settings.title': 'Bot 设置',
        'settings.save': '保存',
        'settings.delete': '删除 Bot',
        'settings.deleteConfirm': '删除这个 Bot 及其聊天？',
        'settings.saved': 'Bot 已更新',
        'settings.deleted': 'Bot 已删除',
        'teach.title': '教一次任务',
        'teach.sub': '演示一遍怎么做。保存后它会变成例程，Bot 以后可以照着执行。',
        'teach.chooseBot': '选择 Bot',
        'teach.goal': '目标',
        'teach.goalPlaceholder': '例如：每次发布前检查上线清单',
        'teach.steps': '步骤',
        'teach.stepPlaceholder': '描述一个步骤…',
        'teach.addStep': '添加步骤',
        'teach.save': '保存例程',
        'teach.hint': '保存后出现在该 Bot 的例程里',
        'teach.saved': '例程已保存',
        'group.title': '新建群聊',
        'group.editTitle': '编辑群聊',
        'group.name': '名称',
        'group.namePlaceholder': '例如：Launch room',
        'group.members': '成员',
        'group.min': '至少选择两个 Bot。',
        'group.save': '保存',
        'group.create': '创建',
        'group.created': '群聊已创建',
        'skill.title': '新建技能',
        'skill.sub': '所有 Bot 都能使用的一条共享指令。',
        'skill.name': '名称',
        'skill.when': '何时使用',
        'skill.steps': '步骤',
        'skill.stepPlaceholder': '描述一个步骤…',
        'skill.save': '保存技能',
        'skill.saved': '技能已保存',
        'file.title': '文件预览',
        'file.loading': '正在读取文件…',
        'file.error': '无法读取这个文件。',
        'revise.title': '要求修改',
        'revise.sub': '告诉 Bot 要改什么，它会回到共享 Computer 继续处理。',
        'revise.submit': '发回修改',
        'search.placeholder': '搜索同事、任务、技能',
        'search.bots': '同事',
        'search.tasks': '任务',
        'search.skills': '技能',
        'search.empty': '没有匹配结果。',
        'search.hint': '按名称或内容筛选',
        'toast.approved': '已通过',
        'toast.ignored': '已忽略',
        'toast.copied': '已复制',
        'toast.error': '出错了',
        'toast.market': '已加入团队',
        'toast.deleted': 'Bot 已删除',
        'loading': '正在加载团队…',
        'error.load': '无法连接 Deepseek Bot Army 主机。',
        'error.retry': '重试',
        'time.today': '今天',
        'ctx.heartbeat': '心跳',
        'hb.settings': '心跳',
        'hb.enabled': '心跳',
        'hb.hint': '空闲时，Bot 会检查未完成的工作并继续处理。',
        'hb.interval': '检查间隔',
        'hb.minutes': '{n} 分钟',
        'hb.quietHours': '免打扰时段',
        'hb.quietStart': '开始',
        'hb.quietEnd': '结束',
        'hb.caps': '每日上限',
        'hb.maxPulses': '每日探活次数',
        'hb.maxResumes': '每日续跑次数',
        'hb.on': '已开启',
        'hb.off': '已关闭',
        'hb.checking': '正在检查…',
        'hb.checkNow': '立即检查',
        'hb.nextCheck': '下次检查',
        'hb.nextCheckNone': '未安排',
        'hb.lastVerdict': '上次结果',
        'hb.lastReason': '上次原因',
        'hb.todayPulses': '今日探活',
        'hb.todayResumes': '今日续跑',
        'hb.notEnabled': '此 Bot 的心跳已关闭。',
        'hb.mode': '模式',
        'hb.modeOff': '关闭',
        'hb.modeTriage': '仅分诊',
        'hb.modeShadow': '影子模式',
        'hb.modeResume': '自动续跑',
        'hb.autoResume': '重启后自动续跑',
        'hb.autoResumeHint': '重启后继续中断的工作。',
        'hb.global': '全局心跳',
        'hb.globalStats': '{p} 次探活 · {r} 次续跑',
        'hb.verdict.idle': '空闲',
        'hb.verdict.wait': '等待中',
        'hb.verdict.resume': '继续处理',
        'hb.verdict.ask_user': '需要你',
        'hb.verdictNone': '尚无结果',
        'hb.activityDetail': '心跳探活',
        'hb.checkinTitle': '心跳需要你',
        'hb.checkinSub': 'Bot 暂停下来想问你一件事。',
        'hb.checkinGotIt': '知道了',
        'hb.checkinResolved': '已处理确认',
        'hb.toastNow': '心跳：{verdict}',
        'hb.toastSkipped': '已跳过心跳',
        'time.now': '刚刚',
        'time.min': '{n} 分钟前',
        'time.hour': '{n} 小时前',
        'time.day': '{n} 天前',
      },
    };

    function cx(...parts) {
      return parts.filter(Boolean).join(' ');
    }

    function tintOf(entity) {
      if (entity === undefined || entity === null) return 'graphite';
      if (entity.templateId && TINT_BY_TEMPLATE[entity.templateId]) return TINT_BY_TEMPLATE[entity.templateId];
      if (entity.tint) return entity.tint;
      if (entity.color) return tintByHex(entity.color);
      const category = CATEGORY_LABELS[entity.category];
      if (category && TINT_BY_CATEGORY[category]) return TINT_BY_CATEGORY[category];
      return 'graphite';
    }

    function tintByHex(hex) {
      const found = SWATCHES.find((item) => item[2] === hex);
      return found ? found[0] : 'graphite';
    }

    function categoryLabel(category) {
      return CATEGORY_LABELS[category] ?? category;
    }

    function ago(ts, t) {
      const diff = Date.now() - Number(ts);
      if (!Number.isFinite(diff) || diff < 60_000) return t('time.now');
      if (diff < 3_600_000) return t('time.min').replace('{n}', String(Math.floor(diff / 60_000)));
      if (diff < 86_400_000) return t('time.hour').replace('{n}', String(Math.floor(diff / 3_600_000)));
      return t('time.day').replace('{n}', String(Math.floor(diff / 86_400_000)));
    }

    function clock(ts) {
      try {
        return new Date(ts).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      } catch {
        return '';
      }
    }

    function bytes(size) {
      if (!Number.isFinite(size)) return '';
      if (size < 1024) return `${size} B`;
      if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
      return `${(size / 1024 / 1024).toFixed(1)} MB`;
    }

    function readHostTheme() {
      if (typeof document === 'undefined') return 'light';
      const body = document.body;
      const html = document.documentElement;
      if (body?.hasAttribute('data-ds-dark-theme') || html?.hasAttribute('data-ds-dark-theme')) return 'dark';
      const attr = html?.getAttribute('data-theme') ?? body?.getAttribute('data-theme');
      if (attr === 'dark') return 'dark';
      if (attr === 'light') return 'light';
      if (html?.classList.contains('dark') || body?.classList.contains('dark')) return 'dark';
      return 'light';
    }

    function useHostTheme() {
      const [theme, setTheme] = React.useState(readHostTheme);
      React.useEffect(() => {
        const observer = new MutationObserver(() => setTheme(readHostTheme()));
        const options = { attributes: true, attributeFilter: ['data-ds-dark-theme', 'data-theme', 'class'] };
        if (document.body) observer.observe(document.body, options);
        if (document.documentElement) observer.observe(document.documentElement, options);
        setTheme(readHostTheme());
        return () => observer.disconnect();
      }, []);
      return theme;
    }

    function Icon({ name, cls }) {
      return h('svg', { className: cx('ic', cls), 'aria-hidden': true }, h('use', { href: `#i-${name}` }));
    }

    function Sprite() {
      return h('svg', {
        width: 0,
        height: 0,
        style: { position: 'absolute' },
        'aria-hidden': true,
        focusable: 'false',
        dangerouslySetInnerHTML: { __html: SPRITE },
      });
    }

    function StyleTag() {
      return h('style', { dangerouslySetInnerHTML: { __html: CSS } });
    }

    function BotAvatar({ bot, className, style }) {
      return h('span', {
        className: cx('bot-avatar', `tint-${tintOf(bot)}`, className),
        style,
        'aria-hidden': true,
      }, bot?.emoji ?? '🤖');
    }

    function RoomAvatar({ className }) {
      return h('span', { className: cx('bot-avatar room-avatar', className), 'aria-hidden': true }, h(Icon, { name: 'users', cls: 'ic-14' }));
    }

    /* ------------------------------------------------------------------ */
    /* Markdown-lite                                                      */
    /* ------------------------------------------------------------------ */

    function inlineNodes(text, key) {
      const out = [];
      const pattern = /(\*\*[^*\n]+\*\*|`[^`\n]+`|\[[^\]\n]+\]\([^)\s]+\))/g;
      let last = 0;
      let match;
      let index = 0;
      while ((match = pattern.exec(text)) !== null) {
        if (match.index > last) out.push(text.slice(last, match.index));
        const token = match[0];
        if (token.startsWith('**')) out.push(h('strong', { key: `${key}-b${index}` }, token.slice(2, -2)));
        else if (token.startsWith('`')) out.push(h('code', { key: `${key}-c${index}` }, token.slice(1, -1)));
        else {
          const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
          out.push(h('a', { key: `${key}-a${index}`, href: link?.[2], target: '_blank', rel: 'noreferrer' }, link?.[1] ?? token));
        }
        last = match.index + token.length;
        index += 1;
      }
      if (last < text.length) out.push(text.slice(last));
      return out;
    }

    function Md({ text, participants, group }) {
      const matcher = mentionMatcher(participants, group);
      const blocks = String(text ?? '').replace(/\r\n/g, '\n').split(/\n{2,}/);
      return h(React.Fragment, null, blocks.map((block, blockIndex) => {
        const key = `m${blockIndex}`;
        const fence = /^```([\w-]*)\n([\s\S]*?)\n?```$/.exec(block);
        if (fence !== null) return h('pre', { key }, h('code', null, fence[2]));
        const lines = block.split('\n');
        if (lines.length > 0 && lines.every((line) => /^\s*[-*•]\s+/.test(line))) {
          return h('ul', { key }, lines.map((line, i) => h('li', { key: `${key}-${i}` }, renderInline(line.replace(/^\s*[-*•]\s+/, ''), `${key}-${i}`, matcher))));
        }
        if (lines.length > 0 && lines.every((line) => /^\s*\d+[.)]\s+/.test(line))) {
          return h('ol', { key }, lines.map((line, i) => h('li', { key: `${key}-${i}` }, renderInline(line.replace(/^\s*\d+[.)]\s+/, ''), `${key}-${i}`, matcher))));
        }
        const children = [];
        lines.forEach((line, i) => {
          if (i > 0) children.push(h('br', { key: `${key}-br${i}` }));
          children.push(...renderInline(line, `${key}-${i}`, matcher));
        });
        return h('p', { key }, children);
      }));
    }

    /* ------------------------------------------------------------------ */
    /* @ mentions                                                         */
    /* ------------------------------------------------------------------ */

    const MENTION_PREV = /[A-Za-z0-9_@.-]/;
    const MENTION_BODY = /^[\w\u4e00-\u9fff-]{0,40}$/;

    function escapeRegExp(value) {
      return String(value ?? '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /** The `@partial` token immediately before the caret, if the user is typing one. */
    function mentionQuery(value, caret) {
      const text = String(value ?? '');
      const end = Math.max(0, Math.min(caret ?? text.length, text.length));
      const before = text.slice(0, end);
      const at = before.lastIndexOf('@');
      if (at < 0) return null;
      if (at > 0 && MENTION_PREV.test(before.slice(at - 1, at))) return null;
      const query = before.slice(at + 1);
      if (!MENTION_BODY.test(query)) return null;
      return { start: at, query };
    }

    /** A global matcher for `@Name` / `@everyone` tokens in this chat. */
    function mentionMatcher(participants, group) {
      const byName = new Map();
      for (const bot of participants ?? []) {
        const name = String(bot?.name ?? '').trim();
        if (name.length > 0) byName.set(name.toLowerCase(), bot);
      }
      const names = [...byName.keys()];
      if (group === true) names.push('everyone');
      if (names.length === 0) return null;
      const alternatives = [...new Set(names)].sort((a, b) => b.length - a.length).map(escapeRegExp);
      const pattern = `(^|[^A-Za-z0-9_@.-])@(${alternatives.join('|')})(?![A-Za-z0-9_-])`;
      return { regex: new RegExp(pattern, 'gi'), byName };
    }

    function scanMentions(value, matcher) {
      if (matcher === null) return [];
      const text = String(value ?? '');
      const found = [];
      matcher.regex.lastIndex = 0;
      let match;
      while ((match = matcher.regex.exec(text)) !== null) {
        const prefix = match[1] ?? '';
        const start = match.index + prefix.length;
        const raw = match[0].slice(prefix.length);
        const bot = matcher.byName.get(String(match[2]).toLowerCase());
        found.push({ start, end: start + raw.length, raw, name: match[2], everyone: bot === undefined, bot });
      }
      return found;
    }

    /** Split plain text into strings and mention chips. */
    function mentionNodes(text, key, matcher) {
      const scans = scanMentions(text, matcher);
      if (scans.length === 0) return [text];
      const nodes = [];
      let last = 0;
      scans.forEach((scan, index) => {
        if (scan.start > last) nodes.push(text.slice(last, scan.start));
        nodes.push(h('span', { key: `${key}-m${index}`, className: cx('mention', scan.everyone && 'mention-all') }, scan.raw));
        last = scan.end;
      });
      if (last < text.length) nodes.push(text.slice(last));
      return nodes;
    }

    /**
     * Render one line of text with Markdown-lite and mentions in one pass, so
     * `**@Name**` still gets both the bold wrapper and the mention chip.
     */
    function renderInline(line, key, matcher) {
      if (matcher === null) return inlineNodes(line, key);
      const pattern = /(\*\*[^*\n]+\*\*|`[^`\n]+`|\[[^\]\n]+\]\([^)\s]+\))/g;
      const nodes = [];
      let last = 0;
      let index = 0;
      let match;
      while ((match = pattern.exec(line)) !== null) {
        if (match.index > last) nodes.push(...mentionNodes(line.slice(last, match.index), `${key}-p${index}`, matcher));
        const token = match[0];
        if (token.startsWith('**')) {
          nodes.push(h('strong', { key: `${key}-b${index}` }, ...mentionNodes(token.slice(2, -2), `${key}-bi${index}`, matcher)));
        } else if (token.startsWith('`')) {
          nodes.push(h('code', { key: `${key}-c${index}` }, token.slice(1, -1)));
        } else {
          const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
          nodes.push(h('a', { key: `${key}-a${index}`, href: link?.[2], target: '_blank', rel: 'noreferrer' },
            ...mentionNodes(link?.[1] ?? token, `${key}-ai${index}`, matcher)));
        }
        last = match.index + token.length;
        index += 1;
      }
      if (last < line.length) nodes.push(...mentionNodes(line.slice(last), `${key}-pend`, matcher));
      return nodes;
    }

    function MentionText({ text, participants, group }) {
      const value = String(text ?? '');
      const scans = scanMentions(value, mentionMatcher(participants, group));
      if (scans.length === 0) return value;
      const nodes = [];
      let last = 0;
      scans.forEach((scan, index) => {
        if (scan.start > last) nodes.push(value.slice(last, scan.start));
        nodes.push(h('span', { key: `m${index}`, className: cx('mention', scan.everyone && 'mention-all') }, scan.raw));
        last = scan.end;
      });
      if (last < value.length) nodes.push(value.slice(last));
      return h(React.Fragment, null, nodes);
    }

    /** Composer candidates for a `@` query: the chat's Bots, then @everyone for groups. */
    function mentionChoices(participants, group, query) {
      const needle = String(query ?? '').trim().toLowerCase();
      const rows = [];
      for (const bot of participants ?? []) {
        const name = String(bot?.name ?? '').trim();
        if (name.length === 0) continue;
        const label = String(bot?.label ?? '');
        if (needle.length > 0 && !name.toLowerCase().includes(needle) && !label.toLowerCase().includes(needle)) continue;
        rows.push({ key: `bot-${bot.id}`, kind: 'bot', bot, name, label });
      }
      const everyone = ['everyone', '所有人', '全体'];
      if (group === true && (participants?.length ?? 0) > 1 && (needle.length === 0 || everyone.some((word) => word.startsWith(needle)))) {
        rows.push({ key: 'everyone', kind: 'everyone', name: 'everyone', label: '' });
      }
      return rows;
    }

    /* ------------------------------------------------------------------ */
    /* Client store                                                       */
    /* ------------------------------------------------------------------ */

    class TeamClient {
      constructor() {
        this.view = { state: null, loading: true, error: null };
        this.listeners = new Set();
        this.version = -1;
        this.timer = null;
        this.inflight = null;
        this.subscribe = (listener) => {
          this.listeners.add(listener);
          return () => this.listeners.delete(listener);
        };
        this.getSnapshot = () => this.view;
      }

      publish(patch) {
        this.view = { ...this.view, ...patch };
        for (const listener of [...this.listeners]) listener();
      }

      async refresh(force = false) {
        if (this.inflight !== null) return this.inflight;
        this.inflight = (async () => {
          try {
            const response = await fetch('/deepseek-bot-army/api/state', { headers: { accept: 'application/json' } });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const body = await response.json();
            if (!body.ok) throw new Error(body.error ?? 'state failed');
            if (force || body.state.version !== this.version) {
              this.version = body.state.version;
              this.publish({ state: body.state, loading: false, error: null });
            } else {
              this.publish({ loading: false, error: null });
            }
          } catch (error) {
            this.publish({ loading: false, error: error instanceof Error ? error.message : String(error) });
          } finally {
            this.inflight = null;
          }
        })();
        return this.inflight;
      }

      async act(action, payload = {}) {
        const response = await fetch('/deepseek-bot-army/api/action', {
          method: 'POST',
          headers: { 'content-type': 'application/json', accept: 'application/json' },
          body: JSON.stringify({ action, payload }),
        });
        const body = await response.json();
        if (!body.ok) throw new Error(body.error ?? 'action failed');
        await this.refresh(true);
        return body.result;
      }

      start() {
        if (this.timer !== null) return;
        const tick = () => {
          void this.refresh();
          this.timer = setTimeout(tick, 1000);
          if (typeof this.timer.unref === 'function') this.timer.unref();
        };
        tick();
      }

      stop() {
        if (this.timer !== null) clearTimeout(this.timer);
        this.timer = null;
      }
    }

    /* ------------------------------------------------------------------ */
    /* Shared controls                                                    */
    /* ------------------------------------------------------------------ */

    let activeT = null;
    function tSafe(key) {
      return typeof activeT === 'function' ? activeT(key) : key;
    }

    function Sheet({ title, sub, wide = false, onClose, children, footer }) {
      const sheetRef = React.useRef(null);
      const closeRef = React.useRef(onClose);
      closeRef.current = onClose;
      React.useEffect(() => {
        const onKey = (event) => {
          if (event.key === 'Escape') closeRef.current();
        };
        window.addEventListener('keydown', onKey);
        const first = sheetRef.current?.querySelector('input, textarea, select');
        if (first !== null && first !== undefined) setTimeout(() => first.focus(), 30);
        return () => window.removeEventListener('keydown', onKey);
      }, []);
      return h('div', { className: 'modal-layer is-open' },
        h('div', { className: 'modal-backdrop', onClick: onClose }),
        h('div', { className: cx('sheet', wide && 'sheet-wide'), role: 'dialog', 'aria-modal': true, 'aria-label': title, ref: sheetRef },
          h('header', { className: 'sheet-head' },
            h('div', null,
              h('h2', null, title),
              sub ? h('p', null, sub) : null,
            ),
            h('button', { type: 'button', className: 'icon-btn', onClick: onClose, 'aria-label': tSafe('modal.close') }, h(Icon, { name: 'x' })),
          ),
          children,
          footer ? h('footer', { className: 'sheet-foot' }, footer) : null,
        ),
      );
    }

    function Field({ label, children }) {
      return h('label', { className: 'field' }, h('span', null, label), children);
    }

    function BotFields({ value, onChange, t }) {
      return h(React.Fragment, null,
        h('div', { className: 'form-grid' },
          h(Field, { label: t('newBot.name') },
            h('input', { value: value.name, placeholder: t('newBot.namePlaceholder'), onChange: (event) => onChange({ ...value, name: event.target.value }), required: true }),
          ),
          h(Field, { label: t('newBot.label') },
            h('input', { value: value.label, placeholder: t('newBot.labelPlaceholder'), onChange: (event) => onChange({ ...value, label: event.target.value }) }),
          ),
        ),
        h(Field, { label: t('newBot.desc') },
          h('textarea', { value: value.description, placeholder: t('newBot.descPlaceholder'), onChange: (event) => onChange({ ...value, description: event.target.value }) }),
        ),
        h(Field, { label: t('newBot.workspace') },
          h('input', { value: value.workspace ?? '', placeholder: t('newBot.workspacePlaceholder'), onChange: (event) => onChange({ ...value, workspace: event.target.value }) }),
        ),
        h('fieldset', { className: 'field' },
          h('legend', null, t('newBot.avatar')),
          h('div', { className: 'emoji-grid' }, EMOJIS.map((emoji) => h('button', {
            key: emoji,
            type: 'button',
            className: 'emoji-opt',
            'aria-pressed': value.emoji === emoji,
            onClick: () => onChange({ ...value, emoji }),
          }, emoji))),
        ),
        h('fieldset', { className: 'field' },
          h('legend', null, t('newBot.accent')),
          h('div', { className: 'swatches' }, SWATCHES.map(([name, cls, hex]) => h('button', {
            key: name,
            type: 'button',
            className: cx('swatch', cls),
            'aria-pressed': value.color === hex,
            'aria-label': name,
            onClick: () => onChange({ ...value, color: hex }),
          }, h(Icon, { name: 'check' })))),
        ),
        h('div', { className: 'bot-preview' },
          h('span', { className: cx('bot-avatar', `tint-${tintByHex(value.color)}`), style: { width: 34, height: 34, borderRadius: 9, fontSize: 17 } }, value.emoji || '🧭'),
          h('div', null,
            h('div', { className: 'bp-name' }, value.name || t('newBot.previewName')),
            h('div', { className: 'bp-label' }, value.label || t('newBot.previewLabel')),
          ),
        ),
      );
    }

    function Toast({ text }) {
      return h('div', { className: cx('toast', text && 'is-on'), role: 'status', 'aria-live': 'polite' },
        h(Icon, { name: 'check' }),
        h('span', null, text ?? ''),
      );
    }

    /* ------------------------------------------------------------------ */
    /* Toolbar / sidebar                                                  */
    /* ------------------------------------------------------------------ */

    function Toolbar({ t, view, onView, onSearch, onNewBot, onMenu }) {
      return h('header', { className: 'toolbar' },
        h('div', { className: 'tb-left' },
          h('button', { type: 'button', className: 'icon-btn menu-btn', onClick: onMenu, 'aria-label': t('side.team') }, h(Icon, { name: 'menu', cls: 'ic-18' })),
          h('h1', { className: 'app-title' }, t('app.title')),
        ),
        h('div', { className: 'tb-center' },
          h('div', { className: 'seg', role: 'tablist', 'aria-label': 'Views' },
            h('button', { type: 'button', role: 'tab', 'aria-selected': view === 'chat', onClick: () => onView('chat') }, t('app.chat')),
            h('button', { type: 'button', role: 'tab', 'aria-selected': view === 'tasks', onClick: () => onView('tasks') }, t('app.tasks')),
            h('button', { type: 'button', role: 'tab', 'aria-selected': view === 'market', onClick: () => onView('market') }, t('app.market')),
          ),
        ),
        h('div', { className: 'tb-right' },
          h('button', { type: 'button', className: 'icon-btn', onClick: onSearch, 'aria-label': t('app.search'), title: `${t('app.search')} (⌘K)` }, h(Icon, { name: 'search' })),
          h('button', { type: 'button', className: 'icon-btn', onClick: onNewBot, 'aria-label': t('app.newBot'), title: t('app.newBot') }, h(Icon, { name: 'plus', cls: 'ic-18' })),
          h('span', { className: 'avatar avatar-me', role: 'img', 'aria-label': t('app.you') }, t('app.you')),
        ),
      );
    }

    function Sidebar({ t, bots, rooms, activeThreadId, onSelect, view, onView, reviewCount, templateCount, skillCount, onNewBot, onNewRoom, open, onClose }) {
      return h(React.Fragment, null,
        open ? h('div', { className: 'drawer-scrim', onClick: onClose }) : null,
        h('aside', { className: cx('sidebar', open && 'is-open') },
          h('div', { className: 'sidebar-scroll' },
            h('div', { className: 'side-head' },
              h('h2', null, t('side.team')),
              h('button', { type: 'button', className: 'icon-btn', onClick: onNewBot, 'aria-label': t('side.newBot'), title: t('side.newBot') }, h(Icon, { name: 'plus' })),
            ),
            bots.map((bot) => {
              const active = bot.threadId === activeThreadId;
              const working = bot.status === 'working';
              const needsYou = (bot.needsAttention ?? 0) > 0;
              const checking = !working && !needsYou && bot.heartbeat?.checking === true;
              return h('button', {
                key: bot.id,
                type: 'button',
                className: cx('nav-row', active && 'is-active', working && 'is-working', checking && 'is-checking'),
                onClick: () => bot.threadId && onSelect(bot.threadId),
              },
                h(BotAvatar, { bot }),
                h('span', { className: 'nav-text' },
                  h('span', { className: 'nav-name' }, bot.name, working ? h('span', { className: 'pulse', 'aria-hidden': true }) : null),
                  h('span', { className: 'nav-sub' },
                    working
                      ? (bot.activity?.label ?? t('thread.working'))
                      : needsYou
                        ? (bot.label || t('thread.needsYou'))
                        : checking
                          ? t('hb.checking')
                          : (bot.label || t('thread.idle')),
                  ),
                ),
                h('span', { className: 'nav-end' },
                  bot.unread > 0 ? h('span', { className: 'badge' }, String(bot.unread)) : null,
                  bot.needsAttention > 0 ? h('span', { className: 'badge badge-accent' }, String(bot.needsAttention)) : null,
                ),
              );
            }),
            h('div', { className: 'side-head' },
              h('h2', null, t('side.rooms')),
              h('button', { type: 'button', className: 'icon-btn', onClick: onNewRoom, 'aria-label': t('side.newRoom'), title: t('side.newRoom') }, h(Icon, { name: 'plus' })),
            ),
            rooms.map((room) => h('button', {
              key: room.id,
              type: 'button',
              className: cx('nav-row', room.id === activeThreadId && 'is-active'),
              onClick: () => onSelect(room.id),
            },
              h(RoomAvatar),
              h('span', { className: 'nav-text' },
                h('span', { className: 'nav-name' }, room.title),
                h('span', { className: 'nav-sub' }, t('side.roomSub').replace('{n}', String(room.botIds.length))),
              ),
              h('span', { className: 'nav-end' }, room.unread > 0 ? h('span', { className: 'badge' }, String(room.unread)) : null),
            )),
          ),
          h('div', { className: 'side-foot' },
            h('button', { type: 'button', className: cx('nav-link', view === 'market' && 'is-active'), onClick: () => onView('market') },
              h(Icon, { name: 'grid' }), h('span', null, t('side.market')), h('span', { className: 'badge' }, String(templateCount))),
            h('button', { type: 'button', className: cx('nav-link', view === 'tasks' && 'is-active'), onClick: () => onView('tasks') },
              h(Icon, { name: 'checklist' }), h('span', null, t('side.tasks')), h('span', { className: 'badge' }, String(reviewCount))),
            h('button', { type: 'button', className: cx('nav-link', view === 'skills' && 'is-active'), onClick: () => onView('skills') },
              h(Icon, { name: 'layers' }), h('span', null, t('side.skills')), h('span', { className: 'badge' }, String(skillCount))),
            h('div', { className: 'sync-line' }, h('span', { className: 'dot-green' }), t('side.sync')),
          ),
        ),
      );
    }

    /* ------------------------------------------------------------------ */
    /* Thread + approval                                                  */
    /* ------------------------------------------------------------------ */

    function UserMessage({ entry, participants, group }) {
      return h('div', { className: 'msg-user' },
        h('div', { className: 'bubble' }, h(MentionText, { text: entry.text, participants, group })),
        h('span', { className: 'msg-time mono' }, clock(entry.createdAt)),
      );
    }

    function SystemNote({ entry }) {
      return h('div', { className: 'msg-system' }, h(Icon, { name: 'link' }), h('span', null, entry.text));
    }

    function ActivityRow({ bot, t }) {
      return h('div', { className: 'activity' },
        h('span', { className: 'activity-mark', 'aria-hidden': true }, h('span', { className: 'bars' }, h('i'), h('i'), h('i'))),
        h('span', { className: 'activity-text' },
          h('span', { className: 'activity-label' }, bot?.activity?.label ?? t('thread.working'), h('span', { className: 'dots', 'aria-hidden': true }, h('i'), h('i'), h('i'))),
          h('span', { className: 'activity-detail' }, t('thread.note')),
        ),
      );
    }

    function CheckingRow({ bot, t }) {
      const detail = bot?.heartbeat?.lastReason;
      return h('div', { className: 'activity is-checking' },
        h('span', { className: 'activity-mark', 'aria-hidden': true }, h(Icon, { name: 'clock', cls: 'ic-14' })),
        h('span', { className: 'activity-text' },
          h('span', { className: 'activity-label' }, t('hb.checking'), h('span', { className: 'dots', 'aria-hidden': true }, h('i'), h('i'), h('i'))),
          h('span', { className: 'activity-detail' }, detail ? String(detail) : t('hb.activityDetail')),
        ),
      );
    }

    function CheckinCard({ checkin, bot, t, onResolve }) {
      const question = String(checkin?.question ?? '').trim().slice(0, 800);
      return h('div', { className: 'approval hb-checkin', role: 'group', 'aria-label': t('hb.checkinTitle') },
        h('div', { className: 'ap-head' },
          h('span', { className: 'dot' }),
          t('hb.checkinTitle'),
          h('time', null, clock(checkin?.createdAt)),
        ),
        h('div', { className: 'ap-body' },
          h('div', { className: 'ap-title-row' },
            h(BotAvatar, { bot, style: { width: 22, height: 22, borderRadius: 6, fontSize: 11 } }),
            h('span', { className: 'ap-title' }, t('hb.checkinSub')),
          ),
          question.length > 0 ? h('p', { className: 'hb-question' }, question) : null,
          h('div', { className: 'ap-actions' },
            h('button', {
              type: 'button',
              className: 'btn btn-primary btn-28',
              onClick: () => onResolve(checkin.id),
            }, h(Icon, { name: 'check', cls: 'ic-12' }), t('hb.checkinGotIt')),
          ),
        ),
      );
    }

    function ApprovalCard({ task, bot, thread, t, actions, source }) {
      const [revise, setRevise] = React.useState(false);
      const [note, setNote] = React.useState('');
      const pending = task.status === 'review';
      const done = task.status === 'done';
      const ignored = task.status === 'cancelled';
      const failed = task.status === 'failed';
      const changes = task.status === 'working' || task.status === 'queued';
      if (ignored) {
        return h('div', { className: 'approval is-ignored' },
          h(Icon, { name: 'x', cls: 'ic-12' }),
          h('span', { className: 'ig-text' }, `${t('ap.ignored')} · ${task.title}`),
        );
      }
      const head = done
        ? h('div', { className: 'ap-head' }, h(Icon, { name: 'check-circle', cls: 'ic-12' }), t('ap.approved'), h('time', null, clock(task.updatedAt)))
        : changes
          ? h('div', { className: 'ap-head' }, h(Icon, { name: 'clock', cls: 'ic-12' }), failed ? t('tasks.failed') : t('tasks.active'), h('time', null, clock(task.updatedAt)))
          : h('div', { className: 'ap-head' }, h('span', { className: 'dot' }), t('ap.pending'), h('time', null, clock(task.updatedAt)));
      return h('div', { className: cx('approval', done && 'is-approved') },
        head,
        h('div', { className: 'ap-body' },
          h('div', { className: 'ap-title-row' },
            h('span', { className: 'ap-title' }, task.title),
            task.boardTaskId ? h('span', { className: 'tag' }, h(Icon, { name: 'link' }), t('thread.synced')) : null,
          ),
          h('div', { className: 'ap-meta' }, `${bot?.name ?? 'Bot'} · ${clock(task.updatedAt)} · ${task.boardTaskId ? t('ap.sync') : t('ap.localTask')}`),
          !done && !changes ? h('ul', { className: 'diff' },
            h('li', null, h('span', { className: 'op' }, '·'), h('span', null, t('ap.diffSource').replace('{source}', source))),
            h('li', null, h('span', { className: 'op add' }, '+'), h('span', null, t('ap.diffWork').replace('{name}', bot?.name ?? 'Bot'))),
            task.boardTaskId ? h('li', null, h('span', { className: 'op' }, '·'), h('span', null, t('ap.diffBoard'))) : null,
          ) : null,
          done ? h('div', { className: 'ap-done' }, h(Icon, { name: 'check', cls: 'ic-12' }), t('ap.writeMemory'), task.boardTaskId ? ` · ${t('ap.sync')}` : '') : null,
          changes ? h('div', { className: 'ap-done' }, h(Icon, { name: 'clock', cls: 'ic-12' }), t('ap.waiting').replace('{name}', bot?.name ?? 'Bot')) : null,
          pending ? (revise
            ? h('div', { className: 'revise' },
                h('textarea', { value: note, placeholder: t('ap.placeholder'), onChange: (event) => setNote(event.target.value) }),
                h('div', { className: 'revise-actions' },
                  h('button', { type: 'button', className: 'btn btn-secondary btn-28', onClick: () => setRevise(false) }, t('ap.cancel')),
                  h('button', { type: 'button', className: 'btn btn-primary btn-28', disabled: note.trim().length === 0, onClick: async () => { await actions.requestChanges(task.id, note.trim()); setNote(''); setRevise(false); } }, t('ap.submit')),
                ),
              )
            : h('div', { className: 'ap-actions' },
                h('button', { type: 'button', className: 'btn btn-primary btn-28', onClick: () => actions.approve(task.id) }, t('ap.approve')),
                h('button', { type: 'button', className: 'btn btn-secondary btn-28', onClick: () => setRevise(true) }, t('ap.revise')),
                h('span', { className: 'spacer' }),
                h('button', { type: 'button', className: 'btn btn-plain', onClick: () => actions.dismiss(task.id) }, t('ap.ignore')),
              )) : null,
        ),
      );
    }

    function scheduleLabel(schedule, t) {
      if (!schedule || schedule.kind === 'manual') return t('routine.manual');
      if (schedule.kind === 'interval') return `${t('routine.interval').replace('N', String(schedule.minutes ?? 30))}`;
      if (schedule.kind === 'daily') return `${t('routine.daily')} ${schedule.time ?? '09:00'}`;
      if (schedule.kind === 'weekdays') return `${t('routine.weekdays')} ${schedule.time ?? '09:00'}`;
      return t('routine.manual');
    }

    function actionName(toolName, t) {
      if (/^(write|edit|apply_patch|multi_edit|create_file|delete_file|move_file|rename|mkdir|touch|chmod)$/i.test(toolName)) return t('action.write');
      if (/^(bash|terminal|shell|exec|pwsh)/i.test(toolName)) return t('action.bash');
      if (/^workspace_task$/i.test(toolName)) return t('action.board');
      if (/^(send_message|subchat|workflow)$/i.test(toolName)) return t('action.send');
      return t('action.tool').replace('{name}', toolName);
    }

    function verdictLabel(verdict, t) {
      if (verdict === 'idle') return t('hb.verdict.idle');
      if (verdict === 'wait') return t('hb.verdict.wait');
      if (verdict === 'resume') return t('hb.verdict.resume');
      if (verdict === 'ask_user') return t('hb.verdict.ask_user');
      return verdict === null || verdict === undefined || verdict === '' ? t('hb.verdictNone') : String(verdict);
    }

    function modeLabel(mode, t) {
      if (mode === 'off') return t('hb.modeOff');
      if (mode === 'triage') return t('hb.modeTriage');
      if (mode === 'shadow') return t('hb.modeShadow');
      if (mode === 'resume') return t('hb.modeResume');
      return t('hb.modeOff');
    }

    function clampCount(value, min, max) {
      const parsed = Number(value);
      if (!Number.isFinite(parsed)) return min;
      return Math.min(max, Math.max(min, Math.round(parsed)));
    }

    const HEARTBEAT_INTERVALS = [300, 600, 900, 1800, 3600];

    function ActionApprovalCard({ approval, bot, t, onDecide }) {
      const expired = approval.state === 'expired';
      return h('div', { className: 'approval' },
        h('div', { className: 'ap-head' },
          h(Icon, { name: expired ? 'x' : 'check-circle', cls: 'ic-12' }),
          expired ? t('actionApproval.expired') : t('actionApproval.title'),
          h('time', null, clock(approval.createdAt)),
        ),
        h('div', { className: 'ap-body' },
          h('div', { className: 'ap-title-row' },
            h('span', { className: 'ap-title' }, actionName(approval.toolName, t)),
            h('span', { className: 'tag' }, approval.toolName),
          ),
          h('div', { className: 'ap-meta' }, `${bot?.name ?? 'Bot'} · ${expired ? t('actionApproval.expired') : t('actionApproval.waiting')}`),
          approval.args ? h('pre', { className: 'preview-text', style: { maxHeight: 140, marginTop: 8 } }, approval.args) : null,
          expired
            ? h('div', { className: 'ap-done' }, h(Icon, { name: 'x', cls: 'ic-12' }), t('actionApproval.expired'))
            : h('div', { className: 'ap-actions' },
                h('button', { type: 'button', className: 'btn btn-primary btn-28', onClick: () => onDecide(approval.id, 'allow-once') }, t('actionApproval.allowOnce')),
                h('button', { type: 'button', className: 'btn btn-secondary btn-28', onClick: () => onDecide(approval.id, 'always-allow') }, t('actionApproval.alwaysAllow')),
                h('span', { className: 'spacer' }),
                h('button', { type: 'button', className: 'btn btn-plain', onClick: () => onDecide(approval.id, 'deny') }, t('actionApproval.deny')),
              ),
        ),
      );
    }

    function SuggestionCard({ suggestion, bot, t, onAccept, onDismiss }) {
      return h('div', { className: 'approval' },
        h('div', { className: 'ap-head' },
          h(Icon, { name: 'check-circle', cls: 'ic-12' }),
          t('suggestion.title'),
          h('time', null, clock(suggestion.createdAt)),
        ),
        h('div', { className: 'ap-body' },
          h('div', { className: 'ap-title-row' }, h('span', { className: 'ap-title' }, suggestion.title)),
          h('div', { className: 'ap-meta' }, `${bot?.name ?? 'Bot'} · ${t('suggestion.sub')}`),
          h('div', { className: 'sk-label', style: { marginTop: 8 } }, t('suggestion.steps')),
          h('ul', { className: 'diff' }, suggestion.steps.map((step, index) => h('li', { key: index },
            h('span', { className: 'op' }, String(index + 1)),
            h('span', null, step),
          ))),
          h('div', { className: 'ap-actions' },
            h('button', { type: 'button', className: 'btn btn-primary btn-28', onClick: () => onAccept(suggestion.id, 'routine') }, t('suggestion.routine')),
            h('button', { type: 'button', className: 'btn btn-secondary btn-28', onClick: () => onAccept(suggestion.id, 'skill') }, t('suggestion.skill')),
            h('span', { className: 'spacer' }),
            h('button', { type: 'button', className: 'btn btn-plain', onClick: () => onDismiss(suggestion.id) }, t('suggestion.dismiss')),
          ),
        ),
      );
    }

    function IntentCard({ pending, t, onConfirm, onCancel }) {
      const suggestion = pending.suggestion === 'task' ? t('intent.task') : t('intent.chat');
      return h('div', { className: 'approval' },
        h('div', { className: 'ap-head' },
          h(Icon, { name: 'bubble', cls: 'ic-12' }),
          t('intent.title'),
          h('time', null, clock(pending.createdAt)),
        ),
        h('div', { className: 'ap-body' },
          h('div', { className: 'ap-title-row' },
            h('span', { className: 'ap-title' }, String(pending.text).slice(0, 90)),
          ),
          h('div', { className: 'ap-meta' }, `${t('intent.suggestion')}: ${suggestion} · ${Math.round((pending.confidence ?? 0.5) * 100)}%`),
          h('div', { className: 'ap-done' }, h(Icon, { name: 'clock', cls: 'ic-12' }), t('intent.sub')),
          h('div', { className: 'ap-actions' },
            h('button', { type: 'button', className: 'btn btn-primary btn-28', onClick: () => onConfirm(pending.id, 'task') }, t('intent.task')),
            h('button', { type: 'button', className: 'btn btn-secondary btn-28', onClick: () => onConfirm(pending.id, 'chat') }, t('intent.chat')),
            h('span', { className: 'spacer' }),
            h('button', { type: 'button', className: 'btn btn-plain', onClick: () => onCancel(pending.id) }, t('intent.dismiss')),
          ),
        ),
      );
    }

    function BotMessage({ entry, bot, task, thread, t, actions, participants, group }) {
      const streaming = entry.status === 'streaming';
      const error = entry.status === 'error';
      const queued = entry.status === 'queued';
      const text = String(entry.text ?? '');
      const [expanded, setExpanded] = React.useState(false);
      const long = text.length > 1600 || text.split('\n').length > 20;
      const shown = long && !expanded ? `${text.slice(0, 1300).trimEnd()}…` : text;
      return h(React.Fragment, null,
        h('div', { className: 'msg-bot' },
          h(BotAvatar, { bot, style: { width: 26, height: 26, borderRadius: 7, fontSize: 13 } }),
          h('div', { className: 'msg-body' },
            h('div', { className: 'msg-meta' },
              h('span', { className: 'msg-name' }, bot?.name ?? 'Bot'),
              h('span', { className: 'msg-time mono' }, clock(entry.createdAt)),
            ),
            h('div', { className: 'msg-text' },
              queued ? h(ActivityRow, { bot, t }) : null,
              error
                ? h('p', { style: { color: 'var(--danger)' } }, h(Md, { text, participants, group }))
                : text.trim().length > 0
                  ? h(Md, { text: shown, participants, group })
                  : streaming
                    ? h('span', { className: 'caret', 'aria-hidden': true })
                    : null,
              streaming && text.trim().length > 0 ? h('span', { className: 'caret', 'aria-hidden': true }) : null,
              long && !error ? h('button', { type: 'button', className: 'btn btn-plain btn-24', style: { marginTop: 4 }, onClick: () => setExpanded(!expanded) }, expanded ? '收起' : '展开') : null,
            ),
          ),
        ),
        task !== undefined && task.status === 'review'
          ? h(ApprovalCard, { task, bot, thread, t, actions, source: thread.title })
          : null,
      );
    }

    function EmptyState({ bot, thread, t, onStarter }) {
      return h('div', { className: 'empty' },
        h('div', { className: 'empty-mark', 'aria-hidden': true }, h(Icon, { name: 'bubble', cls: 'ic-18' })),
        h('h2', null, t('empty.title').replace('{name}', bot?.name ?? thread.title)),
        h('p', null, t('empty.body')),
        h('div', { className: 'starters' }, (bot?.starters ?? []).map((starter) => h('button', {
          key: starter,
          type: 'button',
          className: 'starter',
          onClick: () => onStarter(starter),
        }, h(Icon, { name: 'arrow-right', cls: 'ic-12' }), h('span', null, starter)))),
      );
    }

    function Composer({ t, thread, bot, participants, value, setValue, onSend, onStop, onComputer, working }) {
      const ref = React.useRef(null);
      const pendingCaret = React.useRef(null);
      const suppressed = React.useRef(null);
      const picked = React.useRef([]);
      const [active, setActive] = React.useState(null);
      const group = thread.kind === 'group';
      React.useEffect(() => {
        setActive(null);
        suppressed.current = null;
        pendingCaret.current = null;
        picked.current = [];
      }, [thread.id]);
      React.useEffect(() => {
        if (ref.current !== null) {
          ref.current.style.height = 'auto';
          ref.current.style.height = `${Math.min(ref.current.scrollHeight, 120)}px`;
        }
        if (pendingCaret.current !== null) {
          const position = pendingCaret.current;
          pendingCaret.current = null;
          if (ref.current !== null) {
            ref.current.focus();
            ref.current.setSelectionRange(position, position);
          }
        }
      }, [value]);

      const refresh = (nextValue, nextCaret) => {
        const query = mentionQuery(nextValue, nextCaret);
        if (query === null) {
          suppressed.current = null;
          setActive(null);
          return;
        }
        if (suppressed.current === query.start) {
          setActive(null);
          return;
        }
        setActive((current) => ({
          start: query.start,
          query: query.query,
          cursor: current !== null && current.start === query.start ? current.cursor : 0,
        }));
      };

      const choose = (entry) => {
        if (active === null || entry === undefined) return;
        const token = entry.kind === 'everyone' ? '@everyone' : `@${entry.name}`;
        const typedName = entry.kind === 'everyone' ? 'everyone' : entry.name;
        const typedAhead = value.slice(active.start + 1);
        let end;
        if (typedAhead.toLowerCase().startsWith(typedName.toLowerCase())) {
          end = active.start + 1 + typedName.length;
        } else {
          end = active.start + 1 + active.query.length;
          while (end < value.length && /[\w\u4e00-\u9fff-]/.test(value.slice(end, end + 1))) end += 1;
        }
        let rest = value.slice(end);
        if (rest.startsWith(' ')) rest = rest.slice(1);
        const nextValue = `${value.slice(0, active.start)}${token} ${rest}`;
        const position = active.start + token.length + 1;
        if (entry.kind === 'bot' && entry.bot !== undefined && !picked.current.some((item) => item.id === entry.bot.id)) {
          picked.current.push({ id: entry.bot.id, name: entry.name });
        }
        pendingCaret.current = position;
        suppressed.current = null;
        setActive(null);
        setValue(nextValue);
      };

      const removeTag = (token) => {
        let start = token.start;
        let end = token.end;
        if (value.slice(end, end + 1) === ' ') end += 1;
        else if (value.slice(start - 1, start) === ' ') start -= 1;
        const index = picked.current.map((item) => item.name.toLowerCase()).lastIndexOf(token.name.toLowerCase());
        if (index >= 0) picked.current.splice(index, 1);
        const nextValue = `${value.slice(0, start)}${value.slice(end)}`;
        pendingCaret.current = start;
        setActive(null);
        setValue(nextValue);
      };

      const openPicker = () => {
        const element = ref.current;
        const position = element !== null && typeof element.selectionStart === 'number' ? element.selectionStart : value.length;
        const existing = mentionQuery(value, position);
        if (existing !== null) {
          suppressed.current = null;
          setActive((current) => (current === null ? { start: existing.start, query: existing.query, cursor: 0 } : null));
          return;
        }
        if (active !== null) {
          suppressed.current = active.start;
          setActive(null);
          return;
        }
        const previous = position > 0 ? value.slice(position - 1, position) : '';
        const spacer = /[A-Za-z0-9\u4e00-\u9fff）)\]】"']/.test(previous) ? ' ' : '';
        const nextValue = `${value.slice(0, position)}${spacer}@${value.slice(position)}`;
        const nextCaret = position + spacer.length + 1;
        pendingCaret.current = nextCaret;
        suppressed.current = null;
        setValue(nextValue);
        const query = mentionQuery(nextValue, nextCaret);
        setActive(query === null ? null : { start: query.start, query: query.query, cursor: 0 });
      };

      const send = () => {
        const text = value.trim();
        if (text.length === 0) return;
        const tokens = scanMentions(value, mentionMatcher(participants, group));
        const tokenNames = new Set(tokens.map((token) => token.name.toLowerCase()));
        const ids = [];
        const claimed = new Map();
        for (const item of picked.current) {
          if (!tokenNames.has(item.name.toLowerCase())) continue;
          ids.push(item.id);
          const key = item.name.toLowerCase();
          claimed.set(key, (claimed.get(key) ?? 0) + 1);
        }
        for (const token of tokens) {
          if (token.bot === undefined) continue;
          const key = token.name.toLowerCase();
          const remaining = claimed.get(key) ?? 0;
          if (remaining > 0) {
            claimed.set(key, remaining - 1);
            continue;
          }
          ids.push(token.bot.id);
        }
        const mentions = [...new Set(ids)];
        const mentionEveryone = tokens.some((token) => token.everyone);
        picked.current = [];
        setValue('');
        setActive(null);
        suppressed.current = null;
        void onSend(text, { mentions, mentionEveryone });
      };

      const choices = active === null ? [] : mentionChoices(participants, group, active.query);
      const cursor = active === null ? 0 : Math.min(active.cursor, Math.max(0, choices.length - 1));
      const tags = scanMentions(value, mentionMatcher(participants, group));

      return h('div', { className: 'composer-wrap' },
        h('div', { className: 'composer' },
          active !== null
            ? h('div', { className: 'mention-pop', id: 'gpb-mention-pop', role: 'listbox', 'aria-label': t('mention.title') },
                h('div', { className: 'mention-head' }, t('mention.title')),
                choices.length === 0
                  ? h('div', { className: 'mention-empty' }, t('mention.empty'))
                  : choices.map((entry, index) => h('button', {
                      key: entry.key,
                      id: `gpb-mention-${entry.key}`,
                      type: 'button',
                      role: 'option',
                      'aria-selected': index === cursor,
                      className: cx('mention-row', index === cursor && 'is-cursor'),
                      onMouseDown: (event) => event.preventDefault(),
                      onClick: () => choose(entry),
                    },
                      entry.kind === 'everyone'
                        ? h('span', { className: 'mention-row-icon', 'aria-hidden': true }, h(Icon, { name: 'users', cls: 'ic-14' }))
                        : h(BotAvatar, { bot: entry.bot, style: { width: 24, height: 24, borderRadius: 6, fontSize: 12 } }),
                      h('span', { className: 'mention-row-text' },
                        h('span', { className: 'mention-name' }, entry.kind === 'everyone' ? t('mention.everyone') : entry.name),
                        h('span', { className: 'mention-sub' }, entry.kind === 'everyone' ? t('mention.everyoneSub') : (entry.label || t('mention.bot'))),
                      ),
                      index === cursor ? h('span', { className: 'kbd' }, '↵') : null,
                    )),
                h('div', { className: 'mention-foot' },
                  h('span', { className: 'kbd' }, '↑'), h('span', { className: 'kbd' }, '↓'), ` ${t('mention.hintMove')} · `,
                  h('span', { className: 'kbd' }, '↵'), ` ${t('mention.hintPick')} · `,
                  h('span', { className: 'kbd' }, 'esc'), ` ${t('mention.hintClose')}`,
                ),
              )
            : null,
          tags.length > 0
            ? h('div', { className: 'mention-tags' }, tags.map((token) => h('span', {
                key: `${token.start}-${token.name}`,
                className: cx('mention-tag', token.everyone && 'is-everyone'),
              },
                token.everyone ? h(Icon, { name: 'users', cls: 'ic-12' }) : h('span', { className: 'mt-avatar', 'aria-hidden': true }, token.bot?.emoji ?? '🤖'),
                h('span', { className: 'mt-name' }, token.everyone ? t('mention.everyone') : token.name),
                h('button', {
                  type: 'button',
                  className: 'mt-x',
                  title: t('mention.remove'),
                  'aria-label': t('mention.remove'),
                  onMouseDown: (event) => event.preventDefault(),
                  onClick: () => removeTag(token),
                }, h(Icon, { name: 'x', cls: 'ic-12' })),
              )))
            : null,
          h('textarea', {
            ref,
            rows: 1,
            value,
            role: 'combobox',
            placeholder: group ? t('thread.placeholderGroup') : t('thread.placeholder').replace('{name}', bot?.name ?? thread.title),
            'aria-label': t('thread.send'),
            'aria-autocomplete': 'list',
            'aria-haspopup': 'listbox',
            'aria-expanded': active !== null,
            'aria-controls': active === null ? undefined : 'gpb-mention-pop',
            'aria-activedescendant': active === null || choices.length === 0 ? undefined : `gpb-mention-${choices[cursor].key}`,
            onChange: (event) => {
              const nextValue = event.target.value;
              const nextCaret = event.target.selectionStart ?? nextValue.length;
              setValue(nextValue);
              refresh(nextValue, nextCaret);
            },
            onSelect: () => {
              if (ref.current === null) return;
              const nextCaret = ref.current.selectionStart ?? 0;
              refresh(value, nextCaret);
            },
            onBlur: () => setActive(null),
            onKeyDown: (event) => {
              if (event.nativeEvent?.isComposing === true || event.keyCode === 229) return;
              if (active !== null && choices.length > 0) {
                if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                  event.preventDefault();
                  const step = event.key === 'ArrowDown' ? 1 : choices.length - 1;
                  setActive((current) => (current === null ? current : { ...current, cursor: (current.cursor + step) % choices.length }));
                  return;
                }
                if (event.key === 'Tab' || (event.key === 'Enter' && !event.shiftKey)) {
                  event.preventDefault();
                  choose(choices[cursor]);
                  return;
                }
              }
              if (event.key === 'Escape' && active !== null) {
                event.preventDefault();
                suppressed.current = active.start;
                setActive(null);
                return;
              }
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                send();
              }
            },
          }),
          h('div', { className: 'composer-bar' },
            h('button', {
              type: 'button',
              className: cx('icon-btn', active !== null && 'is-on'),
              title: t('thread.mention'),
              'aria-label': t('thread.mention'),
              'aria-haspopup': 'listbox',
              'aria-controls': active === null ? undefined : 'gpb-mention-pop',
              'aria-expanded': active !== null,
              onMouseDown: (event) => event.preventDefault(),
              onClick: openPicker,
            }, h('span', { className: 'at-glyph', 'aria-hidden': true }, '@')),
            h('button', { type: 'button', className: 'icon-btn', title: t('thread.attach'), 'aria-label': t('thread.attach'), disabled: true }, h(Icon, { name: 'paperclip' })),
            h('button', { type: 'button', className: 'composer-chip', onClick: onComputer }, h(Icon, { name: 'computer' }), t('thread.computer')),
            working ? h('button', { type: 'button', className: 'btn btn-plain btn-24', onClick: onStop }, t('thread.stop')) : null,
            h('span', { className: 'composer-hint' },
              h('span', { className: 'kbd' }, '@'), ` ${t('thread.mentionHint')} · `,
              h('span', { className: 'kbd' }, '↵'), ` ${t('thread.hintSend')} · `,
              h('span', { className: 'kbd' }, '⇧↵'), ` ${t('thread.hintNewline')}`,
            ),
            h('button', { type: 'button', className: 'send', 'aria-label': t('thread.send'), 'aria-disabled': value.trim().length === 0, onClick: send }, h(Icon, { name: 'arrow-up', cls: 'ic-14' })),
          ),
        ),
        h('p', { className: 'composer-note' }, h(Icon, { name: 'computer', cls: 'ic-12' }), h('span', { className: 'dot' }), t('thread.note')),
      );
    }

    function ThreadView({ t, thread, botsById, tasksById, pendingIntents, approvals, suggestions, checkins, draft, setDraft, onSend, actions, onOpenSettings, onOpenTeach, onConfirmIntent, onCancelIntent, onDecideApproval, onAcceptSuggestion, onDismissSuggestion, onResolveCheckin, onContextTab, contextOpen, onToggleContext }) {
      const scrollRef = React.useRef(null);
      const participants = thread.botIds.map((id) => botsById.get(id)).filter(Boolean);
      const primary = participants[0];
      const workingBots = participants.filter((bot) => bot.status === 'working');
      const working = workingBots.length > 0;
      const needsYou = participants.some((bot) => (bot.needsAttention ?? 0) > 0);
      const checkingBot = participants.find((bot) => bot.heartbeat?.checking === true) ?? null;
      const checking = !working && !needsYou && checkingBot !== null;
      const pendingCheckins = (checkins ?? []).filter((entry) => entry.threadId === thread.id && (entry.state ?? 'pending') === 'pending');
      const visible = thread.messages.filter((entry) => entry.role !== 'system');
      const lastMessage = thread.messages[thread.messages.length - 1];
      const signature = `${thread.messages.length > 0 ? `${lastMessage.id}:${lastMessage.text.length}` : ''}|${pendingCheckins.length}|${checking ? 'checking' : ''}`;
      React.useEffect(() => {
        if (scrollRef.current !== null) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }, [signature, thread.id]);
      const threadTasks = [...(tasksById?.values() ?? [])].filter((task) => task.threadId === thread.id || (thread.kind === 'group' && thread.botIds.includes(task.botId)));
      const synced = threadTasks.some((task) => task.boardTaskId);
      const pendingForThread = (pendingIntents ?? []).filter((entry) => entry.threadId === thread.id);
      const actionApprovals = (approvals ?? []).filter((entry) => entry.threadId === thread.id && (entry.state === 'pending' || entry.state === 'expired'));
      const openSuggestions = (suggestions ?? []).filter((entry) => entry.threadId === thread.id && entry.state === 'pending');
      return h('div', { className: 'thread-col' },
        h('header', { className: 'thread-head' },
          thread.kind === 'group' ? h(RoomAvatar) : h(BotAvatar, { bot: primary, style: { width: 32, height: 32, borderRadius: 9, fontSize: 16 } }),
          h('div', { className: 'th-text' },
            h('div', { className: 'th-name' }, thread.kind === 'group' ? thread.title : primary?.name ?? thread.title),
            h('div', { className: 'th-sub' },
              working
                ? `${workingBots[0]?.activity?.label ?? t('thread.working')}`
                : needsYou
                  ? t('thread.needsYou')
                  : checking
                    ? t('hb.checking')
                    : (primary?.label || t('thread.idle')),
            ),
          ),
          h('div', { className: 'th-actions' },
            synced ? h('span', { className: 'tag', title: t('thread.synced') }, h(Icon, { name: 'link' }), t('thread.synced')) : null,
            thread.kind === 'direct' ? h('button', { type: 'button', className: 'btn btn-plain btn-24', onClick: () => onOpenTeach(primary?.id) }, h(Icon, { name: 'play', cls: 'ic-12' }), t('thread.teach')) : null,
            h('button', { type: 'button', className: 'icon-btn', title: t('settings.title'), 'aria-label': t('settings.title'), onClick: () => onOpenSettings(thread) }, h(Icon, { name: 'more' })),
            h('button', { type: 'button', className: 'icon-btn ctx-toggle', onClick: onToggleContext, 'aria-label': t('ctx.sharedComputer'), 'aria-expanded': contextOpen }, h(Icon, { name: 'panel' })),
          ),
        ),
        h('div', { className: 'thread', ref: scrollRef, role: 'log', 'aria-live': 'polite' },
          visible.length === 0 && !working && pendingCheckins.length === 0
            ? h(EmptyState, { bot: primary, thread, t, onStarter: (starter) => setDraft(starter) })
            : h('div', { className: 'thread-inner' },
                h('div', { className: 'day-div' }, t('time.today')),
                thread.messages.map((entry) => {
                  if (entry.role === 'system') return h(SystemNote, { key: entry.id, entry });
                  if (entry.role === 'user') return h(UserMessage, { key: entry.id, entry, participants, group: thread.kind === 'group' });
                  const bot = botsById.get(entry.botId) ?? primary;
                  const task = entry.taskId ? tasksById.get(entry.taskId) : undefined;
                  return h(BotMessage, { key: entry.id, entry, bot, task, thread, t, actions, participants, group: thread.kind === 'group' });
                }),
                pendingCheckins.map((checkin) => h(CheckinCard, {
                  key: checkin.id,
                  checkin,
                  bot: botsById.get(checkin.botId) ?? primary,
                  t,
                  onResolve: onResolveCheckin,
                })),
                actionApprovals.map((approval) => h(ActionApprovalCard, { key: approval.id, approval, bot: botsById.get(approval.botId), t, onDecide: onDecideApproval })),
                pendingForThread.map((pending) => h(IntentCard, { key: pending.id, pending, t, onConfirm: onConfirmIntent, onCancel: onCancelIntent })),
                openSuggestions.map((suggestion) => h(SuggestionCard, { key: suggestion.id, suggestion, bot: botsById.get(suggestion.botId), t, onAccept: onAcceptSuggestion, onDismiss: onDismissSuggestion })),
                checking ? h(CheckingRow, { key: 'checking', bot: checkingBot, t }) : null,
                working ? h(ActivityRow, { key: 'activity', bot: workingBots[0], t }) : null,
              ),
        ),
        h(Composer, {
          t,
          thread,
          bot: primary,
          participants,
          value: draft,
          setValue: setDraft,
          onSend,
          onStop: () => (thread.kind === 'direct' ? actions.stop(primary.id) : workingBots.forEach((bot) => actions.stop(bot.id))),
          onComputer: () => onContextTab('computer'),
          working,
        }),
      );
    }

    /* ------------------------------------------------------------------ */
    /* Context panel                                                      */
    /* ------------------------------------------------------------------ */

    function ContextPanel({ t, thread, botsById, tasksById, state, tab, setTab, actions, onOpenTeach, onViewTasks, onOpenFile, onSelectThread, open, onClose }) {
      const participants = thread.botIds.map((id) => botsById.get(id)).filter(Boolean);
      const primary = participants[0];
      const tasks = state.tasks.filter((task) => (thread.kind === 'group' ? thread.botIds.includes(task.botId) : task.threadId === thread.id));
      const files = state.files ?? [];
      const [memoryDraft, setMemoryDraft] = React.useState('');
      const [teamDraft, setTeamDraft] = React.useState('');
      const tabs = thread.kind === 'group'
        ? [['tasks', t('ctx.tasks')], ['memory', t('ctx.memory')], ['members', t('ctx.members')]]
        : [['tasks', t('ctx.tasks')], ['memory', t('ctx.memory')], ['routine', t('ctx.routine')], ['heartbeat', t('ctx.heartbeat')], ['computer', t('ctx.computer')]];
      let body = null;
      if (tab === 'tasks') {
        const sorted = tasks.slice().sort((a, b) => (a.status === 'review' ? 0 : a.status === 'done' ? 2 : 1) - (b.status === 'review' ? 0 : b.status === 'done' ? 2 : 1));
        body = h(React.Fragment, null,
          h('div', { className: 'ctx-section-head' },
            h('h3', null, t('ctx.tasks')),
            h('span', { className: 'count' }, t('ctx.pendingCount').replace('{n}', String(tasks.filter((task) => task.status !== 'done').length))),
          ),
          h('div', { className: 'ctx-group' },
            sorted.length === 0 ? h('div', { className: 'ctx-empty' }, t('ctx.taskEmpty')) : null,
            sorted.slice(0, 6).map((task) => h('button', {
              key: task.id,
              type: 'button',
              className: 'ctx-task',
              onClick: () => onSelectThread(task.threadId),
            },
              h('span', { className: 'ctx-task-top' },
                h('span', { className: `status-dot ${task.status === 'review' ? 'pending' : task.status === 'done' ? 'done' : 'active'}` }),
                h('span', { className: 'ctx-task-title' }, task.title),
              ),
              h('span', { className: 'ctx-task-meta' },
                h('span', null, task.status === 'review' ? t('tasks.pending') : task.status === 'done' ? t('tasks.done') : t('tasks.active')),
                h('span', null, '·'),
                h('span', null, ago(task.updatedAt, t)),
                task.boardTaskId ? h('span', { className: 'tag' }, h(Icon, { name: 'link' }), t('thread.synced')) : null,
              ),
            )),
          ),
          h('div', { className: 'ctx-foot' },
            h('button', { type: 'button', className: 'btn btn-secondary btn-28', onClick: onViewTasks }, t('ctx.viewAll')),
          ),
        );
      } else if (tab === 'memory') {
        const teamMemory = state.teamMemory ?? [];
        const teamSection = h(React.Fragment, null,
          h('div', { className: 'ctx-section-head' }, h('h3', null, t('ctx.teamMemory')), h('span', { className: 'count' }, String(teamMemory.length))),
          h('div', { className: 'mem-list' },
            teamMemory.length
              ? teamMemory.map((entry) => h('div', { key: entry.id, className: 'mem-row' },
                  h('div', { className: 'mem-key' }, `${entry.source === 'bot' ? t('ctx.fromBot') : t('ctx.fromYou')} · ${ago(entry.updatedAt ?? entry.createdAt, t)}`),
                  h('div', { className: 'mem-val' }, entry.text),
                  h('button', { type: 'button', className: 'copy-btn', title: t('skills.delete'), onClick: () => actions.deleteTeamMemory(entry.id) }, h(Icon, { name: 'trash', cls: 'ic-12' })),
                ))
              : h('div', { className: 'ctx-empty' }, t('ctx.teamMemoryEmpty')),
          ),
          h('div', { className: 'ctx-foot', style: { display: 'flex', gap: 6 } },
            h('input', { style: { flex: 1, height: 30, border: '1px solid var(--border)', borderRadius: 8, padding: '0 9px', background: 'var(--window)', color: 'var(--fg)', fontSize: 12 }, value: teamDraft, placeholder: t('ctx.teamMemoryPlaceholder'), onChange: (event) => setTeamDraft(event.target.value) }),
            h('button', { type: 'button', className: 'btn btn-secondary btn-28', disabled: teamDraft.trim().length === 0, onClick: async () => { await actions.addTeamMemory(teamDraft.trim()); setTeamDraft(''); } }, t('ctx.addTeamMemory')),
          ),
        );
        body = thread.kind === 'group'
          ? teamSection
          : h(React.Fragment, null,
          h('div', { className: 'ctx-section-head' }, h('h3', null, t('ctx.memory')), h('span', { className: 'count' }, primary?.name ?? '')),
          h('div', { className: 'mem-update' }, h(Icon, { name: 'pencil', cls: 'ic-12' }), h('span', null, t('ctx.memoryUpdated').replace('{name}', primary?.name ?? ''))),
          h('div', { className: 'mem-list' },
            primary?.memory.length
              ? primary.memory.map((entry, index) => h('div', { key: entry.id, className: 'mem-row' },
                  h('div', { className: 'mem-key' }, t('ctx.memoryKey').replace('{n}', String(index + 1))),
                  h('div', { className: 'mem-val' }, entry.text),
                ))
              : h('div', { className: 'ctx-empty' }, t('ctx.memoryEmpty')),
          ),
          h('div', { className: 'ctx-foot', style: { display: 'flex', gap: 6 } },
            h('input', { style: { flex: 1, height: 30, border: '1px solid var(--border)', borderRadius: 8, padding: '0 9px', background: 'var(--window)', color: 'var(--fg)', fontSize: 12 }, value: memoryDraft, placeholder: t('ctx.memoryPlaceholder'), onChange: (event) => setMemoryDraft(event.target.value) }),
            h('button', { type: 'button', className: 'btn btn-secondary btn-28', disabled: memoryDraft.trim().length === 0, onClick: async () => { await actions.addMemory(primary.id, memoryDraft.trim()); setMemoryDraft(''); } }, t('ctx.addMemory')),
          ),
          teamSection,
        );
      } else if (tab === 'routine') {
        body = h(React.Fragment, null,
          h('div', { className: 'ctx-section-head' },
            h('h3', null, t('ctx.routine')),
            h('button', { type: 'button', className: 'run-btn', onClick: () => onOpenTeach(primary?.id) }, h(Icon, { name: 'plus', cls: 'ic-12' }), t('ctx.teach')),
          ),
          primary?.routines.length
            ? primary.routines.map((routine) => h('div', { key: routine.id, className: 'routine' },
                h('div', { className: 'routine-head' },
                  h('div', { style: { minWidth: 0, flex: 1 } },
                    h('div', { className: 'routine-title' }, routine.title),
                    h('div', { className: 'routine-meta' }, `${scheduleLabel(routine.schedule, t)} · ${t('ctx.runCount').replace('{n}', String(routine.runCount ?? 0))}`),
                    routine.nextRunAt ? h('div', { className: 'routine-meta' }, t('routine.next').replace('{time}', new Date(routine.nextRunAt).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }))) : null,
                    routine.lastError ? h('div', { className: 'routine-meta', style: { color: 'var(--danger)' } }, `${t('routine.failed')} · ${routine.lastError}`) : null,
                    Array.isArray(routine.runs) && routine.runs.length > 0
                      ? h('div', { className: 'routine-meta' }, `${t('routine.history')}: ${routine.runs[routine.runs.length - 1].status === 'done' ? t('routine.statusDone') : routine.runs[routine.runs.length - 1].status === 'failed' ? t('routine.statusFailed') : t('routine.statusCancelled')} · ${ago(routine.runs[routine.runs.length - 1].at, t)}`)
                      : null,
                  ),
                  h('button', {
                    type: 'button',
                    className: 'switch',
                    role: 'switch',
                    'aria-checked': routine.enabled,
                    'aria-label': routine.title,
                    onClick: () => actions.toggleRoutine(primary.id, routine.id, !routine.enabled),
                  }),
                ),
                h('div', { className: 'routine-foot' },
                  h('span', { className: 'runs' }, routine.enabled ? t('ctx.routineOn') : t('ctx.routineOff')),
                  h('button', { type: 'button', className: 'run-btn', onClick: () => actions.runRoutine(primary.id, routine.id) }, h(Icon, { name: 'play', cls: 'ic-12' }), t('ctx.runNow')),
                  h('button', { type: 'button', className: 'copy-btn', title: t('skills.delete'), onClick: () => actions.deleteRoutine(primary.id, routine.id) }, h(Icon, { name: 'trash', cls: 'ic-12' })),
                ),
              ))
            : h('div', { className: 'ctx-empty' }, t('ctx.routineEmpty')),
        );
      } else if (tab === 'heartbeat') {
        const hb = primary?.heartbeat ?? {};
        const globalHb = state.heartbeat ?? {};
        const globalMode = globalHb.mode ?? 'off';
        const globalStats = globalHb.stats ?? {};
        const enabled = hb.enabled === true;
        const checking = hb.checking === true;
        const nextAt = hb.nextHeartbeatAt ?? null;
        const maxPulses = hb.maxPulsesPerDay ?? globalHb.budgets?.pulsesPerDay;
        const maxResumes = hb.maxResumesPerDay ?? globalHb.budgets?.resumesPerDay;
        const pulseText = `${hb.pulsesToday ?? 0}${Number.isFinite(maxPulses) ? ` / ${maxPulses}` : ''}`;
        const resumeText = `${hb.resumesToday ?? 0}${Number.isFinite(maxResumes) ? ` / ${maxResumes}` : ''}`;
        body = h(React.Fragment, null,
          h('div', { className: 'ctx-section-head' },
            h('h3', null, t('ctx.heartbeat')),
            h('span', { className: 'hb-tags' },
              h('span', { className: cx('tag', enabled && 'tag-accent') }, enabled ? t('hb.on') : t('hb.off')),
              h('span', { className: 'tag' }, modeLabel(globalMode, t)),
            ),
          ),
          enabled ? null : h('div', { className: 'mem-update' }, h(Icon, { name: 'clock', cls: 'ic-12' }), h('span', null, t('hb.notEnabled'))),
          h('div', { className: 'mem-list' },
            h('div', { className: 'mem-row' },
              h('div', { className: 'mem-key' }, t('hb.nextCheck')),
              h('div', { className: 'mem-val' }, nextAt ? clock(nextAt) : t('hb.nextCheckNone')),
            ),
            h('div', { className: 'mem-row' },
              h('div', { className: 'mem-key' }, t('hb.lastVerdict')),
              h('div', { className: 'mem-val' }, verdictLabel(hb.lastVerdict, t)),
            ),
            hb.lastReason ? h('div', { className: 'mem-row' },
              h('div', { className: 'mem-key' }, t('hb.lastReason')),
              h('div', { className: 'mem-val' }, String(hb.lastReason)),
            ) : null,
            h('div', { className: 'mem-row' },
              h('div', { className: 'mem-key' }, t('hb.todayPulses')),
              h('div', { className: 'mem-val mono' }, pulseText),
            ),
            h('div', { className: 'mem-row' },
              h('div', { className: 'mem-key' }, t('hb.todayResumes')),
              h('div', { className: 'mem-val mono' }, resumeText),
            ),
          ),
          h('div', { className: 'ctx-foot' },
            h('button', {
              type: 'button',
              className: 'btn btn-secondary btn-28',
              disabled: checking || primary?.id === undefined,
              onClick: () => actions.heartbeatNow(primary.id),
            }, h(Icon, { name: 'play', cls: 'ic-12' }), checking ? t('hb.checking') : t('hb.checkNow')),
          ),
          h('div', { className: 'ctx-section-head' },
            h('h3', null, t('hb.global')),
            h('span', { className: 'count' }, t('hb.globalStats').replace('{p}', String(globalStats.pulses ?? 0)).replace('{r}', String(globalStats.resumes ?? 0))),
          ),
          h('div', { className: 'hb-global' },
            h('label', { className: 'field' },
              h('span', null, t('hb.mode')),
              h('select', {
                value: globalMode,
                onChange: (event) => actions.setHeartbeatSettings({ mode: event.target.value }),
              }, [['off', t('hb.modeOff')], ['triage', t('hb.modeTriage')], ['shadow', t('hb.modeShadow')], ['resume', t('hb.modeResume')]].map(([id, label]) => h('option', { key: id, value: id }, label))),
            ),
            h('div', { className: 'hb-switch-row' },
              h('div', { className: 'hb-label' },
                h('span', null, t('hb.autoResume')),
                h('span', { className: 'hb-sub' }, t('hb.autoResumeHint')),
              ),
              h('button', {
                type: 'button',
                className: 'switch',
                role: 'switch',
                'aria-checked': globalHb.autoResumeOnRestart === true,
                'aria-label': t('hb.autoResume'),
                onClick: () => actions.setHeartbeatSettings({ autoResumeOnRestart: globalHb.autoResumeOnRestart !== true }),
              }),
            ),
          ),
        );
      } else if (tab === 'computer') {
        body = h(React.Fragment, null,
          h('div', { className: 'ctx-section-head' }, h('h3', null, t('ctx.sharedComputer')), h('span', { className: 'count' }, t('ctx.fileCount').replace('{n}', String(files.length)))),
          h('div', { className: 'ctx-group', style: { marginBottom: 8 } },
            h('div', { className: 'path-row' },
              h('div', { className: 'path-label' }, t('ctx.deliverables')),
              h('div', { className: 'path-value' },
                h('code', { title: state.computerDir }, state.computerDir),
                h('button', { type: 'button', className: 'copy-btn', 'aria-label': t('ctx.copy'), onClick: () => actions.copy(state.computerDir) }, h(Icon, { name: 'copy' })),
              ),
            ),
            h('div', { className: 'path-row' },
              h('div', { className: 'path-label' }, t('ctx.projectWorkspace')),
              h('div', { className: 'path-value' },
                h('code', { title: primary?.workspace ?? '' }, primary?.workspace || t('ap.localTask')),
                h('button', { type: 'button', className: 'copy-btn', 'aria-label': t('ctx.copy'), onClick: () => actions.copy(primary?.workspace ?? '') }, h(Icon, { name: 'copy' })),
              ),
            ),
          ),
          h('div', { className: 'ctx-group' },
            files.length === 0 ? h('div', { className: 'ctx-empty' }, t('ctx.fileEmpty')) : null,
            files.slice(0, 12).map((file) => h('button', {
              key: file.path,
              type: 'button',
              className: 'file-row',
              onClick: () => (file.kind === 'file' ? onOpenFile(file.path) : undefined),
            },
              h(Icon, { name: file.kind === 'dir' ? 'folder' : 'file' }),
              h('span', { className: 'file-name', title: file.name }, file.name),
              h('span', { className: 'file-meta' }, file.kind === 'dir' ? '' : bytes(file.size)),
            )),
          ),
          h('div', { className: 'ctx-foot' },
            h('button', { type: 'button', className: 'btn btn-secondary btn-28', style: { width: '100%' }, onClick: () => onOpenTeach(primary?.id) }, h(Icon, { name: 'play', cls: 'ic-12' }), t('ctx.teachRoutine')),
          ),
        );
      } else if (tab === 'members') {
        body = h(React.Fragment, null,
          h('div', { className: 'ctx-section-head' }, h('h3', null, t('ctx.members')), h('span', { className: 'count' }, t('ctx.memberSub').replace('{n}', String(participants.length)))),
          h('div', { className: 'ctx-group' }, participants.map((bot) => h('div', { key: bot.id, className: 'member-row' },
            h(BotAvatar, { bot, style: { width: 28, height: 28, borderRadius: 8, fontSize: 14 } }),
            h('div', { style: { minWidth: 0, flex: 1 } },
              h('div', { className: 'member-name' }, bot.name),
              h('div', { className: 'member-role' }, bot.status === 'working' ? (bot.activity?.label ?? t('thread.working')) : (bot.label || t('thread.idle'))),
            ),
            bot.needsAttention > 0 ? h('span', { className: 'badge badge-accent' }, String(bot.needsAttention)) : null,
          ))),
        );
      }
      return h(React.Fragment, null,
        open ? h('div', { className: 'ctx-scrim', onClick: onClose }) : null,
        h('aside', { className: cx('context', open && 'is-open'), 'aria-label': t('ctx.sharedComputer') },
          h('div', { className: 'ctx-head' },
            h('div', { className: thread.kind === 'group' ? 'seg seg-4' : 'seg seg-5', role: 'tablist' }, tabs.map(([id, label]) => h('button', {
              key: id,
              type: 'button',
              role: 'tab',
              'aria-selected': tab === id,
              onClick: () => setTab(id),
            }, label))),
            h('button', { type: 'button', className: 'icon-btn ctx-close', onClick: onClose, 'aria-label': t('modal.close') }, h(Icon, { name: 'x' })),
          ),
          h('div', { className: 'ctx-body' }, body),
        ),
      );
    }

    /* ------------------------------------------------------------------ */
    /* Pages                                                              */
    /* ------------------------------------------------------------------ */

    function taskBucket(task) {
      if (task.status === 'review') return 'pending';
      if (task.status === 'done') return 'done';
      return 'active';
    }

    function TaskRow({ task, bot, thread, t, actions, onOpenThread, onReview }) {
      const bucket = taskBucket(task);
      return h('div', { className: 'task-row' },
        h(BotAvatar, { bot, style: { width: 32, height: 32, borderRadius: 8, fontSize: 15 } }),
        h('div', { style: { minWidth: 0 } },
          h('div', { className: 'task-title' },
            task.title,
            task.boardTaskId ? h('span', { className: 'tag' }, h(Icon, { name: 'link' }), t('thread.synced')) : null,
          ),
          h('div', { className: 'task-meta' },
            h('span', null, t('tasks.source').replace('{source}', thread?.title ?? '')),
            h('span', { className: 'sep' }),
            h('span', null, bot?.name ?? 'Bot'),
            h('span', { className: 'sep' }),
            h('span', null, ago(task.updatedAt, t)),
          ),
        ),
        h('div', { className: 'task-actions' },
          bucket === 'pending'
            ? h(React.Fragment, null,
                h('button', { type: 'button', className: 'btn btn-secondary btn-24', onClick: () => onReview(task) }, t('tasks.review')),
                h('button', { type: 'button', className: 'btn btn-primary btn-24', onClick: () => actions.approve(task.id) }, t('tasks.approve')),
              )
            : h('span', { className: `task-status ${bucket}` },
                h(Icon, { name: bucket === 'done' ? 'check-circle' : 'clock', cls: 'ic-12' }),
                bucket === 'done' ? t('tasks.done') : (task.status === 'failed' ? t('tasks.failed') : t('tasks.active')),
              ),
        ),
      );
    }

    function TasksPage({ t, state, botsById, threadsById, filter, setFilter, actions, onOpenThread, onReview, onTeach }) {
      const buckets = { pending: [], active: [], done: [] };
      for (const task of state.tasks) buckets[taskBucket(task)].push(task);
      const groups = filter === 'all' ? ['pending', 'active', 'done'] : [filter];
      const labels = { pending: t('tasks.pending'), active: t('tasks.active'), done: t('tasks.done') };
      return h('section', { className: 'page', role: 'tabpanel' },
        h('div', { className: 'page-inner' },
          h('div', { className: 'page-head' },
            h('div', null, h('h1', { className: 'page-title' }, t('tasks.title')), h('p', { className: 'page-sub' }, t('tasks.sub'))),
            h('button', { type: 'button', className: 'btn btn-secondary btn-30', onClick: onTeach }, h(Icon, { name: 'play', cls: 'ic-14' }), t('tasks.teach')),
          ),
          h('div', { className: 'filter-bar' },
            h('div', { className: 'seg', role: 'group' },
              [['all', t('tasks.all'), state.tasks.length], ['pending', t('tasks.pending'), buckets.pending.length], ['active', t('tasks.active'), buckets.active.length]].map(([id, label, count]) => h('button', {
                key: id,
                type: 'button',
                'aria-pressed': filter === id,
                onClick: () => setFilter(id),
              }, label, h('span', { className: 'count' }, String(count)))),
            ),
            h('span', { className: 'filter-note' }, t('tasks.note').replace('{n}', String(filter === 'all' ? state.tasks.length : (buckets[filter]?.length ?? 0)))),
          ),
          groups.map((group) => {
            const list = buckets[group] ?? [];
            if (list.length === 0) return null;
            return h(React.Fragment, { key: group },
              h('div', { className: 'group-label' }, labels[group], h('span', { className: 'n' }, String(list.length))),
              h('div', { className: 'list-card' }, list.map((task) => h(TaskRow, {
                key: task.id,
                task,
                bot: botsById.get(task.botId),
                thread: threadsById.get(task.threadId),
                t,
                actions,
                onOpenThread,
                onReview,
              }))),
            );
          }),
          state.tasks.length === 0 || groups.every((group) => (buckets[group] ?? []).length === 0)
            ? h('div', { className: 'list-card', style: { marginTop: 14 } }, h('div', { className: 'task-empty' }, t('tasks.empty')))
            : null,
        ),
      );
    }

    function MarketPage({ t, state, bots, query, setQuery, category, setCategory, onAdd }) {
      const templates = state.templates;
      const cats = ['all', ...Array.from(new Set(templates.map((template) => categoryLabel(template.category))))];
      const q = query.trim().toLowerCase();
      const shown = templates.filter((template) => {
        const label = categoryLabel(template.category);
        if (category !== 'all' && label !== category) return false;
        if (q.length === 0) return true;
        return `${template.name} ${template.label} ${template.description} ${template.category} ${label}`.toLowerCase().includes(q);
      });
      return h('section', { className: 'page', role: 'tabpanel' },
        h('div', { className: 'page-inner' },
          h('div', { className: 'page-head' }, h('div', null, h('h1', { className: 'page-title' }, t('market.title')), h('p', { className: 'page-sub' }, t('market.sub')))),
          h('div', { className: 'tool-row' },
            h('div', { className: 'search-field' },
              h(Icon, { name: 'search' }),
              h('input', { type: 'search', value: query, placeholder: t('market.search'), onChange: (event) => setQuery(event.target.value), autoComplete: 'off' }),
            ),
            h('div', { className: 'chips', role: 'group' }, cats.map((id) => h('button', {
              key: id,
              type: 'button',
              className: 'chip',
              'aria-pressed': category === id,
              onClick: () => setCategory(id),
            }, id === 'all' ? t('market.all') : id))),
          ),
          h('div', { className: 'card-grid' },
            shown.length === 0 ? h('div', { className: 'grid-empty' }, t('market.empty')) : null,
            shown.map((template) => {
              const installed = bots.some((bot) => bot.templateId === template.id);
              const skills = template.skills ?? 0;
              return h('article', { key: template.id, className: 'bot-card' },
                h('div', { className: 'bc-head' },
                  h(BotAvatar, { bot: template, style: { width: 40, height: 40, borderRadius: 10, fontSize: 20 } }),
                  h('div', null, h('div', { className: 'bc-name' }, template.name), h('div', { className: 'bc-role' }, template.label || template.category)),
                ),
                h('p', { className: 'bc-desc' }, template.description),
                h('div', { className: 'bc-foot' },
                  h('span', { className: 'bc-meta' }, skills > 0 ? t('market.skills').replace('{n}', String(skills)) : categoryLabel(template.category)),
                  installed
                    ? h('button', { type: 'button', className: 'btn btn-secondary btn-24', disabled: true }, h(Icon, { name: 'check', cls: 'ic-12' }), t('market.added'))
                    : h('button', { type: 'button', className: 'btn btn-secondary btn-24', onClick: () => onAdd(template) }, h(Icon, { name: 'plus', cls: 'ic-12' }), t('market.add')),
                ),
              );
            }),
          ),
        ),
      );
    }

    function SkillsPage({ t, state, query, setQuery, onNew, actions }) {
      const q = query.trim().toLowerCase();
      const shown = state.skills.filter((skill) => q.length === 0 || `${skill.title} ${skill.when} ${skill.steps.join(' ')}`.toLowerCase().includes(q));
      return h('section', { className: 'page', role: 'tabpanel' },
        h('div', { className: 'page-inner' },
          h('div', { className: 'page-head' },
            h('div', null, h('h1', { className: 'page-title' }, t('skills.title')), h('p', { className: 'page-sub' }, t('skills.sub'))),
            h('button', { type: 'button', className: 'btn btn-secondary btn-30', onClick: onNew }, h(Icon, { name: 'plus', cls: 'ic-14' }), t('skills.new')),
          ),
          h('div', { className: 'tool-row' },
            h('div', { className: 'search-field' },
              h(Icon, { name: 'search' }),
              h('input', { type: 'search', value: query, placeholder: t('skills.search'), onChange: (event) => setQuery(event.target.value), autoComplete: 'off' }),
            ),
          ),
          h('div', { className: 'card-grid' },
            shown.length === 0 ? h('div', { className: 'grid-empty' }, t('skills.empty')) : null,
            shown.map((skill) => h('article', { key: skill.id, className: 'skill-card' },
              h('div', { className: 'sk-top' },
                h('div', { className: 'sk-title' }, skill.title),
                h('span', { className: 'tag' }, t('skills.shared')),
              ),
              h('div', { className: 'sk-body' },
                skill.when ? h(React.Fragment, null, h('div', { className: 'sk-label' }, t('skills.when')), h('p', { className: 'sk-when' }, skill.when)) : null,
                h('div', { className: 'sk-label' }, t('skills.steps')),
                h('ol', { className: 'sk-steps' }, skill.steps.map((step, index) => h('li', { key: index }, h('span', { className: 'n' }, String(index + 1)), h('span', null, step)))),
              ),
              h('div', { className: 'sk-foot' },
                h('span', { className: 'sk-users' }, t('skills.userMeta').replace('{n}', String(skill.steps.length))),
                h('button', { type: 'button', className: 'sk-del', onClick: () => actions.deleteSkill(skill.id) }, h(Icon, { name: 'trash', cls: 'ic-12' }), t('skills.delete')),
              ),
            )),
          ),
        ),
      );
    }

    /* ------------------------------------------------------------------ */
    /* Sheets                                                             */
    /* ------------------------------------------------------------------ */

    function NewBotSheet({ t, onClose, onCreate }) {
      const [value, setValue] = React.useState({ name: '', label: '', description: '', workspace: '', emoji: '🔎', color: '#0071e3' });
      const submit = (event) => {
        event.preventDefault();
        if (value.name.trim().length === 0) return;
        void onCreate(value);
      };
      return h(Sheet, {
        title: t('newBot.title'),
        sub: t('newBot.sub'),
        onClose,
        footer: h(React.Fragment, null,
          h('span', { className: 'hint' }, t('newBot.hint')),
          h('button', { type: 'button', className: 'btn btn-secondary btn-30', onClick: onClose }, t('modal.cancel')),
          h('button', { type: 'submit', form: 'newBotForm', className: 'btn btn-primary btn-30' }, t('newBot.create')),
        ),
      },
        h('form', { id: 'newBotForm', className: 'sheet-body', onSubmit: submit }, h(BotFields, { value, onChange: setValue, t })),
      );
    }

    function SettingsSheet({ t, bot, autoReview, grants, onClose, onSave, onSaveHeartbeat, onDelete, onAutoReview, onRevokeGrant }) {
      const [value, setValue] = React.useState({ name: bot.name, label: bot.label, description: bot.description, workspace: bot.workspace ?? '', emoji: bot.emoji, color: bot.color ?? '#0071e3' });
      const [confirm, setConfirm] = React.useState(false);
      const sourceHb = bot.heartbeat ?? {};
      const sourceInterval = Number(sourceHb.intervalSec);
      const [hb, setHb] = React.useState({
        enabled: sourceHb.enabled !== false,
        intervalSec: Number.isFinite(sourceInterval) && sourceInterval > 0 ? Math.round(sourceInterval) : 300,
        quietHours: {
          enabled: sourceHb.quietHours?.enabled === true,
          start: sourceHb.quietHours?.start ?? '22:00',
          end: sourceHb.quietHours?.end ?? '08:00',
        },
        maxPulsesPerDay: clampCount(sourceHb.maxPulsesPerDay ?? 48, 1, 288),
        maxResumesPerDay: clampCount(sourceHb.maxResumesPerDay ?? 8, 0, 48),
      });
      const patchHeartbeat = (patch) => setHb((current) => ({ ...current, ...patch }));
      const submit = (event) => {
        event.preventDefault();
        if (value.name.trim().length === 0) return;
        void (async () => {
          await onSaveHeartbeat?.(bot.id, {
            enabled: hb.enabled === true,
            intervalSec: hb.intervalSec,
            quietHours: { enabled: hb.quietHours.enabled === true, start: hb.quietHours.start, end: hb.quietHours.end },
            maxPulsesPerDay: hb.maxPulsesPerDay,
            maxResumesPerDay: hb.maxResumesPerDay,
          });
          await onSave(bot.id, value);
        })();
      };
      return h(Sheet, {
        title: t('settings.title'),
        onClose,
        footer: h(React.Fragment, null,
          confirm
            ? h('button', { type: 'button', className: 'btn btn-plain', style: { color: 'var(--danger)' }, onClick: () => onDelete(bot.id) }, t('settings.deleteConfirm'))
            : h('button', { type: 'button', className: 'btn btn-plain', style: { color: 'var(--danger)' }, onClick: () => setConfirm(true) }, t('settings.delete')),
          h('span', { style: { flex: 1 } }),
          h('button', { type: 'button', className: 'btn btn-secondary btn-30', onClick: onClose }, t('modal.cancel')),
          h('button', { type: 'submit', form: 'botSettingsForm', className: 'btn btn-primary btn-30' }, t('settings.save')),
        ),
      },
        h('form', { id: 'botSettingsForm', className: 'sheet-body', onSubmit: submit },
          h(BotFields, { value, onChange: setValue, t }),
          h('div', { className: 'field' },
            h('span', null, t('settings.autoReview')),
            h('select', {
              value: autoReview?.mode ?? 'ask-first',
              onChange: (event) => onAutoReview(event.target.value),
            },
              h('option', { value: 'ask-first' }, t('settings.askFirst')),
              h('option', { value: 'allow-all' }, t('settings.allowAll')),
            ),
          ),
          h('div', { className: 'field hb-block' },
            h('div', { className: 'hb-block-head' },
              h('div', { className: 'hb-label' },
                h('span', null, t('hb.settings')),
                h('span', { className: 'hb-sub' }, t('hb.hint')),
              ),
              h('button', {
                type: 'button',
                className: 'switch',
                role: 'switch',
                'aria-checked': hb.enabled,
                'aria-label': t('hb.enabled'),
                onClick: () => patchHeartbeat({ enabled: hb.enabled !== true }),
              }),
            ),
            h('div', { className: 'form-grid' },
              h('label', { className: 'field' },
                h('span', null, t('hb.interval')),
                h('select', {
                  value: hb.intervalSec,
                  onChange: (event) => patchHeartbeat({ intervalSec: Number(event.target.value) }),
                }, (HEARTBEAT_INTERVALS.includes(hb.intervalSec) ? HEARTBEAT_INTERVALS : [...HEARTBEAT_INTERVALS, hb.intervalSec].sort((a, b) => a - b)).map((sec) => h('option', { key: sec, value: sec }, t('hb.minutes').replace('{n}', String(Math.round(sec / 60)))))),
              ),
              h('label', { className: 'field' },
                h('span', null, t('hb.maxPulses')),
                h('input', {
                  type: 'number',
                  min: 1,
                  max: 288,
                  value: hb.maxPulsesPerDay,
                  onChange: (event) => patchHeartbeat({ maxPulsesPerDay: clampCount(event.target.value, 1, 288) }),
                }),
              ),
            ),
            h('div', { className: 'form-grid' },
              h('label', { className: 'field' },
                h('span', null, t('hb.maxResumes')),
                h('input', {
                  type: 'number',
                  min: 0,
                  max: 48,
                  value: hb.maxResumesPerDay,
                  onChange: (event) => patchHeartbeat({ maxResumesPerDay: clampCount(event.target.value, 0, 48) }),
                }),
              ),
              h('div', { className: 'field' },
                h('span', null, t('hb.quietHours')),
                h('div', { className: 'hb-quiet-row' },
                  h('button', {
                    type: 'button',
                    className: 'switch',
                    role: 'switch',
                    'aria-checked': hb.quietHours.enabled,
                    'aria-label': t('hb.quietHours'),
                    onClick: () => patchHeartbeat({ quietHours: { ...hb.quietHours, enabled: hb.quietHours.enabled !== true } }),
                  }),
                  h('span', { className: 'hb-sub' }, hb.quietHours.enabled ? `${hb.quietHours.start} – ${hb.quietHours.end}` : t('hb.off')),
                ),
              ),
            ),
            hb.quietHours.enabled
              ? h('div', { className: 'form-grid' },
                  h('label', { className: 'field' },
                    h('span', null, t('hb.quietStart')),
                    h('input', {
                      type: 'time',
                      value: hb.quietHours.start,
                      onChange: (event) => patchHeartbeat({ quietHours: { ...hb.quietHours, start: event.target.value || '22:00' } }),
                    }),
                  ),
                  h('label', { className: 'field' },
                    h('span', null, t('hb.quietEnd')),
                    h('input', {
                      type: 'time',
                      value: hb.quietHours.end,
                      onChange: (event) => patchHeartbeat({ quietHours: { ...hb.quietHours, end: event.target.value || '08:00' } }),
                    }),
                  ),
                )
              : null,
          ),
          h('div', { className: 'field' },
            h('span', null, t('settings.grants')),
            (grants ?? []).filter((grant) => grant.botId === bot.id).length === 0
              ? h('p', { className: 'page-sub' }, t('settings.noGrants'))
              : h('div', { className: 'ctx-group' }, (grants ?? []).filter((grant) => grant.botId === bot.id).map((grant) => h('div', { key: grant.id, className: 'mem-row', style: { display: 'flex', alignItems: 'center', gap: 8 } },
                  h('div', { style: { flex: 1 } },
                    h('div', { className: 'mem-key' }, grant.toolName),
                    h('div', { className: 'mem-val' }, actionName(grant.toolName, t)),
                  ),
                  h('button', { type: 'button', className: 'btn btn-plain btn-24', onClick: () => onRevokeGrant(bot.id, grant.toolName) }, t('settings.revoke')),
                ))),
          ),
        ),
      );
    }

    function TeachSheet({ t, state, initialBotId, onClose, onSave }) {
      const [botId, setBotId] = React.useState(initialBotId ?? state.bots[0]?.id ?? '');
      const [goal, setGoal] = React.useState('');
      const [steps, setSteps] = React.useState(['']);
      const [trigger, setTrigger] = React.useState('manual');
      const [scheduleKind, setScheduleKind] = React.useState('daily');
      const [minutes, setMinutes] = React.useState(60);
      const [time, setTime] = React.useState('09:00');
      const submit = (event) => {
        event.preventDefault();
        if (botId.length === 0 || goal.trim().length === 0) return;
        const schedule = trigger !== 'schedule' ? { kind: 'manual' } : scheduleKind === 'interval' ? { kind: 'interval', minutes: Math.max(1, Number(minutes) || 60) } : { kind: scheduleKind, time };
        void onSave({ botId, title: goal.trim(), steps: steps.map((step) => step.trim()).filter(Boolean), schedule, trigger });
      };
      return h(Sheet, {
        title: t('teach.title'),
        sub: t('teach.sub'),
        wide: true,
        onClose,
        footer: h(React.Fragment, null,
          h('span', { className: 'hint' }, t('teach.hint')),
          h('button', { type: 'button', className: 'btn btn-secondary btn-30', onClick: onClose }, t('modal.cancel')),
          h('button', { type: 'submit', form: 'teachForm', className: 'btn btn-primary btn-30' }, t('teach.save')),
        ),
      },
        h('form', { id: 'teachForm', className: 'sheet-body', onSubmit: submit },
          h('div', { className: 'field' },
            h('span', null, t('teach.chooseBot')),
            h('div', { className: 'bot-pick', role: 'group' }, state.bots.map((bot) => h('button', {
              key: bot.id,
              type: 'button',
              'aria-pressed': botId === bot.id,
              onClick: () => setBotId(bot.id),
            }, h(BotAvatar, { bot, style: { width: 22, height: 22, borderRadius: 6, fontSize: 12 } }), bot.name))),
          ),
          h(Field, { label: t('teach.goal') }, h('input', { value: goal, placeholder: t('teach.goalPlaceholder'), onChange: (event) => setGoal(event.target.value), required: true })),
          h('div', { className: 'field' },
            h('span', null, t('teach.steps')),
            h('div', { className: 'steps' }, steps.map((step, index) => h('div', { key: index, className: 'step-row' },
              h('span', { className: 'n' }, String(index + 1)),
              h('input', { value: step, placeholder: t('teach.stepPlaceholder'), onChange: (event) => setSteps(steps.map((item, i) => (i === index ? event.target.value : item))) }),
              h('button', { type: 'button', className: 'step-del', 'aria-label': t('skills.delete'), onClick: () => setSteps(steps.length <= 1 ? [''] : steps.filter((_, i) => i !== index)) }, h(Icon, { name: 'x', cls: 'ic-12' })),
            ))),
            h('button', { type: 'button', className: 'add-step', onClick: () => setSteps([...steps, '']) }, h(Icon, { name: 'plus', cls: 'ic-12' }), t('teach.addStep')),
          ),
          h('div', { className: 'field' },
            h('span', null, t('routine.when')),
            h('select', { value: trigger, onChange: (event) => setTrigger(event.target.value) },
              h('option', { value: 'manual' }, t('routine.manual')),
              h('option', { value: 'schedule' }, t('routine.schedule')),
              h('option', { value: 'on_task_done' }, t('routine.onTaskDone')),
            ),
          ),
          trigger === 'schedule' ? h('div', { className: 'form-grid' },
            h('div', { className: 'field' },
              h('span', null, t('routine.schedule')),
              h('select', { value: scheduleKind, onChange: (event) => setScheduleKind(event.target.value) },
                h('option', { value: 'interval' }, t('routine.interval')),
                h('option', { value: 'daily' }, t('routine.daily')),
                h('option', { value: 'weekdays' }, t('routine.weekdays')),
              ),
            ),
            scheduleKind === 'interval'
              ? h('div', { className: 'field' }, h('span', null, t('routine.minutes')), h('input', { type: 'number', min: 1, value: minutes, onChange: (event) => setMinutes(Number(event.target.value)) }))
              : h('div', { className: 'field' }, h('span', null, t('routine.time')), h('input', { type: 'time', value: time, onChange: (event) => setTime(event.target.value) })),
          ) : null,
        ),
      );
    }

    function SkillSheet({ t, onClose, onSave }) {
      const [title, setTitle] = React.useState('');
      const [when, setWhen] = React.useState('');
      const [steps, setSteps] = React.useState(['']);
      const submit = (event) => {
        event.preventDefault();
        if (title.trim().length === 0) return;
        void onSave({ title: title.trim(), when: when.trim(), steps: steps.map((step) => step.trim()).filter(Boolean) });
      };
      return h(Sheet, {
        title: t('skill.title'),
        sub: t('skill.sub'),
        onClose,
        footer: h(React.Fragment, null,
          h('span', { className: 'hint' }, ''),
          h('button', { type: 'button', className: 'btn btn-secondary btn-30', onClick: onClose }, t('modal.cancel')),
          h('button', { type: 'submit', form: 'skillForm', className: 'btn btn-primary btn-30' }, t('skill.save')),
        ),
      },
        h('form', { id: 'skillForm', className: 'sheet-body', onSubmit: submit },
          h(Field, { label: t('skill.name') }, h('input', { value: title, onChange: (event) => setTitle(event.target.value), required: true })),
          h(Field, { label: t('skill.when') }, h('input', { value: when, onChange: (event) => setWhen(event.target.value) })),
          h('div', { className: 'field' },
            h('span', null, t('skill.steps')),
            h('div', { className: 'steps' }, steps.map((step, index) => h('div', { key: index, className: 'step-row' },
              h('span', { className: 'n' }, String(index + 1)),
              h('input', { value: step, placeholder: t('skill.stepPlaceholder'), onChange: (event) => setSteps(steps.map((item, i) => (i === index ? event.target.value : item))) }),
              h('button', { type: 'button', className: 'step-del', onClick: () => setSteps(steps.length <= 1 ? [''] : steps.filter((_, i) => i !== index)) }, h(Icon, { name: 'x', cls: 'ic-12' })),
            ))),
            h('button', { type: 'button', className: 'add-step', onClick: () => setSteps([...steps, '']) }, h(Icon, { name: 'plus', cls: 'ic-12' }), t('teach.addStep')),
          ),
        ),
      );
    }

    function GroupSheet({ t, state, thread, onClose, onSave }) {
      const [title, setTitle] = React.useState(thread?.title ?? '');
      const [selected, setSelected] = React.useState(thread?.botIds ?? state.bots.slice(0, 2).map((bot) => bot.id));
      const toggle = (id) => setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : current.length >= 6 ? current : [...current, id]));
      const submit = (event) => {
        event.preventDefault();
        if (selected.length < 2) return;
        void onSave({ title: title.trim(), botIds: selected });
      };
      return h(Sheet, {
        title: thread ? t('group.editTitle') : t('group.title'),
        onClose,
        footer: h(React.Fragment, null,
          h('span', { className: 'hint' }, selected.length < 2 ? t('group.min') : ''),
          h('button', { type: 'button', className: 'btn btn-secondary btn-30', onClick: onClose }, t('modal.cancel')),
          h('button', { type: 'submit', form: 'groupForm', className: 'btn btn-primary btn-30', disabled: selected.length < 2 }, thread ? t('group.save') : t('group.create')),
        ),
      },
        h('form', { id: 'groupForm', className: 'sheet-body', onSubmit: submit },
          h(Field, { label: t('group.name') }, h('input', { value: title, placeholder: t('group.namePlaceholder'), onChange: (event) => setTitle(event.target.value) })),
          h('div', { className: 'field' },
            h('span', null, t('group.members')),
            h('div', { className: 'group-member-pick' }, state.bots.map((bot) => h('label', { key: bot.id },
              h('input', { type: 'checkbox', checked: selected.includes(bot.id), onChange: () => toggle(bot.id) }),
              h(BotAvatar, { bot, style: { width: 24, height: 24, borderRadius: 6, fontSize: 12 } }),
              h('span', null, bot.name),
            ))),
          ),
        ),
      );
    }

    function FileSheet({ t, path, actions, onClose }) {
      const [content, setContent] = React.useState(null);
      const [error, setError] = React.useState(null);
      React.useEffect(() => {
        let live = true;
        actions.readFile(path).then((result) => {
          if (live) setContent(result?.content ?? '');
        }).catch((reason) => {
          if (live) setError(reason instanceof Error ? reason.message : String(reason));
        });
        return () => { live = false; };
      }, [path]);
      return h(Sheet, {
        title: t('file.title'),
        sub: path,
        wide: true,
        onClose,
        footer: h('button', { type: 'button', className: 'btn btn-secondary btn-30', onClick: onClose }, t('modal.close')),
      },
        h('div', { className: 'sheet-body' },
          error !== null
            ? h('p', { className: 'page-sub' }, `${t('file.error')} ${error}`)
            : content === null
              ? h('p', { className: 'page-sub' }, t('file.loading'))
              : h('pre', { className: 'preview-text' }, content.slice(0, 20000)),
        ),
      );
    }

    function ReviseSheet({ t, task, onClose, onSubmit }) {
      const [text, setText] = React.useState('');
      const submit = (event) => {
        event.preventDefault();
        if (text.trim().length === 0) return;
        void onSubmit(task.id, text.trim());
      };
      return h(Sheet, {
        title: t('revise.title'),
        sub: task.title,
        onClose,
        footer: h(React.Fragment, null,
          h('span', { className: 'hint' }, ''),
          h('button', { type: 'button', className: 'btn btn-secondary btn-30', onClick: onClose }, t('modal.cancel')),
          h('button', { type: 'submit', form: 'reviseForm', className: 'btn btn-primary btn-30', disabled: text.trim().length === 0 }, t('revise.submit')),
        ),
      },
        h('form', { id: 'reviseForm', className: 'sheet-body', onSubmit: submit },
          h('div', { className: 'field' }, h('span', null, t('ap.revise')), h('textarea', { value: text, placeholder: t('ap.placeholder'), onChange: (event) => setText(event.target.value), style: { minHeight: 90 } })),
        ),
      );
    }

    /* ------------------------------------------------------------------ */
    /* Search popover                                                     */
    /* ------------------------------------------------------------------ */

    function SearchPopover({ t, state, bots, threadsById, query, setQuery, onSelectThread, onOpenTasks, onOpenSkills, onClose }) {
      const q = query.trim().toLowerCase();
      const matchBots = bots.filter((bot) => q.length === 0 || `${bot.name} ${bot.label} ${bot.description}`.toLowerCase().includes(q)).slice(0, 5);
      const matchTasks = state.tasks.filter((task) => q.length === 0 || `${task.title}`.toLowerCase().includes(q)).slice(0, 5);
      const matchSkills = state.skills.filter((skill) => q.length === 0 || `${skill.title} ${skill.when}`.toLowerCase().includes(q)).slice(0, 5);
      const empty = matchBots.length + matchTasks.length + matchSkills.length === 0;
      return h('div', { className: 'popover', role: 'dialog', 'aria-label': t('app.search') },
        h('div', { className: 'pop-search' },
          h(Icon, { name: 'search' }),
          h('input', { type: 'search', value: query, placeholder: t('search.placeholder'), onChange: (event) => setQuery(event.target.value), autoComplete: 'off' }),
          h('span', { className: 'kbd' }, 'esc'),
        ),
        h('div', { className: 'pop-body' },
          empty ? h('div', { className: 'pop-empty' }, t('search.empty')) : null,
          matchBots.length > 0 ? h('div', { className: 'pop-group' }, t('search.bots')) : null,
          matchBots.map((bot) => h('button', { key: bot.id, type: 'button', className: 'pop-row', onClick: () => { onSelectThread(bot.threadId); onClose(); } },
            h(BotAvatar, { bot, style: { width: 24, height: 24, borderRadius: 6, fontSize: 12 } }),
            h('span', null, h('div', { className: 'pop-name' }, bot.name), h('div', { className: 'pop-sub' }, bot.label || t('thread.idle'))),
            h('span', { className: 'kbd' }, '↵'),
          )),
          matchTasks.length > 0 ? h('div', { className: 'pop-group' }, t('search.tasks')) : null,
          matchTasks.map((task) => h('button', { key: task.id, type: 'button', className: 'pop-row', onClick: () => { onOpenTasks(task); onClose(); } },
            h('span', { className: 'pop-icon' }, h(Icon, { name: 'checklist', cls: 'ic-12' })),
            h('span', null, h('div', { className: 'pop-name' }, task.title), h('div', { className: 'pop-sub' }, threadsById.get(task.threadId)?.title ?? '')),
          )),
          matchSkills.length > 0 ? h('div', { className: 'pop-group' }, t('search.skills')) : null,
          matchSkills.map((skill) => h('button', { key: skill.id, type: 'button', className: 'pop-row', onClick: () => { onOpenSkills(); onClose(); } },
            h('span', { className: 'pop-icon' }, h(Icon, { name: 'layers', cls: 'ic-12' })),
            h('span', null, h('div', { className: 'pop-name' }, skill.title), h('div', { className: 'pop-sub' }, skill.when || '')),
          )),
        ),
        h('div', { className: 'pop-foot' }, h('span', null, t('search.hint')), h('span', { className: 'kbd', style: { marginLeft: 'auto' } }, '↵')),
      );
    }

    /* ------------------------------------------------------------------ */
    /* Panel                                                              */
    /* ------------------------------------------------------------------ */

    function Panel(props) {
      const { team, t } = props;
      activeT = t;
      const theme = useHostTheme();
      const state = React.useSyncExternalStore(team.subscribe, team.getSnapshot, team.getSnapshot);
      const [view, setView] = React.useState('chat');
      const [selectedId, setSelectedId] = React.useState(() => {
        try {
          return window.localStorage.getItem('deepseek-bot-army.thread');
        } catch {
          return null;
        }
      });
      const [draft, setDraft] = React.useState('');
      const [contextTab, setContextTab] = React.useState('tasks');
      const [taskFilter, setTaskFilter] = React.useState('all');
      const [marketQuery, setMarketQuery] = React.useState('');
      const [marketCategory, setMarketCategory] = React.useState('all');
      const [skillQuery, setSkillQuery] = React.useState('');
      const [modal, setModal] = React.useState(null);
      const [toast, setToast] = React.useState(null);
      const [sidebarOpen, setSidebarOpen] = React.useState(false);
      const [contextOpen, setContextOpen] = React.useState(false);
      const [searchOpen, setSearchOpen] = React.useState(false);
      const [searchQuery, setSearchQuery] = React.useState('');
      const toastTimer = React.useRef(null);
      const readRef = React.useRef({ id: null });

      React.useEffect(() => {
        team.start();
        return () => team.stop();
      }, [team]);

      React.useEffect(() => {
        const onKey = (event) => {
          if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
            event.preventDefault();
            setSearchOpen((open) => !open);
          }
          if (event.key === 'Escape') setSearchOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
      }, []);

      const pushToast = (text) => {
        setToast(text);
        if (toastTimer.current !== null) clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(null), 3200);
      };

      const data = state.state;
      const bots = data?.bots ?? [];
      const threads = data?.threads ?? [];
      const botsById = React.useMemo(() => new Map(bots.map((bot) => [bot.id, bot])), [data?.version]);
      const threadsById = React.useMemo(() => new Map(threads.map((thread) => [thread.id, thread])), [data?.version]);
      const tasksById = React.useMemo(() => new Map((data?.tasks ?? []).map((task) => [task.id, task])), [data?.version]);
      const botsWithThreads = React.useMemo(() => bots.map((bot) => {
        const thread = threads.find((item) => item.kind === 'direct' && item.botIds[0] === bot.id);
        return { ...bot, threadId: thread?.id };
      }), [data?.version]);

      let thread = threadsById.get(selectedId) ?? null;
      if (thread === null && threads.length > 0) thread = threads.find((item) => item.kind === 'direct') ?? threads[0];

      React.useEffect(() => {
        if (thread === null) return;
        try {
          window.localStorage.setItem('deepseek-bot-army.thread', thread.id);
        } catch {
          // optional
        }
        if (selectedId !== thread.id) setSelectedId(thread.id);
      }, [thread?.id, selectedId]);

      React.useEffect(() => {
        setDraft('');
        setContextTab('tasks');
      }, [thread?.id]);

      React.useEffect(() => {
        if (thread === null || data === null) return;
        const key = `${thread.id}:${thread.unread}`;
        if (thread.unread > 0 && readRef.current.id !== key) {
          readRef.current.id = key;
          const timer = setTimeout(() => { void team.act('mark_read', { threadId: thread.id }).catch(() => {}); }, 500);
          return () => clearTimeout(timer);
        }
      }, [thread?.id, thread?.unread, data?.version, team]);

      const actions = {
        copy: async (value) => {
          if (!value) return;
          try {
            await navigator.clipboard.writeText(value);
            pushToast(t('toast.copied'));
          } catch {
            pushToast(t('toast.error'));
          }
        },
        send: async (threadId, text, mention = {}) => {
          try {
            const mentions = Array.isArray(mention.mentions) ? mention.mentions : [];
            const body = { threadId, text };
            if (mentions.length > 0) body.mentions = mentions;
            if (mention.mentionEveryone === true) body.mentionEveryone = true;
            await team.act('send_message', body);
          } catch (error) {
            pushToast(error.message);
          }
        },
        approve: async (taskId) => {
          try {
            await team.act('approve_task', { taskId });
            pushToast(t('toast.approved'));
          } catch (error) {
            pushToast(error.message);
          }
        },
        dismiss: async (taskId) => {
          try {
            await team.act('dismiss_task', { taskId });
            pushToast(t('toast.ignored'));
          } catch (error) {
            pushToast(error.message);
          }
        },
        requestChanges: async (taskId, text) => {
          try {
            await team.act('request_changes', { taskId, text });
          } catch (error) {
            pushToast(error.message);
          }
        },
        stop: async (botId) => {
          try {
            await team.act('stop_bot', { botId });
          } catch (error) {
            pushToast(error.message);
          }
        },
        addMemory: async (botId, text) => {
          try {
            await team.act('add_memory', { botId, text });
          } catch (error) {
            pushToast(error.message);
          }
        },
        addTeamMemory: async (text) => {
          try {
            await team.act('add_team_memory', { text });
          } catch (error) {
            pushToast(error.message);
          }
        },
        deleteTeamMemory: async (memoryId) => {
          try {
            await team.act('delete_team_memory', { memoryId });
          } catch (error) {
            pushToast(error.message);
          }
        },
        deleteMemory: async (botId, memoryId) => {
          try {
            await team.act('delete_memory', { botId, memoryId });
          } catch (error) {
            pushToast(error.message);
          }
        },
        runRoutine: async (botId, routineId) => {
          try {
            const result = await team.act('run_routine', { botId, routineId });
            if (result?.threadId) {
              setSelectedId(result.threadId);
              setView('chat');
            }
          } catch (error) {
            pushToast(error.message);
          }
        },
        toggleRoutine: async (botId, routineId, enabled) => {
          try {
            await team.act('toggle_routine', { botId, routineId, enabled });
          } catch (error) {
            pushToast(error.message);
          }
        },
        deleteRoutine: async (botId, routineId) => {
          try {
            await team.act('delete_routine', { botId, routineId });
          } catch (error) {
            pushToast(error.message);
          }
        },
        addSkill: async (value) => {
          try {
            await team.act('add_skill', value);
            setModal(null);
            pushToast(t('skill.saved'));
          } catch (error) {
            pushToast(error.message);
          }
        },
        deleteSkill: async (skillId) => {
          try {
            await team.act('delete_skill', { skillId });
          } catch (error) {
            pushToast(error.message);
          }
        },
        readFile: (path) => team.act('read_file', { path }),
        confirmIntent: async (pendingId, intent) => {
          try {
            await team.act('confirm_intent', { pendingId, intent });
          } catch (error) {
            pushToast(error.message);
          }
        },
        cancelIntent: async (pendingId) => {
          try {
            await team.act('cancel_intent', { pendingId });
          } catch (error) {
            pushToast(error.message);
          }
        },
        decideApproval: async (approvalId, decision) => {
          try {
            await team.act('decide_approval', { approvalId, decision });
          } catch (error) {
            pushToast(error.message);
          }
        },
        acceptSuggestion: async (suggestionId, kind) => {
          try {
            await team.act('accept_suggestion', { suggestionId, kind });
          } catch (error) {
            pushToast(error.message);
          }
        },
        dismissSuggestion: async (suggestionId) => {
          try {
            await team.act('dismiss_suggestion', { suggestionId });
          } catch (error) {
            pushToast(error.message);
          }
        },
        setAutoReview: async (mode) => {
          try {
            await team.act('set_auto_review', { mode });
          } catch (error) {
            pushToast(error.message);
          }
        },
        revokeGrant: async (botId, toolName) => {
          try {
            await team.act('revoke_grant', { botId, toolName });
          } catch (error) {
            pushToast(error.message);
          }
        },
        setHeartbeat: async (botId, patch) => {
          try {
            await team.act('set_heartbeat', { botId, patch });
          } catch (error) {
            pushToast(error.message);
          }
        },
        heartbeatNow: async (botId) => {
          try {
            const result = await team.act('heartbeat_now', { botId });
            if (result?.ran === false) pushToast(t('hb.toastSkipped'));
            else pushToast(t('hb.toastNow').replace('{verdict}', verdictLabel(result?.verdict, t)));
          } catch (error) {
            pushToast(error.message);
          }
        },
        setHeartbeatSettings: async (patch) => {
          try {
            await team.act('set_heartbeat_settings', { patch });
          } catch (error) {
            pushToast(error.message);
          }
        },
        resolveCheckin: async (checkinId) => {
          try {
            await team.act('resolve_checkin', { checkinId });
            pushToast(t('hb.checkinResolved'));
            await team.refresh(true);
          } catch (error) {
            pushToast(error.message);
          }
        },
      };

      const openThread = (threadId) => {
        if (threadId === null) {
          setView('tasks');
          return;
        }
        setSelectedId(threadId);
        setView('chat');
        setSidebarOpen(false);
      };

      const openTeach = (botId) => setModal({ kind: 'teach', botId });
      const openSettings = (threadValue) => {
        if (threadValue?.kind === 'group') setModal({ kind: 'group', threadId: threadValue.id });
        else {
          const primaryId = threadValue?.botIds?.[0] ?? thread?.botIds?.[0];
          if (primaryId) setModal({ kind: 'settings', botId: primaryId });
        }
      };

      const createBot = async (value) => {
        try {
          const result = await team.act('create_bot', {
            name: value.name.trim(),
            label: value.label.trim(),
            description: value.description.trim(),
            workspace: value.workspace.trim() || null,
            emoji: value.emoji,
            color: value.color,
          });
          setModal(null);
          if (result?.threadId) openThread(result.threadId);
        } catch (error) {
          pushToast(error.message);
        }
      };

      const saveBot = async (botId, value) => {
        try {
          await team.act('update_bot', {
            botId,
            patch: {
              name: value.name.trim(),
              label: value.label.trim(),
              description: value.description.trim(),
              workspace: value.workspace.trim() || null,
              emoji: value.emoji,
              color: value.color,
            },
          });
          pushToast(t('settings.saved'));
          setModal(null);
        } catch (error) {
          pushToast(error.message);
        }
      };

      const deleteBot = async (botId) => {
        try {
          await team.act('delete_bot', { botId });
          pushToast(t('settings.deleted'));
          setModal(null);
        } catch (error) {
          pushToast(error.message);
        }
      };

      const addTemplate = async (template) => {
        try {
          const result = await team.act('create_bot', { templateId: template.id });
          pushToast(t('toast.market'));
          if (result?.threadId) openThread(result.threadId);
        } catch (error) {
          pushToast(error.message);
        }
      };

      if (state.loading && data === null) {
        return h('div', { className: 'gpb-root', 'data-theme': theme }, h(StyleTag), h(Sprite), h('div', { className: 'gpb-loading' }, t('loading')));
      }
      if (data === null) {
        return h('div', { className: 'gpb-root', 'data-theme': theme },
          h(StyleTag), h(Sprite),
          h('div', { className: 'gpb-error' },
            h('div', null, t('error.load')),
            h('button', { type: 'button', className: 'btn btn-secondary btn-30', onClick: () => team.refresh(true) }, t('error.retry')),
          ),
        );
      }

      const rooms = threads.filter((threadValue) => threadValue.kind === 'group');
      const reviewCount = data.tasks.filter((task) => task.status === 'review').length;
      const primaryBot = thread?.kind === 'direct' ? botsById.get(thread.botIds[0]) : undefined;

      let content = null;
      if (view === 'chat' && thread !== null) {
        content = h('section', { className: 'workbench', role: 'tabpanel' },
          h(ThreadView, {
            t,
            thread,
            botsById,
            tasksById,
            draft,
            setDraft,
            onSend: (text, mention) => actions.send(thread.id, text, mention),
            actions,
            pendingIntents: data.pendingIntents ?? [],
            approvals: data.approvals ?? [],
            suggestions: data.suggestions ?? [],
            checkins: data.checkins ?? [],
            onOpenSettings: openSettings,
            onResolveCheckin: actions.resolveCheckin,
            onOpenTeach: openTeach,
            onConfirmIntent: actions.confirmIntent,
            onCancelIntent: actions.cancelIntent,
            onDecideApproval: actions.decideApproval,
            onAcceptSuggestion: actions.acceptSuggestion,
            onDismissSuggestion: actions.dismissSuggestion,
            onContextTab: setContextTab,
            contextOpen,
            onToggleContext: () => setContextOpen((open) => !open),
          }),
          h(ContextPanel, {
            t,
            thread,
            botsById,
            tasksById,
            state: data,
            tab: contextTab,
            setTab: setContextTab,
            actions,
            onOpenTeach: openTeach,
            onViewTasks: () => setView('tasks'),
            onOpenFile: (path) => setModal({ kind: 'file', path }),
            onSelectThread: openThread,
            open: contextOpen,
            onClose: () => setContextOpen(false),
          }),
        );
      } else if (view === 'tasks') {
        content = h(TasksPage, {
          t,
          state: data,
          botsById,
          threadsById,
          filter: taskFilter,
          setFilter: setTaskFilter,
          actions,
          onOpenThread: openThread,
          onReview: (task) => openThread(task.threadId),
          onTeach: () => openTeach(thread?.botIds?.[0] ?? data.bots[0]?.id),
        });
      } else if (view === 'market') {
        content = h(MarketPage, {
          t,
          state: data,
          bots,
          query: marketQuery,
          setQuery: setMarketQuery,
          category: marketCategory,
          setCategory: setMarketCategory,
          onAdd: addTemplate,
        });
      } else if (view === 'skills') {
        content = h(SkillsPage, {
          t,
          state: data,
          query: skillQuery,
          setQuery: setSkillQuery,
          onNew: () => setModal({ kind: 'skill' }),
          actions,
        });
      }

      return h('div', { className: 'gpb-root', 'data-theme': theme },
        h(StyleTag),
        h(Sprite),
        h('div', { className: 'desktop' },
          h('div', { className: 'window' },
            h(Toolbar, {
              t,
              view,
              onView: setView,
              onSearch: () => setSearchOpen((open) => !open),
              onNewBot: () => setModal({ kind: 'newbot' }),
              onMenu: () => setSidebarOpen((open) => !open),
            }),
            h('div', { className: 'app-body' },
              h(Sidebar, {
                t,
                bots: botsWithThreads,
                rooms,
                activeThreadId: thread?.id,
                onSelect: openThread,
                view,
                onView: setView,
                reviewCount,
                templateCount: data.templates.length,
                skillCount: data.skills.length,
                onNewBot: () => setModal({ kind: 'newbot' }),
                onNewRoom: () => setModal({ kind: 'group' }),
                open: sidebarOpen,
                onClose: () => setSidebarOpen(false),
              }),
              h('main', { className: 'workspace' }, content),
            ),
            h('nav', { className: 'mobile-tabs', 'aria-label': 'Views' },
              [['chat', t('app.chat'), 'bubble'], ['tasks', t('app.tasks'), 'checklist'], ['market', t('app.market'), 'grid'], ['skills', t('side.skills'), 'layers']].map(([id, label, icon]) => h('button', {
                key: id,
                type: 'button',
                'aria-selected': view === id,
                onClick: () => setView(id),
              }, h(Icon, { name: icon }), h('span', null, label))),
            ),
          ),
        ),
        searchOpen ? h(SearchPopover, {
          t,
          state: data,
          bots: botsWithThreads,
          threadsById,
          query: searchQuery,
          setQuery: setSearchQuery,
          onSelectThread: openThread,
          onOpenTasks: (task) => openThread(task.threadId),
          onOpenSkills: () => setView('skills'),
          onClose: () => setSearchOpen(false),
        }) : null,
        modal?.kind === 'newbot' ? h(NewBotSheet, { t, onClose: () => setModal(null), onCreate: createBot }) : null,
        modal?.kind === 'settings' && botsById.get(modal.botId) !== undefined
          ? h(SettingsSheet, {
              t,
              bot: botsById.get(modal.botId),
              autoReview: data.autoReview ?? { mode: 'ask-first' },
              grants: data.grants ?? [],
              onClose: () => setModal(null),
              onSave: saveBot,
              onSaveHeartbeat: actions.setHeartbeat,
              onDelete: deleteBot,
              onAutoReview: actions.setAutoReview,
              onRevokeGrant: actions.revokeGrant,
            })
          : null,
        modal?.kind === 'teach'
          ? h(TeachSheet, {
              t,
              state: data,
              initialBotId: modal.botId,
              onClose: () => setModal(null),
              onSave: async (value) => {
                try {
                  await team.act('add_routine', { botId: value.botId, title: value.title, steps: value.steps, schedule: value.schedule, trigger: value.trigger });
                  pushToast(t('teach.saved'));
                  setModal(null);
                } catch (error) {
                  pushToast(error.message);
                }
              },
            })
          : null,
        modal?.kind === 'skill' ? h(SkillSheet, { t, onClose: () => setModal(null), onSave: actions.addSkill }) : null,
        modal?.kind === 'group'
          ? h(GroupSheet, {
              t,
              state: data,
              thread: modal.threadId ? threadsById.get(modal.threadId) : undefined,
              onClose: () => setModal(null),
              onSave: async (value) => {
                try {
                  if (modal.threadId) await team.act('update_group', { threadId: modal.threadId, patch: value });
                  else {
                    const result = await team.act('create_group', value);
                    if (result?.threadId) openThread(result.threadId);
                  }
                  pushToast(t('group.created'));
                  setModal(null);
                } catch (error) {
                  pushToast(error.message);
                }
              },
            })
          : null,
        modal?.kind === 'file' ? h(FileSheet, { t, path: modal.path, actions, onClose: () => setModal(null) }) : null,
        modal?.kind === 'revise'
          ? h(ReviseSheet, {
              t,
              task: modal.task,
              onClose: () => setModal(null),
              onSubmit: async (taskId, text) => {
                await actions.requestChanges(taskId, text);
                setModal(null);
              },
            })
          : null,
        h(Toast, { text: toast }),
      );
    }

    /* ------------------------------------------------------------------ */
    /* Plugin entry                                                       */
    /* ------------------------------------------------------------------ */

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, DICT), 'deepseek-bot-army: dictionaries');
        const t = ctx.locale.bind(NS);
        activeT = t;
        const team = new TeamClient();

        ctx.slots.inject('main', () => ctx.slots.register({
          name: 'main',
          key: PANEL_ID,
          locale: NS,
          inject: () => ({ team }),
        }, Panel));

        ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
          name: 'sidebar.panellist',
          id: PANEL_ID,
          order: 10,
          locale: NS,
          label: () => t('app.title'),
        }, function BotsIcon({ size }) {
          return h('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', 'aria-hidden': true },
            h('rect', { x: 3, y: 4, width: 18, height: 14, rx: 4 }),
            h('circle', { cx: 9, cy: 10.5, r: 1.2, fill: 'currentColor', stroke: 'none' }),
            h('circle', { cx: 15, cy: 10.5, r: 1.2, fill: 'currentColor', stroke: 'none' }),
            h('path', { d: 'M9 14.5c1 1 1.9 1.4 3 1.4s2-.4 3-1.4' }),
            h('path', { d: 'M12 4V2.5M8 18v2M16 18v2' }),
          );
        }));

        ctx.effect(() => () => team.stop(), 'deepseek-bot-army: polling');
      },
    };
  },
});
