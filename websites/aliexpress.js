const logger = require('../utils/logger');
const actions = require('../utils/actions');

class AliExpressHandler {
    /**
     * Create a new AliExpress handler
     * @param {object} page - The Playwright page object
     */
    constructor(page) {
        this.page = page;
        this.domain = 'www.aliexpress.com';
        logger.info('AliExpress handler created');
    }

    /**
     * Buy an item on AliExpress
     * @param {string} item - The item to buy
     */
    async buyItem(item) {
        logger.info(`Attempting to buy item: ${item} on AliExpress`);

        try {
            await actions.try(
                async () => await this.page.getByText('Comprar agora',
                    { timeout: 5000 }).click(),
                'Comprar Agora'
            );

            /*await actions.try(
                async () => await this.page.getByText('Fazer o pedido',
                    { timeout: 5000 }).click(),
                'Fazer o Pedido'
            );*/

            logger.info('Waiting for UI to update, just if there is a popup');
            await this.page.waitForTimeout(5000);

            await actions.try(
                async () => await this.page.getByText('mudança',
                    { timeout: 10000, exact: true }).click(),
                'Clicar no texto mudança (para forçar cartão de crédito)'
            );

            await actions.try(
                async () => await this.page.getByText(process.env.ALIEXPRESS_CC_ENDING_NUMBER || '',
                    { timeout: 10000 }).click(),
                'Clicar no Cartão de Crédito'
            );

            await actions.try(
                async () => await this.page.getByText('Confirmar',
                    { timeout: 5000, exact: true }).click(),
                'Confirmar seleção do cartão de crédito'
            );

            await actions.try(
                async () => await this.page.getByText('Confirmar compra',
                    { timeout: 5000, exact: true }).click(),
                'Confirmar Compra'
            );

            await actions.try(
                async () => await this.page.locator('#cvv')
                    .pressSequentially(process.env.ALIEXPRESS_CVV || ''),
                'Confirmar CVV'
            );

            await actions.try(
                async () => await this.page.locator('#cpf')
                    .pressSequentially(process.env.ALIEXPRESS_CPF || ''),
                'Confirmar CPF'
            );

            await actions.try(
                async () => await this.page.locator('.update-card--update-card-confirm--DpNpFTu',
                    { exact: true }).click(),
                'Confirmação Final'
            );

            logger.info(`Successfully initiated purchase for: ${item}`);
            return true;
        } catch (error) {
            logger.error(`Error buying item: ${error.message}`);
            return false;
        }
    }
}

module.exports = AliExpressHandler;
