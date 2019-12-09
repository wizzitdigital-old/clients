const config = {
  url: process.env.AKEN_URL || "http://localhost:4000",
  auth: {
    username: process.env.AKEN_USERNAME || "system",
    password: process.env.AKEN_PASSWORD
  },
  wamsisdn: process.env.AKEN_MSISDN
};

module.exports = config;
