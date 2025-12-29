"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  FileSignature,
  MessageSquare,
  Menu,
  X,
  Home,
  Flag,
  CreditCard,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile state
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop state

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Waivers", href: "/admin/waivers", icon: FileSignature },
    { name: "Messages", href: "/admin/messages", icon: MessageSquare },
    { name: "Membership", href: "/admin/membership", icon: CreditCard },
    { name: "Announcements", href: "/admin/announcements", icon: Flag },
    { name: "Audit Logs", href: "/admin/audit", icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transform transition-all duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "lg:w-20" : "lg:w-64"}
          w-64
        `}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className={`h-16 flex items-center border-b border-gray-200 ${isCollapsed ? 'justify-center px-0' : 'px-6'}`}>
            {isCollapsed ? (
              <span className="text-xl font-bold text-pink-600">MNH</span>
            ) : (
              <span className="text-xl font-bold text-pink-600 whitespace-nowrap">Admin Panel</span>
            )}
            <button
              className="ml-auto lg:hidden text-gray-500"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${
                      isActive
                        ? "bg-pink-50 text-pink-700"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }
                    ${isCollapsed ? "justify-center" : ""}
                  `}
                  title={isCollapsed ? item.name : undefined}
                >
                  <item.icon
                    size={20}
                    className={`shrink-0 ${isActive ? "text-pink-500" : "text-gray-400"}`}
                  />
                  {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Back to Main Site Button */}
          <Link
            href="/"
            onClick={() => setIsSidebarOpen(false)}
            className={`
              flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors text-gray-700 hover:bg-gray-100 hover:text-gray-900 mx-2 rounded-lg mb-2
              ${isCollapsed ? "justify-center px-2" : ""}
            `}
            title="Back to Main Site"
          >
            <Home size={20} className="text-gray-700 shrink-0" />
            {!isCollapsed && <span className="whitespace-nowrap">Back to Site</span>}
          </Link>

          {/* User Profile */}
          <div className={`p-2 border-t border-gray-200 ${isCollapsed ? 'flex justify-center' : ''}`}>
            <div className={`flex items-center gap-3 px-3 py-2 ${isCollapsed ? 'justify-center px-0' : ''}`}>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8",
                    userButtonBox: isCollapsed ? "" : "flex-row-reverse gap-2",
                    userButtonOuterIdentifier: isCollapsed ? "hidden" : "block",
                  },
                }}
                showName={!isCollapsed}
              />
            </div>
          </div>
          
          {/* Desktop Collapse Toggle */}
          <div className="hidden lg:flex justify-center p-2 border-t border-gray-100">
             <button
               onClick={() => setIsCollapsed(!isCollapsed)}
               className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors w-full flex justify-center"
             >
               {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 h-16 flex items-center px-4 gap-4">
          <button
            className="text-gray-500 focus:outline-none"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <span className="font-bold text-gray-900">MNH Admin</span>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
