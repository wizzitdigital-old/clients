import { AkenClientConfig } from "./aken.d";

const config = {
  url: process.env.AKEN_URL || "http://localhost:4000",
  auth: {
    username: process.env.AKEN_USERNAME || "system",
    password: process.env.AKEN_PASSWORD
  },
  wamsisdn: process.env.AKEN_MSISDN
};

export default config as AkenClientConfig;
