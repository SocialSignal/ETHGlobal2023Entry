import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const metadata = await (
    await fetch(`https://${req.query.id}.ipfs.w3s.link/metadata.json`)
  ).json();

  return res.json({
    ...metadata,
    largeAvatar: `https://${
      metadata.image.replace("ipfs://", "").split("/")[0]
    }.ipfs.w3s.link/large_avatar`,
    smallAvatar: metadata.small_avatar
      ? `https://${
          metadata.image.replace("ipfs://", "").split("/")[0]
        }.ipfs.w3s.link/small_avatar`
      : null,
  });
};
