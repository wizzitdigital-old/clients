const debug = require("debug")("aken:client");
const R = require("ramda");
const uuid = require("uuid/v4");
const axios = require("axios");
const config = require("./config.js");

const { url, auth, wamsisdn } = config;

const aken = axios.create({
  baseURL: url,
  timeout: 1000,
  auth,
  responseType: "json"
});

const createSession = args => {
  const { ref_id, msisdn } = args;

  debug(`${ref_id}: Creating session for ${msisdn}`);

  return aken
    .post(`/api/v1/session`, args)
    .then(res => {
      if ([200, 201].includes(res.statusCode)) {
        debug(`${ref_id}: The aken session url is ${res.data.url}`);
        return { data: res.data };
      }

      const querySpace = R.pick(["statusCode"], res);
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

const createPaySession = async (_, args, _cxt) => {
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

const resolvers = {
  Mutation: {
    createPaySession
  }
};

module.exports = resolvers;
