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
import { AccountApi } from "../../../ServerApis/AccountApi";
import { setTimeout } from "timers";
import { MessageCenter, MessageType } from "../../../MessageCenter";
import { showError } from "../../../Global";
import { BindingAccount } from "../../My/bankAccount/BindingAccount";
import { CreditAccount } from "../CreditAccount";
import { ModelValidator } from "jack-one-script";
import { Home } from "../../Home";
import { EnterPayPassword } from "../../General/EnterPayPassword";
import { Withdraw } from "./Withdraw";
import { PayCenterApi } from "../../../ServerApis/PayCenterApi";
import { ApiHelper } from "../../../ServerApis/ApiHelper";
import { alertWindow } from "../../../GlobalFunc";
var html = require("./fiatWithdraw.html");
var FiatWithdraw = /** @class */ (function (_super) {
    __extends(FiatWithdraw, _super);
    function FiatWithdraw() {
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: {},
            payChannels: [],
            selectedPayChannel: 0,
            banks: null,
            selectedBankId: null,
            accountInfo: null,
            creditInfo: null,
            fee: undefined,
            minWithdraw: undefined,
            amount: undefined,
            /**提现费率 */
            ratio: undefined,
            isBusy: 0,
            /**成功后几秒返回，这个属性值大于0时，开始显示倒计时*/
            successedSeconds: 0,
            validator: {},
        };
        _this.model.payChannels = ApiHelper.SupportedPayChannels;
        _this.model.selectedPayChannel = _this.model.payChannels[0].id;
        _this.model.textRes = textRes;
        if (Withdraw.IsCreditMode) {
            if (CreditAccount.CreditInfo)
                _this.model.creditInfo = CreditAccount.CreditInfo;
            else {
                _this.loadCreditInfo();
            }
        }
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
            computed: {
                selectedBankDesc: function () {
                    try {
                        var bank = _this.model.banks.find(function (m) { return m.id == _this.model.selectedBankId; });
                        return bank.bankName + " " + _this.hidePhone(bank.bankNo);
                    }
                    catch (e) {
                        return "";
                    }
                },
                selectedPayChannelDesc: function () {
                    try {
                        var item = _this.model.payChannels.find(function (m) { return m.id == _this.model.selectedPayChannel; });
                        return item.name;
                    }
                    catch (e) {
                        return "";
                    }
                },
                canWithdrawAmout: function () {
                    try {
                        if (Withdraw.IsCreditMode)
                            return _this.toFixed(_this.model.creditInfo.canuseCreditMoney, 8, true, true);
                        else
                            return _this.toFixed(_this.model.accountInfo.accountMoneyInfo.canusedamount, 2, true, true);
                    }
                    catch (e) {
                        return undefined;
                    }
                },
                arrive: function () {
                    try {
                        console.log("this.model.amount:" + _this.model.amount + " " + ApiHelper.SupportedPayChannels[0].price);
                        var val = _this.model.amount - _this.model.fee;
                        var price = ApiHelper.SupportedPayChannels[0].price;
                        val = price * val;
                        if (isNaN(val))
                            return undefined;
                        return _this.toFixed(val, 2);
                    }
                    catch (e) {
                        return undefined;
                    }
                },
            },
        });
        _this.loadPrice(0);
        _this.loadBanks();
        _this.onUserAccountChanged = function () {
            _this.loadBanks();
        };
        //如果银行卡列表发生变化，那么，重新loadBanks
        MessageCenter.register(MessageType.BankAccountsChanged, _this.onUserAccountChanged);
        _this.onAccountInfo = function (accoutInfo) {
            _this.model.accountInfo = accoutInfo;
            _this.model.fee = _this.model.accountInfo.accountMoneyInfo.withdrawcoinpoundagenum;
            _this.model.minWithdraw = _this.model.accountInfo.accountMoneyInfo.minwithdrawcoinNum;
            _this.model.ratio = accoutInfo.accountMoneyInfo.withdrawcashpoundageratio;
        };
        if (Home.AccountInfo) {
            _this.onAccountInfo(Home.AccountInfo);
        }
        MessageCenter.register(MessageType.ReceivedAccountInfo, _this.onAccountInfo);
        return _this;
    }
    /**获取充值渠道的汇率 */
    FiatWithdraw.prototype.loadPrice = function (currentIndex) {
        var _this = this;
        this.model.isBusy++;
        PayCenterApi.GetPrice(this, "USDT", "CNY", 2, ApiHelper.SupportedPayChannels[currentIndex].id, function (ret, err) {
            _this.model.isBusy--;
            if (err)
                setTimeout(function () { return _this.loadPrice(currentIndex); }, 1000);
            else {
                ApiHelper.SupportedPayChannels[currentIndex].price = ret;
                currentIndex++;
                if (currentIndex < ApiHelper.SupportedPayChannels.length)
                    _this.loadPrice(currentIndex);
            }
        });
    };
    FiatWithdraw.prototype.loadCreditInfo = function () {
        var _this = this;
        this.model.isBusy++;
        AccountApi.GetCreditInfo(this, function (ret, err) {
            _this.model.isBusy--;
            if (err)
                setTimeout(function () { return _this.loadCreditInfo(); }, 1000);
            else {
                _this.model.creditInfo = ret;
            }
        });
    };
    FiatWithdraw.prototype.loadBanks = function () {
        var _this = this;
        this.model.isBusy++;
        AccountApi.GetPayoutBanks(this, function (ret, err) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!err) return [3 /*break*/, 1];
                        setTimeout(function () { return _this.loadBanks; }, 1000);
                        return [3 /*break*/, 4];
                    case 1:
                        this.model.isBusy--;
                        this.model.banks = ret;
                        if (!(ret.length > 0)) return [3 /*break*/, 2];
                        this.model.selectedBankId = ret[0].id;
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, alertWindow(textRes.items['请先绑定银行卡'])];
                    case 3:
                        _a.sent();
                        navigation.push(new BindingAccount());
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    FiatWithdraw.prototype.submit = function () {
        var _this = this;
        if (!ModelValidator.verifyToProperty(this.model, [
            {
                propertyName: "amount"
            },
            {
                propertyName: "selectedPayChannel"
            },
            {
                propertyName: "selectedBankId"
            }
        ], "validator")) {
            return;
        }
        navigation.push(new EnterPayPassword(textRes.items["请输入支付密码"], true, function (pwd) {
            if (pwd.length === 6) {
                navigation.pop(false);
                _this.model.isBusy++;
                var channel = _this.model.selectedPayChannel;
                if (Withdraw.IsCreditMode) {
                    AccountApi.PostCreditOutMoney(_this, _this.model.selectedBankId, pwd, _this.model.amount, 2, undefined, channel, "CNY", function (ret, err) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    this.model.isBusy--;
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
                    AccountApi.PostOutMoney(_this, _this.model.selectedBankId, channel, pwd, _this.model.amount, 2, undefined, function (ret, err) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    this.model.isBusy--;
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
    FiatWithdraw.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        MessageCenter.unRegister(MessageType.BankAccountsChanged, this.onUserAccountChanged);
        MessageCenter.unRegister(MessageType.ReceivedAccountInfo, this.onAccountInfo);
    };
    FiatWithdraw.prototype.backToPersonCenter = function () {
    };
    return FiatWithdraw;
}(BaseComponent));
export { FiatWithdraw };
//# sourceMappingURL=FiatWithdraw.js.map