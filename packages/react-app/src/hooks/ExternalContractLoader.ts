/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import { Contract } from '@ethersproject/contracts';
import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { useState, useEffect } from 'react';

/*
  when you want to load an existing contract using just the provider, address, and ABI
*/

/*
  ~ What does it do? ~

  Enables you to load an existing mainnet DAI contract using the provider, address and abi

  ~ How can I use it? ~

  const mainnetDAIContract = useExternalContractLoader(mainnetProvider, DAI_ADDRESS, DAI_ABI)

  ~ Features ~

  - Specify mainnetProvider
  - Specify DAI_ADDRESS and DAI_ABI, you can load/write them using constants.js
*/
export default function useExternalContractLoader(provider: Web3Provider | JsonRpcProvider, address: string, ABI: any, optionalBytecode?: any) {
  const [contract, setContract] = useState<Contract>();
  useEffect(() => {
    async function loadContract() {
      if (typeof provider !== 'undefined' && address && ABI) {
        try {
          // we need to check to see if this provider has a signer or not
          let signer;
          const accounts = await provider.listAccounts();
          if (accounts && accounts.length > 0) {
            signer = provider.getSigner();
          } else {
            signer = provider;
          }

          const customContract = new Contract(address, ABI, signer);
          // if (optionalBytecode) customContract.bytecode = optionalBytecode;

          setContract(customContract);
        } catch (e) {
          console.log('ERROR LOADING EXTERNAL CONTRACT AT ' + address + ' (check provider, address, and ABI)!!', e);
        }
      }
    }
    loadContract();
  }, [provider, address, ABI, optionalBytecode]);
  return contract;
}
