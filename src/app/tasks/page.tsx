import { TaskNewsroom } from "@/components/tasks/TaskNewsroom";
import "./tasks.css";

export const metadata = {
  title: "Tasks",
  description: "Private task newsroom.",
  robots: { index: false, follow: false },
};

export default function TasksPage() {
  return <TaskNewsroom />;
}
