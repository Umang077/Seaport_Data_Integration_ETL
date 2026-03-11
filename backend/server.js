const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express5"); 
const { json } = require("body-parser"); // 2. Recommended for parsing JSON
require('dotenv').config(); // MUST BE FIRST
// const express = require("express");
// ... rest of your imports

const { typeDefs, resolvers } = require("./src/graphql/schema")
const syncSeaports = require("./src/etl/syncSeaport");


async function startServer() {
  const app = express();
  
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers
  });

  await apolloServer.start();

  // 3. Replace applyMiddleware with this:
  app.use(
    '/graphql',
    cors(),
    express.json(), // or json() from body-parser
    expressMiddleware(apolloServer)
  );

  app.listen(4000, () => {
    console.log("Server running on http://localhost:4000/graphql");
    syncSeaports();
  });
}

startServer();
