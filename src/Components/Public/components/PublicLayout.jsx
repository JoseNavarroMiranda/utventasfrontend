import Navbar from '../../Layout/Navbar'
import Footer from '../../Layout/Footer'

function PublicLayout({ children, className = '' }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white">
      <Navbar />
      <main className={`flex-1 ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default PublicLayout
