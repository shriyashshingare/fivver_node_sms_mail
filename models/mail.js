var nodemailer = require('nodemailer');
/*
class Mail {
    constructor() {

    }

    async sendmail(email, data, ActivityID, TenantID, ServiceID, filename, fieldname) {

        try {


            var transporter = nodemailer.createTransport({
                host: credentials[0].Parameters.Host,
                port: credentials[0].Parameters.Port,
                auth: {
                    user: credentials[0].Parameters.User,
                    pass: credentials[0].Parameters.Pass
                },

                secure: true
            });
            var regards = "\n\n\n\nRegards \nUnipruf Team"




            if (typeof (data) == "object") {
                let d = Object.keys(data)
                var FullData = mailOptions[0].Text

                for (let rd = 0; rd < d.length; rd++) {

                    var replacestring = "$" + d[rd]

                    var FullData = FullData.replace(replacestring, data[d[rd]])
                }
                var mailOption = {
                    from: credentials[0].Parameters.From,
                    to: email,
                    subject: mailOptions[0].Subject,
                    text: FullData
                };
            } else {
                var FullData = await this.parse(mailOptions[0].Text, data)
                var mailOption = {
                    from: credentials[0].Parameters.From,
                    to: email,
                    subject: mailOptions[0].Subject,
                    text: FullData
                };
            }



            try {

                transporter.sendMail(mailOption)

            } catch (e) {
                return e

            }

            // if(fieldname){

            //    await fs.unlinkSync(mailOptions[0].Path + fieldname)
            //     await  fs.unlinkSync(mailOptions[0].Path + filename)

            // }else{
            //   await   fs.unlinkSync(mailOptions[0].Path + filename)

            // }




            return { "Success": true, "Message": "Email Sent", "Payload": [] }
        } catch (e) {
            return { "Success": false, "Error": e.toString(), "Payload": [] };
        }

    };

    async parse(str) {
        var args = [].slice.call(arguments, 1),
            i = 0;

        return str.replace(/%s/g, () => args[i++]);
    }

    async mailparse(str) {
        var args = [].slice.call(arguments, 1),
            i = 0;

        return str.replace(/%s/g, () => args[i++]);
    }

    async main() {
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


}*/

class Mail {
    constructor() { }

    ReceiveMail = async () => {
        var Imap = require('imap'),
            inspect = require('util').inspect;
        var fs = require('fs'), fileStream;

        var imap = new Imap({
            user: 'shriyashshingare@yahoo.com',
            password: 'ricbssvuwttkubxt',
            host: 'imap.mail.yahoo.com',
            port: 993,
            tls: true
        });

        function openInbox(cb) {
            imap.openBox('INBOX', true, cb);
        }
        imap.once('ready', function () {
            openInbox(function (err, box) {
                if (err) throw err;
                imap.search(['INBOX', ['SINCE', 'June 15, 2018']], function (err, results) {
                    if (err) throw err;
                    var f = imap.fetch(results, { bodies: '' });
                    f.on('message', function (msg, seqno) {
                        console.log('Message # % d', seqno);
                        var prefix = '(#' + seqno + ') ';
                        msg.on('body', function (stream, info) {
                            console.log(prefix + 'Body');
                            stream.pipe(fs.createWriteStream('msg -' + seqno + '-body.txt'));
                        });
                        msg.once('attributes', function (attrs) {
                            console.log(prefix + 'Attributes: % s', inspect(attrs, false, 8));
                        });
                        msg.once('end', function () {
                            console.log(prefix + 'Finished');
                        });
                    });
                    f.once('error', function (err) {
                        console.log('Fetch error: ' + err);
                    });
                    f.once('end', function () {
                        console.log('Done fetching all messages!');
                        imap.end();
                    });
                });
            });
        });

        imap.once('error', function (err) {
            console.log('outside', err);
        });
        imap.once('end', function () {
            console.log('Connection ended');
        });
        imap.connect();
    }
}

module.exports = Mail