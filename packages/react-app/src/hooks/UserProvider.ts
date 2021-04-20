import { useMemo } from 'react';
import { JsonRpcProvider, Provider, Web3Provider } from '@ethersproject/providers';
import * as BurnerProvider from 'burner-provider';
import { INFURA_ID, NETWORKS } from '../constants';

/*
  ~ What does it do? ~

  Gets user provider

  ~ How can I use it? ~

  const userProvider = useUserProvider(injectedProvider, localProvider);

  ~ Features ~

  - Specify the injected provider from Metamask
  - Specify the local provider
  - Usage examples:
    const address = useUserAddress(userProvider);
    const tx = Notifier(userProvider, gasPrice)
*/

const useUserProvider = (
  injectedProvider?: Web3Provider | JsonRpcProvider,
  localProvider?: Web3Provider | JsonRpcProvider,
): Web3Provider | JsonRpcProvider =>
  useMemo(() => {
    if (injectedProvider) {
      console.log('🦊 Using injected provider');
      return injectedProvider;
    }
    if (!localProvider) {
      // 🏠 Your local provider is usually pointed at your local blockchain
      const localProviderUrl = NETWORKS.localhost.rpcUrl;
      // as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
      const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
      console.log('🏠 Connecting to provider:', localProviderUrlFromEnv);
      localProvider = new JsonRpcProvider(localProviderUrlFromEnv);
    }

    const burnerConfig: { [key: string]: any } = {};

    if (window.location.pathname) {
      if (window.location.pathname.indexOf('/pk') >= 0) {
        const incomingPK = window.location.hash.replace('#', '');
        let rawPK;
        if (incomingPK.length === 64 || incomingPK.length === 66) {
          console.log('🔑 Incoming Private Key...');
          rawPK = incomingPK;
          burnerConfig.privateKey = rawPK;
          window.history.pushState({}, '', '/');
          const currentPrivateKey = window.localStorage.getItem('metaPrivateKey');
          if (currentPrivateKey && currentPrivateKey !== rawPK) {
            window.localStorage.setItem('metaPrivateKey_backup' + Date.now(), currentPrivateKey);
          }
          window.localStorage.setItem('metaPrivateKey', rawPK);
        }
      }
    }

    console.log('🔥 Using burner provider', burnerConfig);
    if (localProvider.connection && localProvider.connection.url) {
      burnerConfig.rpcUrl = localProvider.connection.url;
      return new Web3Provider(new BurnerProvider(burnerConfig));
    }
    // eslint-disable-next-line no-underscore-dangle
    const networkName = localProvider._network && localProvider._network.name;
    burnerConfig.rpcUrl = `https://${networkName || 'mainnet'}.infura.io/v3/${INFURA_ID}`;
    return new Web3Provider(new BurnerProvider(burnerConfig));
  }, [injectedProvider, localProvider]);

export default useUserProvider;
