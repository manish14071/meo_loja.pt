import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favorites: localStorage.getItem('favorites')
    ? JSON.parse(localStorage.getItem('favorites'))
    : [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action) => {
      const item = action.payload;
      const existItem = state.favorites.find((x) => x._id === item._id);

      if (!existItem) {
        state.favorites.push(item);
        localStorage.setItem('favorites', JSON.stringify(state.favorites));
      }
    },
    removeFromFavorites: (state, action) => {
      state.favorites = state.favorites.filter((x) => x._id !== action.payload);
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
  },
});

export const { addToFavorites, removeFromFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer; 