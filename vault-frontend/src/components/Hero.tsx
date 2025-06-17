
import { Lock, Timer, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, Outlet } from "react-router-dom";


const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Logo/Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative p-6 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl shadow-2xl animate-fade-in">
            <Lock className="w-12 h-12 text-white" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
              <Timer className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-6 animate-fade-in">
          TimeVault
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-slate-300 mb-4 animate-fade-in delay-200">
          Lock your precious data in time capsules
        </p>
        
        <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto animate-fade-in delay-300">
          Secure your memories, secrets, and important data in digital capsules that unlock automatically when the time is right.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in delay-500">
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <Link to='/auth'>Create Your First Capsule</Link>
          </Button>
          <Button variant="outline" size="lg" className="border-slate-400 text-slate-300 hover:bg-slate-800 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105">
            Learn More
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex items-center justify-center space-x-8 text-slate-500 animate-fade-in delay-700">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>256-bit Encryption</span>
          </div>
          <div className="flex items-center space-x-2">
            <Timer className="w-5 h-5" />
            <span>Precise Time Control</span>
          </div>
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5" />
            <span>Zero-Knowledge Security</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
