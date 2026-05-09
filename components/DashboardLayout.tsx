import Link from "next/link";

import ProtectedRoute from "./ProtectedRoute";

import { logout } from "../lib/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <aside className="w-64 border-r p-6 bg-white">
          <h1 className="text-2xl font-bold mb-8">
            CollabSpace 
          </h1>

          <nav className="space-y-4">
            <Link
              href="/dashboard"
              className="block hover:text-blue-500"
            >
              Dashboard
            </Link>
          </nav>
        </aside>

        <div className="flex-1 flex flex-col">
          <div className="border-b px-6 py-4 flex justify-between bg-white">
            <h2 className="font-semibold">
              Workspace
            </h2>

            <button
              onClick={logout}
              className="text-red-500"
            >
              Logout
            </button>
          </div>

          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}