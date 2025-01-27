import { useState, useEffect } from "react";
import { getAddress } from "@ethersproject/address";
import useLocalStorage from "./LocalStorage";

// resolved if(name){} to not save "" into cache

/*
  ~ What does it do? ~

  Gets ENS name from given address and provider

  ~ How can I use it? ~

  const ensName = useLookupAddress(mainnetProvider, address);

  ~ Features ~

  - Provide address and get ENS name corresponding to given address
*/

const lookupAddress = async (provider, address) => {
  try {
    // Accuracy of reverse resolution is not enforced.
    // We then manually ensure that the reported ens name resolves to address
    const reportedName = await provider.lookupAddress(address);

    const resolvedAddress = await provider.resolveName(reportedName);

    if (getAddress(address) === getAddress(resolvedAddress)) {
      return reportedName;
    }
  } catch (e) {
    // Do nothing
  }
  return 0;
};

const useLookupAddress = (provider, address) => {
  const [ensName, setEnsName] = useState(address);
  const [ensCache, setEnsCache] = useLocalStorage("ensCache_" + address);

  useEffect(() => {
    if (ensCache && ensCache.timestamp > Date.now()) {
      setEnsName(ensCache.name);
    } else if (provider) {
      lookupAddress(provider, address).then(name => {
        if (name) {
          setEnsName(name);
          setEnsCache({
            timestamp: Date.now() + 360000,
            name,
          });
        }
      });
    }
  }, [ensCache, provider, address, setEnsName, setEnsCache]);

  return ensName;
};

export default useLookupAddress;
