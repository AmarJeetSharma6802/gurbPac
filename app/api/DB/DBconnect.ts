import mongoose from "mongoose";

const DBconnect = async (): Promise<void> => {
  if (mongoose.connection.readyState >= 1) {
    console.log("Already connected to MongoDB");
    return;
  }

  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI as string);

    console.log(`MongoDB Connected: ${connect.connection.host}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("MongoDB Connection Error:", error.message);
    } else {
      console.error("MongoDB Connection Error:", error);
    }

    process.exit(1);
  }
};

export default DBconnect;