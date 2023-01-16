const fs = require("fs");
const {dialog, BrowserWindow} = require('electron')
const axios = require("axios");
const fetch = require("node-fetch")
const Alipay = require("./yy/Alipay");

async function createOrder(username, amount) {
    let response = await axios.post("https://pay.yy.com/userDepositCheckAction.action", new URLSearchParams({
        passport: username,
        passport2: username,
        duowanb: amount,
        bankId: "alipayDirectPay",
        sourcecode: "webzf_wgpay",
        deptype: 1,
        gameName:"",
        method: "WAZF",
        gameCoin: 0
    }), {
        headers: {
            "referer": "https://pay.yy.com/userDepositDWAction.action?method=WAZF&product=&server=&choice=",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Edg/106.0.1370.34",
            "content-type": "application/x-www-form-urlencoded",
            "origin": "https://pay.yy.com",
        }
    });
    const re = response.data.match(/name="urlKey" value="(.+)"/)
    if (re == null || re.length < 1) {
        throw Error(response.data.match(/errorMessage = '(.+)';/)?.[1]);
    }
    const key = re[1]
    const cookie = response.headers["set-cookie"].map(item => item.split(';')[0]).join(';')

    response = await fetch('https://pay.yy.com/userDepositAction.action', {
        redirect: "manual",
        method: "POST",
        body: new URLSearchParams({
            timestamp: Date.now(),
            urlKey: key
        }),
        headers: {
            "referer": "https://pay.yy.com/userDepositCheckAction.action",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Edg/106.0.1370.34",
            "content-type": "application/x-www-form-urlencoded",
            "origin": "https://pay.yy.com",
            cookie
        }
    })
    const payUrl = response.headers.get('location')
    console.log(payUrl)
    return {
        payUrl,
        key
    };
}

async function checkOrderSuccess(key) {
    const response = await fetch('https://pay.yy.com/checkOrderSuccess.action', {
        redirect: "manual",
        method: "POST",
        body: new URLSearchParams({
            timestamp: Date.now(),
            urlKey: key
        }),
        headers: {
            "referer": "https://pay.yy.com/userDepositCheckAction.action",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Edg/106.0.1370.34",
            "content-type": "application/x-www-form-urlencoded",
            "origin": "https://pay.yy.com"
        }
    })
    return response.text()
}

class Handler {
    static importUsers(path) {
        const content = fs.readFileSync(path, 'utf-8');
        if (content.length === 0) throw Error("文件无内容")
        const users = content.split(/\r?\n/);
        const list = []
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            const [username, password, cookie] = user.split('----')
            password && list.push({
                username,
                password,
                cookie
            })
        }
        return list;
    }

    static exportUsers(content) {
        const path = dialog.showSaveDialogSync({
            filters: [
                {name: 'TXT', extensions: ['txt']},
                {name: 'All Files', extensions: ['*']}
            ],
            title: '导出',
            buttonLabel: '导出'
        })
        if (path) fs.writeFileSync(path, content)
        return '导出成功'
    }

    static async addCredit(userData, form) {
        // const key = 'AB5173F582E36F80D93134500678F3ED53F0318A4CB7CD5640F11089CC5928A7B78E4DC75AFCD0E9720E5B9EE8F38111'

        const {payUrl, key} = await createOrder(userData['username'], form['amount'])
        console.log("key: " + key)
        await Alipay.create().open(payUrl, form['alipayPassword'])
        const ret = await checkOrderSuccess(key)
        if (ret !== '1') throw Error('充值失败，未知');
        return {
            result: `充值 ${form['amount']} 元成功`
        }
    }

    static async loginAlipay() {
        const win = new BrowserWindow({
            webPreferences: {
            }
        });
        await win.loadURL("https://auth.alipay.com/login/index.htm?goto=https%3A%2F%2Fwww.alipay.com%2F")
    }
}


module.exports = async function (event, name, options) {
    try {
        console.log('[ entry ]', name, options?.[0]?.['username']);
        return await Handler[name]?.apply(this, options)
    } catch (e) {
        console.log(e)
        return {
            errMsg: e.message || '未知错误'
        }
    }
}