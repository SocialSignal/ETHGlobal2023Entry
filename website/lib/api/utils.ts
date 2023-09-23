import { AccountSummary, ENSProfile, LensProfile, SocialStorySource, SocialStorySummary, TribeReference, TribeSummary, ValueReference, XMTPProfile } from "../../types/types";

export function buildMockENSProfile(address: string, values: ValueReference[]): ENSProfile {
    return {
        values: values,
        displayName: "Unknown " + address.substring(0, 4),
        avatar: `/address/${address}/avatar`,
        description: "We help companies by developing tailor-made blockchain solutions using top-notch technology.",
        twitter: "Blockful_io",
        email: "info@blockful.io",
        website: "https://blockful.io",
        github: "blockful-io",
        telegram: "blockful_io"
      };
}

export function buildMockTribeSummary(chainId: number, tribeAddress: string, displayName: string, owner: string, memberCount: number, values: ValueReference[]): TribeSummary {
    const tribeId : TribeReference = {
      chainId: chainId,
      address: tribeAddress
    };
  
    const ensProfile = buildMockENSProfile(tribeAddress, values);
  
    return {
      tribeId: tribeId,
      displayName: displayName,
      owner: owner,
      avatar: `/tribes/${chainId}/${tribeAddress}/avatar`,
      badge: `/tribes/${chainId}/${tribeAddress}/badge`,
      memberCount: memberCount,
      ensProfile: ensProfile
    };
  }

export function buildMockSocialStorySummary(source: SocialStorySource, description: string, sharedWithViewer: boolean): SocialStorySummary {
    const badge = `/social-story/${source}/badge`;
    return {
        source: source,
        description: description,
        badge: badge,
        sharedWithViewer: sharedWithViewer
    };
}

export function buildMockAccountSummary(address: string, primaryTribe: TribeSummary | null, curatedSocialStories: SocialStorySummary[], values: ValueReference[]) : AccountSummary {

    const socialStory1 = buildMockSocialStorySummary(SocialStorySource.Tribe, "Also a member of Tribe 1", true);
    const socialStory2 = buildMockSocialStorySummary(SocialStorySource.Value, "Also values Environment", true);
    const socialStory3 = buildMockSocialStorySummary(SocialStorySource.Poap, "Also attended Devcon Bogota", true);
    const socialStory4 = buildMockSocialStorySummary(SocialStorySource.Nft, "Owns a CryptoPunk", false)
    const socialStory5 = buildMockSocialStorySummary(SocialStorySource.Value, "Values Freedom", false);

    return {
        address: address,
        metaProfile: {
            ensProfile: buildMockENSProfile(address, values),
            lensProfile: {
                lensName: "ExampleLensName",
            },
            xmtpProfile: {
                activatedXMTP: true,
            }
        },
        curatedSocialStories: [socialStory1, socialStory2, socialStory3, socialStory4, socialStory5], // TODO: Ensure not more than MAX_SOCIAL_STORY_SUMMARIES
        primaryTribe: primaryTribe
    };
}