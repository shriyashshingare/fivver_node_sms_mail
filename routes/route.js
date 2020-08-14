var express = require('express');
var api = express.Router();
var mailcontroller = require('../controllers/MailController')

//mail api's
 api.use('/api/sendmail', mailcontroller.sendMail);
 api.use('/api/receivemail', mailcontroller.receiveMail);

module.exports = api ;