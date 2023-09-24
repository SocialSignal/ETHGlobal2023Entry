import { Signer, ethers } from "ethers";

const { IS_MAINNET } = process.env;

const registryAbi = [
  "function resolver(bytes32) view returns(address)",
  "function setResolver(bytes32 node, address resolver) external",
];
const resolverAbi = [
  "function setText(bytes32 node, string calldata key, string calldata value) external",
  "function text(bytes32 node, string calldata key) external returns (string memory)",
  "function multicall(bytes[] calldata data) external returns(bytes[] memory results)",
];
const namewrapperAbi = [
  "function resolver(bytes32) view returns(address)",
  "function setResolver(bytes32 node, address resolver) external",
];

export const getRegistryContract = (signer: Signer) =>
  new ethers.Contract(
    "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    registryAbi,
    signer
  );

export const getResolverContract = (signer: Signer) =>
  new ethers.Contract(
    IS_MAINNET == "true"
      ? "0x4976fb03c32e5b8cfe2b6ccb31c09ba78ebaba41"
      : "0xd7a4F6473f32aC2Af804B3686AE8F1932bC35750",
    resolverAbi,
    signer
  );

export const getNamewrapperContract = (signer: Signer) =>
  new ethers.Contract(
    "0x114D4603199df73e7D157787f8778E21fCd13066",
    namewrapperAbi,
    signer
  );
