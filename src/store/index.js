import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import productReducer from './slices/productSlice'
import saleReducer from './slices/saleSlice'
import withdrawalReducer from './slices/withdrawalSlice'
import adminReducer from './slices/adminSlice'
import buyerReducer from './slices/buyerSlice'
import relaunchReducer from './slices/relaunchSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    sales: saleReducer,
    withdrawals: withdrawalReducer,
    admin: adminReducer,
    buyer: buyerReducer,
    relaunch: relaunchReducer,
  },
})
