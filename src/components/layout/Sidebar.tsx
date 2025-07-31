// src/components/layout/Sidebar.tsx
import React from 'react';
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

const navLinks = [
  { name: "Dashboard", href: "/", icon: "🏠" },
  { name: "Receipts", href: "/receipts", icon: "🧾" },
  { name: "Goals", href: "/goals", icon: "🎯" },
  { name: "Warranty", href: "/warranty", icon: "🛡️" },
];

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <aside
      className={`fixed z-30 inset-y-0 left-0 w-64 bg-gradient-to-b from-indigo-600 to-indigo-800 text-white transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-lg`}
    >
      <div className="flex flex-col h-full justify-between">
        <div>
          <div className="flex items-center space-x-3 px-6 py-5 border-b border-indigo-700">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt="User Avatar"
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center text-xl font-bold">
                {session?.user?.name?.[0] || "U"}
              </div>
            )}
            <div>
              <div className="font-semibold">{session?.user?.name || "User"}</div>
              <div className="text-xs text-indigo-200">{session?.user?.email}</div>
            </div>
          </div>
          <nav className="px-4 py-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  router.pathname === link.href
                    ? "bg-indigo-700 font-semibold"
                    : "hover:bg-indigo-700"
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className="mr-3 text-lg">{link.icon}</span>
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="px-6 py-4 border-t border-indigo-700">
          <button
            onClick={() => signOut()}
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
