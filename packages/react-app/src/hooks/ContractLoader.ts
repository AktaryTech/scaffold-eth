/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import { Signer } from '@ethersproject/abstract-signer';
import { Contract } from '@ethersproject/contracts';
import { JsonRpcProvider, Provider, Web3Provider } from '@ethersproject/providers';
import { useState, useEffect } from 'react';

/*
  ~ What does it do? ~

  Loads your local contracts and gives options to read values from contracts 
                                              or write transactions into them

  ~ How can I use it? ~

  const readContracts = useContractLoader(localProvider) // or
  const writeContracts = useContractLoader(userProvider)

  ~ Features ~

  - localProvider enables reading values from contracts
  - userProvider enables writing transactions into contracts
  - Example of keeping track of "purpose" variable by loading contracts into readContracts 
    and using ContractReader.js hook:
    const purpose = useContractReader(readContracts,"YourContract", "purpose")
  - Example of using setPurpose function from our contract and writing transactions by Notifier.js helper:
    tx( writeContracts.YourContract.setPurpose(newPurpose) )
*/

const loadContract = (contractName: string, signer: Signer): Contract => {
  const newContract: any = new Contract(
    require(`../contracts/${contractName}.address.js`),
    require(`../contracts/${contractName}.abi.js`),
    signer,
  );
  try {
    newContract.bytecode = require(`../contracts/${contractName}.bytecode.js`);
  } catch (e) {
    console.log(e);
  }
  return newContract;
};

export default function useContractLoader(props: { provider?: Web3Provider | JsonRpcProvider; signer?: Signer }) {
  const [contracts, setContracts] = useState<{ [key: string]: Contract }>();
  useEffect(() => {
    async function loadContracts() {
      if (typeof props.provider !== 'undefined' && typeof props.signer !== 'undefined') {
        try {
          // we need to check to see if this providerOrSigner has a signer or not
          const { provider } = props;
          let signer: Signer;
          let accounts;
          if (!!provider && typeof provider.listAccounts === 'function') {
            accounts = await provider.listAccounts();
          }

          if (accounts && accounts.length > 0) {
            signer = provider.getSigner();
          } else {
            signer = props.signer;
          }

          const contractList: string[] = require('../contracts/contracts.js');

          const newContracts = contractList.reduce((accumulator: { [key: string]: Contract }, contractName: string) => {
            accumulator[contractName] = loadContract(contractName, signer);
            return accumulator;
          }, {});
          setContracts(newContracts);
        } catch (e) {
          console.log('ERROR LOADING CONTRACTS!!', e);
        }
      }
    }
    loadContracts();
  }, [props]);
  return contracts;
}
