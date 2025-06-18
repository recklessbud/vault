import { getSharedVaultApi } from "@/api/vaults.api";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar, Lock, Users, Clock, ArrowLeft, Share2 } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export const GetSharedVaults = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["vaults"],
    queryFn: () => getSharedVaultApi(),
    
  });

  if (query.isError) {
    console.log(query.error);
  }

  const queryData = query.data ?? [];

  // Debug: log the query object and error
  console.log("Shared Vaults Data:", queryData);

  if (query.isLoading) {
    return (
      <div className="text-center py-12 text-gray-400">
        Loading shared capsules...
      </div>
    );
  }

  return (
    <div>
      {/* Empty State */}
      {queryData.length === 0 ? (
        <div className="text-center py-12">
          <Share2 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            No shared capsules yet
          </h3>
          <p className="text-gray-500">
            When others share capsules with you, they'll appear here.
          </p>
         
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="glass-effect rounded-lg p-6 border border-white/10 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-cosmic-400">
                  {queryData.length}
                </div>
                <div className="text-sm text-gray-400">Shared Capsules</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {
                    (Array.isArray (queryData) ? queryData : []).filter(
                      (c) => (c.daysLeft ?? c.vaultItem?.daysLeft) < 30
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-400">Unlocking Soon</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">
                  {queryData.length}
                </div>
                <div className="text-sm text-gray-400">Total Collaborators</div>
              </div>
            </div>
          </div>

          {/* Shared Capsules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(Array.isArray (queryData) ? queryData : []).map((capsule) => (
              <div
                key={capsule.id}
                className="glass-effect rounded-lg p-6 border border-white/10 hover:border-cosmic-500/50 transition-all duration-300"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <h3 className="font-semibold text-white text-lg">
                    {capsule.vaultItem?.title ?? capsule.title ?? "Untitled"}
                  </h3>
                  <Users className="w-4 h-4 text-nebula-400" />
                  <Lock className="w-4 h-4 text-cosmic-400" />
                </div>

                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {capsule.vaultItem?.content ?? capsule.content ?? ""}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Share2 className="w-3 h-3" />
                    <span>
                      Shared by{" "}
                      {capsule.sharedBy?.username ??
                        capsule.sharedBy ??
                        "Unknown"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>
                      Unlocks{" "}
                      {capsule.vaultItem?.unlockAt ??
                        capsule.unlockAt ??
                        "Unknown"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>
                      {capsule.vaultItem?.daysLeft ?? capsule.daysLeft ?? "?"}{" "}
                      days left
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      (capsule.daysLeft ?? capsule.vaultItem?.daysLeft) < 30
                  ? "bg-green-500/20 text-green-400"
                  : "bg-cosmic-500/20 text-cosmic-400"
                    }`}
                  >
                  {capsule.daysLeft ?? capsule.vaultItem?.daysLeft == 0 ? "Unlocked" : "Locked"}
                  </div>

                  <Link to={`/users/dashboard/capsules/${capsule.vaultItem?.id}/details`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-cosmic-400 hover:bg-cosmic-500/10"
                    >
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
