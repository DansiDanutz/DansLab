# DansLab Backend API - Setup & Documentation

## Overview

Complete backend infrastructure for DansLab.vercel.app - a real-time team dashboard for the DansLab fleet.

**Features**:
- 8 Supabase tables with full schema
- 7 REST API endpoints
- Real-time subscriptions via Supabase Realtime
- Comprehensive seed data
- TypeScript with strict typing
- Full error handling and validation

## Tech Stack

- **Backend**: Next.js 15+ API Routes
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime (WebSocket)
- **Language**: TypeScript
- **Deployment**: Vercel

## Database Schema

### 1. team_members
Stores core team member information with status and connected devices.

```sql
id (UUID) | name | role | avatar_url | status | location | connected_devices | created_at | updated_at
```

**Roles**: Owner, Brain (OpenClaw), Senior Infrastructure Dev, PM, Crypto, Agent Creator

### 2. piperclip_teams
Maps agents to their team members and tracks their workload.

```sql
id | agent_id (FK) | member_name | role | task_count | status | focus_area
```

**Status**: active, idle, syncing

### 3. projects
Tracks major projects with status and ownership.

```sql
id | name | description | status | owner_id (FK) | start_date | target_completion | repository_url
```

**Status**: Production, Development, Planning, Archived

### 4. project_tasks
Individual tasks linked to projects with assignment and priority.

```sql
id | project_id (FK) | task_id | title | status | assignee_id (FK) | priority
```

**Status**: todo, in_progress, completed, blocked
**Priority**: low, medium, high, critical

### 5. project_roadmap
Tracks project phases and completion status.

```sql
id | project_id (FK) | phase | description | status | completion_date | phase_order
```

### 6. revenue_tracking
Records all revenue with source breakdown.

```sql
id | source | amount | date | project_id (FK) | notes
```

**Sources**: NERVIX, Automations, Crypto, Other

### 7. system_connections
Monitors system integrations and health status.

```sql
id | service_name | status | last_sync | endpoint_url | health_check_url
```

**Services**: Doctor, Monitor, GSD, Vector, Vercel, GitHub, PopeBot

### 8. real_time_metrics
Stores real-time system metrics updated every 5 seconds.

```sql
id | metric_name | value | timestamp | metadata
```

**Metrics**: tasks_total, tasks_progress, completed_today, uptime, revenue

## Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update with your Supabase credentials:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon key (public)
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (server-side only)

### 2. Create Supabase Tables

In Supabase SQL editor, run:

```bash
# Copy entire contents of schema.sql and paste into Supabase SQL editor
cat schema.sql
```

Or use the provided SQL script:

```sql
-- Run schema.sql in Supabase dashboard
```

### 3. Install Dependencies

```bash
npm install
```

This will install:
- `@supabase/supabase-js` - Supabase client
- `tsx` - For running seed script

### 4. Seed Database

Populate with initial data:

```bash
npm run seed
```

This creates:
- 6 team members (Dan, David, Dexter, Memo, Sienna, Nano)
- 4 major projects (NERVIX, CrawdBot, MyWork, Smarty Chat)
- Project roadmaps with phases
- Piperclip teams (agent sub-teams)
- Sample revenue data
- System connection statuses
- Real-time metrics

### 5. Run Development Server

```bash
npm run dev
```

Server runs on `http://localhost:3000`

## API Endpoints

### 1. GET /api/team
Returns all team members with team size.

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Dan",
      "role": "Owner",
      "avatar_url": "...",
      "status": "online",
      "location": "Romania (EET)",
      "connected_devices": ["mac-studio"],
      "team_size": 4
    }
  ],
  "count": 6
}
```

### 2. GET /api/team/:id
Returns single team member with their piperclip team.

**Response**:
```json
{
  "success": true,
  "data": {
    "member": { /* team member */ },
    "piperclip_team": [ /* team members */ ],
    "team_stats": {
      "total_size": 4,
      "active_members": 3,
      "total_tasks": 45
    }
  }
}
```

### 3. GET /api/projects
Returns all projects with status and revenue.

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "NERVIX",
      "status": "Production",
      "task_count": 23,
      "total_revenue": 4300,
      "task_status_breakdown": {
        "todo": 5,
        "in_progress": 10,
        "completed": 8,
        "blocked": 0
      }
    }
  ],
  "count": 4
}
```

### 4. GET /api/projects/:id
Returns project details with roadmap and tasks.

**Response**:
```json
{
  "success": true,
  "data": {
    "project": { /* project */ },
    "roadmap": [ /* phases */ ],
    "tasks": [ /* tasks */ ],
    "revenue": [ /* revenue entries */ ],
    "summary": {
      "total_revenue": 4300,
      "task_statistics": { /* breakdown */ },
      "completion_percentage": 35,
      "phase_count": 14,
      "completed_phases": 13
    }
  }
}
```

### 5. GET /api/revenue
Returns revenue summary with monthly breakdown.

**Response**:
```json
{
  "success": true,
  "data": {
    "all_transactions": [ /* revenue entries */ ],
    "summary": {
      "total_revenue": 12600,
      "current_month": 3500,
      "previous_month": 2800,
      "monthly_growth_percent": 25.0,
      "source_breakdown": {
        "NERVIX": 4300,
        "Automations": 2100,
        "Crypto": 6200
      }
    },
    "monthly_totals": {
      "2026-03": 3500,
      "2026-02": 2800
    }
  }
}
```

### 6. GET /api/metrics
Returns real-time system metrics.

**Response**:
```json
{
  "success": true,
  "data": {
    "metrics": {
      "tasks_total": { "value": 287, "timestamp": "...", "metadata": {} },
      "tasks_progress": { "value": 156, "timestamp": "...", "metadata": {} },
      "uptime": { "value": 99.9, "timestamp": "...", "metadata": {} }
    },
    "task_statistics": {
      "total": 287,
      "todo": 50,
      "in_progress": 156,
      "completed": 70,
      "blocked": 11
    },
    "team_statistics": {
      "total": 6,
      "online": 6,
      "offline": 0,
      "away": 0,
      "busy": 0
    }
  }
}
```

### 7. GET /api/connections
Returns system connection status.

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "service_name": "Doctor",
      "status": "connected",
      "endpoint_url": "...",
      "health_check_url": "...",
      "last_sync_ago": "2m ago"
    }
  ],
  "health": {
    "overview": {
      "total_connections": 7,
      "healthy": 7,
      "unhealthy": 0,
      "overall_health_percent": 100
    }
  }
}
```

## Real-Time Subscriptions

### Client-Side Hook Usage

```typescript
import { useTeamMembersSubscription } from "@/lib/hooks/useRealtimeSubscriptions";

function MyComponent() {
  const { isSubscribed } = useTeamMembersSubscription((update) => {
    console.log("Team member updated:", update);
    // Update UI
  });

  return isSubscribed ? <p>Live updates enabled</p> : <p>Connecting...</p>;
}
```

### Available Hooks

- `useTeamMembersSubscription()` - Listens to all team member changes
- `useMetricsSubscription()` - Listens to new metrics
- `useProjectTasksSubscription(projectId)` - Listens to project task changes
- `useRevenueSubscription()` - Listens to new revenue entries
- `useConnectionsSubscription()` - Listens to connection status changes
- `useRealtimeSubscriptions()` - Subscribes to all at once

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── team/
│   │   │   ├── route.ts           # GET /api/team
│   │   │   └── [id]/
│   │   │       └── route.ts       # GET /api/team/:id
│   │   ├── projects/
│   │   │   ├── route.ts           # GET /api/projects
│   │   │   └── [id]/
│   │   │       └── route.ts       # GET /api/projects/:id
│   │   ├── revenue/
│   │   │   └── route.ts           # GET /api/revenue
│   │   ├── metrics/
│   │   │   └── route.ts           # GET /api/metrics
│   │   └── connections/
│   │       └── route.ts           # GET /api/connections
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── ...
└── lib/
    ├── supabase.ts                 # Supabase client & helpers
    ├── seed-data.ts                # Seed data
    ├── seed.ts                     # Seed script
    └── hooks/
        └── useRealtimeSubscriptions.ts

schema.sql                           # Database schema
.env.example                         # Environment variables
```

## Data Flow

```
Frontend (React Components)
    ↓
useRealtimeSubscriptions (React Hooks)
    ↓
Supabase Realtime (WebSocket)
    ↓
Supabase Database (PostgreSQL)
    ↓
API Routes (/api/*)
    ↓
Supabase Client (lib/supabase.ts)
    ↓
Next.js Server
```

## Error Handling

All endpoints include:
- Input validation
- Try-catch blocks
- Meaningful error messages
- HTTP status codes
- SQL injection prevention (Supabase parameterized queries)

**Example Error Response**:
```json
{
  "error": "Team member not found"
}
```

## Performance Optimizations

- **Indexes**: All foreign keys and frequently-filtered columns indexed
- **Caching**: API responses can be cached with Cache-Control headers
- **Real-time**: Efficient delta updates via PostgreSQL replication
- **Pagination**: Implement with `?limit=10&offset=0` if needed
- **Eager Loading**: Relationships loaded in single queries

## Rate Limiting

Recommended implementation in Next.js:
```typescript
import { Ratelimit } from "@upstash/ratelimit";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "1 h"),
});
```

## Security Considerations

1. **RLS (Row Level Security)**: Tables have public read policies - adjust as needed
2. **Service Role Key**: Never expose in client - stored server-side only
3. **SQL Injection**: Prevented via Supabase parameterized queries
4. **CORS**: Configure for your domain in production
5. **Authentication**: Can be added with Supabase Auth

## Testing

Test endpoints with curl:

```bash
# Test team endpoint
curl http://localhost:3000/api/team

# Test team by ID
curl http://localhost:3000/api/team/[uuid]

# Test projects
curl http://localhost:3000/api/projects

# Test revenue
curl http://localhost:3000/api/revenue

# Test metrics
curl http://localhost:3000/api/metrics

# Test connections
curl http://localhost:3000/api/connections
```

## Deployment

### Vercel

1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

```bash
git push origin main
```

### Environment Variables for Production

In Vercel Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Troubleshooting

### "NEXT_PUBLIC_SUPABASE_URL is not set"
- Check `.env.local` file
- Restart dev server

### Seed script fails
- Verify Supabase credentials
- Check tables exist in Supabase
- Look for unique constraint violations

### Real-time updates not working
- Enable Realtime in Supabase dashboard
- Check WebSocket connection
- Verify RLS policies allow updates

## Next Steps

1. **Frontend**: Use API endpoints to build React components
2. **Authentication**: Add Supabase Auth for user management
3. **Authorization**: Implement RLS policies for security
4. **Monitoring**: Add error tracking and analytics
5. **Automation**: Create cron jobs to update metrics

## Support

For questions or issues, check:
- Supabase documentation: https://supabase.com/docs
- Next.js API routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- Supabase Realtime: https://supabase.com/docs/guides/realtime
