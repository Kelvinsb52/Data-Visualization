'use client'

import React from 'react'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
}

export function Switch({ checked, onChange, className = '' }: SwitchProps) {
  return (
    <button
      type="button"
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors 
        ${checked ? 'bg-green-600' : 'bg-gray-300'}
        ${className}
      `}
      onClick={() => onChange(!checked)}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          ${checked ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  )
}