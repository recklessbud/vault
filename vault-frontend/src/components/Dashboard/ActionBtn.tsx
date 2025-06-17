import { Plus, Upload, Calendar, Users, Archive, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateCapsuleModal from "./CreateCapsule";
import { Link } from "react-router-dom";

const quickActions = [
  {
    icon: Plus,
    title: "Create New Capsule",
    description: "Start a new time capsule",
    color: "cosmic",
    primary: true,
  },
  {
    icon: Upload,
    title: "Upload Content",
    description: "Add files to existing capsule",
    color: "nebula",
  },
  {
    icon: Users,
    title: "Invite Collaborators",
    description: "Share with friends & family",
    color: "cosmic",
  },
  {
    icon: Calendar,
    title: "Schedule Unlock",
    description: "Set future unlock dates",
    color: "nebula",
  },
  {
    icon: Archive,
    title: "Archive Capsule",
    description: "Move to archive",
    color: "cosmic",
  },
  {
    icon: Star,
    title: "Mark Favorite",
    description: "Add to favorites",
    color: "nebula",
  },
];

const QuickActions = () => {
  return (
    <div className="dashboard-card">
      <h2 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 gap-3 md:gap-4">
        {quickActions.map((action, index) => {
          const ActionButton = (
            <Button
              key={index}
              variant="ghost"
              className={`h-auto p-3 md:p-4 flex items-center space-x-3 text-left hover:bg-white/5 border border-white/10 hover:border-${
                action.color
              }-500/50 transition-all duration-300 ${
                action.primary ? "ring-2 ring-cosmic-500/50" : ""
              }`}
            >
              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br flex-shrink-0 ${
                  action.color === "cosmic"
                    ? "from-cosmic-500 to-cosmic-600"
                    : "from-nebula-500 to-nebula-600"
                } flex items-center justify-center`}
              >
                <action.icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm md:text-base truncate">
                  {action.title}
                </h3>
                <p className="text-gray-400 text-xs md:text-sm truncate">
                  {action.description}
                </p>
              </div>
            </Button>
          );

          // Wrap the first action (Create New Capsule) with the modal
          if (index === 0) {
            return (
              <CreateCapsuleModal key={index}>
                {ActionButton}
              </CreateCapsuleModal>
            );
          }

          if (index === 1) {
            return (
              <Button
                key={index}
                variant="ghost"
                asChild
                className={`h-auto p-3 md:p-4 flex items-center space-x-3 text-left hover:bg-white/5 border border-white/10 hover:border-${action.color}-500/50 transition-all duration-300`}
              >
                <Link to="/users/dashboard/capsules">
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br flex-shrink-0 ${
                      action.color === "cosmic"
                        ? "from-cosmic-500 to-cosmic-600"
                        : "from-nebula-500 to-nebula-600"
                    } flex items-center justify-center`}
                  >
                    <action.icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm md:text-base truncate">
                      {action.title}
                    </h3>
                    <p className="text-gray-400 text-xs md:text-sm truncate">
                      {action.description}
                    </p>
                  </div>
                </Link>
              </Button>
            );
          }

          return ActionButton;
        })}
      </div>
    </div>
  );
};

export default QuickActions;
