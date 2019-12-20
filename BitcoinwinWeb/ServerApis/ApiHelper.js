import { HttpClient } from "jack-one-script";
import { MessageCenter, MessageType } from "../MessageCenter";
import { RealName } from "../pages/My/RealName";
import { removeCache, getCache, setCache } from "../GlobalFunc";
;
var ApiHelper = /** @class */ (function () {
    function ApiHelper() {
    }
    Object.defineProperty(ApiHelper, "webFolder", {
        get: function () {
            var p = getCache("_webFolder");
            if (p)
                return p;
            return "web2";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApiHelper, "longitude", {
        /**经度*/
        get: function () {
            var v = parseFloat(getCache("longitude"));
            if (isNaN(v) || !v)
                v = 0;
            return v;
        },
        set: function (v) {
            setCache("longitude", v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApiHelper, "IsFromAppStoreApp", {
        /**是否是app store转换过来的环境*/
        get: function () {
            if (!window.api)
                return false;
            var appstore = window.api.readFile({
                path: 'fs://' + ApiHelper.webFolder + '/appstore.txt',
                sync: true
            });
            if (appstore)
                return true;
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApiHelper, "latitude", {
        /**纬度*/
        get: function () {
            var v = parseFloat(getCache("latitude"));
            if (isNaN(v) || !v)
                v = 0;
            return v;
        },
        set: function (v) {
            setCache("latitude", v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApiHelper, "CurrentTokenInfo", {
        /**当前用户的token信息 */
        get: function () {
            if (!ApiHelper._CurrentTokenInfo) {
                var tokenStr = getCache("CurrentTokenInfo");
                if (tokenStr) {
                    eval("tokenStr=" + tokenStr);
                    ApiHelper._CurrentTokenInfo = tokenStr;
                }
            }
            return ApiHelper._CurrentTokenInfo;
        },
        set: function (v) {
            ApiHelper._CurrentTokenInfo = v;
            if (!v) {
                removeCache("CurrentTokenInfo");
                MessageCenter.raise(MessageType.Logout, null);
            }
            else {
                if (getCache("UseFinger") === "1") {
                    setCache("FingerInfo", v.refresh_token);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApiHelper, "isRunningInApiCloudLocal", {
        /**当前代码是否是在apicloud本地允许（不是放在自己服务器上） */
        get: function () {
            if (!window.api)
                return false;
            if (window.api.pageParam.folder)
                return true;
            return false;
        },
        enumerable: true,
        configurable: true
    });
    ApiHelper.getDescription = function (symbol) {
        if (!ApiHelper.Descriptions)
            return null;
        for (var i = 0; i < ApiHelper.Descriptions.length; i++) {
            if (ApiHelper.Descriptions[i].symbol === symbol)
                return ApiHelper.Descriptions[i];
        }
        return null;
    };
    ApiHelper.getDescriptionByMarketSymbol = function (marketsymbol) {
        if (!ApiHelper.Descriptions)
            return null;
        for (var i = 0; i < ApiHelper.Descriptions.length; i++) {
            if (ApiHelper.Descriptions[i].marketsymbol === marketsymbol)
                return ApiHelper.Descriptions[i];
        }
        return null;
    };
    ApiHelper.getDescriptionByList = function (symbol, commodities) {
        for (var i = 0; i < commodities.length; i++) {
            if (commodities[i].symbol === symbol)
                return commodities[i];
        }
        return null;
    };
    /**
     * 记录日志
     * @param component
     * @param info
     * @param callback
     */
    ApiHelper.Log = function (component, info, callback) {
        var url = ApiHelper.ServerAddress + "/api/BasicsInfo/Log";
        HttpClient.postJson({
            data: {
                info: info,
                channelId: ApiHelper.ChannelId,
                deviceType: 1
            },
            component: component,
            url: url,
            callback: function (ret, err) {
                if (err) {
                    callback(null, err);
                }
                else {
                    callback(true, null);
                }
            },
        });
    };
    /**判断当前是否是模拟交易模式 */
    ApiHelper.isDemoMode = function () {
        return ApiHelper.UrlAddresses.currentUrls === ApiHelper.UrlAddresses.demoApiUrls;
    };
    /**系统初始化 */
    ApiHelper.Init = function () {
        if (ApiHelper.UrlAddressReady)
            return;
        var url = ApiHelper.ServerAddress + "/api/BasicsInfo/GetBasicsInfo";
        HttpClient.send({
            method: "GET",
            url: url,
            async: true,
            callback: function (ret, err) {
                if (err) {
                    //如果失败，继续访问
                    setTimeout(function () { return ApiHelper.Init(); }, 1000);
                }
                else {
                    var p;
                    eval("p=" + ret);
                    ApiHelper.UrlAddresses = p;
                    for (var item in ApiHelper.UrlAddresses.apiUrls) {
                        var value = ApiHelper.UrlAddresses.apiUrls[item];
                        if (value && value.lastIndexOf("/") === value.length - 1)
                            ApiHelper.UrlAddresses.apiUrls[item] = value.substr(0, value.length - 1);
                    }
                    for (var item in ApiHelper.UrlAddresses.demoApiUrls) {
                        var value = ApiHelper.UrlAddresses.demoApiUrls[item];
                        if (value && value.lastIndexOf("/") === value.length - 1)
                            ApiHelper.UrlAddresses.demoApiUrls[item] = value.substr(0, value.length - 1);
                    }
                    console.debug(ApiHelper.UrlAddresses);
                    ApiHelper.ResourceAddress = ApiHelper.UrlAddresses.apiUrls.appDownLoadUrl;
                    if (ApiHelper.ResourceAddress.endsWith("/")) {
                        ApiHelper.ResourceAddress += "app_bitwin";
                    }
                    else {
                        ApiHelper.ResourceAddress += "/app_bitwin";
                    }
                    console.log("ResourceAddress:" + ApiHelper.ResourceAddress);
                    ApiHelper.UrlAddresses.currentUrls = ApiHelper.UrlAddresses.apiUrls;
                    ApiHelper.UrlAddressReady = true;
                    console.log("ApiHelper 初始化成功");
                    if (ApiHelper.IsDemoMode) {
                        ApiHelper.UrlAddresses.currentUrls = ApiHelper.UrlAddresses.demoApiUrls;
                    }
                }
            }
        });
    };
    /**检查实名状态，没有实名，会直接跳实名认证窗口 */
    ApiHelper.checkCertificationStatus = function () {
        if (ApiHelper.CurrentTokenInfo && ApiHelper.CurrentTokenInfo.certificationstatus == CertificationStatus.CertificationAuditing) {
            alert(textRes.items['实名认证正在审核']);
            return false;
        }
        if (ApiHelper.CurrentTokenInfo && ApiHelper.CurrentTokenInfo.certificationstatus != CertificationStatus.CertificationSuccess) {
            alert(textRes.items['提示实名认证']);
            navigation.push(new RealName());
            return false;
        }
        return true;
    };
    ApiHelper.openUrl = function (url) {
        //iOS中的使用方法如下：
        if (isIOS) {
            window.api.openApp({
                iosUrl: url,
            });
        }
        else {
            //Android中的使用方法如下：
            window.api.openApp({
                androidPkg: 'android.intent.action.VIEW',
                mimeType: 'text/html',
                uri: url
            });
        }
    };
    /**接口地址是否已经获取完毕 */
    ApiHelper.UrlAddressReady = false;
    ApiHelper.ChannelId = 1;
    ApiHelper.ServerAddress = "http://basiscinfo.bitcoinwin.io:10008";
    ApiHelper.OTCSecret = "WQ8YaExjy7DRDMEhkU1Mwxg4lgwMe4yG6Y6c";
    /**是否是应付app store的模式*/
    ApiHelper.IsDemoMode = false;
    ApiHelper.MainColor = "#ea3031";
    ApiHelper.ClientId = "upushapp";
    ApiHelper.ClientSecret = "secret";
    ApiHelper.PayCenterAppId = "10001";
    /**是否正在刷新token*/
    ApiHelper.RefreshingToken = 0;
    ApiHelper.SupportedPayChannels = [
        //{
        //    name: "Citpay",
        //    id: 5,
        //    channel: 5,
        //    limit: "200-7000",
        //    supportedCurrencies: ["USDT"],
        //    supportAlipay: false,
        //    supportWx: false,
        //    supportBank: true,
        //    pushUSDT: true,
        //},
        {
            name: "OTC",
            id: 1,
            channel: 1,
            limit: "200-7000",
            supportedCurrencies: ["USDT"],
            supportAlipay: false,
            supportWx: false,
            supportBank: true,
            pushUSDT: true,
        },
    ];
    ApiHelper.UrlAddresses = {
        "apiUrls": {
            "accountUrl": "https://bitcoinwin.chainpayworld.com/account",
            "marketUrl": "https://bitcoinwin.chainpayworld.com/market",
            "tradeUrl": "https://bitcoinwin.chainpayworld.com/trade",
            "mexUrl": "",
            "marketWS": "wss://bitcoinwin.chainpayworld.com/marketws/tickdata",
            "h5Url": "",
            "ctcUrl": "",
            "playUrl": "",
            "accountCenterUrl": "https://bitcoinwin.chainpayworld.com/accountcenter",
            "payCenterUrl": "https://bitcoinwin.chainpayworld.com/payment",
            "appDownLoadUrl": "",
            "indexUrl": "https://bitcoinwin.chainpayworld.com/index"
        },
        "demoApiUrls": {
            "accountUrl": "https://bitcoinwin.chainpayworld.com/account",
            "marketUrl": "https://bitcoinwin.chainpayworld.com/market",
            "tradeUrl": "https://bitcoinwin.chainpayworld.com/demotrade",
            "mexUrl": "",
            "marketWS": "wss://bitcoinwin.chainpayworld.com/marketws/tickdata",
            "h5Url": "",
            "ctcUrl": "",
            "playUrl": "",
            "accountCenterUrl": "https://bitcoinwin.chainpayworld.com/accountcenter",
            "payCenterUrl": "https://bitcoinwin.chainpayworld.com/payment",
            "appDownLoadUrl": "",
            "indexUrl": "https://bitcoinwin.chainpayworld.com/index"
        },
        "currentUrls": {
            "accountUrl": "",
            "marketUrl": "",
            "tradeUrl": "",
            "mexUrl": "",
            "marketWS": "",
            "h5Url": "",
            "ctcUrl": "",
            "playUrl": "",
            "accountCenterUrl": "",
            "payCenterUrl": "",
            "appDownLoadUrl": "",
            "indexUrl": ""
        }
    };
    return ApiHelper;
}());
export { ApiHelper };
export var CertificationStatus;
(function (CertificationStatus) {
    /// <summary>
    /// 未认证
    /// </summary>
    CertificationStatus[CertificationStatus["Uncertified"] = 10] = "Uncertified";
    /// <summary>
    /// 认证审核中
    /// </summary>
    CertificationStatus[CertificationStatus["CertificationAuditing"] = 20] = "CertificationAuditing";
    /// <summary>
    /// 认证成功
    /// </summary>
    CertificationStatus[CertificationStatus["CertificationSuccess"] = 30] = "CertificationSuccess";
    /// <summary>
    /// 认证失败
    /// </summary>
    CertificationStatus[CertificationStatus["CertificationFail"] = 40] = "CertificationFail";
})(CertificationStatus || (CertificationStatus = {}));
var TokenInfo = /** @class */ (function () {
    function TokenInfo() {
    }
    return TokenInfo;
}());
export { TokenInfo };
var ServerResult = /** @class */ (function () {
    function ServerResult() {
    }
    return ServerResult;
}());
export { ServerResult };
//# sourceMappingURL=ApiHelper.js.map