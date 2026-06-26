import db from "../../../../models/index.js";

export const authorizeRoles = (...requiredPermissions) => {
  return async (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          message: "Unauthorized access",
        });
      }

      const getUser = await db.User.findOne({
        where: {
          id: user.id,
        },
        include: [
          {
            model: db.Role,
            as: "role",
            include: [
              {
                model: db.Permission,
                as: "permissions",
                through: {
                  attributes: [],
                },
              },
            ],
          },
        ],
      });

      if (!getUser || !getUser.role) {
        return res.status(401).json({
          message: "Unauthorized access",
        });
      }

      if (getUser.role.slug === "super_administrator") {
        return next();
      }

      const userPermissions = getUser.role.permissions.map(
        (permission) => `${permission.resource}:${permission.action}`,
      );

      // console.log({ userPermissions, getUser });

      const hasPermission = requiredPermissions.some((permission) =>
        userPermissions.includes(permission),
      );

      if (!hasPermission) {
        return res.status(403).json({
          message:
            "Forbidden: You do not have permission to access this resource",
        });
      }

      next();
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Permission authorization error",
      });
    }
  };
};

export const PERMISSIONS = {
  ROLE: {
    VIEW: "role:view",
    CREATE: "role:create",
    UPDATE: "role:update",
    DELETE: "role:delete",
  },

  APPLICATION_FORM: {
    VIEW: "application-form:view",
    CREATE: "application-form:create",
    UPDATE: "application-form:update",
    DELETE: "application-form:delete",
    AUDIT: "application-form:audit",
  },

  DEPARTMENT: {
    VIEW: "department:view",
    CREATE: "department:create",
    UPDATE: "department:update",
    DELETE: "department:delete",
  },

  JOBTYPE: {
    VIEW: "jobtype:view",
    CREATE: "jobtype:create",
    UPDATE: "jobtype:update",
    DELETE: "jobtype:delete",
  },

  COMPLIANCE: {
    VIEW: "compliance:view",
    CREATE: "compliance:create",
    UPDATE: "compliance:update",
    DELETE: "compliance:delete",
  },

  USER: {
    VIEW: "user:view",
    CREATE: "user:create",
    UPDATE: "user:update",
    DELETE: "user:delete",
  },

  CERTIFICATE: {
    VIEW: "certificate:view",
    CREATE: "certificate:create",
    UPDATE: "certificate:update",
    DELETE: "certificate:delete",
  },

  REFERENCE: {
    VIEW: "reference:view",
    CREATE: "reference:create",
    UPDATE: "reference:update",
    DELETE: "reference:delete",
  },
  REFERENCE_MAIL: {
    VIEW: "reference_mail:view",
    UPLOAD: "reference_mail:upload",
    SEND: "reference_mail:send",
  },

  SITE_DETAILS: {
    VIEW: "site-details:view",
    CREATE: "site-details:create",
    UPDATE: "site-details:update",
    DELETE: "site-details:delete",
  },
};
