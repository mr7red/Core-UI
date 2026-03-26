module.exports = (req, res, next) => {

  console.log("Token user:", req.user);
  console.log("Param ID:", req.params.id);

  if (req.user.role === "admin") {
    return next();
  }

  if (req.user.id === req.params.id) {
    return next();
  }

  return res.status(403).json({ msg: "Access Denied" });
};
