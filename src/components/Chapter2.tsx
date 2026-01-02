'use client'

import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { Switch } from './ui/Switch'

interface Chapter2Data {
  model_info: {
    k: number
    lambda_w: number
    lambda_z: number
    n_users: number
    n_movies: number
  }
  performance_comparison: {
    baseline: {
      train_rmse: number
      valid_rmse: number
      description: string
    }
    collaborative_filtering: {
      train_rmse: number
      valid_rmse: number
      description: string
    }
  }
  improvement: {
    train_improvement: number
    valid_improvement: number
    train_improvement_percent: number
    valid_improvement_percent: number
  }
}

interface Chapter2Props {
  data: Chapter2Data
}

export default function Chapter2({ data }: Chapter2Props) {
  const [showModel, setShowModel] = useState(true)

  // Prepare data for comparison chart
  const comparisonData = [
    {
      method: 'Baseline',
      train_rmse: data.performance_comparison.baseline.train_rmse,
      valid_rmse: data.performance_comparison.baseline.valid_rmse,
    },
    {
      method: 'Collaborative Filtering',
      train_rmse: data.performance_comparison.collaborative_filtering.train_rmse,
      valid_rmse: data.performance_comparison.collaborative_filtering.valid_rmse,
    }
  ]

  const currentMethod = showModel ? 'collaborative_filtering' : 'baseline'
  const currentData = data.performance_comparison[currentMethod]

  return (
    <div className="space-y-8 p-6">
      <div className="text-center">
        <h1 className="text-4xl text-black font-bold mb-4">Chapter 2: Baseline vs Collaborative Filtering</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Matrix factorization can beat predicting the average... but what if we just picked hyperparameters arbitrarily. 
          <span className="font-semibold text-black"> Are k=50, λW=1, λZ=1 good choices?</span>
        </p>
      </div>

      {/* Method Toggle */}
      <Card>
        <CardHeader className='text-black'>
          <CardTitle>Initial Model vs Baseline</CardTitle>
          <CardDescription>
            Comparing baseline predictor against collaborative filtering with arbitrary hyperparameters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <span className={`text-sm font-medium ${!showModel ? 'text-blue-600' : 'text-black'}`}>
              Baseline (Average)
            </span>
            <Switch 
              checked={showModel} 
              onChange={setShowModel}
              className="bg-blue-500"
            />
            <span className={`text-sm font-medium ${showModel ? 'text-green-600' : 'text-black'}`}>
              Collaborative Filtering
            </span>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-lg mb-2  text-black">
              {showModel ? 'Matrix Factorization Model' : 'Baseline Predictor'}
            </h4>
            <p className="text-gray-600 mb-3">{currentData.description}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${showModel ? 'text-green-600' : 'text-gray-600'}`}>
                  {currentData.train_rmse.toFixed(3)}
                </div>
                <div className="text-sm text-gray-500">Training RMSE</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${showModel ? 'text-green-600' : 'text-gray-600'}`}>
                  {currentData.valid_rmse.toFixed(3)}
                </div>
                <div className="text-sm text-gray-500">Validation RMSE</div>
              </div>
            </div>

            {showModel && (
              <div className="mt-3 space-y-2">
                <div className="text-center text-sm">
                  <span className="text-black">Current Parameters: k={data.model_info.k}, λW={data.model_info.lambda_w}, λZ={data.model_info.lambda_z} </span>
                   
                </div>
                <div className="text-center text-xs text-black text-bold-50 px-3 py-1 rounded">
                    These weren't optimized - just picked arbitrarily!
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* RMSE Comparison Chart */}
        <Card>
          <CardHeader className='text-black'>
            <CardTitle>Performance with Arbitrary Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={comparisonData} margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="method" />
                <YAxis 
                  domain={[0, 1.5]} 
                  label={{ value: 'RMSE', angle: -90, position: 'insideLeft', offset: 10 }}
                  tickFormatter={(value) => value.toFixed(2)}
                />
                <Tooltip 
                  formatter={(value: any, name: any) => [
                    value.toFixed(3), 
                    String(name).replace('_', ' ').toUpperCase()
                  ]} 
                />
                <Legend />
                <Bar dataKey="train_rmse" fill="#3b82f6" name="Train RMSE" />
                <Bar dataKey="valid_rmse" fill="#ef4444" name="Valid RMSE" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Improvement Metrics */}
        <Card>
          <CardHeader className='text-black'>
            <CardTitle>Initial Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Validation RMSE "Improvement"</span>
                <span className="text-lg font-bold text-green-600">
                  {data.improvement.valid_improvement_percent.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(data.improvement.valid_improvement_percent, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Absolute improvement: {data.improvement.valid_improvement.toFixed(3)} RMSE points
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Training RMSE "Improvement"</span>
                <span className="text-lg font-bold text-blue-600">
                  {data.improvement.train_improvement_percent.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(data.improvement.train_improvement_percent, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Absolute improvement: {data.improvement.train_improvement.toFixed(3)} RMSE points
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Insights */}
      <Card>
        <CardHeader className='text-black'>
          <CardTitle>Observations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg border-l-4">
              <div className="text-lg font-semibold text-black">Model Does Not Work</div>
              <div className="text-sm text-black mt-2">
                Choosing random hyperparameters performs worse than random guessing. The model is currently completely backwards!
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border-l-4">
              <div className="text-lg font-semibold text-black">Parameters?</div>
              <div className="text-sm text-black mt-2">
                We picked k=50, λW=1, λZ=1 randomly. This gave us worse performance so we need a better system to find hyperparameters.
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border-l-4">
              <div className="text-lg font-semibold text-black">Next Step</div>
              <div className="text-sm text-black mt-2">
                We need to systematically search for the best hyperparameters
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}