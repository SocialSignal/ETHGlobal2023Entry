import { NextApiRequest, NextApiResponse } from "next";
import { buildMockAccountSummary, buildMockTribeSummary } from "../../../../lib/api/utils";
import { buildValueReferences } from "../../../../lib/shared/utils";
import { AccountDetail } from "../../../../types/types";

// TODO: validation with zod
type RequestData = {

 /*
  * The account being viewed.
  */
  address: string;

  /*
   * Identifies the address of the signed in user who is viewing the Account.
   * null if and only if the user is not signed in.
   */
  viewer: string | null;
}

type ResponseData = {
  
  /*
   * Returns the details of an Account.
   */
  account: AccountDetail;
}

type ErrorInfo = {
    error: string;
};

export default function getTribeDetail(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | ErrorInfo>
) {

  let accountAddress: string;

  if (!req.query.accountAddress) {
    return res.status(400).json({ error: 'Missing accountAddress' });
  } else {
    accountAddress = req.query.accountAddress.toString();
  }

  const requestData: RequestData = {
    address: accountAddress.toLowerCase(),
    viewer: req.query.viewer ? req.query.viewer.toString() : null
  };

  console.log(`/api/account/${requestData.address}: viewer: ${requestData.viewer}`);

  const values = buildValueReferences("Web3, Decentralization, LOVE, Environment", null);
  const tribeSummary1 = buildMockTribeSummary(1, "0x283af0b28c62c092c9727f1ee09c02ca627eb7f5", "Tribe 1", "0xd8da6bf26964af9d7eed9e03e53415d37aa96045", 123, values);
  // TODO: Add more tribeSummary objects to mock response

  const accountSummary = buildMockAccountSummary("0x1a199654959140e5c1a2f4135faa7ba2748939c5", tribeSummary1, values);

  const account: AccountDetail = {
    ...accountSummary,
    tribes: [tribeSummary1],
    supports: [],
    invites: [],
  };

  const response: ResponseData = {
    account: account
  };

  res.status(200).json(response)
}