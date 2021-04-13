import * as React from 'react';
import { formatUnits } from '@ethersproject/units';
import { Address } from '..';

const tryToDisplay = (thing: any) => {
  if (thing && typeof thing !== 'string') {
    try {
      return thing.toNumber();
    } catch (e) {
      return 'Ξ' + formatUnits(thing, 'ether');
    }
  }
  if (thing && typeof thing === 'string' && thing.indexOf('0x') === 0 && thing.length === 42) {
    return <Address address={thing} fontSize={22} />;
  }
  return JSON.stringify(thing);
};

export default tryToDisplay;
