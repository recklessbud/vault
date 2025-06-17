import { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
      <div className="flex mb-8 bg-black/20 rounded-xl p-1">
        <button
          onClick={() => setIsLogin(true)}
          className={`flex-1 py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-300 ${
            isLogin
              ? 'bg-white text-slate-800 shadow-lg transform scale-[1.02]'
              : 'text-white hover:bg-white/10'
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`flex-1 py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-300 ${
            !isLogin
              ? 'bg-white text-slate-800 shadow-lg transform scale-[1.02]'
              : 'text-white hover:bg-white/10'
          }`}
        >
          Sign Up
        </button>
      </div>

      <div className="overflow-hidden">
        <div
          className={`flex transition-transform duration-700 ease-in-out ${
            isLogin ? 'transform translate-x-0' : 'transform -translate-x-full'
          }`}
        >
          <div className="w-full flex-shrink-0">
            <LoginForm />
          </div>
          <div className="w-full flex-shrink-0">
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
