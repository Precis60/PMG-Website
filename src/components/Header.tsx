import { Menu } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { business, logoUrl, nav } from '@/data/site'

function itemClass(isActive: boolean) {
  return [
    'inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium',
    isActive ? 'text-eucalypt underline decoration-eucalypt decoration-2 underline-offset-8' : 'text-foreground',
  ].join(' ')
}

export function Header() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [path, setPath] = useState(location.pathname)

  if (location.pathname !== path) {
    setPath(location.pathname)
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link to="/" aria-label="Precision Maintenance & Gardening, home" className="flex min-w-0 items-center gap-3">
          <img src={logoUrl} alt="" width={48} height={48} className="size-12 shrink-0" />
          <span className="font-heading hidden text-[0.95rem] leading-tight font-bold tracking-tight sm:block">
            Precision Maintenance & Gardening
          </span>
        </Link>

        <nav aria-label="Primary" className="ml-auto hidden items-center lg:flex">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => itemClass(isActive)}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <a
          href={`tel:${business.phoneTel}`}
          className="ml-auto hidden min-h-11 items-center text-sm font-medium lg:ml-2 lg:inline-flex"
        >
          {business.phoneDisplay}
        </a>

        <Button asChild className="ml-auto h-11 px-4 lg:ml-1">
          <Link to="/quote">
            <span className="sm:hidden">Quote</span>
            <span className="hidden sm:inline">Get a quote</span>
          </Link>
        </Button>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="size-11 lg:hidden" aria-label="Open menu">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[min(100%,20rem)]">
            <SheetHeader>
              <SheetTitle className="font-heading text-lg">Menu</SheetTitle>
              <SheetDescription>Pages and contact</SheetDescription>
            </SheetHeader>
            <nav aria-label="Mobile" className="flex flex-col px-4">
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `min-h-11 border-b border-border text-lg font-medium ${isActive ? 'text-eucalypt' : ''}`
                  }
                >
                  <span className="flex min-h-11 items-center">{item.label}</span>
                </NavLink>
              ))}
              <a href={`tel:${business.phoneTel}`} className="flex min-h-11 items-center text-lg font-medium">
                {business.phoneDisplay}
              </a>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
