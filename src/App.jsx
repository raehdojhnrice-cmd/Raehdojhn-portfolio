import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import MainPortfolio from './MainPortfolio'
import NodearPage from './components/nodear/NodearPage'
import Spinner from './components/Spinner'
import { ErrorBoundary } from './components/ErrorBoundary'

const V4ChaosLuxPage = React.lazy(() => import('./iterations/V4ChaosLuxPage'))

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<MainPortfolio />} />
          <Route path="/v4" element={<V4ChaosLuxPage />} />
          <Route path="/nodear" element={<NodearPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}
