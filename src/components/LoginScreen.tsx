import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  UserCheck,
  Eye as GuestEye
} from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login, isSupabaseAuthConfigured, lastAuthError } = useApp();

  // Active option: 'owner' (Steeven) or 'guest' (Guest)
  const [selectedOption, setSelectedOption] = useState<UserRole>('owner');

  // Input states - initially blank or clean without exposing credentials
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectOption = (option: UserRole) => {
    setSelectedOption(option);
    setErrorMessage(null);
    setUsername('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim() || !password) {
      setErrorMessage('Please enter both your username and password.');
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(username, password, selectedOption);
      if (!success) {
        setErrorMessage(
          lastAuthError || 'Login failed. Check your credentials and connection.'
        );
      }
    } catch (error) {
      console.error('Login request failed:', error);
      setErrorMessage('Unable to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#F3EFE6] text-[#292929] flex flex-col justify-center items-center px-4 py-12 relative">
      <div className="w-full max-w-md z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#292929] text-[#F3EFE6] font-mono font-bold text-base mb-2 shadow-sm">
            180
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#292929]">
            STEEVEN'S 180-DAY PREPARATION TRACKER
          </h1>
          <p className="text-xs text-[#5A5650] max-w-sm mx-auto">
            End-to-End Production RAG Learning System | 16 Nov 2026 - 14 May 2027
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#FFFFFF] border border-[#E0DCD3] rounded-2xl p-6 sm:p-8 shadow-sm">
          {/* Two Distinct Login Options */}
          <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-[#F3EFE6] rounded-xl border border-[#E0DCD3]">
            <button
              type="button"
              onClick={() => handleSelectOption('owner')}
              className={`py-2.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedOption === 'owner'
                  ? 'bg-[#292929] text-[#F3EFE6] shadow-sm'
                  : 'text-[#5A5650] hover:text-[#292929]'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Login as Steeven</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectOption('guest')}
              className={`py-2.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedOption === 'guest'
                  ? 'bg-[#292929] text-[#F3EFE6] shadow-sm'
                  : 'text-[#5A5650] hover:text-[#292929]'
              }`}
            >
              <GuestEye className="w-3.5 h-3.5" />
              <span>Login as Guest</span>
            </button>
          </div>

          <div className="mb-5 pb-3 border-b border-[#EAE5DC]">
            <h2 className="text-sm font-bold text-[#292929]">
              {selectedOption === 'owner' ? 'Owner Authentication' : 'Guest Preview Authentication'}
            </h2>
            <p className="text-xs text-[#5A5650] mt-0.5">
              {selectedOption === 'owner'
                ? 'Sign in to access your personal preparation schedule and records.'
                : 'Sign in to preview the syllabus, schedule, and application workflow.'}
            </p>
          </div>

          {/* Clean Generic Error Message */}
          {(errorMessage || lastAuthError) && (
            <div className="mb-5 p-3 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5] text-[#991B1B] text-xs">
              {errorMessage || lastAuthError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#292929] mb-1.5">
                {selectedOption === 'owner' && isSupabaseAuthConfigured
                  ? 'Owner Email or Username'
                  : 'Username'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#736E65]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={
                    selectedOption === 'owner' && isSupabaseAuthConfigured
                      ? 'Enter Supabase Owner email or Steeven'
                      : 'Enter username'
                  }
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-[#D5D0C7] rounded-xl text-[#292929] text-sm placeholder:text-[#9B968D] focus:outline-none focus:border-[#E7826D] focus:ring-1 focus:ring-[#E7826D] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#292929] mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#736E65]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-9 pr-10 py-2.5 bg-[#FAF8F5] border border-[#D5D0C7] rounded-xl text-[#292929] text-sm placeholder:text-[#9B968D] focus:outline-none focus:border-[#E7826D] focus:ring-1 focus:ring-[#E7826D] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#736E65] hover:text-[#292929] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-[#E7826D] hover:bg-[#d8735e] active:bg-[#c96551] text-white text-sm font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 uppercase tracking-wide"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : selectedOption === 'owner' ? (
                <>
                  <span>LOGIN AS STEEVEN</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>LOGIN AS GUEST</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Minimal Footer */}
        <div className="text-center text-xs text-[#736E65]">
          <span>Protected Personal Preparation Environment | Asia/Kolkata</span>
        </div>
      </div>
    </div>
  );
};


