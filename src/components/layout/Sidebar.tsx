// Sidebar.tsx
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../lib/firebase';
import { useRouter } from 'next/router';
import Image from 'next/image';

const navLinks = [
  { name: 'Dashboard', href: '/', icon: '🏠' },
  { name: 'Receipts', href: '/receipts', icon: '🧾' },
  { name: 'Goals', href: '/goals', icon: '🎯' },
  { name: 'Warranty', href: '/warranty', icon: '🛡️' },
];

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/login');
  };

  return (
    <aside
      className={`fixed z-30 inset-y-0 left-0 w-64 bg-gradient-to-b from-indigo-600 to-indigo-800 text-white transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-lg`}
    >
      <div className="flex flex-col h-full justify-between">
        <div>
          <div className="flex items-center space-x-3 px-6 py-5 border-b border-indigo-700">
            {user?.photoURL ? (
              <Image
                src={user.photoURL}
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full border-2 border-white object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center text-xl font-bold">
                {user?.displayName?.[0] || 'U'}
              </div>
            )}
            <div>
              <div className="font-semibold">{user?.displayName || 'User'}</div>
              <div className="text-xs text-indigo-200">{user?.email}</div>
            </div>
          </div>
          <nav className="px-4 py-6 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => {
                  router.push(link.href);
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  router.pathname === link.href ? 'bg-indigo-700 font-semibold' : 'hover:bg-indigo-700'
                }`}
              >
                <span className="mr-3 text-lg">{link.icon}</span>
                {link.name}
              </button>
            ))}
          </nav>
        </div>
        <div className="px-6 py-4 border-t border-indigo-700">
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-white font-semibold transition"
          >
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;