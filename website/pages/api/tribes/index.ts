import { NextApiRequest, NextApiResponse } from "next";
import { TribeSummary } from "../../../types/types";
import { ErrorInfo, buildValueReferences } from "../../../lib/shared/utils";
import { buildMockTribeSummary, getProviders } from "../../../lib/api/utils";

// TODO: validation with zod
type RequestData = {

  chainId: number;

  /*
   * Identifies the address of the signed in user who is viewing the list of Tribes.
   * null if and only if the user is not signed in.
   */
  viewer: string | null;
};

type ResponseData = {
  /*
   * Returns a list of 0 or more TribeSummary objects for each Tribe ever created.
   */
  tribes: TribeSummary[];
};

export default async function getTribeList(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | ErrorInfo>
) {

  let chainId: number;

  if (!req.query.chainId) {
    return res.status(400).json({ error: 'Missing chainId' });
  } else {
    chainId = parseInt(req.query.chainId.toString());
  }

  const requestData: RequestData = {
    chainId: chainId,
    viewer: req.query.viewer ? req.query.viewer.toString() : null,
  };

  console.log(`getTribeList: viewer: ${requestData.viewer}`);

  const providers = await getProviders(chainId);

  const values1 = await buildValueReferences(
    "Web3, Decentralization, LOVE, Environment",
    null
  );
  const values2 = await buildValueReferences(
    "Blockchain, web3, love, the environement, LoVE, clean water, ,",
    values1
  );

  const tribe1 = await buildMockTribeSummary(
    providers,
    "0x283af0b28c62c092c9727f1ee09c02ca627eb7f5",
    "Tribe 1",
    "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
    123,
    values1
  );
  const tribe2 = await buildMockTribeSummary(
    providers,
    "0x253553366da8546fc250f225fe3d25d0c782303b",
    "Tribe 2",
    "0x1a199654959140e5c1a2f4135faa7ba2748939c5",
    234,
    values2
  );

  const tribeList: ResponseData = {
    tribes: [tribe1, tribe2],
  };

  res.status(200).json(tribeList);
}
