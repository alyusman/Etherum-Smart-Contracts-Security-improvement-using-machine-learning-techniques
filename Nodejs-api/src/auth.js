// eslint-disable-next-line consistent-return
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { users } = require('./models/index');

const jwtSecret = 'jwtSecretxx';
const issueToken = (payload) => jwt.sign(payload, jwtSecret, {
  expiresIn: '12h',
});

const verify = (token, url, done) => {
  // eslint-disable-next-line consistent-return
  jwt.verify(token, jwtSecret, {}, async (err, decoded) => {
    if (err) {
      done('error');
    } else {
      const user = await users.findByPk(decoded.id, { raw: true });
      return user && user.id && user.isActive
        ? done(null, user)
        : done('expired');
    }
  });
};

// eslint-disable-next-line consistent-return
const authMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    res.json({ code: 403, message: 'Error' });
  }

  const tokens = req.headers.authorization.split(' ');

  if (
    tokens
    && tokens.length > 0
    && tokens[0] === 'Bearer'
    && tokens[1]
    && tokens[1] !== 'null'
  ) {
    verify(tokens[1], req.url, (err, user) => {
      if (err) {
        return res.status(403).send({ code: 403, message: 'Authorization error' });
      }
      req.loggedUser = user;
      return next();
    });
  } else {
    return res
      .status(401)
      .send({ code: 401, message: 'Authorization header is required' });
  }
};

const adminMiddleware = async (req, res, next) => {
  if (!(req.loggedUser.role === 2)) {
    return res.status(403).send({
      code: 403,
      message: 'Please try with admin credentials',
    });
  }
  return next();
};

const encyptPassword = (password) => {
  const iterations = 100;
  const keylen = 24;
  const derivedKey = crypto.pbkdf2Sync(
    password,
    'salt',
    iterations,
    keylen,
    'sha512',
  );
  const pw = Buffer.from(derivedKey, 'binary').toString('hex');

  return pw;
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  issueToken,
  verify,
  encyptPassword,
};
