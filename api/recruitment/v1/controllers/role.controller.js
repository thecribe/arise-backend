import { Op } from "sequelize";
import db from "../../../../models/index.js";

export const getRole = async (req, res) => {
  try {
    const allRole = await db.Role.findAll({
      where: { slug: { [Op.ne]: "super_administrator" } },
    });
    return res.status(200).json({ data: allRole });
  } catch (error) {
    return res.status(200).json({ message: "Error fetching roles" });
  }
};
