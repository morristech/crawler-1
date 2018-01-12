const Events = require("events");
const axios = require("axios");
const { expect } = require("chai");
const Logger = require("APP/src/logger");
const sinon = require("sinon");
const mkdirp = require("mkdirp");


describe("Logger", () => {
  it.only("should create the logger without error", () => {

    const logger = Logger(new Events(), axios, {
      statServerUrl: "fake url",
      statServerPort: 80,
      outputFile: "fake file.txt"
    });

    expect(logger).to.be.a("object");
    expect(logger).to.be.a.property("unexpectedError");
  });
});
