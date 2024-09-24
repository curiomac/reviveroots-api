const app = require('./app');
const dotenv = require("dotenv");
const connectDatabase = require('./config/database');
const {chalk} = require('./utils/chalk');
const { MESSAGES } = require('./utils/appConstants');

dotenv.config({ path: "config/config.env" });

connectDatabase();
const server = app.listen(process.env.PORT, () => {
    console.log(`${MESSAGES.PORT_LISTEN}${chalk.yellow(`${process.env.PORT} in ${process.env.NODE_ENV}`)}`)
})

process.on('unhandledRejection', (error) => {
    console.log(`${chalk.bgRed.white("Error: ")} ${error.message}`);
    console.log('Shutting down the server due to unhandled rejection error')
    server.close(() => {
        process.exit(1);
    })
})


process.on('uncaughtException', (error) => {
    console.log(`${chalk.bgRed.white("Error: ")} ${error.message}`);
    console.log('Shutting down the server due to uncaught rejection error')
    server.close(() => {
        process.exit(1);
    })
});
