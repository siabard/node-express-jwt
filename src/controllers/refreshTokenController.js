import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import userData from "../model/users.json" assert { type: "json" };

dotenv.config();

const usersDB = {
  users: userData,
  setUsers: function (data) {
    this.users = data;
  },
};

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;

  const foundUser = usersDB.users.find(
    (person) => person.refreshToken === refreshToken
  );
  if (!foundUser) return res.sendStatus(403); //Forbidden

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username) {
      return res.sendStatus(403);
    }
    const roles = foundUser.roles;
    const accessToken = jwt.sign(
      { userinfo: { username: decoded.username, roles } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ accessToken });
  });
};

export { handleRefreshToken };
