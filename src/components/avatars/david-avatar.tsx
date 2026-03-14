import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DavidAvatarProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const svgSizes = { sm: 32, md: 40, lg: 48, xl: 64 };

function RobotSvg({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 80 80" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dvBg" x1="40" y1="10" x2="40" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="dvVisor" x1="25" y1="22" x2="55" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a7f3d0" />
          <stop offset="100%" stopColor="#6ee7b7" />
        </linearGradient>
      </defs>
      {/* Antenna */}
      <line x1="40" y1="8" x2="40" y2="16" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
      <circle cx="40" cy="6" r="3" fill="#34d399" />
      {/* Head */}
      <rect x="22" y="16" width="36" height="28" fill="url(#dvBg)" rx="8" />
      {/* Visor */}
      <rect x="27" y="22" width="26" height="10" rx="5" fill="url(#dvVisor)" opacity="0.9" />
      {/* Eyes */}
      <circle cx="34" cy="27" r="2.5" fill="white" />
      <circle cx="46" cy="27" r="2.5" fill="white" />
      <circle cx="34.5" cy="27.5" r="1" fill="#1e1b4b" />
      <circle cx="46.5" cy="27.5" r="1" fill="#1e1b4b" />
      {/* Mouth */}
      <rect x="34" y="36" width="12" height="2" rx="1" fill="#a7f3d0" opacity="0.7" />
      {/* Neck */}
      <rect x="36" y="44" width="8" height="5" rx="2" fill="#059669" />
      {/* Body */}
      <rect x="24" y="48" width="32" height="22" rx="6" fill="url(#dvBg)" />
      {/* Chest light */}
      <circle cx="40" cy="57" r="4" fill="#a7f3d0" opacity="0.8" />
      <circle cx="40" cy="57" r="2" fill="white" opacity="0.6" />
      {/* Arms */}
      <rect x="14" y="50" width="8" height="16" rx="4" fill="#059669" />
      <rect x="58" y="50" width="8" height="16" rx="4" fill="#059669" />
    </svg>
  );
}

export function DavidAvatar({ className, size = "md" }: DavidAvatarProps) {
  return (
    <Avatar className={className}>
      <AvatarFallback className={`bg-gradient-to-br from-green-500 to-green-700 text-white font-semibold`}>
        <RobotSvg size={svgSizes[size]} />
      </AvatarFallback>
    </Avatar>
  );
}

export default DavidAvatar;
