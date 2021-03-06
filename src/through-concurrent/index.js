const throughConcurrent = require("through2-concurrent");

module.exports = function createThroughConcurrent(logger, name, concurrency, callback) {
  const stream = throughConcurrent.obj({ maxConcurrency: concurrency }, callback);
  stream.on("error", err => {
    logger.unexpectedError(err, name);
  });
  return stream;
};
