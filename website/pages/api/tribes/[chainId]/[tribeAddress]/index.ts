import { NextApiRequest, NextApiResponse } from "next";
import { TribeDetail, TribeReference } from "../../../../../types/types";
import { buildValueReferences } from "../../../../../lib/shared/utils";
import { buildMockTribeSummary } from "../../../../../lib/api/utils";

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

  // TODO: build AccountSummary objects !

  const tribe: TribeDetail = {
    ...tribeSummary,
    members: [],
    supporters: [],
    invites: [],
  };

  const response: ResponseData = {
    tribe: tribe
  };

  res.status(200).json(response)
}