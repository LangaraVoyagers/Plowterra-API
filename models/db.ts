import mongoose from "mongoose";

mongoose.set("strictQuery", true);

const dbURI: string ="mongodb+srv://whamester:FxrtXMvpcYqyL4CR@cluster0.jsllulh.mongodb.net/?retryWrites=true&w=majority";

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
