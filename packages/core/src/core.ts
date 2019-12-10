import Debug from "debug";
import UUID from "uuid";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { makeExecutableSchema } from "graphql-tools";
import { SchemaLink } from "apollo-link-schema";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ClientOptions } from "./core.d";

export function createClient(options: ClientOptions): any {
  const { resolvers, name, typeDefs } = options;
  const debug = Debug(`client:${name}`);
  const cache = new InMemoryCache();
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const link = ApolloLink.from([
    new ApolloLink(createApolloDebugLink(debug)),
    new SchemaLink({ schema })
  ]);

  // NOTE: https://www.apollographql.com/docs/react/api/apollo-client/
  // NOTE: https://www.apollographql.com/docs/link/links/state/
  // NOTE: https://github.com/hasura/client-side-graphql/
  return new ApolloClient({
    cache,
    link,
    ...options
  });
}

function createApolloDebugLink(debug: any) {
  const ref = UUID.v4();
  return function apolloDebugLink(operation: any, forward: any) {
    const type = (operation.operationName || "unknown").toUpperCase();
    debug("REQ", ref, type, JSON.stringify(operation.variables));
    return forward(operation).map((data: any) => {
      debug("RES", ref, type, JSON.stringify(data));
      return data;
    });
  };
}
