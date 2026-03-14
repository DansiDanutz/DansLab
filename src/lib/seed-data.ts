/**
 * DansLab Seed Data
 * Real team structure, projects, and metrics
 */

export const seedData = {
  teamMembers: [
    {
      name: "Dan",
      role: "Owner",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dan",
      status: "online",
      location: "Romania (EET)",
    },
    {
      name: "David",
      role: "Brain (OpenClaw)",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      status: "online",
      location: "Mac Studio",
    },
    {
      name: "Dexter",
      role: "Senior Infrastructure Dev",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dexter",
      status: "online",
      location: "DigitalOcean Droplet",
    },
    {
      name: "Memo",
      role: "PM & Automations",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Memo",
      status: "online",
      location: "DigitalOcean Droplet",
    },
    {
      name: "Sienna",
      role: "Crypto & Trading",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sienna",
      status: "online",
      location: "DigitalOcean Droplet",
    },
    {
      name: "Nano",
      role: "Agent Creator",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nano",
      status: "online",
      location: "DigitalOcean Droplet",
    },
  ],

  projects: [
    {
      name: "NERVIX",
      description: "AI Agent Marketplace Platform",
      status: "Production",
      start_date: new Date("2025-01-01"),
      target_completion: new Date("2026-06-30"),
      repository_url: "https://github.com/DansiDanutz/nervix-federation",
    },
    {
      name: "CrawdBot",
      description: "Kanban & Task Automation Framework",
      status: "Production",
      start_date: new Date("2025-02-01"),
      target_completion: new Date("2026-05-31"),
      repository_url: "https://github.com/DansiDanutz/CrawdBot",
    },
    {
      name: "MyWork Framework",
      description: "Automation Platform & Workflow Engine",
      status: "Production",
      start_date: new Date("2025-01-15"),
      target_completion: new Date("2026-04-30"),
      repository_url: "https://github.com/DansiDanutz/MyWork-AI",
    },
    {
      name: "Smarty Chat",
      description: "Crypto Trading & Market Intelligence",
      status: "Production",
      start_date: new Date("2024-12-01"),
      target_completion: new Date("2026-03-31"),
      repository_url: "https://github.com/DansiDanutz/ZmartyChat",
    },
  ],

  projectRoadmaps: [
    {
      projectName: "NERVIX",
      phases: [
        {
          phase: "Phase 1-10",
          description: "Core infrastructure & agent framework",
          status: "completed",
          phase_order: 1,
        },
        {
          phase: "Phase 11-12",
          description: "Marketplace features & revenue model",
          status: "completed",
          phase_order: 2,
        },
        {
          phase: "Phase 13",
          description: "Production deployment & scaling",
          status: "completed",
          phase_order: 3,
        },
        {
          phase: "Phase 14",
          description: "DansLab Dashboard & Fleet Visualization",
          status: "in_progress",
          phase_order: 4,
        },
      ],
    },
    {
      projectName: "CrawdBot",
      phases: [
        {
          phase: "Phase 1-12",
          description: "Kanban & task management core",
          status: "completed",
          phase_order: 1,
        },
        {
          phase: "Phase 13",
          description: "Sync workers & automation",
          status: "in_progress",
          phase_order: 2,
        },
      ],
    },
  ],

  piperclipTeams: [
    {
      agentName: "Dexter",
      members: [
        {
          memberName: "Dexter_Worker_1",
          role: "Infrastructure",
          task_count: 12,
          status: "active",
          focus_area: "DevOps & Deployment",
        },
        {
          memberName: "Dexter_Worker_2",
          role: "Backend Dev",
          task_count: 8,
          status: "active",
          focus_area: "API Development",
        },
        {
          memberName: "Dexter_Worker_3",
          role: "Database Admin",
          task_count: 6,
          status: "active",
          focus_area: "Data Management",
        },
        {
          memberName: "Dexter_Worker_4",
          role: "Security",
          task_count: 4,
          status: "idle",
          focus_area: "Infrastructure Security",
        },
      ],
    },
    {
      agentName: "Memo",
      members: [
        {
          memberName: "Memo_Worker_1",
          role: "Automation Engineer",
          task_count: 15,
          status: "active",
          focus_area: "n8n Workflows",
        },
        {
          memberName: "Memo_Worker_2",
          role: "PM",
          task_count: 11,
          status: "active",
          focus_area: "Project Management",
        },
        {
          memberName: "Memo_Worker_3",
          role: "Integration Dev",
          task_count: 9,
          status: "active",
          focus_area: "API Integrations",
        },
        {
          memberName: "Memo_Worker_4",
          role: "QA",
          task_count: 7,
          status: "active",
          focus_area: "Quality Assurance",
        },
      ],
    },
    {
      agentName: "Sienna",
      members: [
        {
          memberName: "Sienna_Worker_1",
          role: "Trading Bot",
          task_count: 14,
          status: "active",
          focus_area: "Crypto Trading",
        },
        {
          memberName: "Sienna_Worker_2",
          role: "Market Analyst",
          task_count: 10,
          status: "active",
          focus_area: "Market Intelligence",
        },
        {
          memberName: "Sienna_Worker_3",
          role: "Risk Manager",
          task_count: 5,
          status: "idle",
          focus_area: "Portfolio Risk",
        },
      ],
    },
    {
      agentName: "Nano",
      members: [
        {
          memberName: "Nano_Worker_1",
          role: "Agent Creator",
          task_count: 13,
          status: "active",
          focus_area: "NERVIX Agent Creation",
        },
        {
          memberName: "Nano_Worker_2",
          role: "CLI Developer",
          task_count: 8,
          status: "active",
          focus_area: "nervix-cli",
        },
        {
          memberName: "Nano_Worker_3",
          role: "Enrollment Manager",
          task_count: 9,
          status: "active",
          focus_area: "Agent Enrollment",
        },
        {
          memberName: "Nano_Worker_4",
          role: "Quality Check",
          task_count: 6,
          status: "active",
          focus_area: "Agent QA",
        },
      ],
    },
  ],

  projectTasks: [
    // NERVIX tasks
    {
      projectName: "NERVIX",
      tasks: [
        {
          task_id: "NERVIX-001",
          title: "Phase 14: DansLab Dashboard Backend",
          status: "in_progress",
          priority: "high",
        },
        {
          task_id: "NERVIX-002",
          title: "API Gateway Enhancement",
          status: "in_progress",
          priority: "high",
        },
        {
          task_id: "NERVIX-003",
          title: "Real-time Metrics Collection",
          status: "todo",
          priority: "medium",
        },
        {
          task_id: "NERVIX-004",
          title: "Agent Enrollment Portal",
          status: "completed",
          priority: "high",
        },
        {
          task_id: "NERVIX-005",
          title: "Payment System Integration",
          status: "completed",
          priority: "high",
        },
      ],
    },
    // CrawdBot tasks
    {
      projectName: "CrawdBot",
      tasks: [
        {
          task_id: "CRAWDBOT-001",
          title: "Sync Worker Implementation",
          status: "in_progress",
          priority: "high",
        },
        {
          task_id: "CRAWDBOT-002",
          title: "Task Queue Optimization",
          status: "todo",
          priority: "medium",
        },
        {
          task_id: "CRAWDBOT-003",
          title: "WebSocket Integration",
          status: "in_progress",
          priority: "medium",
        },
      ],
    },
  ],

  revenueTracking: [
    // NERVIX Revenue
    {
      source: "NERVIX",
      amount: 2500,
      date: new Date("2026-03-01"),
      projectName: "NERVIX",
      notes: "Agent marketplace subscriptions",
    },
    {
      source: "NERVIX",
      amount: 1800,
      date: new Date("2026-02-28"),
      projectName: "NERVIX",
      notes: "Premium agent enrollment",
    },
    // Automations Revenue
    {
      source: "Automations",
      amount: 1200,
      date: new Date("2026-03-01"),
      projectName: "MyWork Framework",
      notes: "Workflow automation services",
    },
    {
      source: "Automations",
      amount: 900,
      date: new Date("2026-02-28"),
      projectName: "CrawdBot",
      notes: "Task automation services",
    },
    // Crypto Revenue
    {
      source: "Crypto",
      amount: 3500,
      date: new Date("2026-03-14"),
      projectName: "Smarty Chat",
      notes: "Trading profits from market activities",
    },
    {
      source: "Crypto",
      amount: 2800,
      date: new Date("2026-03-13"),
      projectName: "Smarty Chat",
      notes: "Arbitrage trading",
    },
  ],

  systemConnections: [
    {
      service_name: "Doctor",
      status: "connected",
      endpoint_url: "http://doctor.internal",
      health_check_url: "http://doctor.internal/health",
    },
    {
      service_name: "Monitor",
      status: "connected",
      endpoint_url: "http://monitor.internal",
      health_check_url: "http://monitor.internal/status",
    },
    {
      service_name: "GSD",
      status: "connected",
      endpoint_url: "http://gsd.internal",
      health_check_url: "http://gsd.internal/health",
    },
    {
      service_name: "Vector",
      status: "connected",
      endpoint_url: "http://vector.internal",
      health_check_url: "http://vector.internal/ping",
    },
    {
      service_name: "Vercel",
      status: "connected",
      endpoint_url: "https://api.vercel.com",
      health_check_url: "https://vercel.com",
    },
    {
      service_name: "GitHub",
      status: "connected",
      endpoint_url: "https://api.github.com",
      health_check_url: "https://github.com",
    },
    {
      service_name: "PopeBot",
      status: "connected",
      endpoint_url: "http://popebot.internal",
      health_check_url: "http://popebot.internal/status",
    },
  ],

  realTimeMetrics: [
    {
      metric_name: "tasks_total",
      value: 287,
      metadata: { projects: 4, agents: 4 },
    },
    {
      metric_name: "tasks_progress",
      value: 156,
      metadata: { percentage: 54.4 },
    },
    {
      metric_name: "completed_today",
      value: 23,
      metadata: { rate: "5.2 per hour" },
    },
    {
      metric_name: "uptime",
      value: 99.9,
      metadata: { unit: "percent", last_incident: "2026-03-10" },
    },
    {
      metric_name: "revenue",
      value: 12600,
      metadata: { period: "monthly", sources: { NERVIX: 4300, Automations: 2100, Crypto: 6200 } },
    },
  ],
};
