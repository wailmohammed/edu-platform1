import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { BadgeDisplay } from "@/components/BadgeDisplay";
import { Loader2 } from "lucide-react";

export function UserProfileBadges() {
  const { user } = useAuth();
  const { data: badges, isLoading } = trpc.badges.getUserBadges.useQuery(undefined, {
    enabled: !!user,
  });

  if (isLoading) return <Loader2 className="w-4 h-4 animate-spin" />;

  if (!badges?.length) {
    return <p className="text-sm text-gray-600">No badges earned yet. Keep learning!</p>;
  }

  return <BadgeDisplay badges={badges} />;
}