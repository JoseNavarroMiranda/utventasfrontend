import { NavLink, Outlet, useLocation } from 'react-router'
import DashboardLayout from '../Layout/DashboardLayout'
import { ADMIN_NAV_ITEMS } from '../../constants'

function AdminDashboard() {
  const { pathname } = useLocation()

  return (
    <DashboardLayout>
      <div className="flex flex-1">
        <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-slate-950/50 p-4 lg:block">
          <nav className="flex flex-col gap-1">
            {ADMIN_NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-red-400/10 text-red-300'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <nav className="flex gap-1 overflow-x-auto border-b border-white/10 bg-slate-950/50 px-4 py-2 lg:hidden">
            {ADMIN_NAV_ITEMS.map((item) => {
              const isActive = item.path === '/admin/dashboard'
                ? pathname === '/admin/dashboard'
                : pathname.startsWith(item.path)
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/admin/dashboard'}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition ${
                    isActive
                      ? 'bg-red-400/10 text-red-300'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </NavLink>
              )
            })}
          </nav>

          <div className="flex-1 overflow-auto p-4 lg:p-8">
            <div className="mx-auto max-w-6xl">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminDashboard
