const axios = require("axios");

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const proxy = (async function* () {
  let time;
  while (true) {
    if (1000 - time > 0) await delay(1000 - time);
    const { data } = await axios.get(
        "http://111.223.15.132:2233/api.do?order=2022830204415C2BR67&num=20"
      // "http://pandavip.xiongmaodaili.com/xiongmao-web/apiPlus/vgl?secret=e6d6bca248a660e6c57702f80971db46&orderNo=VGL20220802001828qoKlXCDG&count=20&isTxt=1&proxyType=1&validTime=0&removal=0&cityIds="
    );
    time = 0;
    setTimeout(() => (time += 100), 100);
    const ips = data.trim().split(/\r?\n/);
    if (ips.length === 0) throw Error("ip代理已用完");
    for (let i = 0; i < ips.length; i++) {
      yield ips[i];
    }
  }
})();

async function getProxy() {
  const { value } = await proxy.next();
  const [host, port] = value.split(":");
  return {
    protocol: "http",
    host,
    port,
  }
}

module.exports = {
  getIP: () => proxy.next(),
  getProxy
};