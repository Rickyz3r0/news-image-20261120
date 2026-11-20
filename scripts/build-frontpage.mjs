import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT_PNG = join(ROOT_DIR, 'entry.png');
const TEMP_HTML = join(ROOT_DIR, '.tmp-frontpage.html');

const CHROME_CANDIDATES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];

function findBrowser() {
  for (const candidate of CHROME_CANDIDATES) {
    if (existsSync(candidate)) return candidate;
  }
  throw new Error('No headless Chromium/Chrome/Edge browser found for rendering');
}

function buildGlobeSvg() {
  return `
  <svg viewBox="0 0 112 112" width="96" height="96" aria-hidden="true">
    <defs>
      <radialGradient id="globeGrad" cx="38%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#274060"/>
        <stop offset="100%" stop-color="#0F172A"/>
      </radialGradient>
    </defs>
    <circle cx="56" cy="56" r="46" fill="url(#globeGrad)" stroke="#C89B3C" stroke-width="2.2"/>
    <ellipse cx="56" cy="56" rx="22" ry="46" fill="none" stroke="#475569" stroke-width="1.1"/>
    <ellipse cx="56" cy="56" rx="38" ry="46" fill="none" stroke="#334155" stroke-width="1"/>
    <line x1="10" y1="56" x2="102" y2="56" stroke="#475569" stroke-width="1.1"/>
    <path d="M16 35 Q56 44 96 35" fill="none" stroke="#334155" stroke-width="1"/>
    <path d="M16 77 Q56 68 96 77" fill="none" stroke="#334155" stroke-width="1"/>
    <path d="M26 42 Q35 30 48 34 Q55 37 52 46 Q45 52 38 49 Z" fill="#3B5B7E" opacity="0.85"/>
    <path d="M55 34 Q72 28 84 40 Q88 53 77 62 Q66 64 59 54 Z" fill="#3B5B7E" opacity="0.85"/>
    <path d="M31 58 Q40 57 44 68 Q41 81 33 78 Q28 70 31 58 Z" fill="#3B5B7E" opacity="0.85"/>
    <circle cx="58" cy="39" r="4.2" fill="#EF4444" stroke="#FFF" stroke-width="1.2"/>
    <circle cx="74" cy="56" r="4.2" fill="#22D3EE" stroke="#FFF" stroke-width="1.2"/>
    <circle cx="84" cy="46" r="4.2" fill="#F59E0B" stroke="#FFF" stroke-width="1.2"/>
    <circle cx="62" cy="48" r="4.2" fill="#22C55E" stroke="#FFF" stroke-width="1.2"/>
    <circle cx="33" cy="45" r="4.2" fill="#60A5FA" stroke="#FFF" stroke-width="1.2"/>
    <circle cx="79" cy="64" r="3.6" fill="#A78BFA" stroke="#FFF" stroke-width="1.2"/>
  </svg>`;
}

function buildKyivSvg() {
  return `
  <svg viewBox="0 0 444 156" width="100%" height="156" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="kyivSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#141B2D"/>
        <stop offset="62%" stop-color="#3B2335"/>
        <stop offset="100%" stop-color="#7C2D12"/>
      </linearGradient>
      <radialGradient id="blastGlow" cx="68%" cy="62%" r="34%">
        <stop offset="0%" stop-color="#FDE047" stop-opacity="0.95"/>
        <stop offset="40%" stop-color="#F97316" stop-opacity="0.72"/>
        <stop offset="100%" stop-color="#DC2626" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="444" height="156" fill="url(#kyivSky)"/>
    <circle cx="305" cy="94" r="64" fill="url(#blastGlow)"/>
    <circle cx="148" cy="112" r="56" fill="none" stroke="#94A3B8" stroke-width="0.9" stroke-dasharray="4 4" opacity="0.4"/>
    <circle cx="148" cy="112" r="92" fill="none" stroke="#94A3B8" stroke-width="0.8" stroke-dasharray="4 5" opacity="0.28"/>
    <path d="M22 14 Q164 42 298 92" fill="none" stroke="#FCA5A5" stroke-width="2.6" stroke-dasharray="7 4"/>
    <path d="M74 6 Q196 36 312 88" fill="none" stroke="#FDE68A" stroke-width="2"/>
    <path d="M126 126 Q188 74 244 50" fill="none" stroke="#38BDF8" stroke-width="2.4" stroke-dasharray="5 3"/>
    <circle cx="244" cy="50" r="6" fill="#E0F2FE"/>
    <circle cx="244" cy="50" r="12" fill="#38BDF8" opacity="0.35"/>
    <g fill="#475569" opacity="0.58">
      <circle cx="292" cy="84" r="18"/>
      <circle cx="312" cy="74" r="22"/>
      <circle cx="332" cy="82" r="16"/>
      <circle cx="272" cy="96" r="14"/>
    </g>
    <g fill="#0F172A">
      <rect x="0" y="126" width="444" height="30"/>
      <rect x="18" y="96" width="26" height="32"/>
      <rect x="48" y="82" width="22" height="46"/>
      <rect x="74" y="102" width="32" height="26"/>
      <path d="M114 128 L114 96 L124 84 L134 96 L134 128 Z"/>
      <path d="M120 84 Q124 72 128 84 Z"/>
      <rect x="142" y="88" width="28" height="40"/>
      <rect x="176" y="74" width="24" height="54"/>
      <rect x="206" y="94" width="36" height="34"/>
      <rect x="252" y="86" width="30" height="42"/>
      <rect x="292" y="100" width="38" height="28"/>
      <rect x="342" y="84" width="26" height="44"/>
      <rect x="374" y="96" width="32" height="32"/>
      <rect x="412" y="104" width="24" height="24"/>
    </g>
    <rect x="0" y="138" width="444" height="18" fill="#1E293B"/>
    <line x1="20" y1="146" x2="120" y2="146" stroke="#F97316" stroke-width="1.5" opacity="0.45"/>
    <line x1="255" y1="145" x2="365" y2="145" stroke="#FBBF24" stroke-width="2" opacity="0.65"/>
    <g transform="translate(14,14)">
      <rect width="152" height="24" rx="4" fill="#991B1B" opacity="0.95"/>
      <text x="10" y="16" fill="#FFFFFF" font-family="Segoe UI, Arial, sans-serif" font-size="11" font-weight="800" letter-spacing="0.7">KYIV · DAWN ALERT</text>
    </g>
  </svg>`;
}

function buildCycloneSvg() {
  return `
  <svg viewBox="0 0 444 156" width="100%" height="156" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="baySea" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#083344"/>
        <stop offset="100%" stop-color="#0E7490"/>
      </linearGradient>
      <radialGradient id="stormEye" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#083344"/>
        <stop offset="22%" stop-color="#E0F2FE"/>
        <stop offset="60%" stop-color="#38BDF8" stop-opacity="0.72"/>
        <stop offset="100%" stop-color="#0E7490" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="444" height="156" fill="url(#baySea)"/>
    <path d="M0 0 L195 0 L178 36 L146 66 L122 104 L106 156 L0 156 Z" fill="#D6C7A9" stroke="#78716C" stroke-width="2"/>
    <path d="M178 36 L146 66 L122 104" fill="none" stroke="#DC2626" stroke-width="4.5" stroke-linecap="round"/>
    <text x="20" y="54" fill="#334155" font-family="Segoe UI, Arial, sans-serif" font-size="12" font-weight="800" letter-spacing="0.8">ODISHA</text>
    <text x="18" y="108" fill="#334155" font-family="Segoe UI, Arial, sans-serif" font-size="12" font-weight="800" letter-spacing="0.8">ANDHRA</text>
    <text x="18" y="123" fill="#334155" font-family="Segoe UI, Arial, sans-serif" font-size="12" font-weight="800" letter-spacing="0.8">PRADESH</text>
    <g transform="translate(268,78)">
      <circle r="72" fill="url(#stormEye)"/>
      <path d="M-56 -16 C-36 -60, 32 -66, 56 -22" fill="none" stroke="#E0F2FE" stroke-width="5.5" stroke-linecap="round" opacity="0.88"/>
      <path d="M56 16 C36 60, -32 66, -56 22" fill="none" stroke="#E0F2FE" stroke-width="5.5" stroke-linecap="round" opacity="0.88"/>
      <path d="M-36 -8 C-24 -38, 22 -42, 38 -12" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
      <path d="M36 8 C24 38, -22 42, -38 12" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
      <circle r="11" fill="#083344" stroke="#F8FAFC" stroke-width="3"/>
    </g>
    <path d="M250 78 L164 68" fill="none" stroke="#FDE047" stroke-width="3" stroke-dasharray="6 4"/>
    <polygon points="154,67 169,60 167,75" fill="#FDE047"/>
    <g transform="translate(268,14)">
      <rect width="162" height="24" rx="4" fill="#B91C1C"/>
      <text x="10" y="16" fill="#FFFFFF" font-family="Segoe UI, Arial, sans-serif" font-size="11" font-weight="800" letter-spacing="0.6">RED ALERT · LANDFALL</text>
    </g>
    <text x="314" y="142" fill="#BAE6FD" font-family="Segoe UI, Arial, sans-serif" font-size="11" font-weight="700" letter-spacing="1.2">BAY OF BENGAL</text>
  </svg>`;
}

function buildMarketsSvg() {
  return `
  <svg viewBox="0 0 444 106" width="100%" height="106">
    <rect width="444" height="106" rx="6" fill="#18181B"/>
    <g stroke="#27272A" stroke-width="1">
      <line x1="16" y1="26" x2="428" y2="26"/>
      <line x1="16" y1="53" x2="428" y2="53"/>
      <line x1="16" y1="80" x2="428" y2="80"/>
    </g>
    <defs>
      <linearGradient id="dropFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#EF4444" stop-opacity="0.45"/>
        <stop offset="100%" stop-color="#EF4444" stop-opacity="0.02"/>
      </linearGradient>
    </defs>
    <path d="M18 32 L78 28 L138 35 L196 42 L252 64 L318 76 L388 89 L426 86 L426 98 L18 98 Z" fill="url(#dropFill)"/>
    <polyline points="18,32 78,28 138,35 196,42 252,64 318,76 388,89 426,86" fill="none" stroke="#EF4444" stroke-width="3.5" stroke-linejoin="round"/>
    <polyline points="18,38 82,36 144,41 208,46 276,58 344,64 426,68" fill="none" stroke="#F59E0B" stroke-width="2.4" stroke-dasharray="5 3"/>
    <g font-family="Segoe UI, Arial, sans-serif" font-weight="800">
      <rect x="14" y="10" width="126" height="22" rx="4" fill="#7F1D1D"/>
      <text x="22" y="25" fill="#FECACA" font-size="10.8">NIKKEI / KOSPI -4%</text>
      <rect x="148" y="10" width="96" height="22" rx="4" fill="#451A03"/>
      <text x="156" y="25" fill="#FDE68A" font-size="10.8">S&amp;P / NDX -2%</text>
      <rect x="252" y="10" width="178" height="22" rx="4" fill="#1E293B"/>
      <text x="260" y="25" fill="#CBD5E1" font-size="10.3">ANTHROPIC IPO · JP CPI 2.3%</text>
    </g>
  </svg>`;
}

function buildCop31Svg() {
  return `
  <svg viewBox="0 0 444 106" width="100%" height="106">
    <defs>
      <linearGradient id="copSky" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#064E3B"/>
        <stop offset="100%" stop-color="#14532D"/>
      </linearGradient>
    </defs>
    <rect width="444" height="106" rx="6" fill="url(#copSky)"/>
    <circle cx="72" cy="53" r="34" fill="#0F766E" stroke="#A7F3D0" stroke-width="2.4"/>
    <path d="M52 55 C52 34, 84 28, 92 42 C96 58, 76 76, 56 72 C52 66, 52 60, 52 55 Z" fill="#4ADE80"/>
    <path d="M58 70 Q72 54 88 42" fill="none" stroke="#064E3B" stroke-width="2.5" stroke-linecap="round"/>
    <g transform="translate(120,18)" font-family="Segoe UI, Arial, sans-serif">
      <text x="0" y="14" fill="#A7F3D0" font-size="11.2" font-weight="800" letter-spacing="1.0">UN CLIMATE SUMMIT · FINAL DAY</text>
      <text x="0" y="42" fill="#FFFFFF" font-size="22" font-weight="900">COP31 ANTALYA</text>
      <rect x="0" y="54" width="154" height="22" rx="4" fill="#15803D" stroke="#86EFAC" stroke-width="1"/>
      <text x="9" y="69" fill="#ECFDF5" font-size="10.4" font-weight="800">~80 NATIONS: GREEN AI</text>
      <rect x="162" y="54" width="150" height="22" rx="4" fill="#065F46" stroke="#6EE7B7" stroke-width="1"/>
      <text x="171" y="69" fill="#ECFDF5" font-size="10.4" font-weight="800">FINANCE &amp; PHASE-OUT</text>
    </g>
  </svg>`;
}

function buildApecImfSvg() {
  return `
  <svg viewBox="0 0 444 92" width="100%" height="92">
    <rect width="444" height="92" rx="6" fill="#0F172A"/>
    <g transform="translate(22,16)">
      <path d="M12 56 A36 36 0 0 1 84 56" fill="none" stroke="#334155" stroke-width="10" stroke-linecap="round"/>
      <path d="M12 56 A36 36 0 0 1 76 34" fill="none" stroke="#F59E0B" stroke-width="10" stroke-linecap="round"/>
      <text x="48" y="54" text-anchor="middle" fill="#FDE68A" font-family="Segoe UI, Arial, sans-serif" font-size="19" font-weight="900">4.7%</text>
      <text x="48" y="70" text-anchor="middle" fill="#94A3B8" font-family="Segoe UI, Arial, sans-serif" font-size="9.5" font-weight="800">IMF INFLATION</text>
    </g>
    <line x1="132" y1="14" x2="132" y2="78" stroke="#334155" stroke-width="1.5"/>
    <g transform="translate(150,18)" font-family="Segoe UI, Arial, sans-serif">
      <text x="0" y="14" fill="#93C5FD" font-size="11.5" font-weight="800" letter-spacing="1">33RD APEC · SHENZHEN, CHINA</text>
      <text x="0" y="39" fill="#FFFFFF" font-size="19" font-weight="800">Trade Agenda &amp; Rate Alert</text>
      <text x="0" y="60" fill="#CBD5E1" font-size="12" font-weight="600">AI hardware surge + energy pressures lift prices</text>
    </g>
  </svg>`;
}

function buildPolicySvg() {
  return `
  <svg viewBox="0 0 444 92" width="100%" height="92">
    <rect width="216" height="92" rx="6" fill="#1E293B"/>
    <rect x="228" width="216" height="92" rx="6" fill="#2E1065"/>
    <g transform="translate(16,16)" font-family="Segoe UI, Arial, sans-serif">
      <text x="0" y="13" fill="#93C5FD" font-size="11" font-weight="800" letter-spacing="0.8">US SENATE VOTE</text>
      <text x="0" y="42" fill="#FFFFFF" font-size="25" font-weight="900">51 – 48</text>
      <rect x="0" y="52" width="184" height="10" rx="5" fill="#334155"/>
      <rect x="0" y="52" width="95" height="10" rx="5" fill="#EF4444"/>
      <rect x="97" y="52" width="87" height="10" rx="5" fill="#3B82F6"/>
    </g>
    <g transform="translate(244,16)" font-family="Segoe UI, Arial, sans-serif">
      <text x="0" y="13" fill="#DDD6FE" font-size="11" font-weight="800" letter-spacing="0.8">ITALY PRIVACY RULING</text>
      <text x="0" y="42" fill="#FFFFFF" font-size="25" font-weight="900">€805M</text>
      <text x="0" y="62" fill="#C4B5FD" font-size="11.5" font-weight="700">META ANDROID DATA FINE</text>
    </g>
  </svg>`;
}

function buildHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    width: 1024px;
    height: 1024px;
    overflow: hidden;
    background: #F4EFE4;
    color: #111827;
    font-family: Georgia, "Times New Roman", serif;
    -webkit-font-smoothing: antialiased;
  }
  .page {
    width: 1024px;
    height: 1024px;
    display: flex;
    flex-direction: column;
    background: #F4EFE4;
  }
  .masthead {
    height: 132px;
    background: #0F172A;
    color: #FFFFFF;
    padding: 16px 26px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 5px solid #C89B3C;
  }
  .mast-left {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .date-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .date-pill {
    background: #C89B3C;
    color: #0F172A;
    font-family: "Segoe UI", Arial, sans-serif;
    font-size: 16px;
    font-weight: 900;
    letter-spacing: 1.4px;
    padding: 4px 12px;
    border-radius: 3px;
    text-transform: uppercase;
  }
  .edition-tag {
    font-family: "Segoe UI", Arial, sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1.5px;
    color: #CBD5E1;
    text-transform: uppercase;
  }
  .mast-title {
    font-size: 40px;
    font-weight: 700;
    letter-spacing: 0.4px;
    line-height: 1.05;
    color: #FFFDF8;
  }
  .mast-sub {
    font-family: "Segoe UI", Arial, sans-serif;
    font-size: 13.5px;
    font-weight: 600;
    letter-spacing: 0.6px;
    color: #94A3B8;
  }
  .grid {
    flex: 1;
    padding: 14px 20px 12px 20px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 312px 256px 236px;
    gap: 13px 16px;
  }
  .card {
    background: #FFFDF8;
    border: 1.5px solid #D6CCBA;
    border-top-width: 5px;
    border-radius: 5px;
    padding: 11px 14px 12px 14px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 2px 6px rgba(15, 23, 42, 0.06);
  }
  .card-kicker {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: "Segoe UI", Arial, sans-serif;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    margin-bottom: 6px;
  }
  .region-pill {
    font-size: 11px;
    font-weight: 700;
    color: #475569;
    letter-spacing: 0.8px;
  }
  .art {
    width: 100%;
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 8px;
    line-height: 0;
  }
  .headline {
    font-size: 24px;
    font-weight: 700;
    line-height: 1.14;
    color: #0F172A;
    margin-bottom: 5px;
  }
  .headline.compact {
    font-size: 21.5px;
  }
  .deck {
    font-family: "Segoe UI", Arial, sans-serif;
    font-size: 14.5px;
    line-height: 1.32;
    color: #334155;
    font-weight: 500;
  }
  .c-red { border-top-color: #B91C1C; }
  .c-red .k-label { color: #B91C1C; }
  .c-teal { border-top-color: #0E7490; }
  .c-teal .k-label { color: #0E7490; }
  .c-amber { border-top-color: #B45309; }
  .c-amber .k-label { color: #B45309; }
  .c-green { border-top-color: #15803D; }
  .c-green .k-label { color: #15803D; }
  .c-blue { border-top-color: #1D4ED8; }
  .c-blue .k-label { color: #1D4ED8; }
  .c-indigo { border-top-color: #6D28D9; }
  .c-indigo .k-label { color: #6D28D9; }
  .footer {
    height: 36px;
    background: #1E293B;
    color: #F8FAFC;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: "Segoe UI", Arial, sans-serif;
    font-size: 12.8px;
    font-weight: 600;
    letter-spacing: 0.25px;
  }
  .footer strong {
    color: #FCD34D;
    font-weight: 800;
    margin-right: 8px;
  }
</style>
</head>
<body>
  <div class="page">
    <header class="masthead">
      <div class="mast-left">
        <div class="date-row">
          <span class="date-pill">Friday · 20 November 2026</span>
          <span class="edition-tag">Global Front Page</span>
        </div>
        <h1 class="mast-title">WORLD NEWS IN ONE DAY</h1>
        <p class="mast-sub">EUROPE · SOUTH ASIA · ASIA-PACIFIC · CLIMATE · DIPLOMACY · AMERICAS</p>
      </div>
      <div>${buildGlobeSvg()}</div>
    </header>

    <main class="grid">
      <article class="card c-red">
        <div>
          <div class="card-kicker"><span class="k-label">Conflict · Europe</span><span class="region-pill">UKRAINE</span></div>
          <div class="art">${buildKyivSvg()}</div>
          <h2 class="headline">Kyiv Hit by Dawn Ballistic Strikes</h2>
          <p class="deck">Russian missiles struck multiple Kyiv districts early Friday, sparking fires and damaging energy and civic infrastructure.</p>
        </div>
      </article>

      <article class="card c-teal">
        <div>
          <div class="card-kicker"><span class="k-label">Disaster · South Asia</span><span class="region-pill">INDIA</span></div>
          <div class="art">${buildCycloneSvg()}</div>
          <h2 class="headline">Cyclone Akvan Hits Eastern India</h2>
          <p class="deck">Severe storm made landfall along Andhra Pradesh and Odisha, prompting mass evacuations and halting rail and air travel.</p>
        </div>
      </article>

      <article class="card c-amber">
        <div>
          <div class="card-kicker"><span class="k-label">Markets &amp; AI · Asia-Pacific</span><span class="region-pill">TOKYO · SEOUL · NY</span></div>
          <div class="art">${buildMarketsSvg()}</div>
          <h2 class="headline compact">Asian Stocks Plunge 4% in Tech Sell-Off</h2>
          <p class="deck">Nikkei and Kospi dropped after Wall Street slid 2% following Anthropic's Nasdaq debut; Japan's inflation rose to 2.3%.</p>
        </div>
      </article>

      <article class="card c-green">
        <div>
          <div class="card-kicker"><span class="k-label">Climate · Global Summit</span><span class="region-pill">ANTALYA, TÜRKIYE</span></div>
          <div class="art">${buildCop31Svg()}</div>
          <h2 class="headline compact">COP31 Enters Final Day in Antalya</h2>
          <p class="deck">Negotiators raced to settle climate finance and fossil-fuel terms as nearly 80 nations backed a Green AI pledge.</p>
        </div>
      </article>

      <article class="card c-blue">
        <div>
          <div class="card-kicker"><span class="k-label">Diplomacy &amp; Economy</span><span class="region-pill">SHENZHEN, CHINA</span></div>
          <div class="art">${buildApecImfSvg()}</div>
          <h2 class="headline compact">APEC Summit &amp; IMF 4.7% Inflation Alert</h2>
          <p class="deck">Leaders backed the Shenzhen trade agenda as IMF chief warned AI hardware demand and energy shocks lift inflation to 4.7%.</p>
        </div>
      </article>

      <article class="card c-indigo">
        <div>
          <div class="card-kicker"><span class="k-label">Policy &amp; Tech Law</span><span class="region-pill">USA · ITALY</span></div>
          <div class="art">${buildPolicySvg()}</div>
          <h2 class="headline compact">US War Powers Fails; Meta €805M Fine</h2>
          <p class="deck">US Senate voted 51–48 against curbing Iran war powers; Italy fined Meta €805M over Android photo-access privacy breaches.</p>
        </div>
      </article>
    </main>

    <footer class="footer">
      <div><strong>ALSO 20 NOV 2026:</strong> Indonesia passes Asset Forfeiture Law after 18-year push &nbsp;•&nbsp; US &amp; Thailand sign trade-defense pact</div>
      <div>20 NOV 2026</div>
    </footer>
  </div>
</body>
</html>`;
}

function main() {
  const browser = findBrowser();
  const html = buildHtml();
  writeFileSync(TEMP_HTML, html, 'utf8');

  try {
    const fileUrl = pathToFileURL(TEMP_HTML).href;
    execFileSync(
      browser,
      [
        '--headless=new',
        '--disable-gpu',
        '--hide-scrollbars',
        '--force-device-scale-factor=1',
        '--window-size=1024,1024',
        `--screenshot=${OUTPUT_PNG}`,
        fileUrl,
      ],
      { stdio: 'pipe' }
    );
  } finally {
    if (existsSync(TEMP_HTML)) unlinkSync(TEMP_HTML);
  }

  const bytes = readFileSync(OUTPUT_PNG);
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  console.log(`Rendered ${OUTPUT_PNG}: ${width}x${height}, ${bytes.length} bytes`);
  if (width !== 1024 || height !== 1024) {
    throw new Error(`Expected 1024x1024, got ${width}x${height}`);
  }
  if (bytes.length > 1048576) {
    throw new Error(`PNG exceeds 1 MiB: ${bytes.length} bytes`);
  }
}

main();
