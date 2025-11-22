import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

import RootSaga from "./Sagas/RootSaga";
import RootReducer from "./Reducers/RootReducer";

const saga = createSagaMiddleware();

const Store = configureStore({
  reducer: RootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(saga),
});

saga.run(RootSaga);

export default Store;
