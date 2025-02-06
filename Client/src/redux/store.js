import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import cartSliceReducer from "./features/cart/cartSlice";
import authSliceReducer from "./features/auth/authSlice";
import favoritesReducer from "./features/favorites/favoritesSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import shopReducer from "./features/shop/shopSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartSliceReducer,
    auth: authSliceReducer,
    favorites: favoritesReducer,
    shop:shopReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

setupListeners(store.dispatch);

export default store;