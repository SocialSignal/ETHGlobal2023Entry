import { NextApiRequest, NextApiResponse } from "next";
import { ENSProfile, TribeReference, TribeSummary, ValueReference } from "../../types/types";

// TODO: validation with zod
type RequestData = {

  /*
   * Identifies the address of the signed in user who is viewing the list of Tribes.
   * null if and only if the user is not signed in.
   */
  viewer: string | null;
}

type ResponseData = {
  
  /*
   * Returns a list of 0 or more TribeSummary objects for each Tribe ever created.
   */
  tribes: TribeSummary[];
}

function buildMockTribeSummary(chainId: number, tribeAddress: string, displayName: string, owner: string, memberCount: number, values: ValueReference[]): TribeSummary {
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

function buildValueReferences(rawValues: string, viewerValues: ValueReference[] | null): ValueReference[] {

  let values: ValueReference[] = [];

  rawValues.split(",").forEach((rawValue) => {

    const displayValue = rawValue.trim();

    // normalize by removing all whitespace and converting to lowercase
    const normalizedValue = displayValue.replace(/\s+/g, '').toLowerCase();

    // ignore any empty values
    if (normalizedValue.length > 0) {

      let sharedWithViewer : boolean;
      if (!viewerValues) {
        sharedWithViewer = false;
      } else {
        const matchingValue = viewerValues.find((viewerValue) => {
          return viewerValue.normalizedValue === normalizedValue;
        });

        sharedWithViewer = matchingValue !== undefined;
      }

      if (values.find((value) => {
        return value.normalizedValue === normalizedValue;
      })) {
        // ignore duplicate values
      } else {
        values.push({
          displayValue: displayValue,
          normalizedValue: normalizedValue,
          sharedWithViewer: sharedWithViewer
        });
      }
    }

  });

  // put the values in alphabetical order, with the values shared with the viewer first
  return values.sort((a, b) => {
    if (a.sharedWithViewer && b.sharedWithViewer) {
      return a.normalizedValue.localeCompare(b.normalizedValue);
    } else if (a.sharedWithViewer) {
      return -1;
    } else if (b.sharedWithViewer) {
      return 1;
    } else {
      return a.normalizedValue.localeCompare(b.normalizedValue);
    }
  });
}

export default function getTribeList(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const requestData: RequestData = {
    viewer: req.query.viewer ? req.query.viewer.toString() : null
  };

  console.log(`getTribeList: viewer: ${requestData.viewer}`);

  const values1 = buildValueReferences("Web3, Decentralization, LOVE, Environment", null);
  const values2 = buildValueReferences("Blockchain, web3, love, the environement, LoVE, clean water, ,", values1);

  const tribe1 = buildMockTribeSummary(1, "0x283af0b28c62c092c9727f1ee09c02ca627eb7f5", "Tribe 1", "0xd8da6bf26964af9d7eed9e03e53415d37aa96045", 123, values1);
  const tribe2 = buildMockTribeSummary(1, "0x253553366da8546fc250f225fe3d25d0c782303b", "Tribe 2", "0x1a199654959140e5c1a2f4135faa7ba2748939c5", 234, values2);

  const tribeList: ResponseData = {
    tribes: [tribe1, tribe2]
  };

  res.status(200).json(tribeList)
}