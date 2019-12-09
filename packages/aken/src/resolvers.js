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

const createPaySession = async (_, args, _cxt) => {
  const params = {
    ref_id: uuid(),
    ttl: 60000,
    wamsisdn,
    // NOTE: Client provided args will clobber above.
    ...args
  };

  const { ref_id, msisdn } = params;

  debug(`${ref_id}: creating session for ${msisdn}`);
  const res = aken.post(`/api/v1/session`, params);

  switch (res.statusCode) {
    case 200:
    case 201:
      debug(`${ref_id}: aken session ${res.data.url}`);
      return Object.assign({}, res.data, { ref_id });
    case 401:
      debug(`${ref_id}: unauthorized access`);
      return res.sendStatus(401);
    default:
      debug(`${ref_id}: unhandled http response: ${res.status}`);
      throw new Error(`unhandled http response: ${res.status}`);
  }
};

const resolvers = {
  Mutation: {
    createPaySession
  }
};

module.exports = resolvers;
