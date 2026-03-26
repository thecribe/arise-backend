import { Op } from "sequelize";
import db from "../../../../models/index.js";
import { generateSlug } from "../utils/generalUtils.js";

export const getDepartment = async (req, res) => {
  const { limit, offset } = req.query;

  try {
    if (parseInt(limit) === 0 && parseInt(offset) === 0) {
      const department = await db.Department.findAll({
        order: [["title", "ASC"]],
      });
      return res.status(200).json({ data: department });
    }
    const { rows, count } = await db.Department.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["title", "ASC"]],
    });
    return res.status(200).json({ data: rows, count });
  } catch (error) {
    return res.status(400).json({ message: "Error retreiving data" });
  }
};

export const uploadDepartment = async (req, res) => {
  const body = req.body;
  const slug = body.slug ? generateSlug(body.slug) : generateSlug(body.title);

  try {
    const [department, created] = await db.Department.findOrCreate({
      where: { slug: slug },
      defaults: { ...body, slug },
    });

    if (created) return res.status(200).json({ department });

    if (!created) {
      const { count, rows } = await db.Department.findAndCountAll({
        where: {
          slug: {
            [Op.like]: `${slug}%`,
          },
        },
      });

      const singleDepartment = await db.Department.create({
        ...body,
        slug: `${slug}-${count}`,
      });

      return res.status(200).json({ singleDepartment });
    }
  } catch (error) {
    return res.status(400).json({ message: "Error creating Department" });
  }
};

export const updateDepartment = async (req, res) => {
  const body = req.body;
  const { id } = req.query;

  if (!body || (!body.title && !body.slug)) {
    return res.status(400).json({ message: "Error: No data" });
  }

  const slug = body.slug ? generateSlug(body.slug) : generateSlug(body.title);

  try {
    const findDepartment = await db.Department.findOne({ where: { id } });
    if (!findDepartment) {
      return res
        .status(400)
        .json({ message: `No Department with the id ${id} found` });
    }
    if (findDepartment.slug === "uncategorised") {
      return res.status(400).json({ message: "Unable to edit default data" });
    }

    const response = await db.Department.update(
      { ...body, slug },
      { where: { id } },
    );
    return res
      .status(200)
      .json({ message: "Department  Updated Successfully", data: response });
  } catch (error) {
    return res.status(500).json({ message: "Error updating Department" });
  }
};

export const deleteDepartment = async (req, res) => {
  const { id } = req.query;

  const findDepartment = await db.Department.findOne({ where: { id } });

  if (!findDepartment) {
    return res
      .status(400)
      .json({ message: `No Department with the id ${id} found` });
  }

  if (findDepartment.slug === "uncategorised") {
    return res.status(400).json({ message: "Unable to delete default data" });
  }

  try {
    const response = await db.Department.destroy({ where: { id } });
    return res
      .status(200)
      .json({ message: "Department  deleted Successfully", data: response });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting Job  Type" });
  }
};
