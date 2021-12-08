const express = require('express');

/**
 *
 * @param {express.RequestHandler} fn
 * @returns {express.RequestHandler}
 */
function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve().then(() => fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
