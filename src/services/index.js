const express = require('express');
const {db} = require('../mongodb');

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
module.exports = function services(req, res, next) {
  req.getInfo = getInfo;
  next();
};

async function getInfo() {
  return await db.listCollections().toArray();
}
