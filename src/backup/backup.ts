const fs = require("fs");
const path = require("path");
const cron = require("node-cron");
const config = require("config");
const MongoClient = require("mongodb").MongoClient;

// const dbUrl = config.get("dbUrl");

async function getCollectionData(databaseName, collectionName, dbUrl) {
  try {
    const client = new MongoClient(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db(databaseName);
    const collection = database.collection(collectionName);

    const documents = await collection.find().toArray();
    console.log(
      `Found ${documents.length} documents in collection ${collectionName}`
    );

    return documents;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

async function createBackup(dbUrl) {
  const backupDirectory = path.join(__dirname, "public");
  const backupFilePath = path.join(backupDirectory, "backup.json");

  // file not exit that function create file
  if (!fs.existsSync(backupDirectory)) {
    fs.mkdirSync(backupDirectory, { recursive: true });
    console.log(`Created backup directory at ${backupDirectory}`);
  }

  const documents = await getCollectionData(
    "fuel-station",
    "detailsales",
    dbUrl
  );

  console.log(documents);

  // Write the data to a file
  const dataWriteStream = fs.createWriteStream(backupFilePath);
  documents.forEach((document) => {
    dataWriteStream.write(JSON.stringify(document));
    dataWriteStream.write("\n");
  });
  dataWriteStream.end();
  console.log("complete backup" + new Date());
}

//
export const backup = (dbUrl) =>
  cron.schedule("0 0 * * *", () => createBackup(dbUrl));
