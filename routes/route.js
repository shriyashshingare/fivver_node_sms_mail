var express = require('express');
var api = express.Router();
var mailcontroller = require('../controllers/MailController')
var mailgenerator = require('../controllers/MailGeneratorController')

//mail api's
 api.use('/api/sendmail', mailcontroller.sendMail);
 api.use('/api/receivemail', mailcontroller.receiveMail);
api.use('/api/createmail',mailgenerator.createmailaccount)
module.exports = api ;