import { ApiHelper, ServerResult, CertificationStatus } from "./ApiHelper";
import { HttpClient } from "jack-one-script";
import { IHttpClientUsing } from "jack-one-script";
import { MessageCenter, MessageType } from "../MessageCenter";
import { md5, setCache } from "../GlobalFunc";
import { BaseComponent } from "../BaseComponent";

export enum UserMessageType {
    /**用户消息 */
    UserMsg = 1,
    /**活动消息 */
    ActivityMsg = 2,
    /**系统消息 */
    SystemMsg = 3
};
export interface CreditFlowItem {

    id: number;
    /**类型 */
    opType: number;
    /**创建时间 */
    createTime: string;
    /**余额 */
    canuseCreditMoney: number;
    /**金额 */
    amount: number;

    typeObj?: any;
};
export interface DistributionIncomeItem {
    amount: number;
    fundAccountId: number;
    incomeDate: string;
};
export interface RepaymentItem {
    /**还需还款金额 */
    amount: number;
    /**借款时间 UTC格式的时间 */
    borrowingTime: string;
    id: number;
    /**利息 */
    interestAmount: number;
    /**免息时间 UTC格式的时间 */
    interestFreeTime: string;
    /**逾期天数 */
    overdueDay: number;
    /**状态 30表示已经还款*/
    repaymentStatus: number;

    /**是否是紧急需要还款的，这个属性由程序计算得来 */
    urgent: boolean;
    extData: any;
};

export interface CreditInfoItem {
    "coin": string;
    "coinNum": number;
    "rate": number;
    "approximatelyUSDT": number;
};
export interface CreditInfo {
    /**已用信用资金 */
    "frozenCreditMoney": number;
    /**总信用资金 */
    "totalCreditMoney": number;
    /**可用信用资金 */
    "canuseCreditMoney": number;
    /**逾期天数 */
    "overdueDayNum": number;
    /**逾期利息利率 */
    "overdueInterestRate": number;
    /** */
    "items": CreditInfoItem[];
};

export interface TradeAssetsInfo {
    /**可用金额 */
    "canusedAmount": number;
    /**自有资产 */
    "frozenAssets": number;
    /**借款 */
    "loanAmount": number;
    /**余额宝 */
    "balanceTreasure": {
        /**总收益 */
        "totalIncome": 0,
        /**累计收益 */
        "accumulatedIncome": 329.9182,
        /**待结算 */
        "settlementIncome": 0,
        /**昨日总收益 */
        "yesterdayTotalIncome": 4.1844,
        /**余额收益 */
        "balanceIncome": 0,
        /**余额年化 */
        "balanceAnnual": 16,
        /**保证金收益 */
        "marginIncome": 0,
        /**保证金年化 */
        "marginAnnual": 25,
        /**信用资本收益 */
        "creditAccountIncome": 0,
        /**信用年化 */
        "creditAccountAnnual": 0
    },
    /**分销收益 */
    "distributionIncome": {
        /**总收益 */
        "totalIncome": 0,
        /**可用邀请好友收益 */
        "canusedInviteFriendsIncome": 0,
        /**可用好友分享获赠收益 */
        "canusedFriendsShareGiftsIncome": 0,
        /**累计邀请好友收益 */
        "accumulatedInviteFriendsIncome": 0,
        /**累计好友邀请获赠收益 */
        "accumulatedFriendsShareGiftsIncome": 0,
        /**累计收益 */
        "accumulatedIncome": 0,
        /**待结算 */
        "settlementIncome": 0,
        /**昨日收益 */
        "yesterdayTotalIncome": 0,
        /**邀请好友收益 */
        "inviteFriendsIncome": 0,
        /**好友分享获赠 */
        "friendsShareGiftsIncome": 0,
        /**邀请好友收益年化 */
        "inviteFriendsAnnual": 3,
        /**好友分享获赠年化 */
        "friendsShareGiftsAnnual": 1,
        /**好友邀请交易返佣比例 */
        "inviteFriendsCommissionRate": 0,
        /**好友分享获赠交易返佣比例 */
        "friendsShareGiftsCommissionRate": 0,
        /**邀请好友交易返佣收益 */
        "inviteFriendsTradeCommissionIncome": 0,
        /**好友分享交易返佣收益 */
        "friendsShareTradeCommissionIncome": 0,
        /**昨日收益入金奖励金额 */
        "firstDepositGiveMoney": 0,
        /**昨日邀请好友收益数量 */
        "inviteFriendsCount": 0,
        /**好友分享获赠收益数量 */
        "friendsShareGiftsCount": 0
    }
};

export interface BuyRequest {
    CorderId: string;
    Language: string;
    Currency: string;
    Token: string;
    PayChannel: number;
    Stamp: number;
    ProductId: string;
    Price: number;
    Amount: number;
    PayAmount: any;
    ChannelId: any;
    AppId: string;
    Ext: string;
};

export enum AccountType {
    /**银行卡 */
    Bank = 2,
    /**EPay */
    EPay = 4,
};

export interface PayoutBank {

    bankName: string;
    bankNo: string;
    bankType: number;
    coinAddress: string;
    id: number;
    openBank: string;
    realName: string;
}

export class Bank {//{id: 1, bankCode: "CDB", bankName: "国家开发银行", bankAbbr: "国家开发银行", organizationCode: null}
    id: number;
    bankCode: string;
    bankName: string;
    bankAbbr: string;
    organizationCode: any;
}

export class MessageItem {
    msgType: number;
    id: number;
    title: string;
    createTime: string;
    /**0:unread 1:readed */
    status: number;

    /**这个属性在列表中是没有的 */
    content: string;
};

function jwtToBase64(content) {
    while (content.indexOf("-") >= 0)
        content = content.replace("-", "+");

    while (content.indexOf("_") >= 0)
        content = content.replace("_", "/");

    switch (content.length % 4) {
        case 0:
            // No pad chars in this case
            break;
        case 2:
            // Two pad chars
            content += "==";
            break;
        case 3:
            // One pad char
            content += "=";
            break;
        default:
            throw new Error("error");
    }
    return content;
}

export class AccountInfo {
    /**是否是vip，（由程序计算出来） */
    "isVip" = false;
    "accountMoneyInfo" =
        {
            "fundaccountid": 8000011,
            "currenttype": "USDT",
            "frozenmargin": 0.0,
            "amount": 10000.0,
            /**余额 */
            "canusedamount": 10000.0,
            "tradefee": 0.0,
            "totalamount": 0.0,
            "totalprofit": 0.0,
            "frozenamount": 0.0,
            "totalinterest": 0.00000000,
            "canusedincome": 0.00000000,
            "frozenincome": 0.00000000,
            "accumulatedincome": 0.00000000,
            "accumulatedinterestincome": 196.75440000,
            "totalfriendcount": 0,
            "yesterdayinterest": 4.14540000,
            "realnamestatus": 0,
            "issetpassword": false,
            "minwithdrawcoinNum": 20.0,
            "withdrawcoinpoundagenum": 20.0,
            "minwithdrawcashmoney": 40.0,
            "withdrawcashpoundageratio": 0.01,
            "payminamount": 20.0,
            /**app的注册url */
            "registerurl": "http://biyinbasicsinfoapi.upush.world/app_share/index.html?channelid=2&proxyid=6&fundpid=8000011",
            /**是否有红包 */
            "isreceiveredenvelope": false,
            /**bb提现最大金额*/
            "bbmaxwithdrawcoinnum":0,
            "accumulatedGiveMoney": 0.00000000,
            "accumulatedProxyInterestIncome": 0.00000000,
            "accumulatedDistributionTradeIncome": 0.00,
            /**一级分销比例 */
            "firstCommissionRate": 0.0,
            /**二级分销比例 */
            "secondCommissionRate": 0.0,
            "distributionFirstTradeCommission": 0,
            "distributionSecondTradeCommission": 0,
            "userRuleGroupId": 0,
            /**是否允许跟单*/
            "isAllowDocumentary": false,
            /**是否跟单*/
            "isDocumentary": false,
            "isTrue":false,
        }
}

export class AccountApi {

    static async Login(component: IHttpClientUsing, username: string, pwd: string, autologin: boolean): Promise<void> {
        if (!ApiHelper.UrlAddressReady) {            
            return new Promise((resolve, reject) => {
                setTimeout(async () => {
                    try {
                        await AccountApi.Login(component, username, pwd, autologin);
                        resolve();
                    }
                    catch (e) {
                        reject(e);
                    }
                }, 1000);
            });
        }

        return new Promise(async (resolve, reject) => {
            try {
                var isIos = false;
                if ((<any>window).api)
                    ((<any>window).api).systemType == 'ios';

                var dict = {
                    channelId: ApiHelper.ChannelId,
                    client_id: ApiHelper.ClientId,
                    client_secret: ApiHelper.ClientSecret,
                    grant_type: "password",
                    username: username,
                    password: pwd,
                    deviceType: isIos ? 1 : 2
                };
                console.log(JSON.stringify(dict));

                var url = `${ApiHelper.UrlAddresses.apiUrls.accountUrl}/api/Userinfo/GetToken`;
                console.log(url);

                var ret = await HttpClient.postJsonAsync({
                    data: dict,
                    url: url,
                    component: component
                });

                var obj: ServerResult;
                eval("obj=" + ret);
                if (obj.code != 200) {
                    reject(obj);
                }
                else {
                    eval("obj=" + obj.data);
                    ApiHelper.CurrentTokenInfo = <any>obj;
                    ApiHelper.CurrentTokenInfo.expires_time = new Date().getTime() + ApiHelper.CurrentTokenInfo.expires_in * 1000;

                    var a1 = jwtToBase64(ApiHelper.CurrentTokenInfo.access_token.split('.')[1]);
                    a1 = new Buffer(a1, 'base64').toString();
                    console.debug(a1);

                    var tokenObj;
                    eval("tokenObj=" + a1);

                    ApiHelper.CurrentTokenInfo.phone_number = tokenObj.phone_number;
                    ApiHelper.CurrentTokenInfo.realname = tokenObj.realname;
                    ApiHelper.CurrentTokenInfo.certificationstatus = tokenObj.certificationstatus;
                    ApiHelper.CurrentTokenInfo.autologin = autologin;

                    if ((<any>window).api) {
                        (<any>window).api.sendEvent({
                            name: 'Logined',
                            extra: { tokenStr : JSON.stringify(ApiHelper.CurrentTokenInfo) }
                        });
                    }
                    if (!window.api) {
                        //如果是apicloud，那么会从Main.lookupLogin触发这个事件，放在那里，因为hideFrame的登录事件也能catch到
                        MessageCenter.raise(MessageType.Logined, null);
                    }

                    resolve();
                }
            }
            catch (e) {
                reject(e);
            }
        });
    }

    /**
     * 
     * @param component
     * @param WalletAddressType
     * @param Coin BTC USDT ETH
     * @param Code ERC20_USDT  OMNI_USDT
     * @param PaySource 2:信用资产 1：普通充值
     */
    static async GetCoinAddress(component: IHttpClientUsing, WalletAddressType, Coin, Code,PaySource): Promise<string> {
        if (!ApiHelper.CurrentTokenInfo) {
            throw { status: 401 };
        }

        return new Promise(async (resolve, reject) => {
            try {
                var dict = {
                    WalletAddressType,
                    Coin,
                    Code,
                    PaySource
                };

                console.log(dict);

                var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Account/GetCoinAddress`;

                var ret = await HttpClient.postJsonAsync({
                    data: dict,
                    component: component,
                    url: url,
                    header: {
                        "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
                    },
                });

                var obj: ServerResult;
                eval("obj=" + ret);
                if (obj.code != 200) {
                    reject(obj);
                }
                else {
                    resolve(obj.data);
                }
            }
            catch (e) {
                reject(e);
            }
        }); 
    }

    /**
     * 开启关闭自动跟单
     * @param component
     * @param isDocumentary
     */
    static async SetIsDocumentary(component: IHttpClientUsing, isDocumentary: boolean): Promise<void> {
        if (!ApiHelper.UrlAddressReady) {
            return new Promise((resolve, reject) => {
                setTimeout(async () => {
                    try {
                        var ret = await AccountApi.SetIsDocumentary(component, isDocumentary);
                        resolve(ret);
                    }
                    catch (e) {
                        reject(e);
                    }
                }, 1000);
            });
        }
        if (!ApiHelper.CurrentTokenInfo) {
            throw { status: 401 };
        }

        return new Promise(async (resolve, reject) => {
            try {
                var dict = {
                    isDocumentary
                };

                var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Account/SetIsDocumentary`;

                var ret = await HttpClient.postJsonAsync({
                    data: dict,
                    component: component,
                    url: url,
                    header: {
                        "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
                    },
                });

                var obj: ServerResult;
                eval("obj=" + ret);
                if (obj.code != 200) {
                    reject(obj);
                }
                else {
                    resolve();
                }
            }
            catch (e) {
                reject(e);
            }
        }); 
    }

    static async RefreshTokenByToken(refreshToken: string, autologin: boolean, cancelIfLogout: boolean = false): Promise<any> {


        if (ApiHelper.RefreshingToken) {
            //正在刷新token，等待结果
            return new Promise((resolve, reject) => {
                setTimeout(async () => {
                    try {
                        await AccountApi.RefreshTokenByToken(refreshToken, autologin, cancelIfLogout);
                        resolve();
                    }
                    catch (e) {
                        reject(e);
                    }
                }, 1000);
            });
        }

        if (!ApiHelper.UrlAddressReady) {
            return new Promise((resolve, reject) => {
                setTimeout(async () => {
                    try {
                        await AccountApi.RefreshTokenByToken(refreshToken, autologin, cancelIfLogout);
                        resolve();
                    }
                    catch (e) {
                        reject(e);
                    }
                }, 1000);
            });
        }

        ApiHelper.RefreshingToken++;
        return new Promise(async (resolve, reject) => {
            try {
                var dict = {
                    channelId: ApiHelper.ChannelId,
                    client_id: ApiHelper.ClientId,
                    client_secret: ApiHelper.ClientSecret,
                    grant_type: "refresh_token",
                    refresh_token: refreshToken,
                };

                var url = `${ApiHelper.UrlAddresses.apiUrls.accountUrl}/api/Userinfo/GetToken`;


                try {
                    var ret = await HttpClient.postJsonAsync({
                        data: dict,
                        url: url,

                    });
                }
                catch (e) {
                    
                    throw e;
                }
                finally {
                    ApiHelper.RefreshingToken--;
                }


                if (cancelIfLogout && ApiHelper.CurrentTokenInfo == null) {
                    reject("已经退出登录，不用再刷新");
                    return;
                }

                var obj: ServerResult;
                eval("obj=" + ret);
                if (obj.code != 200) {
                    
                    reject(obj);
                }
                else {
                    eval("obj=" + obj.data);
                    ApiHelper.CurrentTokenInfo = <any>obj;
                    ApiHelper.CurrentTokenInfo.autologin = autologin;
                    ApiHelper.CurrentTokenInfo.expires_time = new Date().getTime() + ApiHelper.CurrentTokenInfo.expires_in * 1000;

                    var a1 = jwtToBase64(ApiHelper.CurrentTokenInfo.access_token.split('.')[1]);
                    a1 = new Buffer(a1, 'base64').toString();


                    var tokenObj;
                    eval("tokenObj=" + a1);

                    ApiHelper.CurrentTokenInfo.phone_number = tokenObj.phone_number;
                    ApiHelper.CurrentTokenInfo.realname = tokenObj.realname;
                    ApiHelper.CurrentTokenInfo.certificationstatus = tokenObj.certificationstatus;

                    if (autologin) {
                        setCache("CurrentTokenInfo", JSON.stringify(ApiHelper.CurrentTokenInfo));
                    }
                   
                    if ((<any>window).api) {
                        (<any>window).api.sendEvent({
                            name: 'Logined',
                            extra: {
                                tokenStr: JSON.stringify(ApiHelper.CurrentTokenInfo)
                            }
                        });
                    }

                    
                    if (!window.api) {
                        //如果是apicloud，那么会从Main.lookupLogin触发这个事件，放在那里，因为hideFrame的登录事件也能catch到
                        MessageCenter.raise(MessageType.Logined, null);
                    }

                    resolve(obj);
                }
            }
            catch (e) {
                reject(e);
            }
        });
    }

    /**
     * 刷新token
     * @param callback
     */
    static async RefreshToken() : Promise<any> {       

        if (!ApiHelper.CurrentTokenInfo) {
            throw "ApiHelper.CurrentTokenInfo is null";
        }

        return new Promise(async (resolve, reject) => {
            try {
                await AccountApi.RefreshTokenByToken(ApiHelper.CurrentTokenInfo.refresh_token, ApiHelper.CurrentTokenInfo.autologin, true);
            }
            catch (e) {
                if (e.code == 402) {
                    ApiHelper.CurrentTokenInfo = null;
                }
                else if (e.status && e.status == 401) {
                    ApiHelper.CurrentTokenInfo = null;
                }
            }
        });
        
    }

    /**
     * Posts the pay in money
     * @param payinmoney 金额
     * @param payintype 入金类型1=币币，2=法币.
     * @param sourcecurrency 目标币种.
     * @param txId
     * @param callback
     */
    static async PostPayInMoney(component: IHttpClientUsing,payinmoney: number, payintype: number,  sourcecurrency:string,  txId:string,channel):Promise<any> {

        if (!ApiHelper.UrlAddressReady) {
            return new Promise((resolve, reject) => {
                setTimeout(async () => {
                    try {
                        var ret = await AccountApi.PostPayInMoney(component, payinmoney, payintype, sourcecurrency, txId, channel);
                        resolve(ret);
                    }
                    catch (e) {
                        reject(e);
                    }
                }, 1000);
            });
        }
        if (!ApiHelper.CurrentTokenInfo) {
            throw { status: 401 };
        }

        return new Promise(async (resolve, reject) => {
            try {
                var dict = {
                    channelId: ApiHelper.ChannelId,
                    payinmoney: payinmoney,
                    payintype: payintype,
                    channel: channel,
                    sourcecurrency: sourcecurrency,
                    txId: txId,
                };

                var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Account/PostPayInMoney`;

                var ret = await HttpClient.postJsonAsync({
                    data: dict,
                    component: component,
                    url: url,
                    header: {
                        "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
                    },
                });

                var obj: ServerResult;
                eval("obj=" + ret);
                if (obj.code != 200) {
                    reject(obj);
                }
                else {
                    resolve(obj.data);
                }
            }
            catch (e) {
                reject(e);
            }
        });
    }

    
    static async GetAccountInfo(component: IHttpClientUsing): Promise<AccountInfo>{

        if (!ApiHelper.UrlAddressReady) {
            return new Promise((resolve, reject) => {
                setTimeout(async () => {
                    try {
                        var ret = await AccountApi.GetAccountInfo(component);
                        resolve(ret);
                    }
                    catch (e) {
                        reject(e);
                    }
                }, 1000);
            });
        }
       

        return new Promise(async (resolve, reject) => {
            try {
                if (!ApiHelper.CurrentTokenInfo) {

                    reject({ status: 401 });
                }

                var dict = {
                    channelId: ApiHelper.ChannelId,
                };

                var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Account/GetAccountInfo`;

                var ret = await HttpClient.postJsonAsync({
                    data: dict,
                    component: component,
                    url: url,
                    method: "GET",
                    header: {
                        "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
                    },
                });

                var obj: ServerResult;
                eval("obj=" + ret);
                if (obj.code != 200) {
                    reject(obj);
                }
                else {
                    (<AccountInfo>obj.data).isVip = (<AccountInfo>obj.data).accountMoneyInfo.userRuleGroupId > 0;
                    (<AccountInfo>obj.data).accountMoneyInfo.canusedamount = parseFloat(BaseComponent.toFixed((<AccountInfo>obj.data).accountMoneyInfo.canusedamount, 2, true, true));
                    MessageCenter.raise(MessageType.ReceivedAccountInfo, obj.data);
                    console.debug(JSON.stringify(obj.data));
                    resolve(obj.data);
                }
            }
            catch (e) {
                reject(e);
            }
        });
    }

    /**
     * 划转分销收益到可用余额
     * @param component
     * @param amount
     * @param callback
     */
    static async CanusedIncomeTransferCanusedAmount(component: IHttpClientUsing, amount): Promise<AccountInfo> {

        if (!ApiHelper.UrlAddressReady) {
            return new Promise((resolve, reject) => {
                setTimeout(async () => {
                    try {
                        var ret = await AccountApi.CanusedIncomeTransferCanusedAmount(component, amount);
                        resolve(ret);
                    }
                    catch (e) {
                        reject(e);
                    }
                }, 1000);
            });
        }
       

        return new Promise(async (resolve, reject) => {
            try {

                if (!ApiHelper.CurrentTokenInfo) {
                    throw { status: 401 };
                }

                var dict = {
                    amount: amount,
                };
                console.debug("划转金额" + amount);

                var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Account/CanusedIncomeTransferCanusedAmount`;

                var ret = await HttpClient.postJsonAsync({
                    data: dict,
                    component: component,
                    url: url,
                    header: {
                        "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
                    },
                });

                var obj: ServerResult;
                eval("obj=" + ret);
                if (obj.code != 200) {
                    throw obj;
                }
                else {
                    resolve(obj.data);
                }
            }
            catch (e) {
                reject(e);
            }
        });
        
    }

    /**
     * 余额宝划转到余额
     * @param component
     * @param amount
     * @param callback
     */
    static async CanusedInterestTransferCanusedAmount(component: IHttpClientUsing, amount): Promise<AccountInfo> {

        if (!ApiHelper.UrlAddressReady) {

            return new Promise((resolve, reject) => {
                setTimeout(async () => {
                    try {
                        var ret = await AccountApi.CanusedInterestTransferCanusedAmount(component, amount);
                        resolve(ret);
                    }
                    catch (e) {
                        reject(e);
                    }
                }, 1000);
            });
        }
        if (!ApiHelper.CurrentTokenInfo) {
            throw { status: 401 };
        }

        return new Promise(async (resolve, reject) => {
            try {
                var dict = {
                    amount: amount,
                };
                console.debug("划转金额" + amount);

                var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Account/CanusedInterestTransferCanusedAmount`;

                var ret = await HttpClient.postJsonAsync({
                    data: dict,
                    component: component,
                    url: url,
                    header: {
                        "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
                    },
                });

                var obj: ServerResult;
                eval("obj=" + ret);
                if (obj.code != 200) {
                    throw obj;
                }
                else {
                    resolve(obj.data);
                }
            }
            catch (e) {
                reject(e);
            }
        });
    }

    static async SendSetPayPwdSms(component: IHttpClientUsing): Promise<AccountInfo> {
        if (!ApiHelper.UrlAddressReady) {

            return new Promise((resolve, reject) => {
                setTimeout(async () => {
                    try {
                        var ret = await AccountApi.SendSetPayPwdSms(component);
                        resolve(ret);
                    }
                    catch (e) {
                        reject(e);
                    }
                }, 1000);
            });
        }
        if (!ApiHelper.CurrentTokenInfo) {
            throw { status: 401 };
        }

        return new Promise(async (resolve, reject) => {
            try {
                var dict = {
                    smsType: 3,
                    channelId: ApiHelper.ChannelId
                };

                var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Userinfo/SendSetPasswordSmsCode`;

                var ret = await HttpClient.postJsonAsync({
                    data: dict,
                    component: component,
                    url: url,
                    header: {
                        "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
                    },
                });

                var obj: ServerResult;
                eval("obj=" + ret);
                if (obj.code != 200) {
                    throw obj;
                }
                else {
                    resolve(obj.data);
                }
            }
            catch (e) {
                reject(e);
            }
        });
       
    }

    /**
     * 设置支付密码
     * @param component
     * @param password
     * @param smscode
     * @param callback
     */
    static async SetUserPassword(component: IHttpClientUsing, password, smsCode): Promise<AccountInfo>{
        if (!ApiHelper.UrlAddressReady) {

            return new Promise((resolve, reject) => {
                setTimeout(async () => {
                    try {
                        var ret = await AccountApi.SetUserPassword(component, password, smsCode);
                        resolve(ret);
                    }
                    catch (e) {
                        reject(e);
                    }
                }, 1000);
            });
        }
        if (!ApiHelper.CurrentTokenInfo) {
            throw { status: 401 };
        }

        return new Promise(async (resolve, reject) => {
            try {
                var dict = {
                    smsCode: smsCode,
                    password: password,
                    passwordConfirm: password,
                    channelId: ApiHelper.ChannelId
                };

                var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Userinfo/SetUserPassword`;

                var ret = await HttpClient.postJsonAsync({
                    data: dict,
                    component: component,
                    url: url,
                    header: {
                        "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
                    },
                });

                var obj: ServerResult;
                eval("obj=" + ret);
                if (obj.code != 200) {
                    throw obj;
                }
                else {
                    resolve(obj.data);
                }
            }
            catch (e) {
                reject(e);
            }
        })
    }

    /**
     * 获取未读的消息
     * @param component
     * @param callback
     */
    static async GetUnReadCount(component: IHttpClientUsing): Promise<UnReadInfo> {
        if (!ApiHelper.UrlAddressReady) {

            return new Promise((resolve, reject) => {
                setTimeout(async () => {
                    try {
                        var ret = await AccountApi.GetUnReadCount(component);
                        resolve(ret);
                    }
                    catch (e) {
                        reject(e);
                    }
                }, 1000);
            });
        }
        if (!ApiHelper.CurrentTokenInfo) {
            throw { status: 401 };
        }

        return new Promise(async (resolve, reject) => {
            try {
                var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Userinfo/GetUnReadCount`;

                var ret = await HttpClient.postJsonAsync({
                    method: "GET",
                    component: component,
                    url: url,
                    header: {
                        "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
                    },
                });

                var obj: ServerResult;
                eval("obj=" + ret);
                if (obj.code != 200) {
                    throw obj;
                }
                else {
                    resolve(obj.data);
                }
            }
            catch (e) {
                reject(e);
            }
        });
    }

    /**
     * 获取分销收益列表
     * {
     * "list":[
     * {"amount":0.0001,"distributionname":null,"distributionLevel":1,"incomedate":"2019-05-22T00:00:00+00:00","phone":"18219481581"}
     * ],
     * "totalpage":5,
     * "totalnum":90,
     * "sharefriendincome":0.009,
     * "friendshareincome":0
     * }
     * @param component
     * @param level 1：分享好友获取的收益，2：好友分享的收益
     * @param startdate
     * @param enddate
     * @param page
     * @param pagesize
     * @param callback
     */
    static async GetDistributionIncomeListPageAsync(component: IHttpClientUsing, level, startdate, enddate, page, pagesize ):Promise<any> {
        if (!ApiHelper.UrlAddressReady) {

            return new Promise((resolve, reject) => {
                setTimeout(async () => {
                    try {
                        var ret = await AccountApi.GetDistributionIncomeListPageAsync(component, level, startdate, enddate, page, pagesize);
                        resolve(ret);
                    }
                    catch (e) {
                        reject(e);
                    }
                }, 1000);
            });
        }
        if (!ApiHelper.CurrentTokenInfo) {
            throw { status: 401 };
        }

        return new Promise(async (resolve, reject) => {
            try {
                var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Account/GetDistributionIncomeListPageAsync`;

                var ret = await HttpClient.postJsonAsync({
                    data: {
                        level, startdate, enddate, page, pagesize
                    },
                    component: component,
                    url: url,
                    header: {
                        "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
                    },
                });

                var obj: ServerResult;
                eval("obj=" + ret);
                if (obj.code != 200) {
                    throw obj;
                }
                else {
                    if (!obj.data) {
                        obj.data = {
                            "list": [],
                            "totalpage": 0,
                            "totalnum": 0,
                            "sharefriendincome": 0,
                            "friendshareincome": 0
                        };
                    }

                    resolve(obj.data);
                }
            }
            catch (e) {
                reject(e);
            }
        });
    }

    /**
     * 余额宝每日利息收益汇总
     * @param component
     * @param type 1=保证金，2=余额，3=信用资本
     * @param startdate
     * @param enddate
     * @param page
     * @param pagesize
     * @param callback
     */
    static async GetFundDayBalanceTreasureInterestListPaged(component: IHttpClientUsing, type, startdate, enddate, page, pagesize ) : Promise<any> {
        if (!ApiHelper.UrlAddressReady) {

            return new Promise((resolve, reject) => {
                setTimeout(async () => {
                    try {
                        var ret = await AccountApi.GetFundDayBalanceTreasureInterestListPaged(component, type, startdate, enddate, page, pagesize);
                        resolve(ret);
                    }
                    catch (e) {
                        reject(e);
                    }
                }, 1000);
            });
        }
        if (!ApiHelper.CurrentTokenInfo) {
            throw { status: 401 };
        }

        return new Promise(async (resolve, reject) => {
            try {
                var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Account/GetFundDayBalanceTreasureInterestListPaged`;

                var ret = await HttpClient.sendAsync({
                    method: "GET",
                    data: {
                        type, startdate, enddate, page, pagesize
                    },
                    component: component,
                    url: url,
                    header: {
                        "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
                    },
                });

                var obj: ServerResult;
                eval("obj=" + ret);
                if (obj.code != 200) {
                    throw obj;
                }
                else {

                    resolve(obj.data.items);
                }
            }
            catch (e) {
                reject(e);
            }
        });
    }

    /**
     * 获取银行卡信息
     * @param component
     * @param id
     */
    static async GetPayoutBankModel(component: IHttpClientUsing, id): Promise<PayoutBank> {
        if (!ApiHelper.CurrentTokenInfo) {
            throw { status: 401 };
        }

        return new Promise(async (resolve, reject) => {
            try {
                var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Account/GetPayoutBankModel`;

                var ret = await HttpClient.sendAsync({
                    method: "GET",
                    data: {
                        id
                    },
                    component: component,
                    url: url,
                    header: {
                        "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
                    },
                });

                var obj: ServerResult;
                eval("obj=" + ret);
                if (obj.code != 200) {
                    throw obj;
                }
                else {
                    resolve(obj.data);
                }
            }
            catch (e) {
                reject(e);
            }
        });
    }

    /**
     * 更新银行卡
     * @param component
     * @param item
     */
    static async UpdatePayoutBank(component: IHttpClientUsing, item: PayoutBank): Promise<void> {
        if (!ApiHelper.CurrentTokenInfo) {
            throw { status: 401 };
        }

        return new Promise(async (resolve, reject) => {
            try {
                var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Account/UpdatePayoutBank`;

                var ret = await HttpClient.postJsonAsync({
                    data: {
                        "id": item.id,
                        "realName": item.realName,
                        "accountNumber": item.bankNo,
                        "openBank": item.openBank,
                        "payOuttype": 2,
                        "bankType": item.bankType,
                        "bankName": item.bankName
                    },
                    component: component,
                    url: url,
                    header: {
                        "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
                    },
                });

                var obj: ServerResult;
                eval("obj=" + ret);
                if (obj.code != 200) {
                    throw obj;
                }
                else {
                    resolve();
                }
            }
            catch (e) {
                reject(e);
            }
        });
    }

    /**
     * 删除银行卡
     * @param component
     * @param id
     */
    static async DeletePayoutBank(component: IHttpClientUsing, id): Promise<void> {
        if (!ApiHelper.CurrentTokenInfo) {
            throw { status: 401 };
        }

        return new Promise(async (resolve, reject) => {
            try {
                var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Account/DeletePayoutBank`;

                var ret = await HttpClient.postJsonAsync({
                    data: {
                        id
                    },
                    component: component,
                    url: url,
                    header: {
                        "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
                    },
                });

                var obj: ServerResult;
                eval("obj=" + ret);
                if (obj.code != 200) {
                    throw obj;
                }
                else {
                    resolve();
                }
            }
            catch (e) {
                reject(e);
            }
        });
    }

    /**
     * 余额宝每日利息收益汇总明细
     * @param component
     * @param id
     * @param callback
     */
    static async GetFundDayBalanceTreasureInterestDetail(component: IHttpClientUsing, id ):Promise<any> {
        if (!ApiHelper.UrlAddressReady) {

            return new Promise((resolve, reject) => {
                setTimeout(async () => {
                    try {
                        var ret = await AccountApi.GetFundDayBalanceTreasureInterestDetail(component, id);
                        resolve(ret);
                    }
                    catch (e) {
                        reject(e);
                    }
                }, 1000);
            });
        }
        if (!ApiHelper.CurrentTokenInfo) {
            throw { status: 401 };
        }

        return new Promise(async (resolve, reject) => {
            try {
                var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Account/GetFundDayBalanceTreasureInterestDetail`;

                var ret = await HttpClient.sendAsync({
                    method: "GET",
                    data: {
                        id
                    },
                    component: component,
                    url: url,
                    header: {
                        "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
                    },
                });

                var obj: ServerResult;
                eval("obj=" + ret);
                if (obj.code != 200) {
                    throw obj;
                }
                else {
                    resolve(obj.data);
                }
            }
            catch (e) {
                reject(e);
            }
        });
    }


    /**
     * 设置当前用户的deviceToken
     * @param devicetoken
     */
    static UpdateUserDevice(devicetoken, pushChannel): Promise<void> {
        

        if (!ApiHelper.CurrentTokenInfo) {
            throw { status: 401 };
        }

        return new Promise(async (resolve, reject) => {
            try {
                var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Userinfo/UpdateUserDevice`;

                var ret = await HttpClient.postJsonAsync({
                    data: {
                        devicetoken,
                        deviceType: isIOS ? 1 : 2,
                        culture: textRes.langName,
                        channelId: ApiHelper.ChannelId,
                        devcieModel: pushChannel,
                        imei: window.api.systemVersion + " " + window.api.appVersion,
                    },
                    url: url,
                    header: {
                        "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
                    },
                });

                var obj: ServerResult;
                eval("obj=" + ret);
                if (obj.code != 200) {
                    throw obj;
                }
                else {
                    resolve();
                }
            }
            catch (e) {
                reject(e);
            }
        });
    }



    /**
     * 邀请收益列表
     * @param component
     * @param StartDate
     * @param EndDate
     * @param Page
     * @param PageSize
     * @param callback
     */
    static GetTotalFundDayDistributionIncomeListPaged(component: IHttpClientUsing, Level, StartDate, EndDate, Page, PageSize, callback: (ret: DistributionIncomeItem[], totalIncome, err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => AccountApi.GetTotalFundDayDistributionIncomeListPaged(component, Level, StartDate, EndDate, Page, PageSize, callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, undefined, { status: 401 });
            return;
        }

        var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Account/GetTotalFundDayDistributionIncomeListPaged`;

        HttpClient.send({
            method:"GET",
            data: {
                Level, StartDate, EndDate, Page, PageSize
            },
            component: component,
            url: url,
            header: {
                "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            callback: (ret, err) => {
                if (err) {
                    callback(null, undefined, err);
                }
                else {
                    var obj: ServerResult;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, undefined, obj);
                    }
                    else {
                        console.log(obj);
                        callback(obj.data.items, obj.data.totalIncome, null);
                    }
                }
            },
        });
    }

    /**
     * 邀请收益每日汇总列表
     * @param component
     * @param StartDate
     * @param EndDate
     * @param Page
     * @param PageSize
     * @param callback
     */
    static GetFundDayTotalIncomeListPaged(component: IHttpClientUsing, StartDate, EndDate, Page, PageSize, callback: (ret: DistributionIncomeItem[], totalIncome, err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => AccountApi.GetFundDayTotalIncomeListPaged(component,  StartDate, EndDate, Page, PageSize, callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, undefined,{ status: 401 });
            return;
        }

        var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Account/GetFundDayTotalIncomeListPaged`;

        HttpClient.send({
            method: "GET",
            data: {
                StartDate, EndDate, Page, PageSize
            },
            component: component,
            url: url,
            header: {
                "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            callback: (ret, err) => {
                if (err) {
                    callback(null, undefined , err);
                }
                else {
                    var obj: ServerResult;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, undefined , obj);
                    }
                    else {
                        callback(obj.data.items, obj.data.totalIncome, null);
                    }
                }
            },
        });
    }

    /**
     * 手续费返佣列表
     * @param component
     * @param StartDate
     * @param EndDate
     * @param Page
     * @param PageSize
     * @param callback
     */
    static GetTotalFundDistributionTradeIncomeListPaged(component: IHttpClientUsing, StartDate, EndDate, Page, PageSize, callback: (ret: DistributionIncomeItem[], totalIncome, err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => AccountApi.GetTotalFundDistributionTradeIncomeListPaged(component, StartDate, EndDate, Page, PageSize, callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, undefined,{ status: 401 });
            return;
        }

        var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Account/GetTotalFundDistributionTradeIncomeListPaged`;

        HttpClient.send({
            method: "GET",
            data: {
                StartDate, EndDate, Page, PageSize
            },
            component: component,
            url: url,
            header: {
                "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            callback: (ret, err) => {
                if (err) {
                    callback(null, undefined, err);
                }
                else {
                    var obj: ServerResult;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, undefined, obj);
                    }
                    else {

                        callback(obj.data.items, obj.data.totalIncome, null);
                    }
                }
            },
        });
    }

    /**
     * 邀请收益详情
     * {
inviteFriendsNum	integer($int32)
邀请好友数量

inviteFriendsAmount	number($double)
邀请好友金额

friendsShareNum	integer($int32)
好友邀请数量

friendsShareAmount	number($double)
好友邀请金额

estimatedSettlementDate	string($date-time)
预计结算日期

}
     * @param component
     * @param Level 级别1=邀请好友，2=好友邀请
     * @param IncomeDate
     * @param callback
     */
    static GetTotalFundDayDistributionIncomeDetail(component: IHttpClientUsing, Level, IncomeDate, callback: (ret, err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => AccountApi.GetTotalFundDayDistributionIncomeDetail(component, Level, IncomeDate, callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }

        var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Account/GetTotalFundDayDistributionIncomeDetail`;

        HttpClient.send({
            method: "GET",
            data: {
                Level, IncomeDate
            },
            component: component,
            url: url,
            header: {
                "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            callback: (ret, err) => {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj: ServerResult;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        callback(obj.data, null);
                    }
                }
            },
        });
    }

    /**
     * 邀请收益每日汇总详细
     * @param component
     * @param id
     * @param callback
     */
    static GetFundDayTotalIncomeDetail(component: IHttpClientUsing,id, callback: (ret, err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => AccountApi.GetFundDayTotalIncomeDetail(component,id, callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }

        var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Account/GetFundDayTotalIncomeDetail`;

        HttpClient.send({
            method: "GET",
            data: {
                id
            },
            component: component,
            url: url,
            header: {
                "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            callback: (ret, err) => {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj: ServerResult;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        callback(obj.data, null);
                    }
                }
            },
        });
    }

    /**
     * 领取红包
     * @param component
     * @param callback
     */
    static ReceiveRedEnvelope(component: IHttpClientUsing,callback: (ret, err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => AccountApi.ReceiveRedEnvelope(component, callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }

        var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Account/ReceiveRedEnvelope`;

        HttpClient.postJson({
            data: {},
            component: component,
            url: url,
            header: {
                "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            callback: (ret, err) => {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj: ServerResult;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        callback(obj.data, null);
                    }
                }
            },
        });
    }

    /**
     * 好友列表
     * @param component
     * @param level 1:我的好友 2：好友的好友
     * @param page
     * @param pagesize
     * @param callback
     */
    static GetGoodFriendListPageAsync(component: IHttpClientUsing,level,page,pagesize, callback: (ret, err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => AccountApi.GetGoodFriendListPageAsync(component, level, page, pagesize, callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }

        var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Account/GetGoodFriendListPageAsync`;

        HttpClient.postJson({
            data: { level, page, pagesize},
            component: component,
            url: url,
            header: {
                "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            callback: (ret, err) => {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj: ServerResult;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        if (!obj.data || !obj.data.list) {
                            callback([], null);
                        }
                        else {
                            callback(obj.data.list, null);
                        }
                    }
                }
            },
        });
    }


    /**
     * 资金明细列表
     * @param component
     * @param biztype
     * @param page
     * @param pagesize
     * @param startdate
     * @param enddate
     * @param callback
     */
    static GetFundAccountMoneyFlowList(component: IHttpClientUsing, biztype, startdate, enddate, page, pagesize, callback: (ret, totalIncome,err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => AccountApi.GetFundAccountMoneyFlowList(component, biztype, startdate, enddate, page, pagesize, callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, undefined,{ status: 401 });
            return;
        }

        var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Account/GetFundAccountMoneyFlowList`;

        HttpClient.send({
            method:"GET",
            data: {
                channelId: ApiHelper.ChannelId,
                biztype, page, pagesize, startdate, enddate
            },
            component: component,
            url: url,
            header: {
                "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            callback: (ret, err) => {
                if (err) {
                    callback(null, undefined,err);
                }
                else {
                    var obj: ServerResult;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, undefined, obj);
                    }
                    else {
                        (<any[]>obj.data.list).forEach(m => {
                            if (m.extdata)
                                m.extData = JSON.parse(m.extdata);

                            if (!m.extData)
                                m.extData = {};
                        });
                        callback(obj.data.list, obj.data.totalincome, null);
                    }
                }
            },
        });
    }


    static GetUserMessageList(component: IHttpClientUsing, msgtype: UserMessageType, page, pageSize, callback: (ret: MessageItem[], err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => AccountApi.GetUserMessageList(component, msgtype,page,pageSize, callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }

        var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Userinfo/GetUserMessageList`;

        HttpClient.send({
            method: "GET",
            data: {
                msgType: msgtype,
                page: page,
                pageSize: pageSize,
            },
            component: component,
            url: url,
            header: {
                "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            callback: (ret, err) => {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj: ServerResult;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        //console.log(JSON.stringify(obj.data));
                        callback(obj.data.items, null);
                    }
                }
            },
        });
    }

    /**
     * 读取消息内容
     * @param component
     * @param msgid
     * @param callback
     */
    static GetUserMessage(component: IHttpClientUsing, msgid:number, callback: (ret: MessageItem, err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => AccountApi.GetUserMessage(component, msgid, callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }

        var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Userinfo/GetUserMsg`;

        HttpClient.send({
            method: "GET",
            data: {
                msgId: msgid
            },
            component: component,
            url: url,
            header: {
                "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            callback: (ret, err) => {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj: ServerResult;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        callback(obj.data, null);
                    }
                }
            },
        });
    }

    static GetBankList(component: IHttpClientUsing, callback: (ret: Bank[], err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => AccountApi.GetBankList(component, callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }

        var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Account/GetBankList`;

        HttpClient.send({
            method: "GET",
            data: {
                channelId: ApiHelper.ChannelId
            },
            component: component,
            url: url,
            header: {
                "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            callback: (ret, err) => {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj: ServerResult;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        callback(obj.data, null);
                    }
                }
            },
        });
    }


    
    static GetPayoutBanks(component: IHttpClientUsing, callback: (ret: PayoutBank[], err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => AccountApi.GetPayoutBanks(component, callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }

        var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Account/GetPayoutBanks`;

        HttpClient.send({
            method: "GET",
            data: {
                channelId: ApiHelper.ChannelId
            },
            component: component,
            url: url,
            header: {
                "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            callback: (ret, err) => {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj: ServerResult;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        callback(obj.data, null);
                    }
                }
            },
        });
    }

    /**
     * 充值记录
     * @param component
     * @param PaySource 1=普通提现，2=信用提现
     * @param page
     * @param pagesize
     * @param callback
     */
    static GetPayinList(component: IHttpClientUsing,PaySource,page,pagesize, callback: (ret, err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => AccountApi.GetPayinList(component, PaySource , page, pagesize,callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }

        var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Account/GetPayinList`;

        HttpClient.send({
            method: "GET",
            data: {
                channelId: ApiHelper.ChannelId,
                page, pagesize, PaySource
            },
            component: component,
            url: url,
            header: {
                "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            callback: (ret, err) => {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj: ServerResult;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        callback(obj.data.list, null);
                    }
                }
            },
        });
    }

    /**
     * 提现记录
     * @param component
     * @param PaySource 1=普通提现，2=信用提现
     * @param page
     * @param pagesize
     * @param callback
     */
    static GetPayOutList(component: IHttpClientUsing, PaySource , page, pagesize, callback: (ret, err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => AccountApi.GetPayOutList(component, PaySource ,page, pagesize, callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }

        var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Account/GetPayOutList`;

        HttpClient.send({
            method: "GET",
            data: {
                channelId: ApiHelper.ChannelId,
                page, pagesize, PaySource
            },
            component: component,
            url: url,
            header: {
                "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            callback: (ret, err) => {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj: ServerResult;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        callback(obj.data.list, null);
                    }
                }
            },
        });
    }

    /**
     * 添加银行卡
     * @param component
     * @param realName
     * @param accountNumber
     * @param openBank
     * @param bankType
     * @param payOuttype
     * @param bankName
     * @param callback
     */
    static SetCollectMoney(component: IHttpClientUsing, realName, accountNumber, openBank, bankType: AccountType, payOuttype, bankName, callback: (ret, err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => AccountApi.SetCollectMoney(component, realName, accountNumber, openBank, bankType, payOuttype, bankName, callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }

        var dict = {
            realName: realName,
            channelId: ApiHelper.ChannelId,
            accountNumber: accountNumber,
            openBank: openBank,
            bankType: bankType,
            payOuttype: payOuttype,
            bankName: bankName
        };

        var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Account/SetCollectMoney`;

        HttpClient.postJson({
            data: dict,
            component: component,
            url: url,
            header: {
                "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            callback: (ret, err) => {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj: ServerResult;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        callback(obj.data, null);
                    }
                }
            },
        });
    }

    /**
     * 获取指定币种和USDT的汇率
     * @param component
     * @param currency
     * @param callback
     */
    static GetRate(component: IHttpClientUsing,currency, callback: (ret: number, err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => AccountApi.GetRate(component, currency, callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }

        if (currency.indexOf("USDT") >= 0)
            currency = "USDT";

        var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Account/GetRate`;

        HttpClient.send({
            data: {
                currency
            },
            method: "GET",
            component: component,
            url: url,
            header: {
                "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            callback: (ret, err) => {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj: ServerResult;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        callback(obj.data, null);
                    }
                }
            },
        });
    }


    /**
     * 获取信用资本信息
     * @param component
     * @param callback
     */
    static GetCreditInfo(component: IHttpClientUsing, callback: (ret: CreditInfo, err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => AccountApi.GetCreditInfo(component,  callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }

        var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Credit/GetCreditInfo`;

        HttpClient.send({
            method:"GET",
            component: component,
            url: url,
            header: {
                "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            callback: (ret, err) => {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj: ServerResult;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        callback(obj.data, null);
                    }
                }
            },
        });
    }

    /**
     * 信用入金
     * @param component
     * @param payinmoney 入金金额
     * @param payintype 入金类型1=币币，2=法币
     * @param sourcecurrency 支付币种
     * @param txId 币币交易流水号
     * @param channel 支付渠道(1=otc365,2=epay,3=旺财)
     * @param currentcurrency 当前币种
     * @param callback
     */
    static async PostCreditPayInMoney(component: IHttpClientUsing, payinmoney, payintype, sourcecurrency, txId, channel, currentcurrency) :Promise<any>{
        if (!ApiHelper.UrlAddressReady) {
            return new Promise((resolve, reject) => {
                setTimeout(async () => {
                    try {
                        var ret = await AccountApi.PostCreditPayInMoney(component, payinmoney, payintype, sourcecurrency, txId, channel, currentcurrency);
                        resolve(ret);
                    }
                    catch (e) {
                        reject(e);
                    }
                }, 1000);
            });
        }
        if (!ApiHelper.CurrentTokenInfo) {
            throw { status: 401 };
        }

        return new Promise(async (resolve, reject) => {
            try {
                var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Credit/PostCreditPayInMoney`;
                var data = {
                    payinmoney, payintype, sourcecurrency, txId, channel, currentcurrency,
                };


                var ret = await HttpClient.postJsonAsync({
                    data: data,
                    component: component,
                    url: url,
                    header: {
                        "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
                    },
                });

                var obj: ServerResult;
                eval("obj=" + ret);
                if (obj.code != 200) {
                    throw obj;
                }
                else {
                    resolve(obj.data);
                }
            }
            catch (e) {
                reject(e);
            }
        });
    }

    static BuildInMoneyUrl(request: BuyRequest): string {

        var names = Object.keys(request).sort();
        var str = "";
        names.forEach((name) => {
            str += `${name.toLowerCase()}=${request[name]}&`;
        });
        str = str.substr(0, str.length - 1);
        console.log(str);
        var sign = md5(str + ApiHelper.OTCSecret);

        return `${ApiHelper.UrlAddresses.currentUrls.payCenterUrl}/pay/do?${str}&Sign=${sign}`
    }

    /**
     * 信用提现
     * @param component
     * @param collectMoneylId bank account id.
     * @param password 支付密码
     * @param payoutmoney 出金金额
     * @param payouttype 出金类型1=币币，2=法币
     * @param coinaddress 币币地址
     * @param channel 支付渠道(1=otc365,2=epay,3=旺财)
     * @param currentcurrency 当前币种
     * @param callback
     */
    static PostCreditOutMoney(component: IHttpClientUsing, collectMoneylId, password, payoutmoney, payouttype, coinaddress, channel, currentcurrency, callback: (ret: string, err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => AccountApi.PostCreditOutMoney(component, collectMoneylId, password, payoutmoney, payouttype, coinaddress, channel, currentcurrency, callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }

        var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Credit/PostCreditOutMoney`;
        var data = {
            collectMoneylId, password, payoutmoney, payouttype, coinaddress, channel, currentcurrency,
        };

        HttpClient.postJson({
            data: data,
            component: component,
            url: url,
            header: {
                "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            callback: (ret, err) => {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj: ServerResult;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        callback(obj.data, null);
                    }
                }
            },
        });
    }

    /**
     * 提现
     * @param component
     * @param collectMoneylId bank account id.
     * @param channel 支付渠道(1=otc365,2=epay,3=旺财)
     * @param password
     * @param payoutmoney
     * @param payouttype 出金类型1=币币，2=法币.
     * @param coinaddress
     * @param callback
     */
    static PostOutMoney(component: IHttpClientUsing,  collectMoneylId,  channel,  password,  payoutmoney,  payouttype, coinaddress, callback: (ret: string, err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => AccountApi.PostOutMoney(component, collectMoneylId, channel, password, payoutmoney, payouttype, coinaddress, callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }

        var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Account/PostOutMoney`;

        var data = {
            channelId: ApiHelper.ChannelId,
            collectMoneylId, channel, password, payoutmoney, payouttype, coinaddress
        };

        HttpClient.postJson({
            data: data,
            component: component,
            url: url,
            header: {
                "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            callback: (ret, err) => {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj: ServerResult;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        callback(obj.data, null);
                    }
                }
            },
        });
    }

    /**
     * 信用借款
     * @param component
     * @param borrowMoney 借款金额
     * @param callback
     */
    static BorrowCreditMoney(component: IHttpClientUsing, borrowMoney, callback: (ret: string, err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => AccountApi.BorrowCreditMoney(component, borrowMoney, callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }

        var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Credit/BorrowCreditMoney`;
        var data = {
            borrowMoney
        };

        HttpClient.postJson({
            data: data,
            component: component,
            url: url,
            header: {
                "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            callback: (ret, err) => {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj: ServerResult;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        callback(obj.data, null);
                    }
                }
            },
        });
    }

    /**
     * 信用还款
     * @param component
     * @param returnType 还款类型1=余额还款，2=数字币还款
     * @param password 支付密码
     * @param loanId 借款ID
     * @param coin 还款币种
     * @param returnMoney 还款金额
     * @param callback
     */
    static ReturnCreditMoney(component: IHttpClientUsing, returnType, password, loanId, coin, returnMoney, callback: (ret: string, err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => AccountApi.ReturnCreditMoney(component, returnType, password, loanId, coin, returnMoney, callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }

        var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Credit/ReturnCreditMoney`;
        var data = {
            returnType, password, loanId, coin, returnMoney
        };

        HttpClient.postJson({
            data: data,
            component: component,
            url: url,
            header: {
                "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            callback: (ret, err) => {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj: ServerResult;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        callback(obj.data, null);
                    }
                }
            },
        });
    }

    /**
     * 还款列表
     * @param component
     * @param Page
     * @param PageSize
     * @param callback
     */
    static GetRepaymentList(component: IHttpClientUsing, Page, PageSize, callback: (ret: RepaymentItem[], err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => AccountApi.GetRepaymentList(component, Page, PageSize, callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }

        var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Credit/GetRepaymentList`;
        var data = {
            Page, PageSize,
            channelId: ApiHelper.ChannelId
        };

        HttpClient.send({
            data: data,
            method:"GET",
            component: component,
            url: url,
            header: {
                "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            callback: (ret, err) => {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj: ServerResult;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        (<RepaymentItem[]>obj.data.items).forEach(m => {
                            if (m.extData)
                                m.extData = JSON.parse(m.extData);
                            if (!m.extData)
                                m.extData = {};
                        });
                        callback(obj.data.items, null);
                    }
                }
            },
        });
    }

    /**
     * 信用操作记录
     * @param component
     * @param OpType (可以是数组) 操作类型1=借用信用金额,2=还信用金额,3=充值,4=提现,5=数字货币还款
     * @param StartDate
     * @param EndDate
     * @param Page
     * @param PageSize
     * @param callback
     */
    static GetUserCoinFlowList(component: IHttpClientUsing, OpType, StartDate, EndDate, Page, PageSize, callback: (ret: CreditFlowItem[], err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => AccountApi.GetUserCoinFlowList(component, OpType, StartDate, EndDate, Page, PageSize, callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }

        var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Credit/GetUserCoinFlowList`;
        var data = {
            OpType, StartDate, EndDate, Page, PageSize,
        };
        //console.log(JSON.stringify(data));
        HttpClient.send({
            data: data,
            method: "GET",
            component: component,
            url: url,
            header: {
                "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            callback: (ret, err) => {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj: ServerResult;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        for (var i = 0; i < obj.data.items.length; i++) {
                            var item = obj.data.items[i];
                            if (item.extData) {
                                item.extData = JSON.parse(item.extData);
                            }
                        }
                        callback(obj.data.items, null);
                    }
                }
            },
        });
    }

    /**
     * 信用操作详情
     * @param component
     * @param id
     * @param callback
     */
    static GetUserCoinFlowDetail(component: IHttpClientUsing, id, callback: (ret, err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => AccountApi.GetUserCoinFlowDetail(component, id, callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }

        var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Credit/GetUserCoinFlowDetail`;
        var data = {
            id
        };

        HttpClient.send({
            data: data,
            method: "GET",
            component: component,
            url: url,
            header: {
                "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            callback: (ret, err) => {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj: ServerResult;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        if (obj.data.extData)
                            obj.data.extData = JSON.parse(obj.data.extData);
                        if (!obj.data.extData)
                            obj.data.extData = {};

                        callback(obj.data, null);
                    }
                }
            },
        });
    }

    /**
     * 充值详情
     * @param component
     * @param id
     * @param callback
     */
    static GetPayDetail(component: IHttpClientUsing, id, callback: (ret: string, err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => AccountApi.GetPayDetail(component, id, callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }

        var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Credit/GetPayDetail`;
        var data = {
            id
        };

        HttpClient.send({
            data: data,
            method: "GET",
            component: component,
            url: url,
            header: {
                "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            callback: (ret, err) => {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj: ServerResult;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        callback(obj.data, null);
                    }
                }
            },
        });
    }

    /**
     * 提现详情
     * @param component
     * @param id
     * @param callback
     */
    static GetWithdrawalCashDetail(component: IHttpClientUsing, id, callback: (ret: string, err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => AccountApi.GetWithdrawalCashDetail(component, id, callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }

        var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Credit/GetWithdrawalCashDetail`;
        var data = {
            id
        };

        HttpClient.send({
            data: data,
            method: "GET",
            component: component,
            url: url,
            header: {
                "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            callback: (ret, err) => {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj: ServerResult;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        callback(obj.data, null);
                    }
                }
            },
        });
    }

    /**
     * 获取信用利息收益
     * @param component
     * @param StartDate
     * @param EndDate
     * @param Page
     * @param PageSize
     * @param callback
     */
    static GetCreditAssetsDayIncomeList(component: IHttpClientUsing, StartDate, EndDate, Page, PageSize, callback: (ret: string, err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => AccountApi.GetCreditAssetsDayIncomeList(component, StartDate, EndDate, Page, PageSize, callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }

        var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Credit/GetCreditAssetsDayIncomeList`;
        var data = {
            StartDate, EndDate, Page, PageSize
        };

        HttpClient.send({
            data: data,
            method: "GET",
            component: component,
            url: url,
            header: {
                "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            callback: (ret, err) => {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj: ServerResult;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        callback(obj.data, null);
                    }
                }
            },
        });
    }

    /**
     * 获取信用收益详细
     * @param component
     * @param id
     * @param callback
     */
    static GetCreditAssetsDayIncomeDetail(component: IHttpClientUsing, id, callback: (ret: string, err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => AccountApi.GetCreditAssetsDayIncomeDetail(component, id, callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }

        var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Credit/GetCreditAssetsDayIncomeDetail`;
        var data = {
            id
        };

        HttpClient.send({
            data: data,
            method: "GET",
            component: component,
            url: url,
            header: {
                "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            callback: (ret, err) => {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj: ServerResult;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        callback(obj.data, null);
                    }
                }
            },
        });
    }

    /**
     * 交易资产信息
     * @param component
     * @param callback
     */
    static GetTradeAssetsInfo(component: IHttpClientUsing, callback: (ret: TradeAssetsInfo, err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => AccountApi.GetTradeAssetsInfo(component,  callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }

        var url = `${ApiHelper.UrlAddresses.currentUrls.accountUrl}/api/Account/GetTradeAssetsInfo`;

        HttpClient.send({
            method: "GET",
            component: component,
            url: url,
            header: {
                "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            callback: (ret, err) => {

                if (err) {
                    callback(null, err);
                }
                else {
                    var obj: ServerResult;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        callback(obj.data, null);
                    }
                }
            },
        });
    }
}

export interface UnReadInfo {
    "activityUnReadTotal": number;
    "systemUnReadTotal": number;
    "userUnReadTotal": number;
}