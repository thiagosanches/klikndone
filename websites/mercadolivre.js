const logger = require('../utils/logger');
const actions = require('../utils/actions');

/**
 * MercadoLivre website handler
 */
class MercadoLivreHandler {
    /**
     * Create a new MercadoLivre handler
     * @param {object} page - The Playwright page object
     */
    constructor(page) {
        this.page = page;
        this.domain = 'mercadolivre.com.br';
        logger.info('MercadoLivre handler created');
    }
    
    /**
     * Search for an item on MercadoLivre
     * @param {string} item - The item to search for
     */
    async searchItem(item) {
        logger.info(`Searching for item: ${item} on MercadoLivre`);
        
        try {
            // Wait for search input to be available
            await this.page.waitForSelector('.nav-search-input');
            
            // Clear any existing text and type the search query
            await this.page.fill('.nav-search-input', item);
            
            // Click the search button
            await this.page.click('.nav-search-btn');
            
            // Wait for search results
            await this.page.waitForSelector('.ui-search-result');
            
            logger.info(`Search completed for: ${item}`);
            return true;
        } catch (error) {
            logger.error(`Error searching for item: ${error.message}`);
            return false;
        }
    }
    
    /**
     * Buy an item on MercadoLivre
     * @param {string} item - The item to buy
     */
    async buyItem(item) {
        logger.info(`Attempting to buy item: ${item} on MercadoLivre`);
        
        try {
            // First search for the item
            await this.searchItem(item);
            
            // Click the first result
            await actions.waitAndClick(
                this.page, 
                '.ui-search-result__image a', 
                'first search result'
            );
            
            // Wait for product page to load and click "Comprar agora" (Buy Now)
            await actions.waitAndClick(
                this.page, 
                '.ui-pdp-actions__container .andes-button--loud', 
                'Comprar agora button'
            );
            
            // If login is required, check if we need to enter email
            await actions.tryAction(async () => {
                if (await this.page.isVisible('#user_id')) {
                    await actions.waitAndFill(
                        this.page, 
                        '#user_id', 
                        process.env.MERCADOLIVRE_EMAIL || '', 
                        'email field'
                    );
                    await this.page.click('.andes-button--loud');
                }
            }, 'Enter email if needed');
            
            // If login is required, check if we need to enter password
            await actions.tryAction(async () => {
                if (await this.page.isVisible('#password')) {
                    await actions.waitAndFill(
                        this.page, 
                        '#password', 
                        process.env.MERCADOLIVRE_PASSWORD || '', 
                        'password field'
                    );
                    await this.page.click('.andes-button--loud');
                }
            }, 'Enter password if needed');
            
            // Select shipping method if available
            await this.tryAction(
                async () => {
                    if (await this.page.isVisible('.andes-radio')) {
                        await this.page.click('.andes-radio');
                        await this.page.click('.andes-button--loud');
                    }
                },
                'Select shipping method'
            );
            
            // Select payment method if available
            await this.tryAction(
                async () => {
                    const paymentSelector = '[data-payment-method-id="account_money"]';
                    if (await this.page.isVisible(paymentSelector)) {
                        await this.page.click(paymentSelector);
                    }
                },
                'Select payment method'
            );
            
            // Final confirmation
            await this.tryAction(
                async () => {
                    const confirmSelector = '.andes-button--loud:has-text("Confirmar compra")';
                    if (await this.page.isVisible(confirmSelector)) {
                        await this.page.click(confirmSelector);
                    }
                },
                'Confirm purchase'
            );
            
            logger.info(`Successfully initiated purchase for: ${item}`);
            return true;
        } catch (error) {
            logger.error(`Error buying item: ${error.message}`);
            return false;
        }
    }
}

module.exports = MercadoLivreHandler;
