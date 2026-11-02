(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ViewerCharts = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';

  const RANGE_DAYS = { '24h': 1, '7d': 7, '30d': 30 };
  const RECEIPT_KEYS = {
    entry: ['buy', 'sell', 'veto_buy', 'veto_sell'],
    addition: ['support', 'wait', 'invalid', 'error']
  };
  const RECEIPT_LABELS = {
    buy: 'BUY', sell: 'SELL', veto_buy: 'VETO BUY', veto_sell: 'VETO SELL',
    support: 'SUPPORT', wait: 'WAIT', invalid: 'INVALID', error: 'ERROR'
  };

  const escapeHtml = value => String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
  const finite = value => value == null || typeof value === 'boolean'
    || (typeof value === 'string' && !value.trim()) || !Number.isFinite(Number(value)) ? null : Number(value);
  const signed = value => (value >= 0 ? '+' : '') + value.toFixed(1);
  const symbolLabel = symbol => String(symbol || 'Unknown').replace(/USDTM$/, '') || 'Unknown';
  const dateLabel = stamp => {
    const date = new Date(stamp), months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return String(date.getUTCDate()).padStart(2, '0') + ' ' + months[date.getUTCMonth()];
  };
  const axisTimeLabel = (stamp, duration) => duration <= 2 * 86400000
    ? String(new Date(stamp).getUTCHours()).padStart(2, '0') + ':'
      + String(new Date(stamp).getUTCMinutes()).padStart(2, '0') + ' UTC'
    : dateLabel(stamp);
  const exitReasonLabel = reason => String(reason || 'Exit reason unavailable')
    .replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim().replace(/^./, letter => letter.toUpperCase());

  function chartSummaries(model) {
    const equity = model.equity;
    const equitySummary = equity.length ? (() => {
      const first = equity[0].equity, latest = equity.at(-1).equity, change = latest - first;
      const low = Math.min(...equity.map(point => point.equity)), high = Math.max(...equity.map(point => point.equity));
      return equity.length + ' samples · latest ' + latest.toFixed(1) + ' USDT · ' + signed(change)
        + ' since first sample · range ' + low.toFixed(1) + '–' + high.toFixed(1) + '.';
    })() : 'No account-equity samples available in this period.';
    const trades = model.trades, wins = trades.filter(trade => trade.pnl > 0).length;
    const tradeSummary = trades.length ? (() => {
      const best = Math.max(...trades.map(trade => trade.pnl)), worst = Math.min(...trades.map(trade => trade.pnl));
      return trades.length + ' closes · ' + wins + ' positive · ' + (trades.length - wins) + ' non-positive · best '
        + signed(best) + ' · worst ' + signed(worst) + ' USDT.';
    })() : 'No closed trades in this period.';
    return { equitySummary, tradeSummary };
  }

  function filterReceipts(receipts, inside) {
    if (!receipts || typeof receipts !== 'object' || receipts.source !== 'saved_receipts'
        || !['available', 'partial', 'unavailable'].includes(receipts.status)
        || !['bounded_retained_receipts', 'full_saved_receipts'].includes(receipts.scope)) return null;
    const result = { status: receipts.status, source: receipts.source, scope: receipts.scope,
      observed_ms: Number.isSafeInteger(receipts.observed_ms) && receipts.observed_ms > 0 ? receipts.observed_ms : null };
    for (const kind of Object.keys(RECEIPT_KEYS)) {
      const part = receipts[kind], keys = RECEIPT_KEYS[kind];
      const valid = bucket => bucket && Number.isSafeInteger(bucket.ts) && bucket.ts >= 0
        && bucket.ts % 3600000 === 0 && bucket.counts && keys.every(key =>
          Number.isSafeInteger(bucket.counts[key]) && bucket.counts[key] >= 0);
      if (!part || !Array.isArray(part.buckets) || !part.buckets.every(valid)
          || new Set(part.buckets.map(bucket => bucket.ts)).size !== part.buckets.length) {
        result[kind] = null;
        continue;
      }
      const buckets = part.buckets.filter(bucket => inside(bucket.ts)).map(bucket => ({
        ts: bucket.ts,
        counts: Object.fromEntries(keys.map(key => [key, bucket.counts[key]]))
      }));
      result[kind] = { ...part, buckets, counts: Object.fromEntries(keys.map(key =>
        [key, buckets.reduce((sum, bucket) => sum + bucket.counts[key], 0)])) };
    }
    return result;
  }

  function filterChartsData(data, range = 'all', now = Date.now()) {
    if (!(range === 'all' || Object.prototype.hasOwnProperty.call(RANGE_DAYS, range))) range = 'all';
    const start = range === 'all' ? -Infinity : now - RANGE_DAYS[range] * 86400000;
    const inside = value => Number.isFinite(Number(value)) && Number(value) >= start && Number(value) <= now;
    const trades = (Array.isArray(data && data.usdt) ? data.usdt : []).map(row => ({
      closeTime: finite(row.closeTime), pnl: finite(row.pnl), symbol: String(row.symbol || ''),
      reason: String(row.reason || 'Exit reason unavailable')
    })).filter(row => row.closeTime > 0 && row.pnl != null && inside(row.closeTime))
      .sort((a, b) => a.closeTime - b.closeTime);
    const equity = (Array.isArray(data && data.equity) ? data.equity : []).map(point => ({
      ts: finite(point.ts), equity: finite(point.equity)
    })).filter(point => point.ts > 0 && point.equity != null && inside(point.ts))
      .sort((a, b) => a.ts - b.ts);
    const coins = new Map(), reasons = new Map(), hours = new Map();
    for (const trade of trades) {
      const coin = coins.get(trade.symbol) || { symbol: trade.symbol, trades: 0, wins: 0, pnl: 0 };
      coin.trades++; coin.wins += Number(trade.pnl > 0); coin.pnl += trade.pnl; coins.set(trade.symbol, coin);
      const reason = reasons.get(trade.reason) || { reason: trade.reason, count: 0, pnl: 0 };
      reason.count++; reason.pnl += trade.pnl; reasons.set(trade.reason, reason);
      const hour = new Date(trade.closeTime).getUTCHours();
      const bucket = hours.get(hour) || { hour, count: 0, pnl: 0 };
      bucket.count++; bucket.pnl += trade.pnl; hours.set(hour, bucket);
    }
    return { range, trades, equity, coins: [...coins.values()], reasons: [...reasons.values()],
      hours: [...hours.values()].sort((a, b) => a.hour - b.hour),
      receipts: filterReceipts(data && data.decision_receipts, inside) };
  }

  function barMarkup(rows, label, value, valueLabel, color) {
    if (!rows.length) return '<div class="empty">No data in this period.</div>';
    const max = Math.max(1e-9, ...rows.map(row => Math.abs(value(row) || 0)));
    return rows.map(row => {
      const amount = value(row) || 0, width = amount === 0 ? 0 : Math.max(2, Math.abs(amount) / max * 100);
      return '<div class="viewer-hbar"><span class="viewer-hlabel">' + escapeHtml(label(row))
        + '</span><span class="viewer-htrack"><span class="viewer-hfill" style="width:' + width
        + '%;background:' + color(row, amount) + '"></span></span><span class="viewer-hvalue '
        + (amount < 0 ? 'neg' : '') + '">' + escapeHtml(valueLabel(row, amount)) + '</span></div>';
    }).join('');
  }

  function divergingBars(rows, label, value, valueLabel) {
    if (!rows.length) return '<div class="empty">No data in this period.</div>';
    const ranked = rows.slice().sort((a, b) => Math.abs(value(b) || 0) - Math.abs(value(a) || 0));
    const max = Math.max(1e-9, ...ranked.map(row => Math.abs(value(row) || 0)));
    return '<div class="viewer-diverging" role="list">' + ranked.map(row => {
      const amount = value(row) || 0, width = Math.abs(amount) / max * 50;
      const detail = label(row) + ': ' + valueLabel(row, amount);
      return '<div class="viewer-diverging-row" role="listitem" tabindex="0" title="'
        + escapeHtml(detail) + '"><span class="viewer-hlabel">' + escapeHtml(label(row))
        + '</span><span class="viewer-diverging-track"><span class="viewer-zero-axis"></span><span class="viewer-diverging-fill '
        + (amount < 0 ? 'viewer-bar-negative' : amount > 0 ? 'viewer-bar-positive' : 'viewer-bar-zero')
        + '" style="width:' + width.toFixed(2) + '%;' + (amount < 0 ? 'right:50%' : 'left:50%')
        + '"></span></span><span class="viewer-hvalue ' + (amount < 0 ? 'neg' : '') + '">'
        + escapeHtml(valueLabel(row, amount)) + '</span></div>';
    }).join('') + '</div>';
  }

  function percentBars(rows, label, value, valueLabel) {
    if (!rows.length) return '<div class="empty">No data in this period.</div>';
    return rows.slice().sort((a, b) => (value(b) || 0) - (value(a) || 0)).map(row => {
      const amount = Math.max(0, Math.min(100, value(row) || 0));
      return '<div class="viewer-hbar" tabindex="0" title="' + escapeHtml(label(row) + ': ' + valueLabel(row, amount))
        + '"><span class="viewer-hlabel">' + escapeHtml(label(row))
        + '</span><span class="viewer-htrack viewer-percent-track"><span class="viewer-hfill" style="width:'
        + amount + '%;background:#68a0ff"></span></span><span class="viewer-hvalue">'
        + escapeHtml(valueLabel(row, amount)) + '</span></div>';
    }).join('');
  }

  function lineChart(points, valueKey, empty, color) {
    if (points.length < 2) return '<text x="12" y="105" fill="#91a0b4" font-size="12">' + escapeHtml(empty) + '</text>';
    const values = points.map(point => point[valueKey]), min = Math.min(...values), max = Math.max(...values);
    const low = max - min < .5 ? min - .25 : min, high = max - min < .5 ? max + .25 : max;
    const x = index => 12 + index * 616 / Math.max(1, points.length - 1);
    const y = value => 208 - (value - low) / (high - low || 1) * 196;
    const path = points.map((point, index) => (index ? 'L' : 'M') + x(index).toFixed(1) + ' ' + y(point[valueKey]).toFixed(1)).join(' ');
    return '<line x1="12" x2="628" y1="208" y2="208" stroke="#253247"/><path d="' + path
      + '" fill="none" stroke="' + color + '" stroke-width="2.5" stroke-linejoin="round"/>'
      + '<text x="14" y="14" fill="#91a0b4" font-size="11">'+high.toFixed(1)+' USDT</text><text x="14" y="202" fill="#91a0b4" font-size="11">'+low.toFixed(1)+' USDT</text>';
  }

  function equityChart(points, empty, _now, chartWidth = 640) {
    chartWidth = Math.max(240, finite(chartWidth) || 640);
    if (!points.length) return '<text x="' + (chartWidth / 2) + '" y="110" text-anchor="middle" class="viewer-empty-svg">'
      + escapeHtml(empty) + '</text>';
    const left = 58, right = chartWidth - 14, top = 26, bottom = 184;
    const values = points.map(point => point.equity), rawMin = Math.min(...values), rawMax = Math.max(...values);
    const pad = Math.max((rawMax - rawMin) * .12, .25), low = rawMin - pad, high = rawMax + pad;
    const first = points[0].ts, last = points.at(-1).ts, duration = Math.max(1, last - first);
    const x = stamp => left + (stamp - first) / duration * (right - left);
    const y = value => bottom - (value - low) / (high - low) * (bottom - top);
    const grid = Array.from({ length: 5 }, (_, index) => {
      const ratio = index / 4, py = top + ratio * (bottom - top), amount = high - ratio * (high - low);
      return '<line class="viewer-grid" x1="' + left + '" x2="' + right + '" y1="' + py.toFixed(1)
        + '" y2="' + py.toFixed(1) + '"/><text class="viewer-axis-label" x="' + (left - 8)
        + '" y="' + (py + 4).toFixed(1) + '" text-anchor="end">' + amount.toFixed(1) + '</text>';
    }).join('');
    const ticks = [first, first + duration / 2, last].map((stamp, index) => '<text class="viewer-axis-label" x="'
      + (left + index * (right - left) / 2).toFixed(1) + '" y="207" text-anchor="'
      + (index === 0 ? 'start' : index === 2 ? 'end' : 'middle') + '">' + axisTimeLabel(stamp, duration) + '</text>').join('');
    // A fixed display boundary cannot be inflated by sparse retained samples.
    const gapLimit = 6 * 3600000, runs = [[]];
    points.forEach((point, index) => {
      if (index && point.ts - points[index - 1].ts > gapLimit) runs.push([]);
      runs.at(-1).push(point);
    });
    const pathFor = run => run.map((point, index) => (index ? 'L' : 'M') + x(point.ts).toFixed(1) + ' '
      + y(point.equity).toFixed(1)).join(' ');
    const areas = runs.filter(run => run.length > 1).map(run => '<path class="viewer-area" d="' + pathFor(run)
      + ' L' + x(run.at(-1).ts).toFixed(1) + ' ' + bottom + ' L' + x(run[0].ts).toFixed(1) + ' ' + bottom + ' Z"/>').join('');
    const lines = runs.map(run => '<path class="viewer-line" d="' + pathFor(run) + '"/>').join('');
    const gaps = runs.slice(1).map((run, index) => {
      const before = runs[index].at(-1), after = run[0], hours = Math.round((after.ts - before.ts) / 3600000);
      return '<path class="viewer-line-gap" d="M' + x(before.ts).toFixed(1) + ' ' + y(before.equity).toFixed(1)
        + ' L' + x(after.ts).toFixed(1) + ' ' + y(after.equity).toFixed(1) + '"><title>No saved samples for '
        + (hours >= 48 ? Math.round(hours / 24) + ' days' : hours + ' hours') + '</title></path>';
    }).join('');
    const isolated = new Set(runs.filter(run => run.length === 1).map(run => run[0]));
    const dots = points.map(point => '<circle class="viewer-point' + (isolated.has(point) ? ' viewer-point-isolated' : '') + '" cx="' + x(point.ts).toFixed(1) + '" cy="'
      + y(point.equity).toFixed(1) + '" r="3.5" tabindex="0"><title>' + escapeHtml(dateLabel(point.ts) + ' '
      + axisTimeLabel(point.ts, 0)
      + ' · ' + point.equity.toFixed(1) + ' USDT') + '</title></circle>').join('');
    return grid + '<text class="viewer-axis-unit" x="12" y="14">USDT</text>' + areas + lines + gaps + dots + ticks;
  }

  function sequenceChart(trades, chartWidth = 640) {
    chartWidth = Math.max(240, finite(chartWidth) || 640);
    if (!trades.length) return '<text x="' + (chartWidth / 2) + '" y="110" text-anchor="middle" class="viewer-empty-svg">No closed trades in this period.</text>';
    const left = 56, right = chartWidth - 12, top = 32, bottom = 188;
    const min = Math.min(0, ...trades.map(trade => trade.pnl)), max = Math.max(0, ...trades.map(trade => trade.pnl));
    const span = max - min || 1, zero = bottom - (0 - min) / span * (bottom - top), width = (right - left) / trades.length;
    const grid = [max, 0, min].filter((value, index, values) => values.indexOf(value) === index).map(value => {
      const py = bottom - (value - min) / span * (bottom - top);
      return '<line class="viewer-grid" x1="' + left + '" x2="' + right + '" y1="' + py.toFixed(1)
        + '" y2="' + py.toFixed(1) + '"/><text class="viewer-axis-label" x="' + (left - 8) + '" y="'
        + (py + 4).toFixed(1) + '" text-anchor="end">' + signed(value) + '</text>';
    }).join('');
    return grid + '<text class="viewer-axis-unit" x="12" y="14">USDT</text><line class="viewer-sequence-axis" x1="'
      + left + '" x2="' + right + '" y1="' + zero.toFixed(1) + '" y2="' + zero.toFixed(1)
      + '"/><text class="viewer-axis-label" x="' + left + '" y="214">1</text><text class="viewer-axis-label" x="'
      + right + '" y="214" text-anchor="end">' + trades.length + ' trades</text>' + trades.map((trade, index) => {
      const py = bottom - (trade.pnl - min) / span * (bottom - top), y = Math.min(py, zero), height = Math.max(1, Math.abs(zero - py));
      return '<rect class="viewer-sequence-bar" tabindex="0" role="img" aria-label="' + escapeHtml(symbolLabel(trade.symbol) + ' ' + signed(trade.pnl) + ' USDT; trade ' + (index + 1)) + '" x="' + (left + index * width + Math.min(1, width * .1)).toFixed(1)
        + '" y="' + y.toFixed(1) + '" width="' + Math.max(.7, width - Math.min(2, width * .2)).toFixed(1)
        + '" height="' + height.toFixed(1) + '" fill="'
        + (trade.pnl >= 0 ? '#35d477' : '#ff6b63') + '"><title>' + escapeHtml(symbolLabel(trade.symbol)
        + ' ' + signed(trade.pnl) + ' USDT') + '</title></rect>';
    }).join('');
  }

  function renderReceipts(model, get) {
    const note = get('viewer-decision-note');
    if (!model.receipts || model.receipts.status === 'unavailable') {
      note.textContent = 'Saved decision receipts unavailable; this does not mean no AI activity.';
      get('viewer-entry-decisions').innerHTML = get('viewer-addition-decisions').innerHTML = '<div class="empty">Receipt coverage unavailable.</div>';
      return;
    }
    note.textContent = 'Saved receipts only · UTC hourly buckets · ' + (model.receipts.status === 'partial'
      ? 'coverage has gaps.' : 'retained scan completed; earlier history may still be missing.');
    for (const kind of Object.keys(RECEIPT_KEYS)) {
      const part = model.receipts[kind], target = get('viewer-' + kind + '-decisions');
      if (!part) { target.innerHTML = '<div class="empty">Receipt coverage unavailable or invalid.</div>'; continue; }
      const rows = RECEIPT_KEYS[kind].map(key => ({ key, count: part.counts[key] }));
      target.innerHTML = rows.some(row => row.count > 0) ? barMarkup(rows, row => RECEIPT_LABELS[row.key], row => row.count,
        row => String(row.count), row => ['sell', 'invalid', 'error'].includes(row.key) ? '#ff6b63'
          : row.key.includes('veto') || row.key === 'wait' ? '#ffb52e' : '#35d477')
        : '<div class="empty">No receipts observed in this period; not proof of no AI activity.</div>';
    }
  }

  function renderReceiptAge(model, get, now = Date.now()) {
    const target = get('viewer-decision-age'), stamp = model.receipts && model.receipts.observed_ms;
    if (!target) return;
    if (!Number.isSafeInteger(stamp) || stamp <= 0 || now - stamp < -5000) {
      target.textContent = 'Receipt publication timestamp unavailable.'; return;
    }
    const seconds = Math.max(0, Math.round((now - stamp) / 1000));
    const age = seconds < 60 ? seconds + 's old' : seconds < 3600 ? Math.round(seconds / 60) + 'm old' : Math.round(seconds / 3600) + 'h old';
    target.textContent = 'Receipt publication · ' + (seconds > 300 ? 'STALE · ' : '') + age;
  }

  function render(data, range = 'all', doc = document, now = Date.now()) {
    const get = id => doc.getElementById(id), model = filterChartsData(data, range, now);
    get('viewer-chart-note').textContent = 'USDT-settled reporting-cohort closes. Account equity is a separate account-wide series. UTC hour buckets. '
      + (range === 'all' ? 'All published history shown.' : 'Rolling period ending now.');
    const summaries = chartSummaries(model);
    get('viewer-equity-note').textContent = summaries.equitySummary;
    get('viewer-trade-note').textContent = summaries.tradeSummary;
    const equityTarget = get('viewer-equity-chart'), equityWidth = Math.max(240, Math.round(finite(equityTarget.clientWidth) || 640));
    if (equityTarget.setAttribute) equityTarget.setAttribute('viewBox', '0 0 ' + equityWidth + ' 220');
    equityTarget.innerHTML = equityChart(model.equity, 'No account-equity samples in this period.', now, equityWidth);
    get('viewer-coin-pnl').innerHTML = divergingBars(model.coins, row => symbolLabel(row.symbol), row => row.pnl,
      row => signed(row.pnl) + ' USDT');
    const sequenceTarget = get('viewer-trade-sequence'), sequenceWidth = Math.max(240, Math.round(finite(sequenceTarget.clientWidth) || 640));
    if (sequenceTarget.setAttribute) sequenceTarget.setAttribute('viewBox', '0 0 ' + sequenceWidth + ' 220');
    sequenceTarget.innerHTML = sequenceChart(model.trades, sequenceWidth);
    get('viewer-exit-reasons').innerHTML = barMarkup(model.reasons.slice().sort((a, b) => b.count - a.count), row => exitReasonLabel(row.reason), row => row.count,
      row => row.count + ' · ' + signed(row.pnl) + ' USDT', () => '#ffb52e');
    renderReceipts(model, get);
    renderReceiptAge(model, get, now);
    get('viewer-coin-activity').innerHTML = barMarkup(model.coins.slice().sort((a, b) => b.trades - a.trades), row => symbolLabel(row.symbol), row => row.trades,
      row => row.trades + ' trades', () => '#68a0ff');
    get('viewer-hour-pnl').innerHTML = divergingBars(model.hours, row => String(row.hour).padStart(2, '0') + ':00 UTC', row => row.pnl,
      row => signed(row.pnl) + ' USDT · ' + row.count + ' tr');
    get('viewer-winrate').innerHTML = percentBars(model.coins.map(row => ({ ...row,
      rate: row.trades ? Math.round(row.wins / row.trades * 100) : 0 })), row => symbolLabel(row.symbol),
      row => row.rate, row => row.rate + '% · ' + row.wins + '/' + row.trades);
    return model;
  }

  function mount(data, doc = document) {
    let range = 'all', current = data, model;
    const buttons = [...doc.querySelectorAll('[data-viewer-chart-range]')];
    const draw = () => (model = render(current, range, doc));
    buttons.forEach(button => button.addEventListener('click', () => {
      range = button.dataset.viewerChartRange;
      buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      draw();
    }));
    draw();
    const equityTarget = doc.getElementById('viewer-equity-chart');
    const observer = typeof ResizeObserver === 'function' && equityTarget ? new ResizeObserver(() => {
      if (equityTarget.clientWidth > 0) draw();
    }) : null;
    if (observer) observer.observe(equityTarget);
    return { render: draw, update(next) { current = next; return draw(); },
      updateAges(now = Date.now()) { renderReceiptAge(model, id => doc.getElementById(id), now); },
      disconnect() { if (observer) observer.disconnect(); } };
  }

  return { escapeHtml, filterReceipts, filterChartsData, chartSummaries, barMarkup, divergingBars, percentBars,
    lineChart, equityChart, sequenceChart, exitReasonLabel, renderReceiptAge, render, mount };
});

