const { Router } = require('express');
const router = Router();
const UserService = require('../services/UserService');

module.exports = router
  .post('/', async (req, res, next) => {
    try{
      const user = await UserService.create(req.body);
      res.json(user);
    } catch (err) {
      next(err);
    }
  });
