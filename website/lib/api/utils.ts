import { ENSProfile, TribeReference, TribeSummary, ValueReference } from "../../types/types";

export function buildMockTribeSummary(chainId: number, tribeAddress: string, displayName: string, owner: string, memberCount: number, values: ValueReference[]): TribeSummary {
    const tribeId : TribeReference = {
      chainId: chainId,
      address: tribeAddress
    };
  
    const ensProfile : ENSProfile = {
      values: values,
      displayName: "Unknown " + tribeAddress.substring(0, 4),
      avatar: `/address/${tribeAddress}/avatar`,
      description: "We help companies by developing tailor-made blockchain solutions using top-notch technology.",
      twitter: "Blockful_io",
      email: "info@blockful.io",
      website: "https://blockful.io",
      github: "blockful-io",
      telegram: "blockful_io"
    };
  
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