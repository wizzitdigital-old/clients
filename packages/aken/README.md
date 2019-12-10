# Aken Client

> Graphql aken client

## Usage

```js
const aken = require("@wizzit/aken-client");
const gql = require("graphql-tag");

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

  const { data: { createPaySession } } = await aken.mutate({
    mutation: CREATE_PAYMENT,
    variables: { pay }
  });

  console.log(createPaySession);
}

main();
```
