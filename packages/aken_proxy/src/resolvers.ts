import Debug from "debug";
import axios from "axios";
import config from "./config";
import { pick } from "ramda";

const { url } = config;
const debug = Debug("aken_proxy:client");

const akenProxy = axios.create({
  baseURL: url,
  timeout: 5000,
  responseType: "json"
});

const createDialogue = async (_: any, args: any, _cxt: any) => {
  const { ref_id, msisdn, merchant_id, password, ...params } = args.context;
  const auth = { username: merchant_id, password };
  const data = { ref_id, msisdn, ...params };
  debug(`${ref_id}: Creating session for ${msisdn}`);

  return akenProxy({
    url: "/api/v1/session",
    auth,
    data
  })
    .then(res => {
      if ([200, 201].includes(res.status)) {
        debug(`${ref_id}: The aken proxy session open`);
        return { data: res.data };
      }

      const querySpace = pick(["status", "statusText"], res);
      debug(`${ref_id}: Unhandled response - %o`, querySpace);
      return { error: "Unhandled response" };
    })
    .catch(e => {
      if (e.response) {
        if (e.response.status === 401) {
          debug(`${ref_id}: Aken Proxy basic auth credentials are not working`);
          return { error: "Invalid aken proxy credentials" };
        }
      }

      debug(`${ref_id}: The Aken Proxy http request failed`);
      console.error(e);
      return { error: "Server error" };
    });
};

export const resolvers = {
  Mutation: {
    createDialogue
  }
};
