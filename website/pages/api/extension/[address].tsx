import { NextApiRequest, NextApiResponse } from "next";
import { getTribeDetails } from "../tribes/details/[chainId]/[tribeAddress]/[viewerAddress]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return res.json(getTribeDetails());
}
