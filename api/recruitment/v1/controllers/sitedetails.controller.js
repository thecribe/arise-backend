import db from "../../../../models/index.js";
import { mergeUploadFilestoJson } from "../utils/generalUtils.js";

export const getSiteDetails = async (req, res) => {
  try {
    const response = await db.SiteDetails.findAll();
    return res.status(200).json({ data: response });
  } catch (error) {
    return res.status(200).json({ message: "Error retrieving site details" });
  }
};

export const updateSiteLogo = async (req, res) => {
  const body = req.body;
  const uploadedFiles = req.uploadedFiles;
  const { id } = req.params;

  console.log({ uploadedFiles });

  const payload = {
    site_logo: mergeUploadFilestoJson("[]", uploadedFiles.site_logo),
  };

  try {
    const response = await db.SiteDetails.update(
      { ...payload },
      { where: { id } },
    );
    return res
      .status(200)
      .json({ message: "Site details updated successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Error updating site details" });
  }
};

export const deleteSiteLogo = async (req, res) => {};

export const uploadSiteDetails = async (req, res) => {
  const body = req.body;
  const { id } = req.params;

  const payload = {
    title: body.title,
    description: body.description,
    admin_email: body.admin_email,
  };

  let response;

  try {
    if (!id) {
      await db.SiteDetails.create(payload);
    } else {
      await db.SiteDetails.update(payload, { where: { id } });
    }

    res.status(200).json({ message: "Site details updated successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Error updating site details" });
  }
};
