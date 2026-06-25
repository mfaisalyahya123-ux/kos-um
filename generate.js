'use strict';

/**
 * generate.js — Pembangunan Kos UM 2 Lantai Dashboard Generator
 *
 * Architecture (4 layers):
 *   1. UTILITIES      — pure helper functions, zero side-effects
 *   2. DATA LAYER     — processData() maps raw JSON → structured processedData
 *   3. RENDERING LAYER — pure render*() functions: data-in, HTML-string-out
 *   4. FILE OUTPUT    — reads data.json, writes index.html + style.css
 */

const fs   = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════════════════
// 1. UTILITIES
//    Single source of truth for formatting, date math, and XSS sanitisation.
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Escapes user-supplied strings before interpolating into HTML.
 * Prevents XSS when data.json is ever exposed to external input.
 */
function esc(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatRupiah(amount) {
    return 'Rp ' + Number(amount || 0).toLocaleString('id-ID');
}

const ID_DAYS    = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
const ID_MONTHS  = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const SHORT_MONTHS = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return `${ID_DAYS[d.getDay()]}, ${d.getDate()} ${ID_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Returns the ISO string of the week-anchor day for a given date.
 *
 * @param {string} dateStr  - ISO date string (e.g. "2025-03-10")
 * @param {number} anchorDay - Day-of-week integer to use as the week key:
 *                             1 = Monday (Mon-Sat calendar grouping)
 *                             6 = Saturday (payroll / attendance grouping)
 *
 * Sundays always fall into the NEXT week, consistent with the project's
 * Mon–Sat work schedule.
 *
 * Previously, this logic was duplicated across generateDateSections(),
 * generateWeeklyPayroll(), and generateWorkersList(). It now lives here once.
 * Changing the payroll day (e.g. from Saturday to Friday) only requires
 * updating the call-site constant PAY_DAY below.
 */
function getWeekKey(dateStr, anchorDay = PAY_DAY) {
    const d    = new Date(dateStr);
    const dow  = d.getDay();
    const diff = dow === 0 ? anchorDay : (anchorDay - dow);
    const anchor = new Date(d);
    anchor.setDate(d.getDate() + diff);
    return anchor.toISOString().split('T')[0];
}

/** Change this one constant to shift the payroll schedule. */
const PAY_DAY      = 6;   // 6 = Saturday
const CALENDAR_DAY = 1;   // 1 = Monday (for date-section grouping)


// ═══════════════════════════════════════════════════════════════════════════
// 2. DATA LAYER
//    processData() is the single transformation step.
//    It returns a flat, finalised processedData object.
//    Rendering functions ONLY receive this object — they perform no
//    date math, reductions, or grouping of their own.
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Category display config.
 * Adding a new category (e.g. "Perizinan") requires adding ONE entry here.
 * No logic elsewhere needs to change.
 *
 * `order` controls the display sequence in the breakdown section.
 * Unknown categories (not present here) are routed to "Lain-lain".
 */
const CATEGORY_CONFIG = {
    'Struktur Bangunan': { icon: '🏗️', label: 'Struktur Bangunan', order: 1 },
    'Upah':              { icon: '👷', label: 'Upah Pekerja',       order: 2 },
    'Material':          { icon: '🧱', label: 'Material',           order: 3 },
    'Alat':              { icon: '🔧', label: 'Alat',               order: 4 },
    'Jajan':             { icon: '🍔', label: 'Jajan & Minuman',    order: 5 },
    'Lain-lain':         { icon: '📦', label: 'Lain-lain',          order: 99 },
};

/**
 * Worker role display config.
 * Adding a new role (e.g. "keamanan") requires adding ONE entry here.
 * Roles not listed fall back to DEFAULT_ROLE_CONFIG.
 */
const ROLE_CONFIG = {
    mandor:      { bg: '#e3f2fd', label: 'MANDOR' },
    tukang:      { bg: '#fff3e0', label: 'TUKANG' },
    tukang_baru: { bg: '#fff3e0', label: 'TUKANG' },
    kuli:        { bg: '#f3e5f5', label: 'KULI'   },
};
const DEFAULT_ROLE_CONFIG = { bg: '#f5f5f5', label: 'PEKERJA' };

/**
 * Maps and finalises all raw data into one structured object.
 * Rendering functions must not perform transformations — they receive this.
 *
 * @param {object} data - Parsed data.json
 * @returns {object}    - processedData
 */
function processData(data) {
    const { transactions, workers = {} } = data;

    // Grand total: computed from raw transactions, never from data.summary.
    const grandTotal = transactions.reduce((s, tx) => s + (tx.total || 0), 0);

    // --- Known categories: derived dynamically from CATEGORY_CONFIG keys ---
    // (not hardcoded from the transaction list itself, so any typo in the JSON
    //  is still caught and routed to "Lain-lain" as a safety bucket)
    const knownCategories = Object.keys(CATEGORY_CONFIG).filter(k => k !== 'Lain-lain');

    // --- Per-category totals and item buckets ---
    const categoryTotals  = {};
    const categoryDetails = {};
    [...knownCategories, 'Lain-lain'].forEach(cat => {
        categoryTotals[cat]  = 0;
        // 'Upah' carries an extra sub-dictionary for role breakdown
        categoryDetails[cat] = cat === 'Upah' ? { _sub: {} } : [];
    });

    transactions.forEach(tx => {
        const cat = knownCategories.includes(tx.category) ? tx.category : 'Lain-lain';
        categoryTotals[cat] = (categoryTotals[cat] || 0) + (tx.total || 0);

        if (cat === 'Upah') {
            const rawSub = tx.subcategory || '';
            const subKey = rawSub.charAt(0).toUpperCase() + rawSub.slice(1).toLowerCase();
            if (!categoryDetails.Upah._sub[subKey]) categoryDetails.Upah._sub[subKey] = [];
            categoryDetails.Upah._sub[subKey].push(tx);
        } else {
            categoryDetails[cat].push(tx);
        }
    });

    // --- Transactions grouped by date, sorted newest-first ---
    const transactionsByDate = {};
    transactions.forEach(tx => {
        if (!transactionsByDate[tx.date]) transactionsByDate[tx.date] = [];
        transactionsByDate[tx.date].push(tx);
    });
    const sortedDates = Object.keys(transactionsByDate).sort().reverse();

    // --- Weekly spend totals for trend chart ---
    const weeklyTotals = {};
    transactions.forEach(tx => {
        const key = getWeekKey(tx.date, PAY_DAY);
        weeklyTotals[key] = (weeklyTotals[key] || 0) + (tx.total || 0);
    });

    // --- Funding source breakdown ---
    const byFundingSource = {};
    transactions.forEach(tx => {
        const src = tx.funding_source || 'Kas UM';
        if (!byFundingSource[src]) byFundingSource[src] = { total: 0, transactions: [] };
        byFundingSource[src].total += (tx.total || 0);
        byFundingSource[src].transactions.push(tx);
    });

    // --- Wage (Upah) transactions grouped by payroll week, then by subcategory ---
    const wageByWeek = {};
    transactions
        .filter(tx => tx.category === 'Upah')
        .forEach(tx => {
            const weekKey = getWeekKey(tx.date, PAY_DAY);
            if (!wageByWeek[weekKey]) wageByWeek[weekKey] = {};
            const sub = (tx.subcategory || 'Harian').toLowerCase();
            if (!wageByWeek[weekKey][sub]) wageByWeek[weekKey][sub] = [];
            wageByWeek[weekKey][sub].push(tx);
        });

    // --- Worker roles: discovered dynamically from data.workers keys ---
    // Previously hardcoded as ['mandor', 'tukang', 'tukang_baru', 'kuli']
    const workerRoles = Object.keys(workers);

    // --- Payroll-week keys that have at least one attendance record ---
    const workerWeekSet = new Set();
    workerRoles.forEach(role => {
        (workers[role] || []).forEach(worker => {
            Object.keys(worker.attendance || {}).forEach(date => {
                workerWeekSet.add(getWeekKey(date, PAY_DAY));
            });
        });
    });
    const workerWeekKeys = [...workerWeekSet].sort().reverse();

    return {
        grandTotal,
        knownCategories,
        categoryTotals,
        categoryDetails,
        transactionsByDate,
        sortedDates,
        weeklyTotals,
        byFundingSource,
        wageByWeek,
        workerRoles,
        workerWeekKeys,
    };
}


// ═══════════════════════════════════════════════════════════════════════════
// 3. RENDERING LAYER
//    Pure functions: they receive processedData (and rawData when needed for
//    config values) and return HTML strings.
//    They NEVER perform date math, .reduce(), or .filter() on raw transactions.
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Shared card shell used by category, funding-source, and payroll renderers.
 * `titleHtml` may contain pre-built HTML (e.g. styled spans); all dynamic
 * text INSIDE it must already be esc()-wrapped by the caller.
 */
function renderCard({ titleHtml, total, percentage, bodyHtml, extraMeta = '' }) {
    return `
    <div class="category-card">
        <div class="category-header">
            <h3>${titleHtml}<span class="arrow">▼</span></h3>
            <div class="total">${formatRupiah(total)}</div>
            <div class="percentage">${esc(String(percentage))}% dari total${extraMeta}</div>
            <div class="progress-bar-track">
                <div class="progress-bar-fill" style="width:${esc(String(percentage))}%"></div>
            </div>
        </div>
        <div class="category-details">
            <div class="item-list" style="padding:0 25px 25px 25px;">${bodyHtml}</div>
        </div>
    </div>`;
}

// ----- 3a. Stats bar -------------------------------------------------------

function renderStats({ grandTotal, categoryTotals }) {
    const pct = cat => (((categoryTotals[cat] || 0) / grandTotal) * 100).toFixed(1);
    const matAlat = ((((categoryTotals['Material'] || 0) + (categoryTotals['Alat'] || 0)) / grandTotal) * 100).toFixed(1);
    return `
    <div class="stats">
        <div class="stat-card">
            <div class="icon">💰</div>
            <div class="label">Total Pengeluaran</div>
            <div class="value">Rp ${(grandTotal / 1_000_000).toFixed(2)} Jt</div>
        </div>
        <div class="stat-card">
            <div class="icon">🏗️</div>
            <div class="label">Struktur Bangunan</div>
            <div class="value">${pct('Struktur Bangunan')}%</div>
        </div>
        <div class="stat-card">
            <div class="icon">👷</div>
            <div class="label">Upah Pekerja</div>
            <div class="value">${pct('Upah')}%</div>
        </div>
        <div class="stat-card">
            <div class="icon">📦</div>
            <div class="label">Material & Alat</div>
            <div class="value">${matAlat}%</div>
        </div>
    </div>`;
}

// ----- 3b. Category breakdown cards ----------------------------------------

function renderCategoryCards({ grandTotal, knownCategories, categoryTotals, categoryDetails }) {
    // Order cards by CATEGORY_CONFIG.order; Lain-lain always last
    const activeCats = [...knownCategories, 'Lain-lain']
        .filter(cat => (categoryTotals[cat] || 0) > 0)
        .sort((a, b) => (CATEGORY_CONFIG[a]?.order ?? 50) - (CATEGORY_CONFIG[b]?.order ?? 50));

    return activeCats.map(cat => {
        const total      = categoryTotals[cat] || 0;
        const percentage = ((total / grandTotal) * 100).toFixed(1);
        const cfg        = CATEGORY_CONFIG[cat] || { icon: '📦', label: cat };
        const titleHtml  = `<span>${esc(cfg.icon)} ${esc(cfg.label || cat)}</span>`;
        let bodyHtml     = '';

        if (cat === 'Struktur Bangunan') {
            // Group items by the "(Lantai N – ...)" tag embedded in descriptions
            const groups   = {};
            const cleanDesc = desc => esc(desc.replace(/\s*\(Lantai \d+ - [^)]+\)/g, ''));
            categoryDetails[cat].forEach(tx => {
                if (tx.subcategory) {
                    const key = tx.subcategory;
                    if (!groups[key]) groups[key] = [];
                    groups[key].push(tx);
                } else {
                    const match = tx.description.match(/\((Lantai \d+ - [^)]+)\)/);
                    const key   = match ? match[1] : 'Lainnya';
                    if (!groups[key]) groups[key] = [];
                    groups[key].push(tx);
                }
            });
            const sortedKeys = Object.keys(groups).sort((a, b) => {
                if (a === 'Lainnya') return 1;
                if (b === 'Lainnya') return -1;
                return a.localeCompare(b);
            });
            bodyHtml = sortedKeys.map(key => {
                const items    = groups[key];
                const subtotal = items.reduce((s, tx) => s + tx.total, 0);
                return `
                <div style="margin-bottom:18px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:#fff8e1;border-radius:6px;margin-bottom:10px;">
                        <h4 style="color:#e67e22;font-size:.95em;margin:0;">
                            ${key === 'Lainnya' ? '📦 Lainnya' : key === 'Cor Dak' ? '🏗️ Cor Dak' : '🏠 ' + esc(key)}
                        </h4>
                        <strong style="color:#e67e22;font-size:.95em;white-space:nowrap;">${formatRupiah(subtotal)}</strong>
                    </div>
                    ${items.map(tx => `
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:6px 8px 6px 12px;margin-bottom:2px;gap:20px;">
                        <span style="flex:1;text-align:left;">${cleanDesc(tx.description)} (${esc(tx.quantity)} ${esc(tx.unit)})</span>
                        <strong style="flex-shrink:0;text-align:right;white-space:nowrap;">${formatRupiah(tx.total)}</strong>
                    </div>`).join('')}
                </div>`;
            }).join('');

        } else if (cat === 'Upah') {
            // Show subtotals per role sub-key (e.g. Kuli, Tukang, Mandor)
            const subs = categoryDetails[cat]._sub;
            bodyHtml = Object.keys(subs).map(subKey => {
                const subTotal = subs[subKey].reduce((s, tx) => s + tx.total, 0);
                return subTotal > 0
                    ? `<div class="item"><span>${esc(subKey)}</span><strong>${formatRupiah(subTotal)}</strong></div>`
                    : '';
            }).join('');

        } else if (cat === 'Lain-lain') {
            bodyHtml = categoryDetails[cat].map(tx => `
            <div class="item">
                <span>${esc(tx.description)} <em style="color:#aaa;font-size:.85em;">(${esc(tx.category)})</em></span>
                <strong>${formatRupiah(tx.total)}</strong>
            </div>`).join('');

        } else {
            // Generic: description + optional qty/unit
            bodyHtml = categoryDetails[cat].map(tx => `
            <div class="item">
                <span>${esc(tx.description)}${tx.quantity ? ` (${esc(tx.quantity)} ${esc(tx.unit)})` : ''}</span>
                <strong>${formatRupiah(tx.total)}</strong>
            </div>`).join('');
        }

        return renderCard({ titleHtml, total, percentage, bodyHtml });
    }).join('');
}

// ----- 3c. Date sections (weekly collapsibles) -----------------------------

function renderDateSections({ transactionsByDate, sortedDates }, rawData) {
    const ICON_MAP = {
        'Jajan': '🍔', 'Material': '🧱', 'Upah': '💰',
        'Alat': '🔧', 'Struktur Bangunan': '🏗️',
    };

    // Group dates into Mon-Sat calendar weeks
    const weekGroups = {};
    sortedDates.forEach(date => {
        const key = getWeekKey(date, CALENDAR_DAY);
        if (!weekGroups[key]) weekGroups[key] = [];
        weekGroups[key].push(date);
    });

    return Object.keys(weekGroups).sort().map((weekKey, idx) => {
        const weekNum   = idx + 1;
        const dates     = weekGroups[weekKey].sort();
        const allTxThisWeek = dates.flatMap(d => transactionsByDate[d]);
        const weekTotal = allTxThisWeek.reduce((s, tx) => s + tx.total, 0);
        const txCount   = allTxThisWeek.length;

        const firstDate = new Date(dates[0]);
        const lastDate  = new Date(dates[dates.length - 1]);
        const dateRange = dates.length === 1
            ? `${firstDate.getDate()} ${SHORT_MONTHS[firstDate.getMonth()]}`
            : `${firstDate.getDate()}-${lastDate.getDate()} ${SHORT_MONTHS[lastDate.getMonth()]}`;

        const datesHtml = dates.map(date => {
            const txList   = transactionsByDate[date];
            const dateTotal = txList.reduce((s, tx) => s + tx.total, 0);
            const workDesc  = rawData.daily_work?.[date] || '';

            // Category summary tag for the collapsible header
            const catSummary = Object.entries(
                txList.reduce((acc, tx) => {
                    const c = tx.category || 'Lain-lain';
                    acc[c] = (acc[c] || 0) + 1;
                    return acc;
                }, {})
            ).map(([k, v]) => `${v}${k[0].toLowerCase()}`).join(', ');

            // Group transactions by category for the expanded view
            const byCategory = txList.reduce((acc, tx) => {
                const c = tx.category || 'Lain-lain';
                if (!acc[c]) acc[c] = [];
                acc[c].push(tx);
                return acc;
            }, {});

            const txItemsHtml = Object.keys(byCategory).map(cat => {
                const icon = ICON_MAP[cat] || '📦';
                const rows = byCategory[cat].map(tx => {
                    let desc = esc(tx.description);
                    if (tx.subcategory) {
                        desc = `${esc(tx.quantity)} ${esc(tx.subcategory.toLowerCase())} ${tx.description.includes('full day') ? 'full day' : esc(tx.description)} (${esc(tx.quantity)} orang @ ${formatRupiah(tx.price_per_unit)})`;
                    } else if (tx.quantity > 1 || tx.unit !== 'item') {
                        desc = `${esc(tx.description)} (${esc(tx.quantity)} ${esc(tx.unit)}${tx.price_per_unit ? ' @ ' + formatRupiah(tx.price_per_unit) : ''})`;
                    }
                    return `
                    <div class="item" style="font-size:.85em;">
                        <span>${desc}</span>
                        <strong>${formatRupiah(tx.total)}</strong>
                    </div>`;
                }).join('');
                return `
                <div style="padding-left:10px;margin-bottom:8px;">
                    <h5 style="color:#764ba2;margin-bottom:5px;font-size:.9em;">${icon} ${esc(cat)}</h5>
                    ${rows}
                </div>`;
            }).join('');

            return `
            <div class="date-inner-collapsible">
                <h4>
                    <span>📆 ${esc(formatDate(date))}</span>
                    <span style="font-size:.8em;color:#888;">${txList.length} tx</span>
                    <span style="font-size:.8em;color:#999;">${esc(catSummary)}${workDesc ? ' 🔨' : ''}</span>
                </h4>
                <div style="display:flex;align-items:center;gap:10px;">
                    <strong style="color:#764ba2;font-size:.95em;">${formatRupiah(dateTotal)}</strong>
                    <span class="arrow">▼</span>
                </div>
            </div>
            <div class="date-inner-content">
                ${workDesc ? `<div style="padding:10px 15px;margin-bottom:12px;background:#f0f7ff;border-left:4px solid #667eea;border-radius:6px;"><p style="margin:0;font-size:.9em;">📋 <strong>Pekerjaan:</strong> ${esc(workDesc)}</p></div>` : ''}
                ${txItemsHtml}
            </div>`;
        }).join('');

        return `
        <div class="date-collapsible" style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;">
            <div style="text-align:left;">
                <h3 style="color:white;margin:0;">📅 Minggu ${weekNum} (${esc(dateRange)})</h3>
                <span style="font-size:.85em;opacity:.9;">${txCount} transaksi · ${dates.length} hari</span>
            </div>
            <div style="display:flex;align-items:center;gap:15px;">
                <strong style="font-size:1.2em;">${formatRupiah(weekTotal)}</strong>
                <span class="arrow" style="color:white;">▼</span>
            </div>
        </div>
        <div class="date-content">
            ${datesHtml}
            <div style="margin-top:10px;padding:12px 15px;background:#667eea10;border-radius:8px;display:flex;justify-content:space-between;align-items:center;">
                <span style="color:#667eea;font-weight:600;">Total Minggu ${weekNum}</span>
                <strong style="font-size:1.1em;color:#667eea;">${formatRupiah(weekTotal)}</strong>
            </div>
        </div>`;
    }).join('');
}

// ----- 3d. Transaction table rows ------------------------------------------

function renderTransactionRows({ transactionsByDate, sortedDates }) {
    const allTx = sortedDates.flatMap(d => transactionsByDate[d]);
    return allTx.map((tx, i) => {
        const category      = tx.subcategory ? `${tx.category} - ${tx.subcategory}` : tx.category;
        const fundingSource = tx.funding_source || 'Kas UM';
        const badgeBg       = fundingSource === 'Uang Ayah' ? '#e3f2fd' : '#fff3e0';
        return `
        <tr>
            <td>${allTx.length - i}</td>
            <td>${esc(formatDate(tx.date))}</td>
            <td>${esc(category)}</td>
            <td>${esc(tx.description)}</td>
            <td>${esc(tx.quantity)} ${esc(tx.unit)}</td>
            <td>${esc(tx.notes || '-')}</td>
            <td>${formatRupiah(tx.price_per_unit)}</td>
            <td><strong>${formatRupiah(tx.total)}</strong></td>
            <td><span style="padding:4px 8px;background:${badgeBg};border-radius:4px;font-size:.9em;">${esc(fundingSource)}</span></td>
        </tr>`;
    }).join('');
}

// ----- 3e. Wage rates table ------------------------------------------------

function renderWageRates(rawData) {
    const rates = rawData.wage_rates || {};
    // Dynamically enumerate all "*_full_day" keys instead of hardcoding positions
    const rows = Object.entries(rates)
        .filter(([k]) => k.endsWith('_full_day'))
        .map(([k, v]) => {
            const label = k.replace('_full_day', '').replace(/_/g, ' ');
            const display = label.charAt(0).toUpperCase() + label.slice(1);
            return `<tr><td>${esc(display)}</td><td><strong>${formatRupiah(v)}</strong></td></tr>`;
        }).join('');
    return `
    <table>
        <thead><tr><th>Posisi</th><th>Tarif per Hari</th></tr></thead>
        <tbody>${rows}</tbody>
    </table>`;
}

// ----- 3f. Funding source breakdown ----------------------------------------

function renderFundingSourceBreakdown({ byFundingSource, grandTotal }) {
    const cards = Object.keys(byFundingSource).sort().map(src => {
        const { total, transactions } = byFundingSource[src];
        const percentage = ((total / grandTotal) * 100).toFixed(1);
        const bgColor    = src === 'Uang Ayah' ? '#e3f2fd' : '#fff3e0';
        const titleHtml  = `<span style="padding:6px 12px;background:${bgColor};border-radius:6px;">${esc(src)}</span>`;
        const bodyHtml   = [...transactions]
            .sort((a, b) => b.total - a.total)
            .map(tx => {
                const cat = tx.subcategory ? `${tx.category} - ${tx.subcategory}` : tx.category;
                return `
                <div class="item">
                    <span>${esc(formatDate(tx.date))} | ${esc(cat)} | ${esc(tx.description)}</span>
                    <strong>${formatRupiah(tx.total)}</strong>
                </div>`;
            }).join('');
        return renderCard({ titleHtml, total, percentage, bodyHtml });
    }).join('');
    return `<div class="category-breakdown">${cards}</div>`;
}

// ----- 3g. Weekly payroll summary ------------------------------------------

function renderWeeklyPayroll({ wageByWeek }, rawData) {
    const sortedWeeks = Object.keys(wageByWeek).sort().reverse();
    return sortedWeeks.map((satKey, idx) => {
        const saturday    = new Date(satKey);
        const monday      = new Date(saturday);
        monday.setDate(saturday.getDate() - 5);

        const weekLabel   = `${monday.getDate()}-${saturday.getDate()} ${SHORT_MONTHS[saturday.getMonth()]}`;
        const weekData    = wageByWeek[satKey];
        const weekTotal   = Object.values(weekData).reduce(
            (s, arr) => s + arr.reduce((ss, tx) => ss + tx.total, 0), 0
        );

        const subSections = Object.keys(weekData).map(subKey => {
            const txArr    = weekData[subKey];
            const subTotal = txArr.reduce((s, tx) => s + tx.total, 0);
            if (subTotal === 0) return '';

            const absensi  = txArr.reduce((s, tx) => s + (tx.quantity || 0), 0);
            const label    = subKey.charAt(0).toUpperCase() + subKey.slice(1);
            const rateKey  = `${subKey}_full_day`;
            const rate     = rawData.wage_rates?.[rateKey] || 0;
            const rateStr  = rate ? ` × ${formatRupiah(rate)}` : '';

            const dayRows = txArr.map(tx => `
                <div class="item" style="padding:5px 0;">
                    <span>${esc(formatDate(tx.date))}: ${esc(tx.quantity)} ${esc(subKey)}</span>
                    <strong>${formatRupiah(tx.total)}</strong>
                </div>`).join('');

            return `
            <div class="category-card" style="margin-bottom:10px;">
                <div class="category-header" style="padding:10px 15px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;width:100%;">
                        <span>${esc(label)} (${absensi} Absensi${rateStr})</span>
                        <strong>${formatRupiah(subTotal)}</strong>
                        <span class="arrow" style="margin-left:10px;">▼</span>
                    </div>
                </div>
                <div class="category-details">
                    <div style="padding:10px 15px;font-size:.9em;">${dayRows}</div>
                </div>
            </div>`;
        }).join('');

        return `
        <div class="category-card">
            <div class="category-header">
                <h3>
                    <span>📅 Minggu ${sortedWeeks.length - idx} (${esc(weekLabel)})</span>
                    <span class="arrow">▼</span>
                </h3>
                <div class="total">${formatRupiah(weekTotal)}</div>
                <div class="percentage">Dibayar Sabtu ${saturday.getDate()} ${esc(SHORT_MONTHS[saturday.getMonth()])}</div>
            </div>
            <div class="category-details">
                <div class="item-list" style="padding:0 25px 25px 25px;">${subSections}</div>
            </div>
        </div>`;
    }).join('');
}

// ----- 3h. Workers & attendance list ---------------------------------------

function renderWorkersList({ workerRoles, workerWeekKeys }, rawData) {
    if (!rawData.workers) return '';

    return workerWeekKeys.map((satKey, idx) => {
        const saturday = new Date(satKey);
        const monday   = new Date(saturday);
        monday.setDate(saturday.getDate() - 5);
        const weekLabel = `${monday.getDate()}-${saturday.getDate()} ${SHORT_MONTHS[saturday.getMonth()]}`;

        // Collect all attendance dates that fall in this pay week
        const allDatesInWeek = new Set();
        workerRoles.forEach(role => {
            (rawData.workers[role] || []).forEach(worker => {
                Object.keys(worker.attendance || {}).forEach(date => {
                    if (getWeekKey(date, PAY_DAY) === satKey) allDatesInWeek.add(date);
                });
            });
        });
        const weekDates = [...allDatesInWeek].sort();

        // Render a card for every worker in every role who has records this week
        const workerCardsHtml = workerRoles.flatMap(role => {
            const cfg = ROLE_CONFIG[role] || DEFAULT_ROLE_CONFIG;
            return (rawData.workers[role] || []).map(worker => {
                const activeDates = weekDates.filter(d => worker.attendance?.[d]);
                if (activeDates.length === 0) return '';

                const hadirCount = activeDates.filter(d => worker.attendance[d] === 'hadir').length;
                const totalGaji  = hadirCount * (worker.rate || 0);

                const dayRows = activeDates.map(date => {
                    const isHadir = worker.attendance[date] === 'hadir';
                    return `
                    <div class="item" style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
                        <span>${esc(formatDate(date))}</span>
                        <strong>
                            <span style="padding:4px 12px;border-radius:4px;background:${isHadir ? '#e8f5e9' : '#ffebee'};color:${isHadir ? '#2e7d32' : '#c62828'};font-size:.9em;">
                                ${isHadir ? 'HADIR' : 'IZIN'}
                            </span>
                        </strong>
                    </div>`;
                }).join('');

                return `
                <div class="category-card">
                    <div class="category-header">
                        <h3>
                            <span style="background:${cfg.bg};padding:6px 12px;border-radius:6px;font-weight:bold;">
                                ${esc(cfg.label)}: ${esc(worker.name)}
                            </span>
                            <span class="arrow">▼</span>
                        </h3>
                        <div class="total">${formatRupiah(totalGaji)}</div>
                        <div class="percentage">${hadirCount} hari × ${formatRupiah(worker.rate)}</div>
                    </div>
                    <div class="category-details">
                        <div class="item-list" style="padding:0 25px 25px 25px;">${dayRows}</div>
                    </div>
                </div>`;
            }).filter(Boolean);
        }).join('');

        return `
        <div class="category-card" style="margin-bottom:20px;">
            <div class="category-header">
                <h3>
                    <span>Minggu ${workerWeekKeys.length - idx} (${esc(weekLabel)})</span>
                    <span class="arrow">▼</span>
                </h3>
            </div>
            <div class="category-details">
                <div style="padding:0 25px 25px 25px;">
                    <div class="category-breakdown">${workerCardsHtml}</div>
                </div>
            </div>
        </div>`;
    }).join('');
}

// ----- 3i. Weekly trend chart ----------------------------------------------

function renderTrendChart({ weeklyTotals }) {
    const weeks = Object.keys(weeklyTotals).sort();
    if (weeks.length === 0) return '<p style="color:#888;">Tidak ada data.</p>';
    const maxVal = Math.max(...weeks.map(w => weeklyTotals[w]));

    const bars = weeks.map((satStr, i) => {
        const sat = new Date(satStr);
        const mon = new Date(sat);
        mon.setDate(sat.getDate() - 5);
        const label = `${mon.getDate()}-${sat.getDate()} ${SHORT_MONTHS[sat.getMonth()]}`;
        const val   = weeklyTotals[satStr];
        const pct   = maxVal > 0 ? (val / maxVal * 100).toFixed(1) : 0;
        const jt    = (val / 1_000_000).toFixed(1);
        return `
        <div class="trend-bar-item">
            <div class="trend-bar-value">${esc(jt)}jt</div>
            <div class="trend-bar-fill" style="height:${pct}%"></div>
            <div class="trend-bar-label">Mg${i + 1}<br>${esc(label)}</div>
        </div>`;
    }).join('');

    return `<div class="trend-container"><div class="trend-bars">${bars}</div></div>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. HTML ASSEMBLY
//    Composes all rendered sections into the final HTML document.
//    CSS is written to a separate style.css file so the browser can cache it.
// ═══════════════════════════════════════════════════════════════════════════

function buildHtml(rawData, pData) {
    const { sortedDates } = pData;
    const today = new Date().toISOString().split('T')[0];

    return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pembangunan Kos UM 2 Lantai</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">

        <div class="header">
            <h1>🏗️ Pembangunan Kos UM 2 Lantai</h1>
            <p>Periode: ${esc(formatDate(rawData.start_date))} - ${esc(formatDate(sortedDates[0]))}</p>
        </div>

        ${renderStats(pData)}

        <div class="content">

            <div class="section">
                <h2>📊 Breakdown per Kategori</h2>
                <div class="category-breakdown">${renderCategoryCards(pData)}</div>
            </div>

            <div class="section">
                <h2>📅 Rincian per Tanggal</h2>
                ${renderDateSections(pData, rawData)}
            </div>

            <div class="section">
                <h2>📋 List Semua Transaksi</h2>
                <div class="search-wrapper">
                    <input type="text" class="search-box" id="tx-search"
                        placeholder="🔍 Cari transaksi... (deskripsi, kategori, tanggal)"
                        oninput="filterTransactions(this.value)">
                    <div id="search-count"></div>
                </div>
                <button class="collapsible">Tampilkan / Sembunyikan Tabel</button>
                <div class="collapsible-content">
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Tanggal</th>
                                <th>Kategori</th>
                                <th>Deskripsi</th>
                                <th>Qty</th>
                                <th>Catatan</th>
                                <th>Harga Satuan</th>
                                <th>Total</th>
                                <th>Sumber Dana</th>
                            </tr>
                        </thead>
                        <tbody id="tx-table-body">${renderTransactionRows(pData)}</tbody>
                    </table>
                </div>
            </div>

            <div class="section">
                <h2>💼 Tarif Upah Standar</h2>
                ${renderWageRates(rawData)}
            </div>

            <div class="section">
                <h2>💰 Pengeluaran per Sumber Dana</h2>
                ${renderFundingSourceBreakdown(pData)}
            </div>

            <div class="section">
                <h2>📅 Summary Gajian Mingguan</h2>
                ${renderWeeklyPayroll(pData, rawData)}
            </div>

            <div class="section">
                <h2>👥 Daftar Pekerja & Absensi</h2>
                ${renderWorkersList(pData, rawData)}
            </div>

        </div>

        <div style="padding:0 40px 40px 40px;">
            <h2 style="color:#333;margin-bottom:20px;padding-bottom:10px;border-bottom:3px solid #667eea;">
                📈 Tren Pengeluaran Mingguan
            </h2>
            ${renderTrendChart(pData)}
        </div>

        <div class="footer">
            <p>Terakhir diupdate: ${esc(formatDate(today))} | Data otomatis tersinkronisasi</p>
        </div>

    </div>

    <button class="fab-print" onclick="window.print()">🖨️ Print / Simpan PDF</button>

    <script>
        /**
         * Generic collapsible activator.
         * Replaces four nearly-identical for-loops from the original.
         * stopPropagation prevents nested card clicks from bubbling upward.
         */
        function activateCollapsibles(selector) {
            document.querySelectorAll(selector).forEach(function (el) {
                el.addEventListener('click', function (e) {
                    e.stopPropagation();
                    this.classList.toggle('active');
                    var next = this.nextElementSibling;
                    if (next) next.classList.toggle('active');
                });
            });
        }

        activateCollapsibles('.collapsible');
        activateCollapsibles('.date-collapsible');
        activateCollapsibles('.date-inner-collapsible');
        activateCollapsibles('.category-header');
        activateCollapsibles('.wage-item-header');

        function filterTransactions(query) {
            var q    = query.toLowerCase();
            var rows = document.querySelectorAll('#tx-table-body tr');
            var visible = 0;
            rows.forEach(function (row) {
                var match = row.textContent.toLowerCase().includes(q);
                row.classList.toggle('hidden-row', !match);
                if (match) visible++;
            });
            var el = document.getElementById('search-count');
            if (el) {
                el.textContent = q
                    ? visible + ' transaksi ditemukan dari ' + rows.length + ' total'
                    : '';
            }
        }
    </script>
</body>
</html>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. FILE OUTPUT
// ═══════════════════════════════════════════════════════════════════════════

/** Stylesheet extracted from inline template string → separate cacheable file. */
const CSS = `/* style.css — Pembangunan Kos Dashboard */
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
    padding-bottom: 120px;
    min-height: 100vh;
}
.container {
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}
.header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 40px;
    text-align: center;
    border-radius: 20px 20px 0 0;
}
.header h1 { font-size: 2.5em; margin-bottom: 10px; }
.header p  { font-size: 1.2em; opacity: 0.9; }
.stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    padding: 40px;
    background: #f8f9fa;
}
.stat-card {
    background: white;
    padding: 25px;
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    text-align: center;
    transition: transform 0.3s;
}
.stat-card:hover { transform: translateY(-5px); }
.stat-card .icon  { font-size: 2.5em; margin-bottom: 10px; }
.stat-card .label { color: #666; font-size: 0.9em; margin-bottom: 5px; }
.stat-card .value { font-size: 1.8em; font-weight: bold; color: #667eea; }
.content  { padding: 40px; }
.section  { margin-bottom: 40px; }
.section h2 {
    color: #333;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 3px solid #667eea;
}
table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background: white;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    border-radius: 10px;
    overflow: hidden;
    overflow-x: auto;
    display: block;
}
table thead,
table tbody { display: table; width: 100%; table-layout: fixed; }
th { background: #667eea; color: white; padding: 15px; text-align: left; font-weight: 600; }
td { padding: 15px; border-bottom: 1px solid #eee; }
tr:hover { background: #f8f9fa; }
.category-breakdown {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
    align-items: start;
}
.category-card {
    background: white;
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    overflow: hidden;
}
.category-header { padding: 25px; cursor: pointer; transition: background 0.3s; }
.category-header:hover { background: #f8f9fa; }
.category-header h3 {
    color: #667eea;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
}
.category-header h3 .arrow    { font-size: 0.8em; transition: transform 0.3s; }
.category-header.active h3 .arrow { transform: rotate(-180deg); }
.category-header .total       { font-size: 1.8em; font-weight: bold; color: #333; margin-bottom: 10px; }
.category-header .percentage  { color: #666; font-size: 0.9em; }
.category-details { max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out; }
.category-details.active      { max-height: 2000px; transition: max-height 0.5s ease-in; }
.item-list { margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee; }
.item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 8px 0;
    color: #666;
    gap: 10px;
}
.item span   { flex: 1; word-wrap: break-word; overflow-wrap: break-word; }
.item strong { flex-shrink: 0; white-space: nowrap; text-align: right; min-width: 120px; }
.collapsible {
    background: #667eea;
    color: white;
    cursor: pointer;
    padding: 18px;
    width: 100%;
    border: none;
    text-align: left;
    outline: none;
    font-size: 1.1em;
    font-weight: 600;
    border-radius: 10px;
    transition: background 0.3s;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.collapsible:hover        { background: #764ba2; }
.collapsible::after       { content: '\\25BC'; font-size: 0.8em; transition: transform 0.3s; }
.collapsible.active::after { transform: rotate(-180deg); }
.collapsible-content      { max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out; }
.collapsible-content.active { max-height: 5000px; transition: max-height 0.5s ease-in; }
.date-collapsible {
    background: white;
    padding: 20px 25px;
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    margin-bottom: 20px;
    cursor: pointer;
    transition: box-shadow 0.3s;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.date-collapsible:hover         { box-shadow: 0 8px 20px rgba(0,0,0,0.15); }
.date-collapsible h3            { color: #667eea; font-size: 1.3em; margin: 0; }
.date-collapsible .arrow        { color: #667eea; font-size: 1.2em; transition: transform 0.3s; }
.date-collapsible.active .arrow { transform: rotate(-180deg); }
.date-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-out;
    background: white;
    border-radius: 0 0 15px 15px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    margin-top: -15px;
    margin-bottom: 20px;
}
.date-content.active { max-height: 3000px; transition: max-height 0.5s ease-in; padding: 0 25px 25px 25px; }
.date-inner-collapsible {
    background: #f8f9fa;
    padding: 12px 20px;
    border-radius: 10px;
    margin-bottom: 8px;
    cursor: pointer;
    transition: background 0.3s;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-left: 4px solid #667eea;
}
.date-inner-collapsible:hover         { background: #e8ecf1; }
.date-inner-collapsible h4            { color: #667eea; font-size: 1em; margin: 0; display: flex; align-items: center; gap: 12px; }
.date-inner-collapsible .arrow        { color: #667eea; font-size: 0.9em; transition: transform 0.3s; }
.date-inner-collapsible.active .arrow { transform: rotate(-180deg); }
.date-inner-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-out;
    background: #fdfdfd;
    border-radius: 0 0 10px 10px;
    margin-top: -4px;
    margin-bottom: 8px;
}
.date-inner-content.active { max-height: 2000px; transition: max-height 0.5s ease-in; padding: 15px 20px; }
.footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 0.9em; }
.progress-bar-track { background: #eee; border-radius: 4px; height: 6px; margin-top: 8px; overflow: hidden; }
.progress-bar-fill  { height: 100%; background: linear-gradient(90deg, #667eea, #764ba2); border-radius: 4px; }
.search-wrapper { margin-bottom: 15px; }
.search-box {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #667eea;
    border-radius: 10px;
    font-size: 1em;
    outline: none;
    transition: box-shadow 0.2s;
}
.search-box:focus { box-shadow: 0 0 0 3px rgba(102,126,234,0.2); }
tr.hidden-row     { display: none; }
#search-count     { font-size: 0.85em; color: #888; margin-top: 6px; }
.trend-container  { background: white; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); padding: 25px; margin-top: 20px; }
.trend-bars       { display: flex; align-items: flex-end; gap: 8px; height: 140px; margin-top: 15px; }
.trend-bar-item   { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 4px; height: 100%; }
.trend-bar-fill   { width: 100%; background: linear-gradient(180deg, #764ba2, #667eea); border-radius: 4px 4px 0 0; min-height: 4px; }
.trend-bar-label  { font-size: 0.68em; color: #666; text-align: center; white-space: nowrap; margin-top: 4px; }
.trend-bar-value  { font-size: 0.65em; color: #764ba2; font-weight: bold; text-align: center; }
.fab-print {
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 50px;
    padding: 14px 22px;
    font-size: 0.95em;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 5px 20px rgba(102,126,234,0.5);
    z-index: 1000;
    transition: transform 0.3s, box-shadow 0.3s;
}
.fab-print:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(102,126,234,0.6); }
@media print {
    .fab-print, button.collapsible            { display: none !important; }
    .collapsible-content, .category-details,
    .date-content, .date-inner-content        { max-height: none !important; }
    body      { background: white !important; padding: 0; }
    .container { box-shadow: none; }
}
@media (max-width: 768px) {
    .header h1          { font-size: 1.8em; }
    .stats              { grid-template-columns: 1fr; }
    .category-breakdown { grid-template-columns: 1fr; }
    table               { font-size: 0.85em; }
    th, td              { padding: 10px 5px; }
    .item strong        { min-width: 100px; font-size: 0.9em; }
    .fab-print          { bottom: 15px; right: 15px; padding: 11px 16px; font-size: 0.85em; }
}
`;

// --- Entry point ---
const rawData  = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8'));
const pData    = processData(rawData);
const outDir   = __dirname;

// fs.writeFileSync(path.join(outDir, 'style.css'),  CSS,                        'utf8'); // CSS managed externally
fs.writeFileSync(path.join(outDir, 'index.html'), buildHtml(rawData, pData),  'utf8');

console.log('✅ index.html generated successfully!');
// console.log('✅ style.css  written  successfully!'); // CSS managed externally
