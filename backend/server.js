const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express5"); 
const { json } = require("body-parser"); 
require('dotenv').config();

// using node-cron module for applying btach design architecture
const cron = require("node-cron");
const { typeDefs, resolvers } = require("./src/graphql/schema")
const syncSeaports = require("./src/etl/syncSeaport");

/*
  IMPORTANT SETUP STEP

  Before running the backend server, make sure to run:

    npx prisma dev

  This command initializes Prisma, applies migrations, and sets up the database.

  If you skip this step, you may encounter errors like:
  "Invalid prisma.seaport.upsert() invocation"

  because the required tables and schema will not exist in the database.

  After running the above command, start the server using:

    npm run dev 

  */


async function startServer() {
  const app = express();
  
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers
  });

  await apolloServer.start();

  app.use(
    '/graphql',
    cors(),
    express.json(), 
    expressMiddleware(apolloServer)
  );

  app.listen(4000, () => {
    console.log("Server running on http://localhost:4000/graphql");
    syncSeaports();
  });

  /*
   Adding batch design architecture code
   BATCH ETL that will Run every 12 hours
   The hours can be changed according to the requirement.
   Check how the hour is written in the readme file or the node-cron npm documentation
   https://www.npmjs.com/package/node-cron
   */

  
  cron.schedule("0 */12 * * *", async () => {
  console.log("Running scheduled batch ETL...");
  await syncSeaports();
});
}

startServer();
