import Navbar from './Navbar'
import Footer from './Footer'

function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white">
      <Navbar />
      <main className="flex flex-1 flex-col">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default DashboardLayout
