import moment from 'moment';
import { AbiType } from 'opensea-js';
import Web3 from 'web3';

export function convertToUsd(price, usdPrice) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });
  return formatter.format(+usdPrice * price);
}

export function formatDate(date, format) {
  if (!moment(date).isValid) return;
  return moment.unix(date).format(format || 'DD MMM YYYY');
}

export function getDuration() {
  return [
    { label: '1 day', value: 1 },
    { label: '3 days', value: 3 },
    { label: '7 days', value: 7 },
    { label: '1 month', value: 30 },
    { label: '3 months', value: 90 },
    { label: '6 months', value: 180 }
  ];
}

export async function getBalanceByPaymentTokenAddress(account: string, paymentTokenAddress) {
  let ethereum = null;
  let Web3Client = null;

  if (typeof window !== 'undefined') {
    ethereum = window.ethereum;
    Web3Client = new Web3(ethereum);
  }
  let balance = 0;
  const minABI = [
    {
      constant: true,
      inputs: [{ name: '_owner', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ name: 'balance', type: 'uint256' }],
      payable: false,
      type: AbiType.Function
    }
  ];

  if (paymentTokenAddress === '0x0000000000000000000000000000000000000000') {
    const result = await Web3Client.eth.getBalance(account);
    balance = Number(Web3Client.utils.fromWei(result));
    return balance;
  }
  if (!paymentTokenAddress) {
    return 0;
  }

  const contract = new Web3Client.eth.Contract(minABI, paymentTokenAddress);
  const result = await contract.methods.balanceOf(account).call();

  balance = Number(Web3Client.utils.fromWei(result));
  return balance;
}
