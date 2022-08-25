import bcrypt from "bcrypt";
import { promises as fsPromises } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ROLES_LIST from "../config/rolesList.js";
import userData from "../model/users.json" assert { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const usersDB = {
  users: userData,
  setUsers: function (data) {
    this.users = data;
  },
};

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  const duplicate = usersDB.users.find((person) => person.username === user);
  if (duplicate) return res.sendStatus(409); // conflict

  try {
    const hashedPwd = await bcrypt.hash(pwd, 10);
    const newUser = {
      username: user,
      password: hashedPwd,
      roles: [ROLES_LIST.USER],
    };
    usersDB.setUsers([...usersDB.users, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );
    console.log(usersDB.users);
    res.status(201).json({ success: `New user ${user} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { handleNewUser };
