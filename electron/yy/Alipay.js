const { BrowserWindow, app } = require("electron");
const puppeteer = require('puppeteer-core')
const portfinder = require('portfinder');

portfinder.getPort(function (err, port) {
    //
    // `port` is guaranteed to be a free port
    // in this scope.
    //
    app.commandLine.appendSwitch('remote-debugging-port', port.toString())
});

let browser = null

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

app.once('ready', async ()=> {
    const port = app.commandLine.getSwitchValue('remote-debugging-port')
    browser = await puppeteer.connect({
        browserURL: `http://127.0.0.1:${port}`
    });
    console.log("connect success");
})

class Alipay {
    static create() {
        return new this()
    }

    async open(payUrl, payPasswd) {
        const win = new BrowserWindow({
            webPreferences: {
                devTools: true
            }
        });
        await win.loadURL(payUrl)
        win.webContents.debugger.attach()
        const { targetInfo } = await win.webContents.debugger.sendCommand('Target.getTargetInfo')
        win.webContents.debugger.detach()

        const targets = await browser.targets();
        const index = targets.map(target => target._targetId).indexOf(targetInfo.targetId)
        const page = await targets[index].page()
        if (!page) throw new Error("Unable to find puppeteer Page from BrowserWindow. Please report this.");

        try {
            const elementHandle = await page.waitForSelector('#channels > div > iframe');
            const frame = await elementHandle.contentFrame();
            const input = await frame.waitForSelector('#payPassword_rsainput', { timeout: 5000 });
            // await page.mouse.move(560, 530);
            await frame.waitForTimeout(2000);
            await input.type(payPasswd, {delay: 200});
            const btn = await frame.$('#validateButton');
            await btn.click();
            await frame.waitForTimeout(5000);
        } finally {
            await page.screenshot({ path: 'alipay.png', fullPage: true })
            await win.destroy()
            console.log(`All done, check the screenshot. `)
        }
    }

}

module.exports = Alipay
