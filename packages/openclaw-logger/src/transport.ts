// ============================================================================
// OpenClaw Logger — Supabase Transport (batched, retried, buffered)
// ============================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { LogEntry, SystemMetricsEntry, LoggerConfig } from './types';

export class SupabaseTransport {
  private client: SupabaseClient;
  private buffer: LogEntry[] = [];
  private metricsBuffer: SystemMetricsEntry[] = [];
  private flushTimer: ReturnType<typeof setInterval> | null = null;
  private isFlushing = false;
  private config: Required<Pick<LoggerConfig, 'batchSize' | 'flushIntervalMs' | 'maxRetries' | 'onError'>>;

  // Stats
  private stats = {
    sent: 0,
    failed: 0,
    retries: 0,
    bytesEstimate: 0,
  };

  constructor(supabaseUrl: string, supabaseKey: string, config?: Partial<LoggerConfig>) {
    this.client = createClient(supabaseUrl, supabaseKey);
    this.config = {
      batchSize: config?.batchSize ?? 50,
      flushIntervalMs: config?.flushIntervalMs ?? 5000,
      maxRetries: config?.maxRetries ?? 3,
      onError: config?.onError ?? ((e: Error) => console.error('[OpenClaw Transport]', e.message)),
    };

    this.startFlushTimer();
  }

  getClient(): SupabaseClient {
    return this.client;
  }

  getStats() {
    return { ...this.stats, buffered: this.buffer.length };
  }

  // ----------------------------------------------------------
  // Log entries
  // ----------------------------------------------------------

  async send(entry: LogEntry): Promise<void> {
    this.buffer.push(entry);
    if (this.buffer.length >= this.config.batchSize) {
      await this.flush();
    }
  }

  async sendBatch(entries: LogEntry[]): Promise<void> {
    this.buffer.push(...entries);
    if (this.buffer.length >= this.config.batchSize) {
      await this.flush();
    }
  }

  async flush(): Promise<void> {
    if (this.isFlushing || this.buffer.length === 0) return;

    this.isFlushing = true;
    const batch = this.buffer.splice(0, this.config.batchSize);

    try {
      await this.insertWithRetry('logs', batch);
      this.stats.sent += batch.length;
      this.stats.bytesEstimate += JSON.stringify(batch).length;
    } catch (err) {
      this.stats.failed += batch.length;
      // Put failed entries back at the front of the buffer
      this.buffer.unshift(...batch);
      this.config.onError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      this.isFlushing = false;
    }

    // If there are still entries in the buffer, flush again
    if (this.buffer.length >= this.config.batchSize) {
      await this.flush();
    }
  }

  // ----------------------------------------------------------
  // System metrics
  // ----------------------------------------------------------

  async sendMetrics(metrics: SystemMetricsEntry): Promise<void> {
    this.metricsBuffer.push(metrics);
    if (this.metricsBuffer.length >= 10) {
      await this.flushMetrics();
    }
  }

  async flushMetrics(): Promise<void> {
    if (this.metricsBuffer.length === 0) return;

    const batch = this.metricsBuffer.splice(0);
    try {
      await this.insertWithRetry('system_metrics', batch);
    } catch (err) {
      // Requeue failed metrics so transient failures don't create permanent gaps
      this.metricsBuffer.unshift(...batch);
      this.config.onError(err instanceof Error ? err : new Error(String(err)));
    }
  }

  // ----------------------------------------------------------
  // Source registration & heartbeat
  // ----------------------------------------------------------

  async registerSource(source: Record<string, unknown>): Promise<void> {
    const { error } = await this.client
      .from('log_sources')
      .upsert(source, { onConflict: 'name' });

    if (error) throw new Error(`Failed to register source: ${error.message}`);
  }

  async heartbeat(sourceName: string): Promise<void> {
    const { error } = await this.client
      .from('log_sources')
      .update({
        last_heartbeat_at: new Date().toISOString(),
        last_seen_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('name', sourceName);

    if (error) {
      this.config.onError(new Error(`Heartbeat failed: ${error.message}`));
    }
  }

  // ----------------------------------------------------------
  // Sessions
  // ----------------------------------------------------------

  async startSession(sourceName: string, version: string): Promise<string> {
    const { data, error } = await this.client
      .from('log_sessions')
      .insert({
        source_name: sourceName,
        collector_version: version,
        pid: process.pid,
        status: 'active',
      })
      .select('id')
      .single();

    if (error) throw new Error(`Failed to start session: ${error.message}`);
    return data.id;
  }

  async endSession(sessionId: string, stats: { logCount: number; errorCount: number; bytesSent: number }): Promise<void> {
    await this.client
      .from('log_sessions')
      .update({
        status: 'ended',
        ended_at: new Date().toISOString(),
        log_count: stats.logCount,
        error_count: stats.errorCount,
        bytes_sent: stats.bytesSent,
      })
      .eq('id', sessionId);
  }

  // ----------------------------------------------------------
  // Query helpers (used by CLI and dashboard)
  // ----------------------------------------------------------

  async queryLogs(params: {
    source?: string;
    level?: string;
    category?: string;
    service?: string;
    from?: string;
    to?: string;
    limit?: number;
    offset?: number;
    search?: string;
    tags?: string[];
  }) {
    // Use full-text search function if search query provided
    if (params.search) {
      const { data, error } = await this.client.rpc('search_logs', {
        search_query: params.search,
        source_filter: params.source || null,
        level_filter: params.level || null,
        category_filter: params.category || null,
        from_time: params.from || new Date(Date.now() - 86400000).toISOString(),
        to_time: params.to || new Date().toISOString(),
        result_limit: params.limit || 100,
        result_offset: params.offset || 0,
      });
      if (error) throw error;
      return data;
    }

    let query = this.client
      .from('logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(params.limit || 100);

    if (params.source) query = query.eq('source_name', params.source);
    if (params.level) query = query.eq('level', params.level);
    if (params.category) query = query.eq('category', params.category);
    if (params.service) query = query.eq('service', params.service);
    if (params.from) query = query.gte('timestamp', params.from);
    if (params.to) query = query.lte('timestamp', params.to);
    if (params.offset) query = query.range(params.offset, params.offset + (params.limit || 100) - 1);
    if (params.tags && params.tags.length > 0) query = query.overlaps('tags', params.tags);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async getLogStats(sourceName?: string, hours = 24) {
    const { data, error } = await this.client.rpc('get_log_stats', {
      p_source_name: sourceName || null,
      p_hours: hours,
    });
    if (error) throw error;
    return data;
  }

  async getSources() {
    const { data, error } = await this.client
      .from('source_health')
      .select('*');
    if (error) throw error;
    return data;
  }

  async getLatestMetrics(sourceName?: string) {
    let query = this.client.from('system_metrics_latest').select('*');
    if (sourceName) query = query.eq('source_name', sourceName);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  // ----------------------------------------------------------
  // Real-time subscription (for live tail)
  // ----------------------------------------------------------

  subscribeToLogs(
    callback: (entry: LogEntry) => void,
    filter?: { source?: string; level?: string }
  ) {
    let channel = this.client
      .channel('logs-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'logs',
          ...(filter?.source ? { filter: `source_name=eq.${filter.source}` } : {}),
        },
        (payload) => {
          const entry = payload.new as LogEntry;
          // Supabase realtime only supports one filter column per subscription,
          // so apply the level filter client-side.
          if (filter?.level && entry.level !== filter.level) return;
          callback(entry);
        }
      );

    channel = channel.subscribe();
    return () => {
      this.client.removeChannel(channel);
    };
  }

  // ----------------------------------------------------------
  // Internal
  // ----------------------------------------------------------

  private async insertWithRetry(table: string, rows: object[], attempt = 1): Promise<void> {
    const { error } = await this.client.from(table).insert(rows);

    if (error) {
      if (attempt < this.config.maxRetries) {
        this.stats.retries++;
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        await new Promise((r) => setTimeout(r, delay));
        return this.insertWithRetry(table, rows, attempt + 1);
      }
      throw error;
    }
  }

  private startFlushTimer(): void {
    this.flushTimer = setInterval(async () => {
      await this.flush();
      await this.flushMetrics();
    }, this.config.flushIntervalMs);

    // Don't block process exit
    if (this.flushTimer.unref) this.flushTimer.unref();
  }

  async destroy(): Promise<void> {
    if (this.flushTimer) clearInterval(this.flushTimer);
    await this.flush();
    await this.flushMetrics();
  }
}
