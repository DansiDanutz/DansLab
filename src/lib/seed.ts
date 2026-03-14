/**
 * Database Seed Script
 * Populates the DansLab database with initial data
 */

import { supabase } from "./supabase";
import { seedData } from "./seed-data";

export async function seedDatabase() {
  console.log("🌱 Starting database seed...");

  try {
    // 1. Seed Team Members
    console.log("📝 Seeding team members...");
    const teamMemberMap: { [key: string]: string } = {};

    for (const member of seedData.teamMembers) {
      const { data, error } = await supabase
        .from("team_members")
        .insert([member])
        .select()
        .single();

      if (error) {
        console.error(`❌ Error seeding team member ${member.name}:`, error);
      } else {
        teamMemberMap[member.name] = data.id;
        console.log(`✅ Seeded team member: ${member.name}`);
      }
    }

    // 2. Seed Projects
    console.log("📝 Seeding projects...");
    const projectMap: { [key: string]: string } = {};

    for (const project of seedData.projects) {
      const ownerName = project.name === "NERVIX" ? "Dan" : "David";
      const owner_id = teamMemberMap[ownerName];

      const projectData = {
        ...project,
        owner_id,
        start_date: project.start_date?.toISOString(),
        target_completion: project.target_completion?.toISOString(),
      };

      const { data, error } = await supabase
        .from("projects")
        .insert([projectData])
        .select()
        .single();

      if (error) {
        console.error(`❌ Error seeding project ${project.name}:`, error);
      } else {
        projectMap[project.name] = data.id;
        console.log(`✅ Seeded project: ${project.name}`);
      }
    }

    // 3. Seed Project Roadmap
    console.log("📝 Seeding project roadmap...");
    for (const roadmapGroup of seedData.projectRoadmaps) {
      const projectId = projectMap[roadmapGroup.projectName];
      if (!projectId) {
        console.warn(`⚠️ Project not found for roadmap: ${roadmapGroup.projectName}`);
        continue;
      }

      for (const phase of roadmapGroup.phases) {
        const { error } = await supabase
          .from("project_roadmap")
          .insert([
            {
              project_id: projectId,
              phase: phase.phase,
              description: phase.description,
              status: phase.status,
              phase_order: phase.phase_order,
            },
          ]);

        if (error) {
          console.error(
            `❌ Error seeding roadmap phase ${phase.phase}:`,
            error
          );
        } else {
          console.log(`✅ Seeded roadmap: ${roadmapGroup.projectName} - ${phase.phase}`);
        }
      }
    }

    // 4. Seed Project Tasks
    console.log("📝 Seeding project tasks...");
    for (const tasksGroup of seedData.projectTasks) {
      const projectId = projectMap[tasksGroup.projectName];
      if (!projectId) {
        console.warn(`⚠️ Project not found for tasks: ${tasksGroup.projectName}`);
        continue;
      }

      for (const task of tasksGroup.tasks) {
        const { error } = await supabase
          .from("project_tasks")
          .insert([
            {
              project_id: projectId,
              task_id: task.task_id,
              title: task.title,
              status: task.status,
              priority: task.priority,
              assignee_id: null,
            },
          ]);

        if (error) {
          console.error(`❌ Error seeding task ${task.task_id}:`, error);
        } else {
          console.log(`✅ Seeded task: ${task.task_id}`);
        }
      }
    }

    // 5. Seed Piperclip Teams
    console.log("📝 Seeding piperclip teams...");
    for (const teamGroup of seedData.piperclipTeams) {
      const agentId = teamMemberMap[teamGroup.agentName];
      if (!agentId) {
        console.warn(`⚠️ Agent not found: ${teamGroup.agentName}`);
        continue;
      }

      for (const member of teamGroup.members) {
        const { error } = await supabase
          .from("piperclip_teams")
          .insert([
            {
              agent_id: agentId,
              member_name: member.memberName,
              role: member.role,
              task_count: member.task_count,
              status: member.status,
              focus_area: member.focus_area,
            },
          ]);

        if (error) {
          console.error(
            `❌ Error seeding piperclip member ${member.memberName}:`,
            error
          );
        } else {
          console.log(`✅ Seeded piperclip team member: ${member.memberName}`);
        }
      }
    }

    // 6. Seed Revenue Tracking
    console.log("📝 Seeding revenue tracking...");
    for (const revenue of seedData.revenueTracking) {
      const projectId = revenue.projectName ? projectMap[revenue.projectName] : null;

      const { error } = await supabase
        .from("revenue_tracking")
        .insert([
          {
            source: revenue.source,
            amount: revenue.amount,
            date: revenue.date?.toISOString(),
            project_id: projectId,
            notes: revenue.notes,
          },
        ]);

      if (error) {
        console.error(`❌ Error seeding revenue:`, error);
      } else {
        console.log(`✅ Seeded revenue: ${revenue.source} - $${revenue.amount}`);
      }
    }

    // 7. Seed System Connections
    console.log("📝 Seeding system connections...");
    for (const connection of seedData.systemConnections) {
      const { error } = await supabase
        .from("system_connections")
        .insert([
          {
            service_name: connection.service_name,
            status: connection.status,
            endpoint_url: connection.endpoint_url,
            health_check_url: connection.health_check_url,
            last_sync: new Date().toISOString(),
          },
        ]);

      if (error) {
        console.error(
          `❌ Error seeding connection ${connection.service_name}:`,
          error
        );
      } else {
        console.log(`✅ Seeded connection: ${connection.service_name}`);
      }
    }

    // 8. Seed Real-Time Metrics
    console.log("📝 Seeding real-time metrics...");
    for (const metric of seedData.realTimeMetrics) {
      const { error } = await supabase
        .from("real_time_metrics")
        .insert([
          {
            metric_name: metric.metric_name,
            value: metric.value,
            timestamp: new Date().toISOString(),
            metadata: metric.metadata,
          },
        ]);

      if (error) {
        console.error(`❌ Error seeding metric ${metric.metric_name}:`, error);
      } else {
        console.log(`✅ Seeded metric: ${metric.metric_name}`);
      }
    }

    console.log("✨ Database seed completed successfully!");
    return { success: true };
  } catch (error: any) {
    console.error("❌ Fatal error during seed:", error);
    return { success: false, error: error.message };
  }
}

// Run seed if executed directly
if (require.main === module) {
  seedDatabase()
    .then((result) => {
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error("Fatal error:", error);
      process.exit(1);
    });
}
