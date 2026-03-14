-- DansLab Database Schema
-- All tables for team management, projects, revenue tracking, and real-time metrics

-- 1. Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  status VARCHAR(50) DEFAULT 'offline', -- online, offline, away, busy
  location VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an array column for connected_devices after table creation
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS connected_devices TEXT[] DEFAULT ARRAY[]::TEXT[];

-- 2. Piperclip Teams (Agent Teams)
CREATE TABLE IF NOT EXISTS piperclip_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  member_name VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL,
  task_count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'idle', -- active, idle, syncing
  focus_area VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'Development', -- Production, Development, Planning, Archived
  owner_id UUID REFERENCES team_members(id),
  start_date TIMESTAMP WITH TIME ZONE,
  target_completion TIMESTAMP WITH TIME ZONE,
  repository_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Project Tasks Table
CREATE TABLE IF NOT EXISTS project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  task_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'todo', -- todo, in_progress, completed, blocked
  assignee_id UUID REFERENCES team_members(id),
  priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_task_per_project UNIQUE (project_id, task_id)
);

-- 5. Project Roadmap Table
CREATE TABLE IF NOT EXISTS project_roadmap (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  phase VARCHAR(100) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, completed
  completion_date TIMESTAMP WITH TIME ZONE,
  phase_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Revenue Tracking Table
CREATE TABLE IF NOT EXISTS revenue_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source VARCHAR(100) NOT NULL, -- NERVIX, Automations, Crypto, Other
  amount DECIMAL(12, 2) NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  project_id UUID REFERENCES projects(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. System Connections Table
CREATE TABLE IF NOT EXISTS system_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name VARCHAR(100) NOT NULL, -- Doctor, Monitor, GSD, Vector, Vercel, GitHub, PopeBot
  status VARCHAR(50) DEFAULT 'unknown', -- connected, disconnected, error, unknown
  last_sync TIMESTAMP WITH TIME ZONE,
  endpoint_url TEXT,
  health_check_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_service UNIQUE (service_name)
);

-- 8. Real-Time Metrics Table
CREATE TABLE IF NOT EXISTS real_time_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name VARCHAR(100) NOT NULL, -- tasks_total, tasks_progress, completed_today, uptime, revenue
  value DECIMAL(12, 2) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_piperclip_teams_agent_id ON piperclip_teams(agent_id);
CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_project_tasks_project_id ON project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_project_tasks_assignee_id ON project_tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_project_roadmap_project_id ON project_roadmap(project_id);
CREATE INDEX IF NOT EXISTS idx_revenue_tracking_project_id ON revenue_tracking(project_id);
CREATE INDEX IF NOT EXISTS idx_revenue_tracking_date ON revenue_tracking(date);
CREATE INDEX IF NOT EXISTS idx_real_time_metrics_metric_name ON real_time_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_real_time_metrics_timestamp ON real_time_metrics(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_team_members_status ON team_members(status);

-- Enable RLS (Row Level Security) - optional but recommended
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE piperclip_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_roadmap ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE real_time_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access (adjust as needed for security)
CREATE POLICY "Allow public read" ON team_members FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON piperclip_teams FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON project_tasks FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON project_roadmap FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON revenue_tracking FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON system_connections FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON real_time_metrics FOR SELECT USING (true);
