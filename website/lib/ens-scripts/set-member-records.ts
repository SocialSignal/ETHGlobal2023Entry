import { Signer, ethers } from "ethers";
import { getResolverContract } from "./utils/contracts";

interface TribeRecordsInputs {
  name: string;
  description: string;
  avatar: string;
  badge: string;

  // Encoded in format of `${chainId}/${address}`
  contractAddress: string;

  contractChainId: number;
  values?: string[];
}

export const setMemberRecords = async (
  name: string,
  records: TribeRecordsInputs,
  signer: Signer
) => {
  let node = ethers.utils.namehash(name);
  const resolver = getResolverContract(signer);
  const calldata = buildMulticallData(node, records, resolver);
  const res = await resolver.multicall(calldata);
  await res.wait();
  console.log(res);
};

const buildMulticallData = (
  node: string,
  tribeRecords: TribeRecordsInputs,
  resolver: ethers.Contract
) => {
  var multicallStack = [
    resolver.interface.encodeFunctionData("setText", [
      node,
      "primaryTribeContract",
      `${tribeRecords.contractChainId}/${tribeRecords.contractAddress}`,
    ]),
  ];

  return multicallStack;
};
