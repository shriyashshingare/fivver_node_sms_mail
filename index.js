const nodemailer = require("nodemailer");

async function main() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.mail.yahoo.com",
      service:'yahoo',
      secure: false,
      port: 465,
      auth: {
        user: 'shriyashshingare@yahoo.com', // generated ethereal user
        pass: 'ricbssvuwttkubxt', // generated ethereal password
      },
      debug: true,
      logger: true
    });
  
    /*
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Shriyash Shingare" <devlinklabs@gmail.com>', // sender address
      to: "neel99khalade@gmail.com, shriyashshingare@gmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    });*/
  
    const mailOptions = {
        from: 'ShriyashShingare <shriyashshingare@yahoo.com>',
        to: 'neel99khalade@gmail.com, shriyashshingare@gmail.com',
        subject: 'Invoices due',
        text: 'Dudes, we really need your money.'
      };
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
  }
  
 main().catch(console.error);