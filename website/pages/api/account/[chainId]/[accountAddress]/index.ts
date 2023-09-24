import { NextApiRequest, NextApiResponse } from "next";
import { buildMockAccountSummary, buildMockTribeSummary, buildRealENSProfile, getProviders } from "../../../../../lib/api/utils";
import { ErrorInfo, buildValueReferences } from "../../../../../lib/shared/utils";
import { AccountDetail, AccountSummary, ValueReference } from "../../../../../types/types";

// TODO: validation with zod
type RequestData = {

  chainId: number;

 /*
  * The account being requested.
  */
  address: string;

  /*
   * Identifies if we should return an AccountSummary or an AccountDetail.
   */
  summary: boolean;

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
  account: AccountSummary | AccountDetail;
}

export default async function getAccount(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | ErrorInfo>
) {

  let chainId: number;
  let accountAddress: string;


  if (!req.query.chainId) {
    return res.status(400).json({ error: 'Missing chainId' });
  } else {
    chainId = parseInt(req.query.chainId.toString());
  }

  if (!req.query.accountAddress) {
    return res.status(400).json({ error: 'Missing accountAddress' });
  } else {
    accountAddress = req.query.accountAddress.toString();
  }

  const requestData: RequestData = {
    chainId: chainId,
    address: accountAddress.toLowerCase(),
    summary: req.query.summary ? req.query.summary.toString().toLowerCase() === "true" : false,
    viewer: req.query.viewer ? req.query.viewer.toString() : null
  };

  console.log(`/api/account/${requestData.address}: viewer: ${requestData.viewer}, summary: ${requestData.summary}`);
  
  const providers = await getProviders(chainId);

  let viewerValues: ValueReference[] = [];
  if (requestData.viewer && requestData.viewer !== requestData.address) {
    const viewerProfile = await buildRealENSProfile(providers, requestData.viewer, []);
    viewerValues = viewerProfile.values;
  }

  const tribeSummary1 = await buildMockTribeSummary(providers, "0x283af0b28c62c092c9727f1ee09c02ca627eb7f5", "Tribe 1", "0xd8da6bf26964af9d7eed9e03e53415d37aa96045", 123, viewerValues);
  const accountSummary = await buildMockAccountSummary(providers, "0x1a199654959140e5c1a2f4135faa7ba2748939c5", tribeSummary1, viewerValues);

  let account: AccountSummary | AccountDetail;
  
  if (requestData.summary) {

    account = accountSummary;

  } else {

    const tribeSummary2 = await buildMockTribeSummary(
        providers,
        "0x253553366da8546fc250f225fe3d25d0c782303b",
        "Tribe 2",
        "0x1a199654959140e5c1a2f4135faa7ba2748939c5",
        234,
        viewerValues
      );

      const tribeSummary3 = await buildMockTribeSummary(
        providers,
        "0x253553366da8546fc250f225fe3d25d0c782303b",
        "Tribe 3",
        "0x1a199654959140e5c1a2f4135faa7ba2748939c5",
        234,
        viewerValues
      );

      const tribeSummary4 = await buildMockTribeSummary(
        providers,
        "0x253553366da8546fc250f225fe3d25d0c782303b",
        "Tribe 4",
        "0x1a199654959140e5c1a2f4135faa7ba2748939c5",
        234,
        viewerValues
      );

      const tribeSummary5 = await buildMockTribeSummary(
        providers,
        "0x253553366da8546fc250f225fe3d25d0c782303b",
        "Tribe 5",
        "0x1a199654959140e5c1a2f4135faa7ba2748939c5",
        234,
        viewerValues
      );

    account = {
        ...accountSummary,
        tribes: [tribeSummary1],
        supports: [tribeSummary2, tribeSummary3],
        invites: [tribeSummary4, tribeSummary5],
      };
  }

  const response: ResponseData = {
    account: account
  };

  res.status(200).json(response);
}