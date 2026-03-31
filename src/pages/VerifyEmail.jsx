import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const { user, sendVerificationEmail, logout } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleResend = async () => {
    setMessage("");
    setSending(true);
    try {
      await sendVerificationEmail();
      setMessage("Verification email sent. Please check your inbox.");
    } catch (err) {
      console.error(err);
      setMessage("Could not send email. Try again in a minute.");
    } finally {
      setSending(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl shadow-xl">
        <h1 className="mb-2 text-xl font-display font-semibold">
          Verify your email ✉️
        </h1>
        <p className="mb-4 text-sm text-slate-300">
          We&apos;ve sent a verification link to:
        </p>
        <p className="mb-4 rounded-xl bg-slate-950/60 px-3 py-2 text-sm text-slate-100">
          {user.email}
        </p>
        <p className="mb-4 text-xs text-slate-400">
          Open that email and click the link to activate your account. After
          verifying, log in again to access your dashboard.
        </p>

        {message && (
          <p className="mb-3 rounded-xl bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
            {message}
          </p>
        )}

        <button
          type="button"
          onClick={handleResend}
          disabled={sending}
          className="mb-3 w-full rounded-full border border-white/20 bg-slate-950/60 px-4 py-2.5 text-sm font-medium text-slate-100 hover:bg-white/5 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? "Sending..." : "Resend verification email"}
        </button>

        <button
          type="button"
          onClick={async () => {
            await logout();
            navigate("/login");
          }}
          className="w-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_25px_rgba(79,70,229,0.8)] hover:opacity-95 active:scale-95"
        >
          Back to login
        </button>
      </div>
    </div>
  );
}
