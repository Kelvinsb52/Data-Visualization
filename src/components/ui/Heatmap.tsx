'use client'

import React from 'react'

interface HeatmapProps {
  data: number[][]
  width: number
  height: number
}

export function Heatmap({ data, width, height }: HeatmapProps) {
  // Safety checks
  if (!data || data.length === 0 || !data[0] || data[0].length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ width, height }}>
        <span className="text-gray-500">No data available</span>
      </div>
    )
  }

  const rows = data.length
  const cols = data[0].length
  const cellWidth = width / cols
  const cellHeight = height / rows

  // Find max value for scaling - with safety check
  const flatData = data.flat().filter(v => v > 0)
  const maxValue = flatData.length > 0 ? Math.max(...flatData) : 1

  return (
    <div className="relative">
      <svg width={width} height={height} className="border">
        {data.map((row, i) =>
          row.map((value, j) => (
            <rect
              key={`${i}-${j}`}
              x={j * cellWidth}
              y={i * cellHeight}
              width={cellWidth}
              height={cellHeight}
              fill={value === 0 ? '#f3f4f6' : `hsl(220, 70%, ${90 - (value / maxValue) * 40}%)`}
              stroke="#e5e7eb"
              strokeWidth={0.1}
            />
          ))
        )}
      </svg>
      <div className="mt-2 text-sm text-gray-500 flex justify-between">
        <span>Missing ratings (gray)</span>
        <span>Observed ratings (blue)</span>
      </div>
    </div>
  )
}