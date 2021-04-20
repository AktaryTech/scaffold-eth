import { config as dotenvConfig } from 'dotenv';
import { INetworks } from '../constants';

dotenvConfig();

export interface IConfig {
  infuraId: string;
  etherscanKey: string;
  blocknativeDappId: string;
  daiAddress: string;
  // daiAbi?: { [key: string]: any }[];
  // networks?: INetworks;
}

const getEnv = (key: string, required: boolean = false): string | undefined => {
  const value = process.env[key];
  if (!value && required) {
    throw new Error(`env var ${key} not set`);
  }

  return value;
};

const config: IConfig = {
  infuraId: getEnv('INFURA_ID') || '460f40a260564ac4a4f4b3fffb032dad',
  etherscanKey: getEnv('ETHERSCAN_KEY') || 'PSW8C433Q667DVEX5BCRMGNAH9FSGFZ7Q8',
  blocknativeDappId: getEnv('BLOCKNATIVE_DAPPID') || '0b58206a-f3c0-4701-a62f-73c7243e8c77',
  daiAddress: getEnv('DAI_ADDRESS') || '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  // daiAbi: getEnv('DAI_ABI') || [],
  // networks: getEnv('NETWORKS') || {},
};

export default config;
