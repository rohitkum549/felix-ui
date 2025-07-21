"use client"

import { useMemo } from 'react'

interface ServiceDistribution {
  name: string
  count: number
  color: string
}

interface ServiceDistributionChartProps {
  services: any[]
}

export function ServiceDistributionChart({ services }: ServiceDistributionChartProps) {
  const chartData = useMemo(() => {
    if (!services.length) return []

    // Group services by category/type
    const distribution = services.reduce((acc, service) => {
      const category = service.category || 'Other'
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const colors = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-yellow-500',
      'from-red-500 to-rose-500',
      'from-indigo-500 to-purple-500',
    ]

    return Object.entries(distribution).map(([name, count], index) => ({
      name,
      count,
      color: colors[index % colors.length],
      percentage: (count / services.length) * 100
    }))
  }, [services])

  const total = chartData.reduce((sum, item) => sum + item.count, 0)

  return (
    <div className="space-y-6">
      {/* Donut Chart */}
      <div className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {chartData.map((item, index) => {
              const circumference = 2 * Math.PI * 40
              const strokeDasharray = circumference
              const strokeDashoffset = circumference - (item.percentage / 100) * circumference
              
              // Calculate the starting position for this segment
              const previousPercentage = chartData.slice(0, index).reduce((sum, prev) => sum + prev.percentage, 0)
              const rotation = (previousPercentage / 100) * 360

              return (
                <g key={item.name}>
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="url(#gradient-bg)"
                    strokeWidth="8"
                    opacity="0.1"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={`url(#gradient-${index})`}
                    strokeWidth="8"
                    strokeDasharray={`${(item.percentage / 100) * circumference} ${circumference}`}
                    strokeDashoffset={`-${(previousPercentage / 100) * circumference}`}
                    className="transition-all duration-1000 ease-out"
                    style={{
                      strokeLinecap: 'round',
                      filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
                    }}
                  />
                  
                  {/* Gradients */}
                  <defs>
                    <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={item.color.includes('blue') ? '#3b82f6' : 
                        item.color.includes('purple') ? '#8b5cf6' :
                        item.color.includes('green') ? '#10b981' :
                        item.color.includes('orange') ? '#f97316' :
                        item.color.includes('red') ? '#ef4444' : '#6366f1'} />
                      <stop offset="100%" stopColor={item.color.includes('cyan') ? '#06b6d4' :
                        item.color.includes('pink') ? '#ec4899' :
                        item.color.includes('emerald') ? '#059669' :
                        item.color.includes('yellow') ? '#eab308' :
                        item.color.includes('rose') ? '#f43f5e' : '#8b5cf6'} />
                    </linearGradient>
                    <linearGradient id="gradient-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#374151" />
                      <stop offset="100%" stopColor="#1f2937" />
                    </linearGradient>
                  </defs>
                </g>
              )
            })}
          </svg>
          
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-white">{total}</span>
            <span className="text-sm text-white/60">Total Services</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3">
        {chartData.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-200">
            <div className="flex items-center space-x-3">
              <div 
                className={`w-4 h-4 rounded-full bg-gradient-to-r ${item.color} shadow-lg`}
              />
              <span className="text-white font-medium text-sm">{item.name}</span>
            </div>
            <div className="text-right">
              <div className="text-white font-bold text-sm">{item.count}</div>
              <div className="text-white/60 text-xs">{item.percentage.toFixed(1)}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
