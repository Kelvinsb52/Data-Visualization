'use client'

import React, { useState, useEffect } from 'react'
import Chapter1 from '@/components/Chapter1'
import Chapter2 from '@/components/Chapter2'
import Chapter3 from '@/components/Chapter3'

export default function Home() {
  const [overviewData, setOverviewData] = useState(null)
  const [chapter2Data, setChapter2Data] = useState(null)
  const [chapter3Data, setChapter3Data] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentChapter, setCurrentChapter] = useState(1)

  useEffect(() => {
    Promise.all([
      fetch('/data/overview.json').then(res => res.json()),
      fetch('/data/chapter2_baseline_vs_model.json').then(res => res.json()),
      fetch('/data/chapter3_hyperparameter_sweep.json').then(res => res.json())
    ])
    .then(([overview, chapter2, chapter3]) => {
      setOverviewData(overview)
      setChapter2Data(chapter2)
      setChapter3Data(chapter3)
      setLoading(false)
    })
    .catch(err => {
      console.error('Error loading data:', err)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading MovieLens data...</div>
      </div>
    )
  }

  if (!overviewData || !chapter2Data || !chapter3Data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Error loading data</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="sticky top-0 bg-white shadow-sm z-10 p-4">
        <div className="max-w-4xl mx-auto flex space-x-4">
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              onClick={() => setCurrentChapter(num)}
              className={`px-4 py-2 rounded transition-colors ${
                currentChapter === num 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Section {num}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {currentChapter === 1 && <Chapter1 data={overviewData} />}
      {currentChapter === 2 && <Chapter2 data={chapter2Data} />}
      {currentChapter === 3 && <Chapter3 data={chapter3Data} />}
    </main>
  )
}