// ============================================================================
// OpenClaw Logger — Main Exports
// ============================================================================
// SDK usage:
//   import { OpenClawLogger } from '@openclaw/logger';
//   const log = new OpenClawLogger({
//     sourceName: 'dexter',
//     supabaseUrl: process.env.OPENCLAW_SUPABASE_URL!,
//     supabaseKey: process.env.OPENCLAW_SUPABASE_KEY!,
//   });
//
//   log.info('Bot started');
//   log.error('Something failed', { service: 'telegram-bot', data: { userId: 123 } });
//   log.logError('Caught exception', err);
//   await log.timed('API call', () => fetch(url));
//
//   const botLog = log.child({ service: 'telegram-bot', category: 'application' });
//   botLog.info('Message received');
// ============================================================================

export { OpenClawLogger, LogMeta } from './logger';
export { SupabaseTransport } from './transport';
export { collectMetrics, getSystemInfo } from './system-info';
export {
  LogEntry,
  LogLevel,
  LogCategory,
  SourceType,
  SystemMetricsEntry,
  ProcessInfo,
  LoggerConfig,
  CollectorConfig,
  LogQueryParams,
  LogSource,
  LogSession,
  LOG_LEVEL_PRIORITY,
  LOG_LEVEL_COLORS,
  RESET_COLOR,
} from './types';
