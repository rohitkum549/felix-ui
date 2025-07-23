"use client"

import { useMemo } from 'react'
import { format, subDays, getDay } from 'date-fns'

interface UserActivityHeatmapProps {
  transactions: any[]
}

export function UserActivityHeatmap({ transactions }: UserActivityHeatmapProps) {
  const heatmapData = useMemo(() => {
    if (!transactions.length) return []

    // Create a 12-week grid (7 days × 12 weeks)
    const weeks = 12
    const daysInWeek = 7
    
    // Initialize grid with empty data
    const grid = Array.from({ length: weeks }, (_, weekIndex) =>
      Array.from({ length: daysInWeek }, (_, dayIndex) => {
        const date = subDays(new Date(), (weeks - 1 - weekIndex) * 7 + (6 - dayIndex))
        return {
          date: format(date, 'yyyy-MM-dd'),
          count: 0,
          level: 0
        }
      })
    )

    // Count transactions per day
    transactions.forEach(transaction => {
      const txDate = format(new Date(transaction.created_at), 'yyyy-MM-dd')
      
      grid.forEach(week => {
        week.forEach(day => {
          if (day.date === txDate) {
            day.count += 1
          }
        })
      })
    })

    // Calculate activity levels (0-4)
    const maxCount = Math.max(...grid.flat().map(day => day.count), 1)
    grid.forEach(week => {
      week.forEach(day => {
        if (day.count === 0) {
          day.level = 0
        } else if (day.count <= maxCount * 0.25) {
          day.level = 1
        } else if (day.count <= maxCount * 0.5) {
          day.level = 2
        } else if (day.count <= maxCount * 0.75) {
          day.level = 3
        } else {
          day.level = 4
        }
      })
    })

    return grid
  }, [transactions])

  const getIntensityColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-white/5'
      case 1: return 'bg-green-500/20'
      case 2: return 'bg-green-500/40'
      case 3: return 'bg-green-500/60'
      case 4: return 'bg-green-500/80'
      default: return 'bg-white/5'
    }
  }

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-white/80 text-sm font-medium">Activity Pattern</h4>
        <div className="flex items-center space-x-2 text-xs text-white/60">
          <span>Less</span>
          <div className="flex space-x-1">
            {[0, 1, 2, 3, 4].map(level => (
              <div
                key={level}
                className={`w-3 h-3 rounded ${getIntensityColor(level)} border border-white/10`}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Month labels */}
          <div className="flex mb-2">
            <div className="w-8"></div> {/* Space for day labels */}
            {heatmapData.map((week, weekIndex) => {
              const firstDay = new Date(week[0].date)
              const isFirstWeekOfMonth = firstDay.getDate() <= 7
              return (
                <div key={weekIndex} className="w-4 text-xs text-white/60 text-center">
                  {isFirstWeekOfMonth && weekIndex % 4 === 0 ? monthLabels[firstDay.getMonth()] : ''}
                </div>
              )
            })}
          </div>

          {/* Heatmap grid */}
          <div className="flex">
            {/* Day labels */}
            <div className="flex flex-col justify-between h-28 w-8">
              {dayLabels.map((day, index) => (
                <div key={day} className="text-xs text-white/60 h-4 flex items-center">
                  {index % 2 === 1 ? day : ''}
                </div>
              ))}
            </div>

            {/* Activity squares */}
            <div className="flex space-x-1">
              {heatmapData.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col space-y-1">
                  {week.map((day, dayIndex) => (
                    <div
                      key={day.date}
                      className={`w-3 h-3 rounded border border-white/10 ${getIntensityColor(day.level)} hover:ring-2 hover:ring-green-400/50 transition-all duration-200 cursor-pointer group relative`}
                      title={`${format(new Date(day.date), 'MMM d, yyyy')}: ${day.count} transactions`}
                    >
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                        <div className="bg-black/80 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                          <div className="font-medium">{format(new Date(day.date), 'MMM d, yyyy')}</div>
                          <div>{day.count} {day.count === 1 ? 'transaction' : 'transactions'}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 pt-4">
        <div className="text-center p-3 rounded-xl bg-white/5">
          <div className="text-lg font-bold text-white">
            {heatmapData.flat().filter(day => day.count > 0).length}
          </div>
          <div className="text-xs text-white/60">Active Days</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-white/5">
          <div className="text-lg font-bold text-white">
            {Math.round(heatmapData.flat().reduce((sum, day) => sum + day.count, 0) / 84)}
          </div>
          <div className="text-xs text-white/60">Daily Average</div>
        </div>
      </div>
    </div>
  )
}
