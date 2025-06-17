import { getVault } from "@/api/vaults.api";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Lock, Users, Clock, Unlock } from "lucide-react";
import React from "react";

type Capsule = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  unlockAt: string;
  daysLeft: number;
  type: string;
  // ...other fields...
};

type GetVaultQueryProps = {
  vaults?: Capsule[];
};

export const GetVaultQuery: React.FC<GetVaultQueryProps> = ({ vaults }) => {
  const VaultQuery = useQuery({
    queryKey: ["vaults"],
    queryFn: getVault,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  });

  const truncateText = (text: string, wordCount: number): string => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= wordCount) {
      return text;
    }
    return words.slice(0, wordCount).join(" ") + "...";
  };

  // Use prop if provided, else fallback to query data
  const vaultData = React.useMemo(() => {
    const data = Array.isArray(vaults)
      ? vaults
      : Array.isArray(VaultQuery.data)
      ? VaultQuery.data
      : [];
    return [...data]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);
  }, [vaults, VaultQuery.data]);

  return (
    <div className="space-y-3 md:space-y-4">
      {vaultData.map((capsule) => (
        <div
          key={capsule.id}
          className="glass-effect rounded-lg p-3 md:p-4 border border-white/10 hover:border-cosmic-500/50 transition-all duration-300"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-white text-sm md:text-base truncate">
                  {capsule.title}
                </h3>
                {capsule.type === "shared" && (
                  <Users className="w-3 h-3 md:w-4 md:h-4 text-nebula-400 flex-shrink-0" />
                )}
                {capsule.daysLeft === 0 ? (
                  <Unlock className="w-3 h-3 md:w-4 md:h-4 text-green-400 flex-shrink-0" />
                ) : (
                  <Lock className="w-3 h-3 md:w-4 md:h-4 text-cosmic-400 flex-shrink-0" />
                )}
              </div>

              <p className="text-gray-400 text-xs md:text-sm mb-3 line-clamp-2">
                {truncateText(capsule.content, 10)}
              </p>

              <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">Unlocks {capsule.unlockAt}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 flex-shrink-0" />
                  <span>{capsule.daysLeft} days left</span>
                </div>
                {/* {capsule.collaborators > 1 && (
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3 flex-shrink-0" />
                    <span>{capsule.collaborators} collaborators</span>
                  </div>
                )} */}
              </div>
            </div>

            <div className="flex-shrink-0">
              <div
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                  capsule.daysLeft === 0
                    ? "bg-green-500/20 text-green-400"
                    : "bg-cosmic-500/20 text-cosmic-400"
                }`}
              >
                {capsule.daysLeft == 0 ? "Unlocked" : "Locked"}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
