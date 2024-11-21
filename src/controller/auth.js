import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user";
import { registerSchema } from "../schemas/auth";
export const signup = async (req, res) => {
  const { name, phone, username, gender, dob, password, email } = req.body;

  // Kiểm tra dữ liệu đầu vào với Joi hoặc thư viện tương tự
  const { error } = registerSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((detail) => detail.message);
    return res.status(400).json({ messages });
  }

  try {
    // Kiểm tra xem email, phone hoặc username đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ messages: ["Email đã tồn tại"] });
    }

    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ messages: ["Số điện thoại đã tồn tại"] });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ messages: ["Username đã tồn tại"] });
    }

    // Mã hóa mật khẩu
    const hashPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const user = new User({
      name,
      phone,
      email,
      username,
      gender,
      dob,
      password: hashPassword,
      role: "user",
    });

    await user.save();

    // Không trả về mật khẩu trong phản hồi
    user.password = undefined;

    const token = jwt.sign({ _id: user._id }, "SecretKEY", {
      expiresIn: "90d",
    });
    // Phản hồi thành công
    return res.status(201).json({
      status: "success",
      token,
    });
  } catch (err) {
    // Xử lý lỗi trong quá trình tạo người dùng
    console.error("Lỗi khi tạo người dùng:", err);
    return res
      .status(500)
      .json({ messages: ["Có lỗi xảy ra, vui lòng thử lại sau."] });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid username or password" });

    const token = jwt.sign({ _id: user._id }, "SecretKEY", {
      expiresIn: "90d",
    });
    return res.status(200).json({
      status: "Success",
      token,
      message: "Login success",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        dob: user.dob,
        gender: user.gender,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  try {
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "An error occurred during logout" });
  }
};

export const userProfile = async (req, res) => {
  try {
    // req.user đã được gán bởi middleware authenticateToken
    const user = req.user;
    return res.status(200).json({ user });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching profile" });
  }
};
