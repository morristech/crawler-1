const { getDomain } = require("tldjs");
const mkdirp = require("mkdirp");
const path = require("path");
const serializeError = require('serialize-error');

class Logger {
  constructor(eventCoordinator, outputFile, logAdaptor) {
    mkdirp.sync(path.dirname(outputFile));
    this.logger = logAdaptor(outputFile);
    this.lastFiveUnexpected = [];
    this.eventCoordinator = eventCoordinator;
  }

  trackUnexpectedErrors() {
    this.lastFiveUnexpected.unshift(new Date());
    if (this.lastFiveUnexpected.length >= 5) {
      const timeElapsed =
        this.lastFiveUnexpected[0] - this.lastFiveUnexpected[this.lastFiveUnexpected.length - 1];
      if (timeElapsed < 1000) {
        this.eventCoordinator.emit("stop");
      }
      this.lastFiveUnexpected.pop();
    }
  }

  unexpectedError(err, event, data) {
    const jsonError = serializeError(err)
    this.logger.error({ err: jsonError, event, data });
    this.trackUnexpectedErrors();
  }

  parserError(url, err) {
    this.logger.error({ event: "parser error", err, url });
  }

  noRobotsResponseReceived(module, err, url) {
    const domain = getDomain(url);
    this.logger.info({
      module,
      event: "no robots response received",
      url,
      domain
    });
  }

  GETResponseError(url, err, status, headers) {
    const domain = getDomain(url);
    this.logger.info({
      event: "response error",
      status,
      headers,
      err: err.message,
      url,
      domain
    });
  }

  noGETResponseRecieved(err, url) {
    const domain = getDomain(url);
    this.logger.info({
      err,
      event: "no get response received",
      url,
      domain
    });
  }

  connectionReset(url) {
    const domain = getDomain(url);
    this.logger.info({ event: "connection reset", url, domain });
  }

  addingToFrontier(fromUrl, newUrl) {
    const newDomain = getDomain(newUrl);
    const fromDomain = getDomain(fromUrl);
    this.logger.info({
      event: "new link",
      fromUrl,
      fromDomain,
      newUrl,
      newDomain
    });
  }

  robotsRequestSent(url) {
    const domain = getDomain(url);
    this.logger.info({ event: "robots request sent", url, domain });
  }

  GETRequestSent(url, totalRequestsMade) {
    const domain = getDomain(url);
    this.logger.info({
      event: "request sent",
      url,
      domain,
      totalRequestsMade
    });
  }

  GETResponseReceived(url, statusCode) {
    const domain = getDomain(url);
    this.logger.info({
      event: "response success",
      statusCode,
      url,
      domain
    });
  }

  spawningWorkerProcess(processId) {
    this.logger.info({
      event: "spawning worker process",
      processId
    });
  }
}

module.exports = Logger;
