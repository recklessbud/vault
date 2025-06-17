
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import DashboardStats from "@/components/Dashboard/DashboardStats";
import RecentCapsules from "@/components/Dashboard/RecentsCapsule";
import QuickActions from "@/components/Dashboard/ActionBtn";
import { UserQuery } from "@/components/User.query";


const DashboardIndex = () => {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Sidebar - Hidden on mobile, shown on desktop */}
      <div className="hidden lg:block">
        <DashboardSidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader />
        
        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 space-y-4 md:space-y-6">
            {/* Welcome Section */}
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Welcome back, <UserQuery/>
              </h1>
              <p className="text-gray-400 text-sm md:text-base">
                You have 3 capsules unlocking soon and 8 new collaborator invitations.
              </p>
            </div>

            {/* Stats Grid */}
            <DashboardStats />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
              {/* Recent Capsules - Takes 2 columns on xl screens, full width on smaller */}
              <div className="xl:col-span-2">
                <RecentCapsules />
              </div>
              
              {/* Quick Actions - Takes 1 column */}
              <div>
                <QuickActions />
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="dashboard-card">
              <h2 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">Recent Activity</h2>
              <div className="space-y-3 md:space-y-4">
                {[
                  { action: "Created", item: "Wedding Memories", time: "2 hours ago", type: "create" },
                  { action: "Invited", item: "3 collaborators to Birthday Capsule", time: "5 hours ago", type: "invite" },
                  { action: "Unlocked", item: "High School Memories", time: "1 day ago", type: "unlock" },
                  { action: "Scheduled", item: "Anniversary Capsule for unlock", time: "2 days ago", type: "schedule" }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 md:space-x-4 p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      activity.type === 'create' ? 'bg-green-400' :
                      activity.type === 'invite' ? 'bg-blue-400' :
                      activity.type === 'unlock' ? 'bg-purple-400' : 'bg-orange-400'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm">
                        <span className="font-semibold">{activity.action}</span> {activity.item}
                      </p>
                      <p className="text-gray-500 text-xs">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardIndex;