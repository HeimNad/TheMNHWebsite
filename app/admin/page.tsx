import Link from "next/link";
import {
  FileSignature,
  MessageSquare,
  CreditCard,
  ArrowUpRight,
  Clock,
  Activity,
  Plus,
} from "lucide-react";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import OverviewChart from "@/components/admin/OverviewChart";
import { LocalTime } from "@/components/ui/local-time";

// Ensure real-time data fetching
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // Fetch Summary Data
  const todaysWaiversResult = await db.sql`SELECT COUNT(*) as count FROM waivers WHERE created_at >= CURRENT_DATE`;
  const todaysWaivers = Number(todaysWaiversResult.rows[0]?.count || 0);

  const unreadMessagesResult = await db.sql`SELECT COUNT(*) as count FROM messages WHERE status = 'unread'`;
  const unreadMessages = Number(unreadMessagesResult.rows[0]?.count || 0);

  const activeCardsResult = await db.sql`SELECT COUNT(*) as count FROM punch_cards WHERE status = 'active'`;
  const activeCards = Number(activeCardsResult.rows[0]?.count || 0);

  const cardsTodayResult = await db.sql`SELECT COUNT(*) as count FROM punch_cards WHERE created_at >= CURRENT_DATE`;
  const cardsToday = Number(cardsTodayResult.rows[0]?.count || 0);

  // Fetch 7-Day Trend Data
  // 1. Waivers Trend
  const waiverTrendResult = await db.sql`
    SELECT TO_CHAR(created_at, 'YYYY-MM-DD') as day, COUNT(*) as count 
    FROM waivers 
    WHERE created_at >= NOW() - INTERVAL '6 days' 
    GROUP BY day ORDER BY day ASC
  `;

  // 2. Audit Logs Trend (Issues & Redeems)
  const auditTrendResult = await db.sql`
    SELECT TO_CHAR(created_at, 'YYYY-MM-DD') as day, action, COUNT(*) as count 
    FROM audit_logs 
    WHERE created_at >= NOW() - INTERVAL '6 days' 
    GROUP BY day, action ORDER BY day ASC
  `;

  // Recent Activity Feed
  const recentLogsResult = await db.sql`
    SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 8
  `;
  const recentLogs = recentLogsResult.rows;

  const user = await currentUser();

  // Process Chart Data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0]; // YYYY-MM-DD
  });

  const chartData = last7Days.map(date => {
    const waiverCount = Number(waiverTrendResult.rows.find(r => r.day === date)?.count || 0);
    const issueCount = Number(auditTrendResult.rows.find(r => r.day === date && r.action === 'ISSUE')?.count || 0);
    const redeemCount = Number(auditTrendResult.rows.find(r => r.day === date && r.action === 'REDEEM')?.count || 0);
    
    // Format date for display (e.g. "Mon 12")
    const displayDate = new Date(date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });

    return {
      date: displayDate,
      waivers: waiverCount,
      cards: issueCount,
      rides: redeemCount
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Hi, {user?.firstName} {user?.lastName || user?.username} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Here&apos;s what&apos;s happening at MNH Wonder Rides today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Waivers Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Today&apos;s Waivers</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{todaysWaivers}</h3>
            </div>
            <div className="p-3 bg-pink-50 rounded-xl text-pink-600"><FileSignature size={24} /></div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Link href="/admin/waivers" className="text-pink-600 font-medium hover:text-pink-700 flex items-center gap-1">View All <ArrowUpRight size={16} /></Link>
          </div>
        </div>

        {/* Messages Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Inquiries</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{unreadMessages}</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><MessageSquare size={24} /></div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            {unreadMessages > 0 ? (
              <span className="text-orange-600 font-medium flex items-center gap-1"><Clock size={16} /> Needs Attention</span>
            ) : (
              <span className="text-green-600 font-medium">All caught up!</span>
            )}
            <Link href="/admin/messages" className="ml-auto text-gray-500 hover:text-gray-700">Go to inbox &rarr;</Link>
          </div>
        </div>

        {/* Members Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Cards</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{activeCards}</h3>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl text-purple-600"><CreditCard size={24} /></div>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-green-600 font-medium">+{cardsToday} new today</span>
            <Link href="/admin/membership" className="text-purple-600 font-medium hover:text-purple-700 flex items-center gap-1">Manage <ArrowUpRight size={16} /></Link>
          </div>
        </div>
      </div>

      {/* Charts & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Weekly Overview</h3>
          <OverviewChart data={chartData} />
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full max-h-[450px]">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Activity className="text-gray-400" size={20} />
              Recent Activity
            </h3>
            <Link href="/admin/audit" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </Link>
          </div>
          
          <div className="divide-y divide-gray-50 overflow-y-auto custom-scrollbar">
            {recentLogs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No recent activity recorded.
              </div>
            ) : (
              recentLogs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors flex items-start gap-3">
                  <div className={`mt-1 p-1.5 rounded-full shrink-0 ${
                    log.action === 'ISSUE' ? 'bg-green-100 text-green-600' :
                    log.action === 'REDEEM' ? 'bg-purple-100 text-purple-600' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {log.action === 'ISSUE' ? <Plus size={14} /> : 
                     log.action === 'REDEEM' ? <CreditCard size={14} /> : 
                     <Activity size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {log.action === 'ISSUE' ? 'Issued card' : 
                       log.action === 'REDEEM' ? 'Redeemed ride' : 
                       log.action}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {log.performed_by}
                    </p>
                  </div>
                  <div className="text-xs text-gray-400 whitespace-nowrap">
                    <LocalTime date={log.created_at} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
