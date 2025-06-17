import { getSharedVaultCountApi, getVault } from "@/api/vaults.api";
import { useQuery } from "@tanstack/react-query";
import { Package, Clock, Users, TrendingUp } from "lucide-react";

const DashboardStats = () => {
  const VaultQuery = useQuery({
    queryKey: ["vaults"],
    queryFn: () => getVault(),
  });
  const {data, isError} = useQuery({
    queryKey: ["sharedVaults"],
    queryFn: () => getSharedVaultCountApi(),
  })
  if(isError) return null
  const vaultData = Array.isArray(VaultQuery.data) ? VaultQuery.data : [];

  if(VaultQuery.isLoading) return null
  
  const vaultsThisMonth = vaultData.filter(capsule => {
    const createdDate = new Date(capsule.createdAt);
    const now = new Date();
    return (
      createdDate.getMonth() === now.getMonth() &&
      createdDate.getFullYear() === now.getFullYear()
    );
  }).length;
  const stats = [
    {
      icon: Package,
      label: "Total Capsules",
      value: vaultData.length,
      change: "+12%",
      changeType: "positive" as const,
      color: "cosmic",
    },
    {
      icon: Clock,
      label: "Pending Unlocks",
      value: vaultData.filter((capsule) => capsule.unlocked === false).length,
      change: "+3",
      changeType: "positive" as const,
      color: "nebula",
    },
    {
      icon: Users,
      label: "Shared By",
      value: data,
      change: "+24",
      changeType: "positive" as const,
      color: "cosmic",
    },
    {
      icon: TrendingUp,
      label: "This Month",
      value: vaultsThisMonth,
      change: "+5%",
      changeType: "positive" as const,
      color: "nebula",
    },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="stat-card animate-float"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div
            className={`w-8 h-8 md:w-12 md:h-12 rounded-lg bg-gradient-to-br ${
              stat.color === "cosmic"
                ? "from-cosmic-500 to-cosmic-600"
                : "from-nebula-500 to-nebula-600"
            } flex items-center justify-center mx-auto mb-2 md:mb-4`}
          >
            <stat.icon className="w-4 h-4 md:w-6 md:h-6 text-white" />
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
            {stat.value}
          </h3>
          <p className="text-gray-400 text-xs md:text-sm mb-2">{stat.label}</p>

          <div
            className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${
              stat.changeType === "positive"
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            {stat.change}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
