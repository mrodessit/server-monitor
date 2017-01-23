const bcrypt = require('bcryptjs');

function comparePassword(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}

function hashPassword(password) {
    var salt = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);    
}

exports.comparePassword = comparePassword;
exports.hashPassword = hashPassword;