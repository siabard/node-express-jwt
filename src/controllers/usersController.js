import User from "../model/User.js";

const handleAllUser = async (req, res) => {
  const result = await User.find().exec();
  if (!result) {
    return res.status(204).json({ message: "No User found" });
  }
  return res.json(result);
};

export default handleAllUser;
