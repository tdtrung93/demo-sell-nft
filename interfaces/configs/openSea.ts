import { ETHER_NETWORKS_NAMES } from '@interfaces/constants/ether';
import { OpenSeaPort, OpenSeaSDK } from 'opensea-js';

export const APIPREFIX = process.env.NEXT_PUBLIC_OPENSEA_API || 'https://goerli-api.opensea.io';

export const API_KEY = process.env.NEXT_PUBLIC_OPENSEA_API_KEY || '';

// Opensea API ver 1
const instances = {};
export const SeaPort = (provider): OpenSeaPort => {
  if (!instances[provider?.constructor?.name])
    instances[provider?.constructor?.name] = new OpenSeaPort(provider, {
      networkName: ETHER_NETWORKS_NAMES[process.env.NEXT_PUBLIC_ETH_CHAIN_ID],
      apiKey: process.env.NEXT_PUBLIC_OPENSEA_API_KEY || ''
    });

  return instances[provider?.constructor?.name];
};

// Opensea API ver 2
const instanceSdk = {};
export const OpenSeaSdk = (provider): OpenSeaSDK => {
  if (!instanceSdk[provider?.constructor?.name])
    instanceSdk[provider?.constructor?.name] = new OpenSeaSDK(provider, {
      networkName: ETHER_NETWORKS_NAMES[process.env.NEXT_PUBLIC_ETH_CHAIN_ID],
      apiKey: process.env.NEXT_PUBLIC_OPENSEA_API_KEY || ''
    });

  return instanceSdk[provider?.constructor?.name];
};
