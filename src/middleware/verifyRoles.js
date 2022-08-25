const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) return res.sendStatus(401);

    const rolesArray = [...allowedRoles];
    console.log(`in verifyROles.js :: `, rolesArray, req.roles);

    const result = req.roles
      .map((role) => rolesArray.includes(role))
      .reduce((acc, cur) => acc || cur, false);

    if (!result) return res.sendStatus(401);

    next();
  };
};

export default verifyRoles;
