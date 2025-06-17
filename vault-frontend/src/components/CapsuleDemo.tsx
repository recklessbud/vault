
import { useState, useEffect } from "react";
import { Lock, Unlock, Clock, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";

const CapsuleDemo = () => {
  const [timeLeft, setTimeLeft] = useState("05:23:42");
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate countdown
      const now = new Date();
      const unlockTime = new Date(now.getTime() + 5 * 60 * 60 * 1000 + 23 * 60 * 1000 + 42 * 1000);
      const diff = unlockTime.getTime() - now.getTime();
      
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            See It In Action
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Watch how your data remains securely locked until the perfect moment
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Capsule Visualization */}
          <div className="relative">
            <Card className="p-8 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-2xl">
              <div className="text-center">
                <div className="relative mb-6">
                  {/* Capsule Container */}
                  <div className={`mx-auto w-32 h-48 rounded-full border-4 transition-all duration-1000 ${
                    isLocked 
                      ? 'border-red-500 bg-gradient-to-b from-red-900/30 to-red-700/30 shadow-red-500/30' 
                      : 'border-emerald-500 bg-gradient-to-b from-emerald-900/30 to-emerald-700/30 shadow-emerald-500/30'
                  } shadow-2xl relative overflow-hidden`}>
                    
                    {/* Lock/Unlock Icon */}
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                      {isLocked ? (
                        <Lock className="w-8 h-8 text-red-400 animate-pulse" />
                      ) : (
                        <Unlock className="w-8 h-8 text-emerald-400" />
                      )}
                    </div>

                    {/* Data representation */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 space-y-1">
                      <div className="w-16 h-2 bg-slate-400/50 rounded"></div>
                      <div className="w-12 h-2 bg-slate-400/50 rounded"></div>
                      <div className="w-20 h-2 bg-slate-400/50 rounded"></div>
                    </div>

                    {/* Particle effects */}
                    {!isLocked && (
                      <div className="absolute inset-0">
                        <div className="absolute top-2 left-2 w-1 h-1 bg-emerald-400 rounded-full animate-ping"></div>
                        <div className="absolute top-6 right-3 w-1 h-1 bg-emerald-400 rounded-full animate-ping delay-200"></div>
                        <div className="absolute bottom-8 left-4 w-1 h-1 bg-emerald-400 rounded-full animate-ping delay-500"></div>
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-white mb-2">
                  Personal Time Capsule
                </h3>
                <p className="text-slate-400 mb-4">
                  Birthday memories & photos
                </p>

                {/* Status */}
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-2 text-lg">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-mono">{timeLeft}</span>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2 text-sm text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span>Unlocks: Dec 25, 2024</span>
                  </div>

                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                    isLocked 
                      ? 'bg-red-900/30 text-red-400 border border-red-500/30' 
                      : 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {isLocked ? 'Locked & Secure' : 'Ready to Open'}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Features List */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Tamper-Proof Security</h3>
                <p className="text-slate-400">Your data is encrypted and impossible to access before the unlock date, even by you.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Precise Timing</h3>
                <p className="text-slate-400">Set exact dates and times down to the minute for when your capsule should unlock.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Multiple Formats</h3>
                <p className="text-slate-400">Store text, images, videos, and documents in your time-locked capsules.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CapsuleDemo;
