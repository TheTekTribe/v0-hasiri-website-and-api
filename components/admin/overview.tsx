"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Jan",
    total: 18000,
  },
  {
    name: "Feb",
    total: 22000,
  },
  {
    name: "Mar",
    total: 25000,
  },
  {
    name: "Apr",
    total: 32000,
  },
  {
    name: "May",
    total: 38000,
  },
  {
    name: "Jun",
    total: 42000,
  },
  {
    name: "Jul",
    total: 45000,
  },
  {
    name: "Aug",
    total: 48000,
  },
  {
    name: "Sep",
    total: 52000,
  },
  {
    name: "Oct",
    total: 56000,
  },
  {
    name: "Nov",
    total: 60000,
  },
  {
    name: "Dec",
    total: 65000,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₹${value}`}
        />
        <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} labelFormatter={(label) => `Month: ${label}`} />
        <Bar dataKey="total" fill="#2E7D32" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
