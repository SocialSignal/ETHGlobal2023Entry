import { NextApiRequest, NextApiResponse } from "next";
import { Web3Storage, getFilesFromPath } from "web3.storage";
import formidable from "formidable-serverless";
import { rmSync } from "fs";

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

      const cid = await pinFile(files.largeAvatar);
      //   const cid = await pinFile(files.smallAvatar);
      return res.redirect(302, `/tribes/${cid}`);
    } catch (e) {
      console.error(e);
      return res
        .status(500)
        .json({ success: false, message: "Unexpected error" });
    }
  });
};
