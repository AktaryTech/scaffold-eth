import * as React from 'react';
import { formatEther } from '@ethersproject/units';
import { useTokenBalance } from 'eth-hooks';
import { BigNumber } from 'ethers';

const { useState } = React;

interface TokenBalanceProps {
  contracts: {
    [key: string]: any;
  };
  dollarMultiplier: number;
  img: React.ReactElement;
  address: string;
  balance: BigNumber
  name: string;
}

export default function TokenBalance(props: TokenBalanceProps) {
  const [dollarMode, setDollarMode] = useState(true);

  const tokenContract = props.contracts && props.contracts[props.name];
  const balance = useTokenBalance(tokenContract, props.address, 1777);

  let floatBalance = parseFloat('0.00');

  let usingBalance = balance;

  if (typeof props.balance !== 'undefined') {
    usingBalance = props.balance;
  }

  if (usingBalance) {
    const etherBalance = formatEther(usingBalance);
    parseFloat(etherBalance).toFixed(2);
    floatBalance = parseFloat(etherBalance);
  }

  let displayBalance = floatBalance.toFixed(4);

  if (props.dollarMultiplier && dollarMode) {
    displayBalance = '$' + (floatBalance * props.dollarMultiplier).toFixed(2);
  }

  return (
    <span
      style={{
        verticalAlign: 'middle',
        fontSize: 24,
        padding: 8,
        cursor: 'pointer',
      }}
      onClick={() => {
        setDollarMode(!dollarMode);
      }}
    >
      {props.img} {displayBalance}
    </span>
  );
}
