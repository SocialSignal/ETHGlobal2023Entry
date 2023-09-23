import { ethers } from "ethers";
  
const tribeFactoryABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"tribeAddress","type":"address"}],"name":"TribeFounded","type":"event"},{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"nftImageURI","type":"string"},{"internalType":"string","name":"ensName","type":"string"}],"name":"createTribe","outputs":[{"internalType":"address","name":"tribeAddress","type":"address"}],"stateMutability":"nonpayable","type":"function"}]

// This function should be server-side only to securely use the PRIVATE_KEY environment variable
export async function createTribe(networkName: string, name: string, symbol: string, owner: string, baseURI: string, ensName: string) {
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
    const provider = new ethers.providers.JsonRpcProvider(`https://goerli.infura.io/v3/${process.env.INFURA_KEY}`);
    const connectedWallet = wallet.connect(provider);

    // Create an instance of the Contract class
    // TODO make it multichain
    const contract = new ethers.Contract("0x843C1Cf1DAfB56857b698DB3fA84C1f63bf89EA6", tribeFactoryABI, connectedWallet);

    // Send transaction
    const tx = await contract.createTribe(name, symbol, owner, baseURI, ensName);

    // Wait for the transaction to be mined
    return tx.hash;
  } catch (error) {
    console.error("Error in createTribe:", error);
    return {
      txHash: null,
      isSuccess: false,
      error,
    };
  }
}