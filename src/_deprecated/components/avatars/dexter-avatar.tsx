import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DexterAvatarProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const svgSizes = { sm: 32, md: 40, lg: 48, xl: 64 };

function RobotSvg({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 80 80" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dxBg" x1="40" y1="10" x2="40" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="dxVisor" x1="25" y1="22" x2="55" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
      {/* Antenna */}
      <line x1="40" y1="8" x2="40" y2="15" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" />
      <circle cx="40" cy="6" r="3" fill="#c084fc" />
      {/* Head */}
      <rect x="22" y="15" width="36" height="28" rx="8" fill="url(#dxBg)" />
      {/* Visor */}
      <rect x="27" y="22" width="26" height="10" rx="5" fill="url(#dxVisor)" opacity="0.9" />
      {/* Eyes */}
      <circle cx="34" cy="27" r="2.5" fill="white" />
      <circle cx="46" cy="27" r="2.5" fill="white" />
      <circle cx="34.5" cy="27.5" r="1" fill="#1e1b4b" />
      <circle cx="46.5" cy="27.5" r="1" fill="#1e1b4b" />
      {/* Mouth */}
      <rect x="34" y="36" width="12" height="2" rx="1" fill="#c084fc" opacity="0.7" />
      {/* Neck */}
      <rect x="36" y="43" width="8" height="5" rx="2" fill="#7c3aed" />
      {/* Body */}
      <rect x="24" y="48" width="32" height="22" rx="6" fill="url(#dxBg)" />
      {/* Chest light */}
      <circle cx="40" cy="57" r="4" fill="#38bdf8" opacity="0.8" />
      <circle cx="40" cy="57" r="2" fill="white" opacity="0.6" />
      {/* Arms */}
      <rect x="14" y="50" width="8" height="16" rx="4" fill="#7c3aed" />
      <rect x="58" y="50" width="8" height="16" rx="4" fill="#7c3aed" />
    </svg>
  );
}

export function DexterAvatar({ className, size = "md" }: DexterAvatarProps) {
  return (
    <Avatar className={className}>
      <AvatarFallback className={`bg-gradient-to-br from-purple-500 to-violet-700 text-white font-semibold`}>
        <RobotSvg size={svgSizes[size]} />
      </AvatarFallback>
    </Avatar>
  );
}

export default DexterAvatar;
