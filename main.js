// Load environment variables from .env file
require('dotenv').config();

const { chromium } = require('@playwright/test');
const bodyParser = require('body-parser');
const express = require('express');
const logger = require('./utils/logger');

/* Import the website factory */
const WebsiteFactory = require('./websites/index');

const app = express();
app.use(bodyParser.json());
const port = 3000;

logger.info('Starting main application...');
logger.info('Connecting browser over CDP...');

(async () => {
    try {
        const browser = await chromium.connectOverCDP('http://localhost:9222');
        logger.info('Browser connected successfully.');
        logger.info(`Browser contexts available: ${browser.contexts().length}`);
        const currentContext = browser.contexts()[0];

        app.get('/buy/:domain/:item', async function (req, res) {
            const domain = req.params.domain;
            const item = req.params.item;
            const url = domain.includes('.') ? `https://${domain}` : `https://${domain}.com`;

            logger.info(`Buying item: ${item} on domain: ${domain}`);
            logger.info(`Navigating to domain: ${domain} (URL: ${url})`);
            
            try {
                const page = await currentContext.newPage();

                res.json({
                    success: true,
                    message: `Purchase process initiated for ${item} on ${domain}`,
                    hasHandler: WebsiteFactory.hasHandler(domain)
                });
                
                await page.goto(item);
                const handler = WebsiteFactory.getHandler(domain, page);
                
                if (handler) {
                    logger.info(`Using ${domain} handler to buy ${item}`);
                    
                    // Call the buyItem method (non-blocking)
                    handler.buyItem(item).then(success => {
                        if (success) {
                            logger.info(`Successfully processed purchase for ${item} on ${domain}`);
                        } else {
                            logger.warn(`Could not complete purchase for ${item} on ${domain}`);
                        }
                    }).catch(error => {
                        logger.error(`Error in purchase process: ${error.message}`);
                    });
                } else {
                    // No handler available, just navigate to the site
                    logger.warn(`No handler available for ${domain}, manual interaction required`);
                }
                
            } catch (error) {
                logger.error(`Error processing buy request: ${error.message}`);
                if (!res.headersSent) {
                    res.status(500).json({
                        success: false,
                        message: `Error initiating purchase: ${error.message}`
                    });
                }
            }
        });

        app.listen(port, () => {
            logger.info(`Server listening on port ${port}`);
        });
    } catch (error) {
        logger.error('Error starting application:', error);
    }
})();
