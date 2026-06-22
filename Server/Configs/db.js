import mongoose from "mongoose";




export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    if (mongoose.connection) {
      console.log("Database Connected Successfully");
    }
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};
