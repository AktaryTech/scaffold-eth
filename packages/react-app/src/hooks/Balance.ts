import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { BigNumber } from 'ethers';
import { useState } from 'react';
import usePoller from './Poller';

/*
  ~ What does it do? ~

  Gets your balance in ETH from given address and provider

  ~ How can I use it? ~

  const yourLocalBalance = useBalance(localProvider, address);

  ~ Features ~

  - Provide address and get balance corresponding to given address
  - Change provider to access balance on different chains (ex. mainnetProvider)
*/

export default function useBalance(provider: Web3Provider | JsonRpcProvider, address: string): BigNumber | undefined {
  const [balance, setBalance] = useState<BigNumber>();
  const pollBalance = async () => {
    if (address && provider) {
      const newBalance = await provider.getBalance(address);
      if (newBalance !== balance) {
        // console.log("NEW BALANCE:",newBalance,"Current balance",balance)
        setBalance(newBalance);
      }
    }
  };
  usePoller(pollBalance, 27777, !!address && !!provider);

  return balance;
}
