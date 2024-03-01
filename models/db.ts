import mongoose from "mongoose";

export default (uri: string) => {
  const connect = () => {
    mongoose
      .connect(uri)
      .then(() => {
        // disable versionKey for all models
        mongoose.modelNames().forEach(function (modelName) {
          mongoose.model(modelName).schema.set("versionKey", false);
        });
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
