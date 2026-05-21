import { agents, agentMap } from "@/components/ecosystem/data/agents";
import { scenarios } from "@/components/ecosystem/scenarios/scenarioData";

export interface DocSection {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  path: string;
  children?: DocSection[];
}

export interface DocContent {
  title: string;
  subtitle?: string;
  sections: ContentBlock[];
}

export interface ContentBlock {
  id: string;
  type: "intro" | "text" | "list" | "agent-grid" | "workflow-list";
  title?: string;
  content: string | string[];
}

// Documentation navigation structure
export const docNavigation: DocSection[] = [
  {
    id: "overview",
    title: "Overview",
    description: "Executive summary and quick start",
    icon: "📋",
    path: "/docs/overview",
  },
  {
    id: "architecture",
    title: "Architecture",
    description: "System topology and company model",
    icon: "🏗️",
    path: "/docs/architecture",
    children: [
      { id: "company-model", title: "Company Model", path: "/docs/architecture#company" },
      { id: "topology", title: "Physical Topology", path: "/docs/architecture#topology" },
      { id: "layers", title: "Runtime Layers", path: "/docs/architecture#layers" },
    ],
  },
  {
    id: "agents",
    title: "Agents",
    description: "All agents and their roles",
    icon: "🤖",
    path: "/docs/agents",
    children: [
      { id: "main-agents", title: "Main Agents", path: "/docs/agents?type=main" },
      { id: "openclaw", title: "OpenClaw Team", path: "/docs/agents?type=openclaw" },
      { id: "slack-agents", title: "Slack Agents", path: "/docs/agents?type=slack" },
      { id: "support-agents", title: "Support Systems", path: "/docs/agents?type=support" },
    ],
  },
  {
    id: "workflows",
    title: "Workflows",
    description: "Operational scenarios and flows",
    icon: "⚡",
    path: "/docs/workflows",
  },
  {
    id: "openclaw",
    title: "OpenClaw",
    description: "Specialist team architecture",
    icon: "🦞",
    path: "/docs/openclaw",
  },
  {
    id: "support",
    title: "Support Systems",
    description: "Infrastructure and operations",
    icon: "🔧",
    path: "/docs/support",
  },
  {
    id: "projects",
    title: "Projects",
    description: "Repository and product architecture",
    icon: "📦",
    path: "/docs/projects",
  },
  {
    id: "responsibilities",
    title: "Responsibilities",
    description: "Team matrix and decision rights",
    icon: "👥",
    path: "/docs/responsibilities",
  },
];

// Overview page content
export const overviewContent: DocContent = {
  title: "DansLab Documentation",
  subtitle: "AI-first software company architecture",
  sections: [
    {
      id: "intro",
      type: "intro",
      title: "Welcome to DansLab",
      content: "DansLab is an AI-native software company organized around autonomous agents. This documentation explains the system architecture, agent ecosystem, and operational workflows.",
    },
    {
      id: "quick-links",
      type: "agent-grid",
      title: "Quick Navigation",
      content: ["Explore the main sections below to learn about the system:"],
    },
  ],
};

// Helper function to get agents by type
export function getAgentsByType(type: string) {
  return agents.filter((agent) => agent.type === type);
}

// Helper function to get agent by ID
export function getAgentById(id: string) {
  return agentMap.get(id);
}

// Helper function to get scenario by ID
export function getScenarioById(id: string) {
  return scenarios.find((s) => s.id === id);
}

// Helper function to get related agents for a scenario
export function getScenarioAgents(scenarioId: string) {
  const scenario = getScenarioById(scenarioId);
  if (!scenario) return [];

  const agentIds = new Set<string>();
  scenario.steps.forEach((step) => {
    step.activeAgents.forEach((id) => agentIds.add(id));
  });

  return Array.from(agentIds)
    .map((id) => agentMap.get(id))
    .filter(Boolean);
}
