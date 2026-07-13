import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import productReducer from './slices/productSlice'
import saleReducer from './slices/saleSlice'
import withdrawalReducer from './slices/withdrawalSlice'
import adminReducer from './slices/adminSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    sales: saleReducer,
    withdrawals: withdrawalReducer,
    admin: adminReducer,
  },
})
