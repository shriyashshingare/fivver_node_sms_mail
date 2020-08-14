//const mailjs = require('./models/mail');
const YahooMail = require('./models/YahooMail')
/*
async function mydata() {
    var mail = await new mailjs().receiveMail();
    console.log(mail)  ;
}
*/
async function mydata() {
    var yahooMail = await new YahooMail();
    yahooMail.register();
}
mydata()