import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router'
import { fetchProducts, deleteProduct, toggleProductActive } from '../../store/slices/productSlice'
import LoadingSpinner from '../Shared/LoadingSpinner'
import EmptyState from '../Shared/EmptyState'
import Badge from '../Shared/Badge'
import Button from '../Shared/Button'
import Modal from '../Shared/Modal'

function ProductList() {
  const dispatch = useDispatch()
  const { items: products, loading, error } = useSelector((s) => s.products)
  const [deleteTarget, setDeleteTarget] = useState(null)

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

  if (loading) return <LoadingSpinner className="py-20" size="lg" />
  if (error) return <p className="py-20 text-center text-red-400">{error}</p>

  if (products.length === 0) {
    return (
      <EmptyState
        title="No tienes publicaciones"
        description="Crea tu primera publicación para empezar a vender en la universidad."
        actionLabel="Nueva Publicación"
        onAction={() => window.location.href = '/vendedor/publicaciones/nueva'}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Mis Publicaciones</h1>
          <p className="mt-1 text-sm text-slate-400">
            {products.length} {products.length === 1 ? 'producto' : 'productos'} registrados
          </p>
        </div>
        <Link to="/vendedor/publicaciones/nueva">
          <Button>Nueva Publicación</Button>
        </Link>
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
            {products.map((product) => (
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
                  <button
                    onClick={() => handleToggleActive(product)}
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition ${
                      product.es_activo !== false
                        ? 'bg-emerald-400/15 text-emerald-200 hover:bg-emerald-400/25'
                        : 'bg-red-400/15 text-red-200 hover:bg-red-400/25'
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${product.es_activo !== false ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    {product.es_activo !== false ? 'Activo' : 'Pausado'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  {product.es_premium ? (
                    <Badge color="yellow">Premium</Badge>
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
                    <Link to={`/vendedor/publicaciones/${product.id}/editar`}>
                      <Button variant="ghost" size="sm">Editar</Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteTarget(product)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Eliminar
                    </Button>
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
