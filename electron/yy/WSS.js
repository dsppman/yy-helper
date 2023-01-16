const { randomUUID } = require("crypto");
const { SmartBuffer } = require("smart-buffer");
const WebSocket = require("ws");
const assert = require("assert");

class SuperBuffer extends SmartBuffer {
  #uri = 0;
  static create = super.fromOptions;
  pushUInt32 = this.writeUInt32LE;
  pushUInt16 = this.writeUInt16LE;
  popUInt32 = this.readUInt32LE;
  popUInt16 = this.readUInt16LE;
  popUInt8 = this.readUInt8;

  marshall(hasHeaders = false) {
    if (hasHeaders) {
      this.insertUInt32LE(this.length + 10, 0);
      this.insertUInt32LE(this.#uri, 4);
      this.insertUInt16LE(200, 8);
    }
    return this.toBuffer();
  }

  pushBool(val) {
    return this.writeUInt8(val ? 1 : 0);
  }

  pushUint8Array(val) {
    this.writeUInt16LE(val.byteLength);
    return this.writeBuffer(val);
  }

  popUint8Array() {
    const len = this.readUInt16LE();
    return this.readBuffer(len);
  }

  pushUint8Array32(val) {
    this.writeUInt32LE(val.byteLength);
    return this.writeBuffer(val);
  }

  popUint8Array32() {
    const len = this.readUInt32LE();
    return this.readBuffer(len);
  }

  pushString(val) {
    return this.pushUint8Array(Buffer.from(val));
  }

  popString() {
    return this.popUint8Array().toString();
  }

  popUtf8String() {
    return this.popUint8Array().toString("utf8");
  }

  popUtf8String32() {
    return this.popUint8Array32().toString("utf8");
  }

  setUri(uri) {
    this.#uri = uri;
  }

  //pop
}

class WsH5chl extends WebSocket {
  constructor(uuid = randomUUID()) {
    super(
      `wss://h5chl.yy.com/websocket?appid=yymweb104h5&version=1599189250&uuid=${uuid}`
    );
    this.on("open", () => console.log("loginH5chl open"));
    this.on("close", () => console.log("loginH5chl close"));
  }

  whenOpen() {
    return new Promise((resolve) => {
      this.on("open", resolve);
    });
  }

  sendPromise(data) {
    return new Promise((resolve, reject) => {
      setTimeout(reject, 5000, "超时了");
      this.send(data);
      this.on("message", (respData) => {
        const packet = SuperBuffer.fromBuffer(respData);
        const len = packet.popUInt32();
        assert(packet.length === len, "Packet length check failed");
        const uri = packet.popUInt32();
        const resCode = packet.popUInt16();
        console.log(`VerifyPacket len=${len} uri=${uri} resCode=${resCode}`);
        let result;
        if (uri === 779524) {
          result = parseNormalLoginResPacket(packet);
        } else if (uri === 775940) {
          result = onPLoginApResPacket(packet);
        } else if (uri === 794372) {
        } else if (uri === 512011) {
          //775940
          result = parseApRouter(packet);
        }
        resolve(result);
      });
    });
  }
}
//======登录频道
function createHeaderPacket(options) {
  const {
    realUri = 0,
    appid = 0,
    uid = 0,
    vecProxyId = [],
    vecS2SId = [],
    codec = 0,
    clientIp = 0,
    clientPort = 0,
    routeNum = 0,
    srvName = "",
    clientFromType = 0,
    clientFromExt = "",
    extentProps = new Map(),
    clientCtx = "",
  } = options;

  const n = new SuperBuffer();
  n.pushUInt32((1 << 24) | 8);
  n.pushUInt32(realUri);
  n.pushUInt32(33554448);
  n.pushUInt32(appid);
  n.pushUInt32(uid);
  n.pushUInt32(0);
  let o = 8 + 8 * vecProxyId.length + 4 + 8 * vecS2SId.length;
  n.pushUInt32((4 << 24) | (16777215 & o));
  n.pushUInt32(vecProxyId.length);
  n.pushUInt32(vecS2SId.length);
  n.pushUInt32((5 << 24) | 8);
  n.pushUInt32(codec);
  o =
    16 +
    Buffer.from(srvName).byteLength +
    4 +
    2 +
    Buffer.from(clientFromExt).byteLength;
  n.pushUInt32((6 << 24) | (16777215 & o));
  n.pushUInt32(clientIp);
  n.pushUInt16(clientPort);
  n.pushUInt32(routeNum);
  n.pushString(srvName);
  n.pushUInt32(clientFromType);
  n.pushString(clientFromExt);
  o = 8;
  for (const [key, value] of extentProps) {
    o += 4;
    o += 2 + Buffer.from(value).byteLength;
  }
  n.pushUInt32((7 << 24) | (16777215 & o));
  n.pushUInt32(extentProps.size);

  for (const [key, value] of extentProps) {
    n.pushUInt32(key);
    n.pushUint8Array(value);
  }
  o = 6 + Buffer.from(clientCtx).byteLength;
  n.pushUInt32((8 << 24) | (16777215 & o));
  n.pushString(clientCtx);
  n.pushUInt32(4286085240);
  return n.marshall();
}

function createChannelPacket(options) {
  const { uid, topSid, subSid, joinProps = new Map() } = options;
  const packet = new SuperBuffer();
  packet.pushUInt32(uid);
  packet.pushUInt32(topSid);
  packet.pushUInt32(subSid);
  packet.pushUInt32(joinProps.size);
  for (const [key, value] of joinProps) {
    packet.pushUInt32(key);
    key === 6 ? packet.pushUint8Array(value) : packet.pushString(value);
  }
  return packet.marshall();
}

function createJoinChannelPacket(options) {
  const { uid, topSid = 75777786, subSid = 2681560692 } = options;

  const channelPacket = createChannelPacket({
    uid,
    topSid,
    subSid,
    joinProps: new Map([
      [2, "0"],
      [3, "1"],
    ]),
  });

  const headerPacket = createHeaderPacket({
    realUri: 2048258,
    appid: 259,
    uid,
    srvName: "channelAuther",
    clientFromExt: "",
    clientCtx: "",
    extentProps: new Map([
      [1, SuperBuffer.create().pushUInt32(topSid).marshall()],
    ]),
  });

  const packet = new SuperBuffer();
  packet.setUri(512011);
  packet.pushString("");
  packet.pushUInt32(2048258);
  packet.pushUInt16(0);
  packet.pushUint8Array32(channelPacket);
  packet.pushUint8Array32(headerPacket);
  return packet.marshall(true);
}
//======

//====
function createNormalLoginPacket(options) {
  const {
    uid,
    credit,
    appType = 6,
    appid = "yymweb104h5",
    sign = "2DEC4603",
    appVer = "1.0.0",
    sdkVer = "",
    clientIp = "",
    clientPort = 0,
    channel = "",
    reserve = "",
  } = options;
  const e = new SuperBuffer();
  e.setUri(779268);
  e.pushString("");
  e.pushUInt32(335570153);
  //insertTwoBytesHeader(r)
  e.pushUint8Array32(
    SuperBuffer.create()
      //r
      .pushUint8Array(
        SuperBuffer.create()
          .pushUInt32(0)
          .pushString("")
          //protoHeader
          .pushUint8Array(
            SuperBuffer.create()
              .pushUInt16(appType)
              .pushString(appid)
              .pushString(sign)
              .pushString(appVer)
              .pushString(sdkVer)
              .pushString(clientIp)
              .pushUInt32(clientPort)
              //deviceInfo
              .pushUint8Array(
                SuperBuffer.create()
                  .pushString("iPhone X")
                  .pushString("xx-xx-xx-xx")
                  .pushString("xx-xx-xx-xx")
                  .pushString("xx-xx-xx-xx")
                  .pushUInt32(0)
                  .pushUInt32(0)
                  .pushString("iOS")
                  .pushString("11")
                  .pushString("")
                  .pushString("")
                  .pushString("")
                  .marshall()
              )
              .pushString(channel)
              .pushString(reserve)
              .pushUInt32(0)
              .marshall()
          )
          //protoToken
          .pushUint8Array(
            SuperBuffer.create()
              .pushUInt32(1) //tokenType
              .pushUint8Array(
                //protoCredit
                SuperBuffer.create()
                  .pushUInt32(uid)
                  .pushUInt32(0)
                  .pushString(credit)
                  .pushUInt32(1)
                  .marshall()
                //protoAcctInfo
                // SuperBuffer.create()
                //   .pushString("y4oh31i03tw")
                //   .pushString(
                //     "EBCFC69DADEB97F7850E85E5600B9E6F42B009F6"
                //   )
                //   .pushString("")
                //   .marshall()
              )
              .pushUInt32(0)
              .pushString("")
              .marshall()
          )
          .pushString("")
          //protoAntiCode
          .pushUint8Array(
            SuperBuffer.create().pushString("").pushString("").marshall()
          )
          .marshall()
      )
      .marshall()
  );

  return e.marshall(true);
}

function createLoginApPacket(options) {
  const {
    uuid,
    uid,
    account,
    password,
    appid = 259,
    bRelogin = false,
    ticket = new Uint8Array(0),
    cookie = new Uint8Array(0),
    context = "259:1",
  } = options;

  const loginAuthInfo = () => {
    // SuperBuffer.create()
    //   .pushString(account)
    //   .pushString(password)
    //   .pushUInt32(2)
    //   .pushUInt32(0)
    //   .pushUInt32(0)
    //   .pushString("yymweb104h5")
    //   .pushString("B8-97-5A-17-AD-4D")
    //   .pushString("yymwebn_yymweb104h5")
    //   .pushUInt32(0)
    //   .pushUInt32(0)
    //   .pushUInt32(0)
    //   .pushUInt32(0)
    //   .pushString(uuid)
    //   .marshall();
    const e = new SuperBuffer();
    "string" == typeof account
      ? e.pushString(account)
      : e.pushUint8Array(account);
    e.pushString(password);
    e.pushUInt32(2);
    e.pushUInt32(0);
    e.pushUInt32(0);
    e.pushString("yymweb104h5");
    e.pushString("B8-97-5A-17-AD-4D");
    e.pushString("yymwebn_yymweb104h5");
    e.pushUInt32(0);
    e.pushUInt32(0);
    e.pushUInt32(0);
    e.pushUInt32(0);
    e.pushString(uuid);
    return e.marshall();
  };

  const e = new SuperBuffer();
  e.setUri(775684);
  e.pushUint8Array32(loginAuthInfo());
  e.pushUInt32(appid);
  e.pushUInt32(uid);
  e.pushUInt32(0);
  e.pushBool(bRelogin);
  e.pushUint8Array(ticket);
  e.pushUint8Array(cookie);
  e.pushString(context);
  return e.marshall(true);
}

//====
function parseNormalLoginResPacket(packet) {
  const r = {
    context: packet.popString(),
    resCode: packet.popUInt32(),
    ruri: packet.popUInt32(),
    payload: packet.popUint8Array32(),
  };
  const e = SuperBuffer.fromBuffer(r.payload);
  return {
    _length: e.popUInt16(),
    protoVersion: e.popUInt32(),
    context: e.popString(),
    errCode: e.popUInt32(),
    errMsg: e.popUtf8String(),
    description: e.popUtf8String(),
    strategy: e.popUInt32(),
    loginData: {
      _length: e.popUInt16(),
      uid: e.popUInt32(),
      _: e.popUInt32(),
      yyid: e.popUInt32(),
      _: e.popUInt32(),
      passport: e.popString(),
      credit: e.popString(),
      _: e.popUInt32(),
      mobileMask: e.popString(),
      emailMask: e.popString(),
      serverTime: e.popUInt32(),
    },
    sessionData: e.popUtf8String(),
    _: e.popUInt32(),
    url: e.popString(),
    ticket: e.popUint8Array(),
    cookie: e.popUint8Array(),
    linkTicket: e.popUint8Array(),
    webTicket: e.popString(),
  };
}

function onPLoginApResPacket(packet) {
  packet.popUInt32();
  return {
    resCode: packet.popUInt32(),
    context: packet.popString(),
    clientIp: packet.popUInt32(),
    clientPort: packet.popUInt16(),
    appKey: packet.popUInt32(),
    uid: packet.popUInt32(),
  };
}

function parseApRouter(packet) {
  const r = {
    from: packet.popString(),
    ruri: packet.popUInt32(),
    resCode: packet.popUInt16(),
    payload: packet.popUint8Array32(),
    _: packet.popUInt32(),
  };
  const subPacket = SuperBuffer.fromBuffer(r.payload);
  console.log("onPApRouter", r);
  switch (r.ruri) {
    case 2048514:
      return onPJoinChannelRes(subPacket);
    case 836612:
      break;
    default:
      console.log("onPApRouter unexpected", r);
  }
}

function onPJoinChannelRes(packet) {
  const r = {
    topSid: packet.popUInt32(),
    uid: packet.popUInt32(),
    subSid: packet.popUInt32(),
    asid: packet.popUInt32(),
    loginTS: packet.popUInt32(),
    loginStatus: packet.popUInt8(),
    errInfo: packet.popUtf8String(),
    expiredTs: packet.popUInt32(),
  };
  console.log("onPJoinChannelRes success", r);
  return r;
}

// async function getApTicket(cookie) {
//     const cookies = {};
//     for (const item of Object.entries(cookie.split(";"))) {
//         const [_, key, value] = item[1].match(/(.+?)=(.+)$/) || [];
//         if (key) cookies[key.trim()] = value.trim();
//     }
//     if (!cookies.yyuid || !cookies.udb_c) return {}
//
//     const ws = new WsH5chl();
//     await ws.whenOpen()
//     try {
//         const data = createNormalLoginPacket({
//             uid: cookies["yyuid"],
//             credit: cookies["udb_c"],
//         })
//         return parsePacket(await ws.sendPromise(data));
//     } finally {
//         ws.close()
//     }
// }
//
// async function joinChannel(options) {
//     const {
//         uid,
//         topSid = 10725517,
//         subSid = 2637486004,
//         ticket,
//         cookie,
//         account,
//         password,
//     } = options;
//     const uuid = randomUUID();
//     const ws = new WsH5chl(uuid)
//     await ws.whenOpen()
//     try {
//         const loginApData = createLoginApPacket({
//             uuid,
//             uid,
//             ticket,
//             cookie,
//             account,
//             password,
//         })
//         await ws.sendPromise(loginApData)
//         const joinChannelData = createJoinChannelPacket({
//             uid,
//             topSid,
//             subSid
//         });
//         await ws.sendPromise(joinChannelData)
//     } finally {
//         ws.close()
//     }
// }

async function joinChannelV2(cookie, topSid, subSid) {
  const uuid = randomUUID();
  const cookies = {};
  for (const item of Object.entries(cookie.split(";"))) {
    const [_, key, value] = item[1].match(/(.+?)=(.+)$/) || [];
    if (key) cookies[key.trim()] = value.trim();
  }
  // console.log(cookies)
  if (!cookies.yyuid || !cookies.udb_c) throw Error("cookie格式有误");
  const ws = new WsH5chl(uuid);
  await ws.whenOpen();
  try {
    const data = createNormalLoginPacket({
      uid: cookies["yyuid"],
      credit: cookies["udb_c"],
    });
    console.log(data)
    const result = await ws.sendPromise(data);
    console.log(result);
    // console.log('linkTicket ', result.linkTicket.toString('hex'));
    if (result.errCode !== 0) throw Error(result.description || "失败");
    const loginApData = createLoginApPacket({
      uuid,
      uid: result.loginData.uid,
      ticket: result.linkTicket,
      cookie: result.cookie,
      account: result.loginData.passport,
      password: result.loginData.credit,
    });
    let a11 = await ws.sendPromise(loginApData);
    console.log('a111', a11)
    const joinChannelData = createJoinChannelPacket({
      uid: result.loginData.uid,
      topSid,
      subSid,
    });
    a11 = await ws.sendPromise(joinChannelData);
    console.log('a112', a11)
    return result.webTicket;
  } finally {
    ws.close();
  }
}

module.exports = {
  // getApTicket,
  // joinChannel,
  joinChannelV2,
};
