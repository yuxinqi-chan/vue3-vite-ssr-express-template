const express = require('express');
const {db} = require('../mongodb');
const postService = require('./post.serivce');
/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
module.exports = function services(req, res, next) {
    req.postService = postService;
    next();
};

async function getInfo() {
    return await db.listCollections().toArray();
}
