export type TribeReference = {
    
    /*
     * The chain ID where the Tribe was created.
     * Source: Tribe Smart Contract.
     * Contains a non-negative integer value.
     */
    chainId: number;

    /*
     * The address of the Tribe Smart Contract on the related `chainId`.
     * Source: Tribe Smart Contract.
     * Contains a lowercase hex string beginning with "0x".
     */
    address: string;
};

export type TribeSummary = {

    /*
     * Unique identifier for the Tribe.
     */
    tribeId: TribeReference;

    /*
     * The name of the Tribe.
     * Source: Tribe Smart Contract.
     * Contains a string of up to 255 characters (as truncated by backend).
     */
    displayName: string;

    /*
     * The address of the owner of the Tribe Smart Contract.
     * Source: Tribe Smart Contract
     * Contains a lowercase hex string beginning with "0x".
     */
    owner: string;

    /*
     * URL to large image of the Tribe in our own backend.
     * Requests to this URL will ask our backend to do the work to ultimately
     * resolve this image and return it as image data.
     * 
     * Url will always be in the format `/tribes/${chainId}/${tribeAddress}/largeImage`.
     * 
     */
    largeImage: string;

    /*
     * URL to small badge image of the Tribe in our own backend.
     * Requests to this URL will ask our backend to do the work to ultimately
     * resolve this image and return it as image data.
     * 
     * Url will always be in the format `/tribes/${chainId}/${tribeAddress}/smallBadge`.
     * 
     */
    smallBadge: string;

    /*
     * The number of members in the Tribe.
     * Always a non-negative integer.
     * Source: Tribe Smart Contract
     */
    memberCount: number;

};