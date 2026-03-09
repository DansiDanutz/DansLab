import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DavidAvatarProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function DavidAvatar({ className, size = "md" }: DavidAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg"
  };

  return (
    <Avatar className={className}>
      <AvatarImage src="/avatars/david.png" alt="David" />
      <AvatarFallback className={`bg-gradient-to-br from-green-500 to-green-700 text-white font-semibold ${sizeClasses[size]}`}>
        <span className={textSizeClasses[size]}>DV</span>
      </AvatarFallback>
    </Avatar>
  );
}

export default DavidAvatar;
