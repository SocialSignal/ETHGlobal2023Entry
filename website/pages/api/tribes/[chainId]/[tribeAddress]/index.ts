import { NextApiRequest, NextApiResponse } from "next";
import { TribeDetail, TribeReference } from "../../../../../types/types";
import { buildValueReferences } from "../../../../../lib/shared/utils";
import { buildMockAccountSummary, buildMockTribeSummary } from "../../../../../lib/api/utils";

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

export default function getTribeDetail(
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

  const values = buildValueReferences("Web3, Decentralization, LOVE, Environment", null);
  const tribeSummary = buildMockTribeSummary(1, "0x283af0b28c62c092c9727f1ee09c02ca627eb7f5", "Tribe 1", "0xd8da6bf26964af9d7eed9e03e53415d37aa96045", 123, values);

  const account1 = buildMockAccountSummary("0x1a199654959140e5c1a2f4135faa7ba2748939c5", tribeSummary, values);
  const account2 = buildMockAccountSummary("0x76a6d08b82034b397e7e09dae4377c18f132bbb8", null, values);
  const account3 = buildMockAccountSummary("0xfe89cc7abb2c4183683ab71653c4cdc9b02d44b7", null, values);
  const account4 = buildMockAccountSummary("0x0364c42a15c2cc3073eba1e11ee5ab0c6a1b5b40", null, values);
  const account5 = buildMockAccountSummary("0xa9350e3b4ad3f22bab136cfef999c132ead3bca3", null, values);
  const account6 = buildMockAccountSummary("0xfa45c6991a2c3d74ada3a279e21135133ce3da8a", null, values);

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