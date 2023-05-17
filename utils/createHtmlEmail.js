const path = require('path');
const ejs = require('ejs');
const crypto = require('crypto');

module.exports = async function (req, next) {
  // Create Token
  const token = crypto.randomBytes(16).toString('hex');
  const resetLink = `${req.app.locals.appLink}/login/reset-password/${token}`;
  const logoLink =
    req.protocol + '://' + path.join(req.headers.host, 'images', 'logo@2x.png');
  // Get Html Email
  let htmlEmail;
  await ejs
    .renderFile(path.join(req.app.locals.viewsPath, 'resetPwd-email.ejs'), {
      logo_link: logoLink,
      reset_link: resetLink,
      website_link: req.app.locals.appLink,
    })
    .then((html) => {
      htmlEmail = html;
    })
    .catch((err) => {
      return next(err);
    });

  return { htmlEmail, token };
};
