// import { configureStore } from '@reduxjs/toolkit';
// import contactReducer from '../features/contact/contactSlice';

// export const store = configureStore({
//   reducer: {
//     contacts: contactReducer,
//   },
// });
// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import contactReducer from '../features/contact/contactSlice';

export const store = configureStore({
  reducer: {
    contacts: contactReducer,
  },
});
export type AppDispatch = typeof store.dispatch;