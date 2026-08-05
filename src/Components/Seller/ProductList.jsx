import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import { fetchProducts, deleteProduct, toggleProductActive } from '../../store/slices/productSlice'
import LoadingSpinner from '../Shared/LoadingSpinner'
import EmptyState from '../Shared/EmptyState'
import Badge from '../Shared/Badge'
import Button from '../Shared/Button'
import Modal from '../Shared/Modal'

function ProductList() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items: products, loading, error } = useSelector((s) => s.products)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [showInactive, setShowInactive] = useState(false)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const handleToggleActive = (product) => {
    dispatch(toggleProductActive({ id: product.id, es_activo: !product.es_activo }))
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    dispatch(deleteProduct(deleteTarget.id))
    setDeleteTarget(null)
  }

  const activeProducts = products.filter((p) => p.es_activo !== false && !p.suspendido)
  const inactiveProducts = products.filter((p) => p.es_activo === false && !p.suspendido)
  const suspendedProducts = products.filter((p) => p.suspendido === true)
  const displayedProducts = showInactive ? inactiveProducts : activeProducts

  if (loading) return <LoadingSpinner className="py-20" size="lg" />
  if (error) return <p className="py-20 text-center text-red-400">{error}</p>

  if (products.length === 0) {
    return (
      <EmptyState
        title="No tienes publicaciones"
        description="Crea tu primera publicación para empezar a vender en la universidad."
        actionLabel="Nueva Publicación"
        onAction={() => navigate('/vendedor/publicaciones/nueva')}
      />
    )
  }

  if (activeProducts.length === 0 && !showInactive) {
    return (
      <div className="space-y-6">
        {suspendedProducts.length > 0 && (
          <div className="flex flex-col gap-2 rounded-xl border border-orange-400/30 bg-orange-500/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-orange-300">
              {suspendedProducts.length} publicación{suspendedProducts.length !== 1 ? 'es' : ''} suspendida
              {suspendedProducts.length !== 1 ? 's' : ''} por resolución de disputa. Debes solicitar su relanzamiento para volver a venderla.
            </p>
            <Link
              to="/vendedor/relanzamientos"
              className="shrink-0 text-xs font-semibold text-orange-200 underline transition hover:text-orange-100"
            >
              Solicitar relanzamiento
            </Link>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Mis Publicaciones</h1>
            <p className="mt-1 text-sm text-slate-400">No tienes publicaciones activas</p>
          </div>
          <div className="flex items-center gap-3">
            {inactiveProducts.length > 0 && (
              <button
                onClick={() => setShowInactive(true)}
                className="text-sm text-slate-400 hover:text-slate-200 transition"
              >
                Ver vendidas ({inactiveProducts.length})
              </button>
            )}
            <Link to="/vendedor/publicaciones/nueva">
              <Button>Nueva Publicación</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {suspendedProducts.length > 0 && (
        <div className="flex flex-col gap-2 rounded-xl border border-orange-400/30 bg-orange-500/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-orange-300">
            {suspendedProducts.length} publicación{suspendedProducts.length !== 1 ? 'es' : ''} suspendida
            {suspendedProducts.length !== 1 ? 's' : ''} por resolución de disputa. Debes solicitar su relanzamiento para volver a venderla.
          </p>
          <Link
            to="/vendedor/relanzamientos"
            className="shrink-0 text-xs font-semibold text-orange-200 underline transition hover:text-orange-100"
          >
            Solicitar relanzamiento
          </Link>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {showInactive ? 'Publicaciones Vendidas' : 'Mis Publicaciones'}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {showInactive
              ? `${inactiveProducts.length} ${inactiveProducts.length === 1 ? 'producto' : 'productos'} vendidos`
              : `${activeProducts.length} ${activeProducts.length === 1 ? 'producto' : 'productos'} activos`
            }
          </p>
        </div>
        <div className="flex items-center gap-3">
          {inactiveProducts.length > 0 && (
            <button
              onClick={() => setShowInactive(!showInactive)}
              className="text-sm text-slate-400 hover:text-slate-200 transition"
            >
              {showInactive ? 'Ver activas' : `Ver vendidas (${inactiveProducts.length})`}
            </button>
          )}
          {!showInactive && (
            <Link to="/vendedor/publicaciones/nueva">
              <Button>Nueva Publicación</Button>
            </Link>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 font-medium text-slate-300">Producto</th>
              <th className="px-4 py-3 font-medium text-slate-300">Categoría</th>
              <th className="px-4 py-3 font-medium text-slate-300">Precio</th>
              <th className="px-4 py-3 font-medium text-slate-300">Estado</th>
              <th className="px-4 py-3 font-medium text-slate-300">Premium</th>
              <th className="px-4 py-3 text-right font-medium text-slate-300">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {displayedProducts.map((product) => (
              <tr key={product.id} className="transition hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <p className="font-medium text-white">{product.titulo}</p>
                  <p className="text-xs text-slate-500">ID: {product.id}</p>
                </td>
                <td className="px-4 py-3 text-slate-300">
                  {product.categoria || 'Sin categoría'}
                </td>
                <td className="px-4 py-3 font-medium text-white">
                  ${(product.precio || 0).toLocaleString()} MXN
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                      product.es_activo !== false
                        ? 'bg-emerald-400/15 text-emerald-200'
                        : 'bg-slate-500/15 text-slate-400'
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${product.es_activo !== false ? 'bg-emerald-400' : 'bg-slate-400'}`} />
                    {product.es_activo !== false ? 'Activo' : 'Vendido'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {product.es_premium ? (
                    <Badge color="yellow">Premium</Badge>
                  ) : product.es_activo === false ? (
                    <span className="text-xs text-slate-500">No disponible</span>
                  ) : (
                    <Link
                      to={`/vendedor/publicaciones/${product.id}/destacar`}
                      className="text-xs text-cyan-400 hover:text-cyan-300"
                    >
                      Destacar
                    </Link>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {!showInactive && (
                      <Link to={`/vendedor/publicaciones/${product.id}/editar`}>
                        <Button variant="ghost" size="sm">Editar</Button>
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Eliminar Publicación"
        size="sm"
      >
        <p className="text-sm text-slate-300">
          ¿Estás seguro de eliminar <strong className="text-white">{deleteTarget?.titulo}</strong>? Esta acción no se puede deshacer.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
          <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
        </div>
      </Modal>
    </div>
  )
}

export default ProductList
