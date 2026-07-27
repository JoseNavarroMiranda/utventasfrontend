import { createSlice } from '@reduxjs/toolkit'

const MOCK_WITHDRAWALS = [
  { id: 1, correo_paypal_destino: 'jose.navarro@paypal.com', monto: 2500, estado: 'processed_payout', created_at: '2026-05-15T10:00:00Z' },
  { id: 2, correo_paypal_destino: 'jose.navarro@paypal.com', monto: 1200, estado: 'processed_payout', created_at: '2026-04-20T14:30:00Z' },
  { id: 3, correo_paypal_destino: 'jose.navarro@paypal.com', monto: 800, estado: 'pending', created_at: '2026-06-10T09:00:00Z' },
  { id: 4, correo_paypal_destino: 'jose.navarro@paypal.com', monto: 3500, estado: 'processed_payout', created_at: '2026-03-05T16:00:00Z' },
  { id: 5, correo_paypal_destino: 'jose.navarro@paypal.com', monto: 1500, estado: 'pending', created_at: '2026-06-12T11:00:00Z' },
]

const withdrawalSlice = createSlice({
  name: 'withdrawals',
  initialState: { items: MOCK_WITHDRAWALS, balance: 4500, loading: false, error: null },
  reducers: {
    clearWithdrawalError(state) {
      state.error = null
    },
  },
})

export const { clearWithdrawalError } = withdrawalSlice.actions
export default withdrawalSlice.reducer
