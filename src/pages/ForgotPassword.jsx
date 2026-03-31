import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setSending(true);
    try {
      await resetPassword(email);
      setMessage("Reset link sent! Check your email inbox.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to send reset link.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl shadow-xl">
        <h1 className="mb-2 text-xl font-display font-semibold">
          Forgot your password?
        </h1>
        <p className="mb-4 text-sm text-slate-300">
          Enter your email and we&apos;ll send you a secure link to reset it.
        </p>

        {message && (
          <p className="mb-3 rounded-xl bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
            {message}
          </p>
        )}
        {error && (
          <p className="mb-3 rounded-xl bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
            {error}
          </p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm text-slate-200">Email</label>
            <input
              type="email"
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="mt-2 w-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_25px_rgba(79,70,229,0.8)] hover:opacity-95 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sending ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-400">
          Remembered your password?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-secondary underline-offset-2 hover:underline"
          >
            Go back to login
          </button>
        </p>
      </div>
    </div>
  );
}
