import gql from "graphql-tag";
import { createClient } from "@wizzit-clients/core";
import { name, version } from "../package.json";
import { resolvers } from "./resolvers";

export const typeDefs = gql`
  input DialogContextInput {
    operation: String!
    merchant_id: String!
    password: String!
    msisdn: String!
    ref_id: String!
    amount: Int
    progress_url: String
    callback_url: String
    hsm_template_namespace: String
    hsm_template_name: String
    hsm_template_language: String
    params: [String]
    on_confirm: String
    on_cancel: String
    confirmation_keywords: [String]
    cancellation_keywords: [String]
  }

  type Session {
    error: String
  }

  type Query {
    ping: Boolean
  }

  type Mutation {
    createDialogue(context: DialogContextInput!): Session!
  }
`;

export const client = createClient({
  name,
  version,
  typeDefs,
  resolvers
});
