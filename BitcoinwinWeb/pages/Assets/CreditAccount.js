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
import { Recharge } from "./Recharge/Recharge";
import { Withdraw } from "./Withdraw/Withdraw";
import { CreditBorrowList } from "./CreditBorrowList";
import { CreditFlowList } from "./DetailLists/CreditFlowList";
import { CreditRechargeList } from "./DetailLists/CreditRechargeList";
import { ApiHelper } from "../../ServerApis/ApiHelper";
import { ModelValidator } from "jack-one-script";
import { ConfirmWindow } from "../General/ConfirmWindow";
import { WebBrowser } from "../WebBrowser";
import { alertWindow } from "../../GlobalFunc";
var html = require("./creditAccount.html");
var CreditAccount = /** @class */ (function (_super) {
    __extends(CreditAccount, _super);
    function CreditAccount() {
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: null,
            isBusy: true,
            creditInfo: {},
            isShowBorrowDialog: false,
            borrowAmount: undefined,
            validator: {},
        };
        _this.model.textRes = textRes;
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
            watch: {
                borrowAmount: function (newValue) {
                    if (newValue) {
                        var index = newValue.indexOf(".");
                        if (index >= 0 && index < newValue.length - 3) {
                            _this.model.borrowAmount = _this.toFixed(newValue, 2, true, true);
                        }
                    }
                },
            },
        });
        return _this;
    }
    Object.defineProperty(CreditAccount.prototype, "needLogin", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    CreditAccount.prototype.loadData = function () {
        var _this = this;
        this.model.isBusy = true;
        AccountApi.GetCreditInfo(this, function (ret, err) {
            if (err) {
                setTimeout(function () { return _this.loadData(); }, 1000);
            }
            else {
                _this.model.isBusy = false;
                _this.model.creditInfo = ret;
                CreditAccount.CreditInfo = ret;
            }
        });
    };
    CreditAccount.prototype.ruleClick = function () {
        this.recordAction("Credit_帮助");
        var page = new WebBrowser({
            src: ApiHelper.ResourceAddress + "/asset/index." + this.model.textRes.langName.replace("-", "_") + ".html",
            fullScreen: false,
            title: this.model.textRes.items["信用资本"]
        });
        navigation.push(page);
    };
    CreditAccount.prototype.creditRechargeList = function () {
        navigation.push(new CreditRechargeList());
    };
    CreditAccount.prototype.blankClick = function () {
    };
    CreditAccount.prototype.rechargeHistory = function () {
        this.recordAction("Credit_历史记录");
        navigation.push(new CreditFlowList());
    };
    CreditAccount.prototype.recharge = function () {
        if (!ApiHelper.checkCertificationStatus())
            return;
        navigation.push(new Recharge(true));
    };
    CreditAccount.prototype.withdraw = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.model.isBusy) return [3 /*break*/, 2];
                        return [4 /*yield*/, alertWindow("数据仍在加载中，请稍后再试")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2:
                        if (!(CreditAccount.CreditInfo.items.some(function (m) { return m.coinNum > 0; }) == false)) return [3 /*break*/, 4];
                        return [4 /*yield*/, alertWindow(textRes.items["没有可用的信用资本可以提现"])];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                    case 4:
                        if (!ApiHelper.checkCertificationStatus())
                            return [2 /*return*/];
                        navigation.push(new Withdraw(true));
                        return [2 /*return*/];
                }
            });
        });
    };
    CreditAccount.prototype.showBorrowDialog = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.model.isBusy) return [3 /*break*/, 3];
                        if (!(this.model.creditInfo.canuseCreditMoney < 0.01)) return [3 /*break*/, 2];
                        return [4 /*yield*/, alertWindow(textRes.items["您的信用额度已被全部取用，需还款后可再度借用哦！"])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2:
                        this.model.isShowBorrowDialog = true;
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CreditAccount.prototype.submitBorrow = function () {
        var _this = this;
        if (!ModelValidator.verifyToProperty(this.model, [
            { propertyName: "borrowAmount" }
        ], "validator"))
            return;
        navigation.push(new ConfirmWindow([textRes.items["借款数量"] + " (USDT)"], [this.model.borrowAmount], function () {
            _this.model.isBusy = true;
            AccountApi.BorrowCreditMoney(_this, _this.model.borrowAmount, function (ret, err) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.model.isBusy = false;
                            if (!err) return [3 /*break*/, 1];
                            showError(err);
                            return [3 /*break*/, 3];
                        case 1: return [4 /*yield*/, alertWindow(textRes.items['借款成功'])];
                        case 2:
                            _a.sent();
                            this.loadData();
                            this.model.borrowAmount = undefined;
                            this.model.isShowBorrowDialog = false;
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
        }));
    };
    CreditAccount.prototype.repay = function () {
        navigation.push(new CreditBorrowList());
    };
    CreditAccount.prototype.onNavigationActived = function (isResume) {
        _super.prototype.onNavigationActived.call(this, isResume);
        this.loadData();
    };
    return CreditAccount;
}(BaseComponent));
export { CreditAccount };
//# sourceMappingURL=CreditAccount.js.map