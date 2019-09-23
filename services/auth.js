const jwt = require('jsonwebtoken');
const models = require('../models/index');
const bcrypt = require("bcryptjs");

var authService = {
    signUser: function (user) {
        const token = jwt.sign(
            {
                Username: user.Username,
                UserId: user.UserId,
                Admin: user.Admin
            },
            'secretkey',
            {
                expiresIn: '1h'
            }
        );
        return token;
    },
  verifyUser: function (token) {  
        try {
            let decoded = jwt.verify(token, 'secretkey'); 
            return models.users.findByPk(decoded.UserId); 
        } catch (err) {
            console.log(err);
            return null;
        }
    },
    //pTp means plain text password
    hashPassword: function(pTp) {
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(pTp, salt);
        return hash;
    },
    comparePasswords: function (pTp, hP) {
        return bcrypt.compareSync(pTp, hP)
      }
}

module.exports = authService;