import gql from "graphql-tag";
import { createClientFromSchemas } from "../core/src/index";
import * as akenProxy from "../aken_proxy/src/index";

const AUTH_MERCHANT = gql`
  mutation AUTH_MERCHANT($merchantId: String!, $password: String!) {
    aken(merchantId: $merchantId, password: $password) {
      authenticated
    }
  }
`;

async function main() {
  const client = await createClientFromSchemas({
    remoteSchemas: [
      { uri: "https://portal.staging.wizzitdigital.com/graphql" }
    ],
    localSchemas: [akenProxy]
  });

  const {
    data: { aken }
  } = await client.mutate({
    mutation: AUTH_MERCHANT,
    variables: {
      merchantId: process.env.MERCHANT_ID,
      password: process.env.PASSWORD
    }
  });

  console.log(aken);
}

main();
