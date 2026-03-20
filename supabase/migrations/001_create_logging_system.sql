-- ============================================================================
-- OpenClaw Comprehensive Logging System
-- ============================================================================
-- Tables: log_sources, logs, log_sessions, system_metrics, log_alerts
-- Views: logs_recent, logs_by_source, system_metrics_latest, error_summary
-- Functions: cleanup, aggregation, search
-- ============================================================================

-- ============================================================================
-- 1. LOG SOURCES — registered machines (droplets, desktops, laptops)
-- ============================================================================
CREATE TABLE IF NOT EXISTS log_sources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- Identity
    name TEXT NOT NULL UNIQUE,              -- e.g. 'dexter', 'mac-studio', 'windows-laptop'
    display_name TEXT NOT NULL,             -- e.g. 'Dexter', 'Mac Studio'
    emoji TEXT DEFAULT '🖥️',
    source_type TEXT NOT NULL CHECK (source_type IN ('droplet', 'desktop', 'laptop', 'server', 'service')),

    -- Network
    hostname TEXT,
    ip_address INET,
    tailscale_ip INET,

    -- System info (auto-populated by collector)
    os TEXT,                                -- e.g. 'linux', 'darwin', 'win32'
    os_version TEXT,                        -- e.g. 'Ubuntu 22.04', 'macOS 15.3'
    arch TEXT,                              -- e.g. 'x64', 'arm64'
    cpu_model TEXT,
    cpu_cores INTEGER,
    total_memory_gb NUMERIC(10,2),
    total_disk_gb NUMERIC(10,2),

    -- Status
    active BOOLEAN DEFAULT true,
    last_seen_at TIMESTAMPTZ,
    last_heartbeat_at TIMESTAMPTZ,

    -- Metadata
    tags TEXT[] DEFAULT '{}',               -- e.g. ['production', 'agent', 'gpu']
    metadata JSONB DEFAULT '{}',

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_log_sources_name ON log_sources(name);
CREATE INDEX IF NOT EXISTS idx_log_sources_type ON log_sources(source_type);
CREATE INDEX IF NOT EXISTS idx_log_sources_active ON log_sources(active);

-- ============================================================================
-- 2. LOGS — the main log entries table (partitioned by month for performance)
-- ============================================================================
CREATE TABLE IF NOT EXISTS logs (
    id UUID DEFAULT gen_random_uuid(),

    -- Source identification
    source_name TEXT NOT NULL,              -- FK to log_sources.name
    source_type TEXT,                       -- denormalized for fast queries

    -- Log content
    level TEXT NOT NULL CHECK (level IN ('debug', 'info', 'warn', 'error', 'fatal')),
    message TEXT NOT NULL,

    -- Context
    category TEXT DEFAULT 'general',        -- e.g. 'system', 'application', 'network', 'security', 'openclaw'
    subcategory TEXT,                       -- e.g. 'cpu', 'memory', 'disk', 'process', 'http'
    service TEXT,                           -- e.g. 'openclaw-gateway', 'telegram-bot', 'video-renderer'

    -- Structured data
    data JSONB DEFAULT '{}',               -- arbitrary structured log data

    -- Error tracking
    error_name TEXT,                        -- e.g. 'TypeError', 'ECONNREFUSED'
    error_stack TEXT,                       -- full stack trace
    error_code TEXT,                        -- e.g. 'ENOENT', 'ERR_HTTP_500'

    -- Request tracking (for HTTP/API logs)
    request_id TEXT,                        -- correlation ID
    session_id UUID,                        -- FK to log_sessions

    -- Process info
    pid INTEGER,
    process_name TEXT,

    -- Performance
    duration_ms NUMERIC(12,2),             -- for timed operations

    -- Tags for flexible filtering
    tags TEXT[] DEFAULT '{}',

    -- Timestamps
    timestamp TIMESTAMPTZ DEFAULT NOW(),    -- when the event occurred
    received_at TIMESTAMPTZ DEFAULT NOW(),  -- when supabase received it

    PRIMARY KEY (id, timestamp)
) PARTITION BY RANGE (timestamp);

-- Create partitions for current and next 6 months
DO $$
DECLARE
    start_date DATE;
    end_date DATE;
    partition_name TEXT;
BEGIN
    FOR i IN 0..6 LOOP
        start_date := DATE_TRUNC('month', CURRENT_DATE + (i || ' months')::INTERVAL);
        end_date := start_date + '1 month'::INTERVAL;
        partition_name := 'logs_' || TO_CHAR(start_date, 'YYYY_MM');

        EXECUTE format(
            'CREATE TABLE IF NOT EXISTS %I PARTITION OF logs FOR VALUES FROM (%L) TO (%L)',
            partition_name, start_date, end_date
        );
    END LOOP;
END $$;

-- Indexes on the partitioned table
CREATE INDEX IF NOT EXISTS idx_logs_source_name ON logs(source_name);
CREATE INDEX IF NOT EXISTS idx_logs_level ON logs(level);
CREATE INDEX IF NOT EXISTS idx_logs_category ON logs(category);
CREATE INDEX IF NOT EXISTS idx_logs_service ON logs(service);
CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_logs_source_timestamp ON logs(source_name, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_logs_level_timestamp ON logs(level, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_logs_error_name ON logs(error_name) WHERE error_name IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_logs_request_id ON logs(request_id) WHERE request_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_logs_session_id ON logs(session_id) WHERE session_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_logs_tags ON logs USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_logs_data ON logs USING GIN(data);

-- Full-text search on log messages
CREATE INDEX IF NOT EXISTS idx_logs_message_search ON logs USING GIN(to_tsvector('english', message));

-- ============================================================================
-- 3. LOG SESSIONS — track collector daemon sessions (start/stop/crash)
-- ============================================================================
CREATE TABLE IF NOT EXISTS log_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    source_name TEXT NOT NULL,

    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,

    -- Session info
    collector_version TEXT,
    pid INTEGER,

    -- Status
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'ended', 'crashed')),

    -- Stats (updated periodically)
    log_count BIGINT DEFAULT 0,
    error_count BIGINT DEFAULT 0,
    bytes_sent BIGINT DEFAULT 0,

    metadata JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_log_sessions_source ON log_sessions(source_name);
CREATE INDEX IF NOT EXISTS idx_log_sessions_status ON log_sessions(status);
CREATE INDEX IF NOT EXISTS idx_log_sessions_started ON log_sessions(started_at DESC);

-- ============================================================================
-- 4. SYSTEM METRICS — periodic snapshots from each machine
-- ============================================================================
CREATE TABLE IF NOT EXISTS system_metrics (
    id UUID DEFAULT gen_random_uuid(),
    source_name TEXT NOT NULL,

    -- CPU
    cpu_percent NUMERIC(5,2),
    cpu_count INTEGER,
    cpu_load_1m NUMERIC(8,2),
    cpu_load_5m NUMERIC(8,2),
    cpu_load_15m NUMERIC(8,2),

    -- Memory
    memory_total_mb BIGINT,
    memory_used_mb BIGINT,
    memory_percent NUMERIC(5,2),
    swap_total_mb BIGINT,
    swap_used_mb BIGINT,
    swap_percent NUMERIC(5,2),

    -- Disk
    disk_total_gb NUMERIC(10,2),
    disk_used_gb NUMERIC(10,2),
    disk_percent NUMERIC(5,2),
    disk_read_mb NUMERIC(10,2),
    disk_write_mb NUMERIC(10,2),

    -- Network
    network_rx_mb NUMERIC(12,2),
    network_tx_mb NUMERIC(12,2),
    network_connections INTEGER,

    -- Process
    process_count INTEGER,
    zombie_count INTEGER,

    -- GPU (if available)
    gpu_percent NUMERIC(5,2),
    gpu_memory_percent NUMERIC(5,2),
    gpu_temp_celsius NUMERIC(5,1),

    -- Uptime
    uptime_seconds BIGINT,

    -- Temperature (if available)
    cpu_temp_celsius NUMERIC(5,1),

    -- Top processes
    top_processes JSONB DEFAULT '[]',      -- [{name, pid, cpu, memory}]

    timestamp TIMESTAMPTZ DEFAULT NOW(),

    PRIMARY KEY (id, timestamp)
) PARTITION BY RANGE (timestamp);

-- Create partitions for system_metrics
DO $$
DECLARE
    start_date DATE;
    end_date DATE;
    partition_name TEXT;
BEGIN
    FOR i IN 0..6 LOOP
        start_date := DATE_TRUNC('month', CURRENT_DATE + (i || ' months')::INTERVAL);
        end_date := start_date + '1 month'::INTERVAL;
        partition_name := 'system_metrics_' || TO_CHAR(start_date, 'YYYY_MM');

        EXECUTE format(
            'CREATE TABLE IF NOT EXISTS %I PARTITION OF system_metrics FOR VALUES FROM (%L) TO (%L)',
            partition_name, start_date, end_date
        );
    END LOOP;
END $$;

CREATE INDEX IF NOT EXISTS idx_system_metrics_source ON system_metrics(source_name);
CREATE INDEX IF NOT EXISTS idx_system_metrics_timestamp ON system_metrics(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_system_metrics_source_time ON system_metrics(source_name, timestamp DESC);

-- ============================================================================
-- 5. LOG ALERTS — configurable alert rules and triggered alerts
-- ============================================================================
CREATE TABLE IF NOT EXISTS log_alert_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    name TEXT NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT true,

    -- Conditions
    source_filter TEXT[],                   -- which sources to watch (empty = all)
    level_filter TEXT[],                    -- e.g. ['error', 'fatal']
    category_filter TEXT[],
    message_pattern TEXT,                   -- regex pattern to match

    -- Thresholds
    threshold_count INTEGER DEFAULT 1,      -- how many matches before alert
    threshold_window_minutes INTEGER DEFAULT 5, -- time window for threshold

    -- Cooldown
    cooldown_minutes INTEGER DEFAULT 30,    -- minimum time between alerts
    last_triggered_at TIMESTAMPTZ,

    -- Notification config
    notify_channels TEXT[] DEFAULT '{}',    -- e.g. ['telegram', 'webhook']
    notify_config JSONB DEFAULT '{}',       -- channel-specific config

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS log_alerts_triggered (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    rule_id UUID REFERENCES log_alert_rules(id),

    source_name TEXT,
    level TEXT,
    message TEXT,
    matching_log_ids UUID[],
    match_count INTEGER,

    -- Status
    status TEXT DEFAULT 'fired' CHECK (status IN ('fired', 'acknowledged', 'resolved')),
    acknowledged_by TEXT,
    resolved_at TIMESTAMPTZ,

    triggered_at TIMESTAMPTZ DEFAULT NOW(),
    notified_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_alerts_triggered_rule ON log_alerts_triggered(rule_id);
CREATE INDEX IF NOT EXISTS idx_alerts_triggered_status ON log_alerts_triggered(status);
CREATE INDEX IF NOT EXISTS idx_alerts_triggered_time ON log_alerts_triggered(triggered_at DESC);

-- ============================================================================
-- 6. VIEWS — convenient query interfaces
-- ============================================================================

-- Recent logs (last 24h) with source info
CREATE OR REPLACE VIEW logs_recent AS
SELECT
    l.id,
    l.source_name,
    l.source_type,
    s.display_name AS source_display_name,
    s.emoji AS source_emoji,
    l.level,
    l.message,
    l.category,
    l.service,
    l.error_name,
    l.data,
    l.tags,
    l.duration_ms,
    l.timestamp
FROM logs l
LEFT JOIN log_sources s ON s.name = l.source_name
WHERE l.timestamp > NOW() - INTERVAL '24 hours'
ORDER BY l.timestamp DESC;

-- Error summary by source (last 24h)
CREATE OR REPLACE VIEW error_summary AS
SELECT
    source_name,
    error_name,
    COUNT(*) AS error_count,
    MAX(timestamp) AS last_occurrence,
    MIN(timestamp) AS first_occurrence,
    ARRAY_AGG(DISTINCT message) FILTER (WHERE message IS NOT NULL) AS sample_messages
FROM logs
WHERE level IN ('error', 'fatal')
    AND timestamp > NOW() - INTERVAL '24 hours'
GROUP BY source_name, error_name
ORDER BY error_count DESC;

-- Latest system metrics per source
CREATE OR REPLACE VIEW system_metrics_latest AS
SELECT DISTINCT ON (source_name)
    sm.*,
    s.display_name,
    s.emoji,
    s.os,
    s.os_version
FROM system_metrics sm
LEFT JOIN log_sources s ON s.name = sm.source_name
ORDER BY source_name, timestamp DESC;

-- Source health overview
CREATE OR REPLACE VIEW source_health AS
SELECT
    s.name,
    s.display_name,
    s.emoji,
    s.source_type,
    s.os,
    s.active,
    s.last_seen_at,
    s.last_heartbeat_at,
    -- Is online? (heartbeat within last 5 min)
    CASE WHEN s.last_heartbeat_at > NOW() - INTERVAL '5 minutes' THEN true ELSE false END AS is_online,
    -- Time since last seen
    EXTRACT(EPOCH FROM (NOW() - s.last_seen_at))::INTEGER AS seconds_since_seen,
    -- Recent error count
    (SELECT COUNT(*) FROM logs l WHERE l.source_name = s.name AND l.level IN ('error', 'fatal') AND l.timestamp > NOW() - INTERVAL '1 hour') AS recent_errors,
    -- Recent log count
    (SELECT COUNT(*) FROM logs l WHERE l.source_name = s.name AND l.timestamp > NOW() - INTERVAL '1 hour') AS recent_logs,
    -- Latest metrics
    m.cpu_percent,
    m.memory_percent,
    m.disk_percent
FROM log_sources s
LEFT JOIN system_metrics_latest m ON m.source_name = s.name
WHERE s.active = true
ORDER BY s.name;

-- ============================================================================
-- 7. FUNCTIONS
-- ============================================================================

-- Full-text search on logs
CREATE OR REPLACE FUNCTION search_logs(
    search_query TEXT,
    source_filter TEXT DEFAULT NULL,
    level_filter TEXT DEFAULT NULL,
    category_filter TEXT DEFAULT NULL,
    from_time TIMESTAMPTZ DEFAULT NOW() - INTERVAL '24 hours',
    to_time TIMESTAMPTZ DEFAULT NOW(),
    result_limit INTEGER DEFAULT 100,
    result_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    source_name TEXT,
    level TEXT,
    message TEXT,
    category TEXT,
    service TEXT,
    data JSONB,
    error_name TEXT,
    tags TEXT[],
    log_timestamp TIMESTAMPTZ,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        l.id,
        l.source_name,
        l.level,
        l.message,
        l.category,
        l.service,
        l.data,
        l.error_name,
        l.tags,
        l.timestamp AS log_timestamp,
        ts_rank(to_tsvector('english', l.message), plainto_tsquery('english', search_query)) AS rank
    FROM logs l
    WHERE to_tsvector('english', l.message) @@ plainto_tsquery('english', search_query)
        AND l.timestamp BETWEEN from_time AND to_time
        AND (source_filter IS NULL OR l.source_name = source_filter)
        AND (level_filter IS NULL OR l.level = level_filter)
        AND (category_filter IS NULL OR l.category = category_filter)
    ORDER BY rank DESC, l.timestamp DESC
    LIMIT result_limit
    OFFSET result_offset;
END;
$$ LANGUAGE plpgsql;

-- Get log statistics for a source
CREATE OR REPLACE FUNCTION get_log_stats(
    p_source_name TEXT DEFAULT NULL,
    p_hours INTEGER DEFAULT 24
)
RETURNS TABLE (
    source TEXT,
    total_logs BIGINT,
    debug_count BIGINT,
    info_count BIGINT,
    warn_count BIGINT,
    error_count BIGINT,
    fatal_count BIGINT,
    unique_errors BIGINT,
    avg_errors_per_hour NUMERIC,
    first_log TIMESTAMPTZ,
    last_log TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        l.source_name AS source,
        COUNT(*) AS total_logs,
        COUNT(*) FILTER (WHERE l.level = 'debug') AS debug_count,
        COUNT(*) FILTER (WHERE l.level = 'info') AS info_count,
        COUNT(*) FILTER (WHERE l.level = 'warn') AS warn_count,
        COUNT(*) FILTER (WHERE l.level = 'error') AS error_count,
        COUNT(*) FILTER (WHERE l.level = 'fatal') AS fatal_count,
        COUNT(DISTINCT l.error_name) FILTER (WHERE l.error_name IS NOT NULL) AS unique_errors,
        ROUND(COUNT(*) FILTER (WHERE l.level IN ('error', 'fatal'))::NUMERIC / GREATEST(p_hours, 1), 2) AS avg_errors_per_hour,
        MIN(l.timestamp) AS first_log,
        MAX(l.timestamp) AS last_log
    FROM logs l
    WHERE l.timestamp > NOW() - (p_hours || ' hours')::INTERVAL
        AND (p_source_name IS NULL OR l.source_name = p_source_name)
    GROUP BY l.source_name
    ORDER BY total_logs DESC;
END;
$$ LANGUAGE plpgsql;

-- Cleanup old logs (call via cron or scheduled function)
CREATE OR REPLACE FUNCTION cleanup_old_logs(
    retention_days INTEGER DEFAULT 90,
    metrics_retention_days INTEGER DEFAULT 30
)
RETURNS TABLE (logs_deleted BIGINT, metrics_deleted BIGINT) AS $$
DECLARE
    l_deleted BIGINT;
    m_deleted BIGINT;
BEGIN
    DELETE FROM logs WHERE timestamp < NOW() - (retention_days || ' days')::INTERVAL;
    GET DIAGNOSTICS l_deleted = ROW_COUNT;

    DELETE FROM system_metrics WHERE timestamp < NOW() - (metrics_retention_days || ' days')::INTERVAL;
    GET DIAGNOSTICS m_deleted = ROW_COUNT;

    RETURN QUERY SELECT l_deleted, m_deleted;
END;
$$ LANGUAGE plpgsql;

-- Auto-create future partitions (run monthly via cron)
CREATE OR REPLACE FUNCTION create_future_partitions()
RETURNS VOID AS $$
DECLARE
    start_date DATE;
    end_date DATE;
    partition_name TEXT;
BEGIN
    FOR i IN 0..3 LOOP
        start_date := DATE_TRUNC('month', CURRENT_DATE + (i || ' months')::INTERVAL);
        end_date := start_date + '1 month'::INTERVAL;

        -- Logs partition
        partition_name := 'logs_' || TO_CHAR(start_date, 'YYYY_MM');
        BEGIN
            EXECUTE format(
                'CREATE TABLE IF NOT EXISTS %I PARTITION OF logs FOR VALUES FROM (%L) TO (%L)',
                partition_name, start_date, end_date
            );
        EXCEPTION WHEN duplicate_table THEN NULL;
        END;

        -- System metrics partition
        partition_name := 'system_metrics_' || TO_CHAR(start_date, 'YYYY_MM');
        BEGIN
            EXECUTE format(
                'CREATE TABLE IF NOT EXISTS %I PARTITION OF system_metrics FOR VALUES FROM (%L) TO (%L)',
                partition_name, start_date, end_date
            );
        EXCEPTION WHEN duplicate_table THEN NULL;
        END;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Update source last_seen_at on log insert
CREATE OR REPLACE FUNCTION update_source_last_seen()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE log_sources
    SET last_seen_at = NEW.timestamp, updated_at = NOW()
    WHERE name = NEW.source_name;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_logs_update_source ON logs;
CREATE TRIGGER trg_logs_update_source
AFTER INSERT ON logs
FOR EACH ROW
EXECUTE FUNCTION update_source_last_seen();

-- ============================================================================
-- 8. ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE log_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_alert_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_alerts_triggered ENABLE ROW LEVEL SECURITY;

-- Service role (collector agents) can do everything — explicitly restricted to service_role
-- so anon/authenticated clients cannot read or write logging data
DO $$ BEGIN
  DROP POLICY IF EXISTS "Service role full access" ON log_sources;
  DROP POLICY IF EXISTS "Service role full access" ON logs;
  DROP POLICY IF EXISTS "Service role full access" ON log_sessions;
  DROP POLICY IF EXISTS "Service role full access" ON system_metrics;
  DROP POLICY IF EXISTS "Service role full access" ON log_alert_rules;
  DROP POLICY IF EXISTS "Service role full access" ON log_alerts_triggered;
END $$;

CREATE POLICY "Service role full access" ON log_sources FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON logs FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON log_sessions FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON system_metrics FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON log_alert_rules FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON log_alerts_triggered FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================================================
-- 9. SEED DEFAULT SOURCES
-- ============================================================================
INSERT INTO log_sources (name, display_name, emoji, source_type, hostname, tailscale_ip, os, tags) VALUES
    ('dexter',          'Dexter',           '🔬', 'droplet',  'dexter-droplet',      '100.94.135.19',    'linux',  ARRAY['production', 'agent']),
    ('memo',            'Memo',             '📝', 'droplet',  'memo-droplet',         '100.88.192.48',    'linux',  ARRAY['production', 'agent']),
    ('sienna',          'Sienna',           '🎨', 'droplet',  'sienna-droplet',       '167.172.187.230',  'linux',  ARRAY['production', 'agent']),
    ('nano',            'Nano',             '⚡', 'droplet',  'nano-droplet',         '100.105.148.29',   'linux',  ARRAY['production', 'agent']),
    ('mac-studio',      'Mac Studio',       '🖥️', 'desktop',  'dans-mac-studio',      '100.79.10.102',    'darwin', ARRAY['local', 'gpu']),
    ('mac-mini',        'Mac Mini',         '🍎', 'desktop',  'dans-mac-mini',        NULL,               'darwin', ARRAY['local']),
    ('windows-laptop',  'Windows Laptop',   '💻', 'laptop',   'dans-windows-laptop',  NULL,               'win32',  ARRAY['local'])
ON CONFLICT (name) DO NOTHING;
