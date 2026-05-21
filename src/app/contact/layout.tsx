import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — DansLab",
  description:
    "Partnership, press, investor, or consulting inquiry — send a structured message direct to Dan via email or WhatsApp.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
