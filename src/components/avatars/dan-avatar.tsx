import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DanAvatarProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const svgSizes = { sm: 32, md: 40, lg: 48, xl: 64 };

function HumanSvg({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 80 80" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="skinGrad" x1="40" y1="12" x2="40" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#d4a574" />
        </linearGradient>
        <linearGradient id="shirtGrad" x1="40" y1="40" x2="40" y2="72" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <radialGradient id="faceLight" cx="38%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Neck */}
      <rect x="35" y="35" width="10" height="8" rx="3" fill="url(#skinGrad)" />

      {/* Body / shirt */}
      <path d="M20 70 C20 52 28 42 40 42 C52 42 60 52 60 70" fill="url(#shirtGrad)" />
      {/* Collar */}
      <path d="M33 42 L40 50 L47 42" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Shirt button */}
      <circle cx="40" cy="56" r="1" fill="#60a5fa" opacity="0.7" />

      {/* Head shape */}
      <ellipse cx="40" cy="24" rx="14" ry="16" fill="url(#skinGrad)" />
      <ellipse cx="40" cy="24" rx="14" ry="16" fill="url(#faceLight)" />

      {/* Ears */}
      <ellipse cx="26" cy="25" rx="2.5" ry="4" fill="#d4a574" />
      <ellipse cx="54" cy="25" rx="2.5" ry="4" fill="#d4a574" />

      {/* Hair */}
      <path d="M26 20 C26 10 32 6 40 6 C48 6 54 10 54 20 C54 14 48 10 40 10 C32 10 26 14 26 20Z" fill="#1a1a2e" />
      <path d="M26 20 C25 16 26 12 30 10" stroke="#2d2d44" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      <path d="M54 20 C55 16 54 12 50 10" stroke="#2d2d44" strokeWidth="1" strokeLinecap="round" opacity="0.5" />

      {/* Eyebrows */}
      <path d="M31 19 C32 17.5 35 17.5 36 19" stroke="#1a1a2e" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M44 19 C45 17.5 48 17.5 49 19" stroke="#1a1a2e" strokeWidth="1.2" strokeLinecap="round" fill="none" />

      {/* Eyes */}
      <ellipse cx="33.5" cy="23" rx="2.8" ry="2.2" fill="white" />
      <ellipse cx="46.5" cy="23" rx="2.8" ry="2.2" fill="white" />
      <circle cx="34" cy="23" r="1.4" fill="#1a1a2e" />
      <circle cx="47" cy="23" r="1.4" fill="#1a1a2e" />
      <circle cx="34.4" cy="22.4" r="0.5" fill="white" />
      <circle cx="47.4" cy="22.4" r="0.5" fill="white" />

      {/* Nose */}
      <path d="M39 26 C39 28 40 29.5 41 29.5 C42 29.5 41 28 41 26" stroke="#c49a6c" strokeWidth="0.8" strokeLinecap="round" fill="none" />

      {/* Smile */}
      <path d="M34 32 C36 35 44 35 46 32" stroke="#a0522d" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M36 33 C38 34.5 42 34.5 44 33" fill="#c0392b" opacity="0.3" />
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
