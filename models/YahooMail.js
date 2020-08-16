// const puppeteer = require('puppeteer');
const { response } = require('express');
const puppeteer = require('puppeteer-extra')
const request = require('request-promise-native');
const poll = require('promise-poller').default;
// const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha')
var faker = require('faker');
const SMSActivate = require('sms-activate')
const sms = new SMSActivate('940054f3775c2e49f71fd64c4c3ef116')
var randomUseragent = require('random-useragent');


module.exports = class YahooMail {

    constructor() {
    }

    async register() {
        // browser = await puppeteer.launch({ headless: true });
        puppeteer.launch({ headless: false }).then(async browser => {
            const page = await browser.newPage();
            await page.setViewport({
                width: 1080,
                height: 720,
                deviceScaleFactor: 1,
            });
            let ss = 0;
            let filename = undefined;
            let url = "https://login.yahoo.com/account/create";
            await page.goto(url, { waitUntil: 'networkidle2' });
            // const userAgentData = randomUseragent.getRandom((ua) => {
            //     return parseFloat(ua.browserVersion) >= 80;
            // })
            // await page.setUserAgent(userAgentData);
            // console.log(userAgentData)

            let phoneData = await this.getNumber();
            let phoneNumber = undefined;
            let date = await this.getDate('1-1-1960', '1-1-2000')
            if (phoneData.balance > 1.5) {
                phoneNumber = phoneData.number
            } else {
                return { "Success": false, "Message": "The balance error", "Payload": [phoneData] }
            }
            let userData = {
                'firstName': faker.name.firstName(),
                'lastName': faker.name.lastName(),
                'yid': await this.getMailID(),
                'password': faker.internet.password(),
                'shortCountryCode': 'RU',
                'phone': phoneNumber,
                'mm': date.getMonth(),
                'dd': Math.floor(Math.random() * 28) + 1,
                'yyyy': date.getFullYear(),
            }

            console.log(userData)
            //fill signup form

            let selectors = [
                'firstName',
                'lastName',
                'yid',
                'password',
                'shortCountryCode',
                'phone',
                'mm',
                'dd',
                'yyyy'
            ]

            //await this.fillForm(userData, selectors)
            for (let i = 0; i < selectors.length; i++) {
                let myValue = userData[selectors[i]];
                let inputSelector = "[name='" + selectors[i] + "']";
                console.log(inputSelector)

                await page.evaluate((myValue, inputSelector) => {
                    document.querySelector(inputSelector).value = myValue;
                }, myValue, inputSelector)

                await page.waitFor(await this.stopTime())
            }
            ss++;
            filename = 'example' + ss + '.png';
            await page.screenshot({ path: filename });
            await page.click('#reg-submit-button')
            await page.waitFor(4000)
            ss++;
            filename = 'example' + ss + '.png';
            await page.screenshot({ path: filename });




            let eFlag = await this.checkValidation(page)
            // for (let i = 0; i < eFlag.length; i++) {
            //     let selectorVal = selectors;
            //     let userDataVal = userData;
            //     if (eFlag[i] == 0) {
            //         selectorVal.splice(i, 1);
            //         userDataVal.splice(i, 1);
            //         i--;
            //     }
            // }
            while (eFlag) {
                let myValue = await this.getMailID()
                let myPass = userData.password
                await page.evaluate((myValue, myPass) => {
                    document.querySelector('[name="yid"]').value = myValue;
                    document.querySelector('[name="password"]').value = myPass;
                }, myValue, myPass)

                await page.click('#reg-submit-button')
                await page.waitFor(4000)
                ss++;
                filename = 'example' + ss + '.png';
                await page.screenshot({ path: filename });
                eFlag = await this.checkValidation()
            }
            if (!eFlag) {
                

                async function initiateCaptchaRequest(apiKey) {
                    const formData = {
                        method: 'userrecaptcha',
                        googlekey: siteDetails.sitekey,
                        key: apiKey,
                        pageurl: siteDetails.pageurl,
                        json: 1
                    };
                    const response = await request.post('http://2captcha.com/in.php', { form: formData });
                    return JSON.parse(response).request;
                }

                async function pollForRequestResults(key, id, retries = 30, interval = 1500, delay = 15000) {
                    await timeout(delay);
                    ss++;
                    filename = 'example' + ss + '.png';
                    await page.screenshot({ path: filename });
                    let dataPoll = poll({
                        taskFn: requestCaptchaResults(key, id),
                        interval,
                        retries
                    });
                    console.log(dataPoll)
                    return dataPoll
                }

                function requestCaptchaResults(apiKey, requestId) {
                    const url = `http://2captcha.com/res.php?key=${apiKey}&action=get&id=${requestId}&json=1`;
                    return async function () {
                        return new Promise(async function (resolve, reject) {
                            console.log("Polling response...")
                            const rawResponse = await request.get(url);
                            const resp = JSON.parse(rawResponse);
                            if (resp.status === 0) return reject(resp.request);
                            console.log("received")
                            console.log(resp)
                            resolve(resp.request);
                        });
                    }
                }
                const timeout = millis => new Promise(resolve => setTimeout(resolve, millis))
                const siteDetails = {
                    sitekey: '6LdWXicTAAAAAKIdor4xQ_gzgD-LgDP3siz7cop6',
                    pageurl: page.url()
                }

                const apiKey = '3bf8b2b71f3e87f9ab2862df0dfead26'

                const requestId = await initiateCaptchaRequest(apiKey);

                const response = await pollForRequestResults(apiKey, requestId);
                console.log(response)
                await page.evaluate((response)=> {
                    document.getElementById('g-recaptcha-response').innerText=response 
                },response);

                page.click('#recaptcha-submit');

                ss++;
                filename = 'example' + ss + '.png';
                await page.screenshot({ path: filename });

            }
            await page.waitFor(await this.stopTime())
            ss++;
            filename = 'example' + ss + '.png';
            await page.screenshot({ path: filename });
            /* let responseURL = 'https://login.yahoo.com/account/module/create?validateField=phone'
            const myResponse = await page.waitForResponse(responseURL);
            await browser.waitFor(2000);*/
            //console.log(myResponse)
            //await browser.close();
        })

    }

    async stopTime() {
        return Math.floor(Math.random() * Math.floor(5000));
    }

    async getMailID() {
        let emailID = faker.name.firstName() + faker.internet.email()
        var remove_after = emailID.indexOf('@');
        emailID = emailID.substring(0, remove_after);
        emailID.trim()
        return emailID
    }

    async randomValueBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    async getDate(date1, date2) {
        var date1 = date1 || '01-01-1970'
        var date2 = date2 || new Date().toLocaleDateString()
        date1 = new Date(date1).getTime()
        date2 = new Date(date2).getTime()
        if (date1 > date2) {
            return new Date(await this.randomValueBetween(date2, date1))
        } else {
            return new Date(await this.randomValueBetween(date1, date2))
        }
    }

    async getNumber() {
        let balance = await sms.getBalance()

        //sms.getBalance().then(async (balance) => { //https://sms-activate.ru/stubs/handler_api.php?api_key=$api_key&action=getBalance
        if (balance > 0) {
            var { id, number } = await sms.getNumber('mb', 0) // yandex https://sms-activate.ru/stubs/handler_api.php?api_key=$api_key&action=getNumber&service=$service&forward=$forward&operator=$operator&ref=$ref&country=$country
            number = number.toString()
            number = number.slice(1)
            var data = { balance: balance, number: number, orderId: id }
            console.log(data)
            return new Promise((resolve, reject) => {
                resolve(data)
                return data;
            })

        } else {
            return new Promise((resolve, reject) => {
                resolve(balance)
                return { balance: balance };
            })
        }
        //   }).catch(console.error)
    }

    async solveCaptcha() {
        const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha')
        puppeteer.use(
            RecaptchaPlugin({
                provider: {
                    id: '2captcha',
                    token: '3bf8b2b71f3e87f9ab2862df0dfead26' // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
                },
                visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
            })
        )

        // puppeteer usage as normal
        //puppeteer.launch({ headless: true }).then(async browser => {
        const page = await browser.newPage()
        //  await page.goto(page.url();
        //That's it, a single line of code to solve reCAPTCHAs 🎉
        //await page.solveRecaptchas()
        // let { captchas, error } = await page.findRecaptchas()
        // let { solutions, error } = await page.getRecaptchaSolutions(captchas)
        // let { solved, error } = await page.enterRecaptchaSolutions(solutions)
        // for (const frame of page.mainFrame().childFrames()) {
        //     // Attempt to solve any potential reCAPTCHAs in those frames
        //     await frame.solveRecaptchas()
        //   }
        await Promise.all([
            page.waitForNavigation(),
            page.click(`#recaptcha-submit`)
        ])
        await page.screenshot({ path: 'response.png', fullPage: true })
        page = page;
        //await browser.close()
        //})
    }

    // async checkValidation() {
    //     return await page.evaluate(() => {
    //         let checkSelectors = [
    //         'firstName',
    //         'lastName',
    //         'yid',
    //         'password',
    //         'shortCountryCode',
    //         'phone',
    //         'mm',
    //         'dd',
    //         'yyyy'
    //         ]
    //         var formCheck = []
    //         for(let i=0;i<checkSelectors.length;i++)
    //         {
    //             let check = '#reg-error-'+checkSelectors[i];
    //             if (document.querySelector(check)) {
    //                 if (document.querySelector(check).childElementCount > 0) {
    //                     formCheck.push(1);
    //                 } else {
    //                     formCheck.push(0);                    }
    //             } else {
    //                 formCheck.push(1);                }
    //         }
    //     })
    // }

    async checkValidation(page) {
        return await page.evaluate(() => {
            let check = '#reg-error-yid';
            if (document.querySelector(check)) {
                if (document.querySelector(check).childElementCount > 0) {
                    return 1;
                } else {
                    return 0;
                }
            } else {
                return 0;
            }

        })

    }

    // async fillForm(userData, selectors) {
    //     for (let i = 0; i < selectors.length; i++) {
    //         let myValue = userData[selectors[i]];
    //         let inputSelector = "[name='" + selectors[i] + "']";
    //         console.log(inputSelector)

    //         await page.evaluate((myValue, inputSelector) => {
    //             document.querySelector(inputSelector).value = myValue;
    //         }, myValue, inputSelector)

    //         await page.waitFor(await this.stopTime())
    //     }
    // }
}