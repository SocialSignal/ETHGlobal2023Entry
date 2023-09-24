import { Signer, ethers } from "ethers";
import { getRegistryContract } from "./utils/contracts";

export const getResolver = async (name: string, signer: Signer) => {
  let node = ethers.namehash(name);
  console.log("Node: ", node);
  const resolverAddress = await getRegistryContract(signer).resolver(node);
  return resolverAddress;
};
