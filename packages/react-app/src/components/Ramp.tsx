import * as React from 'react';
import { Button, Modal, Divider } from 'antd';
import { DollarCircleOutlined } from '@ant-design/icons';
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';
import { Network } from '@ethersproject/networks';

const { useState } = React;

// added display of 0 if price={price} is not provided

/*
  ~ What does it do? ~

  Displays current ETH price and gives options to buy ETH through Wyre/Ramp/Coinbase
                            or get through Rinkeby/Ropsten/Kovan/Goerli

  ~ How can I use it? ~

  <Ramp 
    price={price} 
    address={address}
  />

  ~ Features ~

  - Ramp opens directly in the application, component uses RampInstantSDK
  - Provide price={price} and current ETH price will be displayed
  - Provide address={address} and your address will be pasted into Wyre/Ramp instantly
*/

interface RampProps {
  networks: {
    [key: string]: {
      id: string;
      name: string;
      chainId: number;
      color: string;
      faucet: string;
    };
  };
  price: number;
  address: string;
}

export default function Ramp(props: RampProps) {
  const [modalUp, setModalUp] = useState<string>('down');

  const type = 'default';

  const allFaucets = [];
  const networkKeys = Object.keys(props.networks);
  for (let n = 0, nl = networkKeys.length; n < nl; n += 1) {
    const key = networkKeys[n];
    if (props.networks[key].chainId !== 31337 && props.networks[key].chainId !== 1) {
      allFaucets.push(
        <p key={props.networks[key].id}>
          <Button
            style={{ color: props.networks[key].color }}
            type={type}
            size="large"
            shape="round"
            onClick={() => {
              window.open(props.networks[key].faucet);
            }}
          >
            {props.networks[key].name}
          </Button>
        </p>,
      );
    }
  }

  return (
    <div>
      <Button
        size="large"
        shape="round"
        onClick={() => {
          setModalUp('up');
        }}
      >
        <DollarCircleOutlined style={{ color: '#52c41a' }} />{' '}
        {typeof props.price === 'undefined' ? 0 : props.price.toFixed(2)}
      </Button>
      <Modal
        title="Buy ETH"
        visible={modalUp === 'up'}
        onCancel={() => {
          setModalUp('down');
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setModalUp('down');
            }}
          >
            cancel
          </Button>,
        ]}
      >
        <p>
          <Button
            type={type}
            size="large"
            shape="round"
            onClick={() => {
              window.open('https://pay.sendwyre.com/purchase?destCurrency=ETH&sourceAmount=25&dest=' + props.address);
            }}
          >
            <span style={{ paddingRight: 15 }} role="img">
              <span role="img" aria-label="flag-us">
                🇺🇸
              </span>
            </span>
            Wyre
          </Button>
        </p>
        <p>
          {' '}
          <Button
            type={type}
            size="large"
            shape="round"
            onClick={() => {
              new RampInstantSDK({
                hostAppName: 'scaffold-eth',
                hostLogoUrl: 'https://scaffoldeth.io/scaffold-eth.png',
                swapAmount: '100000000000000000', // 0.1 ETH in wei  ?
                swapAsset: 'ETH',
                userAddress: props.address,
              })
                .on('*', event => console.log(event))
                .show();
            }}
          >
            <span style={{ paddingRight: 15 }} role="img">
              <span role="img" aria-label="flag-gb">
                🇬🇧
              </span>
            </span>
            Ramp
          </Button>
        </p>

        <p>
          <Button
            type={type}
            size="large"
            shape="round"
            onClick={() => {
              window.open('https://www.coinbase.com/buy-ethereum');
            }}
          >
            <span style={{ paddingRight: 15 }} role="img" aria-label="bank">
              🏦
            </span>
            Coinbase
          </Button>
        </p>

        <Divider />

        <h2>Testnet ETH</h2>

        {allFaucets}
      </Modal>
    </div>
  );
}