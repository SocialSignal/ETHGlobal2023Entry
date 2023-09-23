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


export enum SharedContextSource {
    Tribe = "tribe",
    Value = "value",
    Poap = "poap",
    Nft = "nft"
};

/*
 * Abstractly represents a single piece of data that is shared between two accounts.
 */
export type SharedContext = {

    /*
     * Identifies the source of the SharedContext.
     */
    source: SharedContextSource;

    /*
     * A short description of a contextual data point
     */
    description: string;

    /*
     * URL to small badge image representing the `SharedContextSource` in our own backend.
     * This image will NOT be the image of a specific NFT / POAP / etc..
     * 
     * Url will always be in the format `/shared-context/{source}/badge`.
     * 
     */
    sourceBadge: string;

    /*
     * Identifies if the `SharedContext` is also held by the “viewed-from” user account.
     * null if and only if the provided “viewed-from” param is NOT defined in the API request.
     */
    sharedWithViewer: boolean | null;
};

/*
 * Attributes of an account that are sourced from ENS.
 */
export type ENSProfile = {

    /*
     * Array of 0 or more ValueReferences.
     * Sourced from ENS Resolver records.
     */
    values: ValueReference[];

    /*
     * Provides a user friendly display name for an account.
     * NOTE: This field is related to the "primary ENS name" of an account, but with additional logic to
     * make frontend implementations easier. For example:
     *    If the "primary ENS name" for an account is not defined:
     *      returns “Unknown abcd" where “abcd” are the first 4 hex digits of the Address.
     *      (therefore all accounts always have a displayName)
     *    Else if the "primary ENS name" for an account is not normalized:
     *      returns same as if no "primary ENS name" was defined
     *    Else:
     *      returns the ENS beautified version of the "primary ENS name"
     * Sourced from ENS.
     */
    displayName: string;

    /*
     * URL to avatar image of the account in our own backend.
     * Requests to this URL will ask our backend to do the work to ultimately
     * resolve this image and return it as image data.
     * 
     * NOTE: all accounts will always have an avatar image returned, even if there is no
     * avatar defined in ENS. If no avatar is defined the backend will generate a default
     * avatar as a fallback.
     * 
     * Url will always be in the format `/address/${account}/avatar`.
     * 
     * Image data ultimately returned by that URL will be sourced from ENS Resolver records.
     */
    avatar: string;

    /*
     * A brief description of the account.
     * Sourced from ENS Resolver records.
     * null if and only if no description defined in ENS Resolver records.
     */
    description: string | null;

    /*
     * The Twitter handle associated with the account.
     * Sourced from ENS Resolver records.
     * null if and only if no Twitter handle defined in ENS Resolver records.
     * Assume this is just a handle to a twitter account, and not the full URL to a twitter profile.
     */
    twitter: string | null;

    /*
     * The email address associated with the account.
     * Sourced from ENS Resolver records.
     * null if and only if no email address defined in ENS Resolver records.
     */
    email: string | null;

    /*
     * The website associated with the account.
     * Sourced from ENS Resolver records.
     * null if and only if website defined in ENS Resolver records.
     * Assume this is a full URL to a website.
     */
    website: string | null;

    /*
     * The GitHub handle associated with the account.
     * Sourced from ENS Resolver records.
     * null if and only if no GitHub handle defined in ENS Resolver records.
     * Assume this is just a handle to a GitHub account, and not the full URL to a GitHub profile.
     */
    github: string | null;

    /*
     * The Telegram handle associated with the account.
     * Sourced from ENS Resolver records.
     * null if and only if no Telegram handle defined in ENS Resolver records.
     * Assume this is just a handle to a Telegram account, and not the full URL to a Telegram profile.
     */
    telegram: string | null;
};

/*
 * Attributes of an account that are sourced from Lens.
 */
export type LensProfile = {
    
    /*
     * The name of an account on Lens.
     * Assume this is just a handle to a Lens account, and not the full URL to a Lens profile.
     */
    lensName: string;
};

/*
 * Attributes of an account that are sourced from Lens.
 */
export type XMTPProfile = {
    
    /*
     * Identifies if an account has activated XMTP (and therefore can be contacted through XMTP).
     */
    activatedXMTP: boolean;
};

export type MetaProfile = {

    /*
     * Profile details of an account that are sourced from ENS.
     */
    ensProfile: ENSProfile;

    /*
     * Profile details of an account that are sourced from Lens.
     * null if and only if the account is NOT registered on Lens.
     */
    lensProfile: LensProfile | null;

    /*
     * Profile details of an account that are sourced from XMTP.
     */
    xmtpProfile: XMTPProfile;
};