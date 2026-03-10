import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DanAvatarProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const svgSizes = { sm: 32, md: 40, lg: 48, xl: 64 };

function HumanSvg({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} fill="none">
      {/* Head */}
      <circle cx="32" cy="20" r="10" fill="#e2e8f0" />
      {/* Hair */}
      <path d="M22 18c0-7 4.5-12 10-12s10 5 10 12" fill="#1e293b" />
      {/* Eyes */}
      <circle cx="28" cy="21" r="1.5" fill="#1e293b" />
      <circle cx="36" cy="21" r="1.5" fill="#1e293b" />
      {/* Smile */}
      <path d="M28 25.5c2 2 6 2 8 0" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* Body / shirt */}
      <path d="M18 45c0-9 6-14 14-14s14 5 14 14" fill="#3b82f6" />
      {/* Collar detail */}
      <path d="M28 31l4 4 4-4" stroke="#2563eb" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* Shoulders */}
      <path d="M18 45c-3-2-5-6-5-10" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
      <path d="M46 45c3-2 5-6 5-10" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function DanAvatar({ className, size = "md" }: DanAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };

  return (
    <Avatar className={className}>
      <AvatarImage src="/avatars/dan.png" alt="Dan" />
      <AvatarFallback className={`bg-gradient-to-br from-blue-500 to-blue-700 text-white overflow-hidden ${sizeClasses[size]}`}>
        <HumanSvg size={svgSizes[size]} />
      </AvatarFallback>
    </Avatar>
  );
}

export default DanAvatar;
