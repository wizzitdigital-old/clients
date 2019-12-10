# GraphQL Client Wrapper

## Usage

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
