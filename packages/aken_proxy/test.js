require("dotenv").config({ path: __dirname + "/.env.staging" });

const akenProxy = require("./lib/src/index").default;
const gql = require("graphql-tag");

const CREATE_DIALOGUE = gql`
  mutation CREATE_DIALOGUE($context: DialogContextInput!) {
    createDialogue(context: $context) {
      error
    }
  }
`;

async function main() {
  const context = {
    merchant_id: "393f4c83-eeee-49e4-9c82-27639828d37a",
    password: "018231092303",
    operation: "scc",
    msisdn: "27740000000",
    ref_id: "178946051172929500",
    amount: 1,
    progress_url: "https://5f494bd4.ngrok.io/progress_callback",
    callback_url: "https://5f494bd4.ngrok.io/payment_callback",
    hsm_template_namespace: "d10b5498_f69e_59ae_a51b_5892fe83844e",
    hsm_template_name: "name_confirm_02",
    hsm_template_language: "en_GB",
    params: ["Paym8", "Farren Hayden"],
    on_confirm:
      "Thank you for confirming! Please tap the following link to proceed:",
    on_cancel: "Thank you. The transaction has been cancelled",
    confirmation_keywords: ["yes", "yeah", "y"],
    cancellation_keywords: ["no", "nope", "n"]
  };

  const {
    data: { createDialogue }
  } = await akenProxy.mutate({
    mutation: CREATE_DIALOGUE,
    variables: { context }
  });

  console.log(createDialogue);
}

main();
