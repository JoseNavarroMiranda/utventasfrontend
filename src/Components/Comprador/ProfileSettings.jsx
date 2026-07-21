import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfile } from '../../store/slices/buyerSlice'
import Button from '../Shared/Button'
import Input from '../Shared/Input'

function ProfileSettings() {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const { loading } = useSelector((s) => s.buyer)

  const [form, setForm] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    telefono_defecto: user?.telefono_defecto || '',
  })
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setSuccess(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(updateProfile(form)).unwrap()
      setSuccess(true)
    } catch {
      setSuccess(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Ajustes de Perfil</h1>
        <p className="mt-1 text-sm text-slate-400">Modifica tus datos personales y preferencias</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-white/10 bg-slate-900 p-6">
        <Input
          label="Nombre completo"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Tu nombre"
        />

        <Input
          label="Correo electrónico"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="correo@utv.edu.mx"
        />

        <Input
          label="Teléfono de contacto"
          name="telefono_defecto"
          value={form.telefono_defecto}
          onChange={handleChange}
          placeholder="+52 555 123 4567"
        />

        {success && (
          <p className="text-sm text-emerald-400">Perfil actualizado correctamente</p>
        )}

        <Button type="submit" loading={loading} className="w-full">
          Guardar Cambios
        </Button>
      </form>

      <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-6">
        <h2 className="text-lg font-bold text-white">Gestión de Sesión</h2>
        <p className="mt-1 text-sm text-slate-400">Cierra tu sesión actual</p>
        <Button variant="danger" className="mt-4" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}

export default ProfileSettings
