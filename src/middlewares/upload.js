import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Shop", // Thư mục lưu trữ ảnh trong Cloudinary
    allowed_formats: ["jpg", "jpeg"], // Định dạng ảnh được phép
  },
});

export const uploadImg = multer({ storage });
