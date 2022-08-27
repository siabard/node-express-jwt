import bcrypt from "bcrypt";
import User from "../model/User.js";

/* Old code using file system */
/*
import { promises as fsPromises } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import userData from "../model/users.json" assert { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const usersDB = {
  users: userData,
  setUsers: function (data) {
    this.users = data;
  },
};
*/

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  const duplicate = await User.findOne({ username: user }).exec();
  if (duplicate) return res.sendStatus(409); // conflict

  try {
    const hashedPwd = await bcrypt.hash(pwd, 10);
    const result = await User.create({
      username: user,
      password: hashedPwd,
    });

    console.log(result);
    res.status(201).json({ success: `New user ${user} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { handleNewUser };
