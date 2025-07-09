const logger = require('../utils/logger');
const BaseHandler = require('./base-handler');

/**
 * Amazon website handler
 */
class AmazonHandler extends BaseHandler {
    /**
     * Create a new Amazon handler
     * @param {object} page - The Playwright page object
     */
    constructor(page) {
        super(page, 'www.amazon.com', 'Amazon');
    }
    
    /**
     * Search for an item on Amazon
     * @param {string} item - The item to search for
     */
    async searchItem(item) {
        logger.info(`Searching for item: ${item} on ${this.name}`);
        
        try {
            await this.waitAndFill('#twotabsearchtextbox', item, 'search input');
            await this.waitAndClick('#nav-search-submit-button', 'search button');
            
            logger.info(`Search completed for: ${item}`);
            return true;
        } catch (error) {
            logger.error(`Error searching for item: ${error.message}`);
            return false;
        }
    }
    
    /**
     * Buy an item on Amazon
     * @param {string} item - The item to buy
     */
    async buyItem(item) {
        logger.info(`Attempting to buy item: ${item} on Amazon`);
        
        try {
            // First search for the item
            await this.searchItem(item);
            
            // Wait for search results
            await this.page.waitForSelector('.s-result-item');
            
            // Click the first result
            await this.page.click('.s-result-item:first-child h2 a');
            
            // Wait for product page to load
            await this.page.waitForSelector('#buy-now-button');
            
            // Click Buy Now button
            await this.page.click('#buy-now-button');
            
            logger.info(`Successfully initiated purchase for: ${item}`);
            return true;
        } catch (error) {
            logger.error(`Error buying item: ${error.message}`);
            return false;
        }
    }
}

module.exports = AmazonHandler;
