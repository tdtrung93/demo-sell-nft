import { API } from './api';
import { EthAPI } from './eth';

export * from './types';

export const api: API = new EthAPI(); // opensea
