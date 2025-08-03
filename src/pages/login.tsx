// pages/login.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth, provider } from "../lib/firebase";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, provider);
      router.replace("/");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-100 to-indigo-300 px-4">
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-8 text-center">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700">Welcome to Raseed</h1>
        <p className="mb-8 text-gray-600">Sign in to manage your finances smartly and securely.</p>

        {error && (
          <div className="mb-4 text-red-600 font-semibold">
            {error}
          </div>
        )}

        <button
          onClick={handleSignIn}
          disabled={loading}
          className={`w-full flex items-center justify-center px-4 py-3 rounded-md text-white font-semibold transition ${
            loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 mr-3 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 mr-3"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
            >
              <path
                fill="#FFC107"
                d="M43.611 20.083h-1.736v-.041H24v7.875h11.018c-1.338 3.417-4.795 5.75-8.773 5.75-5.31 0-9.618-4.308-9.618-9.618s4.308-9.618 9.618-9.618c2.467 0 4.712.954 6.412 2.503l5.322-5.322C36.215 11.63 30.63 9 24 9 13.523 9 5 17.523 5 28s8.523 19 19 19c10.477 0 19-8.523 19-19 0-1.19-.127-2.343-.389-3.417z"
              />
            </svg>
          )}
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>
      </div>
    </div>
  );
}
