import db from "../../../../models/index.js";
import fs from "fs";
import path from "path";

export const generalUploadHandler = async (req, res, next) => {
  try {
    const files = req.files;
    const uploadDir = "public/static/uploads/";

    if (!files || Object.keys(files).length === 0) {
      req.uploadedFiles = {};
      return next();
    }

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const domain = `${req.protocol}://${req.get("host")}`;
    const uploaded = {};

    for (const file of files) {
      const fieldName = file.fieldname;

      if (!uploaded[fieldName]) {
        uploaded[fieldName] = [];
      }

      const filename =
        Date.now() + "_" + file.originalname.replace(/\s+/g, "_");

      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, file.buffer);

      uploaded[fieldName].push({
        status: true,
        name: filename,
        img_url: `${domain}/static/uploads/${filename}`,
      });
    }

    req.uploadedFiles = uploaded;

    next(); // 🔑 Pass control to next middleware
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "File upload failed",
    });
  }
};

export const screeningUploadHandler = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await db.User.findOne({
      where: { id: userId },
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User Id is missing",
      });
    }
    const files = req.files;
    const userFolderName = `${user.firstName + "_" + user.lastName}`;
    const uploadDir = `public/static/uploads/screening/${userFolderName}`;

    if (!files || Object.keys(files).length === 0) {
      req.uploadedFiles = {};
      return next();
    }

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const domain = `${req.protocol}://${req.get("host")}`;
    const uploaded = {};

    for (const file of files) {
      const fieldName = file.fieldname;

      if (!uploaded[fieldName]) {
        uploaded[fieldName] = [];
      }

      const filename =
        Date.now() + "_" + file.originalname.replace(/\s+/g, "_");

      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, file.buffer);

      uploaded[fieldName].push({
        status: true,
        name: filename,
        img_url: `${domain}/static/uploads/screening/${userFolderName}/${filename}`,
      });
    }

    req.uploadedFiles = uploaded;

    next(); // 🔑 Pass control to next middleware
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "File upload failed",
    });
  }
};
