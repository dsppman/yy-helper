const axios = require("axios");
const rsa = require("../utils/rsa");
const {getProxy} = require("../utils/proxy");

class Cookie {
    #client;
    #username;
    #password;
    #ttokensec;
    #oauthToken;
    #needProxy;

    constructor() {
        this.#client = axios.create({
            // jar: jar,
            headers: {
                Referer: "https://lgn.yy.com/",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36 Edg/103.0.1264.49"
            },
            transformRequest: (data, headers) => {
                headers["content-type"] =
                    "application/x-www-form-urlencoded; charset=UTF-8";
                return new URLSearchParams(data).toString();
            },
        });
    }

    static create() {
        return new this();
    }

    setUsername(val) {
        this.#username = val;
        return this;
    }

    setPassword(val) {
        this.#password = val;
        return this;
    }

    async #initOAuthToken() {
        const url = "https://jy-login.yy.com/udb/login/init";
        const res = await this.#client.get(url);
        if (!res.data["ttokensec"]) throw Error("ttokensec获取失败");
        this.#ttokensec = res.data["ttokensec"];
        // this.#oauthToken = urlLib.parse(res.data["url"], true).query["oauth_token"];
        this.#oauthToken = new URL(res.data["url"]).searchParams.get("oauth_token");
    }

    async #getCookie() {
        const url = "https://lgn.yy.com/lgn/oauth/x2/s/login_asyn.do";
        let payload = {
            username: this.#username,
            pwdencrypt: rsa(this.#password),
            oauth_token: this.#oauthToken,
            UIStyle: "xelogin",
            appid: 6356,
            cssid: 6356,
            isRemMe: 1,
            mxc: "",
            vk: "",
            mmc: "",
            vv: "",
            hiido: 1,
        };
        let res = await this.#client.post(url, payload);
        if (res.data["code"] !== "0")
            throw Error(res.data["msg"] ? res.data["msg"] : "登录回调获取失败");
        const cbURL = res.data["obj"]["callbackURL"];
        res = await this.#client.get(cbURL, {
            headers: {
                Cookie: "hgame_udboauthtmptokensec=" + this.#ttokensec,
            },
        });
        const [_, ckURL] = res.data.match(
            /writeCrossmainCookieWithCallBack\('(.+?)',/
        );
        if (!ckURL) throw Error("cookie回调获取失败");
        res = await this.#client.get(ckURL);
        if (!res.headers["set-cookie"]) throw Error("响应set-cookie空白");
        return res.headers["set-cookie"]
            .map((ck) => ck.substring(0, ck.indexOf(";")))
            .join(";");
    }

    async get() {
        if (!this.#username || !this.#password) throw Error("账号或密码为空");
        //this.#client.defaults.proxy = this.#needProxy ? await getProxy() : false;
        await this.#initOAuthToken();
        return await this.#getCookie();
    }

    setProxy(isEnable) {
        this.#needProxy = isEnable;
        return this;
    }
}

module.exports = Cookie