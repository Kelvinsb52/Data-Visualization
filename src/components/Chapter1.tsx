'use client'

import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { Heatmap } from './ui/Heatmap'

interface OverviewData {
  metadata: {
    n_users: number
    n_movies: number
    train_ratings: number
    valid_ratings: number
    total_possible: number
    sparsity_percent: number
    avg_rating_train: number
  }
  distributions: {
    rating_counts: number[]
    rating_labels: string[]
    user_activity_hist: number[]
    movie_popularity_hist: number[]
  }
  sparsity_sample: {
    matrix: number[][]
    size: number
  }
}

interface Chapter1Props {
  data: OverviewData
}

export default function Chapter1({ data }: Chapter1Props) {
  // Validate data structure
  if (!data?.distributions?.rating_labels || !data?.distributions?.rating_counts) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Invalid data structure</div>
      </div>
    )
  }

  // Validate array lengths match
  const { rating_labels, rating_counts } = data.distributions
  if (rating_labels.length !== rating_counts.length) {
    console.error('Rating labels and counts arrays have different lengths')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Data mismatch error</div>
      </div>
    )
  }

  // Prepare data for rating distribution chart
  const ratingData = rating_labels.map((label, index) => ({
    rating: label,
    count: rating_counts[index] || 0
  }))

  return (
    <div className="space-y-8 p-6">
      <div className="text-center">
        <h1 className="text-4xl text-black font-bold mb-4">Chapter 1: The Data Is Sparse</h1>
        <p className="text-lg text-black max-w-2xl mx-auto">
          Most entries are missing; we only learn from observed ratings. 
          This sparsity is both the challenge and opportunity for collaborative filtering.
        </p>
      </div>

      {/* Big Number Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2 text-black">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-2xl">{data.metadata.n_users.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2 text-black">
            <CardDescription>Total Movies</CardDescription>
            <CardTitle className="text-2xl">{data.metadata.n_movies.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2 text-black">
            <CardDescription>Sparsity</CardDescription>
            <CardTitle className="text-2xl">
              {data.metadata.sparsity_percent.toFixed(1)}%
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2 text-black">
            <CardDescription>Avg Rating</CardDescription>
            <CardTitle className="text-2xl">
              {data.metadata.avg_rating_train.toFixed(2)} 
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sparsity Heatmap */}
        <Card>
          <CardHeader className='text-black'>
            <CardTitle>Rating Matrix Sample</CardTitle>
            <CardDescription>
              Sample of {data.sparsity_sample.size}×{data.sparsity_sample.size} from 
              full {data.metadata.n_users}×{data.metadata.n_movies} matrix
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Heatmap 
              data={data.sparsity_sample.matrix}
              width={400}
              height={400}
            />
          </CardContent>
        </Card>

        {/* Rating Distribution */}
        <Card>
          <CardHeader className='text-black'>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>How users rate movies (1-5 stars)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ratingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip formatter={(value: number | undefined) => [value ? value.toLocaleString() : '0', 'Count']} />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Key Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Data Split Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-black">
                {data.metadata.train_ratings.toLocaleString()}
              </div>
              <div className="text-sm text-black">Training Ratings</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-black">
                {data.metadata.valid_ratings.toLocaleString()}
              </div>
              <div className="text-sm text-black">Validation Ratings</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-black">
                {data.metadata.total_possible.toLocaleString()}
              </div>
              <div className="text-sm text-black">Possible Ratings</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-black">
                {((data.metadata.total_possible - data.metadata.train_ratings - data.metadata.valid_ratings) / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-black">Missing Ratings</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}