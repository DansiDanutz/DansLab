import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NanoAvatarProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function NanoAvatar({ className, size = "md" }: NanoAvatarProps) {
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
      <AvatarImage src="/avatars/nano.png" alt="Nano" />
      <AvatarFallback className={`bg-gradient-to-br from-purple-500 to-purple-700 text-white font-semibold ${sizeClasses[size]}`}>
        <span className={textSizeClasses[size]}>NN</span>
      </AvatarFallback>
    </Avatar>
  );
}

export default NanoAvatar;
