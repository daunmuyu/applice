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
import { showError } from "../../../Global";
import { AccountApi } from "../../../ServerApis/AccountApi";
import { ModelValidator, ValidateType } from "jack-one-script";
import { Recharge } from "./Recharge";
import { alertWindow } from "../../../GlobalFunc";
import { Home } from "../../Home";
import { MessageType, MessageCenter } from "../../../MessageCenter";
import { setTimeout } from "timers";
var qrcode = require("qrcode");
var html = require("./bbRecharge.html");
var BbRecharge = /** @class */ (function (_super) {
    __extends(BbRecharge, _super);
    function BbRecharge() {
        var _this = _super.call(this, html) || this;
        _this.model = {
            accountInfo: {
                "accountMoneyInfo": {
                    "payminamount": 0
                },
            },
            textRes: null,
            currencyItems: [
                { name: "ERC20-USDT", address: null, price: 1, WalletAddressType: 102, coin: "USDT", code: "ERC20_USDT", min: 1 },
                { name: "OMNI-USDT", address: null, price: 1, WalletAddressType: 2, coin: "USDT", code: "OMNI_USDT", min: 1 },
                { name: "BTC", address: null, price: null, WalletAddressType: 1, coin: "BTC", code: "BTC", min: 0.01, },
                { name: "ETH", address: null, price: null, WalletAddressType: 101, coin: "ETH", code: "ETH", min: 0.1 },
            ],
            selectedCurrency: "BTC",
            txid: "",
            amount: undefined,
            isBusy: false,
            validator: {},
        };
        if (Recharge.IsCreditMode) {
            //删除USDT
            var index = _this.model.currencyItems.findIndex(function (m) { return m.name.indexOf("USDT") >= 0; });
            if (index >= 0)
                _this.model.currencyItems.splice(index, 1);
            index = _this.model.currencyItems.findIndex(function (m) { return m.name.indexOf("USDT") >= 0; });
            if (index >= 0)
                _this.model.currencyItems.splice(index, 1);
        }
        else {
            //var index = this.model.currencyItems.findIndex(m => m.name == "EOS");
            //if (index >= 0)
            //    this.model.currencyItems.splice(index, 1);
        }
        _this.model.selectedCurrency = _this.model.currencyItems[0].name;
        _this.model.textRes = textRes;
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
            computed: {
                address: function () {
                    try {
                        _this.model.txid = _this.model.currencyItems.find(function (m) { return m.name === _this.model.selectedCurrency; }).address;
                        return _this.model.txid;
                    }
                    catch (e) {
                        return undefined;
                    }
                },
                usdtValue: function () {
                    try {
                        var val = parseFloat(_this.model.amount) * _this.model.currencyItems.find(function (m) { return m.name === _this.model.selectedCurrency; }).price;
                        if (!isNaN(val))
                            return val;
                        return undefined;
                    }
                    catch (e) {
                        return undefined;
                    }
                },
                calculatorText: function () {
                    if (_this.model.selectedCurrency === "EOS") {
                        var price = _this.model.currencyItems.find(function (m) { return m.name === _this.model.selectedCurrency; }).price;
                        price = Home.AccountInfo.accountMoneyInfo.payminamount / price;
                        price = parseFloat(_this.toFixed(price, 1, false, true)) + 0.1;
                        return price.toFixed(1) + " " + _this.model.selectedCurrency;
                    }
                    return _this.model.currencyItems.find(function (m) { return m.name === _this.model.selectedCurrency; }).min + " " + _this.model.selectedCurrency;
                    //if (this.model.selectedCurrency === "USDT") {
                    //    return Home.AccountInfo.accountMoneyInfo.payminamount + "USDT";
                    //}
                    //else {
                    //    var price = this.model.currencyItems.find(m => m.name === this.model.selectedCurrency).price;
                    //    price = Home.AccountInfo.accountMoneyInfo.payminamount / price;
                    //    if (this.model.selectedCurrency === "BTC") {
                    //        price = parseFloat(this.toFixed(price, 3, false, true)) + 0.001;
                    //        return price.toFixed(3) + "" + this.model.selectedCurrency;
                    //    }
                    //    else if (this.model.selectedCurrency.indexOf("USDT") >= 0) {
                    //        return this.toFixed(price, 0, false, true) + "USDT";
                    //    }
                    //    else {
                    //        price = parseFloat(this.toFixed(price, 1, false, true)) + 0.1;
                    //        return price.toFixed(1) + "" + this.model.selectedCurrency;
                    //    }
                    //    return Home.AccountInfo.accountMoneyInfo.payminamount + "USDT≈" + price + "" + this.model.selectedCurrency;
                    //}
                },
            },
            watch: {
                selectedCurrency: function () {
                    try {
                        _this.buildQRCode();
                    }
                    catch (e) {
                    }
                },
            },
        });
        _this.buildQRCode();
        _this.loadPrice(0);
        _this.ReceivedAccountInfoAction = function (p) {
            _this.model.accountInfo = p;
        };
        if (Home.AccountInfo) {
            _this.ReceivedAccountInfoAction(Home.AccountInfo);
        }
        MessageCenter.register(MessageType.ReceivedAccountInfo, _this.ReceivedAccountInfoAction);
        return _this;
    }
    BbRecharge.prototype.dispose = function () {
        MessageCenter.unRegister(MessageType.ReceivedAccountInfo, this.ReceivedAccountInfoAction);
        _super.prototype.dispose.call(this);
    };
    BbRecharge.prototype.loadPrice = function (currentIndex) {
        var _this = this;
        this.model.isBusy = currentIndex === 0;
        var item = this.model.currencyItems[currentIndex];
        if (item.price == 1) {
            this.model.isBusy = !(currentIndex === this.model.currencyItems.length - 1);
            if (this.model.isBusy) {
                this.loadPrice(currentIndex + 1);
            }
            return;
        }
        AccountApi.GetRate(this, item.name, function (ret, err) {
            if (err) {
                setTimeout(function () { return _this.loadPrice(currentIndex); }, 1000);
            }
            else {
                _this.model.isBusy = !(currentIndex === _this.model.currencyItems.length - 1);
                if (_this.model.isBusy) {
                    _this.loadPrice(currentIndex + 1);
                }
                _this.model.currencyItems[currentIndex].price = ret;
            }
        });
    };
    BbRecharge.prototype.screenShot = function () {
        var _this = this;
        var screenClip = window.api.require('screenClip');
        screenClip.screenShot({
            album: true
        }, function (ret, err) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!ret.status) return [3 /*break*/, 2];
                        return [4 /*yield*/, alertWindow(textRes.items["成功保存到相册"])];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); });
    };
    BbRecharge.prototype.copyAddress = function () {
        var _this = this;
        var clipBoard = window.api.require('clipBoard');
        clipBoard.set({
            value: this.model.currencyItems.filter(function (m) { return m.name === _this.model.selectedCurrency; })[0].address
        }, function (ret, err) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!ret) return [3 /*break*/, 2];
                        return [4 /*yield*/, alertWindow(textRes.items["成功复制"])];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        showError(err.msg);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    BbRecharge.prototype.buildQRCode = function () {
        return __awaiter(this, void 0, void 0, function () {
            var currencyItem, _a, e_1, ele;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.disposed)
                            return [2 /*return*/];
                        currencyItem = this.model.currencyItems.find(function (m) { return m.name === _this.model.selectedCurrency; });
                        if (!!currencyItem.address) return [3 /*break*/, 4];
                        this.model.isBusy = true;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        _a = currencyItem;
                        return [4 /*yield*/, AccountApi.GetCoinAddress(this, currencyItem.WalletAddressType, currencyItem.coin, currencyItem.code, Recharge.IsCreditMode ? 2 : 1)];
                    case 2:
                        _a.address = _b.sent();
                        this.model.isBusy = false;
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _b.sent();
                        console.error(e_1);
                        setTimeout(function () {
                            _this.buildQRCode();
                        }, 1000);
                        return [2 /*return*/];
                    case 4:
                        ele = this.element.querySelector("#canvgQrcode");
                        qrcode.toCanvas(ele, this.vm.address, {
                            width: 4 * window.__remConfig_flag,
                            height: 4 * window.__remConfig_flag,
                            margin: 0,
                        }, function (error) {
                            if (error)
                                showError(error);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    BbRecharge.prototype.submit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var selectedCurrency, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.model.isBusy) return [3 /*break*/, 2];
                        return [4 /*yield*/, alertWindow(textRes.items['数据仍在加载中，请稍后再试'])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2:
                        if (!ModelValidator.verifyToProperty(this.model, [
                            //{
                            //    propertyName: "txid"
                            //},
                            {
                                propertyName: "amount"
                            },
                            {
                                propertyName: "amount",
                                validateType: ValidateType.Number,
                            },
                        ], "validator"))
                            return [2 /*return*/];
                        this.model.isBusy = true;
                        selectedCurrency = this.model.selectedCurrency;
                        if (selectedCurrency.indexOf("USDT") >= 0)
                            selectedCurrency = "USDT";
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 10, 11, 12]);
                        if (!Recharge.IsCreditMode) return [3 /*break*/, 6];
                        return [4 /*yield*/, AccountApi.PostCreditPayInMoney(this, this.model.amount, 1, selectedCurrency, this.model.txid, 1, selectedCurrency)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, alertWindow(textRes.items['成功提交充值信息'])];
                    case 5:
                        _a.sent();
                        navigation.pop(false);
                        return [3 /*break*/, 9];
                    case 6: return [4 /*yield*/, AccountApi.PostPayInMoney(this, this.model.amount, 1, selectedCurrency, this.model.txid, 1)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, alertWindow(textRes.items['成功提交充值信息'])];
                    case 8:
                        _a.sent();
                        navigation.pop(false);
                        _a.label = 9;
                    case 9: return [3 /*break*/, 12];
                    case 10:
                        e_2 = _a.sent();
                        showError(e_2);
                        return [3 /*break*/, 12];
                    case 11:
                        this.model.isBusy = false;
                        return [7 /*endfinally*/];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    return BbRecharge;
}(BaseComponent));
export { BbRecharge };
//# sourceMappingURL=BbRecharge.js.map