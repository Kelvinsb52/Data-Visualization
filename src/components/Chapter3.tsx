'use client'

import React, { useState, useMemo } from 'react'
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, Cell, ReferenceLine 
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'

interface SweepResult {
  k: number
  lambda_w: number
  lambda_z: number
  train_rmse: number
  valid_rmse: number
  overfitting_gap: number
  total_regularization: number
}

interface Chapter3Data {
  metadata: {
    total_combinations: number
    k_values: number[]
    lambda_values: number[]
    best_config: {
      k: number
      lambda_w: number
      lambda_z: number
      valid_rmse: number
    }
    baseline_rmse: {
      train: number
      valid: number
    }
  }
  results: SweepResult[]
}

interface Chapter3Props {
  data: Chapter3Data
}

// Color palette for different k values
const kColorScale: Record<number, string> = {
  5: '#22c55e',   // green-500 - best generalization
  8: '#84cc16',   // lime-500
  10: '#eab308',  // yellow-500
  15: '#f97316',  // orange-500
  20: '#ef4444',  // red-500
  25: '#dc2626',  // red-600
  30: '#b91c1c',  // red-700
  40: '#991b1b',  // red-800
  50: '#7f1d1d',  // red-900
  60: '#450a0a',  // red-950 - most overfitting
}

export default function Chapter3({ data }: Chapter3Props) {
  const [selectedPoint, setSelectedPoint] = useState<SweepResult | null>(null)
  const [filterK, setFilterK] = useState<number | 'all'>('all')
  const [highlightBest, setHighlightBest] = useState(true)

  // Filter data based on k selection
  const filteredData = useMemo(() => {
    if (filterK === 'all') return data.results
    return data.results.filter(r => r.k === filterK)
  }, [data.results, filterK])

  // Find Pareto frontier (best valid RMSE for each train RMSE level)
  const paretoPoints = useMemo(() => {
    const sorted = [...data.results].sort((a, b) => a.valid_rmse - b.valid_rmse)
    return sorted.slice(0, 10) // Top 10 best validation points
  }, [data.results])

  // Get best and worst for context
  const stats = useMemo(() => {
    const validRmses = data.results.map(r => r.valid_rmse)
    const trainRmses = data.results.map(r => r.train_rmse)
    const gaps = data.results.map(r => r.overfitting_gap)
    
    return {
      bestValid: Math.min(...validRmses),
      worstValid: Math.max(...validRmses),
      bestTrain: Math.min(...trainRmses),
      worstTrain: Math.max(...trainRmses),
      minGap: Math.min(...gaps),
      maxGap: Math.max(...gaps)
    }
  }, [data.results])

  const getNiceAxisConfig = (min: number, max: number, tickInterval: number) => {
    const niceMin = Math.floor(min / tickInterval) * tickInterval
    const niceMax = Math.ceil(max / tickInterval) * tickInterval
    const ticks = []
    for (let i = niceMin; i <= niceMax; i += tickInterval) {
      ticks.push(Number(i.toFixed(2)))
    }
    return { domain: [niceMin, niceMax], ticks }
  }

  const xAxisConfig = getNiceAxisConfig(stats.bestTrain, stats.worstTrain, 0.10)
  const yAxisConfig = getNiceAxisConfig(stats.bestValid, stats.worstValid, 0.05)

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload as SweepResult
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg text-sm">
          <div className="font-bold text-gray-800">k = {point.k}</div>
          <div className="text-gray-600">λW = {point.lambda_w}</div>
          <div className="text-gray-600">λZ = {point.lambda_z}</div>
          <div className="mt-2 pt-2 border-t">
            <div className="text-blue-600">Train: {point.train_rmse.toFixed(3)}</div>
            <div className="text-red-600">Valid: {point.valid_rmse.toFixed(3)}</div>
            <div className="text-orange-600">Gap: {point.overfitting_gap.toFixed(3)}</div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-8 p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-black mb-4">Chapter 3: Hyperparameter Tuning & Overfitting</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          We tested <span className="font-bold text-black">{data.metadata.total_combinations.toLocaleString()}</span> combinations 
          of k, λW, and λZ. Some settings overfit badly while others generalize well. 
        </p>
      </div>

      {/* Key Discovery Banner */}
      <Card className="border-2">
        <CardContent className="py-4">
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-black">k = {data.metadata.best_config.k}</div>
              <div className="text-sm text-black">Latent Factors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-black">λW = {data.metadata.best_config.lambda_w}</div>
              <div className="text-sm text-black">Strong</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-black">λZ = {data.metadata.best_config.lambda_z}</div>
              <div className="text-sm text-black">Weak</div>
            </div>
            <div className="text-4xl text-black">→</div>
            <div className="text-center">
              <div className="text-3xl font-bold text-black">{data.metadata.best_config.valid_rmse.toFixed(3)}</div>
              <div className="text-sm text-black">Best Valid RMSE</div>
            </div>
            <div className="text-center px-4 border-l">
              <div className="text-sm text-gray-600">
                Simple model (k=5) + asymmetric regularization = best generalization!
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card>
        <CardHeader className='text-black'>
          <CardTitle>Explore the Hyperparameter Space</CardTitle>
          <CardDescription>Each dot is one hyperparameter configuration. Click to see details.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-black">Filter by k:</span>
              <select 
                value={filterK}
                onChange={(e) => setFilterK(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="border rounded px-3 py-1 text-black"
              >
                <option value="all">All ({data.results.length})</option>
                {data.metadata.k_values.map(k => (
                  <option key={k} value={k}>k = {k}</option>
                ))}
              </select>
            </div>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={highlightBest}
                onChange={(e) => setHighlightBest(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-black">Highlight top 10 models</span>
            </label>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-gray-500">Color scale:</span>
              <div className="flex">
                <div className="w-4 h-4 bg-green-500" title="k=5"></div>
                <div className="w-4 h-4 bg-yellow-500" title="k=10-15"></div>
                <div className="w-4 h-4 bg-orange-500" title="k=20-30"></div>
                <div className="w-4 h-4 bg-red-900" title="k=50-60"></div>
              </div>
              <span className="text-xs text-gray-500">k: low → high</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Scatter Plot */}
        <Card className="lg:col-span-2">
          <CardHeader className='text-black'>
            <CardTitle>Train RMSE vs Validation RMSE</CardTitle>
            <CardDescription>
              Points below the diagonal generalize well. Points far right overfit badly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={450}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 50, left: 70 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  dataKey="train_rmse" 
                  name="Train RMSE"
                  domain={xAxisConfig.domain}
                  ticks={xAxisConfig.ticks}
                  label={{ value: 'Training RMSE', position: 'bottom', offset: -10 }}
                  tickFormatter={(value) => value.toFixed(2)}
                />
                <YAxis 
                  type="number" 
                  dataKey="valid_rmse" 
                  name="Valid RMSE"
                  domain={yAxisConfig.domain}
                  ticks={yAxisConfig.ticks}
                  label={{ value: 'Validation RMSE', angle: -90, position: 'insideLeft', offset: 10 }}
                  tickFormatter={(value) => value.toFixed(2)}
                />
                <Tooltip content={<CustomTooltip />} />
                
                {/* Baseline reference line */}
                <ReferenceLine 
                  y={data.metadata.baseline_rmse.valid} 
                  stroke="#ef4444" 
                  strokeDasharray="5 5"
                  label={{ value: 'Baseline', position: 'right', fill: '#ef4444' }}
                />

                {/* Main scatter */}
                <Scatter 
                  name="Configurations" 
                  data={filteredData} 
                  onClick={(data) => setSelectedPoint(data as SweepResult)}
                  cursor="pointer"
                >
                  {filteredData.map((entry, index) => {
                    const isBest = highlightBest && paretoPoints.some(p => 
                      p.k === entry.k && p.lambda_w === entry.lambda_w && p.lambda_z === entry.lambda_z
                    )
                    return (
                      <Cell 
                        key={`cell-${index}`}
                        fill={kColorScale[entry.k] || '#888'}
                        stroke={isBest ? '#000' : 'none'}
                        strokeWidth={isBest ? 2 : 0}
                        r={isBest ? 8 : 5}
                      />
                    )
                  })}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Selected Point Details */}
        <Card>
          <CardHeader>
            <CardTitle className='text-black'>
              {selectedPoint ? 'Selected Configuration' : 'Click a Point'}
            </CardTitle>
            <CardDescription>
              {selectedPoint ? 'Details of the selected hyperparameters' : 'Click any dot to see its configuration'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedPoint ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 border-2 rounded-lg">
                    <div className="text-2xl text-black">K = {selectedPoint.k}</div>
                  </div>
                  <div className="p-3 border-2 rounded-lg">
                    <div className="text-lg text-black">λW = {selectedPoint.lambda_w}</div>
                  </div>
                  <div className="p-3 border-2 rounded-lg">
                    <div className="text-lg text-black">λZ = {selectedPoint.lambda_z}</div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Train RMSE</span>
                    <span className="font-mono font-bold text-blue-600">
                      {selectedPoint.train_rmse.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Valid RMSE</span>
                    <span className="font-mono font-bold text-red-600">
                      {selectedPoint.valid_rmse.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Overfitting Gap</span>
                    <span className={`font-mono font-bold ${
                      selectedPoint.overfitting_gap < 0.25 ? 'text-green-600' : 
                      selectedPoint.overfitting_gap < 0.35 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {selectedPoint.overfitting_gap.toFixed(4)}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-sm text-gray-600 mb-2">Overfitting Assessment:</div>
                  <div className={`p-3 rounded-lg text-center ${
                    selectedPoint.overfitting_gap < 0.25 ? 'bg-green-100 text-green-800' :
                    selectedPoint.overfitting_gap < 0.35 ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedPoint.overfitting_gap < 0.25 ? 'Good Generalization' :
                     selectedPoint.overfitting_gap < 0.35 ? 'Moderate Overfitting' :
                     'Severe Overfitting'}
                  </div>
                </div>

                <div className="pt-4 border-t text-xs text-gray-500">
                  <div>Rank by Valid RMSE: #{data.results.filter(r => r.valid_rmse < selectedPoint.valid_rmse).length + 1} of {data.results.length}</div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <div>Click any dot in the scatter plot to see its hyperparameters and performance</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className='text-black'>Key Finding: Simplicity Wins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-black">
                The best model uses just <span className="font-bold text-black">k = 5</span> latent factors - 
                vastly simpler than complex models with k = 60, yet performs equally well!
              </p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-3 border-2 rounded-lg">
                  <div className="font-bold text-black text-center mb-2">k = 5 (Best)</div>
                  <div className="text-sm text-black">Train: <span className="font-mono text-blue-600">0.70</span></div>
                  <div className="text-sm text-black">Valid: <span className="font-mono text-green-600">0.90</span></div>
                  <div className="text-sm text-black">Gap: <span className="font-mono text-green-500">0.20</span></div>
                </div>
                <div className="p-3 border-2 rounded-lg">
                  <div className="font-bold text-black text-center mb-2">k = 60 (Overfit)</div>
                  <div className="text-sm text-black">Train: <span className="font-mono text-blue-600">0.52</span></div>
                  <div className="text-sm text-black">Valid: <span className="font-mono text-red-600">0.90</span></div>
                  <div className="text-sm text-black">Gap: <span className="font-mono text-red-500">0.38</span></div>
                </div>
              </div>
              <p className="text-sm text-black mt-2">
                k=60 fits training data much better (0.52 vs 0.70) but validation performance is <strong>identical</strong>. 
                The gap is <strong>almost double</strong> - severe overfitting!
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-black'>The Regularization Trade-off</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-black">
                Best configuration uses <span className="font-bold text-black">extremely asymmetric regularization</span>:
              </p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-3 rounded-lg text-center border-2">
                  <div className="text-3xl font-bold text-black">λW = 100</div>
                  <div className="text-xs text-black font-semibold">STRONG regularization</div>
                  <div className="text-xs text-gray-600 mt-1">Movie factors (W)</div>
                </div>
                <div className="p-3 rounded-lg text-center border">
                  <div className="text-3xl font-bold text-black">λZ = 0.1</div>
                  <div className="text-xs text-black">Weak regularization</div>
                  <div className="text-xs text-gray-600 mt-1">User features (Z)</div>
                </div>
              </div>
                <div className="text-sm text-gray-700">
                  <span className="font-bold">Ratio: 1000:1</span> — Movie factors need <strong>1000× more constraint</strong> than user features! 
                  Interestingly enough, the second best configuration is when λZ = 100 and λW = 0.1.
                  So this works both ways!

                </div>
              </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle className='text-black'>Search Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">{data.metadata.total_combinations}</div>
              <div className="text-sm text-gray-500">Combinations Tested</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.bestValid.toFixed(3)}</div>
              <div className="text-sm text-gray-500">Best Valid RMSE</div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.worstValid.toFixed(3)}</div>
              <div className="text-sm text-gray-500">Worst Valid RMSE</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{stats.maxGap.toFixed(3)}</div>
              <div className="text-sm text-gray-500">Largest Overfit Gap</div>
            </div>
          </div>          
        </CardContent>
      </Card>
    </div>
  )
}
