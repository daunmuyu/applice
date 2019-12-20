var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import { BaseComponent } from "../../../BaseComponent";
import Vue from "vue";
import { ApiHelper } from "../../../ServerApis/ApiHelper";
import { PayCenterApi } from "../../../ServerApis/PayCenterApi";
import { setTimeout } from "timers";
import { AccountApi } from "../../../ServerApis/AccountApi";
import { showError } from "../../../Global";
import { HttpClient } from "jack-one-script";
import { WebBrowser } from "../../WebBrowser";
import { Recharge } from "./Recharge";
import { alertWindow } from "../../../GlobalFunc";
import { NavigationEvent } from "jack-one-script";
import { MessageCenter, MessageType } from "../../../MessageCenter";
import { Home } from "../../Home";
var html = require("./fiatRecharge.html");
/**法币充值 */
var FiatRecharge = /** @class */ (function (_super) {
    __extends(FiatRecharge, _super);
    function FiatRecharge() {
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: null,
            currencyItems: [],
            accountInfo: {
                "accountMoneyInfo": {
                    "payminamount": 0
                },
            },
            selectedCurrency: undefined,
            channels: null,
            expended: false,
            isCreditMode: false,
            isBusy: 0,
            amount: 2000,
            /**最小充值金额*/
            minRechargeAmount: undefined,
            customAmount: "",
        };
        _this.model.textRes = textRes;
        _this.model.isCreditMode = Recharge.IsCreditMode;
        if (Recharge.IsCreditMode) {
            _this.model.currencyItems = [
                { name: "BTC", price: 1 },
                { name: "ETH", price: 1 }
            ];
        }
        else {
            _this.model.currencyItems = [
                { name: "USDT", price: 1 }
            ];
        }
        ApiHelper.SupportedPayChannels.forEach(function (m) { return m.price = undefined; });
        _this.model.channels = ApiHelper.SupportedPayChannels;
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
            watch: {
                customAmount: function (newValue) {
                    if (newValue != "") {
                        var value = parseFloat(newValue);
                        if (!isNaN(value)) {
                            _this.model.amount = value;
                        }
                    }
                },
                selectedCurrency: function (newValue) {
                    if (Recharge.IsCreditMode) {
                        var selectedChannel;
                        if (_this.model.channels.length > 0)
                            selectedChannel = _this.model.channels[0];
                        var channels = ApiHelper.SupportedPayChannels.filter(function (m) { return m.supportedCurrencies.indexOf(newValue) >= 0; });
                        if (selectedChannel) {
                            var index = channels.indexOf(selectedChannel);
                            if (index >= 0) {
                                channels.splice(index, 1);
                                channels.splice(0, 0, selectedChannel);
                            }
                        }
                        _this.model.channels = channels;
                    }
                },
            },
            computed: {
                countAmount: function () {
                    if (_this.model.selectedCurrency == undefined)
                        return undefined;
                    _this.model.minRechargeAmount = _this.toFixed(_this.model.accountInfo.accountMoneyInfo.payminamount * _this.model.channels[0].price, 2);
                    var f = _this.model.amount / _this.model.channels[0].price;
                    if (!isNaN(f))
                        return _this.toFixed(f, 2);
                    else
                        return undefined;
                },
            }
        });
        _this.model.selectedCurrency = _this.model.currencyItems[0].name;
        _this.loadPrice(0);
        if (Recharge.IsCreditMode)
            _this.loadCoinPrice(0);
        _this.ReceivedAccountInfoAction = function (p) {
            _this.model.accountInfo = p;
            _this.model.minRechargeAmount = _this.toFixed(_this.model.accountInfo.accountMoneyInfo.payminamount * _this.model.channels[0].price, 2);
            ApiHelper.SupportedPayChannels.forEach(function (m) { return m.limit = _this.model.accountInfo.accountMoneyInfo.payminamount + "-7000"; });
        };
        if (Home.AccountInfo) {
            _this.ReceivedAccountInfoAction(Home.AccountInfo);
        }
        MessageCenter.register(MessageType.ReceivedAccountInfo, _this.ReceivedAccountInfoAction);
        return _this;
    }
    FiatRecharge.prototype.amountClick = function (value) {
        this.model.customAmount = "";
        this.model.amount = value;
    };
    FiatRecharge.prototype.dispose = function () {
        MessageCenter.unRegister(MessageType.ReceivedAccountInfo, this.ReceivedAccountInfoAction);
        _super.prototype.dispose.call(this);
    };
    FiatRecharge.prototype.channelClick = function (channel) {
        this.recordAction("Recharge_" + channel.name);
        var index = this.model.channels.indexOf(channel);
        if (index === 0)
            return;
        this.model.channels.splice(index, 1);
        this.model.channels.splice(0, 0, channel);
        this.model.expended = false;
    };
    FiatRecharge.prototype.loadCoinPrice = function (index) {
        var _this = this;
        if (this.disposed)
            return;
        this.model.isBusy++;
        AccountApi.GetRate(this, this.model.currencyItems[index].name, function (ret, err) {
            _this.model.isBusy--;
            if (err)
                setTimeout(function () { return _this.loadCoinPrice(index); }, 1000);
            else {
                _this.model.currencyItems[index].price = ret;
                index++;
                if (index == _this.model.currencyItems.length)
                    return;
                else
                    _this.loadCoinPrice(index);
            }
        });
    };
    /**获取充值渠道的汇率 */
    FiatRecharge.prototype.loadPrice = function (currentIndex) {
        var _this = this;
        if (this.disposed)
            return;
        this.model.isBusy++;
        PayCenterApi.GetPrice(this, "USDT", "CNY", 1, this.model.channels[currentIndex].id, function (ret, err) {
            _this.model.isBusy--;
            if (err) {
                setTimeout(function () { return _this.loadPrice(currentIndex); }, 1000);
            }
            else {
                _this.model.channels[currentIndex].price = ret;
                currentIndex++;
                if (currentIndex < _this.model.channels.length)
                    _this.loadPrice(currentIndex);
            }
        });
    };
    FiatRecharge.prototype.submit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var usdtvalue, func, ret, ret, e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.model.isBusy) return [3 /*break*/, 2];
                        return [4 /*yield*/, alertWindow(textRes.items['数据仍在加载中，请稍后再试'])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2:
                        this.model.isBusy++;
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 8, 9, 10]);
                        usdtvalue = null;
                        func = function (ret) {
                            var request = {
                                Amount: usdtvalue,
                                PayAmount: 0,
                                AppId: ApiHelper.PayCenterAppId,
                                ChannelId: ApiHelper.ChannelId,
                                CorderId: ret,
                                Currency: "CNY",
                                Language: HttpClient.defaultHeaders["Accept-Language"],
                                PayChannel: _this.model.channels[0].id,
                                Price: 0,
                                Ext: "",
                                ProductId: _this.model.selectedCurrency,
                                Stamp: new Date().getTime(),
                                Token: ApiHelper.CurrentTokenInfo.access_token
                            };
                            var url = AccountApi.BuildInMoneyUrl(request);
                            console.log(url);
                            if (false && isIOS) {
                                ApiHelper.openUrl(url);
                                navigation.pop(false);
                            }
                            else {
                                var web = new WebBrowser({
                                    fullScreen: false,
                                    src: url,
                                    useOpenFrame: true,
                                    title: Recharge.IsCreditMode ? textRes.items['充值信用资本'] : textRes.items['充值'],
                                });
                                if (!sessionStorage.getItem("alertOnRecharge")) {
                                    var action = function (component) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    if (!(component.constructor == WebBrowser)) return [3 /*break*/, 2];
                                                    sessionStorage.setItem("alertOnRecharge", "1");
                                                    navigation.removeEventListener(NavigationEvent.OnBeforePop, action);
                                                    return [4 /*yield*/, alertWindow(textRes.items['充值返回提示'])];
                                                case 1:
                                                    _a.sent();
                                                    return [2 /*return*/, true];
                                                case 2: return [2 /*return*/];
                                            }
                                        });
                                    }); };
                                    navigation.addEventListener(NavigationEvent.OnBeforePop, action);
                                }
                                navigation.push(web);
                            }
                        };
                        if (!Recharge.IsCreditMode) return [3 /*break*/, 5];
                        return [4 /*yield*/, AccountApi.PostCreditPayInMoney(this, this.model.amount, 2, "CNY", undefined, this.model.channels[0].channel, this.model.selectedCurrency)];
                    case 4:
                        ret = _a.sent();
                        console.log("coinNum:" + JSON.stringify(ret));
                        usdtvalue = ret.coinNum;
                        func(ret.orderid);
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, AccountApi.PostPayInMoney(this, this.model.amount, 2, "CNY", undefined, this.model.channels[0].channel)];
                    case 6:
                        ret = _a.sent();
                        console.log("coinNum:" + JSON.stringify(ret));
                        usdtvalue = ret.coinNum;
                        func(ret.orderid);
                        _a.label = 7;
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        e_1 = _a.sent();
                        showError(e_1);
                        return [3 /*break*/, 10];
                    case 9:
                        this.model.isBusy--;
                        return [7 /*endfinally*/];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    return FiatRecharge;
}(BaseComponent));
export { FiatRecharge };
//# sourceMappingURL=FiatRecharge.js.map