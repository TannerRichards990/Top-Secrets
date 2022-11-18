const { Router } = require('express');
const router = Router();
const UserService = require('../services/UserService');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const User = require('../models/users');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = router
  .post('/', async (req, res, next) => {
    try {
      const user = await UserService.create(req.body);
      res.json(user);
    } catch (err) {
      next(err);
    }
  })

  .post('/sessions', async (req, res, next) => {
    try {
      const token = await UserService.signIn(req.body);
      res.cookie(
        process.env.COOKIE_NAME, token, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        }
      )
        .json({ message: 'Successfully signed in' });
    }
    catch(err) {
      next(err);
    }
  })
  .get('/protected', authenticate, async (req, res,) => {
    res.json({ message: 'You have access to this route' });
  })

  .get('/', [authenticate, authorize], async (req, res, next) => {
    try {
      const users = await User.getAll();
      res.json(users);
    } catch (err) {
      next(err);
    }
  })

  .delete('/', authenticate, async (req, res, next) => {
    try {
      res.clearCookie(process.env.COOKIE_NAME)
        .json({ message: 'Signed out successfully',
          success: true });
    } catch (err) {
      next(err);
    }
  });
