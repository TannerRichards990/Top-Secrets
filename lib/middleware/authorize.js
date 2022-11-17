module.exports = async (req, res, next) => {
  try {
    if (req.user || req.user.email !== 'admin') 
      throw new Error('User must be an admin to continue');
    next();  
  }
  catch (err) {
    err.status = 403;
    next(err);
  }
};
