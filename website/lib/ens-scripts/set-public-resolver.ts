import { Signer, ethers } from "ethers";
import { getNamewrapperContract } from "./utils/contracts";

export const setResolver = async (
  name: string,
  resolver: string,
  signer: Signer
) => {
  let node = ethers.utils.namehash(name);
  const res = await getNamewrapperContract(signer).setResolver(node, resolver, {
    gasLimit: 100000,
  });
  await res.wait();
  return res;
};
