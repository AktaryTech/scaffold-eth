import * as React from 'react';
import { Button, Badge } from 'antd';
import { usePoller, useBlockNumber } from 'eth-hooks';
// import { WalletOutlined } from '@ant-design/icons';
import Address from './Address';
import { JsonRpcSigner, Network, Web3Provider } from '@ethersproject/providers';

const { useState } = React;

enum StatusEnums {
  Processing = "processing",
  Success = "success",
  Warning = "warning",
  Error = "error",
  Default = "default",
}

interface ProviderProps {
  provider: Web3Provider;
  name: string;
}

export default function Provider(props: ProviderProps) {
  const [showMore, setShowMore] = useState<boolean>(false);
  const [status, setStatus] = useState<StatusEnums>(StatusEnums.Processing);
  const [network, setNetwork] = useState<Network>();
  const [signer, setSigner] = useState<JsonRpcSigner>();
  const [address, setAddress] = useState<string>();

  const blockNumber = useBlockNumber(props.provider);

  usePoller(async () => {
    if (props.provider && typeof props.provider.getNetwork === 'function') {
      try {
        const newNetwork = await props.provider.getNetwork();
        setNetwork(newNetwork);
        if (newNetwork.chainId > 0) {
          setStatus(StatusEnums.Success);
        } else {
          setStatus(StatusEnums.Warning);
        }
      } catch (e) {
        console.log(e);
        setStatus(StatusEnums.Processing);
      }
      try {
        const newSigner = await props.provider.getSigner();
        setSigner(newSigner);
        const newAddress = await newSigner.getAddress();
        setAddress(newAddress);
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }
  }, 1377);

  if (
    typeof props.provider === 'undefined' ||
    typeof props.provider.getNetwork !== 'function' ||
    !network ||
    !network.chainId
  ) {
    return (
      <Button
        shape="round"
        size="large"
        onClick={() => {
          setShowMore(!showMore);
        }}
      >
        <Badge status={status} /> {props.name}
      </Button>
    );
  }

  let showExtra = <></>;
  if (showMore) {
    showExtra = (
      <span>
        <span style={{ padding: 3 }}>
          id:
          {network ? network.chainId : ''}
        </span>
        <span style={{ padding: 3 }}>
          name:
          {network ? network.name : ''}
        </span>
      </span>
    );
  }

  let showWallet = <></>;
  if (typeof signer !== 'undefined' && address) {
    showWallet = (
      <span>
        <span style={{ padding: 3 }}>
          <Address minimized address={address} />
        </span>
      </span>
    );
  }

  return (
    <Button
      shape="round"
      size="large"
      onClick={() => {
        setShowMore(!showMore);
      }}
    >
      <Badge status={status} /> {props.name} {showWallet} #{blockNumber} {showExtra}
    </Button>
  );
}
