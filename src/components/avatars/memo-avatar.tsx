import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MemoAvatarProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const svgSizes = { sm: 32, md: 40, lg: 48, xl: 64 };

function MemoSvg({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 80 80" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mmBg" x1="40" y1="10" x2="40" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
        <linearGradient id="mmScreen" x1="28" y1="20" x2="52" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      {/* Notepad body */}
      <rect x="18" y="12" width="44" height="56" rx="6" fill="url(#mmBg)" />
      {/* Spiral binding */}
      <circle cx="22" cy="18" r="2" fill="#fbbf24" />
      <circle cx="22" cy="26" r="2" fill="#fbbf24" />
      <circle cx="22" cy="34" r="2" fill="#fbbf24" />
      <circle cx="22" cy="42" r="2" fill="#fbbf24" />
      {/* Screen / page area */}
      <rect x="28" y="16" width="30" height="28" rx="4" fill="url(#mmScreen)" opacity="0.9" />
      {/* Face on screen */}
      {/* Eyes */}
      <circle cx="37" cy="27" r="2.5" fill="white" />
      <circle cx="49" cy="27" r="2.5" fill="white" />
      <circle cx="37.5" cy="27.5" r="1" fill="#1c1917" />
      <circle cx="49.5" cy="27.5" r="1" fill="#1c1917" />
      {/* Happy smile */}
      <path d="M38 34 Q43 38 48 34" stroke="#c2410c" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Lines (memo text) */}
      <rect x="30" y="50" width="20" height="2" rx="1" fill="#fbbf24" opacity="0.6" />
      <rect x="30" y="55" width="14" height="2" rx="1" fill="#fbbf24" opacity="0.4" />
      <rect x="30" y="60" width="18" height="2" rx="1" fill="#fbbf24" opacity="0.3" />
      {/* Pencil accessory */}
      <rect x="56" y="48" width="4" height="18" rx="1" fill="#fbbf24" transform="rotate(-15 58 57)" />
      <polygon points="56,66 58,72 60,66" fill="#fbbf24" transform="rotate(-15 58 69)" />
    </svg>
  );
}

export function MemoAvatar({ className, size = "md" }: MemoAvatarProps) {
  return (
    <Avatar className={className}>
      <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-700 text-white font-semibold">
        <MemoSvg size={svgSizes[size]} />
      </AvatarFallback>
    </Avatar>
  );
}

export default MemoAvatar;
