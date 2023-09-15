import mongoose from "mongoose";
import config from "config";

const connectionOptions: any = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// const connectDbs = (dbUrl: string) => {
//   try {
//     const dbLink = config.get<string>(dbUrl); //get db url from config default

//     const connectionDb = mongoose.createConnection(dbLink, connectionOptions);

//     connectionDb.on("connected", () => {
//       console.log(`Connected to ${dbUrl} database`);
//     });

//     return connectionDb;
//   } catch (error) {
//     console.error(`Error:${error.message}`);
//     process.exit(1);
//   }
// };

export function connectDbs(dbUrl: string) {
  const dbLink = config.get<string>(dbUrl); //get db url from config default
  let cachedDb = mongoose.createConnection(dbLink, connectionOptions);
  cachedDb.once("open", () => {
    console.log(`Connected to ${dbUrl} database`);
  });
  return cachedDb;
}

export default connectDbs;
