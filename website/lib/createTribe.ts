import {
    usePrepareContractWrite,
    useContractWrite,
    useWaitForTransaction
  } from 'wagmi';
  
const tribeFactoryABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"tribeAddress","type":"address"}],"name":"TribeFounded","type":"event"},{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"nftImageURI","type":"string"},{"internalType":"string","name":"ensName","type":"string"}],"name":"createTribe","outputs":[{"internalType":"address","name":"tribeAddress","type":"address"}],"stateMutability":"nonpayable","type":"function"}]

export function createTribe(name: string, symbol: string, owner: string, baseURI: string, ensName: string) {
    const {
        config,
        error: prepareError,
        isError: isPrepareError,
        } = usePrepareContractWrite({
            address: '0x843C1Cf1DAfB56857b698DB3fA84C1f63bf89EA6',
            abi: tribeFactoryABI,
            functionName: 'createTribe',
            args: [
                    name, 
                    symbol, 
                    owner, 
                    baseURI, 
                    ensName
                ]
            })
    const { data, error, isError, write } = useContractWrite(config);

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
    });

    return { data, error, isError, write, isLoading, isSuccess };
}