
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const AdminLogin = () => {
  const [stateName, setStateName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(stateName, password);
    if (success) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid State Name or Password. (Try "Odisha" and "admin")');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 bg-gradient-to-b from-[#003366] to-[#009688] font-['Poppins',sans-serif]">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full animate-fade-in">
        <div className="text-center mb-8">
          <div className="bg-[#E0F2F1] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#B2DFDB]">
            <ShieldCheck className="w-8 h-8 text-[#009688]" />
          </div>
          <h2 className="text-[28px] font-bold text-[#003366] mb-2 tracking-tight">State Admin Portal</h2>
          <p className="text-slate-500 text-sm">Secure access for government officials</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[14px] font-medium text-[#111827] mb-2">State Name</label>
            <input
              type="text"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              className="w-full px-4 py-3 border border-[#009688] rounded-lg text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-transparent placeholder-slate-400 bg-white"
              placeholder="e.g. Maharashtra"
              required
            />
          </div>
          
          <div>
            <label className="block text-[14px] font-medium text-[#111827] mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-[#009688] rounded-lg text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-transparent placeholder-slate-400 bg-white"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#009688] hover:bg-[#00796B] text-white font-medium py-3.5 rounded-lg transition-colors shadow-md text-[15px]"
          >
            Secure Login
          </button>
        </form>
      </div>
      
      <div className="mt-8 text-center text-[#ECEFF1] text-sm max-w-md opacity-90">
          <p>For demo access, use any state name (e.g., "Odisha") and password "admin".</p>
      </div>
    </div>
  );
};

export default AdminLogin;
