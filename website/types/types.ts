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
     * URL to (large) avatar image of the Tribe in our own backend.
     * Requests to this URL will ask our backend to do the work to ultimately
     * resolve this image and return it as image data.
     * 
     * Url will always be in the format `/tribes/${chainId}/${tribeAddress}/avatar`.
     * 
     */
    avatar: string;

    /*
     * URL to (small) badge image of the Tribe in our own backend.
     * Requests to this URL will ask our backend to do the work to ultimately
     * resolve this image and return it as image data.
     * 
     * Url will always be in the format `/tribes/${chainId}/${tribeAddress}/badge`.
     * 
     */
    badge: string;

    /*
     * The number of members in the Tribe.
     * Always a non-negative integer.
     * Source: Tribe Smart Contract
     */
    memberCount: number;

    /*
     * Profile details of the Tribe's ENS name.
     */
    ensProfile: ENSProfile;

};

export type TribeDetail = TribeSummary & {

    /*
     * An array of 0 or more AccountSummary values identifying all the members of the Tribe.
     * All Tribe members:
     *     1. hold the NFT of the Tribe (therefore they are a "supporter" of the Tribe); AND
     *     2. have been formally admitted by the Tribe owner as a member.
     */
    members: AccountSummary[];

    /*
     * An array of 0 or more AccountSummary values identifying all accounts who are supporting the Tribe
     * (they hold the NFT of the Tribe) but have not yet been formally admitted by the Tribe owner
     * as a member yet.
     */
    supporters: AccountSummary[];

    /*
     * An array of 0 or more AccountSummary values identifying all the accounts who have been invited to join the Tribe
     * as members but have not supported the Tribe yet (they do NOT hold the NFT of the Tribe).
     */
    invites: AccountSummary[];
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

/*
 * Defines the maximum number os SocialStorySummary values
 * that will be provided at a time.
 * 
 * It is possible that many more SocialStorySummary values exist for an account
 * than this number. In this case, the backend will curate the SocialStorySummary values returned
 * where an attempt to guess the most relevant SocialStorySummary values to be returned.
 */
export const MAX_SOCIAL_STORY_SUMMARIES = 5;

/*
 * Defines the possible sources of a SocialStorySummary.
 */
export enum SocialStorySource {
    Tribe = "tribe",
    Value = "value",
    Poap = "poap",
    Nft = "nft"
};

/*
 * Abstractly represents the summary of a "socially relevent" attribute of an account.
 */
export type SocialStorySummary = {

    /*
     * Identifies the source of the SocialStorySource.
     */
    source: SocialStorySource;

    /*
     * A short description of the "socially relevant" attribute of the account.
     */
    description: string;

    /*
     * URL to small badge image representing the `SocialStorySource` in our own backend.
     * This image will NOT be the image of a specific NFT / POAP / etc..
     * 
     * Url will always be in the format `/social-story/{source}/badge`.
     * 
     */
    badge: string;

    /*
     * Identifies if the `SocialStorySummary` is also held by the “viewed-from” user account.
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

export type AccountSummary = {

    /*
     * The address of the Account.
     * Contains a lowercase hex string beginning with "0x".
     */
    address: string;

    /*
     * The MetaProfile of the Account that is sourced from multiple services.
     */
    metaProfile: MetaProfile;

    /*
     * Array of 0 to MAX_SOCIAL_STORY_SUMMARIES SocialStorySummary values.
    * It is possible that many more SocialStorySummary values exist for an account
    * than MAX_SOCIAL_STORY_SUMMARIES. In this case, the backend will curate the SocialStorySummary values returned
    * where an attempt to guess the most relevant SocialStorySummary values to be returned.
     */
    curatedSocialStories: SocialStorySummary[];

    /*
     * Identifies the primary Tribe of the Account.
     * null if and only if:
     *      1. the Account has NOT set a primary Tribe; OR
     *      2. the primary Tribe set by the Account has not added this account as a member.
     */
    primaryTribe: TribeSummary | null;
};

export type AccountDetail = AccountSummary & {

    /*
     * An array of 0 or more TribeSummary values identifying all the tribes the account is a member of.
     * All Tribe members:
     *     1. hold the NFT of the Tribe (therefore they are a "supporter" of the Tribe); AND
     *     2. have been formally admitted by the Tribe owner as a member.
     */
    tribes: TribeSummary[];

    /*
     * An array of 0 or more TribeSummary values identifying all tribes the account is supporting
     * (they hold the NFT of the Tribe) but have not yet been formally admitted by the Tribe owner
     * as a member yet.
     */
    supports: TribeSummary[];

    /*
     * An array of 0 or more TribeSummary values identifying all the tribes who the account has
     * been invited to join as a member but the account hasn't supported the Tribe (they do
     * NOT hold the NFT of the Tribe).
     */
    invites: TribeSummary[];
}