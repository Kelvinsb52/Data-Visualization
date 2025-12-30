# MovieLens Explorer - AI Agent Instructions

## Project Overview
This is a data visualization dashboard for MovieLens collaborative filtering research, built with Next.js 16 App Router + React 19 + TypeScript + Tailwind CSS. The app presents machine learning insights through interactive charts in a chapter-based narrative structure.

## Architecture & Data Flow
- **Single-page application** with chapter-based navigation (currently only Chapter 1 implemented)
- **Static data pipeline**: Pre-computed JSON files in `/public/data/` loaded via client-side fetch
- **Component hierarchy**: `page.tsx` → Chapter components → UI components → Charts (Recharts)
- **Data structure**: Each chapter has a dedicated JSON file with strongly-typed interfaces

### Key Data Files
- `overview.json` - Core dataset metrics, rating distributions, sparsity matrix sample
- `chapter2_baseline_vs_model.json` - Model comparison data (not yet implemented)  
- `chapter3_hyperparameter_sweep.json` - Hyperparameter optimization results
- `chapter4_regularization_comparison.json` - Regularization technique comparisons

## Component Patterns

### Chapter Structure
Each chapter follows this pattern:
```tsx
// Strong typing with dedicated interfaces
interface ChapterData {
  metadata: { /* core metrics */ }
  distributions: { /* chart data arrays */ }
  // chapter-specific sections...
}

// Layout: title → description → metric cards → visualizations
export default function Chapter1({ data }: { data: ChapterData }) {
  return (
    <div className="space-y-8 p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Chapter Title</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Description</p>
      </div>
      {/* Metric cards grid */}
      {/* Visualization grid */}
    </div>
  )
}
```

### Custom UI Components
- **Card system**: `Card`, `CardHeader`, `CardContent`, `CardTitle`, `CardDescription` in `/src/components/ui/Card.tsx`
- **Custom charts**: `Heatmap` component for sparsity visualization with manual SVG rendering
- **Recharts integration**: Use `ResponsiveContainer` wrapper, consistent color scheme (`text-red-600`, `text-green-600`, `hsl(220, 70%, %)`)

### Data Loading Pattern
```tsx
// Client-side fetch in useEffect, with loading states
const [data, setData] = useState(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
  fetch('/data/filename.json')
    .then(res => res.json())
    .then(data => { setData(data); setLoading(false) })
    .catch(err => { console.error('Error loading data:', err); setLoading(false) })
}, [])
```

## Development Workflow
- **Start dev server**: `npm run dev` (opens localhost:3000)
- **Build**: `npm run build` 
- **Lint**: `eslint` (configured with Next.js defaults)
- **Styling**: Tailwind CSS with utility classes, custom CSS in `globals.css`

## Code Conventions
- **File organization**: Components in `/src/components/`, UI primitives in `/src/components/ui/`
- **Naming**: PascalCase for components, camelCase for data properties
- **Type safety**: Dedicated interfaces for each data structure, strict TypeScript
- **Styling**: Tailwind utility classes, consistent spacing (`space-y-8`, `p-6`), responsive grids
- **State management**: React useState/useEffect, no external state library

## Adding New Chapters
1. Create `/public/data/chapterN_*.json` with the data
2. Define TypeScript interface for the data structure  
3. Create `/src/components/ChapterN.tsx` following the established pattern
4. Import and render in `page.tsx` (currently only Chapter1 is active)

## Key Integration Points
- **Recharts**: Primary charting library, wrap in `ResponsiveContainer`
- **Lucide React**: Icon library (imported in package.json)
- **Tailwind**: Utility-first CSS, configured for Next.js
- **Public data**: All JSON files are publicly accessible, no authentication needed

## Common Gotchas
- Data files can be very large (40k+ lines) - check file sizes when loading
- Use client-side rendering (`'use client'`) for interactive components
- Maintain consistent error handling patterns in data fetching
- Colors should follow the established theme: red for concerning metrics, green for positive ones