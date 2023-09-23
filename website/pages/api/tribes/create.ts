import { NextApiRequest, NextApiResponse } from "next";
import { Web3Storage, getFilesFromPath } from "web3.storage";
import formidable from "formidable-serverless";
import { rmSync, writeFileSync } from "fs";
import { v4 as uuidv4 } from "uuid";

async function pinFiles(paths: string[], names: string[]) {
  const storage = new Web3Storage({ token: process.env.WEB3_STORAGE_API_KEY! });
  const retrievedFiles = await getFilesFromPath(paths);

  // Override the file names according to the given names array.
  // The CID will return the CID for the whole folder, and then each
  // file in the folder needs to be retrieved according to its name.
  const cid = await storage.put(
    retrievedFiles.map((x, i) => ({ ...x, name: names[i] }))
  );

  // Clean up the uploaded files.
  paths.forEach((x) => {
    rmSync(x);
  });

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

      // We could do this more efficiently
      let imagePaths = [files.largeAvatar.path];
      let imageNames = ["large_avatar", "small_avatar"];

      if (files.smallAvatar) {
        imagePaths.push(files.smallAvatar.path);
      }

      const imagesCID = await pinFiles(
        imagePaths,
        imageNames.slice(0, imagePaths.length)
      );

      const contractMetadata = {
        name: fields.name.trim(),
        description: fields.description.trim(),
        image: `ipfs://${imagesCID}/${imageNames[0]}`,
        smallImage: files.smallAvatar
          ? `ipfs://${imagesCID}/${imageNames[1]}`
          : null,

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
      const contractMetadataCID = await pinFiles([tmpPath], ["metadata.json"]);

      // Kevin: Joao creates contract here.
      const deployedContractAddress = await createTribe(...);
      return res.json({ deployedContractAddress });
    } catch (e) {
      console.error(e);
      return res
        .status(500)
        .json({ success: false, message: "Unexpected error" });
    }
  });
};
