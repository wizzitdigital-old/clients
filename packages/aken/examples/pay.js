const aken = require("../src/client");
const gql = require("graphql-tag");

const CREATE_PAYMENT = gql`
  mutation($pay: PayInput!) {
    createPaySession(operation: $pay) {
      url
    }
  }
`;

async function main() {
  const pay = {
    msisdn: "27745000000"
  };

  const result = await aken.mutate({
    mutation: CREATE_PAYMENT,
    variables: { pay }
  });

  console.log({ result });
}

main();
