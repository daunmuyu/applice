
import { HttpClient } from "jack-one-script";
import { MessageCenter, MessageType } from "../MessageCenter";
import { RealName } from "../pages/My/RealName";
import { IHttpClientUsing } from "jack-one-script";
import { removeCache, getCache, setCache, alertWindow } from "../GlobalFunc";

export interface PayChannel {
    name: string;
    id: number;
    channel: number;
    /**由页面实时获取汇率价格 */
    price?: number;
    limit: string;
    /**支持购买的数字币种 */
    supportedCurrencies: string[];
    supportAlipay: boolean;
    supportWx: boolean;
    supportBank: boolean;
    pushUSDT: boolean;
};

export class ApiHelper {
    /**接口地址是否已经获取完毕 */
    static UrlAddressReady = false;

    static ChannelId = 1;
    static ServerAddress = "http://basiscinfo.bitcoinwin.io:10008";
    static OTCSecret = "WQ8YaExjy7DRDMEhkU1Mwxg4lgwMe4yG6Y6c";

    /**是否是应付app store的模式*/
    static IsDemoMode = false;

    static ResourceAddress: string;
    
    static MainColor = "#ea3031";
    static ClientId = "upushapp";
    static ClientSecret = "secret";
    
    static PayCenterAppId = "10001";
    /**交易的加密密钥 */
    static EncryptKey;
    /**是否正在刷新token*/
    static RefreshingToken = 0;

    static get webFolder() {
        var p = getCache("_webFolder");
        if (p)
            return p;
        return "web2";
    }

    /**经度*/
    static get longitude(): number {
        var v = parseFloat(getCache("longitude"));
        if (isNaN(v) || !v)
            v = 0;
        return v;
    }
    static set longitude(v: number) {
        setCache("longitude", v);
    }

    /**是否是app store转换过来的环境*/
    static get IsFromAppStoreApp(): boolean {
        if (!window.api)
            return false;

        var appstore = window.api.readFile({
            path: 'fs://' + ApiHelper.webFolder + '/appstore.txt',
            sync: true
        });
        if (appstore)
            return true;

        return false;
    }

    /**纬度*/
    static get latitude(): number {
        var v = parseFloat(getCache("latitude"));
        if (isNaN(v) || !v)
            v = 0;
        return v;
    }
    static set latitude(v: number) {
        setCache("latitude", v);
    }

    static CommodityTypes: CommodityType[];
    static Descriptions: Description[];

    static SupportedPayChannels: PayChannel[] = [
        
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
        //{
        //    name: "WangCai",
        //    id: 4,
        //    channel: 3,
        //    limit: "100-2000",
        //    supportedCurrencies: ["USDT", "BTC"],
        //    supportAlipay: false,
        //    supportWx: false,
        //    supportBank: true,
        //    pushUSDT: false,
        //}
    ];

    private static _CurrentTokenInfo: TokenInfo;
    /**当前用户的token信息 */
    static get CurrentTokenInfo() {
        if (!ApiHelper._CurrentTokenInfo) {
            var tokenStr: any = getCache("CurrentTokenInfo");

            if (tokenStr) {
                eval("tokenStr=" + tokenStr);
                ApiHelper._CurrentTokenInfo = tokenStr;
                
            }
        }

        return ApiHelper._CurrentTokenInfo;
    }
    static set CurrentTokenInfo(v: TokenInfo) {
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
    }

    /**当前代码是否是在apicloud本地允许（不是放在自己服务器上） */
    static get isRunningInApiCloudLocal(): boolean {
        if (!(<any>window).api)
            return false;

        if (window.api.pageParam.folder)
            return true;

        return false;
    }

    static getDescription(symbol: string): Description {
        if (!ApiHelper.Descriptions)
            return null;
        for (var i = 0; i < ApiHelper.Descriptions.length; i++) {
            if (ApiHelper.Descriptions[i].symbol === symbol)
                return ApiHelper.Descriptions[i];
        }
        return null;
    }
    static getDescriptionByMarketSymbol(marketsymbol: string): Description {
        if (!ApiHelper.Descriptions)
            return null;
        for (var i = 0; i < ApiHelper.Descriptions.length; i++) {
            if (ApiHelper.Descriptions[i].marketsymbol === marketsymbol)
                return ApiHelper.Descriptions[i];
        }
        return null;
    }
    static getDescriptionByList(symbol: string, commodities: Description[]): Description {
        for (var i = 0; i < commodities.length; i++) {
            if (commodities[i].symbol === symbol)
                return commodities[i];
        }
        return null;
    }

    /**
     * 记录日志
     * @param component
     * @param info
     * @param callback
     */
    static Log(component: IHttpClientUsing, info, callback: (ret, err) => void) {

        var url = `${ApiHelper.ServerAddress}/api/BasicsInfo/Log`;

        HttpClient.postJson({
            data: {
                info,
                channelId: ApiHelper.ChannelId,
                deviceType:1
            },
            component: component,
            url: url,
            callback: (ret, err) => {
                if (err) {
                    callback(null, err);
                }
                else {
                    callback(true, null);
                }
            },
        });
    }

    static UrlAddresses = {
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
            "indexUrl":"https://bitcoinwin.chainpayworld.com/index"
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

    /**判断当前是否是模拟交易模式 */
    static isDemoMode() {
        return ApiHelper.UrlAddresses.currentUrls === ApiHelper.UrlAddresses.demoApiUrls
    }

    /**系统初始化 */
    static Init() {
        if (ApiHelper.UrlAddressReady)
            return;

        var url = `${ApiHelper.ServerAddress}/api/BasicsInfo/GetBasicsInfo`;

        HttpClient.send({
            method: "GET",
            url: url,
            async: true,
            callback: (ret, err) => {
                if (err) {
                    //如果失败，继续访问
                    setTimeout(() => ApiHelper.Init(), 1000);
                }
                else {
                    var p;
                    eval("p=" + ret);
                    ApiHelper.UrlAddresses = p;
                    for (var item in ApiHelper.UrlAddresses.apiUrls) {
                        var value: string = ApiHelper.UrlAddresses.apiUrls[item];
                        if (value && value.lastIndexOf("/") === value.length - 1)
                            ApiHelper.UrlAddresses.apiUrls[item] = value.substr(0, value.length - 1);
                    }
                    for (var item in ApiHelper.UrlAddresses.demoApiUrls) {
                        var value: string = ApiHelper.UrlAddresses.demoApiUrls[item];
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
                    console.log(`ResourceAddress:${ApiHelper.ResourceAddress}`);
                    ApiHelper.UrlAddresses.currentUrls = ApiHelper.UrlAddresses.apiUrls;
                    ApiHelper.UrlAddressReady = true;
                    console.log("ApiHelper 初始化成功");

                    if (ApiHelper.IsDemoMode) {
                        ApiHelper.UrlAddresses.currentUrls = ApiHelper.UrlAddresses.demoApiUrls;
                    }
                }
            }
        });
    }

    /**检查实名状态，没有实名，会直接跳实名认证窗口 */
    static checkCertificationStatus(): boolean {
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
    }

    static openUrl(url: string) {
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
    }
}

export interface CommodityType { commoditytypeid: number; commoditytypename: string; selected: boolean;}
export interface Description {
    closetime: string;
    commoditytype: number;
    contractid: number;
    contractname: string;
    currencytype: string;
    decimalplace: number;
    lasttradingdate: string;
    leverage: number;
    marketsymbol: string;
    perprofit: number;
    perprofitnumber: number;
    symbol: string;
    symbolname: string;
    symbolnameen: string;
    tradetime: string;
    isdemo: boolean;

    bidPrice: number;
    offerPrice: number;
    showPrice: number;
    tradestatus: number;
    status: number;
    updownValue: string;
    isDown: boolean;
    percent: string;

    high: any;
    open: any;
    preClose: any;
    low: any;
}


export enum CertificationStatus {
    /// <summary>
    /// 未认证
    /// </summary>
    Uncertified = 10,
    /// <summary>
    /// 认证审核中
    /// </summary>
    CertificationAuditing = 20,
    /// <summary>
    /// 认证成功
    /// </summary>
    CertificationSuccess = 30,
    /// <summary>
    /// 认证失败
    /// </summary>
    CertificationFail = 40
}

export class TokenInfo {
    error_description: string;

    access_token: string;
    /**过期时间，秒 */
    expires_in: number;
    token_type: string;
    refresh_token: string;

    /**过期时间 */
    expires_time: number;

    /**这个属性是从access_token解码来的 */
    phone_number: string;
    realname: string;
    certificationstatus: CertificationStatus;
    

    autologin: boolean;

}

export class ServerResult {
    code: number;
    msg: string;
    data: any;
}