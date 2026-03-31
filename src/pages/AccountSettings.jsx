import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { FiUser, FiSettings, FiMail, FiShield, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function AccountSettings() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
        <FiArrowLeft /> Back
      </button>

      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-slate-800 rounded-2xl border border-white/10 text-slate-300">
            <FiSettings size={24} />
          </div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
        </div>

        <div className="space-y-4">
          {/* Email Card */}
          <div className="bg-slate-900/50 border border-white/10 p-6 rounded-3xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/5 rounded-lg text-slate-400"><FiMail /></div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Address</p>
                <p className="font-bold">{user?.email}</p>
              </div>
            </div>
            <button className="text-xs font-bold text-purple-400 hover:underline">Change</button>
          </div>

          {/* Security Card */}
          <div className="bg-slate-900/50 border border-white/10 p-6 rounded-3xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/5 rounded-lg text-slate-400"><FiShield /></div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Account Security</p>
                <p className="font-bold">Password Protected</p>
              </div>
            </div>
            <button className="text-xs font-bold text-purple-400 hover:underline">Update</button>
          </div>
        </div>

        <button className="mt-10 w-full py-4 border border-rose-500/20 text-rose-500 font-bold rounded-2xl hover:bg-rose-500/10 transition-all">
          Delete Account Permanently
        </button>
      </div>
    </div>
  );
}