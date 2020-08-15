const puppeteer = require('puppeteer');
const { response } = require('express');
var faker = require('faker');
const SMSActivate = require('sms-activate')
const sms = new SMSActivate('940054f3775c2e49f71fd64c4c3ef116')
var randomUseragent = require('random-useragent');


module.exports = class YahooMail {
    constructor() {
    }

    async register() {

        let url = "https://login.yahoo.com/account/create";
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({
            width: 1080,
            height: 720,
            deviceScaleFactor: 1,
        });
        await page.goto(url, { waitUntil: 'networkidle2' });

        var userAgent = await randomUseragent.getRandom()
        console.log(userAgent, 'rua')
        await page.setUserAgent(userAgent)
        console.log(await browser.userAgent());

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
            'shortCountryCode':'RU',
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

        for (let i = 0; i < selectors.length; i++) {
            let myValue = userData[selectors[i]];
            let inputSelector = "[name='" + selectors[i] + "']";
            console.log(inputSelector)

            await page.evaluate((myValue, inputSelector) => {
                document.querySelector(inputSelector).value = myValue;
            }, myValue, inputSelector)

            await page.waitFor(await this.stopTime())
        }

        await page.screenshot({ path: 'example.png' });
        await page.click('#reg-submit-button')
        await page.waitFor(4000)
        await page.screenshot({ path: 'example2.png' });

        let eFlag = 0;

        async function checkRightMail() {
            return await page.evaluate(() => {
                if(document.querySelector('#reg-error-yid')){
                    if (document.querySelector('#reg-error-yid').childElementCount > 0) {
                        return 1;
                    } else {
                        return 0;
                    }
                }else{
                    return 0;
                }
                
            })
        }

        eFlag = await checkRightMail()
        while (eFlag) {
            let myValue = await this.getMailID()
            await page.evaluate((myValue) => {
                document.querySelector('[name="yid"]').value = myValue;
            }, myValue)

            await page.click('#reg-submit-button')
            await page.waitFor(4000)
            await page.screenshot({ path: 'example3.png' });
            eFlag = await checkRightMail()
        }

        await page.waitFor(await this.stopTime())
        await page.screenshot({ path: 'example4.png' });
        /* let responseURL = 'https://login.yahoo.com/account/module/create?validateField=phone'
        const myResponse = await page.waitForResponse(responseURL);
        await browser.waitFor(2000);*/
        //console.log(myResponse)
        await browser.close();
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
                return {balance:balance};
            })
        }
        //   }).catch(console.error)
    }


}