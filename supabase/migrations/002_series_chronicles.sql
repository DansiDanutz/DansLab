-- Migration 002 — DansLab AI Chronicles (YouTube series)
-- Adds 4 tables: series_episodes, series_characters, series_episode_cast, series_attribution.
-- Mirrors the appended block in /schema.sql.

CREATE TABLE IF NOT EXISTS series_episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number INTEGER NOT NULL UNIQUE,
  season INTEGER NOT NULL DEFAULT 1,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'concept',
  publish_at TIMESTAMP WITH TIME ZONE,
  youtube_id VARCHAR(64),
  mission_target_usd DECIMAL(12, 2) NOT NULL DEFAULT 0,
  mission_actual_usd DECIMAL(12, 2),
  summary TEXT,
  mystery TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT series_episodes_status_check CHECK (status IN
    ('concept', 'scripting', 'production', 'post', 'scheduled', 'published'))
);

CREATE TABLE IF NOT EXISTS series_characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_key VARCHAR(64) NOT NULL UNIQUE,
  archetype VARCHAR(255),
  voice_id VARCHAR(64),
  voice_name VARCHAR(64),
  prop VARCHAR(255),
  art_url TEXT,
  tier VARCHAR(20) NOT NULL DEFAULT 'council',
  first_appearance_episode INTEGER,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT series_characters_tier_check CHECK (tier IN
    ('human', 'council', 'capital', 'channel'))
);

CREATE TABLE IF NOT EXISTS series_episode_cast (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id UUID NOT NULL REFERENCES series_episodes(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES series_characters(id) ON DELETE CASCADE,
  role_in_episode VARCHAR(20) NOT NULL DEFAULT 'featured',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT series_episode_cast_role_check CHECK (role_in_episode IN
    ('featured', 'cameo', 'background')),
  CONSTRAINT unique_character_per_episode UNIQUE (episode_id, character_id)
);

CREATE TABLE IF NOT EXISTS series_attribution (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id UUID NOT NULL REFERENCES series_episodes(id) ON DELETE CASCADE,
  source VARCHAR(40) NOT NULL,
  surface VARCHAR(40),
  utm_campaign VARCHAR(64) NOT NULL,
  utm_content VARCHAR(64),
  signups INTEGER NOT NULL DEFAULT 0,
  mrr_attributed_usd DECIMAL(12, 2) NOT NULL DEFAULT 0,
  sponsor_id UUID,
  sponsor_revenue_usd DECIMAL(12, 2) NOT NULL DEFAULT 0,
  saas_conversions INTEGER NOT NULL DEFAULT 0,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_series_episodes_status ON series_episodes(status);
CREATE INDEX IF NOT EXISTS idx_series_episodes_publish_at ON series_episodes(publish_at);
CREATE INDEX IF NOT EXISTS idx_series_characters_tier ON series_characters(tier);
CREATE INDEX IF NOT EXISTS idx_series_characters_agent_key ON series_characters(agent_key);
CREATE INDEX IF NOT EXISTS idx_series_episode_cast_episode ON series_episode_cast(episode_id);
CREATE INDEX IF NOT EXISTS idx_series_episode_cast_character ON series_episode_cast(character_id);
CREATE INDEX IF NOT EXISTS idx_series_attribution_episode ON series_attribution(episode_id);
CREATE INDEX IF NOT EXISTS idx_series_attribution_campaign ON series_attribution(utm_campaign);
CREATE INDEX IF NOT EXISTS idx_series_attribution_recorded_at ON series_attribution(recorded_at DESC);

ALTER TABLE series_episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE series_characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE series_episode_cast ENABLE ROW LEVEL SECURITY;
ALTER TABLE series_attribution ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON series_episodes FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON series_characters FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON series_episode_cast FOR SELECT USING (true);
CREATE POLICY "Service write" ON series_attribution
  FOR ALL TO service_role USING (true) WITH CHECK (true);
