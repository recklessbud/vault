import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { signup } from "@/api/auth.api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const {username, email, password} = formData

  const RegisterUserMutation = useMutation({
    mutationFn: () => signup(username, email, password),
    onSuccess: (data) => {
      setIsLoading(false)
      if(data && data.refreshToken){
        localStorage.setItem('refreshToken', data.refreshToken);
        navigate('/users/dashboard')
      }
        
    },
    onError: (error) => {
      // Handle login error (e.g., display error message)
      console.log(error.message)
      setIsLoading(false);
      toast({
        title: "Signup Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setIsLoading(true);
    RegisterUserMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white text-sm font-medium">
            Full Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your Username"
              required
              className="pl-10 h-12 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-amber-400 focus:ring-amber-400/30 rounded-lg"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="signup-email"
            className="text-white text-sm font-medium"
          >
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="signup-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="pl-10 h-12 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-amber-400 focus:ring-amber-400/30 rounded-lg"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="signup-password"
            className="text-white text-sm font-medium"
          >
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="signup-password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              className="pl-10 pr-10 h-12 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-amber-400 focus:ring-amber-400/30 rounded-lg"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="confirm-password"
            className="text-white text-sm font-medium"
          >
            Confirm Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="confirm-password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              className="pl-10 pr-10 h-12 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-amber-400 focus:ring-amber-400/30 rounded-lg"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="flex items-start text-sm text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            required
            className="mr-3 mt-0.5 rounded border-gray-400 bg-white/10 text-amber-400 focus:ring-amber-400"
          />
          <span>
            I agree to the{" "}
            <button
              type="button"
              className="text-amber-400 hover:text-amber-300 underline font-medium"
            >
              Terms of Service
            </button>{" "}
            and{" "}
            <button
              type="button"
              className="text-amber-400 hover:text-amber-300 underline font-medium"
            >
              Privacy Policy
            </button>
          </span>
        </label>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none shadow-lg"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
            Creating Time Capsule...
          </div>
        ) : (
          "Create Time Capsule"
        )}
      </Button>

      <div className="text-center">
        <p className="text-gray-300 text-sm">
          Already have a capsule?{" "}
          <span className="text-amber-400 font-medium">Sign in to unlock</span>
        </p>
      </div>
    </form>
  );
};

export default SignupForm;
