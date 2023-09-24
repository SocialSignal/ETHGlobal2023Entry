import { AccountSummary, ENSProfile, LensProfile, SocialStorySource, SocialStorySummary, TribeReference, TribeSummary, ValueReference, XMTPProfile } from "../../types/types";
import { ethers } from 'ethers'
import { buildValueReferences } from "../shared/utils";
import { ens_normalize } from "@adraffy/ens-normalize";
import { init as initAirstack, fetchQuery } from "@airstack/node";

export type Providers = {
  chainId: number;
  chainName: string;
  ethers: ethers.providers.JsonRpcProvider;
};

export async function getProviders(chainId: number): Promise<Providers> {
  const mainnetProviderURL = process.env.MAINNET_PROVIDER_URL;
  if (!mainnetProviderURL) {
    throw new Error("You need to provide MAINNET_PROVIDER_URL env variable");
  }

  const goerliProviderURL = process.env.GOERLI_PROVIDER_URL;
  if (!goerliProviderURL) {
    throw new Error("You need to provide GOERLI_PROVIDER_URL env variable");
  }

  let providerURL: string;
  let chainName: string;

  switch (chainId) {
    case 1:
      providerURL = mainnetProviderURL;
      chainName = "mainnet";
      break;
    case 5:
      providerURL = goerliProviderURL;
      chainName = "goerli";
      break;
    default:
      throw new Error(`Unsupported chainId: ${chainId}`);
  }

  const provider = new ethers.providers.JsonRpcProvider(providerURL);

  return {
    chainId: chainId,
    chainName: chainName,
    ethers: provider,
  };
}

export async function buildRealENSProfile(
  providers: Providers,
  address: string,
  viewerValues: ValueReference[]
): Promise<ENSProfile> {
  const primaryName = await providers.ethers.lookupAddress(address);

  let avatar = null;
  let displayName = null;
  let resolver = null;
  if (primaryName && primaryName === ens_normalize(primaryName)) {
    //avatar = `https://metadata.ens.domains/${providers.chainName}/avatar/${primaryName}`;
    avatar = `https://source.boringavatars.com/beam/160/${address}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51`;
    displayName = primaryName;
    resolver = await providers.ethers.getResolver(primaryName);
  } else {
    avatar = `https://source.boringavatars.com/beam/160/${address}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51`;
    displayName = "Unknown " + address.substring(2, 6);
  }

  if (primaryName === "tribes.eth") {
    avatar = `https://metadata.ens.domains/${providers.chainName}/avatar/${primaryName}`;
  }

  let values: ValueReference[] = [];
  let description = null;
  let twitter = null;
  let email = null;
  let website = null;
  let github = null;
  let telegram = null;

  if (resolver) {
    const rawValues = await resolver.getText("values");
    if (rawValues) {
      values = buildValueReferences(rawValues, viewerValues);
    }
    description = await resolver.getText("description");
    twitter = await resolver.getText("com.twitter");
    email = await resolver.getText("email");
    website = await resolver.getText("url");
    github = await resolver.getText("com.github");
    telegram = await resolver.getText("org.telegram");
  }

  return {
    values: values,
    displayName: displayName,
    avatar: avatar,
    description: description,
    twitter: twitter,
    email: email,
    website: website,
    github: github,
    telegram: telegram,
  };
}

export async function buildMockTribeSummary(
  providers: Providers,
  tribeAddress: string,
  displayName: string,
  owner: string,
  memberCount: number,
  viewerValues: ValueReference[]
): Promise<TribeSummary> {
  const tribeId: TribeReference = {
    chainId: providers.chainId,
    address: tribeAddress,
  };

  const ensProfile = await buildRealENSProfile(
    providers,
    tribeAddress,
    viewerValues
  );

  return {
    tribeId: tribeId,
    displayName: displayName,
    owner: owner,
    avatar: `/tribes/${providers.chainId}/${tribeAddress}/avatar`,
    badge: `/tribes/${providers.chainId}/${tribeAddress}/badge`,
    memberCount: memberCount,
    ensProfile: ensProfile,
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


// let poaps = [];

// data.Poaps.Poap.forEach((poap) => {
//     poap.poapEvent.poaps.forEach((poapEvent) => {
//         poapEvent.
//     });
// }

/*

{
  "data": {
    "Poaps": {
      "Poap": [
        {
          "poapEvent": {
            "poaps": [
              {
                "poapEvent": {
                  "eventName": "You have met Patricio in September of 2023 (IRL)"
                }
              }
            ]
          }
        },
        {
          "poapEvent": {
            "poaps": []
          }
        },
        {
          "poapEvent": {
            "poaps": [
              {
                "poapEvent": {
                  "eventName": "You've met Lucas in Summer 23"
                }
              }
            ]
          }
        },
        {
          "poapEvent": {
            "poaps": [
              {
                "poapEvent": {
                  "eventName": "You have met Patricio in April of 2023 (IRL)"
                }
              }
            ]
          }
        },
        {
          "poapEvent": {
            "poaps": []
          }
        },
        {
          "poapEvent": {
            "poaps": [
              {
                "poapEvent": {
                  "eventName": "Airstack Amazing Race Dubai"
                }
              }
            ]
          }
        },
        {
          "poapEvent": {
            "poaps": [
              {
                "poapEvent": {
                  "eventName": "You have met Patricio in July of 2023 (IRL)"
                }
              }
            ]
          }
        },
        {
          "poapEvent": {
            "poaps": [
              {
                "poapEvent": {
                  "eventName": "ETHGlobal Tokyo 2023 Partner Attendee"
                }
              }
            ]
          }
        },
        {
          "poapEvent": {
            "poaps": []
          }
        },
        {
          "poapEvent": {
            "poaps": [
              {
                "poapEvent": {
                  "eventName": "You have met Patricio in June of 2023 (IRL)"
                }
              }
            ]
          }
        },
        {
          "poapEvent": {
            "poaps": []
          }
        },
        {
          "poapEvent": {
            "poaps": []
          }
        },
        {
          "poapEvent": {
            "poaps": [
              {
                "poapEvent": {
                  "eventName": "ETHGlobal Paris 2023 Partner Attendee"
                }
              }
            ]
          }
        },
        {
          "poapEvent": {
            "poaps": []
          }
        }
      ]
    }
  }
}


 */



export async function buildMockAccountSummary(providers: Providers, address: string, primaryTribe: TribeSummary | null, viewerValues: ValueReference[]) : Promise<AccountSummary> {

    const socialStory1 = buildMockSocialStorySummary(SocialStorySource.Tribe, "Also a member of Tribe 1", true);
    const socialStory2 = buildMockSocialStorySummary(SocialStorySource.Value, "Also values Environment", true);
    const socialStory3 = buildMockSocialStorySummary(SocialStorySource.Poap, "Also attended Devcon Bogota", true);
    const socialStory4 = buildMockSocialStorySummary(SocialStorySource.Nft, "Owns a CryptoPunk", false)
    const socialStory5 = buildMockSocialStorySummary(SocialStorySource.Value, "Values Freedom", false);

  let ensProfile = await buildRealENSProfile(providers, address, viewerValues);

  return {
    address: address,
    metaProfile: {
      ensProfile: ensProfile,
      lensProfile: {
        lensName: "ExampleLensName",
      },
      xmtpProfile: {
        activatedXMTP: true,
      },
    },
    curatedSocialStories: [
      socialStory1,
      socialStory2,
      socialStory3,
      socialStory4,
      socialStory5,
    ], // TODO: Ensure not more than MAX_SOCIAL_STORY_SUMMARIES
    primaryTribe: primaryTribe,
  };
}
