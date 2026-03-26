import db from "../../../../models/index.js";

export const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          message: "Unauthorized access",
        });
      }
      // Check if user exists (authentication check)

      const getUser = await db.User.findOne({
        where: {
          id: user.id, // belongs to the user
        },
        include: [{ model: db.Role, as: "role" }],
      });

      if (!getUser) {
        return res.status(401).json({
          message: "Unauthorized access",
        });
      }

      // Check if user's role is allowed
      if (!allowedRoles.includes(getUser.role.slug)) {
        return res.status(403).json({
          message:
            "Forbidden: You do not have permission to access this resource",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        message: "Role authorization error",
      });
    }
  };
};
