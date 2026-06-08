const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userRole = String(req.user.role).toLowerCase();
    const allowed = roles.map((r) => String(r).toLowerCase());

    if (!allowed.includes(userRole)) {
      return res.status(403).json({ message: "Access denied" });
    }

    return next();
  };
};

module.exports = authorizeRoles;
