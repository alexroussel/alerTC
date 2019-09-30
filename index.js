require('dotenv').config();
const puppeteer = require('puppeteer');

const FACEBOOK_EMAIL = process.env.FACEBOOK_EMAIL;
const FACEBOOK_PASSWORD = process.env.FACEBOOK_PASSWORD;

const MESSENGER_URL = process.env.MESSENGER_URL;

const PLANETE_USERNAME = process.env.PLANETE_USERNAME;
const PLANETE_PASSWORD = process.env.PLANETE_PASSWORD;

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setViewport({ width: 1280, height: 720 });

    // PLANETE
    await page.goto('https://login.insa-lyon.fr/cas/login', { waitUntil: 'networkidle2' });
    let usernamePlaneteField = await page.$('[name=username]');
    let passwordPlaneteField = await page.$('[name=password]');
    let submitPlaneteButton = await page.$('[name=submit]');

    await usernamePlaneteField.type(PLANETE_USERNAME);
    await passwordPlaneteField.type(PLANETE_PASSWORD);

    // Wait til submit button is clicked and the page is loaded
    const navigationPlanetePromise = page.waitForNavigation();

    await submitPlaneteButton.click();
    
    // End Wait
    await navigationPlanetePromise;

    await page.goto('https://planete.insa-lyon.fr/uPortal/f/for/normal/render.uP?pCt=scolarix-portlet.u18l1n13&pP_action=notes', { waitUntil: 'networkidle2' });

    // MESSENGER
    await page.goto('https://www.messenger.com/', { waitUntil: 'networkidle2' });

    let emailFacebookField = await page.$('[name=email]');
    let passwordFacebookField = await page.$('[name=pass]');
    let submitFacebookButton = await page.$('button');

    await emailFacebookField.type(FACEBOOK_EMAIL);
    await passwordFacebookField.type(FACEBOOK_PASSWORD);
    
    const navigationFacebookPromise = page.waitForNavigation();

    await submitFacebookButton.click();

    await navigationFacebookPromise;

    await page.goto(MESSENGER_URL, { waitUntil: 'networkidle2' });

    await page.type('._1p1t', 'test');
    await page.keyboard.press('Enter');
    await browser.close()
})();

