import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '@store/index';

export interface NftState {
  transactionNftIdSuccess?: any;
}

const initialState: NftState = {
  transactionNftIdSuccess: null
};

const nftSlice = createSlice({
  name: 'nft',
  initialState,
  reducers: {
    setTransactionNftIdSuccess(state: NftState, { payload }: PayloadAction<any>) {
      state.transactionNftIdSuccess = payload;
    },
  }
});

export const nftReducer = nftSlice.reducer;

export const nftActions = nftSlice.actions;

export const { caseReducers } = nftSlice;

// Selectors
export const selectTransactionNftIdSuccess = (state: AppState) => state.nft.transactionNftIdSuccess;
