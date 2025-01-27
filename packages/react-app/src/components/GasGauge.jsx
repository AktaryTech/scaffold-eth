import React from "react";
import { Button } from "antd";

// added display of 0 instead of NaN if gas price is not provided

/*
  ~ What does it do? ~

  Displays gas gauge 

  ~ How can I use it? ~

  <GasGauge 
    gasPrice={gasPrice}
  />

  ~ Features ~

  - Provide gasPrice={gasPrice} and get current gas gauge
*/

export default function GasGauge(props) {
  return (
    <Button
      onClick={() => {
        window.open("https://ethgasstation.info/");
      }}
      size="large"
      shape="round"
    >
      <span style={{ marginRight: 8 }}>
        <span role="img" aria-label="fuelpump">
          ⛽️
        </span>
      </span>
      {typeof props.gasPrice === "undefined" ? 0 : parseInt(props.gasPrice, 10) / 10 ** 9}g
    </Button>
  );
}
