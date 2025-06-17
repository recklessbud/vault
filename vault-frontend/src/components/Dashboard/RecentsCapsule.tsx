import { Button } from "@/components/ui/button";
import { GetVaultQuery } from "@/components/vault/getVaults";
import { useQuery } from "@tanstack/react-query";
import { getVault } from "@/api/vaults.api";
import { Link } from "react-router-dom";

const RecentCapsules = () => {
  const { data: vaults = [] } = useQuery({
    queryKey: ["vaults"],
    queryFn: getVault,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  });

  return (
    <div className="dashboard-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
        <h2 className="text-lg md:text-xl font-semibold text-white">
          Recent Capsules
        </h2>
        <Link to={"/users/dashboard/capsules"}>
          <Button
            variant="outline"
            className="border-cosmic-500 text-cosmic-400 hover:bg-cosmic-500/10 w-full sm:w-auto"
          >
            View All
          </Button>
        </Link>
      </div>
      <GetVaultQuery vaults={vaults} />
    </div>
  );
};

export default RecentCapsules;
