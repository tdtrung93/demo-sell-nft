import { combineReducers } from '@reduxjs/toolkit';

import application from './application/reducer';
import { nftReducer } from './slices/nft';
import { configReducer } from './slices/config';

const reducer = combineReducers({
  application,
  config: configReducer,
  nft: nftReducer,
});

export default reducer;
