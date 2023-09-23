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

export type ValueReference = {

    /*
     * Used to decide if two values are equal with each other. Making it so that spaces or
     * capitalization differences don’t result in two values being considered as different
     * that are actually the same.
     * 
     * Rule to generate:
     *      Given a raw input string containing any number of comma separated values:
     *      Split using “,”
     *      For each token returned:
     *          Remove all whitespace characters
     *          If the token is an empty string, discard the token
     *          Convert to lowercase
     */
    normalizedValue: string;

    /*
     * Used at a UI level to display a value in a more readable format.
     * NOTE: two values that are considered to be “shared” (equal with each other)
     * will always have the same Normalized Value, but may have different Display Values.
     * 
     * Rule to generate:
     *      Given a raw input string containing any number of comma separated values:
     *      Split using “,”
     *      For each token returned:
     *          Remove any leading or trailing whitespace characters
     *          If the token is an empty string, discard the token
     */
    displayValue: string;

    /*
     * Identifies if the value being used is also held by the “viewed-from” user account.
     * null if and only if the provided “viewed-from” param is NOT defined in the API request.
     */
    sharedWithViewer: boolean | null;
};