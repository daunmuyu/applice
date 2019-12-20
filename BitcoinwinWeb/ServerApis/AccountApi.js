var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { ApiHelper } from "./ApiHelper";
import { HttpClient } from "jack-one-script";
import { MessageCenter, MessageType } from "../MessageCenter";
import { md5, setCache } from "../GlobalFunc";
import { BaseComponent } from "../BaseComponent";
export var UserMessageType;
(function (UserMessageType) {
    /**用户消息 */
    UserMessageType[UserMessageType["UserMsg"] = 1] = "UserMsg";
    /**活动消息 */
    UserMessageType[UserMessageType["ActivityMsg"] = 2] = "ActivityMsg";
    /**系统消息 */
    UserMessageType[UserMessageType["SystemMsg"] = 3] = "SystemMsg";
})(UserMessageType || (UserMessageType = {}));
;
;
;
;
;
;
;
;
export var AccountType;
(function (AccountType) {
    /**银行卡 */
    AccountType[AccountType["Bank"] = 2] = "Bank";
    /**EPay */
    AccountType[AccountType["EPay"] = 4] = "EPay";
})(AccountType || (AccountType = {}));
;
var Bank = /** @class */ (function () {
    function Bank() {
    }
    return Bank;
}());
export { Bank };
var MessageItem = /** @class */ (function () {
    function MessageItem() {
    }
    return MessageItem;
}());
export { MessageItem };
;
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
var AccountInfo = /** @class */ (function () {
    function AccountInfo() {
        /**是否是vip，（由程序计算出来） */
        this["isVip"] = false;
        this["accountMoneyInfo"] = {
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
            "bbmaxwithdrawcoinnum": 0,
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
            "isTrue": false,
        };
    }
    return AccountInfo;
}());
export { AccountInfo };
var AccountApi = /** @class */ (function () {
    function AccountApi() {
    }
    AccountApi.Login = function (component, username, pwd, autologin) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!ApiHelper.UrlAddressReady) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                var e_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, AccountApi.Login(component, username, pwd, autologin)];
                                        case 1:
                                            _a.sent();
                                            resolve();
                                            return [3 /*break*/, 3];
                                        case 2:
                                            e_1 = _a.sent();
                                            reject(e_1);
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }, 1000);
                        })];
                }
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var isIos, dict, url, ret, obj, a1, tokenObj, e_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    isIos = false;
                                    if (window.api)
                                        (window.api).systemType == 'ios';
                                    dict = {
                                        channelId: ApiHelper.ChannelId,
                                        client_id: ApiHelper.ClientId,
                                        client_secret: ApiHelper.ClientSecret,
                                        grant_type: "password",
                                        username: username,
                                        password: pwd,
                                        deviceType: isIos ? 1 : 2
                                    };
                                    console.log(JSON.stringify(dict));
                                    url = ApiHelper.UrlAddresses.apiUrls.accountUrl + "/api/Userinfo/GetToken";
                                    console.log(url);
                                    return [4 /*yield*/, HttpClient.postJsonAsync({
                                            data: dict,
                                            url: url,
                                            component: component
                                        })];
                                case 1:
                                    ret = _a.sent();
                                    eval("obj=" + ret);
                                    if (obj.code != 200) {
                                        reject(obj);
                                    }
                                    else {
                                        eval("obj=" + obj.data);
                                        ApiHelper.CurrentTokenInfo = obj;
                                        ApiHelper.CurrentTokenInfo.expires_time = new Date().getTime() + ApiHelper.CurrentTokenInfo.expires_in * 1000;
                                        a1 = jwtToBase64(ApiHelper.CurrentTokenInfo.access_token.split('.')[1]);
                                        a1 = new Buffer(a1, 'base64').toString();
                                        console.debug(a1);
                                        eval("tokenObj=" + a1);
                                        ApiHelper.CurrentTokenInfo.phone_number = tokenObj.phone_number;
                                        ApiHelper.CurrentTokenInfo.realname = tokenObj.realname;
                                        ApiHelper.CurrentTokenInfo.certificationstatus = tokenObj.certificationstatus;
                                        ApiHelper.CurrentTokenInfo.autologin = autologin;
                                        if (window.api) {
                                            window.api.sendEvent({
                                                name: 'Logined',
                                                extra: { tokenStr: JSON.stringify(ApiHelper.CurrentTokenInfo) }
                                            });
                                        }
                                        if (!window.api) {
                                            //如果是apicloud，那么会从Main.lookupLogin触发这个事件，放在那里，因为hideFrame的登录事件也能catch到
                                            MessageCenter.raise(MessageType.Logined, null);
                                        }
                                        resolve();
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_2 = _a.sent();
                                    reject(e_2);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     *
     * @param component
     * @param WalletAddressType
     * @param Coin BTC USDT ETH
     * @param Code ERC20_USDT  OMNI_USDT
     * @param PaySource 2:信用资产 1：普通充值
     */
    AccountApi.GetCoinAddress = function (component, WalletAddressType, Coin, Code, PaySource) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!ApiHelper.CurrentTokenInfo) {
                    throw { status: 401 };
                }
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var dict, url, ret, obj, e_3;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    dict = {
                                        WalletAddressType: WalletAddressType,
                                        Coin: Coin,
                                        Code: Code,
                                        PaySource: PaySource
                                    };
                                    console.log(dict);
                                    url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Account/GetCoinAddress";
                                    return [4 /*yield*/, HttpClient.postJsonAsync({
                                            data: dict,
                                            component: component,
                                            url: url,
                                            header: {
                                                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
                                            },
                                        })];
                                case 1:
                                    ret = _a.sent();
                                    eval("obj=" + ret);
                                    if (obj.code != 200) {
                                        reject(obj);
                                    }
                                    else {
                                        resolve(obj.data);
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_3 = _a.sent();
                                    reject(e_3);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * 开启关闭自动跟单
     * @param component
     * @param isDocumentary
     */
    AccountApi.SetIsDocumentary = function (component, isDocumentary) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!ApiHelper.UrlAddressReady) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                var ret, e_4;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, AccountApi.SetIsDocumentary(component, isDocumentary)];
                                        case 1:
                                            ret = _a.sent();
                                            resolve(ret);
                                            return [3 /*break*/, 3];
                                        case 2:
                                            e_4 = _a.sent();
                                            reject(e_4);
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }, 1000);
                        })];
                }
                if (!ApiHelper.CurrentTokenInfo) {
                    throw { status: 401 };
                }
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var dict, url, ret, obj, e_5;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    dict = {
                                        isDocumentary: isDocumentary
                                    };
                                    url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Account/SetIsDocumentary";
                                    return [4 /*yield*/, HttpClient.postJsonAsync({
                                            data: dict,
                                            component: component,
                                            url: url,
                                            header: {
                                                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
                                            },
                                        })];
                                case 1:
                                    ret = _a.sent();
                                    eval("obj=" + ret);
                                    if (obj.code != 200) {
                                        reject(obj);
                                    }
                                    else {
                                        resolve();
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_5 = _a.sent();
                                    reject(e_5);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    AccountApi.RefreshTokenByToken = function (refreshToken, autologin, cancelIfLogout) {
        if (cancelIfLogout === void 0) { cancelIfLogout = false; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (ApiHelper.RefreshingToken) {
                    //正在刷新token，等待结果
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                var e_6;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, AccountApi.RefreshTokenByToken(refreshToken, autologin, cancelIfLogout)];
                                        case 1:
                                            _a.sent();
                                            resolve();
                                            return [3 /*break*/, 3];
                                        case 2:
                                            e_6 = _a.sent();
                                            reject(e_6);
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }, 1000);
                        })];
                }
                if (!ApiHelper.UrlAddressReady) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                var e_7;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, AccountApi.RefreshTokenByToken(refreshToken, autologin, cancelIfLogout)];
                                        case 1:
                                            _a.sent();
                                            resolve();
                                            return [3 /*break*/, 3];
                                        case 2:
                                            e_7 = _a.sent();
                                            reject(e_7);
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }, 1000);
                        })];
                }
                ApiHelper.RefreshingToken++;
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var dict, url, ret, e_8, obj, a1, tokenObj, e_9;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 6, , 7]);
                                    dict = {
                                        channelId: ApiHelper.ChannelId,
                                        client_id: ApiHelper.ClientId,
                                        client_secret: ApiHelper.ClientSecret,
                                        grant_type: "refresh_token",
                                        refresh_token: refreshToken,
                                    };
                                    url = ApiHelper.UrlAddresses.apiUrls.accountUrl + "/api/Userinfo/GetToken";
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, 4, 5]);
                                    return [4 /*yield*/, HttpClient.postJsonAsync({
                                            data: dict,
                                            url: url,
                                        })];
                                case 2:
                                    ret = _a.sent();
                                    return [3 /*break*/, 5];
                                case 3:
                                    e_8 = _a.sent();
                                    throw e_8;
                                case 4:
                                    ApiHelper.RefreshingToken--;
                                    return [7 /*endfinally*/];
                                case 5:
                                    if (cancelIfLogout && ApiHelper.CurrentTokenInfo == null) {
                                        reject("已经退出登录，不用再刷新");
                                        return [2 /*return*/];
                                    }
                                    eval("obj=" + ret);
                                    if (obj.code != 200) {
                                        reject(obj);
                                    }
                                    else {
                                        eval("obj=" + obj.data);
                                        ApiHelper.CurrentTokenInfo = obj;
                                        ApiHelper.CurrentTokenInfo.autologin = autologin;
                                        ApiHelper.CurrentTokenInfo.expires_time = new Date().getTime() + ApiHelper.CurrentTokenInfo.expires_in * 1000;
                                        a1 = jwtToBase64(ApiHelper.CurrentTokenInfo.access_token.split('.')[1]);
                                        a1 = new Buffer(a1, 'base64').toString();
                                        eval("tokenObj=" + a1);
                                        ApiHelper.CurrentTokenInfo.phone_number = tokenObj.phone_number;
                                        ApiHelper.CurrentTokenInfo.realname = tokenObj.realname;
                                        ApiHelper.CurrentTokenInfo.certificationstatus = tokenObj.certificationstatus;
                                        if (autologin) {
                                            setCache("CurrentTokenInfo", JSON.stringify(ApiHelper.CurrentTokenInfo));
                                        }
                                        if (window.api) {
                                            window.api.sendEvent({
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
                                    return [3 /*break*/, 7];
                                case 6:
                                    e_9 = _a.sent();
                                    reject(e_9);
                                    return [3 /*break*/, 7];
                                case 7: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * 刷新token
     * @param callback
     */
    AccountApi.RefreshToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!ApiHelper.CurrentTokenInfo) {
                    throw "ApiHelper.CurrentTokenInfo is null";
                }
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var e_10;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, AccountApi.RefreshTokenByToken(ApiHelper.CurrentTokenInfo.refresh_token, ApiHelper.CurrentTokenInfo.autologin, true)];
                                case 1:
                                    _a.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_10 = _a.sent();
                                    if (e_10.code == 402) {
                                        ApiHelper.CurrentTokenInfo = null;
                                    }
                                    else if (e_10.status && e_10.status == 401) {
                                        ApiHelper.CurrentTokenInfo = null;
                                    }
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * Posts the pay in money
     * @param payinmoney 金额
     * @param payintype 入金类型1=币币，2=法币.
     * @param sourcecurrency 目标币种.
     * @param txId
     * @param callback
     */
    AccountApi.PostPayInMoney = function (component, payinmoney, payintype, sourcecurrency, txId, channel) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!ApiHelper.UrlAddressReady) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                var ret, e_11;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, AccountApi.PostPayInMoney(component, payinmoney, payintype, sourcecurrency, txId, channel)];
                                        case 1:
                                            ret = _a.sent();
                                            resolve(ret);
                                            return [3 /*break*/, 3];
                                        case 2:
                                            e_11 = _a.sent();
                                            reject(e_11);
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }, 1000);
                        })];
                }
                if (!ApiHelper.CurrentTokenInfo) {
                    throw { status: 401 };
                }
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var dict, url, ret, obj, e_12;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    dict = {
                                        channelId: ApiHelper.ChannelId,
                                        payinmoney: payinmoney,
                                        payintype: payintype,
                                        channel: channel,
                                        sourcecurrency: sourcecurrency,
                                        txId: txId,
                                    };
                                    url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Account/PostPayInMoney";
                                    return [4 /*yield*/, HttpClient.postJsonAsync({
                                            data: dict,
                                            component: component,
                                            url: url,
                                            header: {
                                                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
                                            },
                                        })];
                                case 1:
                                    ret = _a.sent();
                                    eval("obj=" + ret);
                                    if (obj.code != 200) {
                                        reject(obj);
                                    }
                                    else {
                                        resolve(obj.data);
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_12 = _a.sent();
                                    reject(e_12);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    AccountApi.GetAccountInfo = function (component) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!ApiHelper.UrlAddressReady) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                var ret, e_13;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, AccountApi.GetAccountInfo(component)];
                                        case 1:
                                            ret = _a.sent();
                                            resolve(ret);
                                            return [3 /*break*/, 3];
                                        case 2:
                                            e_13 = _a.sent();
                                            reject(e_13);
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }, 1000);
                        })];
                }
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var dict, url, ret, obj, e_14;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    if (!ApiHelper.CurrentTokenInfo) {
                                        reject({ status: 401 });
                                    }
                                    dict = {
                                        channelId: ApiHelper.ChannelId,
                                    };
                                    url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Account/GetAccountInfo";
                                    return [4 /*yield*/, HttpClient.postJsonAsync({
                                            data: dict,
                                            component: component,
                                            url: url,
                                            method: "GET",
                                            header: {
                                                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
                                            },
                                        })];
                                case 1:
                                    ret = _a.sent();
                                    eval("obj=" + ret);
                                    if (obj.code != 200) {
                                        reject(obj);
                                    }
                                    else {
                                        obj.data.isVip = obj.data.accountMoneyInfo.userRuleGroupId > 0;
                                        obj.data.accountMoneyInfo.canusedamount = parseFloat(BaseComponent.toFixed(obj.data.accountMoneyInfo.canusedamount, 2, true, true));
                                        MessageCenter.raise(MessageType.ReceivedAccountInfo, obj.data);
                                        console.debug(JSON.stringify(obj.data));
                                        resolve(obj.data);
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_14 = _a.sent();
                                    reject(e_14);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * 划转分销收益到可用余额
     * @param component
     * @param amount
     * @param callback
     */
    AccountApi.CanusedIncomeTransferCanusedAmount = function (component, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!ApiHelper.UrlAddressReady) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                var ret, e_15;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, AccountApi.CanusedIncomeTransferCanusedAmount(component, amount)];
                                        case 1:
                                            ret = _a.sent();
                                            resolve(ret);
                                            return [3 /*break*/, 3];
                                        case 2:
                                            e_15 = _a.sent();
                                            reject(e_15);
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }, 1000);
                        })];
                }
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var dict, url, ret, obj, e_16;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    if (!ApiHelper.CurrentTokenInfo) {
                                        throw { status: 401 };
                                    }
                                    dict = {
                                        amount: amount,
                                    };
                                    console.debug("划转金额" + amount);
                                    url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Account/CanusedIncomeTransferCanusedAmount";
                                    return [4 /*yield*/, HttpClient.postJsonAsync({
                                            data: dict,
                                            component: component,
                                            url: url,
                                            header: {
                                                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
                                            },
                                        })];
                                case 1:
                                    ret = _a.sent();
                                    eval("obj=" + ret);
                                    if (obj.code != 200) {
                                        throw obj;
                                    }
                                    else {
                                        resolve(obj.data);
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_16 = _a.sent();
                                    reject(e_16);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * 余额宝划转到余额
     * @param component
     * @param amount
     * @param callback
     */
    AccountApi.CanusedInterestTransferCanusedAmount = function (component, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!ApiHelper.UrlAddressReady) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                var ret, e_17;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, AccountApi.CanusedInterestTransferCanusedAmount(component, amount)];
                                        case 1:
                                            ret = _a.sent();
                                            resolve(ret);
                                            return [3 /*break*/, 3];
                                        case 2:
                                            e_17 = _a.sent();
                                            reject(e_17);
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }, 1000);
                        })];
                }
                if (!ApiHelper.CurrentTokenInfo) {
                    throw { status: 401 };
                }
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var dict, url, ret, obj, e_18;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    dict = {
                                        amount: amount,
                                    };
                                    console.debug("划转金额" + amount);
                                    url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Account/CanusedInterestTransferCanusedAmount";
                                    return [4 /*yield*/, HttpClient.postJsonAsync({
                                            data: dict,
                                            component: component,
                                            url: url,
                                            header: {
                                                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
                                            },
                                        })];
                                case 1:
                                    ret = _a.sent();
                                    eval("obj=" + ret);
                                    if (obj.code != 200) {
                                        throw obj;
                                    }
                                    else {
                                        resolve(obj.data);
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_18 = _a.sent();
                                    reject(e_18);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    AccountApi.SendSetPayPwdSms = function (component) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!ApiHelper.UrlAddressReady) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                var ret, e_19;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, AccountApi.SendSetPayPwdSms(component)];
                                        case 1:
                                            ret = _a.sent();
                                            resolve(ret);
                                            return [3 /*break*/, 3];
                                        case 2:
                                            e_19 = _a.sent();
                                            reject(e_19);
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }, 1000);
                        })];
                }
                if (!ApiHelper.CurrentTokenInfo) {
                    throw { status: 401 };
                }
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var dict, url, ret, obj, e_20;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    dict = {
                                        smsType: 3,
                                        channelId: ApiHelper.ChannelId
                                    };
                                    url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Userinfo/SendSetPasswordSmsCode";
                                    return [4 /*yield*/, HttpClient.postJsonAsync({
                                            data: dict,
                                            component: component,
                                            url: url,
                                            header: {
                                                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
                                            },
                                        })];
                                case 1:
                                    ret = _a.sent();
                                    eval("obj=" + ret);
                                    if (obj.code != 200) {
                                        throw obj;
                                    }
                                    else {
                                        resolve(obj.data);
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_20 = _a.sent();
                                    reject(e_20);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * 设置支付密码
     * @param component
     * @param password
     * @param smscode
     * @param callback
     */
    AccountApi.SetUserPassword = function (component, password, smsCode) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!ApiHelper.UrlAddressReady) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                var ret, e_21;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, AccountApi.SetUserPassword(component, password, smsCode)];
                                        case 1:
                                            ret = _a.sent();
                                            resolve(ret);
                                            return [3 /*break*/, 3];
                                        case 2:
                                            e_21 = _a.sent();
                                            reject(e_21);
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }, 1000);
                        })];
                }
                if (!ApiHelper.CurrentTokenInfo) {
                    throw { status: 401 };
                }
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var dict, url, ret, obj, e_22;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    dict = {
                                        smsCode: smsCode,
                                        password: password,
                                        passwordConfirm: password,
                                        channelId: ApiHelper.ChannelId
                                    };
                                    url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Userinfo/SetUserPassword";
                                    return [4 /*yield*/, HttpClient.postJsonAsync({
                                            data: dict,
                                            component: component,
                                            url: url,
                                            header: {
                                                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
                                            },
                                        })];
                                case 1:
                                    ret = _a.sent();
                                    eval("obj=" + ret);
                                    if (obj.code != 200) {
                                        throw obj;
                                    }
                                    else {
                                        resolve(obj.data);
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_22 = _a.sent();
                                    reject(e_22);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * 获取未读的消息
     * @param component
     * @param callback
     */
    AccountApi.GetUnReadCount = function (component) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!ApiHelper.UrlAddressReady) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                var ret, e_23;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, AccountApi.GetUnReadCount(component)];
                                        case 1:
                                            ret = _a.sent();
                                            resolve(ret);
                                            return [3 /*break*/, 3];
                                        case 2:
                                            e_23 = _a.sent();
                                            reject(e_23);
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }, 1000);
                        })];
                }
                if (!ApiHelper.CurrentTokenInfo) {
                    throw { status: 401 };
                }
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var url, ret, obj, e_24;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Userinfo/GetUnReadCount";
                                    return [4 /*yield*/, HttpClient.postJsonAsync({
                                            method: "GET",
                                            component: component,
                                            url: url,
                                            header: {
                                                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
                                            },
                                        })];
                                case 1:
                                    ret = _a.sent();
                                    eval("obj=" + ret);
                                    if (obj.code != 200) {
                                        throw obj;
                                    }
                                    else {
                                        resolve(obj.data);
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_24 = _a.sent();
                                    reject(e_24);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
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
    AccountApi.GetDistributionIncomeListPageAsync = function (component, level, startdate, enddate, page, pagesize) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!ApiHelper.UrlAddressReady) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                var ret, e_25;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, AccountApi.GetDistributionIncomeListPageAsync(component, level, startdate, enddate, page, pagesize)];
                                        case 1:
                                            ret = _a.sent();
                                            resolve(ret);
                                            return [3 /*break*/, 3];
                                        case 2:
                                            e_25 = _a.sent();
                                            reject(e_25);
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }, 1000);
                        })];
                }
                if (!ApiHelper.CurrentTokenInfo) {
                    throw { status: 401 };
                }
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var url, ret, obj, e_26;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Account/GetDistributionIncomeListPageAsync";
                                    return [4 /*yield*/, HttpClient.postJsonAsync({
                                            data: {
                                                level: level, startdate: startdate, enddate: enddate, page: page, pagesize: pagesize
                                            },
                                            component: component,
                                            url: url,
                                            header: {
                                                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
                                            },
                                        })];
                                case 1:
                                    ret = _a.sent();
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
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_26 = _a.sent();
                                    reject(e_26);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
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
    AccountApi.GetFundDayBalanceTreasureInterestListPaged = function (component, type, startdate, enddate, page, pagesize) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!ApiHelper.UrlAddressReady) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                var ret, e_27;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, AccountApi.GetFundDayBalanceTreasureInterestListPaged(component, type, startdate, enddate, page, pagesize)];
                                        case 1:
                                            ret = _a.sent();
                                            resolve(ret);
                                            return [3 /*break*/, 3];
                                        case 2:
                                            e_27 = _a.sent();
                                            reject(e_27);
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }, 1000);
                        })];
                }
                if (!ApiHelper.CurrentTokenInfo) {
                    throw { status: 401 };
                }
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var url, ret, obj, e_28;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Account/GetFundDayBalanceTreasureInterestListPaged";
                                    return [4 /*yield*/, HttpClient.sendAsync({
                                            method: "GET",
                                            data: {
                                                type: type, startdate: startdate, enddate: enddate, page: page, pagesize: pagesize
                                            },
                                            component: component,
                                            url: url,
                                            header: {
                                                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
                                            },
                                        })];
                                case 1:
                                    ret = _a.sent();
                                    eval("obj=" + ret);
                                    if (obj.code != 200) {
                                        throw obj;
                                    }
                                    else {
                                        resolve(obj.data.items);
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_28 = _a.sent();
                                    reject(e_28);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * 获取银行卡信息
     * @param component
     * @param id
     */
    AccountApi.GetPayoutBankModel = function (component, id) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!ApiHelper.CurrentTokenInfo) {
                    throw { status: 401 };
                }
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var url, ret, obj, e_29;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Account/GetPayoutBankModel";
                                    return [4 /*yield*/, HttpClient.sendAsync({
                                            method: "GET",
                                            data: {
                                                id: id
                                            },
                                            component: component,
                                            url: url,
                                            header: {
                                                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
                                            },
                                        })];
                                case 1:
                                    ret = _a.sent();
                                    eval("obj=" + ret);
                                    if (obj.code != 200) {
                                        throw obj;
                                    }
                                    else {
                                        resolve(obj.data);
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_29 = _a.sent();
                                    reject(e_29);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * 更新银行卡
     * @param component
     * @param item
     */
    AccountApi.UpdatePayoutBank = function (component, item) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!ApiHelper.CurrentTokenInfo) {
                    throw { status: 401 };
                }
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var url, ret, obj, e_30;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Account/UpdatePayoutBank";
                                    return [4 /*yield*/, HttpClient.postJsonAsync({
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
                                                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
                                            },
                                        })];
                                case 1:
                                    ret = _a.sent();
                                    eval("obj=" + ret);
                                    if (obj.code != 200) {
                                        throw obj;
                                    }
                                    else {
                                        resolve();
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_30 = _a.sent();
                                    reject(e_30);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * 删除银行卡
     * @param component
     * @param id
     */
    AccountApi.DeletePayoutBank = function (component, id) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!ApiHelper.CurrentTokenInfo) {
                    throw { status: 401 };
                }
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var url, ret, obj, e_31;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Account/DeletePayoutBank";
                                    return [4 /*yield*/, HttpClient.postJsonAsync({
                                            data: {
                                                id: id
                                            },
                                            component: component,
                                            url: url,
                                            header: {
                                                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
                                            },
                                        })];
                                case 1:
                                    ret = _a.sent();
                                    eval("obj=" + ret);
                                    if (obj.code != 200) {
                                        throw obj;
                                    }
                                    else {
                                        resolve();
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_31 = _a.sent();
                                    reject(e_31);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * 余额宝每日利息收益汇总明细
     * @param component
     * @param id
     * @param callback
     */
    AccountApi.GetFundDayBalanceTreasureInterestDetail = function (component, id) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!ApiHelper.UrlAddressReady) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                var ret, e_32;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, AccountApi.GetFundDayBalanceTreasureInterestDetail(component, id)];
                                        case 1:
                                            ret = _a.sent();
                                            resolve(ret);
                                            return [3 /*break*/, 3];
                                        case 2:
                                            e_32 = _a.sent();
                                            reject(e_32);
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }, 1000);
                        })];
                }
                if (!ApiHelper.CurrentTokenInfo) {
                    throw { status: 401 };
                }
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var url, ret, obj, e_33;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Account/GetFundDayBalanceTreasureInterestDetail";
                                    return [4 /*yield*/, HttpClient.sendAsync({
                                            method: "GET",
                                            data: {
                                                id: id
                                            },
                                            component: component,
                                            url: url,
                                            header: {
                                                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
                                            },
                                        })];
                                case 1:
                                    ret = _a.sent();
                                    eval("obj=" + ret);
                                    if (obj.code != 200) {
                                        throw obj;
                                    }
                                    else {
                                        resolve(obj.data);
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_33 = _a.sent();
                                    reject(e_33);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * 设置当前用户的deviceToken
     * @param devicetoken
     */
    AccountApi.UpdateUserDevice = function (devicetoken, pushChannel) {
        var _this = this;
        if (!ApiHelper.CurrentTokenInfo) {
            throw { status: 401 };
        }
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var url, ret, obj, e_34;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Userinfo/UpdateUserDevice";
                        return [4 /*yield*/, HttpClient.postJsonAsync({
                                data: {
                                    devicetoken: devicetoken,
                                    deviceType: isIOS ? 1 : 2,
                                    culture: textRes.langName,
                                    channelId: ApiHelper.ChannelId,
                                    devcieModel: pushChannel,
                                    imei: window.api.systemVersion,
                                },
                                url: url,
                                header: {
                                    "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
                                },
                            })];
                    case 1:
                        ret = _a.sent();
                        eval("obj=" + ret);
                        if (obj.code != 200) {
                            throw obj;
                        }
                        else {
                            resolve();
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_34 = _a.sent();
                        reject(e_34);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * 邀请收益列表
     * @param component
     * @param StartDate
     * @param EndDate
     * @param Page
     * @param PageSize
     * @param callback
     */
    AccountApi.GetTotalFundDayDistributionIncomeListPaged = function (component, Level, StartDate, EndDate, Page, PageSize, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return AccountApi.GetTotalFundDayDistributionIncomeListPaged(component, Level, StartDate, EndDate, Page, PageSize, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, undefined, { status: 401 });
            return;
        }
        var url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Account/GetTotalFundDayDistributionIncomeListPaged";
        HttpClient.send({
            method: "GET",
            data: {
                Level: Level, StartDate: StartDate, EndDate: EndDate, Page: Page, PageSize: PageSize
            },
            component: component,
            url: url,
            header: {
                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            callback: function (ret, err) {
                if (err) {
                    callback(null, undefined, err);
                }
                else {
                    var obj;
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
    };
    /**
     * 邀请收益每日汇总列表
     * @param component
     * @param StartDate
     * @param EndDate
     * @param Page
     * @param PageSize
     * @param callback
     */
    AccountApi.GetFundDayTotalIncomeListPaged = function (component, StartDate, EndDate, Page, PageSize, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return AccountApi.GetFundDayTotalIncomeListPaged(component, StartDate, EndDate, Page, PageSize, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, undefined, { status: 401 });
            return;
        }
        var url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Account/GetFundDayTotalIncomeListPaged";
        HttpClient.send({
            method: "GET",
            data: {
                StartDate: StartDate, EndDate: EndDate, Page: Page, PageSize: PageSize
            },
            component: component,
            url: url,
            header: {
                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            callback: function (ret, err) {
                if (err) {
                    callback(null, undefined, err);
                }
                else {
                    var obj;
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
    };
    /**
     * 手续费返佣列表
     * @param component
     * @param StartDate
     * @param EndDate
     * @param Page
     * @param PageSize
     * @param callback
     */
    AccountApi.GetTotalFundDistributionTradeIncomeListPaged = function (component, StartDate, EndDate, Page, PageSize, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return AccountApi.GetTotalFundDistributionTradeIncomeListPaged(component, StartDate, EndDate, Page, PageSize, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, undefined, { status: 401 });
            return;
        }
        var url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Account/GetTotalFundDistributionTradeIncomeListPaged";
        HttpClient.send({
            method: "GET",
            data: {
                StartDate: StartDate, EndDate: EndDate, Page: Page, PageSize: PageSize
            },
            component: component,
            url: url,
            header: {
                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            callback: function (ret, err) {
                if (err) {
                    callback(null, undefined, err);
                }
                else {
                    var obj;
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
    };
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
    AccountApi.GetTotalFundDayDistributionIncomeDetail = function (component, Level, IncomeDate, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return AccountApi.GetTotalFundDayDistributionIncomeDetail(component, Level, IncomeDate, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }
        var url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Account/GetTotalFundDayDistributionIncomeDetail";
        HttpClient.send({
            method: "GET",
            data: {
                Level: Level, IncomeDate: IncomeDate
            },
            component: component,
            url: url,
            header: {
                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            callback: function (ret, err) {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj;
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
    };
    /**
     * 邀请收益每日汇总详细
     * @param component
     * @param id
     * @param callback
     */
    AccountApi.GetFundDayTotalIncomeDetail = function (component, id, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return AccountApi.GetFundDayTotalIncomeDetail(component, id, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }
        var url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Account/GetFundDayTotalIncomeDetail";
        HttpClient.send({
            method: "GET",
            data: {
                id: id
            },
            component: component,
            url: url,
            header: {
                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            callback: function (ret, err) {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj;
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
    };
    /**
     * 领取红包
     * @param component
     * @param callback
     */
    AccountApi.ReceiveRedEnvelope = function (component, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return AccountApi.ReceiveRedEnvelope(component, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }
        var url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Account/ReceiveRedEnvelope";
        HttpClient.postJson({
            data: {},
            component: component,
            url: url,
            header: {
                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            callback: function (ret, err) {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj;
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
    };
    /**
     * 好友列表
     * @param component
     * @param level 1:我的好友 2：好友的好友
     * @param page
     * @param pagesize
     * @param callback
     */
    AccountApi.GetGoodFriendListPageAsync = function (component, level, page, pagesize, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return AccountApi.GetGoodFriendListPageAsync(component, level, page, pagesize, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }
        var url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Account/GetGoodFriendListPageAsync";
        HttpClient.postJson({
            data: { level: level, page: page, pagesize: pagesize },
            component: component,
            url: url,
            header: {
                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            callback: function (ret, err) {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj;
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
    };
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
    AccountApi.GetFundAccountMoneyFlowList = function (component, biztype, startdate, enddate, page, pagesize, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return AccountApi.GetFundAccountMoneyFlowList(component, biztype, startdate, enddate, page, pagesize, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, undefined, { status: 401 });
            return;
        }
        var url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Account/GetFundAccountMoneyFlowList";
        HttpClient.send({
            method: "GET",
            data: {
                channelId: ApiHelper.ChannelId,
                biztype: biztype, page: page, pagesize: pagesize, startdate: startdate, enddate: enddate
            },
            component: component,
            url: url,
            header: {
                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            callback: function (ret, err) {
                if (err) {
                    callback(null, undefined, err);
                }
                else {
                    var obj;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, undefined, obj);
                    }
                    else {
                        obj.data.list.forEach(function (m) {
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
    };
    AccountApi.GetUserMessageList = function (component, msgtype, page, pageSize, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return AccountApi.GetUserMessageList(component, msgtype, page, pageSize, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }
        var url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Userinfo/GetUserMessageList";
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
                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            callback: function (ret, err) {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj;
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
    };
    /**
     * 读取消息内容
     * @param component
     * @param msgid
     * @param callback
     */
    AccountApi.GetUserMessage = function (component, msgid, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return AccountApi.GetUserMessage(component, msgid, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }
        var url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Userinfo/GetUserMsg";
        HttpClient.send({
            method: "GET",
            data: {
                msgId: msgid
            },
            component: component,
            url: url,
            header: {
                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            callback: function (ret, err) {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj;
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
    };
    AccountApi.GetBankList = function (component, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return AccountApi.GetBankList(component, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }
        var url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Account/GetBankList";
        HttpClient.send({
            method: "GET",
            data: {
                channelId: ApiHelper.ChannelId
            },
            component: component,
            url: url,
            header: {
                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            callback: function (ret, err) {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj;
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
    };
    AccountApi.GetPayoutBanks = function (component, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return AccountApi.GetPayoutBanks(component, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }
        var url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Account/GetPayoutBanks";
        HttpClient.send({
            method: "GET",
            data: {
                channelId: ApiHelper.ChannelId
            },
            component: component,
            url: url,
            header: {
                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            callback: function (ret, err) {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj;
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
    };
    /**
     * 充值记录
     * @param component
     * @param PaySource 1=普通提现，2=信用提现
     * @param page
     * @param pagesize
     * @param callback
     */
    AccountApi.GetPayinList = function (component, PaySource, page, pagesize, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return AccountApi.GetPayinList(component, PaySource, page, pagesize, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }
        var url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Account/GetPayinList";
        HttpClient.send({
            method: "GET",
            data: {
                channelId: ApiHelper.ChannelId,
                page: page, pagesize: pagesize, PaySource: PaySource
            },
            component: component,
            url: url,
            header: {
                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            callback: function (ret, err) {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj;
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
    };
    /**
     * 提现记录
     * @param component
     * @param PaySource 1=普通提现，2=信用提现
     * @param page
     * @param pagesize
     * @param callback
     */
    AccountApi.GetPayOutList = function (component, PaySource, page, pagesize, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return AccountApi.GetPayOutList(component, PaySource, page, pagesize, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }
        var url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Account/GetPayOutList";
        HttpClient.send({
            method: "GET",
            data: {
                channelId: ApiHelper.ChannelId,
                page: page, pagesize: pagesize, PaySource: PaySource
            },
            component: component,
            url: url,
            header: {
                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            callback: function (ret, err) {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj;
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
    };
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
    AccountApi.SetCollectMoney = function (component, realName, accountNumber, openBank, bankType, payOuttype, bankName, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return AccountApi.SetCollectMoney(component, realName, accountNumber, openBank, bankType, payOuttype, bankName, callback); }, 1000);
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
        var url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Account/SetCollectMoney";
        HttpClient.postJson({
            data: dict,
            component: component,
            url: url,
            header: {
                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            callback: function (ret, err) {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj;
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
    };
    /**
     * 获取指定币种和USDT的汇率
     * @param component
     * @param currency
     * @param callback
     */
    AccountApi.GetRate = function (component, currency, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return AccountApi.GetRate(component, currency, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }
        if (currency.indexOf("USDT") >= 0)
            currency = "USDT";
        var url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Account/GetRate";
        HttpClient.send({
            data: {
                currency: currency
            },
            method: "GET",
            component: component,
            url: url,
            header: {
                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            callback: function (ret, err) {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj;
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
    };
    /**
     * 获取信用资本信息
     * @param component
     * @param callback
     */
    AccountApi.GetCreditInfo = function (component, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return AccountApi.GetCreditInfo(component, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }
        var url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Credit/GetCreditInfo";
        HttpClient.send({
            method: "GET",
            component: component,
            url: url,
            header: {
                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            callback: function (ret, err) {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj;
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
    };
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
    AccountApi.PostCreditPayInMoney = function (component, payinmoney, payintype, sourcecurrency, txId, channel, currentcurrency) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!ApiHelper.UrlAddressReady) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                var ret, e_35;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, AccountApi.PostCreditPayInMoney(component, payinmoney, payintype, sourcecurrency, txId, channel, currentcurrency)];
                                        case 1:
                                            ret = _a.sent();
                                            resolve(ret);
                                            return [3 /*break*/, 3];
                                        case 2:
                                            e_35 = _a.sent();
                                            reject(e_35);
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }, 1000);
                        })];
                }
                if (!ApiHelper.CurrentTokenInfo) {
                    throw { status: 401 };
                }
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var url, data, ret, obj, e_36;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Credit/PostCreditPayInMoney";
                                    data = {
                                        payinmoney: payinmoney, payintype: payintype, sourcecurrency: sourcecurrency, txId: txId, channel: channel, currentcurrency: currentcurrency,
                                    };
                                    return [4 /*yield*/, HttpClient.postJsonAsync({
                                            data: data,
                                            component: component,
                                            url: url,
                                            header: {
                                                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
                                            },
                                        })];
                                case 1:
                                    ret = _a.sent();
                                    eval("obj=" + ret);
                                    if (obj.code != 200) {
                                        throw obj;
                                    }
                                    else {
                                        resolve(obj.data);
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_36 = _a.sent();
                                    reject(e_36);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    AccountApi.BuildInMoneyUrl = function (request) {
        var names = Object.keys(request).sort();
        var str = "";
        names.forEach(function (name) {
            str += name.toLowerCase() + "=" + request[name] + "&";
        });
        str = str.substr(0, str.length - 1);
        console.log(str);
        var sign = md5(str + ApiHelper.OTCSecret);
        return ApiHelper.UrlAddresses.currentUrls.payCenterUrl + "/pay/do?" + str + "&Sign=" + sign;
    };
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
    AccountApi.PostCreditOutMoney = function (component, collectMoneylId, password, payoutmoney, payouttype, coinaddress, channel, currentcurrency, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return AccountApi.PostCreditOutMoney(component, collectMoneylId, password, payoutmoney, payouttype, coinaddress, channel, currentcurrency, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }
        var url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Credit/PostCreditOutMoney";
        var data = {
            collectMoneylId: collectMoneylId, password: password, payoutmoney: payoutmoney, payouttype: payouttype, coinaddress: coinaddress, channel: channel, currentcurrency: currentcurrency,
        };
        HttpClient.postJson({
            data: data,
            component: component,
            url: url,
            header: {
                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            callback: function (ret, err) {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj;
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
    };
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
    AccountApi.PostOutMoney = function (component, collectMoneylId, channel, password, payoutmoney, payouttype, coinaddress, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return AccountApi.PostOutMoney(component, collectMoneylId, channel, password, payoutmoney, payouttype, coinaddress, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }
        var url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Account/PostOutMoney";
        var data = {
            channelId: ApiHelper.ChannelId,
            collectMoneylId: collectMoneylId, channel: channel, password: password, payoutmoney: payoutmoney, payouttype: payouttype, coinaddress: coinaddress
        };
        HttpClient.postJson({
            data: data,
            component: component,
            url: url,
            header: {
                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            callback: function (ret, err) {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj;
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
    };
    /**
     * 信用借款
     * @param component
     * @param borrowMoney 借款金额
     * @param callback
     */
    AccountApi.BorrowCreditMoney = function (component, borrowMoney, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return AccountApi.BorrowCreditMoney(component, borrowMoney, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }
        var url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Credit/BorrowCreditMoney";
        var data = {
            borrowMoney: borrowMoney
        };
        HttpClient.postJson({
            data: data,
            component: component,
            url: url,
            header: {
                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            callback: function (ret, err) {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj;
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
    };
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
    AccountApi.ReturnCreditMoney = function (component, returnType, password, loanId, coin, returnMoney, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return AccountApi.ReturnCreditMoney(component, returnType, password, loanId, coin, returnMoney, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }
        var url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Credit/ReturnCreditMoney";
        var data = {
            returnType: returnType, password: password, loanId: loanId, coin: coin, returnMoney: returnMoney
        };
        HttpClient.postJson({
            data: data,
            component: component,
            url: url,
            header: {
                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            callback: function (ret, err) {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj;
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
    };
    /**
     * 还款列表
     * @param component
     * @param Page
     * @param PageSize
     * @param callback
     */
    AccountApi.GetRepaymentList = function (component, Page, PageSize, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return AccountApi.GetRepaymentList(component, Page, PageSize, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }
        var url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Credit/GetRepaymentList";
        var data = {
            Page: Page, PageSize: PageSize,
            channelId: ApiHelper.ChannelId
        };
        HttpClient.send({
            data: data,
            method: "GET",
            component: component,
            url: url,
            header: {
                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            callback: function (ret, err) {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        obj.data.items.forEach(function (m) {
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
    };
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
    AccountApi.GetUserCoinFlowList = function (component, OpType, StartDate, EndDate, Page, PageSize, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return AccountApi.GetUserCoinFlowList(component, OpType, StartDate, EndDate, Page, PageSize, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }
        var url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Credit/GetUserCoinFlowList";
        var data = {
            OpType: OpType, StartDate: StartDate, EndDate: EndDate, Page: Page, PageSize: PageSize,
        };
        //console.log(JSON.stringify(data));
        HttpClient.send({
            data: data,
            method: "GET",
            component: component,
            url: url,
            header: {
                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            callback: function (ret, err) {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj;
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
    };
    /**
     * 信用操作详情
     * @param component
     * @param id
     * @param callback
     */
    AccountApi.GetUserCoinFlowDetail = function (component, id, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return AccountApi.GetUserCoinFlowDetail(component, id, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }
        var url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Credit/GetUserCoinFlowDetail";
        var data = {
            id: id
        };
        HttpClient.send({
            data: data,
            method: "GET",
            component: component,
            url: url,
            header: {
                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            callback: function (ret, err) {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj;
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
    };
    /**
     * 充值详情
     * @param component
     * @param id
     * @param callback
     */
    AccountApi.GetPayDetail = function (component, id, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return AccountApi.GetPayDetail(component, id, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }
        var url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Credit/GetPayDetail";
        var data = {
            id: id
        };
        HttpClient.send({
            data: data,
            method: "GET",
            component: component,
            url: url,
            header: {
                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            callback: function (ret, err) {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj;
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
    };
    /**
     * 提现详情
     * @param component
     * @param id
     * @param callback
     */
    AccountApi.GetWithdrawalCashDetail = function (component, id, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return AccountApi.GetWithdrawalCashDetail(component, id, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }
        var url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Credit/GetWithdrawalCashDetail";
        var data = {
            id: id
        };
        HttpClient.send({
            data: data,
            method: "GET",
            component: component,
            url: url,
            header: {
                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            callback: function (ret, err) {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj;
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
    };
    /**
     * 获取信用利息收益
     * @param component
     * @param StartDate
     * @param EndDate
     * @param Page
     * @param PageSize
     * @param callback
     */
    AccountApi.GetCreditAssetsDayIncomeList = function (component, StartDate, EndDate, Page, PageSize, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return AccountApi.GetCreditAssetsDayIncomeList(component, StartDate, EndDate, Page, PageSize, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }
        var url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Credit/GetCreditAssetsDayIncomeList";
        var data = {
            StartDate: StartDate, EndDate: EndDate, Page: Page, PageSize: PageSize
        };
        HttpClient.send({
            data: data,
            method: "GET",
            component: component,
            url: url,
            header: {
                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            callback: function (ret, err) {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj;
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
    };
    /**
     * 获取信用收益详细
     * @param component
     * @param id
     * @param callback
     */
    AccountApi.GetCreditAssetsDayIncomeDetail = function (component, id, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return AccountApi.GetCreditAssetsDayIncomeDetail(component, id, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }
        var url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Credit/GetCreditAssetsDayIncomeDetail";
        var data = {
            id: id
        };
        HttpClient.send({
            data: data,
            method: "GET",
            component: component,
            url: url,
            header: {
                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            callback: function (ret, err) {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj;
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
    };
    /**
     * 交易资产信息
     * @param component
     * @param callback
     */
    AccountApi.GetTradeAssetsInfo = function (component, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return AccountApi.GetTradeAssetsInfo(component, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }
        var url = ApiHelper.UrlAddresses.currentUrls.accountUrl + "/api/Account/GetTradeAssetsInfo";
        HttpClient.send({
            method: "GET",
            component: component,
            url: url,
            header: {
                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            callback: function (ret, err) {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj;
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
    };
    return AccountApi;
}());
export { AccountApi };
//# sourceMappingURL=AccountApi.js.map