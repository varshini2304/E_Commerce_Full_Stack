import mongoose from "mongoose";

export const connectDB = async (mongoURI) => {
  if (!mongoURI) {
    throw new Error("MONGO_URI is required");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoURI, { dbName: "E_Commerce" });
};
