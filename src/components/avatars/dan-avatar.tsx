import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DanAvatarProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function DanAvatar({ className, size = "md" }: DanAvatarProps) {
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
      <AvatarImage src="/avatars/dan.png" alt="Dan" />
      <AvatarFallback className={`bg-gradient-to-br from-blue-500 to-blue-700 text-white font-semibold ${sizeClasses[size]}`}>
        <span className={textSizeClasses[size]}>DM</span>
      </AvatarFallback>
    </Avatar>
  );
}

export default DanAvatar;
