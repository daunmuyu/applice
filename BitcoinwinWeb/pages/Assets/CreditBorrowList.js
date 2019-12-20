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
import { BaseComponent } from "../../BaseComponent";
import Vue from "vue";
import { AccountApi } from "../../ServerApis/AccountApi";
import { showError } from "../../Global";
import { setTimeout } from "timers";
import { ModelValidator } from "jack-one-script";
import { EnterPayPassword } from "../General/EnterPayPassword";
import { RepayList } from "./DetailLists/RepayList";
import { ConfirmWindow } from "../General/ConfirmWindow";
import { alertWindow } from "../../GlobalFunc";
var html = require("./creditBorrowList.html");
var CreditBorrowList = /** @class */ (function (_super) {
    __extends(CreditBorrowList, _super);
    function CreditBorrowList() {
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: null,
            isBusy: 0,
            /**可用余额 */
            available: undefined,
            repayItem: null,
            isRepayingAll: false,
            /**欠款总额*/
            loanAmount: undefined,
            repayAmount: undefined,
            /** 1: 余额还款 2：数字币还款*/
            repayMode: 1,
            /**还款币种*/
            selectedCurrency: "",
            validator: {},
            currencies: [],
            availableAmounts: [],
            approximatelyUSDT: [],
            datas: [],
            pageNumber: 1,
            hasMore: true,
            dataError: false,
        };
        _this.model.textRes = textRes;
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
            watch: {
                repayAmount: function (newValue) {
                    if (newValue) {
                        var index = newValue.indexOf(".");
                        if (index >= 0 && index < newValue.length - 3) {
                            _this.model.repayAmount = _this.toFixed(newValue, 2, true, true);
                        }
                    }
                },
            },
            computed: {
                moretext: function () {
                    if (_this.model.dataError)
                        return textRes.items["点击重新加载"];
                    else if (_this.model.isBusy)
                        return textRes.items["正在加载"] + "...";
                    else if (_this.model.hasMore)
                        return textRes.items["加载更多"];
                    else if (_this.model.datas.length == 0)
                        return textRes.items["目前还没有数据"];
                    else
                        return textRes.items["没有更多数据了"];
                },
                available2: function () {
                    try {
                        return _this.model.availableAmounts[_this.model.currencies.indexOf(_this.model.selectedCurrency)];
                    }
                    catch (e) {
                        return "";
                    }
                },
                needToPayCoin: function () {
                    if (isNaN(_this.model.repayAmount))
                        return "";
                    var approximatelyUSDT = _this.model.approximatelyUSDT[_this.model.currencies.indexOf(_this.model.selectedCurrency)];
                    if (isNaN(approximatelyUSDT))
                        return "";
                    return (_this.model.selectedCurrency == "USDT" ? "=" : "≈") + _this.clearZero((_this.model.repayAmount / approximatelyUSDT).toFixed(8));
                },
            },
        });
        return _this;
    }
    Object.defineProperty(CreditBorrowList.prototype, "needLogin", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    CreditBorrowList.prototype.getOverdays = function (item) {
        var freeDate = new Date(item.extData.InterestFreeTime);
        var overMillseconds = new Date().getTime() - freeDate.getTime();
        var days = window.parseInt(overMillseconds / (60000 * 60 * 24));
        if (overMillseconds % (60000 * 60 * 24) > 0)
            days++;
        return Math.max(0, days - 1);
    };
    CreditBorrowList.prototype.loadCreditInfo = function () {
        var _this = this;
        this.model.isBusy++;
        AccountApi.GetCreditInfo(this, function (ret, err) {
            if (err) {
                setTimeout(function () { return _this.loadCreditInfo(); }, 1000);
            }
            else {
                _this.model.isBusy--;
                var arr = ret.items.filter(function (m) { return m.coinNum; });
                arr.forEach(function (m, index) {
                    _this.model.currencies[index] = m.coin;
                    _this.model.availableAmounts[index] = m.coinNum;
                    _this.model.approximatelyUSDT[index] = m.approximatelyUSDT / m.coinNum;
                    if (index === 0)
                        _this.model.selectedCurrency = m.coin;
                });
            }
        });
    };
    CreditBorrowList.prototype.blankClick = function () {
    };
    CreditBorrowList.prototype.loadData = function () {
        var _this = this;
        if (this.model.isBusy || this.model.hasMore == false)
            return;
        this.model.isBusy++;
        this.model.dataError = false;
        if (this.model.pageNumber == 1) {
            this.model.datas = [];
            this.model.hasMore = true;
        }
        AccountApi.GetRepaymentList(this, this.model.pageNumber, 30, function (ret, err) {
            _this.model.isBusy--;
            if (err) {
                _this.model.dataError = true;
                showError(err);
            }
            else {
                console.log(JSON.stringify(ret));
                _this.model.pageNumber++;
                ret.forEach(function (m) {
                    //var date = this.getUTCTime(m.interestFreeTime);
                    //if ((date.getTime() - new Date().getTime()) / 1000 < 6 * 24 * 60 * 60) {
                    //    m.urgent = true;
                    //}
                    if (m.overdueDay > 0)
                        m.urgent = true;
                });
                for (var i = 0; i < ret.length; i++) {
                    _this.model.datas.push(ret[i]);
                }
                _this.model.hasMore = ret.length == 30;
            }
        });
    };
    CreditBorrowList.prototype.loadMore = function () {
        this.loadData();
    };
    CreditBorrowList.prototype.getAccountInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ret, e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.model.available = undefined;
                        this.model.isBusy++;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, AccountApi.GetAccountInfo(this)];
                    case 2:
                        ret = _a.sent();
                        this.model.available = ret.accountMoneyInfo.canusedamount;
                        return [3 /*break*/, 5];
                    case 3:
                        e_1 = _a.sent();
                        setTimeout(function () { return _this.getAccountInfo(); }, 1000);
                        return [3 /*break*/, 5];
                    case 4:
                        this.model.isBusy--;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    CreditBorrowList.prototype.repay = function (item) {
        this.getAccountInfo();
        this.model.repayAmount = undefined;
        this.model.repayItem = item;
    };
    CreditBorrowList.prototype.repayall = function () {
        return __awaiter(this, void 0, void 0, function () {
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
                        this.getAccountInfo();
                        this.model.isRepayingAll = true;
                        this.model.isBusy++;
                        AccountApi.GetTradeAssetsInfo(this, function (ret, err) {
                            _this.model.isBusy--;
                            if (err)
                                showError(err);
                            else {
                                _this.model.loanAmount = ret.loanAmount;
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    CreditBorrowList.prototype.submitRepayAll = function () {
        var _this = this;
        navigation.push(new ConfirmWindow([
            textRes.items["借款数量"] + " (USDT)",
            textRes.items["还款数量"] + " (USDT)",
        ], [
            this.model.loanAmount,
            this.model.loanAmount,
        ], function () {
            navigation.push(new EnterPayPassword(textRes.items['请输入支付密码'], true, function (pwd) {
                if (pwd.length === 6) {
                    navigation.pop(false);
                    _this.model.isBusy++;
                    AccountApi.ReturnCreditMoney(_this, _this.model.repayMode, pwd, undefined, _this.model.selectedCurrency, _this.model.loanAmount, function (ret, err) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    this.model.isBusy--;
                                    if (!err) return [3 /*break*/, 1];
                                    showError(err);
                                    return [3 /*break*/, 3];
                                case 1: return [4 /*yield*/, alertWindow(textRes.items['成功还款'])];
                                case 2:
                                    _a.sent();
                                    this.model.datas.splice(0, this.model.datas.length);
                                    this.model.isRepayingAll = false;
                                    _a.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                }
            }));
        }));
    };
    CreditBorrowList.prototype.listClick = function () {
        navigation.push(new RepayList());
    };
    CreditBorrowList.prototype.submitRepay = function () {
        var _this = this;
        if (!ModelValidator.verifyToProperty(this.model, [
            {
                propertyName: "repayAmount"
            }
        ], "validator"))
            return;
        navigation.push(new ConfirmWindow([
            textRes.items["借款数量"] + " (USDT)",
            textRes.items["还款数量"] + " (USDT)",
            this.model.repayItem.overdueDay > 0 ? textRes.items["逾期天数"] : null
        ], [
            this.model.repayItem.amount,
            this.model.repayAmount,
            textRes.getItem("n天", this.model.repayItem.overdueDay, "s")
        ], function () {
            navigation.push(new EnterPayPassword(textRes.items['请输入支付密码'], true, function (pwd) {
                if (pwd.length === 6) {
                    navigation.pop(false);
                    _this.model.isBusy++;
                    AccountApi.ReturnCreditMoney(_this, _this.model.repayMode, pwd, _this.model.repayItem.id, _this.model.selectedCurrency, _this.model.repayAmount, function (ret, err) { return __awaiter(_this, void 0, void 0, function () {
                        var index;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    this.model.isBusy--;
                                    if (!err) return [3 /*break*/, 1];
                                    showError(err);
                                    return [3 /*break*/, 3];
                                case 1: return [4 /*yield*/, alertWindow(textRes.items['成功还款'])];
                                case 2:
                                    _a.sent();
                                    if (this.model.repayAmount >= this.model.repayItem.amount) {
                                        index = this.model.datas.indexOf(this.model.repayItem);
                                        this.model.datas.splice(index, 1);
                                    }
                                    else {
                                        this.model.repayItem.amount -= this.model.repayAmount;
                                    }
                                    this.model.repayItem = null;
                                    _a.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                }
            }));
        }));
    };
    CreditBorrowList.prototype.onNavigationActived = function (isResume) {
        _super.prototype.onNavigationActived.call(this, isResume);
        this.loadData();
        this.loadCreditInfo();
    };
    return CreditBorrowList;
}(BaseComponent));
export { CreditBorrowList };
//# sourceMappingURL=CreditBorrowList.js.map