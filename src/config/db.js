import mongoose from "mongoose";

export const connectionDB = async (uri) => {
  try {
    mongoose.connect(uri);
    console.log("connect success");
  } catch (error) {
    console.log(error);
  }
};
