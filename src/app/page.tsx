import Link from "next/link";
import { DanAvatar, DavidAvatar, NanoAvatar } from "@/components/avatars";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const teamMembers = [
  {
    name: "Dan (Dexter Memo)",
    avatar: <DanAvatar size="xl" />,
    initials: "DM",
    color: "blue",
    role: "Team Lead",
    status: "online"
  },
  {
    name: "David",
    avatar: <DavidAvatar size="xl" />,
    initials: "DV",
    color: "green",
    role: "Developer",
    status: "online"
  },
  {
    name: "Nano",
    avatar: <NanoAvatar size="xl" />,
    initials: "NN",
    color: "purple",
    role: "AI Assistant",
    status: "active"
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            DansLab Team
          </h1>
          <p className="text-xl text-muted-foreground">
            Meet the team behind the magic
          </p>
          <Link
            href="/ecosystem"
            className="inline-flex items-center gap-2 mt-4 px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            View Live Ecosystem &rarr;
          </Link>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <Card key={member.name} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  {member.avatar}
                </div>
                <CardTitle className="text-2xl">{member.name}</CardTitle>
                <CardDescription className="text-base">{member.role}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Badge variant={member.status === "online" ? "default" : "secondary"}>
                  {member.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Avatar Sizes Demo */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Avatar Sizes</h2>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-sm">
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="text-center">
                <DanAvatar size="sm" />
                <p className="text-sm mt-2 text-muted-foreground">Small</p>
              </div>
              <div className="text-center">
                <DanAvatar size="md" />
                <p className="text-sm mt-2 text-muted-foreground">Medium</p>
              </div>
              <div className="text-center">
                <DanAvatar size="lg" />
                <p className="text-sm mt-2 text-muted-foreground">Large</p>
              </div>
              <div className="text-center">
                <DanAvatar size="xl" />
                <p className="text-sm mt-2 text-muted-foreground">Extra Large</p>
              </div>
            </div>
          </div>
        </div>

        {/* All Team Avatars */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Quick Access</h2>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-sm">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <DanAvatar size="md" />
                <span className="font-medium">Dan</span>
              </div>
              <div className="flex items-center gap-2">
                <DavidAvatar size="md" />
                <span className="font-medium">David</span>
              </div>
              <div className="flex items-center gap-2">
                <NanoAvatar size="md" />
                <span className="font-medium">Nano</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
