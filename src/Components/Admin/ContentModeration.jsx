import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router'
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../../store/slices/adminSlice'
import { fetchProducts, fetchProductById } from '../../store/slices/productSlice'
import { Table, Td } from '../Shared/Table'
import Badge from '../Shared/Badge'
import Button from '../Shared/Button'
import Input from '../Shared/Input'
import Modal from '../Shared/Modal'

function ContentModeration() {
  const dispatch = useDispatch()
  const { categories } = useSelector((s) => s.admin)
  const { items: products } = useSelector((s) => s.products)
  const [catModal, setCatModal] = useState(null)
  const [catInput, setCatInput] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    dispatch(fetchCategories())
    dispatch(fetchProducts())
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Moderacion de Contenido</h1>
        <p className="mt-1 text-sm text-slate-400">{products.length} productos publicados, {categories.length} categorias</p>
      </div>

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
              <Td><p className="font-medium text-white">{p.titulo}</p></Td>
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
                <div className="flex justify-end gap-2">
                  <Link
                    to={`/productos/${p.id}`}
                    onClick={() => dispatch(fetchProductById(p.id))}
                    className="text-sm text-slate-400 transition hover:text-white"
                  >
                    Ver
                  </Link>
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
    </div>
  )
}

export default ContentModeration
