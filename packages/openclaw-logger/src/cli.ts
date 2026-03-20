#!/usr/bin/env node
// ============================================================================
// OpenClaw Logger — CLI
// ============================================================================
// Query, tail, and manage logs from any machine.
//
// Usage:
//   openclaw-log tail                     # Live tail all sources
//   openclaw-log tail --source dexter     # Tail specific source
//   openclaw-log query --level error      # Query errors
//   openclaw-log search "connection"      # Full-text search
//   openclaw-log stats                    # Show statistics
//   openclaw-log sources                  # List all sources
//   openclaw-log metrics                  # Show latest metrics
//   openclaw-log metrics --source dexter  # Show metrics for source
// ============================================================================

import { SupabaseTransport } from './transport';
import { LOG_LEVEL_COLORS, RESET_COLOR, LogEntry } from './types';

function getTransport(): SupabaseTransport {
  const url = process.env.OPENCLAW_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.OPENCLAW_SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!url || !key) {
    console.error('❌ Missing Supabase credentials.');
    console.error('   Set OPENCLAW_SUPABASE_URL and OPENCLAW_SUPABASE_KEY');
    process.exit(1);
  }

  return new SupabaseTransport(url, key);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';
  const flags: Record<string, string> = {};
  const positional: string[] = [];

  for (let i = 1; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].replace(/^--/, '');
      flags[key] = args[i + 1] || 'true';
      i++;
    } else {
      positional.push(args[i]);
    }
  }

  return { command, flags, positional };
}

function formatLogEntry(entry: (LogEntry & { rank?: number; log_timestamp?: string })): string {
  const level = entry.level || 'info';
  const color = LOG_LEVEL_COLORS[level as keyof typeof LOG_LEVEL_COLORS] || '';
  // search_logs returns the column aliased as log_timestamp, direct queries use timestamp
  const ts = (entry.log_timestamp || entry.timestamp || '').substring(0, 19).replace('T', ' ');
  const src = entry.source_name || 'unknown';
  const svc = entry.service ? `[${entry.service}] ` : '';
  const dur = entry.duration_ms ? ` (${entry.duration_ms}ms)` : '';

  return `${color}${ts} [${level.toUpperCase().padEnd(5)}]${RESET_COLOR} \x1b[90m[${src}]${RESET_COLOR} ${svc}${entry.message}${dur}`;
}

async function cmdTail(transport: SupabaseTransport, flags: Record<string, string>) {
  console.log('🐾 OpenClaw Log Tail — Ctrl+C to stop\n');

  const filter: { source?: string; level?: string } = {};
  if (flags.source) filter.source = flags.source;
  if (flags.level) filter.level = flags.level;

  // Show last N logs first
  const recent = await transport.queryLogs({
    source: flags.source,
    level: flags.level,
    limit: parseInt(flags.lines || '20'),
  });

  if (recent && recent.length > 0) {
    console.log(`--- Last ${recent.length} logs ---`);
    for (const entry of recent.reverse()) {
      console.log(formatLogEntry(entry));
    }
    console.log('--- Live tail ---\n');
  }

  // Subscribe to real-time
  const unsubscribe = transport.subscribeToLogs(
    (entry) => console.log(formatLogEntry(entry)),
    filter
  );

  process.on('SIGINT', () => {
    unsubscribe();
    process.exit(0);
  });

  // Keep alive
  await new Promise(() => {});
}

async function cmdQuery(transport: SupabaseTransport, flags: Record<string, string>) {
  const results = await transport.queryLogs({
    source: flags.source,
    level: flags.level,
    category: flags.category,
    service: flags.service,
    from: flags.from,
    to: flags.to,
    limit: parseInt(flags.limit || '50'),
    tags: flags.tags?.split(','),
  });

  if (!results || results.length === 0) {
    console.log('No logs found.');
    return;
  }

  console.log(`Found ${results.length} log entries:\n`);
  for (const entry of results) {
    console.log(formatLogEntry(entry));
    if (entry.error_stack) {
      console.log(`  \x1b[90m${entry.error_stack.split('\n').slice(0, 3).join('\n  ')}${RESET_COLOR}`);
    }
  }
}

async function cmdSearch(transport: SupabaseTransport, flags: Record<string, string>, positional: string[]) {
  const query = positional.join(' ');
  if (!query) {
    console.error('Usage: openclaw-log search <query> [--source <name>] [--level <level>]');
    process.exit(1);
  }

  console.log(`🔍 Searching for: "${query}"\n`);

  const results = await transport.queryLogs({
    search: query,
    source: flags.source,
    level: flags.level,
    limit: parseInt(flags.limit || '50'),
  });

  if (!results || results.length === 0) {
    console.log('No results found.');
    return;
  }

  console.log(`Found ${results.length} matches:\n`);
  for (const entry of results) {
    console.log(formatLogEntry(entry));
  }
}

async function cmdStats(transport: SupabaseTransport, flags: Record<string, string>) {
  const hours = parseInt(flags.hours || '24');
  const stats = await transport.getLogStats(flags.source, hours);

  if (!stats || stats.length === 0) {
    console.log('No stats available.');
    return;
  }

  console.log(`📊 Log Statistics (last ${hours}h)\n`);
  console.log('┌─────────────────┬──────────┬───────┬───────┬───────┬───────┬───────┬───────────┐');
  console.log('│ Source          │ Total    │ Debug │ Info  │ Warn  │ Error │ Fatal │ Err/Hour  │');
  console.log('├─────────────────┼──────────┼───────┼───────┼───────┼───────┼───────┼───────────┤');

  for (const s of stats) {
    console.log(
      `│ ${String(s.source).padEnd(15)} │ ${String(s.total_logs).padStart(8)} │ ${String(s.debug_count).padStart(5)} │ ${String(s.info_count).padStart(5)} │ ${String(s.warn_count).padStart(5)} │ ${String(s.error_count).padStart(5)} │ ${String(s.fatal_count).padStart(5)} │ ${String(s.avg_errors_per_hour).padStart(9)} │`
    );
  }

  console.log('└─────────────────┴──────────┴───────┴───────┴───────┴───────┴───────┴───────────┘');
}

async function cmdSources(transport: SupabaseTransport) {
  const sources = await transport.getSources();

  if (!sources || sources.length === 0) {
    console.log('No sources registered.');
    return;
  }

  console.log('🖥️  Registered Sources\n');
  console.log('┌──────────────────┬──────────┬──────────┬──────┬──────┬──────┬────────────┬────────────────┐');
  console.log('│ Name             │ Type     │ Status   │ CPU% │ Mem% │ Disk │ Recent Err │ Last Seen      │');
  console.log('├──────────────────┼──────────┼──────────┼──────┼──────┼──────┼────────────┼────────────────┤');

  for (const s of sources) {
    const status = s.is_online ? '\x1b[32m● online\x1b[0m' : '\x1b[31m○ offline\x1b[0m';
    const lastSeen = s.seconds_since_seen != null
      ? (s.seconds_since_seen < 60 ? 'just now' : `${Math.round(s.seconds_since_seen / 60)}m ago`)
      : 'never';

    console.log(
      `│ ${(s.emoji + ' ' + s.name).padEnd(16)} │ ${String(s.source_type).padEnd(8)} │ ${status.padEnd(19)} │ ${String(s.cpu_percent ?? '-').padStart(4)} │ ${String(s.memory_percent ?? '-').padStart(4)} │ ${String(s.disk_percent ?? '-').padStart(4)} │ ${String(s.recent_errors ?? 0).padStart(10)} │ ${lastSeen.padEnd(14)} │`
    );
  }

  console.log('└──────────────────┴──────────┴──────────┴──────┴──────┴──────┴────────────┴────────────────┘');
}

async function cmdMetrics(transport: SupabaseTransport, flags: Record<string, string>) {
  const metrics = await transport.getLatestMetrics(flags.source);

  if (!metrics || metrics.length === 0) {
    console.log('No metrics available.');
    return;
  }

  for (const m of metrics) {
    console.log(`\n${m.emoji || '🖥️'} ${m.display_name || m.source_name} (${m.os || 'unknown'} ${m.os_version || ''})`);
    console.log('─'.repeat(50));
    console.log(`  CPU:      ${m.cpu_percent ?? '-'}%  (load: ${m.cpu_load_1m ?? '-'} / ${m.cpu_load_5m ?? '-'} / ${m.cpu_load_15m ?? '-'})`);
    console.log(`  Memory:   ${m.memory_used_mb ?? '-'}MB / ${m.memory_total_mb ?? '-'}MB (${m.memory_percent ?? '-'}%)`);
    console.log(`  Swap:     ${m.swap_used_mb ?? '-'}MB / ${m.swap_total_mb ?? '-'}MB (${m.swap_percent ?? '-'}%)`);
    console.log(`  Disk:     ${m.disk_used_gb ?? '-'}GB / ${m.disk_total_gb ?? '-'}GB (${m.disk_percent ?? '-'}%)`);
    console.log(`  Network:  ${m.network_connections ?? '-'} connections`);
    console.log(`  Procs:    ${m.process_count ?? '-'} total, ${m.zombie_count ?? 0} zombie`);
    if (m.gpu_percent != null) {
      console.log(`  GPU:      ${m.gpu_percent}% util, ${m.gpu_memory_percent}% mem, ${m.gpu_temp_celsius}°C`);
    }
    if (m.cpu_temp_celsius != null) {
      console.log(`  CPU Temp: ${m.cpu_temp_celsius}°C`);
    }
    console.log(`  Uptime:   ${Math.round((m.uptime_seconds || 0) / 3600)}h`);

    if (m.top_processes && (m.top_processes as any[]).length > 0) {
      console.log(`  Top Procs:`);
      for (const p of (m.top_processes as any[]).slice(0, 5)) {
        console.log(`    - ${p.name} (PID ${p.pid}): CPU ${p.cpu}%, MEM ${p.memory}%`);
      }
    }
  }
}

function showHelp() {
  console.log(`
🐾 OpenClaw Logger CLI v1.0.0

Usage: openclaw-log <command> [options]

Commands:
  tail                    Live tail logs (real-time)
  query                   Query historical logs
  search <text>           Full-text search logs
  stats                   Show log statistics
  sources                 List registered sources
  metrics                 Show system metrics

Options:
  --source <name>         Filter by source (e.g. dexter, mac-studio)
  --level <level>         Filter by level (debug/info/warn/error/fatal)
  --category <cat>        Filter by category
  --service <svc>         Filter by service name
  --from <iso-date>       Start time (ISO 8601)
  --to <iso-date>         End time (ISO 8601)
  --limit <n>             Max results (default: 50)
  --hours <n>             Time range in hours (for stats, default: 24)
  --lines <n>             Initial lines for tail (default: 20)
  --tags <a,b,c>          Filter by tags (comma-separated)

Environment:
  OPENCLAW_SUPABASE_URL   Supabase project URL
  OPENCLAW_SUPABASE_KEY   Supabase service role key
`);
}

// ----------------------------------------------------------
// Main
// ----------------------------------------------------------

async function main() {
  const { command, flags, positional } = parseArgs();
  const transport = command !== 'help' ? getTransport() : null!;

  try {
    switch (command) {
      case 'tail': await cmdTail(transport, flags); break;
      case 'query': await cmdQuery(transport, flags); break;
      case 'search': await cmdSearch(transport, flags, positional); break;
      case 'stats': await cmdStats(transport, flags); break;
      case 'sources': await cmdSources(transport); break;
      case 'metrics': await cmdMetrics(transport, flags); break;
      case 'help':
      default: showHelp(); break;
    }
  } catch (err) {
    console.error('❌ Error:', err instanceof Error ? err.message : err);
    process.exit(1);
  }

  // CLI commands (except tail) should exit after completing
  if (command !== 'tail') {
    await transport.destroy();
    process.exit(0);
  }
}

main();
