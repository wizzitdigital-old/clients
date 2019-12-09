import Debug from "debug";
import UUID from "uuid";
import { readFileSync } from "fs";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { makeExecutableSchema } from "graphql-tools";
import { SchemaLink } from "apollo-link-schema";
import { InMemoryCache } from "apollo-cache-inmemory";

export type ClientOptions = {
  name: string;
  version: string;
  schemaFile: string;
  resolvers: any;
};

export function createClient(options: ClientOptions): any {
  const { resolvers, name, schemaFile } = options;
  const debug = Debug(`client:${name}`);
  const cache = new InMemoryCache();
  const typeDefs = readFileSync(schemaFile, "UTF-8");
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const link = ApolloLink.from([
    new ApolloLink(createApolloDebugLink(debug)),
    new SchemaLink({ schema })
  ]);

  return new ApolloClient({
    cache,
    link,
    ...options
  });
}

function createApolloDebugLink(debug: any) {
  const ref = UUID.v4();
  return function apolloDebugLink(operation: any, forward: any) {
    const type = operation.operationName || "UNKNOWN";
    debug("REQ", ref, type, JSON.stringify(operation.variables));
    return forward(operation).map((data: any) => {
      debug("RES", ref, type, JSON.stringify(data));
      return data;
    });
  };
}
