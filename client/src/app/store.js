import { configureStore } from '@reduxjs/toolkit';
import definitionsReducer from '../features/defs/definitionsSlice';

export const store = configureStore({
  reducer: {
    definitions: definitionsReducer,
  },
});
