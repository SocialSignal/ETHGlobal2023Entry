import { ContractTransaction, ethers } from "ethers";

export const chainConfig = {
  5 : {
    name: "goerli",
    rpc: `https://goerli.infura.io/v3/${process.env.INFURA_KEY}`,
    tribeFactoryABI: ""
  }
}

const tribeFactoryABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "tribeAddress",
        type: "address",
      },
    ],
    name: "TribeFounded",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "string", name: "nftImageURI", type: "string" },
      { internalType: "string", name: "ensName", type: "string" },
    ],
    name: "createTribe",
    outputs: [
      { internalType: "address", name: "tribeAddress", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "implementationAddress",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "implementationAddress_",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// This function should be server-side only to securely use the PRIVATE_KEY environment variable
export async function createTribe(
  chainId: number,
  owner: string,
  baseURI: string,
  ensName: string
) {
  try {
    // Import the private key from environment variables
    const privateKey = process.env.PRIVATE_KEY;

    if (privateKey === undefined) {
      throw new Error("No private key found in environment variables");
    }

    // Create a new Wallet instance
    const wallet = new ethers.Wallet(privateKey);

    // Connect to Ethereum provider (e.g., Infura)
    // TODO make it multichain
    const provider = new ethers.providers.JsonRpcProvider(
       `https://goerli.infura.io/v3/${process.env.INFURA_KEY}`
      // "http://127.0.0.1:8545"
    );
    const connectedWallet = wallet.connect(provider);

    // Create an instance of the Contract class
    // TODO make it multichain
    const contract = new ethers.Contract(
      "0x50A28a0d610733D261FCe2e315c8a58e30B0a9ac",
      tribeFactoryABI,
      connectedWallet
    );

    // Send transaction

    let tribeAddress;
    contract.on("TribeFounded", (arg1, event) => { 
      tribeAddress = arg1;
  });

    const tx: ContractTransaction = await contract.createTribe(
      owner,
      baseURI,
      ensName
    );

    while (tribeAddress === undefined) {
      await new Promise(r => setTimeout(r, 1000));
    }

    // Wait for the transaction to be mined
    return { tx, tribeAddress };
  } catch (error) {
    console.error("Error in createTribe:", error);
    throw error;
  }
}
