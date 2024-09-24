const chalk = require('chalk');

// Set chalk level (1 is 16 colors, but 3 gives truecolor)
chalk.level = 1; // You can set it to 3 for full color support if needed.

const consoleErrorHighlighted = (coloredMessage, message) => {
    console.log(chalk.bgRed.white("[ERROR]:"), coloredMessage ? chalk.red(coloredMessage) : message);
};
const consoleSuccessHighlighted = (coloredMessage, message) => {
    console.log(chalk.bgGreen.white("[SUCCESS]:"), coloredMessage ? chalk.green(coloredMessage) : message);
};
const consoleInitiateHighlighted = (coloredMessage, message) => {
    console.log(chalk.bgBlue.white("[INITIATED]:"), coloredMessage ? chalk.blue(coloredMessage) : message);
};

const consoleHighlighted = {
    error: consoleErrorHighlighted,
    success: consoleSuccessHighlighted,
    initiate: consoleInitiateHighlighted
};

// Correctly export both chalk and consoleHighlighted as part of an object
module.exports = {
    chalk,
    consoleHighlighted
};
