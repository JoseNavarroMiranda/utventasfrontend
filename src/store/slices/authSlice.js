import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api'

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/sesiones/login', { correo: credentials.email, password: credentials.password })
      localStorage.setItem('token', res.token)
      return {
        id: res.usuario.usuario_id,
        nombre: res.usuario.nombre,
        email: res.usuario.correo,
        rol: res.usuario.rol_nombre,
        telefono: res.usuario.telefono_defecto,
      }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const sendVerificationCode = createAsyncThunk(
  'auth/sendCode',
  async (correo, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/sesiones/solicitar-codigo', { correo })
      return res
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ nombre, correo, password, rol_nombre, codigo }, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/sesiones/registro-usuario', { nombre, correo, password, rol_nombre, codigo })
      return {
        id: res.data.usuario_id,
        nombre: res.data.nombre,
        email: res.data.correo,
        rol: res.data.rol_nombre,
      }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchProfile = createAsyncThunk(
  'auth/profile',
  async (_, { rejectWithValue }) => {
    try {
      return await api.get('/api/sesiones/perfil')
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: false, error: null },
  reducers: {
    logout(state) {
      state.user = null
      state.error = null
      localStorage.removeItem('token')
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.loading = true
      state.error = null
    }
    const handleRejected = (state, action) => {
      state.loading = false
      state.error = action.payload
    }

    builder
      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(loginUser.rejected, handleRejected)
      .addCase(sendVerificationCode.pending, handlePending)
      .addCase(sendVerificationCode.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(sendVerificationCode.rejected, handleRejected)
      .addCase(registerUser.pending, handlePending)
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(registerUser.rejected, handleRejected)
      .addCase(fetchProfile.pending, handlePending)
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(fetchProfile.rejected, handleRejected)
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
