import {
  Coffee,
  Compass,
  Dumbbell,
  Gamepad2,
  Puzzle,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { GameCategory } from "@/types/game";

const icons: Record<GameCategory, LucideIcon> = {
  all: Gamepad2,
  arcade: Gamepad2,
  adventure: Compass,
  puzzle: Puzzle,
  action: Zap,
  casual: Coffee,
  sports: Dumbbell,
};

interface CategoryIconProps {
  category: GameCategory;
  variant?: "default" | "dark";
  className?: string;
}

export default function CategoryIcon({
  category,
  variant = "default",
  className = "h-3.5 w-3.5",
}: CategoryIconProps) {
  const Icon = icons[category];

  return (
    <Icon
      aria-hidden="true"
      className={`category-icon category-icon-${category} ${className} shrink-0 ${
        variant === "dark" ? "category-icon-on-dark" : ""
      }`}
      strokeWidth={2.5}
    />
  );
}
