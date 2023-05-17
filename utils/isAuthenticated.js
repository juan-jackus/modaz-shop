const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

module.exports = async function (req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(403).send('Unauthenticated');

  const user = jwt.verify(token, process.env.TOKEN_SECRET);
  const foundUser = await User.findOne({ _id: user.id })
    .select('-__v -password')
    .exec();
  if (!foundUser) {
    res.clearCookie('token');
    return res.status(403).send('Unauthenticated');
  }
  req.user = foundUser;
  next();
};
