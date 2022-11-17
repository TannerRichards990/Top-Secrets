const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const cookie = req.cookies && req.cookies[process.env.COOKIE_NAME];
    if (!cookie) throw new Error('User must sign in to continue');
    const user = jwt.verify(cookie, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    err.status = 401;
    next(err);
  }
};
