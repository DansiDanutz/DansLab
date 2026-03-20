#!/usr/bin/env node
// ============================================================================
// OpenClaw Collector Daemon
// ============================================================================
// Runs on each machine, collects system metrics, watches logs, and sends
// everything to Supabase. Install as a systemd service (Linux), launchd
// (macOS), or Windows Service.
//
// Usage:
//   openclaw-collector --source dexter
//   OPENCLAW_SOURCE=mac-studio openclaw-collector
// ============================================================================

import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import { OpenClawLogger } from './logger';
import { collectMetrics, getSystemInfo } from './system-info';
import { CollectorConfig, SourceType } from './types';

const VERSION = '1.0.0';

// ----------------------------------------------------------
// Config from env vars and CLI args
// ----------------------------------------------------------

function getConfig(): CollectorConfig {
  const args = process.argv.slice(2);
  const getArg = (flag: string): string | undefined => {
    const idx = args.indexOf(flag);
    return idx >= 0 ? args[idx + 1] : undefined;
  };

  const sourceName = getArg('--source') || process.env.OPENCLAW_SOURCE || os.hostname().toLowerCase().replace(/[^a-z0-9-]/g, '-');
  const sourceType = (getArg('--type') || process.env.OPENCLAW_SOURCE_TYPE || detectSourceType()) as SourceType;

  return {
    supabaseUrl: getArg('--url') || process.env.OPENCLAW_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    supabaseKey: getArg('--key') || process.env.OPENCLAW_SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    sourceName,
    sourceType,
    metricsIntervalMs: parseInt(getArg('--metrics-interval') || process.env.OPENCLAW_METRICS_INTERVAL || '30000'),
    heartbeatIntervalMs: parseInt(getArg('--heartbeat-interval') || process.env.OPENCLAW_HEARTBEAT_INTERVAL || '60000'),
    watchProcesses: (getArg('--watch-processes') || process.env.OPENCLAW_WATCH_PROCESSES || '').split(',').filter(Boolean),
    watchPaths: (getArg('--watch-paths') || process.env.OPENCLAW_WATCH_PATHS || '').split(',').filter(Boolean),
    captureSystemLogs: (getArg('--system-logs') || process.env.OPENCLAW_SYSTEM_LOGS) !== 'false',
    batchSize: 50,
    flushIntervalMs: 5000,
    maxRetries: 3,
    consoleOutput: true,
  };
}

function detectSourceType(): SourceType {
  const platform = process.platform;
  if (platform === 'linux') return 'droplet';
  if (platform === 'darwin') return 'desktop';
  if (platform === 'win32') return 'laptop';
  return 'server';
}

// ----------------------------------------------------------
// Log file watchers
// ----------------------------------------------------------

class LogFileWatcher {
  private watchers: fs.FSWatcher[] = [];
  private filePositions: Map<string, number> = new Map();

  constructor(private logger: OpenClawLogger) {}

  watchPath(filePath: string, service?: string) {
    if (!fs.existsSync(filePath)) {
      this.logger.warn(`Watch path does not exist: ${filePath}`, { category: 'system' });
      return;
    }

    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      this.watchDirectory(filePath, service);
    } else {
      this.watchFile(filePath, service);
    }
  }

  private watchDirectory(dirPath: string, service?: string) {
    try {
      // Seed file positions for existing files so the first change event
      // only reads new content instead of replaying the entire file.
      for (const entry of fs.readdirSync(dirPath)) {
        if (entry.endsWith('.log') || entry.endsWith('.txt')) {
          const fullPath = path.join(dirPath, entry);
          try {
            const stat = fs.statSync(fullPath);
            if (stat.isFile()) this.filePositions.set(fullPath, stat.size);
          } catch { /* ignore individual file stat errors */ }
        }
      }

      const watcher = fs.watch(dirPath, (eventType, filename) => {
        if (filename && (filename.endsWith('.log') || filename.endsWith('.txt'))) {
          const fullPath = path.join(dirPath, filename);
          if (eventType === 'change') {
            this.readNewLines(fullPath, service);
          }
        }
      });
      this.watchers.push(watcher);
      this.logger.info(`Watching directory: ${dirPath}`, { category: 'system' });
    } catch (err) {
      this.logger.logError(`Failed to watch directory: ${dirPath}`, err, { category: 'system' });
    }
  }

  private watchFile(filePath: string, service?: string) {
    // Start from end of file
    try {
      const stat = fs.statSync(filePath);
      this.filePositions.set(filePath, stat.size);
    } catch { /* ignore */ }

    try {
      const watcher = fs.watch(filePath, (eventType) => {
        if (eventType === 'change') {
          this.readNewLines(filePath, service);
        }
      });
      this.watchers.push(watcher);
      this.logger.info(`Watching file: ${filePath}`, { category: 'system' });
    } catch (err) {
      this.logger.logError(`Failed to watch file: ${filePath}`, err, { category: 'system' });
    }
  }

  private readNewLines(filePath: string, service?: string) {
    try {
      const stat = fs.statSync(filePath);
      const lastPos = this.filePositions.get(filePath) || 0;

      if (stat.size <= lastPos) {
        // File was truncated — reset position
        this.filePositions.set(filePath, 0);
        return;
      }

      const stream = fs.createReadStream(filePath, { start: lastPos, encoding: 'utf8' });
      let buffer = '';

      stream.on('data', (chunk: string | Buffer) => {
        buffer += chunk.toString();
      });

      stream.on('end', () => {
        this.filePositions.set(filePath, stat.size);
        const lines = buffer.split('\n').filter(l => l.trim());
        for (const line of lines) {
          const parsed = this.parseLine(line);
          this.logger.log(parsed.level, parsed.message, {
            service: service || path.basename(filePath, '.log'),
            category: 'application',
            data: { file: filePath, raw: line },
          });
        }
      });
    } catch { /* ignore read errors */ }
  }

  private parseLine(line: string): { level: 'debug' | 'info' | 'warn' | 'error' | 'fatal'; message: string } {
    const lower = line.toLowerCase();
    if (lower.includes('fatal') || lower.includes('panic') || lower.includes('critical')) {
      return { level: 'fatal', message: line };
    }
    if (lower.includes('error') || lower.includes('err]') || lower.includes('exception')) {
      return { level: 'error', message: line };
    }
    if (lower.includes('warn') || lower.includes('warning')) {
      return { level: 'warn', message: line };
    }
    if (lower.includes('debug') || lower.includes('trace')) {
      return { level: 'debug', message: line };
    }
    return { level: 'info', message: line };
  }

  destroy() {
    for (const w of this.watchers) {
      try { w.close(); } catch { /* ignore */ }
    }
    this.watchers = [];
  }
}

// ----------------------------------------------------------
// System log capture (journalctl on Linux, log stream on macOS)
// ----------------------------------------------------------

class SystemLogCapture {
  private process: ReturnType<typeof import('child_process').spawn> | null = null;

  constructor(private logger: OpenClawLogger) {}

  start() {
    const { spawn } = require('child_process');

    if (process.platform === 'linux') {
      // Follow journalctl
      this.process = spawn('journalctl', ['-f', '--no-pager', '-o', 'short', '-n', '0', '-p', 'warning'], {
        stdio: ['ignore', 'pipe', 'pipe'],
      });
    } else if (process.platform === 'darwin') {
      // macOS unified log (only errors/faults)
      this.process = spawn('log', ['stream', '--level', 'error', '--style', 'compact'], {
        stdio: ['ignore', 'pipe', 'pipe'],
      });
    } else {
      // Windows — skip system logs for now
      return;
    }

    if (this.process?.stdout) {
      let buffer = '';
      this.process.stdout.on('data', (data: string | Buffer) => {
        buffer += data.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (line.trim()) {
            const lower = line.toLowerCase();
            const level = lower.includes('error') || lower.includes('fault') ? 'error' : 'warn';
            this.logger.log(level, line.trim(), { category: 'system', subcategory: 'os' });
          }
        }
      });
    }

    this.process?.on('error', () => {
      this.logger.warn('System log capture not available', { category: 'system' });
    });

    this.logger.info('System log capture started', { category: 'system' });
  }

  stop() {
    if (this.process) {
      this.process.kill();
      this.process = null;
    }
  }
}

// ----------------------------------------------------------
// Process watcher — monitors specific processes
// ----------------------------------------------------------

class ProcessWatcher {
  private interval: ReturnType<typeof setInterval> | null = null;
  private knownDown: Set<string> = new Set();

  constructor(
    private logger: OpenClawLogger,
    private processNames: string[]
  ) {}

  start(intervalMs = 30000) {
    if (this.processNames.length === 0) return;

    this.interval = setInterval(() => this.check(), intervalMs);
    this.check(); // Initial check
    this.logger.info(`Watching processes: ${this.processNames.join(', ')}`, { category: 'system' });
  }

  private check() {
    const { execSync } = require('child_process');

    for (const name of this.processNames) {
      try {
        let isRunning = false;
        if (process.platform === 'win32') {
          const output = execSync(`tasklist /FI "IMAGENAME eq ${name}*" /NH`, { encoding: 'utf8', timeout: 5000 });
          isRunning = !output.includes('No tasks');
        } else {
          const output = execSync(`pgrep -f "${name}" 2>/dev/null || true`, { encoding: 'utf8', timeout: 5000 });
          isRunning = output.trim().length > 0;
        }

        if (!isRunning && !this.knownDown.has(name)) {
          this.knownDown.add(name);
          this.logger.error(`Process down: ${name}`, {
            category: 'system',
            subcategory: 'process',
            service: name,
            tags: ['process-down'],
          });
        } else if (isRunning && this.knownDown.has(name)) {
          this.knownDown.delete(name);
          this.logger.info(`Process recovered: ${name}`, {
            category: 'system',
            subcategory: 'process',
            service: name,
            tags: ['process-recovered'],
          });
        }
      } catch { /* ignore check errors */ }
    }
  }

  stop() {
    if (this.interval) clearInterval(this.interval);
  }
}

// ----------------------------------------------------------
// Main daemon
// ----------------------------------------------------------

async function main() {
  const config = getConfig();

  if (!config.supabaseUrl || !config.supabaseKey) {
    console.error('❌ Missing Supabase credentials. Set OPENCLAW_SUPABASE_URL and OPENCLAW_SUPABASE_KEY');
    console.error('   Or use: openclaw-collector --url <url> --key <key> --source <name>');
    process.exit(1);
  }

  console.log(`
╔══════════════════════════════════════════════════╗
║         🐾 OpenClaw Collector v${VERSION}           ║
╠══════════════════════════════════════════════════╣
║  Source:    ${config.sourceName.padEnd(37)}║
║  Type:      ${(config.sourceType || 'auto').padEnd(37)}║
║  Metrics:   every ${String(config.metricsIntervalMs! / 1000).padEnd(31)}s║
║  Heartbeat: every ${String(config.heartbeatIntervalMs! / 1000).padEnd(31)}s║
╚══════════════════════════════════════════════════╝
  `);

  // Create logger
  const logger = new OpenClawLogger(config);
  const transport = logger.getTransport();

  // Register source with system info
  const sysInfo = getSystemInfo();
  await transport.registerSource({
    name: config.sourceName,
    display_name: config.sourceName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    source_type: config.sourceType,
    active: true,
    ...sysInfo,
    last_seen_at: new Date().toISOString(),
    last_heartbeat_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  // Start session
  const sessionId = await transport.startSession(config.sourceName, VERSION);
  logger.setSessionId(sessionId);
  logger.info('Collector started', { category: 'system', data: { version: VERSION, config: { ...config, supabaseKey: '***' } } });

  // Metrics collection
  const metricsInterval = setInterval(async () => {
    try {
      const metrics = collectMetrics(config.sourceName);
      await transport.sendMetrics(metrics);

      // Log warnings for high resource usage
      if (metrics.cpu_percent && metrics.cpu_percent > 90) {
        logger.warn(`High CPU usage: ${metrics.cpu_percent}%`, { category: 'performance', subcategory: 'cpu', tags: ['high-cpu'] });
      }
      if (metrics.memory_percent && metrics.memory_percent > 90) {
        logger.warn(`High memory usage: ${metrics.memory_percent}%`, { category: 'performance', subcategory: 'memory', tags: ['high-memory'] });
      }
      if (metrics.disk_percent && metrics.disk_percent > 90) {
        logger.warn(`High disk usage: ${metrics.disk_percent}%`, { category: 'performance', subcategory: 'disk', tags: ['high-disk'] });
      }
    } catch (err) {
      logger.logError('Failed to collect metrics', err, { category: 'system' });
    }
  }, config.metricsIntervalMs);

  // Heartbeat
  const heartbeatInterval = setInterval(async () => {
    try {
      await transport.heartbeat(config.sourceName);
    } catch (err) {
      logger.logError('Heartbeat failed', err, { category: 'system' });
    }
  }, config.heartbeatIntervalMs);

  // File watchers
  const fileWatcher = new LogFileWatcher(logger);
  for (const watchPath of config.watchPaths || []) {
    // Split on the *last* colon so Windows paths like C:\logs\app.log:myservice work.
    // If there's no colon (or only the drive letter colon), the whole string is the path.
    const lastColon = watchPath.lastIndexOf(':');
    let filePath: string;
    let service: string | undefined;
    // On Windows, a single colon at index 1 is a drive letter (e.g. C:), not a separator
    if (lastColon > 1) {
      filePath = watchPath.substring(0, lastColon);
      service = watchPath.substring(lastColon + 1) || undefined;
    } else {
      filePath = watchPath;
    }
    fileWatcher.watchPath(filePath, service);
  }

  // System log capture
  const sysLogCapture = new SystemLogCapture(logger);
  if (config.captureSystemLogs) {
    sysLogCapture.start();
  }

  // Process watcher
  const processWatcher = new ProcessWatcher(logger, config.watchProcesses || []);
  processWatcher.start();

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`Shutting down (${signal})`, { category: 'system' });

    clearInterval(metricsInterval);
    clearInterval(heartbeatInterval);
    fileWatcher.destroy();
    sysLogCapture.stop();
    processWatcher.stop();

    const stats = logger.getStats();
    await transport.endSession(sessionId, {
      logCount: stats.logCount,
      errorCount: stats.errorCount,
      bytesSent: stats.transport.bytesEstimate,
    });

    await logger.destroy();
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('uncaughtException', async (err) => {
    logger.fatal(`Uncaught exception: ${err.message}`, {
      category: 'system',
      error_name: err.name,
      error_stack: err.stack,
    });
    try {
      await logger.flush();
      await transport.endSession(sessionId, {
        logCount: logger.getStats().logCount,
        errorCount: logger.getStats().errorCount,
        bytesSent: logger.getStats().transport.bytesEstimate,
      });
      // Mark session as crashed (endSession sets 'ended', override to 'crashed')
      await transport.getClient().from('log_sessions').update({ status: 'crashed' }).eq('id', sessionId);
    } catch { /* best-effort — we are crashing */ }
    process.exit(1);
  });
  process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled rejection: ${reason}`, { category: 'system' });
  });

  // Initial metrics
  const metrics = collectMetrics(config.sourceName);
  await transport.sendMetrics(metrics);
  logger.info('Initial metrics collected', { category: 'system', data: {
    cpu: `${metrics.cpu_percent}%`,
    memory: `${metrics.memory_percent}%`,
    disk: `${metrics.disk_percent}%`,
    uptime: `${Math.round((metrics.uptime_seconds || 0) / 3600)}h`,
  }});

  // Keep alive
  logger.info('Collector running — press Ctrl+C to stop', { category: 'system' });
}

main().catch((err) => {
  console.error('❌ Failed to start collector:', err);
  process.exit(1);
});
