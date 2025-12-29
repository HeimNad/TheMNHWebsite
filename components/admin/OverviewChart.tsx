"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

interface OverviewData {
  date: string;
  waivers: number;
  cards: number;
  rides: number;
}

export default function OverviewChart({ data }: { data: OverviewData[] }) {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#6B7280', fontSize: 12 }} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            tick={{ fill: '#6B7280', fontSize: 12 }} 
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            cursor={{ fill: '#F3F4F6' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          />
          <Legend />
          <Bar dataKey="rides" name="Rides Redeemed" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="cards" name="Cards Issued" fill="#EC4899" radius={[4, 4, 0, 0]} />
          <Bar dataKey="waivers" name="New Waivers" fill="#3B82F6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
