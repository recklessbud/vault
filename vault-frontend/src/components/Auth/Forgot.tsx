import { forgotPassword } from "@/api/auth.api";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, Check } from "lucide-react";
export const Forgot = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const forgotMutate = useMutation({
    mutationFn: () => forgotPassword(email),
    onSuccess: () => {
      //   setIsLoading(false);
      setIsSubmitted(true);
      console.log("Password reset requested for:", email);
    },
    onError: () => {
      setIsLoading(false);
      toast({
        title: "Password Reset Failed",
        description: "Please check your email and try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    forgotMutate.mutate();
  };

  if (isSubmitted) {
    return (
        <>
        {/* Removed the bg-gradient and any overlay */}
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-6 shadow-2xl">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">
                Check Your Email
              </h1>
              <p className="text-blue-200 mb-6">
                We've sent a password reset link to{" "}
                <span className="font-semibold text-white">{email}</span>
              </p>
              <p className="text-gray-300 text-sm mb-8">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <div className="space-y-4">
                <Button
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  className="w-full h-12 bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-lg"
                >
                  Try Different Email
                </Button>
                <Link to="/auth">
                  <Button className="w-full h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg font-semibold">
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="reset-email"
            className="text-white text-sm font-medium"
          >
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="pl-10 h-12 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:ring-amber-400/30 rounded-lg"
            />
          </div>
          <p className="text-gray-300 text-sm">
            Enter the email address associated with your Time Capsule account
          </p>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none shadow-lg"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              Sending Reset Link...
            </div>
          ) : (
            "Send Reset Link"
          )}
        </Button>
      </form>
    </div>
  );
};
