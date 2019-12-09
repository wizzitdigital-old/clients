require("dotenv").config({ path: __dirname + "/../.env.staging" });

const aken = require("../src/client");
const gql = require("graphql-tag");
const config = require("../src/config");

const CREATE_PAYMENT = gql`
  mutation CREATE_PAYMENT($pay: PayInput!) {
    createPaySession(operation: $pay) {
      url
      error
    }
  }
`;

async function main() {
  const pay = {
    msisdn: "27740000000"
  };

  const {
    data: { createPaySession }
  } = await aken.mutate({
    mutation: CREATE_PAYMENT,
    variables: { pay }
  });

  console.log(createPaySession);
}

main();
