const asyncHandler = require('../utils/asyncHandler');
const {db} = require('../mongodb');
const router = require('express').Router();

router.use('/getFruitList', asyncHandler(async (req, res) => {
  let collections = await db.listCollections().toArray();
  res.json(collections);
}));

module.exports = router;
