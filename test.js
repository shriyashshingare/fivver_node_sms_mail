const mailjs = require('./models/mail');


async function mydata() {
    var mail = await new mailjs().receiveMail();
    console.log(mail)  ;
}

mydata()