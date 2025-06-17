import { Bell, Search, Settings, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import {
  Home,
  Package,
  Clock,
  Calendar,
  Users,
  BarChart3,
  Archive,
  Star,
  HelpCircle,
  LogOut,
} from "lucide-react";
import Logout from "../Auth/logout";
import { Link } from "react-router-dom";

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
];;

const bottomItems = [
  { icon: Settings, label: "Settings" },
  { icon: LogOut, label: <Logout /> },
  { icon: HelpCircle, label: "Help" },
];

const DashboardHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="glass-effect border-b border-white/10 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Mobile menu button - only visible on mobile */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-64 p-0 glass-effect border-white/10"
            >
              <div className="h-full flex flex-col">
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
                          (item.path !== "/" &&
                            location.pathname.startsWith(item.path));

                        return (
                          <Link
                            key={index}
                            to={item.path}
                            className={`sidebar-item ${
                              isActive
                                ? "bg-white/10 border-l-2 border-cosmic-500"
                                : ""
                            }`}
                          >
                            <item.icon className="w-5 h-5 text-gray-300" />
                            <span className="text-gray-200 flex-1">
                              {item.label}
                            </span>
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
                      <div
                        key={index}
                        className="sidebar-item"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon className="w-5 h-5 text-gray-300" />
                        <span className="text-gray-200">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-time-gradient rounded-lg flex items-center justify-center animate-glow">
              <span className="text-white font-bold text-xs md:text-sm">
                TC
              </span>
            </div>
            <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-cosmic-400 to-nebula-400 bg-clip-text text-transparent hidden sm:block">
              Time Capsule Dashboard
            </h1>
            <h1 className="text-lg font-bold bg-gradient-to-r from-cosmic-400 to-nebula-400 bg-clip-text text-transparent sm:hidden">
              TC Dashboard
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Search - hidden on small mobile, shown on larger screens */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search capsules..."
              className="pl-10 w-40 md:w-64 bg-white/5 border-white/20 focus:border-cosmic-500"
              disabled={true}
            />
          </div>

          {/* Mobile search button */}
          <Button variant="ghost" size="icon" className="sm:hidden">
            <Search className="w-5 h-5" />
          </Button>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-4 h-4 md:w-5 md:h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 md:w-3 md:h-3 bg-nebula-500 rounded-full animate-pulse"></span>
          </Button>

          <Button variant="ghost" size="icon">
            <Settings className="w-4 h-4 md:w-5 md:h-5" />
          </Button>

          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
