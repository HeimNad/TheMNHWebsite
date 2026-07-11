import { db } from "@/lib/db";
import { ClipboardList } from "lucide-react";
import { LocalTime } from "@/components/ui/local-time";
import { RefreshButton } from "./RefreshButton";
import { AuditPagination } from "./AuditPagination";

export const dynamic = "force-dynamic";

type AuditLog = {
  id: string;
  action: string;
  performed_by: string;
  target_id: string;
  target_code?: string; // Joined from punch_cards
  details: any;
  created_at: string;
};

const PAGE_SIZE = 20;

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, Number(pageParam) || 1);
  const offset = (currentPage - 1) * PAGE_SIZE;

  const [countResult, logsResult] = await Promise.all([
    db.sql`SELECT COUNT(*) FROM audit_logs`,
    db.sql`
      SELECT
        a.*,
        p.code as target_code
      FROM audit_logs a
      LEFT JOIN punch_cards p ON a.target_id = p.id
      ORDER BY a.created_at DESC
      LIMIT ${PAGE_SIZE} OFFSET ${offset}
    `,
  ]);

  const totalItems = Number(countResult.rows[0].count);
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const logs = logsResult.rows as AuditLog[];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-sm text-gray-500 mt-1">Track staff actions and system events.</p>
        </div>
        <RefreshButton />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performed By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <ClipboardList className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                    No audit logs found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <LocalTime date={log.created_at} format="datetime" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        log.action === 'ISSUE' ? 'bg-green-100 text-green-800' :
                        log.action === 'REDEEM' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {log.performed_by}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {log.target_code || log.target_id.substring(0, 8) + '...'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={JSON.stringify(log.details, null, 2)}>
                      {JSON.stringify(log.details)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {logs.length > 0 && (
          <AuditPagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={PAGE_SIZE}
            totalItems={totalItems}
          />
        )}
      </div>
    </div>
  );
}
