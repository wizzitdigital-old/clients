import Debug from "debug";
import uuid from "uuid/v4";
import axios from "axios";
import config from "./config";
import { pick } from "ramda";

const { url, auth, wamsisdn } = config;
const debug = Debug("aken:client");

const aken = axios.create({
  baseURL: url,
  timeout: 1000,
  auth,
  responseType: "json"
});

const createSession = async (args: any) => {
  const { ref_id, msisdn } = args;

  debug(`${ref_id}: Creating session for ${msisdn}`);

  return aken
    .post(`/api/v1/session`, args)
    .then(res => {
      if ([200, 201].includes(res.status)) {
        debug(`${ref_id}: The aken session url is ${res.data.url}`);
        return { data: res.data };
      }

      const querySpace = pick(["status", "statusText"], res);
      debug(`${ref_id}: Unhandled response - %o`, querySpace);
      return { error: "Unhandled response" };
    })
    .catch(e => {
      if (e.response.status === 401) {
        debug(`${ref_id}: Aken basic auth credentials are not working`);
        return { error: "Invalid aken credentials" };
      }

      debug(`${ref_id}: The Aken http request failed`);
      console.error(e);
      return { error: "Server error" };
    });
};

const createPaySession = async (_: any, args: any, _cxt: any) => {
  const params = {
    ref_id: uuid(),
    ttl: 60000,
    wamsisdn,
    operation: "pay",
    // NOTE: Client provided args will clobber above.
    ...args.operation
  };

  debug(`${params.ref_id}: Got pay request`);
  return createSession(params);
};

export const resolvers = {
  Mutation: {
    createPaySession
  }
};
