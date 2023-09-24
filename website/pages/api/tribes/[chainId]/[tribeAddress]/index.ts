import { NextApiRequest, NextApiResponse } from "next";
import { SocialStorySummary, TribeDetail, TribeReference } from "../../../../../types/types";
import { buildValueReferences } from "../../../../../lib/shared/utils";
import { buildMockAccountSummary, buildMockTribeSummary, getProviders } from "../../../../../lib/api/utils";

// TODO: validation with zod
type RequestData = {

 /*
  * Uniquely identifies the Tribe.
  */
  tribeId: TribeReference;

  /*
   * Identifies the address of the signed in user who is viewing the Tribe.
   * null if and only if the user is not signed in.
   */
  viewer: string | null;
}

type ResponseData = {
  
  /*
   * Returns the details of a Tribe.
   */
  tribe: TribeDetail;
}

type ErrorInfo = {
    error: string;
};

export default async function getTribeDetail(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | ErrorInfo>
) {

  let chainId: number;
  let tribeAddress: string;

  if (!req.query.chainId) {
    return res.status(400).json({ error: 'Missing chainId' });
  } else if (!req.query.tribeAddress) {
    return res.status(400).json({ error: 'Missing tribeAddress' });
  } else {
    chainId = parseInt(req.query.chainId.toString());
    tribeAddress = req.query.tribeAddress.toString();
  }

  const requestData: RequestData = {
    tribeId: {
        chainId: chainId,
        address: tribeAddress.toLowerCase()
    },
    viewer: req.query.viewer ? req.query.viewer.toString() : null
  };

  console.log(`/api/tribes/${requestData.tribeId.chainId}/${requestData.tribeId.address}: viewer: ${requestData.viewer}`);

  const providers = await getProviders(chainId);

  const values = buildValueReferences("Recycle, Reduce, Reuse", null);
  const tribeSummary = await buildMockTribeSummary(providers, "0xc71146cac9ee772ebb25a322ca9d2ddf34357d38", "Environmentals", "0xdff897d173498ad287890d5a15d77885de31a55f", 2, values);

  const curatedSocial: SocialStorySummary[] = []
  const account1 = await buildMockAccountSummary(providers, "0x2a4FC9c5EC629D872f82D29faE5DFa71B39b7E28", tribeSummary, values);
  const account2 = await buildMockAccountSummary(providers, "0x7e2F4252cF4a87bAbce5a162648BB37ECbE3bE4C", null, values);
  const account3 = await buildMockAccountSummary(providers, "0x195a4b5A35D0729394D5603deB9AAb941eC1e7ec", null, values);
  const account4 = await buildMockAccountSummary(providers, "0x43D407E1CAf17aE64eCd360aaAEb7229B7ADD49d", null, values);
  const account5 = await buildMockAccountSummary(providers, "0xE4a0e05cb060A0423d14C7878af6980DD0EAA014", null, values);
  const account6 = await buildMockAccountSummary(providers, "0x63bF83c11c50627F44119336A3c2f616b7c65228", null, values);

  const tribe: TribeDetail = {
    ...tribeSummary,
    members: [account1, account2],
    supporters: [account3, account4],
    invites: [account5, account6],
  };

  const response: ResponseData = {
    tribe: tribe
  };

  res.status(200).json(response)
}