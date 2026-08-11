import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router'
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  fetchAdminProducts,
  suspendProduct,
  reactivateProduct,
} from '../../store/slices/adminSlice'
import { fetchProductById } from '../../store/slices/productSlice'
import { Table, Td } from '../Shared/Table'
import Badge from '../Shared/Badge'
import Button from '../Shared/Button'
import Input from '../Shared/Input'
import Modal from '../Shared/Modal'

function ContentModeration() {
  const dispatch = useDispatch()
  const { categories, adminProducts: products } = useSelector((s) => s.admin)
  const [catModal, setCatModal] = useState(null)
  const [catInput, setCatInput] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [suspendTarget, setSuspendTarget] = useState(null)
  const [suspendMotivo, setSuspendMotivo] = useState('')
  const [suspendError, setSuspendError] = useState('')
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    dispatch(fetchCategories())
    dispatch(fetchAdminProducts())
  }, [dispatch])

  const openEdit = (cat) => {
    setCatModal({ id: cat.id, nombre: cat.nombre })
    setCatInput(cat.nombre)
  }

  const openCreate = () => {
    setCatModal({ id: null, nombre: '' })
    setCatInput('')
  }

  const saveCategory = () => {
    if (!catInput.trim()) return
    if (catModal.id) {
      dispatch(updateCategory({ id: catModal.id, nombre: catInput.trim() }))
    } else {
      dispatch(createCategory(catInput.trim()))
    }
    setCatModal(null)
  }

  const handleDeleteCategory = () => {
    if (deleteTarget === null) return
    dispatch(deleteCategory(deleteTarget.id))
    setDeleteTarget(null)
  }

  const openSuspend = (product) => {
    setSuspendTarget(product)
    setSuspendMotivo('')
    setSuspendError('')
  }

  const handleSuspend = async () => {
    if (!suspendMotivo.trim()) {
      setSuspendError('Escribe el motivo por el cual se suspende la publicación')
      return
    }
    const res = await dispatch(suspendProduct({ id: suspendTarget.id, motivo: suspendMotivo.trim() }))
    if (res.meta.requestStatus === 'fulfilled') {
      setFeedback(`Publicación "${suspendTarget.titulo}" suspendida. El vendedor deberá solicitar su relanzamiento.`)
      setSuspendTarget(null)
    } else {
      setSuspendError(res.payload || 'No se pudo suspender la publicación')
    }
  }

  const handleReactivate = async (product) => {
    const res = await dispatch(reactivateProduct(product.id))
    if (res.meta.requestStatus === 'fulfilled') {
      setFeedback(`Publicación "${product.titulo}" reactivada.`)
    } else {
      setFeedback(res.payload || 'No se pudo reactivar la publicación')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Moderacion de Contenido</h1>
        <p className="mt-1 text-sm text-slate-400">{products.length} productos publicados, {categories.length} categorias</p>
      </div>

      {feedback && (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          <p className="font-medium">{feedback}</p>
          <button onClick={() => setFeedback(null)} className="shrink-0 text-xs opacity-70 transition hover:opacity-100" aria-label="Cerrar mensaje">
            ✕
          </button>
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Productos Publicados</h2>
        </div>
        <Table
          headers={[
            { label: 'Producto' },
            { label: 'Vendedor' },
            { label: 'Categoria' },
            { label: 'Precio' },
            { label: 'Estado' },
            { label: 'Acciones', right: true },
          ]}
        >
          {products.map((p) => (
            <tr key={p.id} className="transition hover:bg-white/[0.02]">
              <Td>
                <p className="font-medium text-white">{p.titulo}</p>
                {p.motivo_suspension && (
                  <p className="mt-1 max-w-xs text-xs italic text-orange-300/80">"{p.motivo_suspension}"</p>
                )}
              </Td>
              <Td className="text-slate-300">{p.autor_nombre || `Vendedor #${p.id_autor ?? p.id}`}</Td>
              <Td><Badge>{p.categoria || 'Sin categoría'}</Badge></Td>
              <Td className="font-medium text-white">${(p.precio || 0).toLocaleString()} MXN</Td>
              <Td>
                {p.suspendido ? (
                  <Badge color="orange">Suspendida</Badge>
                ) : p.es_activo === false ? (
                  <Badge color="slate">Vendida</Badge>
                ) : (
                  <Badge color="emerald">Activa</Badge>
                )}
              </Td>
              <Td right>
                <div className="flex flex-wrap justify-end gap-2">
                  <Link
                    to={`/productos/${p.id}`}
                    onClick={() => dispatch(fetchProductById(p.id))}
                    className="self-center text-sm text-slate-400 transition hover:text-white"
                  >
                    Ver
                  </Link>
                  {p.suspendido ? (
                    <Button variant="ghost" size="sm" onClick={() => handleReactivate(p)}>Reactivar</Button>
                  ) : p.es_activo !== false ? (
                    <Button variant="danger" size="sm" onClick={() => openSuspend(p)}>Suspender</Button>
                  ) : null}
                </div>
              </Td>
            </tr>
          ))}
        </Table>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Categorias</h2>
          <Button size="sm" onClick={openCreate}>Nueva Categoria</Button>
        </div>
        <Table
          headers={[
            { label: '#' },
            { label: 'Nombre' },
            { label: 'Acciones', right: true },
          ]}
        >
          {categories.map((cat, idx) => (
            <tr key={cat.id} className="transition hover:bg-white/[0.02]">
              <Td className="text-slate-500">{idx + 1}</Td>
              <Td><span className="font-medium text-white">{cat.nombre}</span></Td>
              <Td right>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(cat)}>Editar</Button>
                  <Button variant="ghost" size="sm" className="text-red-400" onClick={() => setDeleteTarget(cat)}>Eliminar</Button>
                </div>
              </Td>
            </tr>
          ))}
        </Table>
      </div>

      <Modal isOpen={!!catModal} onClose={() => setCatModal(null)} title={catModal?.id ? 'Editar Categoria' : 'Nueva Categoria'} size="sm">
        <Input
          label="Nombre de la categoria"
          value={catInput}
          onChange={(e) => setCatInput(e.target.value)}
          placeholder="Ej. Electronica"
        />
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setCatModal(null)}>Cancelar</Button>
          <Button onClick={saveCategory}>{catModal?.id ? 'Guardar' : 'Crear'}</Button>
        </div>
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Eliminar Categoria" size="sm">
        <p className="text-sm text-slate-300">
          ¿Eliminar <strong className="text-white">{deleteTarget?.nombre}</strong>? Los productos con esta categoria quedaran sin categoria asignada.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
          <Button variant="danger" onClick={handleDeleteCategory}>Eliminar</Button>
        </div>
      </Modal>

      <Modal
        isOpen={!!suspendTarget}
        onClose={() => setSuspendTarget(null)}
        title={`Suspender Publicación`}
        size="sm"
      >
        <p className="text-sm text-slate-300">
          Vas a suspender <strong className="text-white">"{suspendTarget?.titulo}"</strong>. El producto
          dejará de mostrarse en el catálogo y el vendedor deberá solicitar su relanzamiento para volver a publicarlo.
        </p>
        <label className="mt-4 block">
          <span className="mb-1.5 block text-sm font-medium text-slate-100">Motivo de la suspensión (obligatorio)</span>
          <textarea
            rows={3}
            placeholder="Explica por qué se retira la publicación del dashboard (ej. incumple las normas del marketplace)"
            value={suspendMotivo}
            onChange={(e) => { setSuspendMotivo(e.target.value); setSuspendError('') }}
            className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:ring-2 ${
              suspendError ? 'border-red-400 focus:ring-red-200' : 'border-white/10 focus:border-cyan-400 focus:ring-cyan-400/20'
            }`}
          />
        </label>
        {suspendError && <p className="mt-1 text-xs text-red-400">{suspendError}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setSuspendTarget(null)}>Cancelar</Button>
          <Button variant="danger" onClick={handleSuspend}>Suspender</Button>
        </div>
      </Modal>
    </div>
  )
}

export default ContentModeration
