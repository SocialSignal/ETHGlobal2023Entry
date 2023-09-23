import { NextApiRequest, NextApiResponse } from "next";
import { Web3Storage, getFilesFromPath } from "web3.storage";
import formidable from "formidable-serverless";
import { rmSync, writeFileSync } from "fs";
import { v4 as uuidv4 } from "uuid";

async function pinFile(file: any) {
  const storage = new Web3Storage({ token: process.env.WEB3_STORAGE_API_KEY! });
  const pathFiles = await getFilesFromPath(file.path);
  const cid = await storage.put(pathFiles);

  // Clean up the uploaded file.
  rmSync(file.path);

  return cid;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = "./";
  form.keepExtensions = true;
  form.parse(req, async (err: any, fields: any, files: any) => {
    try {
      console.log(err, fields);

      if (!files.largeAvatar) {
        return res
          .status(400)
          .json({ success: false, message: "No file received" });
      }

      const largeAvatarCID = await pinFile(files.largeAvatar);
      const smallAvatarCID = files.smallAvatar
        ? await pinFile(files.smallAvatar)
        : null;

      const contractMetadata = {
        name: fields.name.trim(),
        description: fields.description.trim(),
        image: `ipfs://${largeAvatarCID}`,
        smallImage: smallAvatarCID ? `ipfs://${smallAvatarCID}` : null,

        // We can do this if we want the values to appear in opensea..
        // attributes: values.map(x => {
        //     trait_type: "Social Signal",
        //     value: x,
        // }),
      };

      // This is a hacky way to avoid dealing with formdata => file reading => pinning work
      // which is something that would have to get fixed for production readiness, but not
      // relevant to the value we're trying to deliver at the hackathon.
      const tmpPath = `${uuidv4()}.json`;
      writeFileSync(tmpPath, JSON.stringify(contractMetadata));
      const contractMetadataCID = await pinFile({
        path: tmpPath,
      });

      return res.redirect(302, `/tribes/${contractMetadataCID}`);
    } catch (e) {
      console.error(e);
      return res
        .status(500)
        .json({ success: false, message: "Unexpected error" });
    }
  });
};
