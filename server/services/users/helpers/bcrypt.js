const bcrypt = require('bcrypt');

module.exports = {
  hashPassword: (password) => {
    return bcrypt.hashSync(password, 10);
  },
  comparePassword: (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
  },
};
