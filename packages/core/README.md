# GraphQL Client Wrapper

## Usage

Basic client

```
import gql from "graphql-tag";
import { createClient } from "@wizzit-clients/core";
import { name, version } from "./package.json";
import { resolvers } from "./resolvers"

const typeDefs = gql`
  type Query {
    ping: Boolean!
  }
`

export default createClient({
  name,
  version,
  typeDefs,
  resolvers
})
```

Stitch together client with remote schema

```
import gql from "graphql-tag";
import { createClientFromSchemas } from "@wizzit-clients/core";
import example from "@wizzit-clients/example";

export default createClientFromSchemas({
  remoteSchemas: [
    { uri: "https://localhost:4000/graphql" },
  ],
  localSchemas: [
    example,
  ],
})
```
