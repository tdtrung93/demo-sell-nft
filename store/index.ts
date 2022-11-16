import { Action, ThunkAction, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';

import reducer from './reducer';

let store;

const PERSISTED_KEYS: string[] = ['user', 'transactions'];

const persistConfig = {
  key: 'root',
  whitelist: PERSISTED_KEYS,
  storage
};

const sagaMiddleware = createSagaMiddleware();

function makeStore(preloadedState = undefined) {
  return configureStore({
    reducer: persistReducer(persistConfig, reducer),
    middleware: (getDefaultMiddleware) => {
      const middleware = getDefaultMiddleware({
        thunk: false,
        immutableCheck: true,
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        }
      }).concat(sagaMiddleware);
      // if (process.env.NODE_ENV === 'development') {
      //   return middleware.concat(logger);
      // }
      return middleware;
    },
    devTools: process.env.NODE_ENV === 'development',
    preloadedState
  });
}

export const getOrCreateStore = (preloadedState = undefined) => {
  let _store = store ?? makeStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = makeStore({
      ...store.getState(),
      ...preloadedState
    });
    // Reset the current store
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store;

  // Create the store once in the client
  if (!store) store = _store;

  return _store;
};

store = getOrCreateStore();

// export function useStore(preloadedState) {
//   const store = useMemo(() => getOrCreateStore(preloadedState), [preloadedState])
//   return store
// }

export type AppState = ReturnType<typeof reducer>;

export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>;

export default store;

export const persistor = persistStore(store);
