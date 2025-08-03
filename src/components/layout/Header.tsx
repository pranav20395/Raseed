// Header.tsx
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../lib/firebase';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

const Header = ({ setIsSidebarOpen }: { setIsSidebarOpen: (open: boolean) => void }) => {
  const [user] = useAuthState(auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleSignOut = async () => {
    await auth.signOut();
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white shadow relative z-40">
      <button
        className="p-2 rounded hover:bg-gray-100 transition lg:hidden"
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <span className="text-2xl">☰</span>
      </button>
      <div className="flex-1 text-center font-extrabold text-xl tracking-tight text-indigo-700 select-none">
        Raseed
      </div>
      {user && (
        <div className="relative ml-4" ref={dropdownRef}>
          <button
            className="flex items-center space-x-2 focus:outline-none"
            onClick={() => setDropdownOpen((open) => !open)}
          >
            {user.photoURL ? (
              <Image
                src={user.photoURL}
                alt="User Avatar"
                width={36}
                height={36}
                className="rounded-full border-2 border-indigo-200 object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-indigo-400 flex items-center justify-center text-lg font-bold text-white">
                {user.displayName?.[0] || 'U'}
              </div>
            )}
            <span className="hidden sm:block font-medium text-gray-700">{user.displayName}</span>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded shadow-lg py-2 z-50">
              <div className="px-4 py-2 text-xs text-gray-500 border-b">{user.email}</div>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 transition"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;