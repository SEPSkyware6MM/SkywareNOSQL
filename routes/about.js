/*
 * Project: 
 * Skyware NOSQL FussballProjekt
 * Autoren:
 * Marc Misoch
 * Chris Denneberg
 */

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('about', { title: 'About' });
});

module.exports = router;