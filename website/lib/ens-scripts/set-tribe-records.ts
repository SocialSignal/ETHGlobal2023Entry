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

export const setTribeRecords = async (
  name: string,
  records: TribeRecordsInputs,
  signer: Signer
) => {
  let node = ethers.namehash(name);
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
      "name",
      tribeRecords.name,
    ]),
    resolver.interface.encodeFunctionData("setText", [
      node,
      "description",
      tribeRecords.description,
    ]),
    resolver.interface.encodeFunctionData("setText", [
      node,
      "badge",
      tribeRecords.badge,
    ]),
    resolver.interface.encodeFunctionData("setText", [
      node,
      "avatar",
      tribeRecords.avatar,
    ]),
    resolver.interface.encodeFunctionData("setText", [
      node,
      "tribeContract",
      `${tribeRecords.contractChainId}/${tribeRecords.contractAddress}`,
    ]),
  ];

  if (tribeRecords.values !== undefined && tribeRecords.values.length > 0) {
    multicallStack.push(
      resolver.interface.encodeFunctionData("setText", [
        node,
        "values",
        tribeRecords.values.toString(),
      ])
    );
  }

  return multicallStack;
};
