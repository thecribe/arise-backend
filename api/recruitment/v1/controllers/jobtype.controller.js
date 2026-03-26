import { Op } from "sequelize";
import db from "../../../../models/index.js";
import { generateSlug } from "../utils/generalUtils.js";

export const getJobType = async (req, res) => {
  const { limit, offset } = req.query;

  try {
    if (parseInt(limit) === 0 && parseInt(offset) === 0) {
      const job_type = await db.Job_Type.findAll({
        order: [["title", "ASC"]],
      });
      return res.status(200).json({ data: job_type });
    }
    const { rows, count } = await db.Job_Type.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["title", "ASC"]],
    });
    return res.status(200).json({ data: rows, count });
  } catch (error) {
    return res.status(400).json({ message: "Error retreiving data" });
  }
};

export const uploadJobType = async (req, res) => {
  const body = req.body;
  const slug = body.slug ? generateSlug(body.slug) : generateSlug(body.title);

  try {
    const [job_type, created] = await db.Job_Type.findOrCreate({
      where: { slug: slug },
      defaults: { ...body, slug },
    });

    if (created) return res.status(200).json({ job_type });

    if (!created) {
      const { count, rows } = await db.Job_Type.findAndCountAll({
        where: {
          slug: {
            [Op.like]: `${slug}%`,
          },
        },
      });

      const singleJobType = await db.Job_Type.create({
        ...body,
        slug: `${slug}-${count}`,
      });

      return res.status(200).json({ singleJobType });
    }
  } catch (error) {
    return res.status(400).json({ message: "Error creating Job Type" });
  }
};

export const updateJobType = async (req, res) => {
  const body = req.body;
  const { id } = req.query;

  if (!body || (!body.title && !body.slug)) {
    return res.status(400).json({ message: "Error: No data" });
  }

  const slug = body.slug ? generateSlug(body.slug) : generateSlug(body.title);

  try {
    const findJobType = await db.Job_Type.findOne({ where: { id } });
    if (!findJobType) {
      return res
        .status(400)
        .json({ message: `No Job Type with the id ${id} found` });
    }
    if (findJobType.slug === "uncategorised") {
      return res.status(400).json({ message: "Unable to edit default data" });
    }

    const response = await db.Job_Type.update(
      { ...body, slug },
      { where: { id } },
    );
    return res
      .status(200)
      .json({ message: "Job Type  Updated Successfully", data: response });
  } catch (error) {
    return res.status(500).json({ message: "Error updating Job Type" });
  }
};

export const deleteJobType = async (req, res) => {
  const { id } = req.query;

  const findJobType = await db.Job_Type.findOne({ where: { id } });

  if (!findJobType) {
    return res
      .status(400)
      .json({ message: `No Job Type with the id ${id} found` });
  }

  if (findJobType.slug === "uncategorised") {
    return res.status(400).json({ message: "Unable to delete default data" });
  }
  try {
    const response = await db.Job_Type.destroy({ where: { id } });
    return res
      .status(200)
      .json({ message: "Job Type  deleted Successfully", data: response });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting Job  Type" });
  }
};
