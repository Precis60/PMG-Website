import { Outlet } from 'react-router-dom'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

export function Layout() {
  return (
    <>
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <Header />
      <main id="content" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
