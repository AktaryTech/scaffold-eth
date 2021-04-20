import { useState } from 'react';
import { usePoller } from 'eth-hooks';
import axios from 'axios';
import { SpeedEnums } from '../constants';

export default function useGasPrice(targetNetwork: any, speed: SpeedEnums) {
  const [gasPrice, setGasPrice] = useState<number>();
  const loadGasPrice = async () => {
    if (targetNetwork.gasPrice) {
      setGasPrice(targetNetwork.gasPrice);
    } else {
      axios
        .get('https://ethgasstation.info/json/ethgasAPI.json')
        .then(response => {
          const newGasPrice = response.data[speed || SpeedEnums.Fast] * 100000000;
          if (newGasPrice !== gasPrice) {
            setGasPrice(newGasPrice);
          }
        })
        .catch(error => console.log(error));
    }
  };

  usePoller(loadGasPrice, 39999);
  return gasPrice;
}
