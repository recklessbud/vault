import Logout from "../Auth/logout";
import {
  Home,
  Package,
  Clock,
  Calendar,
  Users,
  BarChart3,
  Archive,
  Star,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const sidebarItems = [
  { icon: Home, label: "Overview", path: "/users/dashboard", count: undefined },
  {
    icon: Package,
    label: "My Capsules",
    path: "/users/dashboard/capsules",
    count: undefined,
  },
  {
    icon: Clock,
    label: "Pending",
    path: "/capsules?filter=pending",
    count: undefined,
  },
  {
    icon: Calendar,
    label: "Scheduled",
    path: "/capsules?filter=scheduled",
    count: undefined,
  },
  {
    icon: Users,
    label: "Shared",
    path: "/users/dashboard/capsules/shared",
    count: undefined,
  },
  {
    icon: Archive,
    label: "Archived",
    path: "/capsules?filter=archived",
    count: undefined,
  },
  {
    icon: Star,
    label: "Favorites",
    path: "/capsules?filter=favorites",
    count: undefined,
  },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
];

const bottomItems = [
  { icon: Settings, label: "Settings" },
  { icon: LogOut, label: <Logout /> },
  { icon: HelpCircle, label: "Help & Support" }
];

const DashboardSidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 h-screen glass-effect border-r border-white/10 flex flex-col">
      <div className="p-6">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Navigation
          </h2>
          <div className="space-y-1">
            {sidebarItems.map((item, index) => {
              const isActive =
                location.pathname === item.path ||
                (item.path === "/" && location.pathname === "/") ||
                (item.path !== "/" && location.pathname.startsWith(item.path));

              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`sidebar-item ${
                    isActive ? "bg-white/10 border-l-2 border-cosmic-500" : ""
                  }`}
                >
                  <item.icon className="w-5 h-5 text-gray-300" />
                  <span className="text-gray-200 flex-1">{item.label}</span>
                  {item.count && (
                    <span className="bg-cosmic-500/20 text-cosmic-300 text-xs px-2 py-1 rounded-full">
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-white/10">
        <div className="space-y-1">
          {bottomItems.map((item, index) => (
            <div key={index} className="sidebar-item">
              <item.icon className="w-5 h-5 text-gray-300" />
              <span className="text-gray-200">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
