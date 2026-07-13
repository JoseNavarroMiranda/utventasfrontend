function BackgroundLogin() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl" />
      <div className="absolute right-0 top-1/4 h-72 w-72 rounded-full bg-cyan-400/25 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.2),transparent_40%)]" />
    </div>
  )
}

export default BackgroundLogin