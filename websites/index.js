const logger = require('../utils/logger');

/**
 * Simple factory to get handlers for different websites
 */
class WebsiteFactory {
    /**
     * Get the appropriate handler for a website
     * @param {string} domain - The website domain
     * @param {object} page - The Playwright page object
     * @returns {object} - Website handler instance
     */
    static getHandler(domain, page) {
        const normalizedDomain = domain.toLowerCase();
        logger.info(`Getting handler for domain: ${normalizedDomain}`);

        // Return the appropriate handler based on domain
        switch (normalizedDomain) {
            case 'aliexpress':
            case 'www.aliexpress.com':
                const AliExpressHandler = require('./aliexpress');
                return new AliExpressHandler(page);

            case 'amazon':
            case 'www.amazon.com':
                const AmazonHandler = require('./amazon');
                return new AmazonHandler(page);
                
            case 'mercadolivre':
            case 'mercadolibre':
            case 'www.mercadolivre.com.br':
            case 'www.mercadolibre.com':
                const MercadoLivreHandler = require('./mercadolivre');
                return new MercadoLivreHandler(page);

            default:
                logger.warn(`No handler found for domain: ${normalizedDomain}`);
                return null;
        }
    }

    /**
     * Check if a handler exists for a domain
     * @param {string} domain - The website domain
     * @returns {boolean} - Whether a handler exists
     */
    static hasHandler(domain) {
        const normalizedDomain = domain.toLowerCase();
        return [
            'aliexpress', 'www.aliexpress.com',
            'amazon', 'www.amazon.com',
            'mercadolivre', 'mercadolibre', 'www.mercadolivre.com.br', 'www.mercadolibre.com'
        ].includes(normalizedDomain);
    }
}

module.exports = WebsiteFactory;
