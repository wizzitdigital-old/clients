import { AkenProxyClientConfig } from "./typings.d";

const config = {
  url: process.env.AKEN_PROXY_URL || "http://localhost:4000"
};

export default config as AkenProxyClientConfig;
