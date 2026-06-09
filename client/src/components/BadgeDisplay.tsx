import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BadgeDisplayProps {
  badges: Array<{ id: number; name: string; tier: string; icon: string; description: string }>;
  className?: string;
}

export function BadgeDisplay({ badges, className }: BadgeDisplayProps) {
  const tierColors = {
    Bronze: "bg-amber-600",
    Silver: "bg-gray-400",
    Gold: "bg-yellow-500",
    Platinum: "bg-blue-400",
    Diamond: "bg-cyan-300",
  };

  return (
    <div className={cn("grid grid-cols-4 gap-4", className)}>
      {badges.map((badge) => (
        <div key={badge.id} className="flex flex-col items-center p-3 border rounded-lg hover:shadow-md transition-shadow">
          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2", tierColors[badge.tier as keyof typeof tierColors] || "bg-gray-300")}>
            {badge.icon}
          </div>
          <span className="text-xs font-medium text-center">{badge.name}</span>
          <Badge variant="outline" className="text-xs mt-1 capitalize">{badge.tier}</Badge>
        </div>
      ))}
    </div>
  );
}