require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');

// Fill in .env file
const FACEBOOK_EMAIL = process.env.FACEBOOK_EMAIL;
const FACEBOOK_PASSWORD = process.env.FACEBOOK_PASSWORD;

const MESSENGER_CONV_URL = process.env.MESSENGER_CONV_URL;
const PLANETE_MARKS_URL = process.env.PLANETE_MARKS_URL;

const PLANETE_USERNAME = process.env.PLANETE_USERNAME;
const PLANETE_PASSWORD = process.env.PLANETE_PASSWORD;

(async () => {
    try{
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

        await page.goto(PLANETE_MARKS_URL, { waitUntil: 'networkidle2' });
        const elts = await page.$$eval('.ec-exam', elts => elts.map(elt => elt.textContent.replace(/(\t)/gm, "")));
        let results = elts.map(elt => elt.split('\n'));
        let marks = [];
        for(let i = 0; i < results.length; i++){
            let name = results[i][1];
            if(name == 'examen'){
                continue;
            }
            let mark = results[i][5];
            let average = results[i][6];
            let sd = results[i][7];
            marks.push({name: name, mark: mark, average: average, sd: sd});
        }

        let fileContent = fs.readFileSync('./marks.txt', {flag: 'a+', encoding: 'utf8'});
        
        // Initiliaze to 0 for firt start
        let marks_parsed = 0;
        try{
            marks_parsed = JSON.parse(fileContent);
        } catch(e){
            console.error('Parsing error', e);
        }

        let missing_marks = [];
        if(marks.length != marks_parsed.length){
            for(let i = 0; i < marks.length; i++){
                let test = false;
                for(let j = 0; j < marks_parsed.length; j++){
                    if(marks[i].name == marks_parsed[j].name){
                        test = true;
                        break;
                    }
                }
                if(test == false){
                    missing_marks.push({name: marks[i].name, mark: marks[i].mark, average: marks[i].average, sd: marks[i].sd});
                }
            }
            fs.writeFileSync('./marks.txt', JSON.stringify(marks, {flag : 'w', encoding : 'utf8'}));
        }

        if(missing_marks.length != 0){
            for(let i = 0; i < missing_marks.length; i++){
                console.log('Nouvelle note ajoutée : ' + missing_marks[i].name +
                ' avec une moyenne de : ' + missing_marks[i].average +
                ' et un écart-type de : ' + missing_marks[i].sd);
            }
        }
        else{
            await browser.close()
        }

        // MESSENGER
        await page.goto('https://www.messenger.com/', { waitUntil: 'networkidle2' });

        let emailFacebookField = await page.$('[name=email]');
        let passwordFacebookField = await page.$('[name=pass]');
        let submitFacebookButton = await page.$('button[id=loginbutton]');
        
        await emailFacebookField.type(FACEBOOK_EMAIL);
        await passwordFacebookField.type(FACEBOOK_PASSWORD);
        
        const navigationFacebookPromise = page.waitForNavigation();

        await submitFacebookButton.click();

        await navigationFacebookPromise;

        await page.goto(MESSENGER_CONV_URL, { waitUntil: 'networkidle2' });

        for(let i = 0; i < missing_marks.length; i++){
            await page.type('._1p1t', 'Nouvelle note ajoutée : ' + missing_marks[i].name +
            ' avec une moyenne de : ' + missing_marks[i].average +
            ' et un écart-type de : ' + missing_marks[i].sd);
            await page.keyboard.press('Enter');
        }
        await browser.close();
    }
    catch (err) {
        console.error(err.message);
    }
})();

