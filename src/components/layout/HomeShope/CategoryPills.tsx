// components/layout/HomeShope/CategoryPills.tsx
import { Package } from "lucide-react";

interface CategoryPillsProps {
  categories: any[];
  selected: string;
  onSelect: (name: string) => void;
}

export default function CategoryPills({
  categories,
  selected,
  onSelect,
}: CategoryPillsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
      {/* All */}
      <button
        onClick={() => onSelect("All")}
        className={`flex items-center gap-2 px-4 h-10 rounded-full whitespace-nowrap text-xs font-medium transition-all ${
          selected === "All"
            ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md"
            : "bg-card border border-border/60 hover:border-rose-300 text-muted-foreground hover:text-foreground"
        }`}
      >
        <Package className="w-3.5 h-3.5" />
        All
      </button>

      {/* Dynamic categories */}
      {categories.map((cat) => {
        const name = typeof cat === "string" ? cat : cat.name;
        const count = typeof cat === "object" ? cat.count : undefined;
        const isActive = selected === name;

        return (
          <button
            key={name}
            onClick={() => onSelect(name)}
            className={`flex items-center gap-2 px-4 h-10 rounded-full whitespace-nowrap text-xs font-medium transition-all ${
              isActive
                ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md"
                : "bg-card border border-border/60 hover:border-rose-300 text-muted-foreground hover:text-foreground"
            }`}
          >
            {name}
            {count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? "bg-white/25 text-white"
                    : "bg-stone-100 dark:bg-stone-800 text-muted-foreground"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}