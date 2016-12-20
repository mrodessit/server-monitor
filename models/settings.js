var db          = require('../config/db');
var crypt       = require('../helpers/crypt');
var validator   = require('../helpers/validator');

function changePassword(passData, userId)
{
    return db.one("select password from user_table where id=$1", userId)
        .then(function(user) {
            return new Promise(function(resolve, reject) {

                if (!validator.isEmpty(passData.old) && !validator.isEmpty(passData.new1) && !validator.isEmpty(passData.new2) 
                    && passData.new1 == passData.new2) {
                    if ( crypt.comparePass(passData.old, user.password) ) {                    
                        resolve();
                    } else {
                        reject("password dont match");    
                    }
                }
                else
                {
                    reject("error form data");
                }
            });
        })
        .then(function() {

            var passHash = crypt.hashPass(passData.new1);

            return db.none("update user_table set password=$1 where id=$2", [passHash, userId]);
        });
}

function changeServerConfig(serverData)
{ 
    return db.any("select * from config_table")
        .then(function(data) {
            
            if (!validator.isEmpty(serverData.ssh) || !validator.isEmpty(serverData.rdp) || !validator.isEmpty(serverData.check))
            {
                for (var i=0; i<data.length; i++)
                {
                    switch (data[i].name) {
                        case 'sshTimeoutSeconds':
                            if (data[i].value != serverData.ssh)
                            {
                                db.none("update config_table set value=$1 where name=$2", [serverData.ssh, data[i].name]);
                            }
                            break;

                        case 'rdpTimeoutSeconds':
                            if (data[i].value != serverData.rdp)
                            {
                                db.none("update config_table set value=$1 where name=$2", [serverData.rdp, data[i].name]);
                            }
                            break;

                        case 'checkServersEverySeconds':
                            if (data[i].value != serverData.check)
                            {
                                db.none("update config_table set value=$1 where name=$2", [serverData.check, data[i].name]);
                            }
                            break;    
                    
                        default:
                            break;
                    }
                }
            }

            return new Promise(function(resolve, reject){ resolve(); });            
        });       
}

exports.changePassword = changePassword;
exports.changeServerConfig = changeServerConfig;