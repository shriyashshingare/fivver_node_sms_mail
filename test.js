const mailjs = require('./models/mail');
const YahooMail = require('./models/YahooMail')
const puppeteer = require('puppeteer-extra')
const SMSActivate = require('sms-activate')
//const sms = new SMSActivate('940054f3775c2e49f71fd64c4c3ef116')

async function mydata2() {

    users = [
      ['shriyashshingare@yahoo.com',''],
    ]

    users.map(async (udata)=> {
      var inbox = await new mailjs().receiveMail('Bulk Mail',udata[0],udata[1]);
      var spam = await new mailjs().receiveMail('INBOX',udata[0],udata[1]);
      console.log(inbox);
      console.log(spam)
    })
}

async function mydata() {
  var yahooMail = await new YahooMail();
  yahooMail.createMailAccount();
}


async function smsTesting() {
sms.getBalance().then(async (balance) => {
  if (balance > 0) {
    const { id, number } = await sms.getNumber('mb', 0) // yandex
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
}


//smsTesting();
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

// async function solveCaptcha() {
//     const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha')
//     puppeteer.use(
//         RecaptchaPlugin({
//             provider: {
//                 id: '2captcha',
//                 token: '8d1ffc723363da12c6847c2f770bd2bc' // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
//             },
//             visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
//         })
//     )

//     // puppeteer usage as normal
//     puppeteer.launch({ headless: true }).then(async browser => {
//         const page = await browser.newPage()
//         await page.goto('https://www.google.com/recaptcha/api2/demo')

//         //That's it, a single line of code to solve reCAPTCHAs 🎉
//         await page.solveRecaptchas()

//         await Promise.all([
//             page.waitForNavigation(),
//             page.click(`#recaptcha-submit`)
//         ])
//         await page.screenshot({ path: 'response.png', fullPage: true })
//         //await browser.close()
//     })
// }
//solveCaptcha();


