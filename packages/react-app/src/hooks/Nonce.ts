import { Provider } from '@ethersproject/providers';
import { useState } from 'react';

export default function useNonce(mainnetProvider: Provider, address: string) {
  const [nonce, setNonce] = useState(0);

  const Nonce = () => {
    async function getNonce() {
      setNonce(await mainnetProvider.getTransactionCount(address));
    }
    if (address) getNonce();
  };
  Nonce();
  return nonce;
}
