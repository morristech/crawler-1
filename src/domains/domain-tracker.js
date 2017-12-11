const Frontier = require("./frontier");
const { DOMAIN_REQUEST_TIME_INTERVAL } = require('APP/env')

class DomainTracker {
  constructor(domain) {
    this.domain = domain;
    this._frontier = new Frontier(domain);
    this.lastScraped = 0; // A really early time so it will definitely be scrapped.
  }

  currentlyReading() {
    return this._frontier.currentlyReading
  }

  readyToScrape() {
    return this.politeToScrape() && this._frontier.readyForReading()
  }

  politeToScrape() {
    return this.lastScraped + DOMAIN_REQUEST_TIME_INTERVAL <= Date.now();
  }

  updateTimeLastScraped() {
    return (this.lastScraped = Date.now());
  }

  getNextUrl() {
    if (!this.readyToScrape()) return ""
    this.updateTimeLastScraped();
    return this._frontier.getNextUrl()
  }

  appendNewUrl(url) {
    this._frontier.append(url)
  }
}

module.exports = DomainTracker;
