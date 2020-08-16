// const puppeteer = require('puppeteer');
const { response } = require('express');
const puppeteer = require('puppeteer-extra')
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha')
var faker = require('faker');
const SMSActivate = require('sms-activate')
const sms = new SMSActivate('940054f3775c2e49f71fd64c4c3ef116')
var randomUseragent = require('random-useragent');


module.exports = class YahooMail {
    constructor(browser,page) {
        this.browser = browser
        this.page = page
    }

    async register() {

        let url = "https://login.yahoo.com/account/create";
        await this.page.goto(url, { waitUntil: 'networkidle2' });

        //var userAgent = await randomUseragent.getRandom()
        //console.log(userAgent, 'rua')
        //await this.page.setUserAgent(userAgent)
        //console.log(await this.browser.userAgent());

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
            'dd': date.getDate(),
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

        await this.fillForm(userData,selectors)

        await this.page.screenshot({ path: 'example.png' });
        await this.page.click('#reg-submit-button')
        await this.page.waitFor(4000)
        await this.page.screenshot({ path: 'example2.png' });




        let eFlag = await this.checkValidation()
        for(let i=0;i<eFlag.length;i++){
            let selectorVal = selectors;
            let userDataVal = userData;
            if(eFlag[i]==0){
                selectorVal.splice(i,1);
                userDataVal.splice(i,1);
                i--;
            }
        }
        while (eFlag) {
            let myValue = await this.getMailID()
            await this.page.evaluate((myValue) => {
                document.querySelector('[name="yid"]').value = myValue;
            }, myValue)

            await this.page.click('#reg-submit-button')
            await this.page.waitFor(4000)
            await this.page.screenshot({ path: 'example3.png' });
            eFlag = await this.checkRightMail()
        }
        if(eFlag==0){
            this.solveCaptcha()
        }
        await this.page.waitFor(await this.stopTime())
        await this.page.screenshot({ path: 'example4.png' });
        /* let responseURL = 'https://login.yahoo.com/account/module/create?validateField=phone'
        const myResponse = await this.page.waitForResponse(responseURL);
        await this.browser.waitFor(2000);*/
        //console.log(myResponse)
        await this.browser.close();
    }

    async stopTime() {
        return Math.floor(Math.random() * Math.floor(5000));
    }

    async getMailID() {
        let emailID = faker.internet.email()
        var remove_after = emailID.indexOf('@');
        emailID = emailID.substring(0, remove_after);
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
        puppeteer.use(
            RecaptchaPlugin({
                provider: {
                    id: '2captcha',
                    token: '8d1ffc723363da12c6847c2f770bd2bc' // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
                },
                visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
            })
        )

        // puppeteer usage as normal
        //puppeteer.launch({ headless: true }).then(async this.browser => {
        //    const this.page = await this.browser.newthis.page()
            //await this.page.goto('https://www.google.com/recaptcha/api2/demo')

            // That's it, a single line of code to solve reCAPTCHAs 🎉
            await this.page.solveRecaptchas()

            await Promise.all([
                this.page.waitForNavigation(),
                this.page.click(`#recaptcha-demo-submit`)
            ])
            await this.page.screenshot({ path: 'response.png', fullPage: true })
            //await this.browser.close()
        //})
    }

    async checkValidation() {
        return await this.page.evaluate(() => {
            let checkSelectors = [
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
            var formCheck = []
            for(let i=0;i<checkSelectors.length;i++)
            {
                let check = '#reg-error-'+checkSelectors[i];
                if (document.querySelector(check)) {
                    if (document.querySelector(check).childElementCount > 0) {
                        formCheck.push(1);
                    } else {
                        formCheck.push(0);                    }
                } else {
                    formCheck.push(1);                }
            }
        })
    }

    async fillForm(userData,selectors){
        for (let i = 0; i < selectors.length; i++) {
            let myValue = userData[selectors[i]];
            let inputSelector = "[name='" + selectors[i] + "']";
            console.log(inputSelector)

            await this.page.evaluate((myValue, inputSelector) => {
                document.querySelector(inputSelector).value = myValue;
            }, myValue, inputSelector)

            await this.page.waitFor(await this.stopTime())
        }
    }
}