import * as icons from "lucide-react";
import type { LucideProps } from "lucide-react";
import type { ComponentType } from "react";

const iconMap = icons as unknown as Record<string, ComponentType<LucideProps>>;

/** Renders a lucide-react icon by its string name, so data modules (skills,
 * inventory, ...) can reference icons without importing React components. */
export function DynamicIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = iconMap[name] ?? icons.HelpCircle;
  return <Icon {...props} />;
}
