// ============================================================================
// OpenClaw Logger — Type Definitions
// ============================================================================

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export type SourceType = 'droplet' | 'desktop' | 'laptop' | 'server' | 'service';

export type LogCategory =
  | 'system'
  | 'application'
  | 'network'
  | 'security'
  | 'openclaw'
  | 'deployment'
  | 'performance'
  | 'general';

export interface LogEntry {
  source_name: string;
  source_type?: string;
  level: LogLevel;
  message: string;
  category?: LogCategory | string;
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
  timestamp?: string;
}

export interface SystemMetricsEntry {
  source_name: string;
  cpu_percent?: number;
  cpu_count?: number;
  cpu_load_1m?: number;
  cpu_load_5m?: number;
  cpu_load_15m?: number;
  memory_total_mb?: number;
  memory_used_mb?: number;
  memory_percent?: number;
  swap_total_mb?: number;
  swap_used_mb?: number;
  swap_percent?: number;
  disk_total_gb?: number;
  disk_used_gb?: number;
  disk_percent?: number;
  disk_read_mb?: number;
  disk_write_mb?: number;
  network_rx_mb?: number;
  network_tx_mb?: number;
  network_connections?: number;
  process_count?: number;
  zombie_count?: number;
  gpu_percent?: number;
  gpu_memory_percent?: number;
  gpu_temp_celsius?: number;
  uptime_seconds?: number;
  cpu_temp_celsius?: number;
  top_processes?: ProcessInfo[];
  timestamp?: string;
}

export interface ProcessInfo {
  name: string;
  pid: number;
  cpu: number;
  memory: number;
}

export interface LoggerConfig {
  supabaseUrl: string;
  supabaseKey: string;
  sourceName: string;
  sourceType?: SourceType;
  defaultCategory?: string;
  defaultService?: string;
  defaultTags?: string[];
  minLevel?: LogLevel;
  batchSize?: number;
  flushIntervalMs?: number;
  maxRetries?: number;
  consoleOutput?: boolean;
  onError?: (error: Error) => void;
}

export interface CollectorConfig extends LoggerConfig {
  metricsIntervalMs?: number;
  heartbeatIntervalMs?: number;
  watchProcesses?: string[];
  watchPaths?: string[];
  captureSystemLogs?: boolean;
}

export interface LogQueryParams {
  source?: string;
  level?: LogLevel;
  category?: string;
  service?: string;
  search?: string;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
  tags?: string[];
}

export interface LogSource {
  id: string;
  name: string;
  display_name: string;
  emoji: string;
  source_type: SourceType;
  hostname?: string;
  ip_address?: string;
  tailscale_ip?: string;
  os?: string;
  os_version?: string;
  arch?: string;
  cpu_model?: string;
  cpu_cores?: number;
  total_memory_gb?: number;
  total_disk_gb?: number;
  active: boolean;
  last_seen_at?: string;
  last_heartbeat_at?: string;
  tags: string[];
  metadata: Record<string, unknown>;
}

export interface LogSession {
  id: string;
  source_name: string;
  started_at: string;
  ended_at?: string;
  collector_version: string;
  pid: number;
  status: 'active' | 'ended' | 'crashed';
  log_count: number;
  error_count: number;
  bytes_sent: number;
}

export const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4,
};

export const LOG_LEVEL_COLORS: Record<LogLevel, string> = {
  debug: '\x1b[90m',   // gray
  info: '\x1b[36m',    // cyan
  warn: '\x1b[33m',    // yellow
  error: '\x1b[31m',   // red
  fatal: '\x1b[35m',   // magenta
};

export const RESET_COLOR = '\x1b[0m';
