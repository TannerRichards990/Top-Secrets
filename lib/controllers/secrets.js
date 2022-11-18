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
  });
