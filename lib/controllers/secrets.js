const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const router = Router();
const Secret = require('../models/secrets');

module.exports = router
  .get('/', authenticate, async (req, res, next) => {
    try {
      const response = await Secret.getAll();
      res.json(response);
    } catch (err) {
      next(err);
    }
  })
  .post('/', authenticate, async (req, res, next) => {
    try {
      const secret = await Secret.insert(req.body);
      res.json(secret);
    } catch (err) {
      next(err);

    }
  });
