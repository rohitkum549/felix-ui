"use client"

import { useState, useEffect, useMemo } from 'react'
import { Transaction } from '@/lib/types/dashboard'
import { format, subDays, parseISO } from 'date-fns'

interface ActivityGraphProps {
  transactions: Transaction[]
}

interface DayData {
  date: string
  count: number
  amount: number
  day: string
}


export function ActivityGraph({ transactions }: ActivityGraphProps) {
  const chartData = useMemo(() => {
    if (!transactions.length) return []

    // Get last 7 days
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i)
      return {
        date: format(date, 'yyyy-MM-dd'),
        day: format(date, 'EEE'),
        count: 0,
        amount: 0
      }
    })

    // Group transactions by day
    transactions.forEach(transaction => {
      const txDate = format(parseISO(transaction.created_at), 'yyyy-MM-dd')
      const dayIndex = days.findIndex(day => day.date === txDate)
      if (dayIndex !== -1) {
        days[dayIndex].count += 1
        days[dayIndex].amount += transaction.amount
      }
    })

    return days
  }, [transactions])

  const maxCount = Math.max(...chartData.map(d => d.count), 1)
  const maxAmount = Math.max(...chartData.map(d => d.amount), 1)

  return (
    <div className="space-y-4">
      {/* Transaction Count Chart */}
      <div>
        <h4 className="text-white/80 text-sm font-medium mb-3">Daily Transactions</h4>
        <div className="h-40 flex items-end justify-between space-x-2">
          {chartData.map((day, index) => {
            const height = (day.count / maxCount) * 100
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center space-y-2 group">
                <div className="relative">
                  <div
                    className="w-full bg-gradient-to-t from-blue-500/60 via-purple-500/60 to-cyan-500/60 rounded-t-lg transition-all duration-500 hover:from-blue-400/80 hover:via-purple-400/80 hover:to-cyan-400/80 min-h-[4px]"
                    style={{ height: `${Math.max(height, 4)}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-black/80 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                      <div>{day.count} transactions</div>
                      <div>B$ {day.amount.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                <span className="text-white/50 text-xs font-medium">{day.day}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Transaction Amount Chart */}
      <div>
        <h4 className="text-white/80 text-sm font-medium mb-3">Daily Volume (BD)</h4>
        <div className="h-40 flex items-end justify-between space-x-2">
          {chartData.map((day, index) => {
            const height = (day.amount / maxAmount) * 100
            return (
              <div key={`amount-${day.date}`} className="flex-1 flex flex-col items-center space-y-2 group">
                <div className="relative">
                  <div
                    className="w-full bg-gradient-to-t from-green-500/60 via-emerald-500/60 to-teal-500/60 rounded-t-lg transition-all duration-500 hover:from-green-400/80 hover:via-emerald-400/80 hover:to-teal-400/80 min-h-[4px]"
                    style={{ height: `${Math.max(height, 4)}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-black/80 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                      <div>B$ {day.amount.toLocaleString()}</div>
                      <div>{day.count} transactions</div>
                    </div>
                  </div>
                </div>
                <span className="text-white/50 text-xs font-medium">{day.day}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
