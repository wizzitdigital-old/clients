# Aken Client

> Graphql aken client

## Usage

```js
const aken = require("@wizzit/aken");
const gql = require("graphql-tag");

const CREATE_PAYMENT = gql`
  mutation ($pay: PayInput!) {
    createPaySession($pay) @client {
      url
    }
  }
`;

async function main() {
  const result = await aken.createPaySession({
    msisdn: "27745000000",
  });
}
```
