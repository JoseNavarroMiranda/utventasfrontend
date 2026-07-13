import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Table, Td } from '../Shared/Table'
import Badge from '../Shared/Badge'
import Button from '../Shared/Button'
import Input from '../Shared/Input'
import Modal from '../Shared/Modal'
import { CATEGORIES } from '../../constants'

function ContentModeration() {
  const { items: products } = useSelector((s) => s.products)
  const [categories, setCategories] = useState(CATEGORIES)
  const [catModal, setCatModal] = useState(null)
  const [catInput, setCatInput] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const openEdit = (cat, idx) => {
    setCatModal({ cat, idx })
    setCatInput(cat)
  }

  const openCreate = () => {
    setCatModal({ cat: '', idx: null })
    setCatInput('')
  }

  const saveCategory = () => {
    if (!catInput.trim()) return
    if (catModal.idx !== null) {
      setCategories((prev) => prev.map((c, i) => i === catModal.idx ? catInput.trim() : c))
    } else {
      setCategories((prev) => [...prev, catInput.trim()])
    }
    setCatModal(null)
  }

  const deleteCategory = () => {
    if (deleteTarget === null) return
    setCategories((prev) => prev.filter((_, i) => i !== deleteTarget))
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
          <h2 className="text-lg font-bold text-white">Productos Reportados</h2>
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
          {products.filter((p) => p.id % 2 === 0).map((p) => (
            <tr key={p.id} className="transition hover:bg-white/[0.02]">
              <Td><p className="font-medium text-white">{p.titulo}</p></Td>
              <Td className="text-slate-300">Vendedor #{p.id}</Td>
              <Td><Badge>{p.categoria}</Badge></Td>
              <Td className="font-medium text-white">${(p.precio || 0).toLocaleString()} MXN</Td>
              <Td><Badge color="yellow">Reportado</Badge></Td>
              <Td right>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm">Ver</Button>
                  <Button variant="ghost" size="sm" className="text-red-400">Eliminar</Button>
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
            <tr key={idx} className="transition hover:bg-white/[0.02]">
              <Td className="text-slate-500">{idx + 1}</Td>
              <Td><span className="font-medium text-white">{cat}</span></Td>
              <Td right>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(cat, idx)}>Editar</Button>
                  <Button variant="ghost" size="sm" className="text-red-400" onClick={() => setDeleteTarget(idx)}>Eliminar</Button>
                </div>
              </Td>
            </tr>
          ))}
        </Table>
      </div>

      <Modal isOpen={!!catModal} onClose={() => setCatModal(null)} title={catModal?.idx !== null ? 'Editar Categoria' : 'Nueva Categoria'} size="sm">
        <Input
          label="Nombre de la categoria"
          value={catInput}
          onChange={(e) => setCatInput(e.target.value)}
          placeholder="Ej. Electronica"
        />
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setCatModal(null)}>Cancelar</Button>
          <Button onClick={saveCategory}>{catModal?.idx !== null ? 'Guardar' : 'Crear'}</Button>
        </div>
      </Modal>

      <Modal isOpen={deleteTarget !== null} onClose={() => setDeleteTarget(null)} title="Eliminar Categoria" size="sm">
        <p className="text-sm text-slate-300">
          ¿Eliminar <strong className="text-white">{deleteTarget !== null ? categories[deleteTarget] : ''}</strong>? Los productos con esta categoria quedaran sin categoria asignada.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
          <Button variant="danger" onClick={deleteCategory}>Eliminar</Button>
        </div>
      </Modal>
    </div>
  )
}

export default ContentModeration
