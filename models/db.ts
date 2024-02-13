import mongoose from "mongoose";

mongoose.set("strictQuery", true);

require("dotenv").config({ path: ".env.demo" });

const dbURI: string = process.env.CONNECTION_STRING || "";

mongoose.connect(dbURI);

mongoose.connection.on("connected", () => {
  console.log(`Mongoose connected to ${dbURI}`);
});

mongoose.connection.on("error", (err: Error) => {
  console.log("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});
