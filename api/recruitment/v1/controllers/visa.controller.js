import { Op } from "sequelize";
import db from "../../../../models/index.js";
import { generateSlug } from "../utils/generalUtils.js";

export const getVisa = async (req, res) => {
  const { limit, offset } = req.query;

  console.log({ limit: Number(limit), offset });

  try {
    if (Number(limit) === 0 && Number(offset) === 0) {
      const visa_type = await db.Visa_Type.findAll({
        order: [["title", "ASC"]],
      });
      return res.status(200).json({ data: visa_type });
    }

    const { rows, count } = await db.Visa_Type.findAndCountAll({
      limit: limit ? Number(limit) : 10,
      offset: offset ? Number(offset) : 0,
      order: [["title", "ASC"]],
    });

    return res.status(200).json({ data: rows, count });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Internal Server Error: Error retreiving data" });
  }
};

export const addVisa = async (req, res) => {
  const body = req.body;
  const slug = body.slug ? generateSlug(body.slug) : generateSlug(body.title);

  try {
    const [visa_type, created] = await db.Visa_Type.findOrCreate({
      where: { slug: slug },
      defaults: { ...body, slug },
    });

    if (created) return res.status(200).json({ visa_type });

    if (!created) {
      const { count, rows } = await db.Visa_Type.findAndCountAll({
        where: {
          slug: {
            [Op.like]: `${slug}%`,
          },
        },
      });

      const singlevisa_type = await db.Visa_Type.create({
        ...body,
        slug: `${slug}-${count}`,
      });

      return res.status(200).json({ singlevisa_type });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error creating Visa Type" });
  }
};

export const editVisa = async (req, res) => {
  const body = req.body;
  const { id } = req.query;

  if (!body || (!body.title && !body.slug)) {
    return res.status(400).json({ message: "Error: No data" });
  }

  const slug = body.slug ? generateSlug(body.slug) : generateSlug(body.title);

  try {
    const findVisa = await db.Visa_Type.findOne({ where: { id } });
    if (!findVisa) {
      return res
        .status(400)
        .json({ message: `No visa with the id ${id} found` });
    }
    if (findVisa.slug === "uncategorised") {
      return res.status(400).json({ message: "Unable to edit default data" });
    }

    const response = await db.Visa_Type.update(
      { ...body, slug },
      { where: { id } },
    );
    return res
      .status(200)
      .json({ message: "Visa Type Updated Successfully", data: response });
  } catch (error) {
    return res.status(500).json({ message: "Error updating Visa Type" });
  }
};

export const deleteVisa = async (req, res) => {
  const { id } = req.query;

  const findVisa = await db.Visa_Type.findOne({ where: { id } });

  if (!findVisa) {
    return res.status(400).json({ message: `No visa with the id ${id} found` });
  }

  if (findVisa.slug === "uncategorised") {
    return res.status(400).json({ message: "Unable to delete default data" });
  }
  try {
    const response = await db.Visa_Type.destroy({ where: { id } });
    return res
      .status(200)
      .json({ message: "Visa Type deleted Successfully", data: response });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting Visa Type" });
  }
};
