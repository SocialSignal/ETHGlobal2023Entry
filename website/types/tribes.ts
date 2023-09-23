export type TribeReference = {
    
    /*
     * The chain ID where the Tribe was created.
     * Contains a non-negative integer value.
     * Source: Tribe Smart Contract -> Subgraph -> Backend -> Frontend
    */
    chainId: number;

    /*
     * The address of the Tribe Smart Contract on the related `chainId`.
     * Contains a lowercase hex string beginning with "0x".
     * Source: Tribe Smart Contract -> Subgraph -> Backend -> Frontend
    */
    address: string;
};