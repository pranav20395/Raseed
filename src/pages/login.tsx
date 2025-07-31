import { signIn } from "next-auth/react";
import React from 'react';

/**
 * Raseed Login Page
 * This new design is based on the provided screenshot, featuring a two-column layout.
 * The left side contains the login form, while the right side displays a marketing
 * visual for a CRM dashboard. The design uses a clean, modern aesthetic.
 */
export default function Login() {
  return (
    // Main container using a flexbox layout for the two-column design.
    // The `lg:flex-row` ensures the layout is horizontal on large screens.
    <div className="min-h-screen flex flex-col lg:flex-row font-inter">
      
      {/* This global style block imports the Inter font and contains any necessary 
        global CSS, although most styling is handled by Tailwind.
      */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        .font-inter {
          font-family: 'Inter', sans-serif;
        }

        /* Basic animation for the gradient background */
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradient {
          background-size: 300% 300%;
          animation: gradientMove 15s ease infinite;
        }

        /* Responsive hidden on small screens */
        @media (max-width: 1023px) {
          .lg-hidden {
            display: none;
          }
        }
      `}</style>

      {/*
        Left Column - Login Form
        This section occupies the full width on small screens and half on large screens.
        Padding has been adjusted to provide more spacing.
      */}
      <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-between bg-white text-gray-900">
        <div className="flex justify-between items-center mb-12 lg:mb-0">
          {/* Logo at the top left, using an SVG for a clean look */}
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 22h20L12 2zm0 4.29L19.46 20H4.54L12 6.29zM12 10a2 2 0 100-4 2 2 0 000 4zm0-2a.5.5 0 110-1 .5.5 0 010 1zM12 14a2 2 0 100-4 2 2 0 000 4zm0-2a.5.5 0 110-1 .5.5 0 010 1zM12 18a2 2 100-4 2 2 0 000 4zm0-2a.5.5 0 110-1 .5.5 0 010 1z"/>
            </svg>
            <span className="font-extrabold text-2xl text-indigo-900">Raseed</span>
          </div>
        </div>

        {/* The main login form content with increased margin and padding */}
        <div className="max-w-md mx-auto my-auto w-full p-6 sm:p-8 md:p-10">
          <h1 className="text-4xl font-extrabold text-indigo-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600 mb-8">Enter your email and password to access your account.</p>

          {/* Email input field */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="email@raseed.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            />
          </div>

          {/* Password input field */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            />
          </div>
          
          {/* Remember me and forgot password links */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <input type="checkbox" id="remember-me" className="form-checkbox text-indigo-600 rounded" />
              <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">Remember Me</label>
            </div>
            <a href="#" className="text-sm text-indigo-600 font-medium hover:underline">Forgot Your Password?</a>
          </div>

          {/* Log In button */}
          <button className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-colors duration-200">
            Log In
          </button>
          
          {/* Social login divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-sm">Or Login With</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          
          {/* Social login buttons (Google and Apple) */}
          <div className="flex space-x-4">
            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-1/2 flex items-center justify-center py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.755-6.12 8.539-11.303 8.539-6.663 0-12.042-5.378-12.042-12s5.379-12 12.042-12c3.082 0 5.688 1.18 7.733 3.092l5.7-5.712C36.871 11.838 30.618 9 24 9c-14.91 0-27 12.09-27 27s12.09 27 27 27c15.221 0 26.438-11.164 26.438-26.438 0-.909-.079-1.802-.249-2.667z"/>
                <path fill="#FF3D00" d="M6.306 14.691L16.273 24.6l5.981-4.502c-.96-3.111-3.69-5.385-6.954-5.385-3.53 0-6.402 2.378-7.469 5.618z"/>
                <path fill="#4CAF50" d="M24 57c5.845 0 10.655-2.001 14.15-5.344l-5.7-5.712c-2.484 1.583-5.69 2.47-8.45 2.47-4.475 0-8.23-2.614-9.67-6.216l-5.617 4.398c2.91 6.842 10.154 11.514 18.006 11.514z"/>
                <path fill="#1976D2" d="M42.451 29.845h-2.12v-11.411H24v8h11.303c-.22 1.341-1.026 3.864-2.878 5.798-2.045 1.912-4.651 3.092-7.733 3.092-6.663 0-12.042-5.378-12.042-12s5.379-12 12.042-12c3.082 0 5.688 1.18 7.733 3.092l5.7-5.712C36.871 11.838 30.618 9 24 9c-14.91 0-27 12.09-27 27s12.09 27 27 27c15.221 0 26.438-11.164 26.438-26.438 0-.909-.079-1.802-.249-2.667z"/>
              </svg>
              Google
            </button>
            <button
              onClick={() => signIn("apple", { callbackUrl: "/" })}
              className="w-1/2 flex items-center justify-center py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.5 13c-.3 0-.6.1-.9.3-.6.4-1.3.6-2.1.6-.7 0-1.4-.2-2-.6-.3-.2-.6-.3-.9-.3-.5 0-.9.2-1.3.4-.6.3-1.3.5-2.1.5-.7 0-1.4-.2-2-.6-.3-.2-.6-.3-.9-.3-.5 0-.9.2-1.3.4-.6.3-1.3.5-2.1.5-.7 0-1.4-.2-2-.6-.3-.2-.6-.3-.9-.3L4.9 13.9c.7.4 1.4.6 2.1.6.7 0 1.4-.2 2-.6.3-.2.6-.3.9-.3.5 0 .9.2 1.3.4.6.3 1.3.5 2.1.5.7 0 1.4-.2 2-.6.3-.2.6-.3.9-.3.5 0 .9.2 1.3.4.6.3 1.3.5 2.1.5.7 0 1.4-.2 2-.6.3-.2.6-.3.9-.3v2.8c0 1.6-1.3 2.9-2.9 2.9h-4.3c-.6-.4-1.3-.6-2-.6-.7 0-1.4.2-2.1.6-.3.2-.6.3-.9.3-.5 0-.9-.2-1.3-.4-.6-.3-1.3-.5-2.1-.5-.7 0-1.4.2-2.1.6-.3.2-.6.3-.9.3-.5 0-.9-.2-1.3-.4-.6-.3-1.3-.5-2.1-.5-.7 0-1.4.2-2.1.6-.3.2-.6.3-.9.3-1.5 0-2.8 1.3-2.8 2.8v-.4c0 1.5 1.3 2.8 2.8 2.8h17.1c1.5 0 2.8-1.3 2.8-2.8v-2.8c0-1.5-1.3-2.8-2.8-2.8h-4.3c-.6-.4-1.3-.6-2-.6-.7 0-1.4.2-2.1.6-.3.2-.6.3-.9.3-1.5 0-2.8 1.3-2.8 2.8v-.4c0 1.5 1.3 2.8 2.8 2.8h17.1c1.5 0 2.8-1.3 2.8-2.8v-2.8z"/>
              </svg>
              Apple
            </button>
          </div>
          
          <div className="text-center mt-6 text-gray-600 text-sm">
            Don't Have An Account? <a href="#" className="text-indigo-600 font-bold hover:underline">Register Now.</a>
          </div>
        </div>

        {/* Footer with copyright and privacy policy links */}
        <div className="flex justify-between items-center text-gray-500 text-xs mt-12 lg:mt-0">
          <span>Copyright © 2025 Raseed.</span>
          <a href="#" className="hover:underline">Privacy Policy</a>
        </div>
      </div>

      {/*
        Right Column - Marketing Visual
        This section is hidden on small screens and occupies half the width on large screens.
      */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-600 to-purple-800 p-16 flex-col items-center justify-center text-white lg:rounded-l-[4rem]">
        {/* Main heading and subheading */}
        <div className="max-w-xl text-center mb-12">
          <h2 className="text-4xl font-extrabold mb-4 leading-tight">
            Effortlessly manage your team and operations.
          </h2>
          <p className="text-indigo-200">
            Log in to access your CRM dashboard and manage your team.
          </p>
        </div>

        {/* Dashboard Mock-up - Recreated with Tailwind classes */}
        <div className="relative w-full max-w-2xl aspect-[3/2] rounded-3xl overflow-hidden shadow-2xl scale-90 md:scale-100">
            {/* The main dashboard background */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl p-6 grid grid-cols-2 gap-4">
              {/* Card 1: Total Sales */}
              <div className="bg-white/5 rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-sm text-indigo-300">Total Sales</span>
                <span className="text-xl font-bold text-white">$189,374</span>
              </div>
              {/* Card 2: Chart Performance */}
              <div className="bg-white/5 rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-sm text-indigo-300">Chart Performance</span>
                <div className="h-16 flex items-end">
                    <div className="w-1/6 h-2 bg-indigo-300 rounded-full mx-1"></div>
                    <div className="w-1/6 h-6 bg-indigo-300 rounded-full mx-1"></div>
                    <div className="w-1/6 h-4 bg-pink-400 rounded-full mx-1"></div>
                    <div className="w-1/6 h-8 bg-indigo-300 rounded-full mx-1"></div>
                    <div className="w-1/6 h-3 bg-indigo-300 rounded-full mx-1"></div>
                </div>
              </div>
              {/* Card 3: Sales Overview */}
              <div className="bg-white/5 rounded-2xl p-4 col-span-2">
                <span className="text-sm text-indigo-300">Sales Overview</span>
                <div className="h-24 bg-gray-600 rounded-lg mt-2"></div>
              </div>
            </div>
            
            {/* Decorative Glow Circles to match the visual feel */}
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-pink-400 opacity-20 rounded-full blur-3xl" />
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-indigo-400 opacity-20 rounded-full blur-3xl" />
        </div>

        {/* Decorative pattern at the bottom, matching the screenshot */}
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-[url('/some-pattern.svg')] bg-repeat opacity-5 lg:rounded-l-[4rem]"></div>
      </div>
    </div>
  );
}
