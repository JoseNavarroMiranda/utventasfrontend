import BackgroundLogin from './backgroundLogin'

function BackgroundPage({ children }) {
  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100">
      <BackgroundLogin />
      <div className="relative z-10 flex items-stretch">{children}</div>
    </main>
  )
}

export default BackgroundPage