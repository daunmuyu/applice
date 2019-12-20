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
import { Withdraw } from "./Withdraw";
import { AccountApi } from "../../../ServerApis/AccountApi";
import { showError } from "../../../Global";
import { setTimeout } from "timers";
import { CreditAccount } from "../CreditAccount";
import { ModelValidator } from "jack-one-script";
import { EnterPayPassword } from "../../General/EnterPayPassword";
import { alertWindow } from "../../../GlobalFunc";
var html = require("./bbWithdraw.html");
var BbWithdraw = /** @class */ (function (_super) {
    __extends(BbWithdraw, _super);
    function BbWithdraw() {
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: {},
            currencies: [],
            availableAmounts: [],
            approximatelyUSDT: [],
            selectedCurrency: "",
            address: "",
            amount: undefined,
            fee: undefined,
            minWithdraw: undefined,
            bbmaxwithdrawcoinnum: undefined,
            isBusy: false,
            /**成功后几秒返回，这个属性值大于0时，开始显示倒计时*/
            successedSeconds: 0,
            validator: {},
        };
        if (Withdraw.IsCreditMode) {
            _this.model.currencies = [];
            var arr = CreditAccount.CreditInfo.items.filter(function (m) { return m.coinNum; });
            arr.forEach(function (m, index) {
                _this.model.currencies[index] = m.coin;
                _this.model.availableAmounts[index] = m.coinNum;
                _this.model.approximatelyUSDT[index] = m.approximatelyUSDT / m.coinNum;
            });
        }
        else {
            _this.model.currencies = ["USDT"];
        }
        _this.loadAccountInfo();
        _this.model.textRes = textRes;
        if (_this.model.currencies.length > 0)
            _this.model.selectedCurrency = _this.model.currencies[0];
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
            computed: {
                available: function () {
                    try {
                        if (Withdraw.IsCreditMode) {
                            return _this.toFixed(_this.model.availableAmounts[_this.model.currencies.indexOf(_this.model.selectedCurrency)], 8, true, true);
                        }
                        else
                            return _this.toFixed(_this.model.availableAmounts[_this.model.currencies.indexOf(_this.model.selectedCurrency)], 2, true, true);
                    }
                    catch (e) {
                        return "";
                    }
                },
                arrive: function () {
                    if (!_this.model.amount)
                        return "";
                    try {
                        if (Withdraw.IsCreditMode) {
                            var approximatelyUSDT = _this.model.approximatelyUSDT[_this.model.currencies.indexOf(_this.model.selectedCurrency)];
                            var val = (_this.model.amount * approximatelyUSDT - _this.model.fee) / approximatelyUSDT;
                            if (!isNaN(val))
                                return (_this.model.selectedCurrency == "USDT" ? "" : "≈") + val;
                        }
                        else {
                            var val = _this.model.amount - _this.model.fee;
                            if (!isNaN(val))
                                return val;
                        }
                        return "";
                    }
                    catch (e) {
                        return "";
                    }
                },
                withDrawFee: function () {
                    if (_this.model.selectedCurrency.indexOf("USDT") >= 0)
                        return _this.model.minWithdraw;
                    var approximatelyUSDT = _this.model.approximatelyUSDT[_this.model.currencies.indexOf(_this.model.selectedCurrency)];
                    var price = _this.model.minWithdraw / approximatelyUSDT;
                    if (_this.model.selectedCurrency === "BTC") {
                        price = parseFloat(_this.toFixed(price, 3, false, true)) + 0.001;
                        return price.toFixed(3);
                    }
                    else {
                        price = parseFloat(_this.toFixed(price, 1, false, true)) + 0.1;
                        return price.toFixed(1);
                    }
                },
            },
        });
        return _this;
    }
    BbWithdraw.prototype.loadAccountInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ret, e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.model.isBusy = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, AccountApi.GetAccountInfo(this)];
                    case 2:
                        ret = _a.sent();
                        this.model.isBusy = false;
                        this.model.fee = ret.accountMoneyInfo.withdrawcoinpoundagenum;
                        this.model.minWithdraw = ret.accountMoneyInfo.minwithdrawcoinNum;
                        this.model.bbmaxwithdrawcoinnum = ret.accountMoneyInfo.bbmaxwithdrawcoinnum;
                        if (!Withdraw.IsCreditMode) {
                            this.model.availableAmounts = [ret.accountMoneyInfo.canusedamount];
                        }
                        return [3 /*break*/, 5];
                    case 3:
                        e_1 = _a.sent();
                        setTimeout(function () { return _this.loadAccountInfo(); }, 1000);
                        return [3 /*break*/, 5];
                    case 4:
                        this.model.isBusy = false;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    BbWithdraw.prototype.submit = function () {
        var _this = this;
        if (!ModelValidator.verifyToProperty(this.model, [
            {
                propertyName: "amount"
            },
            {
                propertyName: "address"
            }
        ], "validator")) {
            return;
        }
        navigation.push(new EnterPayPassword(textRes.items["请输入支付密码"], true, function (pwd) {
            if (pwd.length === 6) {
                navigation.pop(false);
                _this.model.isBusy = true;
                if (Withdraw.IsCreditMode) {
                    AccountApi.PostCreditOutMoney(_this, undefined, pwd, _this.model.amount, 1, _this.model.address, 1, _this.model.selectedCurrency, function (ret, err) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    this.model.isBusy = false;
                                    if (!err) return [3 /*break*/, 1];
                                    showError(err);
                                    return [3 /*break*/, 3];
                                case 1: return [4 /*yield*/, alertWindow(textRes.items['成功提交申请等候审批'])];
                                case 2:
                                    _a.sent();
                                    navigation.pop();
                                    _a.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                }
                else {
                    AccountApi.PostOutMoney(_this, undefined, 1, pwd, _this.model.amount, 1, _this.model.address, function (ret, err) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    this.model.isBusy = false;
                                    if (!err) return [3 /*break*/, 1];
                                    showError(err);
                                    return [3 /*break*/, 3];
                                case 1: return [4 /*yield*/, alertWindow(textRes.items['成功提交申请等候审批'])];
                                case 2:
                                    _a.sent();
                                    navigation.pop();
                                    _a.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                }
            }
        }), false);
    };
    return BbWithdraw;
}(BaseComponent));
export { BbWithdraw };
//# sourceMappingURL=BbWithdraw.js.map