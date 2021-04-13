import * as React from 'react';
import Blockies from 'react-blockies';

// provides a blockie image for the address using "react-blockies" library

interface BlockieProps {
  address?: string;
  size: number;
  scale: number;
}

export default function Blockie(props: BlockieProps): React.ReactElement {
  if (!props.address || typeof props.address.toLowerCase !== 'function') {
    return <span />;
  }
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Blockies seed={props.address.toLowerCase()} {...props} />;
}
