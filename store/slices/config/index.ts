import { OpenSeaFungibleToken } from '@interfaces/services/openSeaTypes';
import { EthAsset } from '@interfaces/types';
import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '@store/index';

interface OpenseaPaymentTokensConfig {
  payment_tokens: OpenSeaFungibleToken[];
}

export interface AppConfigState {
  opensea: OpenseaPaymentTokensConfig;
}

const initialState: AppConfigState = {
  opensea: {
    payment_tokens: []
  }
};

const getPaymentTokensByNftOpenseaRequest: CaseReducer<AppConfigState, PayloadAction<string>> = () => {};

const getPaymentTokensByNftOpenseaSuccess: CaseReducer<AppConfigState, PayloadAction<EthAsset>> = (
  state,
  { payload }
) => {
  if (payload !== undefined) {
    const tokens = payload?.opensea_collection?.payment_tokens.filter(
      (token) => token.symbol !== null && token.symbol !== 'WETH'
    );
    state.opensea.payment_tokens = [...tokens];
  }
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    getPaymentTokensByNftOpenseaRequest,
    getPaymentTokensByNftOpenseaSuccess
  }
});

export const configReducer = configSlice.reducer;

export const configActions = configSlice.actions;

export const selectPaymentTokensOpensea = (state: AppState) => state.config.opensea.payment_tokens;
