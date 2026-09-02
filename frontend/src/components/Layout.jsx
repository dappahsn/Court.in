import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import useScrollReveal from '../hooks/useScrollReveal'

export default function Layout() {
  useScrollReveal()

  return (
    <div className="min-h-screen flex flex-col bg-bg-app">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
