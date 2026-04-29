interface StateMessageProps {
  variant: "empty" | "error" | "config";
  icon?: string;
  title: string;
  message?: string;
  hint?: string;
}

const VARIANT_STYLES: Record<
  StateMessageProps["variant"],
  { ring: string; iconBg: string; iconColor: string }
> = {
  empty: {
    ring: "border-[#c0392b]/15",
    iconBg: "bg-[#1a0a0a]",
    iconColor: "text-[#a29bfe]",
  },
  error: {
    ring: "border-[#ff5252]/30",
    iconBg: "bg-[#1a0a0a]",
    iconColor: "text-[#ff5252]",
  },
  config: {
    ring: "border-[#d4a017]/30",
    iconBg: "bg-[#1a0a0a]",
    iconColor: "text-[#d4a017]",
  },
};

export default function StateMessage({
  variant,
  icon,
  title,
  message,
  hint,
}: StateMessageProps) {
  const styles = VARIANT_STYLES[variant];
  const fallbackIcon =
    variant === "error" ? "⚠" : variant === "config" ? "⚙" : "📭";
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`card-base ${styles.ring} p-8 text-center sm:p-12`}
    >
      <div
        className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${styles.iconBg} text-2xl ${styles.iconColor}`}
      >
        {icon || fallbackIcon}
      </div>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {message && (
        <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">{message}</p>
      )}
      {hint && (
        <p className="mx-auto mt-3 max-w-md font-mono text-xs text-zinc-500">
          {hint}
        </p>
      )}
    </div>
  );
}
