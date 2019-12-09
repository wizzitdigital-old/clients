const path = require("path");
const { readFileSync } = require("fs");
const { ApolloClient } = require("apollo-client");
const { ApolloLink } = require("apollo-link");
const { makeExecutableSchema } = require("graphql-tools");
const { SchemaLink } = require("apollo-link-schema");
const { InMemoryCache } = require("apollo-cache-inmemory");
const debug = require("debug")("aken:client:apollo");
const resolvers = require("./resolvers");
const config = require("../package.json");

const cache = new InMemoryCache();

const typeDefs = readFileSync(path.join(__dirname, "schema.graphql"), "UTF-8");

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const debugLink = new ApolloLink((operation, forward) => {
  const op = operation.operationName || "Unknown";
  // TODO: Add request ref id
  debug("REQ", op, JSON.stringify(operation.variables));
  return forward(operation).map(data => {
    debug("RES", op, JSON.stringify(data));
    return data;
  });
});

const link = ApolloLink.from([debugLink, new SchemaLink({ schema })]);

// NOTE: https://www.apollographql.com/docs/react/api/apollo-client/
// NOTE: https://www.apollographql.com/docs/link/links/state/
// NOTE: https://github.com/hasura/client-side-graphql/
const client = new ApolloClient({
  name: "aken",
  version: config.version,
  cache,
  link
});

module.exports = client;
