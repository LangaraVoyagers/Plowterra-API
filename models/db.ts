import mongoose from "mongoose";

export default (uri: string) => {
  const connect = () => {
    mongoose
      .connect(uri)
      .then(() => {
        return console.info(`Successfully connected `);
      })
      .catch((error) => {
        console.error("Error connecting to database: ", error);
        return process.exit(1);
      });
  };
  connect();

  mongoose.connection.on("disconnected", connect);
};
