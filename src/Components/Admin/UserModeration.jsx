import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers, suspendUser, verifyUser, updateUserRole } from '../../store/slices/adminSlice'
import { USER_ROLES } from '../../constants'
import { Table, Td } from '../Shared/Table'
import Badge from '../Shared/Badge'
import Button from '../Shared/Button'
import Select from '../Shared/Select'
import Modal from '../Shared/Modal'

function UserModeration() {
  const dispatch = useDispatch()
  const { users } = useSelector((s) => s.admin)
  const [roleModal, setRoleModal] = useState(null)

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])
  const [selectedRole, setSelectedRole] = useState('')

  const handleSuspend = (user) => {
    dispatch(suspendUser({ id: user.id, suspendido: !user.suspendido }))
  }

  const handleVerify = (user) => {
    dispatch(verifyUser({ id: user.id, verificado: !user.verificado }))
  }

  const openRoleModal = (user) => {
    setRoleModal(user)
    setSelectedRole(String(user.rol_id))
  }

  const saveRole = () => {
    if (!roleModal || !selectedRole) return
    dispatch(updateUserRole({ id: roleModal.id, rol_id: Number(selectedRole) }))
    setRoleModal(null)
  }

  const roleOptions = Object.entries(USER_ROLES).map(([value, r]) => ({
    value, label: r.label,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Moderacion de Usuarios</h1>
        <p className="mt-1 text-sm text-slate-400">{users.length} usuarios registrados</p>
      </div>

      <Table
        headers={[
          { label: 'Usuario' },
          { label: 'Correo' },
          { label: 'Rol' },
          { label: 'Estado' },
          { label: 'Verificado' },
          { label: 'Acciones', right: true },
        ]}
      >
        {users.map((user) => {
          const role = USER_ROLES[user.rol_id] || {}
          return (
            <tr key={user.id} className="transition hover:bg-white/[0.02]">
              <Td>
                <p className="font-medium text-white">{user.nombre}</p>
                <p className="text-xs text-slate-500">ID: {user.id}</p>
              </Td>
              <Td className="text-slate-300">{user.email}</Td>
              <Td><Badge color={role.color}>{role.label}</Badge></Td>
              <Td>
                {user.suspendido ? (
                  <Badge color="red">Suspendido</Badge>
                ) : (
                  <Badge color="emerald">Activo</Badge>
                )}
              </Td>
              <Td>
                {user.verificado ? (
                  <Badge color="cyan">Verificado</Badge>
                ) : (
                  <span className="text-xs text-slate-500">Pendiente</span>
                )}
              </Td>
              <Td right>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => openRoleModal(user)}>
                    Rol
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleVerify(user)}>
                    {user.verificado ? 'No verificar' : 'Verificar'}
                  </Button>
                  <Button
                    variant="ghost" size="sm"
                    onClick={() => handleSuspend(user)}
                    className={user.suspendido ? 'text-emerald-400 hover:text-emerald-300' : 'text-red-400 hover:text-red-300'}
                  >
                    {user.suspendido ? 'Activar' : 'Suspender'}
                  </Button>
                </div>
              </Td>
            </tr>
          )
        })}
      </Table>

      <Modal isOpen={!!roleModal} onClose={() => setRoleModal(null)} title="Editar Rol" size="sm">
        <p className="mb-4 text-sm text-slate-300">
          Cambiar rol de <strong className="text-white">{roleModal?.nombre}</strong>
        </p>
        <Select
          options={roleOptions}
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        />
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setRoleModal(null)}>Cancelar</Button>
          <Button onClick={saveRole}>Guardar</Button>
        </div>
      </Modal>
    </div>
  )
}

export default UserModeration
