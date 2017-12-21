const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  httpOptions: {
    xhrAsync: false,
  },
});

const credentialsPromise = new Promise(((resolve, reject) => {
  s3.getObject({
    Bucket: "crawler-nick",
    Key: "logentries-credentials.json",
  }, (err, data) => {
    if (err) reject(err);
    else resolve(JSON.parse(data.Body.toString()).DEV_TOKEN);
  });
}));

const seedFilePromise = new Promise(((resolve, reject) => {
  s3.getObject({
    Bucket: "crawler-nick",
    Key: "seed-domains.txt",
  }, (err, data) => {
    if (err) reject(err);
    else resolve(data.Body);
  });
}));

module.exports = {
  // TODO change to prod token
  LOGENTRIES_TOKEN_PROMISE: credentialsPromise,
  SEED_FILE_PROMISE: seedFilePromise,
  FRONTIER_DIRECTORY: "/frontiers", // volume mounted in Docker
};
