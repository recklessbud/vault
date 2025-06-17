
import { Lock, Timer } from 'lucide-react';
import Auth from '../components/Auth/Auth';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-600 to-slate-800 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:30px_30px]"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
        <div className="mb-8 flex justify-center">
          <div className="relative p-6 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl shadow-2xl animate-fade-in">
            <Lock className="w-12 h-12 text-white" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
              <Timer className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
            Time Vault
          </h1>
          <p className="text-blue-200 text-lg font-medium">
            Unlock memories from the past
          </p>
        </div>
        
        <Auth />
      </div>
    </div>
  );
};

export default Index;