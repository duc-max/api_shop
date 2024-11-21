import uploadImage from "../config/cloudinary";
import User from "../model/user";

export const getUserByUsername = async (req, res) => {
  try {
    // Giả sử bạn có hàm `getUserByUsername` để lấy thông tin người dùng
    const user = await User.findOne(req.user.username).exec();
    res.json({ data: user });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updatedData = req.body;
    console.log(updatedData);
    const updatedUser = await User.findByIdAndUpdate(
      updatedData._id,
      updatedData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "No user found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: error.message });
  }
};
