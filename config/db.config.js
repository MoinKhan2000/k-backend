import mongoose from "mongoose";

export const connectToDB = async () => {
  try {
    const res = await mongoose.connect(process.env.DB_URL)

    //? All the data related to the database connection
    // console.log(res.connection.db.client.s);

    console.log(`MongoDB connected successfully: ${res.connection.host}`);
  } catch (error) {
    console.log(`MongoDB connection error: ${error}`);
  }
}