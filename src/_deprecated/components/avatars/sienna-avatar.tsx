import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface SiennaAvatarProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const svgSizes = { sm: 32, md: 40, lg: 48, xl: 64 };

function SiennaSvg({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 80 80" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="siBg" x1="40" y1="10" x2="40" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#be185d" />
        </linearGradient>
        <radialGradient id="siFace" cx="40%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Hair back */}
      <ellipse cx="40" cy="24" rx="18" ry="16" fill="#92400e" />
      {/* Head */}
      <ellipse cx="40" cy="26" rx="14" ry="16" fill="#fde68a" />
      <ellipse cx="40" cy="26" rx="14" ry="16" fill="url(#siFace)" />
      {/* Hair front */}
      <path d="M26 22 C28 14 36 10 40 10 C44 10 52 14 54 22 C52 16 44 14 40 15 C36 14 28 16 26 22Z" fill="#92400e" />
      {/* Side hair */}
      <path d="M26 24 C24 28 23 35 25 40" stroke="#92400e" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M54 24 C56 28 57 35 55 40" stroke="#92400e" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Eyes */}
      <ellipse cx="34" cy="27" rx="2.5" ry="2.8" fill="white" />
      <ellipse cx="46" cy="27" rx="2.5" ry="2.8" fill="white" />
      <circle cx="34.3" cy="27.3" r="1.2" fill="#be185d" />
      <circle cx="46.3" cy="27.3" r="1.2" fill="#be185d" />
      {/* Eyelashes */}
      <path d="M31 25 L32 26" stroke="#92400e" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M49 25 L48 26" stroke="#92400e" strokeWidth="0.8" strokeLinecap="round" />
      {/* Smile */}
      <path d="M36 34 Q40 38 44 34" stroke="#be185d" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* Blush */}
      <circle cx="30" cy="32" r="3" fill="#fda4af" opacity="0.4" />
      <circle cx="50" cy="32" r="3" fill="#fda4af" opacity="0.4" />
      {/* Neck */}
      <rect x="36" y="41" width="8" height="5" rx="2" fill="#fde68a" />
      {/* Body / dress */}
      <path d="M24 48 C28 44 36 44 40 44 C44 44 52 44 56 48 L58 70 L22 70Z" fill="url(#siBg)" />
      {/* Collar detail */}
      <path d="M34 46 L40 50 L46 46" stroke="#fda4af" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Star accessory */}
      <circle cx="40" cy="55" r="3" fill="#fda4af" opacity="0.6" />
    </svg>
  );
}

export function SiennaAvatar({ className, size = "md" }: SiennaAvatarProps) {
  return (
    <Avatar className={className}>
      <AvatarFallback className="bg-gradient-to-br from-pink-500 to-pink-700 text-white font-semibold">
        <SiennaSvg size={svgSizes[size]} />
      </AvatarFallback>
    </Avatar>
  );
}

export default SiennaAvatar;
