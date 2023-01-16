const { joinChannelV2 } = require("../yy/WSS");
const axios = require("axios");

async function f() {
  const cookie =
      "LGNJSESSIONID=4af444907942d043ccb370d546e951c7bcc2b573;udb_c=;yyuid=2532264026;username=y4oh31i03tw;password=EBCFC69DADEB97F7850E85E5600B9E6F42B009F6;osinfo=17979E0637697E40F1C4CA285D5C88BA8C49F1E8;udb_l=CwB5NG9oMzFpMDN0d1KR5mIHcwDTM8dC9gQbBeAKUZ6lKvyyTvQZLMcz5j9ecAeXyWuCA2g2x2EhSM-z90iGEtbFfKLeMQLijUD_ZPEEh9Pvx73R0URRH_Q6CZnTFbAPUSahgNLN5cUcRR-X0CtdHGTWDoPoZ6zPcNsbj-vQ8anffRKzPXdGAAAAAAMAAAAAAAAADAAxMTcuODcuMTg2LjQEADYzNTY=;udb_n=27a60b3dc2705130b499901f2919ede693359aca0d5ef05ae42942202d10b72a910ae8585c61b5b80370fc20e6489f88;udb_c=AECKJFBqAAJgAKys7XV1ksDRJg9a5LSiSgDPcoYo3FxGkNQSpDGZZgbkgL60tIOBG-rCN0HsteRUQXupc8I_tm-PvBpxe1F7_f6YwTnFJZ_HpuGCinsm8UIjwchcTerIsKGvksNPOFU2cw==;udb_oar=612F1B553DFE44C68B155BEC81B95E7BCEFAF8DBEDB330782BAAE2763175546E1631621A5AC82670F289CB7CC319B58D01C4CAFA0A16E29700BA37D5A08E7BD01C6A572C64F91213DDB5153807B0608570F8A2022EDDAB135971677E35E0C686F75254C1334C785B488E840359D0B54369250972AE522051524018FAEC71274F5872C4AF9F6F45C434CCACD6296F4BF8C43A467C6218FF25562AF23AAAC9F5F29EF79BF11FE322FEE723D969F361BC457ED500B8694E0CD878E35E53BF9BAE4F6B40B16D95D912421E9293FCE75B580094F738169AADB9AAD91DC97235503EE96B7F865B565D38CE7F3E9E8AC3C4FDB80E18CF634A96AD25E89BFEA40BC3D1DC9E44174A43415891EF4479EBFA71B3047D9B82DCDC6D33034EAC5218611D026E5CB10E4DE7A4E3FC3ED911823B359AB0FF3D15E2204490CA56EF31104F14B130"
  const sid = 81886868;
  const ssid = 2515972602;
  await joinChannelV2(cookie, sid, ssid);
}

f()

async function f1() {
  const url =
    "http://lgn.yy.com/lgn/jump/authentication.do?action=authenticate&appid=5060&busiId=5130&direct=1&busiUrl=http%3A%2F%2Fweb.yy.com%2Funion%2Frecommend.html%3Fuid%3D2863080060%26sid%3D69595230%26ts%3D1659437051&ticket=boIB7TCCAemgAwIBBaEDAgEOogcDBQAAAAAAo4IBXWGCAVkwggFVoAMCAQWhERsPeXkuY29tAAAEAAGqpyJ8ohEwD6ADAgEBoQgwBhsENTA2MKOCASYwggEioAQCAgEVoQMCAQKiggETBIIBDwgCAEx3fwAACAIATHd%2FAABmeDHod9CxmJZ85Zzjw5S%2BIgmhZ2lJ0ERUYdFI%2BGuWoyp%2FWrRgEcUxojoOIDlBza8nHIutWMDCqrFCRTOVMnCEMSeWl6vPW4IKDHYUfDMIt%2FtpMfdpSdBUdBHReO%2Fk5dgvD0AYqL%2B97cLXCnKPX%2Bis4n2T06ih%2B5t3OdRIJQguz4ztx57dYEFcqQ2DBBIfyXLNiseWJpfkFPT%2FE4EBU%2B9DipHo5q%2Bv9d8%2F54VujMGQozwz9w9JPsSIEagDMrLMP0MgOxxy9hdcPSRtbD4uaYZP5dsn3hSKwxUGmckny9Y8u02fLCgq6DEcl1rClid1BPbrizIAAAAAAAAAAAAAAACkczBxoAMCARGiagRoo%2Fs1dS98%2BtbE%2BaAoq9y1vVzi1sAx%2BJCHAr6NdPDe7ASvC%2BGuKECzoklE9pZ0SJ7lL3r76euRdS%2F0zf2WF%2B6i8agWMNLX5LPnKiOkBfwqTn6EOtdmuPjccz9nEY%2FHRs1eOQGoR1oquvU%3D";
  const ticket =
    "boICCzCCAgegAwIBBaEDAgEOogcDBQAAAAAAo4IBXWGCAVkwggFVoAMCAQWhERsPeXkuY29tAAAEAAGqpmrwohEwD6ADAgEBoQgwBhsENTA2MKOCASYwggEioAQCAgEVoQMCAQKiggETBIIBDwgCAGQefwAACAIAZB5%2FAABmJu9yV%2BgdrNJmz6IkY5uMHqWi542j%2BNzcz4amdRvkjDu7fIfq%2FzA6zBihZId39q3RMKUDrHya9mtP3w2%2FgCSU%2F4bJ4RX4RBHNWAUiPsGBe6310heNo%2FiMPN%2BWFlA0u1LRUle%2BFjNRgzaOSJZoi7XaDr8QJxYBh7UNTEngQh7oWBGOJnYzai2Yk4B6DiE5TJZzudmsBJtsPLxZ9hVFKuPc6dKp0GPtbuKDTWfmA89fZ9yYxJs5SiQICz3TxMNC4wagLUivhnuED4y5P268WU8b9nO3jSsu5CP8RrEf2yMUbFYfW9HZop0YLa3Smjvjv4zl3I0AAAAAAAAAAAAAAACkgZAwgY2gAwIBEaKBhQSBgux3UIV8sb%2B%2BdVtMsjp1%2F1JWIY10%2BQd2yR7wpzMJMaf1a7l1TG2g%2FAqnv0a6vf44AMHOZRb%2FWclmvjIakA9dGufVGveJVUp3o6UZbkeEmA1XOVbq2e6Uvzv%2BHF4AgoTiwfXWRErLismV0cDDv%2BOGM%2FgSp8Nrj0mfw3A%2BzbkH0oxZ0kw%3D";
  const UURRLL = new URL(url);
  UURRLL.searchParams.set("ticket", ticket);
  console.log(UURRLL.searchParams);
  let res = await axios.get(UURRLL.toString(), {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36 YYHost/1.10.36.0",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
      "Accept-Language": "zh-CN,zh;q=0.9",
    },
  });
  console.log(res)
}
// f1();

async function f2() {

}
// f2()


//loginH5chl open
// 779524 200
// 352347369
// {
//   _length: 399,
//   protoVersion: 0,
//   context: '',
//   errCode: 0,
//   errMsg: '凭证服务服务返回0',
//   description: '成功',
//   strategy: 0,
//   loginData: {
//     _length: 192,
//     uid: 2863033072,
//     _: 0,
//     yyid: 2861523250,
//     passport: 'kabtpegwv6',
//     credit: 'AEhfLl9qAAJgAFnZld-2q6Gw4xnbmSsswrkEJ_YWlhNfxQCeHelUkSS_AwF0wFOtR3qLF7a7FUUA-sH4Au0cU-SsJHsSM-lPhI9S-E4Ieq96dsLfG3NcVg0E0-cl7WqFBoX2vaZoH-amWQ==',
//     mobileMask: '167***',
//     emailMask: '',
//     serverTime: 1659447358
//   },
//   sessionData: '\x01\x01\x00\x00W,�k��+�b\x02K�\x03`^��n&��Z\t\x1D�\rT)�0�Hآ�]��D��f��:<����㹉\b��?\t�uL��\x15N���{\x15\x0B���>e�\x03\x07\x1A��c*�pb�\r����b�\x0F\x17�-FWC�(\x0B��(��K\x03��\x1A���ߝ�_v\x1854�b�l/s�1i�8\x04���',
//   _: 0,
//   url: '',
//   ticket: <Buffer 01 00 00 00 00 00 00 00 8b 02 6b 82 02 87 30 82 02 83 a0 03 02 01 05 a1 03 02 01 0b a3 08 1b 06 79 79 2e 63 6f 6d a4 17 30 15 a0 03 02 01 01 a1 0e 30 ... 1661 more bytes>,
//   cookie: <Buffer ec 57 83 30 66 66 c2 2c b0 19 85 84 1b c9 ba c9 b5 42 db 31 48 93 52 0e ae f3 a4 c8 f8 81 6d 64 61 81 65 32 34 20 c0 d8 c5 8d db a1 14 3c f1 7a 38 64 ... 158 more bytes>,
//   linkTicket: <Buffer 6e 82 02 0c 30 82 02 08 a0 03 02 01 05 a1 03 02 01 0e a2 07 03 05 00 00 00 00 00 a3 82 01 5e 61 82 01 5a 30 82 01 56 a0 03 02 01 05 a1 11 1b 0f 79 79 ... 478 more bytes>,
//   webTicket: 'boICCzCCAgegAwIBBaEDAgEOogcDBQAAAAAAo4IBXWGCAVkwggFVoAMCAQWhERsPeXkuY29tAAAEAAGqpmrwohEwD6ADAgEBoQgwBhsENTA2MKOCASYwggEioAQCAgEVoQMCAQKiggETBIIBDwgCAGQefwAACAIAZB5%2FAABmJu9yV%2BgdrNJmz6IkY5uMHqWi542j%2BNzcz4amdRvkjDu7fIfq%2FzA6zBihZId39q3RMKUDrHya9mtP3w2%2FgCSU%2F4bJ4RX4RBHNWAUiPsGBe6310heNo%2FiMPN%2BWFlA0u1LRUle%2BFjNRgzaOSJZoi7XaDr8QJxYBh7UNTEngQh7oWBGOJnYzai2Yk4B6DiE5TJZzudmsBJtsPLxZ9hVFKuPc6dKp0GPtbuKDTWfmA89fZ9yYxJs5SiQICz3TxMNC4wagLUivhnuED4y5P268WU8b9nO3jSsu5CP8RrEf2yMUbFYfW9HZop0YLa3Smjvjv4zl3I0AAAAAAAAAAAAAAACkgZAwgY2gAwIBEaKBhQSBgux3UIV8sb%2B%2BdVtMsjp1%2F1JWIY10%2BQd2yR7wpzMJMaf1a7l1TG2g%2FAqnv0a6vf44AMHOZRb%2FWclmvjIakA9dGufVGveJVUp3o6UZbkeEmA1XOVbq2e6Uvzv%2BHF4AgoTiwfXWRErLismV0cDDv%2BOGM%2FgSp8Nrj0mfw3A%2BzbkH0oxZ0kw%3D'
// }
// loginH5chl close

//779524 200
// 352347369
// {
//   _length: 399,
//   protoVersion: 0,
//   context: '',
//   errCode: 0,
//   errMsg: '凭证服务服务返回0',
//   description: '成功',
//   strategy: 0,
//   loginData: {
//     _length: 192,
//     uid: 2863033072,
//     _: 0,
//     yyid: 2861523250,
//     passport: 'kabtpegwv6',
//     credit: 'AMCFJFBqAAJgAD891NlcCm7h9HBwyYvvzCXfkgw5Z6SL89lCKxDq2l8EHI2nOMZjPqR7tFAT2ILbyQlJB_VN-8_wCOIW7TohdySwxdmEIazFgltFt7xwAjsyGmFkakjkRoAUBzDZmiXbOQ==',
//     mobileMask: '167***',
//     emailMask: '',
//     serverTime: 1659447531
//   },
//   sessionData: '\x01\x01\x00\x00��� �\x1F;�2\x06yp�\x01\n' +
//     "�9c��-�ZX�\x16R�,ݏ���\x07vƨ-�������;�R\x15<\x05�\x0F�Q?!z<�\x19&��cv�&�+/�\x17/�?��!Ƿ\x1F$��\rPP'�\x1E��\x0E�Pd1�\\\x16�=�\x19�g%�\x1DR\x1COqf&L�D��\x18��\x0Es�R��Qiف*�+�B�\x07��",
//   _: 0,
//   url: '',
//   ticket: <Buffer 01 00 00 00 00 00 00 00 8b 02 6b 82 02 87 30 82 02 83 a0 03 02 01 05 a1 03 02 01 0b a3 08 1b 06 79 79 2e 63 6f 6d a4 17 30 15 a0 03 02 01 01 a1 0e 30 ... 1661 more bytes>,
//   cookie: <Buffer ec 57 83 30 66 66 c2 2c 41 3a 3f 1d b9 db 43 e9 6c 00 ce 2b a7 08 5a ea da c5 b0 de 57 b9 23 62 1d 5b f5 c0 7f 9d f2 57 54 ba 16 b4 d5 45 81 1b be 9d ... 158 more bytes>,
//   linkTicket: <Buffer 6e 82 02 0c 30 82 02 08 a0 03 02 01 05 a1 03 02 01 0e a2 07 03 05 00 00 00 00 00 a3 82 01 5e 61 82 01 5a 30 82 01 56 a0 03 02 01 05 a1 11 1b 0f 79 79 ... 478 more bytes>,
//   webTicket: 'boICCzCCAgegAwIBBaEDAgEOogcDBQAAAAAAo4IBXWGCAVkwggFVoAMCAQWhERsPeXkuY29tAAAEAAGqpmrwohEwD6ADAgEBoQgwBhsENTA2MKOCASYwggEioAQCAgEVoQMCAQKiggETBIIBDwgCAHAZfwAACAIAcBl%2FAABmJu9yV%2BgdrNJmz6IkY5uMHqWi542j%2BNzcz4amE2LDR
// xGFccHqyFcFTxXb8kd39q3RMKUDrHya9mtP3w2%2FgCSU%2F4bJ4RX4RBHNWAUiPsGBe6310heNo%2FiMPN%2BWFlA0u1LRUle%2BFjNRgzaOSOHAFP3aDr8QJxYBh7UNTEngQh7rcBSRJnYzai2Yk4B6DiE5TJZzudmsBJtsPLxZ9hVFKuPc6dKp0GPtbuKDTWfmA89fZ9yYxJs5SiQICz3TxMNC4wagLUiv
// hnuED4y5P268WU8bVN4OzoYboM6yzKz1nnZlJJZuO6nPop0YLa3Smjvjv4zl3I0AAAAAAAAAAAAAAACkgZAwgY2gAwIBEaKBhQSBgrkW5tNpu452macJ%2FjmK%2Fjo8BAytTLIh11c9Anzd7yafWgWttalW0TLGf1leEGBJNQLbKWXStTHfO%2Fm7RMLkTVY2yAJEOb0EDACICzrPHgzVqOcz9ud1N6H1XpoRnl1af%2FMH%2Bgxcv40UCeUnFXqWg3WsaO9ZDWuAtP2xOHO0VvZpOQc%3D'
// }
// 775940 200
// {}
// 512011 200
// {}
// loginH5chl close
