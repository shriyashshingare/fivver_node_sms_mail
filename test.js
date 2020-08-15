//const mailjs = require('./models/mail');
const YahooMail = require('./models/YahooMail')
// const SMSActivate = require('sms-activate')
// const sms = new SMSActivate('940054f3775c2e49f71fd64c4c3ef116')
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


// async function smsTesting() {
//     const balance = await sms.getBalance()

//     if (balance > 0) {
//         const { id, number } = await sms.getNumber('mb')
//         await sms.setStatus(id, 1)
//         const waitForCode = setInterval(async () => {
//             const code = await sms.getCode(id)
//             if (code) {
//                 clearInterval(waitForCode)
//                 await sms.setStatus(id, 6)

//                 console.log("CODE",code)
//             }
//         }, 1000)
//     } else {
//         console.log('You don\'t have enough money')
//     }
// }


// smsTesting();
mydata();

// await sms.setStatus(id, 1)
  
// // you can add timeout to here
// const waitForCode = setInterval(async () => {
//   const code = await sms.getCode(id)  //https://sms-activate.ru/stubs/handler_api.php?api_key=$api_key&action=setStatus&status=$status&id=$id&forward=$forward
//   if (code) {
//     clearInterval(waitForCode)
//     console.log(`code received: ${code}`)
//     await sms.setStatus(id, 6)
//   }
// }, 1000)