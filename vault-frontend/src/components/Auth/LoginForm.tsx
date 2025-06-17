/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Lock, User	 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { login } from '@/api/auth.api';
import { log } from 'console';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';




const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();


  const loginUserMutation = useMutation({
    mutationFn: () => login(username, password),
    onSuccess: (data) => {
      setIsLoading(false);
      if(data && data.refreshToken){
        localStorage.setItem('refreshToken', data.refreshToken); 
         navigate('/users/dashboard');
      }
    
    },
     onError: (error) => {
      // Handle login error (e.g., display error message)
      console.log(error.message)
      setIsLoading(false);
        toast({
        title: "Login Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    loginUserMutation.mutate()
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-white text-sm font-medium">
            Username
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              className="pl-10 h-12 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-amber-400 focus:ring-amber-400/30 rounded-lg"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-white text-sm font-medium">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="pl-10 pr-10 h-12 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-amber-400 focus:ring-amber-400/30 rounded-lg"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            className="mr-2 rounded border-gray-400 bg-white/10 text-amber-400 focus:ring-amber-400"
          />
          Remember me
        </label>
        <Link to={'/auth/forgot-password'}>
        <button
          type="button"
          className="text-amber-400 hover:text-amber-300 transition-colors font-medium"
        >
          Forgot password?
        </button>
        </Link>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none shadow-lg"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
            Unlocking Time Capsule...
          </div>
        ) : (
          'Unlock Time Capsule'
        )}
      </Button>

      <div className="text-center">
        <p className="text-gray-300 text-sm">
          New to Time Capsule?{' '}
          <span className="text-amber-400 font-medium">Create your first capsule</span>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
