'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { MonthlySpending } from '@/lib/types';

interface SpendingChartProps {
  data: MonthlySpending[];
}

function formatMonth(month: string): string {
  const [, m] = month.split('-');
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return months[parseInt(m, 10) - 1] || m;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-lg px-3 py-2 text-xs">
      <p className="text-text-muted">{label}</p>
      <p className="font-semibold text-accent">
        €{payload[0].value.toFixed(2)}
      </p>
    </div>
  );
}

export default function SpendingChart({ data }: SpendingChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    name: formatMonth(d.month),
  }));

  const maxIndex = chartData.length - 1;

  return (
    <section className="glass rounded-2xl p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
        Grocery Spending
      </h3>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barCategoryGap="20%">
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
              tickFormatter={(v: number) => `€${v}`}
              width={50}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            />
            <Bar dataKey="total" radius={[6, 6, 0, 0]}>
              {chartData.map((_, i) => (
                <Cell
                  key={i}
                  fill={
                    i === maxIndex
                      ? 'rgba(201,164,97,0.7)'
                      : 'rgba(201,164,97,0.3)'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
