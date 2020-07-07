# alerTC
Web scraper to notify new marks on Planete INSA Lyon platorm into Messenger conversation.

## Requirements
* Non ARM Linux server
* Nodejs v12.x
* Planète INSA account
* Facebook account (to publish messages)

## Install Instruction
1. clone this project
2. cd to this project
3. Use command `npm install` to install dependencies
4. Rename file `.env.example` to `.env`, fill facebook and planete email and password and messenger conversation + planete marks page URL
5. Run command `npm start` to run scraper

## Automation
To periodically run the scraper, you need to put cron jobs.  
For example, for running the scraper every 5 minutes :  
`*/5 * * * * npm start --prefix /home/alex/alerTC/`

## Troubleshooting
If you have issues with chromium, follow 
[this link](https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md)  
Basically, on debian-like distribs, you need to do these commands :  
* `sudo sysctl -w kernel.unprivileged_userns_clone=1`  

* `sudo apt-get install ca-certificates fonts-liberation gconf-service libappindicator1 libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils`