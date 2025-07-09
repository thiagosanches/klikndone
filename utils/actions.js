const logger = require('./logger');

module.exports = {
    /**
     * Try an action and catch any errors
     * @param {Function} action - The action to try
     * @param {string} actionName - Name of the action for error logging
     * @returns {Promise<boolean>} - Whether the action succeeded
     */
    try: async (action, actionName) => {
        try {
            logger.info(`Attempting '${actionName}'`);
            await action();
        } catch (error) {
            logger.error(`Error '${actionName}': ${error.message}`);
        }
    }
}