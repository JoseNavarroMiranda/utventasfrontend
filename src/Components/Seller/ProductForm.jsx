import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { createProduct, updateProduct, fetchProducts } from '../../store/slices/productSlice'
import { api } from '../../services/api'
import { CATEGORIES, CONTACT_METHODS } from '../../constants'
import Button from '../Shared/Button'
import Input from '../Shared/Input'
import Select from '../Shared/Select'
import LoadingSpinner from '../Shared/LoadingSpinner'

const INITIAL_STATE = {
  titulo: '',
  descripcion: '',
  precio: '',
  categoria: '',
  contacto_metodo: '',
  contacto_telefono: '',
  imagenes: [],
}

function ProductForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const { items: products, loading: productsLoading } = useSelector((s) => s.products)
  const { user } = useSelector((s) => s.auth)
  const [form, setForm] = useState(INITIAL_STATE)
  const [previews, setPreviews] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (products.length === 0) dispatch(fetchProducts())
  }, [dispatch, products.length])

  useEffect(() => {
    if (!isEdit || products.length === 0) return
    const product = products.find((p) => p.id === Number(id))
    if (!product) return
    setForm({
      titulo: product.titulo || '',
      descripcion: product.descripcion || '',
      precio: product.precio || '',
      categoria: product.categoria || '',
      contacto_metodo: product.contacto_metodo || '',
      contacto_telefono: product.contacto_telefono || '',
      imagenes: [],
    })
    if (product.imagenes?.length) {
      setPreviews(product.imagenes.map((img) => ({ url: img, existing: true })))
    }
  }, [isEdit, id, products])

  const validate = () => {
    const errs = {}
    if (!form.titulo.trim()) errs.titulo = 'El título es obligatorio'
    if (!form.descripcion.trim()) errs.descripcion = 'La descripción es obligatoria'
    if (!form.precio || Number(form.precio) <= 0) errs.precio = 'Ingresa un precio válido'
    if (!form.categoria) errs.categoria = 'Selecciona una categoría'
    if (!form.contacto_metodo) errs.contacto_metodo = 'Selecciona un método de contacto'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleImages = (e) => {
    const files = Array.from(e.target.files)
    const newPreviews = files.map((file) => ({ file, url: URL.createObjectURL(file), existing: false }))
    setPreviews((prev) => [...prev, ...newPreviews])
    setForm((prev) => ({ ...prev, imagenes: [...prev.imagenes, ...files] }))
  }

  const removeImage = (idx) => {
    const target = previews[idx]
    if (!target.existing) {
      URL.revokeObjectURL(target.url)
      setForm((prev) => ({
        ...prev,
        imagenes: prev.imagenes.filter((f) => f !== target.file),
      }))
    }
    setPreviews((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)

    try {
      const uploadPromises = form.imagenes.map(async (file) => {
        const fd = new FormData()
        fd.append('imagen', file)
        const res = await api.upload('/api/vendedor/subir-imagen', fd)
        return res.url
      })
      const newUrls = await Promise.all(uploadPromises)

      const existingUrls = previews.filter((p) => p.existing).map((p) => p.url)

      const imagenes = [...existingUrls, ...newUrls].map((url, i) => ({
        url,
        es_principal: i === 0,
      }))

      const payload = {
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim(),
        precio: Number(form.precio),
        categoria_nombre: form.categoria,
        contacto_metodo: form.contacto_metodo,
        contacto_telefono: form.contacto_telefono || user?.telefono_defecto || '',
        imagenes,
      }

      const result = isEdit
        ? await dispatch(updateProduct({ id: Number(id), ...payload }))
        : await dispatch(createProduct(payload))

      if (result.meta.requestStatus === 'fulfilled') {
        navigate('/vendedor/publicaciones')
      }
    } catch {
      setErrors((prev) => ({ ...prev, imagenes: 'Error al subir las imágenes' }))
    } finally {
      setSubmitting(false)
    }
  }

  if (isEdit && productsLoading && products.length === 0) {
    return <LoadingSpinner className="py-20" size="lg" />
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-white">
        {isEdit ? 'Editar Publicación' : 'Nueva Publicación'}
      </h1>
      <p className="mt-1 text-sm text-slate-400">
        {isEdit ? 'Actualiza los datos de tu producto o espacio.' : 'Completa los datos para publicar tu producto o espacio de habitabilidad.'}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <Input
          label="Título del producto"
          name="titulo"
          placeholder="Ej. Laptop Lenovo Ideapad"
          value={form.titulo}
          onChange={handleChange}
          error={errors.titulo}
        />

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-100">Descripción</span>
          <textarea
            name="descripcion"
            rows={4}
            placeholder="Describe tu producto, estado, motivo de venta..."
            value={form.descripcion}
            onChange={handleChange}
            className={`w-full rounded-xl border bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:ring-2 ${
              errors.descripcion
                ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
            }`}
          />
          {errors.descripcion && <p className="mt-1 text-xs text-red-400">{errors.descripcion}</p>}
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Precio (MXN)"
            name="precio"
            type="number"
            min={1}
            placeholder="Ej. 8500"
            value={form.precio}
            onChange={handleChange}
            error={errors.precio}
          />

          <Select
            label="Categoría"
            name="categoria"
            options={CATEGORIES}
            placeholder="Seleccionar..."
            value={form.categoria}
            onChange={handleChange}
            error={errors.categoria}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Teléfono de contacto"
            name="contacto_telefono"
            placeholder="+52 555 123 4567"
            value={form.contacto_telefono}
            onChange={handleChange}
          />
          <Select
            label="Método de contacto"
            name="contacto_metodo"
            options={CONTACT_METHODS}
            placeholder="Seleccionar..."
            value={form.contacto_metodo}
            onChange={handleChange}
            error={errors.contacto_metodo}
          />
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-100">Fotos del producto</span>
          <div className="flex flex-wrap gap-3">
            {previews.map((p, idx) => (
              <div key={idx} className="group relative h-24 w-24 overflow-hidden rounded-xl border border-white/10">
                <img src={p.url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100"
                >
                    <span className="text-2xl text-white">&times;</span>
                </button>
              </div>
            ))}
            {previews.length < 5 && (
              <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-white/20 text-2xl text-slate-500 transition hover:border-white/40 hover:text-white">
                <span>+</span>
                <input type="file" accept="image/*" multiple onChange={handleImages} className="hidden" />
              </label>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500">Máximo 5 fotos. Formatos: JPG, PNG, WEBP</p>
        </label>

        <div className="flex items-center gap-3 pt-4">
          <Button type="submit" loading={submitting}>
            {isEdit ? 'Guardar Cambios' : 'Publicar Producto'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => navigate('/vendedor/publicaciones')}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ProductForm
