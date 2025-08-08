"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth, provider } from "../lib/firebase";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import Image from "next/image";  // Import Image component
// <-- Ensure you have this image in /public

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-500 via-white-500 to-white-500 animate-gradient-xy px-4">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center relative overflow-hidden">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700">Welcome to Raseed</h1>
        <p className="mb-8 text-gray-600">Sign in to manage your finances smartly and securely.</p>

        {error && (
          <div className="mb-4 text-red-600 font-semibold bg-red-50 border border-red-200 rounded px-4 py-2">
            {error}
          </div>
        )}

        <button
          onClick={handleSignIn}
          disabled={loading}
          className={`w-full flex items-center justify-center px-4 py-3 rounded-xl font-semibold transition ${
            loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 mr-3 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          ) : (
            <Image
  src="/google-logo.svg"  // ✅ Correct way to use public images
  alt="Google"
  width={24}
  height={24}
  className="mr-3"
/>

          )}
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>
      </div>
    </div>
  );
}
