const axios = require("axios");
const crypto = require("crypto");
const {joinChannelV2} = require("./WSS");
const delay = require("../utils/delay");
const Cookie = require("./Cookie");


class YY {
    #info;
    #client;

    static async login(options) {
        let { username, password, cookie, needProxy } = options;
        if (cookie) {
            const result = await this.#getUserLoginInfo(cookie);
            if (!result.isLogin) cookie = null;
        }
        if (!cookie) {
            cookie = await Cookie.create()
                .setUsername(username)
                .setPassword(password)
                .setProxy(needProxy)
                .get();
        }
        const result = await this.#getUserLoginInfo(cookie);
        if (!result.isLogin) throw Error("请重新登录");
        const that = new this();
        that.#info = result.data;
        that.#client = axios.create({
            timeout: 5000,
            headers: {
                // Host: "turnover.yy.com",
                Accept: "application/json, text/javascript, */*; q=0.01",
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36 YYHost/1.10.36.0",
                "Accept-Language": "zh-CN,zh;q=0.9",
                Cookie: cookie,
                Referer:
                    "https://jy.yy.com/page/charge-201606-feat/index.html?ApiMode=11",
            },
            paramsSerializer(params) {
                const data = JSON.stringify(params);
                // console.log(
                //     crypto.createHash("md5").update(`turnover${data}`).digest("hex")
                // );
                return new URLSearchParams({
                    appId: "turnover",
                    sign: crypto
                        .createHash("md5")
                        .update(`turnover${data}`)
                        .digest("hex"),
                    data,
                });
            },

        });
        return that;
    }

    static async #getUserLoginInfo(cookie) {
        const url = "https://hgame.yy.com/action/getUserLoginInfo.json";
        const { data } = await axios.get(url, {
            headers: {
                Cookie: cookie,
            },
        });
        return data;
    }

    static async getUID(yyId) {
        const { data } = await axios.get(`https://www.yy.com/u/${yyId}`);
        const [_, uid] = data.match(/"uid":(\d+?),"/) || [];
        return uid;
    }

    joinChannel(sid, ssid) {
        return joinChannelV2(this.getCookie(), sid, ssid);
    }

    async buyGift(ticket, propsId, sid, ssid) {
        const url = "https://turnover.yy.com/giftbag/buy";
        const cmd = 1009;
        const params = {
            version: 0,
            appId: "turnover",
            cmd,
            jsonMsg: {
                ticket, //: "none",
                appId: 2,
                cmd,
                propsId,
                count: 1,
                senderuid: this.#info["uid"],
                sendernickname: this.#info["nick"],
                recveruid: 0, //60773034,
                recvernickname: "0", //"9595284",
                uid: this.#info["uid"],
                seq: Date.now(),
                sid, //4378478,
                ssid, //2778874691,
                expand: "",
            },
        };
        // console.log(params);
        const { data } = await this.#client.get(url, {
            params,
            // proxy: await getProxy(),
        });
        return JSON.parse(data.jsonMsg);
    }

    async testBuyGift(ticket, propsId, sid, ssid) {
        const url = "https://turnover.yy.com/api/2/1009";
        const cmd = 1009;
        const params = {
            version: 0,
            appId: 2,
            cmd,
            jsonMsg: {
                ticket, //: "none",
                appId: 2,
                cmd,
                propsId,
                count: 1,
                senderuid: this.#info["uid"],
                sendernickname: this.#info["nick"],
                recveruid: 0, //60773034,
                recvernickname: "0", //"9595284",
                uid: this.#info["uid"],
                seq: Date.now(),
                sid, //4378478,
                ssid, //2778874691,
                expand: "",
            },
        };
        console.log(JSON.stringify(params), crypto
            .createHash("md5")
            .update(`turnover${JSON.stringify(params)}`)
            .digest("hex"))
        return;
        // console.log(params);
        const { data } = await axios.post(url, params, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36 YYHost/1.10.36.0",
                "Accept-Language": "zh-CN,zh;q=0.9",
                Cookie: this.getCookie(),

            }
        });
        return data;
    }

    async checkBackpack() {
        const url = "https://turnover.yy.com/turnover";
        const cmd = 1001;
        const params = {
            version: 0,
            appId: 2,
            cmd,
            jsonMsg: {
                cmd,
                uid: this.#info["uid"],
                appId: 2,
                usedChannel: 10000,
                seq: Date.now(),
            },
        };
        const { data } = await this.#client.get(url, {
            params,
        });
        return JSON.parse(data.jsonMsg);
    }

    async createOrder(amount) {
        const url = "https://turnover.yy.com/turnover";

        const cmd = 1022;
        const params = {
            version: 0,
            appId: 2,
            cmd,
            jsonMsg: {
                cmd,
                uid: this.#info["uid"],
                appId: 2,
                sid: 0,
                usedChannel: 10000,
                currencyType: 1,
                amount,
                chargeCurrencyConfigId: 0,
                expand: JSON.stringify({
                    isChargeForAnother: false,
                    chargeAccount: "",
                }),
                payChannel: "Paygate",
                payMethod: "QrCode",
            },
        };
        const { data } = await this.#client.get(url, {
            params,
        });
        console.log(data);
        return JSON.parse(data.jsonMsg);
    }

    async checkOrderStat(externOrderId) {
        const url = "https://hgame.yy.com/order/q_charge_order_pay_status.json";

        const callback = `jQuery1124039016203281571427_${Date.now()}`;
        const res = await this.#client.get(url, {
            params: {
                callback,
                externOrderId,
                _: Date.now(),
            },
        });
        return res.data.search("true") > 0;
    }

    async rewardGift(sid, ssid, recveruid, target, propsId = 20004, count = 1) {
        const url = "https://turnover.yy.com/turnover";

        const cmd = 1009;
        const params = {
            version: 0,
            appId: 2,
            cmd,
            jsonMsg: {
                cmd,
                uid: this.#info["uid"],
                appId: 2,
                sid,
                ssid,
                senderuid: this.#info["uid"],
                senderimid: 0,
                sendernickname: this.#info["nick"],
                recveruid,
                recverimid: 0,
                recvernickname: this.#info["nick"],
                propsId,
                count,
                expand: JSON.stringify({
                    target,
                }),
                seq: Date.now(),
                usedChannel: 10000,
            },
        };
        const { data } = await this.#client.get(url, {
            params
        });
        return JSON.parse(data.jsonMsg);
    }

    getInfo() {
        return this.#info;
    }

    getCookie() {
        return this.#client.defaults.headers["Cookie"];
    }
}

module.exports = YY




