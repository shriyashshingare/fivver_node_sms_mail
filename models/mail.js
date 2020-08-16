var nodemailer = require('nodemailer');
const { resolve } = require('path');
var Imap = require('imap'),
    inspect = require('util').inspect;
const simpleParser = require('mailparser').simpleParser;
var fs = require('fs'), fileStream;

class Mail {

    constructor() { 
    }

     async receiveMail(whichBox, u, p){
        try {
            var mailReceivedList = [];
            var imap = new Imap({
                user: u,
                password: p,
                host: 'imap.mail.yahoo.com',
                port: 993,
                tls: true
            });

            function openInbox(cb) {
                imap.openBox(whichBox, true, cb);
            }

            imap.once('ready', function () {
                /*
                imap.getBoxes( (e, data) => {
                    console.log(data)
                    mailReceivedList = data;
                })*/
                
                openInbox(function (err, box) {
                    if (err) throw err;
                    imap.search([['All']], function (err, results) {
                        if (err) throw err;
                        var f = imap.fetch(results, { bodies: '' });
                        f.on('message', function (msg, seqno) {
                            //console.log('Message # % d', seqno);
                            //var prefix = '(#' + seqno + ') ';
                            msg.on('body', function (stream, info) {
                                simpleParser(stream, (err, mail) => {
                                    let emailData = {
                                        "Sender":mail.from['text'],
                                        "Subject":mail.subject,
                                        "Account":mail.to['text'],
                                        "Timestamp":mail.date
                                    }
                                    mailReceivedList.push(emailData);
                                });
                            });
                            msg.once('attributes', function (attrs) {
                                //console.log(prefix + 'Attributes: % s', inspect(attrs, false, 8));
                            });
                            msg.once('end', function () {
                                //console.log(prefix + 'Finished');
                            });
                        });
                        f.once('error', function (err) {
                            console.log('Fetch error: ' + err);
                        });
                        f.once('end', function () {
                            //console.log(mailReceivedList,1,"EMAIL DATA")
                            console.log('Done fetching all messages!');
                            //return Promise.all(mailReceivedList);
                            imap.end();
                        });
                    });
                });
            });

            imap.once('error', function (err) {
                console.log('outside', err);
            });
            return new Promise((resolve,reject) => {
                imap.connect();
                
                imap.once('end', async function () {
                    
                    resolve(mailReceivedList)
                    console.log('Connection ended');
                    return mailReceivedList;
                });
            })
        } catch (error) {
            return error
        }

    }


    sendMail = async () => {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.mail.yahoo.com",
            service: 'yahoo',
            secure: false,
            port: 465,
            auth: {
                user: 'shriyashshingare@yahoo.com', // generated ethereal user
                pass: 'ricbssvuwttkubxt', // generated ethereal password
            },
            debug: true,
            logger: true
        });


        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Shriyash Shingare" <devlinklabs@gmail.com>', // sender address
            to: "neel99khalade@gmail.com, shriyashshingare@gmail.com", // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>", // html body
        });

        const mailOptions = {
            from: 'ShriyashShingare <shriyashshingare@yahoo.com>',
            to: 'neel99khalade@gmail.com, shriyashshingare@gmail.com',
            subject: 'Invoices due',
            text: 'Dudes, we really need your money.'
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}

module.exports = Mail