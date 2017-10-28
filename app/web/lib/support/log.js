const FS = require("fs.promised");

module.exports = async (level, message) => {
    const now = new Date(Date.now());
    const text = `[${ now.toGMTString() }] [${ level }] ${ message }`;
    
    const path = `./logs/${ now.getFullYear() }-${ now.getMonth() + 1 }-${ now.getDate() }.log`
    
    try {
        await FS.appendFile(path, `${text}\r\n`);
    } catch (e) {
        return console.error(e);
    }

    console.log(text);
};