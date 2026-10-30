import { useEffect } from 'react'
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { ContactPage } from '@/pages/ContactPage'
import { CreditsPage } from '@/pages/CreditsPage'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { PrivacyPage } from '@/pages/PrivacyPage'
import { QuotePage } from '@/pages/QuotePage'
import { ServiceAreaPage } from '@/pages/ServiceAreaPage'
import { ServicesPage } from '@/pages/ServicesPage'
import { TermsPage } from '@/pages/TermsPage'

function ScrollManager() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (/^\/services\/.+/.test(pathname)) return
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default function App() {
  return (
    <HashRouter>
      <ScrollManager />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="services/:slug" element={<ServicesPage />} />
          <Route path="service-area" element={<ServiceAreaPage />} />
          <Route path="quote" element={<QuotePage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="photo-credits" element={<CreditsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
