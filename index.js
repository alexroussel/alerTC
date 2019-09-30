require('dotenv').config();
const puppeteer = require('puppeteer');

// Fill in .env file
const FACEBOOK_EMAIL = process.env.FACEBOOK_EMAIL;
const FACEBOOK_PASSWORD = process.env.FACEBOOK_PASSWORD;

const MESSENGER_URL = process.env.MESSENGER_URL;

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setViewport({ width: 1280, height: 720 });

    // MESSENGER
    await page.goto('https://www.messenger.com/', { waitUntil: 'networkidle2' });

    let emailField = await page.$('[name=email]');
    let passwordField = await page.$('[name=pass]');
    let submitButton = await page.$('button');

    await emailField.type(FACEBOOK_EMAIL);
    await passwordField.type(FACEBOOK_PASSWORD);

    
    // Wait til submit button is clicked and the page is loaded
    const navigationPromise = page.waitForNavigation();

    await submitButton.click();

    // End Wait
    await navigationPromise;

    await page.goto(MESSENGER_URL, { waitUntil: 'networkidle2' });

    await page.type('._1p1t', 'test');
    await page.keyboard.press('Enter');
    await browser.close()
})();

