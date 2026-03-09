import type { Metadata } from "next";
import LabCanvas from "@/components/lab/LabCanvas";

export const metadata: Metadata = {
  title: "DansLab Lab",
  description:
    "Internal DansLab view with Dan, David on Mac Studio, and the OpenClaw agent mesh.",
};

export default function LabPage() {
  return <LabCanvas />;
}
