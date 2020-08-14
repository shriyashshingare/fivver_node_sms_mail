var express = require('express');
var api = express.Router();
var mailcontroller = require('../controllers/MailController')

//mail api's
 api.use('/api/sendmail', mailcontroller.sendmail);//{"pkgName":"com.epicgames.fortnite"}



module.exports = api ;