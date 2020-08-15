//const mailjs = require('./models/mail');
const YahooMail = require('./models/YahooMail')
const SMSActivate = require('sms-activate')
const sms = new SMSActivate('940054f3775c2e49f71fd64c4c3ef116')
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
sms.getBalance().then(async (balance) => {
    if (balance > 0) {
      const { id, number } = await sms.getNumber('ya', 1) // yandex
      console.log(`Number: ${number}, Order Id: ${id}`)
  
      await sms.setStatus(id, 1)
  
      // you can add timeout to here
      const waitForCode = setInterval(async () => {
        const code = await sms.getCode(id)
        if (code) {
          clearInterval(waitForCode)
          console.log(`code received: ${code}`)
          await sms.setStatus(id, 6)
        }
      }, 1000)
    } else {
      console.log('Balance is zero', balance)
    }
  }).catch(console.error)
smsTesting();
//mydata();