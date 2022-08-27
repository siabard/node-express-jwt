import mongoose from "mongoose";
import ROLES_LIST from "../config/rolesList.js";
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    User: {
      type: Number,
      default: ROLES_LIST.USER,
    },
    Editor: Number,
    Admin: Number,
  },
  refreshToken: [String],
});

export default mongoose.model("User", userSchema);
