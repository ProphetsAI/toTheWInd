"use strict";

module.exports = function (options) {
  if (!options) {
    throw new Error("Options are missing.");
  }

  if (!options.level) {
    throw new Error("Level is missing.");
  }

  return function (request, response, next) {
    console.log(
      `(${options.level}) ${request.method} ${request.path} over ${request.protocol} by ${request.ip}`
    );
    next();
  };
};
