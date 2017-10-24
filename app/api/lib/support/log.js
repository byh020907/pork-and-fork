const { appendFile } = require('fs');
const { promisify } = require('util');

const appendFileAsync = promisify(appendFile);

module.exports = async (level, message) => {
    const now = new Date(Date.now());
    const text = `[${now}] [${level}] ${message}`;
    
    const path = `./logs/${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}.log`
    
    try {
        await appendFileAsync(path, `${text}\r\n`);
    } catch (e) {
        return console.error(e);
    }

    console.log(text);
};