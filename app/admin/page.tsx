import Link from "next/link";
import {
  FileSignature,
  MessageSquare,
  CreditCard,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { db } from "@/lib/db";

// Ensure real-time data fetching
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // Fetch data
  // 1. Today's Waivers (Created today)
  // Note: CURRENT_DATE in Postgres is YYYY-MM-DD.
  const waiversResult = await db.sql`
    SELECT COUNT(*) as count FROM waivers
    WHERE created_at >= CURRENT_DATE;
  `;
  const todaysWaivers = Number(waiversResult.rows[0]?.count || 0);

  // 2. Unread Messages
  const messagesResult = await db.sql`
    SELECT COUNT(*) as count FROM messages
    WHERE status = 'unread';
  `;
  const unreadMessages = Number(messagesResult.rows[0]?.count || 0);

  // 3. New Members (Mock)
  const newMembers = 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Overview of today&apos;s activity and pending tasks.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Waivers Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Today&apos;s Waivers
              </p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">
                {todaysWaivers}
              </h3>
            </div>
            <div className="p-3 bg-pink-50 rounded-xl text-pink-600">
              <FileSignature size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Link
              href="/admin/waivers"
              className="text-pink-600 font-medium hover:text-pink-700 flex items-center gap-1"
            >
              View All <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        {/* Messages Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Pending Inquiries
              </p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">
                {unreadMessages}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <MessageSquare size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            {unreadMessages > 0 ? (
              <span className="text-orange-600 font-medium flex items-center gap-1">
                <Clock size={16} /> Needs Attention
              </span>
            ) : (
              <span className="text-green-600 font-medium">All caught up!</span>
            )}
            <Link
              href="/admin/messages"
              className="ml-auto text-gray-500 hover:text-gray-700"
            >
              Go to inbox &rarr;
            </Link>
          </div>
        </div>

        {/* Members Card (Future) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden opacity-75">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">New Members</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">
                {newMembers}
              </h3>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
              <CreditCard size={24} />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-400">
            Membership system inactive
          </div>
        </div>
      </div>
    </div>
  );
}
