const YahooMail = require("../models/YahooMail");
const puppeteer = require('puppeteer-extra')
const YahooMail = require('./models/YahooMail')
const sms = new SMSActivate('940054f3775c2e49f71fd64c4c3ef116')

module.exports.createmailaccount = async function (req, res) {
    try {
        let url = "https://login.yahoo.com/account/create";
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setViewport({
            width: 1080,
            height: 720,
            deviceScaleFactor: 1,
        });
        if (1) {
            var response = await new YahooMail(browser,page).createMailAccount();
            res.send(response)
        } else {
            res.send({ "Success": true, "Error": error, "Payload": [] })
        }
    } catch (e) {
        res.send({ "Success": false, "Error": e.toString(), "Payload": [] });
    }
}