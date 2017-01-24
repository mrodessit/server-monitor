const bcrypt = require('bcryptjs');

function comparePassword(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}

function hashPassword(password) {
    var salt = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);    
}

function getStringHash(string, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        if (!err) {
          bcrypt.hash(string, salt, (err, hash) => {
            if (!err) {
              callback(null, hash);  
            }
            else {
              callback(err);
            }
          });          
        }
        else {
          callback(err);
        }
    });
}

function compareHash(hash1, hash2, callback) {
    bcrypt.compare(hash1, hash2, (err, res) => {
        if (err) {
          callback(err);
        }
        else {
          if (res) {
            callback(null);
          }
          else {
            callback("Error: hashes not match.");
          }
        }
    });
}

exports.compareHash = compareHash;
exports.getStringHash = getStringHash;
exports.comparePassword = comparePassword;
exports.hashPassword = hashPassword;