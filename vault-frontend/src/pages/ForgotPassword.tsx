import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, Check } from 'lucide-react';
import { Forgot } from '@/components/Auth/Forgot';

const ForgotPassword = () => {
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-600 to-slate-800 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:30px_30px]"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/auth" className="inline-flex items-center text-amber-400 hover:text-amber-300 transition-colors mb-6">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Login
          </Link>
          
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            Forgot Password?
          </h1>
          <p className="text-blue-200 text-lg font-medium">
            No worries, we'll help you reset it
          </p>
        </div>
        
      <Forgot/>
      </div>  
    </div>
  );
};

export default ForgotPassword;
