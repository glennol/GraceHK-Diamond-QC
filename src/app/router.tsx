import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AppShell from '@/components/layout/AppShell'

const LandingPage = lazy(() => import('@/pages/LandingPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const NewInspectionPage = lazy(() => import('@/pages/NewInspectionPage'))
const InspectionOverviewPage = lazy(() => import('@/pages/InspectionOverviewPage'))
const ImagesPage = lazy(() => import('@/pages/ImagesPage'))
const SymmetryPage = lazy(() => import('@/pages/SymmetryPage'))
const ClarityPage = lazy(() => import('@/pages/ClarityPage'))
const CertificatePage = lazy(() => import('@/pages/CertificatePage'))
const ReportPage = lazy(() => import('@/pages/ReportPage'))
const SettingsPage = lazy(() => import('@/pages/SettingsPage'))

function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-gem-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function AppRouter() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/new" element={<NewInspectionPage />} />
          <Route path="/inspection/:id" element={<InspectionOverviewPage />} />
          <Route path="/inspection/:id/images" element={<ImagesPage />} />
          <Route path="/inspection/:id/symmetry" element={<SymmetryPage />} />
          <Route path="/inspection/:id/clarity" element={<ClarityPage />} />
          <Route path="/inspection/:id/certificate" element={<CertificatePage />} />
          <Route path="/inspection/:id/report" element={<ReportPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
