const puppeteer = require('puppeteer');
const { response } = require('express');
var faker = require('faker/locale/de');

module.exports =  class YahooMail {
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
        
        let date = await this.getDate('1-1-1960','1-1-2000')

        let userData = {
            'firstName':faker.name.firstName(),
            'lastName':faker.name.lastName(),
            'yid':await this.getMailID(),
            'password':faker.internet.password(),
            'phone':"12345",
            'mm':date.getMonth(),
            'dd':date.getDate(),
            'yyyy':date.getFullYear(),
        }

        console.log(userData)
        //fill signup form
        let selectors = [
            'firstName',
            'lastName',
            'yid',
            'password',
            'phone',
            'mm',
            'dd',
            'yyyy'
        ]

        for(let i=0; i<8;i++) {
            let myValue = userData[selectors[i]];
            let inputSelector = "[name='"+selectors[i]+"']";
            console.log(inputSelector)

            await page.evaluate((myValue, inputSelector) => {
                document.querySelector(inputSelector).value=myValue;
            },myValue, inputSelector)
            
            await page.waitFor(await this.stopTime())
        }

        await page.screenshot({ path: 'example.png' });
        await page.click('#reg-submit-button')
        await page.waitFor(4000)
        await page.screenshot({ path: 'example2.png' });

        let eFlag = 0;

        //eFLag
        eFlag = await page.evaluate(()=>{
            if(document.querySelector('#reg-error-yid').childElementCount > 0) {
                return 1;
            } else {
                return 0;
            }
        })

        if(eFlag) {
            let myValue = await this.getMailID()
            await page.evaluate((myValue) => {
                document.querySelector(['name="yid"']).value=myValue;
            },myValue)
            
            await page.click('#reg-submit-button')
            await page.waitFor(4000)
            await page.screenshot({ path: 'example3.png' });
        }

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
        var remove_after= emailID.indexOf('@');
        emailID =  emailID.substring(0, remove_after);
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
        if( date1>date2){
            return new Date(await this.randomValueBetween(date2,date1))  
        } else{
            return new Date(await this.randomValueBetween(date1, date2))
        }
    }

    
}