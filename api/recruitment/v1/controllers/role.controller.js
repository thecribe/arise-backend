import { Op } from "sequelize";
import db from "../../../../models/index.js";

export const getRole = async (req, res) => {
  try {
    const allRole = await db.Role.findAll({
      where: { slug: { [Op.ne]: "super_administrator" } },
      include: [
        {
          model: db.Permission,
          as: "permissions",
          through: {
            attributes: [],
          },
        },
      ],
    });
    return res.status(200).json({ data: allRole });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error fetching roles" });
  }
};

export const addRole = async (req, res) => {
  const { role, slug } = req.body;

  let newSlug = slug;
  try {
    const transaction = await db.sequelize.transaction();
    const { count, rows } = await db.Role.findAndCountAll(
      { where: { slug: slug.trim() } },
      transaction,
    );

    if (count > 0) {
      newSlug = `${slug}-${count}`;
    }

    const createRole = await db.Role.create(
      { role, slug: newSlug.trim() },
      { transaction },
    );
    if (!createRole) {
      await transaction.rollback();
      return res.status(400).json({ Message: "Unable to create new role" });
    }

    await transaction.commit();
    return res.status(200).json({ message: "New role created successfully" });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ message: "Error creating role" });
  }
};

export const getPermission = async (req, res) => {
  try {
    const permissions = await db.Permission.findAll();

    let data = [];

    permissions.forEach((permission) =>
      data.push({
        id: permission.id,
        name: `${permission.resource} ${permission.action}`,
        description: permission.description,
      }),
    );
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching permissions" });
  }
};

export const uploadPermissions = async (req, res) => {
  const { permissions } = req.body;
  const { roleSlug } = req.params;

  if (!roleSlug || !Array.isArray(permissions)) {
    return res.status(400).json({
      message: "roleSlug and permissions array are required",
    });
  }

  try {
    const result = await db.sequelize.transaction(async (t) => {
      // 1. Remove all existing permissions for this role
      await db.RolePermission.destroy({
        where: { roleSlug },
        transaction: t,
      });

      // 2. If no permissions sent, we're done (role cleared)
      if (permissions.length === 0) {
        return {
          added: 0,
          removed: "all",
        };
      }

      // 3. Optional safety: remove duplicates from request
      const uniquePermissions = [...new Set(permissions)];

      // 4. Bulk insert new permissions
      const payload = uniquePermissions.map((permissionId) => ({
        roleSlug,
        permissionId,
      }));

      await db.RolePermission.bulkCreate(payload, {
        transaction: t,
      });

      return {
        added: uniquePermissions.length,
        removed: "all-replaced",
      };
    });

    return res.status(200).json({
      message: "Permissions synced successfully",
      ...result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error updating permissions",
    });
  }
};
export const deleteRole = async (req, res) => {
  const { roleSlug } = req.params;

  if (!roleSlug) {
    return res.status(400).json({
      message: "Role slug is required",
    });
  }

  // Prevent deletion of default role
  if (roleSlug === "applicant") {
    return res.status(403).json({
      message: "The applicant role cannot be deleted",
    });
  }

  const transaction = await db.sequelize.transaction();

  try {
    const role = await db.Role.findOne({
      where: { slug: roleSlug },
      transaction,
    });

    if (!role) {
      await transaction.rollback();

      return res.status(404).json({
        message: "Role not found",
      });
    }

    const applicantRole = await db.Role.findOne({
      where: { slug: "applicant" },
      transaction,
    });

    if (!applicantRole) {
      await transaction.rollback();

      return res.status(500).json({
        message: "Default applicant role not found",
      });
    }

    // Move all users on this role to applicant
    await db.User.update(
      {
        roleSlug: "applicant",
      },
      {
        where: {
          roleSlug,
        },
        transaction,
      },
    );

    // Remove role permissions
    await db.RolePermission.destroy({
      where: {
        roleSlug,
      },
      transaction,
    });

    // Delete role
    await role.destroy({
      transaction,
    });

    await transaction.commit();

    return res.status(200).json({
      message:
        "Role deleted successfully. Assigned users have been moved to the applicant role.",
    });
  } catch (error) {
    await transaction.rollback();

    return res.status(500).json({
      message: error.message,
    });
  }
};
