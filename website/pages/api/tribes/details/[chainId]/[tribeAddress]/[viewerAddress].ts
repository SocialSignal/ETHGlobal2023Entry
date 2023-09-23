import { NextApiRequest, NextApiResponse } from "next";

const metaProfile = {
    values: "love,war",
    avatarImage: "",
    displayName: "Nacho Libre",
    description: "We eat nachos",
    twitter: "nachoLibre",
    email: "nacholibre@gmail.com",
    website: "https://www.nacholibre.com",
    github: "nachoLibre",
    telegram: "nachoLibre",
}

const sharedContext = {
    description: "",
    smallBadge: "",
    sharedWithViewingUser: "",
}

const tribeSummary = {
    tribeId: "nachoLibre",
    displayName: "Nacho Libre",
    owner: "0xf3030Ef60cfDF74AAB59Dc249914040aBd40f6e9",
    smallImage: "",
    largeImage: "",
    memberCount: 1,
}
const accountSummary = {
    address: '0xf3030Ef60cfDF74AAB59Dc249914040aBd40f6e9',
    metaProfile,
    sharedContext,
    tribeSummary,
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // This will probably be a combination between thegraph plus a few nested calls

  return res.json({
    members: [accountSummary],
    requests: [tribeSummary],
    invites: [tribeSummary],
  });
};
