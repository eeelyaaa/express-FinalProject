// GO TO http://localhost:3000/ OR http://localhost:3000/users/login TO LOGIN

var express = require('express');
var router = express.Router();
const mysql = require('mysql2');
var models = require('../models');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', {});
});

module.exports = router;
