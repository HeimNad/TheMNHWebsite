import Link from "next/link";
import { FileSignature, CreditCard, Users } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Stat Card: Waivers */}
        <Link href="/admin/waivers" className="block group">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 group-hover:border-pink-300 group-hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-pink-50 rounded-lg text-pink-600">
                <FileSignature size={24} />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Active</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Waivers</h3>
            <p className="text-gray-500 text-sm">View and manage signed waivers</p>
          </div>
        </Link>

        {/* Quick Stat Card: Memberships (Future) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 opacity-75">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gray-50 rounded-lg text-gray-400">
              <CreditCard size={24} />
            </div>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Coming Soon</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Memberships</h3>
          <p className="text-gray-500 text-sm">Pre-paid cards and subscriptions</p>
        </div>

        {/* Quick Stat Card: Customers (Future) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 opacity-75">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gray-50 rounded-lg text-gray-400">
              <Users size={24} />
            </div>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Coming Soon</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Customers</h3>
          <p className="text-gray-500 text-sm">Manage customer profiles</p>
        </div>
      </div>
    </div>
  );
}
