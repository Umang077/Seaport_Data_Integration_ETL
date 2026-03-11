const gql = require("graphql-tag");
const { seaportServices } = require("../services/seaportService");

const typeDefs = gql`
  type Seaport {
    id: ID!
    portName: String!
    locode: String!
    latitude: Float!
    longitude: Float!
    timezoneOlson: String!
    countryIso: String!
  }

  type Query {
    seaports: [Seaport]
  }
`;

const resolvers = {
  Query: {
    seaports: async () => {
      return seaportServices();
    }
  }
};

module.exports = { typeDefs, resolvers };

