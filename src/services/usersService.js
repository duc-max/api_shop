import bcrypt from "bcryptjs";
import User from "../model/user";
import { generateAccessToken } from "../middlewares/auth";

const loginUser = async (username, password) => {
  try {
    const user = await User.findOne({ username });

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = generateAccessToken(username);
      return { ...user.toJSON(), token };
    } else {
      throw new Error("Invalid Username/Password");
    }
  } catch (error) {
    throw new Error(error.message || "An error occurred");
  }
};

export { loginUser };
