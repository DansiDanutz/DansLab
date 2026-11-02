(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.DecisionHistory = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';

  const ROW_ACTIONS = { entry: ['buy', 'sell'], addition: ['support', 'wait', 'invalid', 'error'] };
  const COUNT_ACTIONS = { entry: ['buy', 'sell', 'veto_buy', 'veto_sell'], addition: ROW_ACTIONS.addition };
  const LABELS = { buy: 'Buy', sell: 'Sell', veto_buy: 'Withheld buy', veto_sell: 'Withheld sell', support: 'Support', wait: 'Wait', invalid: 'Invalid', error: 'Error' };
  const REASONS = {
    near_liquidation: 'The position was recorded near liquidation', price_not_adverse: 'Price had not moved adversely enough for an addition', prior_addition_setup_unknown: 'The prior addition setup was unavailable', same_or_better_addition_zone: 'Price was in the saved same-or-better addition zone', setup_already_used: 'The saved setup had already been used', missing_or_invalid_evidence: 'Required evidence was missing or invalid', cross_margin_risk_unavailable: 'Cross-margin risk evidence was unavailable', no_supported_trigger: 'No saved trigger supported the action', addition_approved: 'The saved addition checks recorded approval', addition_checks: 'Addition checks were recorded', addition_cooldown: 'The saved addition cooldown was active', addition_threshold_not_reached: 'The saved addition threshold was not reached', admissions_closed_stale_worker: 'Admissions were closed because the worker evidence was stale', awaiting_structure_stop: 'The lifecycle was awaiting its structure stop', baseline_withheld: 'The baseline action was withheld', binding_mismatch: 'The saved lifecycle binding did not match', building_stage_1: 'The lifecycle was recorded as building stage 1', contradicts: 'Saved evidence contradicted the proposed action', current_advice_unavailable: 'Current saved advice was unavailable', dca_evidence_unavailable: 'Addition evidence was unavailable', dca_jev_not_supported: 'The saved addition judgment did not support adding', dca_jev_unavailable: 'The saved addition judgment was unavailable', expired: 'The saved evidence had expired', final_fill_costs_pending: 'Final fill costs were still pending', flat_stage_one_quote: 'No position was open at the first stage quote', insufficient: 'Saved evidence was insufficient', invalid: 'The saved evidence was invalid', invalid_or_incomplete_input: 'The saved input was invalid or incomplete', jev_did_not_support: 'The saved judgment did not support the action', jev_evidence_unavailable: 'Saved judgment evidence was unavailable', last_stage_no_more_additions: 'The lifecycle was at its final addition stage', missing: 'Related saved evidence was missing', pinned_policy_mismatch: 'The saved pinned policy did not match', strong_technical_level: 'The saved setup identified a strong technical level', study: 'The receipt was recorded for study', structure_stop_breach: 'The saved structure stop was breached', unexpected_reversal: 'The saved evidence recorded an unexpected reversal'
  };
  const DIGEST = /^[a-f0-9]{64}$/;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const validInt = (value, min = 0) => Number.isSafeInteger(value) && value >= min;
  const validCode = value => typeof value === 'string' && /^[a-z0-9_]{1,64}$/.test(value);
  const exactCount = value => value.toLocaleString('en-US');
  const axisCount = value => value < 1000 ? String(value) : value < 1000000
    ? (value / 1000).toFixed(value < 10000 ? 1 : 0).replace(/\.0$/, '') + 'k'
    : (value / 1000000).toFixed(value < 10000000 ? 1 : 0).replace(/\.0$/, '') + 'M';

  function reasonLabel(code) {
    return REASONS[code] || String(code).replace(/_/g, ' ').replace(/^./, char => char.toUpperCase()) + ' [' + code + ']';
  }

  function normalizeResponse(value, expectedLane, expectedSnapshot = null) {
    if (!value || value.lane !== expectedLane || !ROW_ACTIONS[expectedLane]) throw Error('Invalid decision archive lane');
    if (!DIGEST.test(value.snapshot) || (expectedSnapshot && value.snapshot !== expectedSnapshot)) throw Error('Invalid decision archive snapshot');
    if (!Array.isArray(value.rows) || !validInt(value.total) || value.rows.length > 100 || !validInt(value.observed_ms, 1)
      || !['complete', 'partial', 'building'].includes(value.status)) throw Error('Invalid decision archive response');
    if (value.next_offset !== null && (!validInt(value.next_offset) || value.next_offset % 100 !== 0)) throw Error('Invalid decision archive offset');
    const rows = value.rows.map(row => {
      if (!row || !DIGEST.test(row.id) || !validInt(row.ts, 1)
        || typeof row.symbol !== 'string' || !row.symbol || !ROW_ACTIONS[expectedLane].includes(row.action)
        || !(row.stage === null || validInt(row.stage))
        || (expectedLane === 'entry' ? typeof row.vetoed !== 'boolean' : row.vetoed !== null)
        || !Array.isArray(row.reasons) || !row.reasons.every(validCode)) throw Error('Invalid decision archive row');
      return { id: String(row.id), ts: row.ts, symbol: row.symbol, action: row.action, stage: row.stage,
        vetoed: row.vetoed, reasons: row.reasons.slice() };
    });
    const keys = COUNT_ACTIONS[expectedLane], validCounts = counts => counts && typeof counts === 'object'
      && Object.keys(counts).length === keys.length && keys.every(key => validInt(counts[key]));
    if (!validCounts(value.counts) || keys.reduce((sum, key) => sum + value.counts[key], 0) !== value.total) throw Error('Invalid decision archive counts');
    const counts = Object.fromEntries(keys.map(key => [key, value.counts[key]]));
    if (!Array.isArray(value.buckets)) throw Error('Invalid decision archive buckets');
    let prior = 0;
    const bucketTotals = Object.fromEntries(keys.map(key => [key, 0]));
    const buckets = value.buckets.map(bucket => {
      if (!bucket || !validInt(bucket.ts, 1) || bucket.ts % 3600000 || bucket.ts <= prior || !validCounts(bucket.counts)) throw Error('Invalid decision archive buckets');
      prior = bucket.ts;
      for (const key of keys) bucketTotals[key] += bucket.counts[key];
      return { ts: bucket.ts, counts: Object.fromEntries(keys.map(key => [key, bucket.counts[key]])) };
    });
    if (keys.some(key => bucketTotals[key] !== counts[key])) throw Error('Invalid decision archive bucket counts');
    return { lane: expectedLane, rows, total: value.total, next_offset: value.next_offset,
      observed_ms: value.observed_ms, coverage: value.coverage && typeof value.coverage === 'object' ? value.coverage : {},
      status: value.status, counts, buckets, snapshot: value.snapshot, daily_costs: value.daily_costs };
  }

  function costMarkup(days, observed) {
    if (!Array.isArray(days)) return '<p class="note">Cost history not published yet.</p>';
    let prior = -1;
    for (const day of days) {
      if (!validInt(day.ts) || day.ts % 86400000 || day.ts <= prior || day.ts > observed) throw Error('Invalid cost day');
      prior = day.ts;
      for (const lane of ['entry', 'addition']) {
        const c = day[lane];
        if (!c || !['known','unknown','nano_usd'].every(k => validInt(c[k])) || (!c.known && c.nano_usd)) throw Error('Invalid cost amount');
      }
    }
    const amount = c => !c.known && !c.unknown ? 'No receipts' : c.known ? '$' + (c.nano_usd / 1e9).toFixed(4) + (c.unknown ? ' + unknown' : '') : 'Unknown';
    return '<p class="note">USD estimates from saved decision receipts, not the provider bill. UTC days; entry and addition costs stay separate. Missing usage is unknown, never free. Other API use and unrecorded requests are excluded. Token estimates use $0.042/M input, output free (<a href="https://docs.typesafe.ai/models" target="_blank" rel="noopener">pricing checked 2 Nov 2026</a>); historical rates, taxes and discounts may differ.</p>'
      + (days.length ? '<div class="api-cost-days">' + days.slice().reverse().map(d => '<article class="api-cost-day"><h3>' + new Date(d.ts).toISOString().slice(0,10) + ' UTC</h3>'
        + ['entry','addition'].map(lane => '<div><b>' + (lane === 'entry' ? 'Entry' : 'Addition') + ': ' + amount(d[lane]) + '</b><span>' + exactCount(d[lane].known) + ' costed · ' + exactCount(d[lane].unknown) + ' unknown</span></div>').join('')
        + '<p>Known subtotal: ' + (d.entry.known + d.addition.known ? '$' + ((d.entry.nano_usd + d.addition.nano_usd) / 1e9).toFixed(4) : 'Unavailable') + '</p></article>').join('') + '</div>' : '<p>No saved cost evidence in this snapshot.</p>');
  }

  function buildUrl(endpoint, query) {
    const url = new URL(endpoint);
    url.searchParams.set('lane', query.lane);
    url.searchParams.set('offset', String(query.offset));
    if (query.snapshot) url.searchParams.set('snapshot', query.snapshot);
    return url.toString();
  }

  function timeLabel(value) {
    return new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Bucharest', dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
  }

  function rowMarkup(row, lane) {
    const reasons = row.reasons.length ? row.reasons.map(code => REASONS[code] ? reasonLabel(code) + ' [' + code + ']' : reasonLabel(code)).join(' · ') : 'No gate reasons were saved';
    const shortId = row.id.slice(0, 8) + '…' + row.id.slice(-6);
    return '<article class="decision-history-row"><div class="decision-history-top"><strong>' + esc(row.symbol)
      + '</strong><span class="decision-action decision-action-' + esc(row.action) + '">' + esc(LABELS[row.action])
      + '</span></div><div class="decision-history-meta"><span>' + esc(timeLabel(row.ts)) + '</span><span>Stage '
      + esc(row.stage ?? 'unknown') + '</span><details class="decision-receipt-id"><summary>Receipt ' + esc(shortId)
      + '</summary><code>' + esc(row.id) + '</code></details>'
      + (lane === 'entry' && row.vetoed ? '<span class="decision-veto">Vetoed</span>' : '')
      + '</div><p><b>Saved gate evidence:</b> ' + esc(reasons) + '</p></article>';
  }

  function distributionMarkup(counts, lane) {
    if (!counts) return '<div class="empty">Aggregate counts unavailable; page rows are not presented as whole-history totals.</div>';
    const values = COUNT_ACTIONS[lane].map(key => ({ key, value: counts[key] }));
    const total = values.reduce((sum, item) => sum + item.value, 0) || 1;
    let cursor = 0;
    const colors = { buy: '#35d477', sell: '#e74c3c', veto_buy: '#d28b37', veto_sell: '#8f5b32', support: '#35d477', wait: '#d28b37', invalid: '#e74c3c', error: '#a99b9b' };
    const bars = values.map(item => {
      const width = item.value / total * 600, markup = '<rect x="' + cursor.toFixed(1) + '" y="20" width="' + width.toFixed(1)
        + '" height="24" fill="' + colors[item.key] + '"><title>' + esc(LABELS[item.key] + ': ' + exactCount(item.value)) + '</title></rect>';
      cursor += width; return markup;
    }).join('');
    return '<h3>Decision distribution</h3><p class="note">Aggregate counts for the entire published ' + lane
      + ' lane, not only this page.</p><svg viewBox="0 0 600 64" role="img" aria-label="Decision distribution for the entire published '
      + lane + ' lane">' + bars + '</svg><div class="decision-chart-legend">' + values.map(item => '<span><i style="background:'
      + colors[item.key] + '"></i>' + esc(LABELS[item.key]) + ' <b>' + exactCount(item.value) + '</b></span>').join('') + '</div>';
  }

  function binTimeline(buckets, lane) {
    if (!buckets || !buckets.length) return [];
    const hour = 3600000, spanHours = Math.floor((buckets.at(-1).ts - buckets[0].ts) / hour) + 1;
    const binHours = [1, 6, 12, 24, 48, 168, 336, 720].find(value => Math.ceil(spanHours / value) <= 40)
      || Math.ceil(spanHours / 40 / 24) * 24;
    const binMs = binHours * hour, start = Math.floor(buckets[0].ts / binMs) * binMs;
    const bins = Array.from({ length: Math.floor((buckets.at(-1).ts - start) / binMs) + 1 }, (_, index) => ({
      ts: start + index * binMs, end: start + (index + 1) * binMs,
      counts: Object.fromEntries(COUNT_ACTIONS[lane].map(key => [key, 0]))
    }));
    for (const bucket of buckets) {
      const bin = bins[Math.floor((bucket.ts - start) / binMs)];
      for (const key of COUNT_ACTIONS[lane]) bin.counts[key] += bucket.counts[key];
    }
    return bins;
  }

  function timelineMarkup(buckets, lane) {
    if (!buckets || !buckets.length) return '<div class="empty">Hourly timeline unavailable.</div>';
    const bins = binTimeline(buckets, lane), totals = bins.map(bin => COUNT_ACTIONS[lane].reduce((sum, key) => sum + bin.counts[key], 0));
    const max = Math.max(1, ...totals), left = 70, right = 592, top = 18, bottom = 126, width = (right - left) / bins.length;
    const date = ts => new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', day: '2-digit', month: 'short', year: '2-digit' }).format(new Date(ts));
    const grid = [max, Math.round(max / 2), 0].filter((value, index, all) => all.indexOf(value) === index).map(value => {
      const y = bottom - value / max * (bottom - top); return '<line x1="' + left + '" x2="' + right + '" y1="' + y.toFixed(1)
        + '" y2="' + y.toFixed(1) + '" class="decision-timeline-grid"/><text x="64" y="' + (y + 4).toFixed(1)
        + '" text-anchor="end" class="decision-timeline-label">' + axisCount(value) + '</text>'; }).join('');
    return '<h3>Saved decisions over time</h3><p class="note">Adaptive bins from UTC hourly buckets. Gaps are shown as zero.</p><svg viewBox="0 0 600 164" role="group" aria-label="Saved decisions over time">'
      + grid + bins.map((bin, index) => { const height = totals[index] / max * (bottom - top), label = date(bin.ts) + ' to ' + date(bin.end - 1) + ': ' + exactCount(totals[index]) + ' saved decisions'; return '<rect tabindex="0" role="img" aria-label="' + esc(label)
        + '" class="decision-timeline-bar" x="' + (left + index * width + 1).toFixed(1) + '" y="' + (bottom - height).toFixed(1)
        + '" width="' + Math.max(1, width - 2).toFixed(1) + '" height="' + Math.max(1, height).toFixed(1) + '"><title>' + esc(label) + '</title></rect>'; }).join('')
      + '<text x="' + left + '" y="154" class="decision-timeline-label">' + esc(date(bins[0].ts)) + '</text><text x="' + right
      + '" y="154" text-anchor="end" class="decision-timeline-label">' + esc(date(bins.at(-1).end - 1)) + '</text></svg>';
  }

  function coverageText(coverage) {
    const labels = { files: 'files', truncated_files: 'truncated', omitted_files: 'omitted', unreadable_files: 'unreadable', malformed: 'malformed', conflicts: 'conflicts' };
    const parts = Object.keys(labels).filter(key => validInt(coverage[key])).map(key => labels[key] + ' ' + coverage[key]);
    return parts.length ? 'coverage ' + parts.join(' · ') : 'coverage details unavailable';
  }

  function mount(options) {
    const doc = options.document || document, fetcher = options.fetcher || fetch, endpoint = options.endpoint, now = options.now || Date.now;
    const get = id => doc.getElementById(id), state = { lane: 'entry', offset: 0, snapshot: null, sequence: 0, current: null, phase: 'loading' };
    const statusText = data => ({ complete: 'Complete', partial: 'Partial coverage', building: 'Archive building' }[data.status]);
    function updateAges(at = now()) {
      if (state.phase !== 'ready' || !state.current) return;
      const data = state.current, first = data.total ? state.offset + 1 : 0, last = Math.min(state.offset + data.rows.length, data.total);
      const olderSnapshot = at - data.observed_ms > 300000;
      const ageLabel = olderSnapshot ? ' · Older browsing snapshot' : ' · Browsing snapshot';
      get('decision-history-status').textContent = statusText(data) + ageLabel + ' · showing ' + first + '–' + last + ' of ' + data.total
        + ' saved ' + state.lane + ' decisions · observed ' + timeLabel(data.observed_ms) + ' · ' + coverageText(data.coverage)
        + (olderSnapshot ? '. Refresh archive checks the latest publication. Snapshot age alone does not indicate publisher delay.' : '');
    }
    async function load({ clearSnapshot = false } = {}) {
      if (clearSnapshot) { state.snapshot = null; state.offset = 0; }
      const sequence = ++state.sequence;
      state.phase = 'loading';
      if (get('decision-api-costs')) get('decision-api-costs').innerHTML = '<p>Loading saved cost evidence…</p>';
      get('decision-history-status').textContent = 'Loading saved decisions…';
      get('decision-history-rows').innerHTML = '<div class="empty">Loading saved decisions…</div>';
      get('decision-distribution').innerHTML = '<div class="empty">Loading distribution…</div>';
      get('decision-timeline').innerHTML = '<div class="empty">Loading timeline…</div>';
      for (const id of ['decision-latest', 'decision-prev', 'decision-next', 'decision-oldest']) get(id).disabled = true;
      try {
        const response = await fetcher(buildUrl(endpoint, state), { cache: 'no-store', headers: { apikey: options.anonKey, Authorization: 'Bearer ' + options.anonKey } });
        const payload = await response.json();
        if (!response.ok) throw Error(payload.error || 'Decision archive unavailable');
        const data = normalizeResponse(payload, state.lane, state.snapshot);
        if (sequence !== state.sequence) return;
        if (!state.snapshot) state.snapshot = data.snapshot;
        state.current = data;
        state.phase = 'ready';
        get('decision-history-rows').innerHTML = data.rows.length ? data.rows.map(row => rowMarkup(row, state.lane)).join('')
          : '<div class="empty">No saved decisions on this page.</div>';
        get('decision-distribution').innerHTML = distributionMarkup(data.counts, state.lane);
        get('decision-timeline').innerHTML = timelineMarkup(data.buckets, state.lane);
        if (get('decision-api-costs')) get('decision-api-costs').innerHTML = costMarkup(data.daily_costs, data.observed_ms);
        updateAges();
        const oldestOffset = data.total ? Math.floor((data.total - 1) / 100) * 100 : 0;
        get('decision-latest').disabled = data.total === 0 || state.offset === 0;
        get('decision-prev').disabled = data.total === 0 || state.offset === 0;
        get('decision-next').disabled = data.total === 0 || data.next_offset === null || state.offset >= oldestOffset;
        get('decision-oldest').disabled = data.total === 0 || state.offset === oldestOffset;
      } catch (error) {
        if (sequence !== state.sequence) return;
        state.phase = 'error';
        if (get('decision-api-costs')) get('decision-api-costs').innerHTML = '<p>Cost evidence unavailable.</p>';
        get('decision-history-status').textContent = 'Decision archive unavailable: ' + error.message;
        get('decision-history-rows').innerHTML = '<div class="empty error">Saved decision history could not be loaded.</div><button type="button" id="decision-retry">Retry this page</button>';
        get('decision-retry').addEventListener('click', () => load());
        get('decision-distribution').innerHTML = '<div class="empty error">Distribution unavailable.</div>';
        get('decision-timeline').innerHTML = '<div class="empty error">Timeline unavailable.</div>';
      }
    }
    doc.querySelectorAll('[data-decision-lane]').forEach(button => button.addEventListener('click', () => {
      state.lane = button.dataset.decisionLane; state.offset = 0;
      doc.querySelectorAll('[data-decision-lane]').forEach(item => item.setAttribute('aria-selected', String(item === button)));
      load();
    }));
    get('decision-latest').addEventListener('click', () => { state.offset = 0; return load(); });
    get('decision-prev').addEventListener('click', () => { state.offset = Math.max(0, state.offset - 100); load(); });
    get('decision-next').addEventListener('click', () => { if (state.current?.next_offset !== null) { state.offset = state.current.next_offset; load(); } });
    get('decision-oldest').addEventListener('click', () => { if (state.current?.total) { state.offset = Math.floor((state.current.total - 1) / 100) * 100; return load(); } });
    get('decision-history-refresh').addEventListener('click', () => load({ clearSnapshot: true }));
    load();
    return { load, updateAges, state };
  }

  return { costMarkup, normalizeResponse, buildUrl, reasonLabel, rowMarkup, distributionMarkup, binTimeline, timelineMarkup, coverageText, mount };
});

