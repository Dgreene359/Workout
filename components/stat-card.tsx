import clsx from "clsx";

export function StatCard({
  label,
  value,
  tone = "light"
}: {
  label: string;
  value: string;
  tone?: "light" | "dark";
}) {
  return (
    <div className={clsx("rounded-md p-4", tone === "dark" ? "bg-ink text-white" : "bg-white shadow-soft")}>
      <p className={clsx("text-xs font-semibold uppercase", tone === "dark" ? "text-white/65" : "text-ink/55")}>
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold tracking-normal">{value}</p>
    </div>
  );
}
