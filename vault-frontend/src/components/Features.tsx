
import { Shield, Clock, Users, Smartphone, Globe, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: "Bank-Grade Security",
      description: "256-bit AES encryption ensures your data remains absolutely secure until unlock time.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Set unlock dates from minutes to decades in the future with precision timing.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Users,
      title: "Shared Capsules",
      description: "Create group capsules that unlock for multiple recipients simultaneously.",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: Smartphone,
      title: "Cross-Platform",
      description: "Access your capsules from any device, anywhere, when the time comes.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Globe,
      title: "Global Sync",
      description: "Synchronized worldwide with atomic clock precision for perfect timing.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: Zap,
      title: "Instant Unlock",
      description: "Immediate access when the time arrives - no delays, no waiting.",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why Choose TimeVault?
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            The most secure and reliable way to preserve your digital memories and data for the future
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 hover:border-slate-600 transition-all duration-300 hover:scale-105 group">
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-white group-hover:text-blue-300 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-white">99.9%</div>
            <div className="text-slate-400">Uptime</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-white">50K+</div>
            <div className="text-slate-400">Capsules Created</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-white">100%</div>
            <div className="text-slate-400">Successful Unlocks</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-white">24/7</div>
            <div className="text-slate-400">Support</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
