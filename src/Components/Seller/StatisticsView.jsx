import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area,
} from 'recharts'
import { fetchProducts } from '../../store/slices/productSlice'
import { fetchSales } from '../../store/slices/saleSlice'
import LoadingSpinner from '../Shared/LoadingSpinner'
import { ORDER_STATUS } from '../../constants'

const COLORS = ['#22d3ee', '#34d399', '#60a5fa', '#fbbf24', '#f472b6', '#a78bfa', '#fb923c', '#f87171']

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload) return null
  return (
    <div className="rounded-xl border border-white/10 bg-slate-800 px-4 py-3 shadow-xl">
      <p className="text-sm font-medium text-white">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm text-slate-300" style={{ color: p.color }}>
          {p.name}: {p.value.toLocaleString()}
        </p>
      ))}
    </div>
  )
}

function ChartCard({ title, children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-slate-900 p-6 ${className}`}>
      <h3 className="mb-4 text-lg font-bold text-white">{title}</h3>
      {children}
    </div>
  )
}

function StatisticsView() {
  const dispatch = useDispatch()
  const { items: products, loading: pLoading } = useSelector((s) => s.products)
  const { items: sales, loading: sLoading } = useSelector((s) => s.sales)
  const { balance } = useSelector((s) => s.withdrawals)

  useEffect(() => {
    if (!products.length) dispatch(fetchProducts())
    if (!sales.length) dispatch(fetchSales())
  }, [dispatch, products.length, sales.length])

  const loading = pLoading || sLoading

  const monthlySales = useMemo(() => {
    const months = {}
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const label = d.toLocaleDateString('es-MX', { month: 'short', year: 'numeric' })
      months[key] = { label, ventas: 0, ingresos: 0 }
    }
    sales.forEach((s) => {
      if (!s.created_at) return
      const d = new Date(s.created_at)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      if (months[key]) {
        if (s.estado === 'delivered_completed' || s.estado === 'paid_escrow') {
          months[key].ventas += 1
          months[key].ingresos += s.monto || 0
        }
      }
    })
    return Object.values(months)
  }, [sales])

  const categoryData = useMemo(() => {
    const counts = {}
    products.forEach((p) => {
      const cat = p.categoria || 'Sin categoria'
      counts[cat] = (counts[cat] || 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [products])

  const statusData = useMemo(() => {
    const counts = {}
    sales.forEach((s) => {
      const status = ORDER_STATUS[s.estado]?.label || s.estado
      counts[status] = (counts[status] || 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [sales])

  const topProducts = useMemo(() => {
    const map = {}
    sales
      .filter((s) => s.estado === 'delivered_completed' || s.estado === 'paid_escrow')
      .forEach((s) => {
        const title = s.producto?.titulo || 'Producto'
        map[title] = (map[title] || 0) + (s.monto || 0)
      })
    return Object.entries(map)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
  }, [sales])

  const completedSales = sales.filter((s) => s.estado === 'delivered_completed').length
  const totalRevenue = sales
    .filter((s) => s.estado === 'delivered_completed')
    .reduce((sum, s) => sum + (s.monto || 0), 0)

  if (loading) return <LoadingSpinner className="py-20" size="lg" />

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Estadisticas</h1>
        <p className="mt-1 text-sm text-slate-400">Analisis de ventas, productos e ingresos</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 border-l-4 border-l-cyan-400">
          <p className="text-sm text-slate-400">Productos Totales</p>
          <p className="mt-2 text-3xl font-bold text-white">{products.length}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 border-l-4 border-l-emerald-400">
          <p className="text-sm text-slate-400">Ventas Completadas</p>
          <p className="mt-2 text-3xl font-bold text-white">{completedSales}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 border-l-4 border-l-blue-400">
          <p className="text-sm text-slate-400">Ingresos Totales</p>
          <p className="mt-2 text-3xl font-bold text-white">${totalRevenue.toLocaleString()} MXN</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 border-l-4 border-l-yellow-400">
          <p className="text-sm text-slate-400">Saldo Disponible</p>
          <p className="mt-2 text-3xl font-bold text-white">${(balance || 0).toLocaleString()} MXN</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Ventas por Mes">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="ventas" stroke="#22d3ee" strokeWidth={2} dot={{ fill: '#22d3ee' }} name="Ventas" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Ingresos por Mes">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="ingresos" stroke="#34d399" fill="#34d399" fillOpacity={0.15} strokeWidth={2} name="Ingresos" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Productos por Categoria">
          {categoryData.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-500">Sin datos de categorias</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={90} innerRadius={50} dataKey="value" paddingAngle={3}>
                  {categoryData.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 12 }}
                  formatter={(value) => <span style={{ color: '#94a3b8' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Ventas por Estado">
          {statusData.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-500">Sin datos de ventas</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {statusData.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      <ChartCard title="Productos Mas Vendidos">
        {topProducts.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">Aun no tienes ventas completadas</p>
        ) : (
          <div className="space-y-3">
            {topProducts.map((p, idx) => (
              <div key={p.name} className="flex items-center gap-4 rounded-xl bg-white/5 px-4 py-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10 text-sm font-bold text-cyan-300">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{p.name}</p>
                  <div className="mt-1 h-2 rounded-full bg-slate-700">
                    <div
                      className="h-2 rounded-full bg-cyan-400 transition-all"
                      style={{ width: `${Math.min((p.total / topProducts[0].total) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-bold text-emerald-400">${p.total.toLocaleString()} MXN</span>
              </div>
            ))}
          </div>
        )}
      </ChartCard>
    </div>
  )
}

export default StatisticsView
