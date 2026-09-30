// src/components/dashboard/income-expense-chart.tsx
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { formatCurrency, formatCurrencyCompact } from "@/lib/utils";

// Generate last 6 months of mock income/expense data relative to today
function getLast6MonthsData() {
  const months = [];
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const now = new Date();

  // Static realistic mock values
  const mockValues = [
    { income: 185000, expense: 42000 },
    { income: 220000, expense: 55000 },
    { income: 175000, expense: 38000 },
    { income: 310000, expense: 72000 },
    { income: 265000, expense: 61000 },
    { income: 290000, expense: 58000 },
  ];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      month: monthNames[d.getMonth()],
      year: d.getFullYear(),
      income: mockValues[5 - i].income,
      expense: mockValues[5 - i].expense,
      net: mockValues[5 - i].income - mockValues[5 - i].expense,
    });
  }

  return months;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const income = payload.find((p) => p.name === "Income");
  const expense = payload.find((p) => p.name === "Expense");
  const net = (income?.value ?? 0) - (expense?.value ?? 0);

  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700 p-3 shadow-lg text-sm">
      <p className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
        {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-6">
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            {entry.name}
          </span>
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
      <div className="mt-2 border-t pt-2 flex items-center justify-between gap-6">
        <span className="text-slate-600 dark:text-slate-400">Net</span>
        <span
          className={`font-semibold ${
            net >= 0 ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"
          }`}
        >
          {formatCurrency(net)}
        </span>
      </div>
    </div>
  );
}

export function IncomeExpenseChart() {
  const data = getLast6MonthsData();

  const totalIncome = data.reduce((s, d) => s + d.income, 0);
  const totalExpense = data.reduce((s, d) => s + d.expense, 0);

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800 dark:text-slate-100">
            <TrendingUp className="h-4 w-4 text-gold" />
            Monthly Income vs Expense
          </CardTitle>
          <div className="flex items-center gap-4 text-xs">
            <div className="text-slate-500 dark:text-slate-400">
              6-month income:{" "}
              <span className="font-semibold text-blue-700 dark:text-blue-400">
                {formatCurrencyCompact(totalIncome)}
              </span>
            </div>
            <div className="text-slate-500 dark:text-slate-400">
              Expenses:{" "}
              <span className="font-semibold text-red-700 dark:text-red-400">
                {formatCurrencyCompact(totalExpense)}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={data}
            margin={{ top: 4, right: 8, left: 8, bottom: 0 }}
            barCategoryGap="30%"
            barGap={4}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
              opacity={0.6}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(v: number) => formatCurrencyCompact(v)}
              width={56}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.5 }} />
            <Legend
              iconType="square"
              iconSize={10}
              wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
              formatter={(value: string) => <span style={{ color: "#475569" }}>{value}</span>}
            />
            <Bar
              dataKey="income"
              name="Income"
              fill="#14213D"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            <Bar
              dataKey="expense"
              name="Expense"
              fill="#D9A441"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
