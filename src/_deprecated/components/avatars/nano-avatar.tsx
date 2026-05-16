import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NanoAvatarProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const svgSizes = { sm: 32, md: 40, lg: 48, xl: 64 };

function NanoSvg({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 80 80" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="nnBg" x1="40" y1="10" x2="40" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      {/* Head - rounded square */}
      <rect x="18" y="12" width="44" height="36" fill="url(#nnBg)" rx="12" />
      {/* Eyes - glowing */}
      <circle cx="32" cy="28" r="5" fill="#c4b5fd" />
      <circle cx="48" cy="28" r="5" fill="#c4b5fd" />
      <circle cx="32" cy="28" r="2.5" fill="white" />
      <circle cx="48" cy="28" r="2.5" fill="white" />
      <circle cx="33" cy="27" r="1" fill="#1e1b4b" />
      <circle cx="49" cy="27" r="1" fill="#1e1b4b" />
      {/* Smile */}
      <path d="M34 38 Q40 43 46 38" stroke="#c4b5fd" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Ears/sensors */}
      <rect x="12" y="24" width="6" height="12" rx="3" fill="#7c3aed" />
      <rect x="62" y="24" width="6" height="12" rx="3" fill="#7c3aed" />
      {/* Body */}
      <rect x="26" y="50" width="28" height="20" rx="6" fill="url(#nnBg)" />
      {/* Chest pattern */}
      <circle cx="40" cy="58" r="3" fill="#c4b5fd" opacity="0.8" />
      <circle cx="40" cy="58" r="1.5" fill="white" opacity="0.5" />
      {/* Arms */}
      <rect x="16" y="52" width="8" height="14" rx="4" fill="#7c3aed" />
      <rect x="56" y="52" width="8" height="14" rx="4" fill="#7c3aed" />
    </svg>
  );
}

export function NanoAvatar({ className, size = "md" }: NanoAvatarProps) {
  return (
    <Avatar className={className}>
      <AvatarFallback className={`bg-gradient-to-br from-purple-500 to-purple-700 text-white font-semibold`}>
        <NanoSvg size={svgSizes[size]} />
      </AvatarFallback>
    </Avatar>
  );
}

export default NanoAvatar;
