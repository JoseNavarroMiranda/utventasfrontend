import { NavLink, Outlet } from 'react-router'
import DashboardLayout from '../Layout/DashboardLayout'
import { NAV_ITEMS } from '../../constants'

function SellerDashboard() {
  return (
    <DashboardLayout>
      <div className="flex flex-1">
        <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-slate-950/50 p-4 lg:block">
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/vendedor/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-cyan-400/10 text-cyan-300'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default SellerDashboard
