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
  const response = {
    ok: false,
    data: null
  };

  const { ref_id, msisdn } = args;

  debug(`${ref_id}: Creating session for ${msisdn}`);

  return aken
    .post(`/api/v1/session`, args)
    .then(res => {
      if ([200, 201].includes(res.statusCode)) {
        debug(`${ref_id}: Aken session ${res.data.url}`);
        return Object.assign(response, { data: res.data });
      }
    })
    .catch(e => {
      if (e.response.status === 401) {
        debug(`${ref_id}: Unauthorized access`);
        return Object.assign(response, { error: "Invalid aken credentials" });
      }

      console.error(e);
      return Object.assign(response, { error: "Server error" });
    })
    .then(() => response);
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

  return createSession(params);
};

const resolvers = {
  Mutation: {
    createPaySession
  }
};

module.exports = resolvers;
