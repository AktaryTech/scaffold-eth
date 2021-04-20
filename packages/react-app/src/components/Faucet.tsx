import * as React from 'react';
import { Input, Button, Tooltip } from 'antd';
import Blockies from 'react-blockies';
import { SendOutlined } from '@ant-design/icons';
import { parseEther } from '@ethersproject/units';
import { useLookupAddress } from 'eth-hooks';
import { Notifier } from '../helpers';
import Wallet from './Wallet';
import { JsonRpcProvider, Provider } from '@ethersproject/providers';

const { useState, useCallback } = React;

// improved a bit by converting address to ens if it exists
// added option to directly input ens name
// added placeholder option

/*
  ~ What does it do? ~

  Displays a local faucet to send ETH to given address, also wallet is provided

  ~ How can I use it? ~

  <Faucet 
    price={price}
    localProvider={localProvider}  
    ensProvider={mainnetProvider}
    placeholder={"Send local faucet"}
  />

  ~ Features ~

  - Provide price={price} of ether and convert between USD and ETH in a wallet
  - Provide localProvider={localProvider} to be able to send ETH to given address
  - Provide ensProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth") or you can enter directly ENS name instead of address
              works both in input field & wallet
  - Provide placeholder="Send local faucet" value for the input
*/

interface FaucetProps {
  ensProvider: Provider;
  localProvider: JsonRpcProvider;
  placeholder?: string;
  price: number;
  onChange(): void;
}

export default function Faucet(props: FaucetProps) {
  const [address, setAddress] = useState<string>('');

  let blockie;
  if (address && typeof address.toLowerCase === 'function') {
    blockie = <Blockies seed={address.toLowerCase()} size={8} scale={4} />;
  } else {
    blockie = <div />;
  }

  const ens = useLookupAddress(props.ensProvider, address);

  const updateAddress = useCallback(
    async newValue => {
      if (typeof newValue !== 'undefined') {
        let newAddress = newValue;
        if (newAddress.indexOf('.eth') > 0 || newAddress.indexOf('.xyz') > 0) {
          try {
            const possibleAddress = await props.ensProvider.resolveName(newAddress);
            if (possibleAddress) {
              newAddress = possibleAddress;
            }
            // eslint-disable-next-line no-empty
          } catch (e) {}
        }
        setAddress(newAddress);
      }
    },
    // eslint-disable-next-line
    [props.ensProvider, props.onChange],
  );

  const tx = Notifier(props.localProvider);

  return (
    <span>
      <Input
        size="large"
        placeholder={props.placeholder ? props.placeholder : 'local faucet'}
        prefix={blockie}
        // value={address}
        value={ens || address}
        onChange={e => {
          // setAddress(e.target.value);
          updateAddress(e.target.value);
        }}
        suffix={
          <Tooltip title="Faucet: Send local ether to an address.">
            <Button
              onClick={() => {
                if (tx) {
                  tx({
                    to: address,
                    value: parseEther('0.01'),
                  });
                  setAddress('');
                }
              }}
              shape="circle"
              icon={<SendOutlined />}
            />
            <Wallet
              color="#888888"
              provider={props.localProvider}
              ensProvider={props.ensProvider}
              price={props.price}
            />
          </Tooltip>
        }
      />
    </span>
  );
}
