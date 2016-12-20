const bcrypt = require('bcryptjs');

function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}

function hashPass(password) {
    var salt = bcrypt.genSaltSync(10);
    var passHash = bcrypt.hashSync(password, salt);
    
    return passHash;
}

exports.comparePass = comparePass;
exports.hashPass = hashPass;