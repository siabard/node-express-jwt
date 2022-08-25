import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { promises as fsPromises } from "fs";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
import userData from "../model/users.json" assert { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const usersDB = {
  users: userData,
  setUsers: function (data) {
    this.users = data;
  },
};

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  const foundUser = usersDB.users.find((person) => person.username === user);
  if (!foundUser) return res.sendStatus(401);
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    // create accessToken

    const accessToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );

    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    const otherUsers = usersDB.users.filter(
      (person) => person.username !== foundUser.username
    );

    // Saving refreshToken with current user
    const currentUser = { ...foundUser, refreshToken };
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );

    // send access token and refreshToken
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};

export { handleLogin };
