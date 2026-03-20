// ============================================================================
// OpenClaw Logger — Main SDK
// ============================================================================
// Usage:
//   import { OpenClawLogger } from '@openclaw/logger';
//   const log = new OpenClawLogger({ sourceName: 'dexter', supabaseUrl: '...', supabaseKey: '...' });
//   log.info('Bot started', { service: 'telegram-bot' });
//   log.error('Connection failed', { error: err, category: 'network' });
// ============================================================================

import { SupabaseTransport } from './transport';
import {
  LogEntry,
  LogLevel,
  LoggerConfig,
  LOG_LEVEL_PRIORITY,
  LOG_LEVEL_COLORS,
  RESET_COLOR,
} from './types';

export class OpenClawLogger {
  private transport: SupabaseTransport;
  private sourceName: string;
  private sourceType?: string;
  private defaultCategory: string;
  private defaultService?: string;
  private defaultTags: string[];
  private minLevel: LogLevel;
  private consoleOutput: boolean;
  private sessionId?: string;

  // Counters
  private logCount = 0;
  private errorCount = 0;

  constructor(config: LoggerConfig) {
    this.sourceName = config.sourceName;
    this.sourceType = config.sourceType;
    this.defaultCategory = config.defaultCategory || 'general';
    this.defaultService = config.defaultService;
    this.defaultTags = config.defaultTags || [];
    this.minLevel = config.minLevel || 'debug';
    this.consoleOutput = config.consoleOutput ?? true;

    this.transport = new SupabaseTransport(config.supabaseUrl, config.supabaseKey, config);
  }

  getTransport(): SupabaseTransport {
    return this.transport;
  }

  setSessionId(id: string) {
    this.sessionId = id;
  }

  getStats() {
    return {
      logCount: this.logCount,
      errorCount: this.errorCount,
      transport: this.transport.getStats(),
    };
  }

  // ----------------------------------------------------------
  // Log level methods
  // ----------------------------------------------------------

  debug(message: string, meta?: LogMeta): void {
    this.log('debug', message, meta);
  }

  info(message: string, meta?: LogMeta): void {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: LogMeta): void {
    this.log('warn', message, meta);
  }

  error(message: string, meta?: LogMeta): void {
    this.log('error', message, meta);
  }

  fatal(message: string, meta?: LogMeta): void {
    this.log('fatal', message, meta);
  }

  // ----------------------------------------------------------
  // Specialized logging methods
  // ----------------------------------------------------------

  /** Log an error object with stack trace */
  logError(message: string, err: Error | unknown, meta?: LogMeta): void {
    const error = err instanceof Error ? err : new Error(String(err));
    this.log('error', message, {
      ...meta,
      error_name: error.name,
      error_stack: error.stack,
      error_code: (error as any).code,
    });
  }

  /** Log a timed operation */
  async timed<T>(message: string, fn: () => Promise<T>, meta?: LogMeta): Promise<T> {
    const start = Date.now();
    try {
      const result = await fn();
      this.log('info', message, {
        ...meta,
        duration_ms: Date.now() - start,
      });
      return result;
    } catch (err) {
      this.log('error', `${message} (failed)`, {
        ...meta,
        duration_ms: Date.now() - start,
        error_name: err instanceof Error ? err.name : 'Error',
        error_stack: err instanceof Error ? err.stack : undefined,
      });
      throw err;
    }
  }

  /** Create a child logger with preset context */
  child(defaults: { service?: string; category?: string; tags?: string[]; data?: Record<string, unknown> }): ChildLogger {
    return new ChildLogger(this, defaults);
  }

  /** Log with a request ID for correlation */
  withRequestId(requestId: string): RequestLogger {
    return new RequestLogger(this, requestId);
  }

  // ----------------------------------------------------------
  // Core log method
  // ----------------------------------------------------------

  log(level: LogLevel, message: string, meta?: LogMeta): void {
    if (LOG_LEVEL_PRIORITY[level] < LOG_LEVEL_PRIORITY[this.minLevel]) return;

    this.logCount++;
    if (level === 'error' || level === 'fatal') this.errorCount++;

    const entry: LogEntry = {
      source_name: this.sourceName,
      source_type: this.sourceType,
      level,
      message,
      category: meta?.category || this.defaultCategory,
      subcategory: meta?.subcategory,
      service: meta?.service || this.defaultService,
      data: meta?.data,
      error_name: meta?.error_name,
      error_stack: meta?.error_stack,
      error_code: meta?.error_code,
      request_id: meta?.request_id,
      session_id: meta?.session_id || this.sessionId,
      pid: meta?.pid || process.pid,
      process_name: meta?.process_name,
      duration_ms: meta?.duration_ms,
      tags: [...this.defaultTags, ...(meta?.tags || [])],
      timestamp: new Date().toISOString(),
    };

    // Console output
    if (this.consoleOutput) {
      const color = LOG_LEVEL_COLORS[level];
      const ts = new Date().toISOString().substring(11, 23);
      const prefix = `${color}[${ts}] [${level.toUpperCase().padEnd(5)}]${RESET_COLOR}`;
      const src = `\x1b[90m[${this.sourceName}]${RESET_COLOR}`;
      const svc = entry.service ? `\x1b[90m[${entry.service}]${RESET_COLOR} ` : '';
      const dur = entry.duration_ms ? ` \x1b[90m(${entry.duration_ms}ms)${RESET_COLOR}` : '';
      console.log(`${prefix} ${src} ${svc}${message}${dur}`);
      if (entry.error_stack && level !== 'debug') {
        console.log(`  \x1b[90m${entry.error_stack.split('\n').slice(0, 5).join('\n  ')}${RESET_COLOR}`);
      }
    }

    // Send to Supabase (fire and forget — don't await)
    this.transport.send(entry).catch(() => {});
  }

  // ----------------------------------------------------------
  // Lifecycle
  // ----------------------------------------------------------

  async flush(): Promise<void> {
    await this.transport.flush();
  }

  async destroy(): Promise<void> {
    await this.transport.destroy();
  }
}

// ----------------------------------------------------------
// Meta type for log entries
// ----------------------------------------------------------

export interface LogMeta {
  category?: string;
  subcategory?: string;
  service?: string;
  data?: Record<string, unknown>;
  error_name?: string;
  error_stack?: string;
  error_code?: string;
  request_id?: string;
  session_id?: string;
  pid?: number;
  process_name?: string;
  duration_ms?: number;
  tags?: string[];
}

// ----------------------------------------------------------
// Child Logger — preset context
// ----------------------------------------------------------

class ChildLogger {
  constructor(
    private parent: OpenClawLogger,
    private defaults: { service?: string; category?: string; tags?: string[]; data?: Record<string, unknown> }
  ) {}

  debug(message: string, meta?: LogMeta) { this.parent.log('debug', message, this.merge(meta)); }
  info(message: string, meta?: LogMeta) { this.parent.log('info', message, this.merge(meta)); }
  warn(message: string, meta?: LogMeta) { this.parent.log('warn', message, this.merge(meta)); }
  error(message: string, meta?: LogMeta) { this.parent.log('error', message, this.merge(meta)); }
  fatal(message: string, meta?: LogMeta) { this.parent.log('fatal', message, this.merge(meta)); }

  logError(message: string, err: Error | unknown, meta?: LogMeta) {
    this.parent.logError(message, err, this.merge(meta));
  }

  private merge(meta?: LogMeta): LogMeta {
    return {
      ...this.defaults,
      ...meta,
      data: { ...this.defaults.data, ...meta?.data },
      tags: [...(this.defaults.tags || []), ...(meta?.tags || [])],
    };
  }
}

// ----------------------------------------------------------
// Request Logger — auto request_id
// ----------------------------------------------------------

class RequestLogger {
  constructor(private parent: OpenClawLogger, private requestId: string) {}

  debug(message: string, meta?: LogMeta) { this.parent.log('debug', message, { ...meta, request_id: this.requestId }); }
  info(message: string, meta?: LogMeta) { this.parent.log('info', message, { ...meta, request_id: this.requestId }); }
  warn(message: string, meta?: LogMeta) { this.parent.log('warn', message, { ...meta, request_id: this.requestId }); }
  error(message: string, meta?: LogMeta) { this.parent.log('error', message, { ...meta, request_id: this.requestId }); }
  fatal(message: string, meta?: LogMeta) { this.parent.log('fatal', message, { ...meta, request_id: this.requestId }); }

  logError(message: string, err: Error | unknown, meta?: LogMeta) {
    this.parent.logError(message, err, { ...meta, request_id: this.requestId });
  }
}
