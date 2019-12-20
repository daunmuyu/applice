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
import { showError } from "../../Global";
import { Recharge } from "./Recharge/Recharge";
import { CreditAccount } from "./CreditAccount";
import { Withdraw } from "./Withdraw/Withdraw";
import { AccountApi } from "../../ServerApis/AccountApi";
import { BillList } from "./DetailLists/BillList";
import { CreditBorrowList } from "./CreditBorrowList";
import { Home } from "../Home";
import { MessageType, MessageCenter } from "../../MessageCenter";
import { ShareInComeList } from "./DetailLists/ShareInComeList";
import { ModelValidator } from "jack-one-script";
import { ApiHelper } from "../../ServerApis/ApiHelper";
import { BalanceList } from "./DetailLists/BalanceList";
import { alertWindow } from "../../GlobalFunc";
var html = require("./assets.html");
var Assets = /** @class */ (function (_super) {
    __extends(Assets, _super);
    function Assets() {
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: null,
            /**是否划转的是余额宝*/
            isYEB: false,
            isDataReady: false,
            canTransAmount: undefined,
            isShowTransDialog: false,
            safeTop: "",
            isBusy: false,
            isVip: false,
            transAmount: undefined,
            validator: {},
            data: {
                balanceTreasure: {},
                distributionIncome: {}
            },
        };
        _this.model.textRes = textRes;
        if (window.api) {
            _this.model.safeTop = window.api.safeArea.top + "px";
        }
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
            watch: {
                isShowTransDialog: function (newValue) {
                    if (newValue == false) {
                        _this.model.isYEB = false;
                        _this.model.transAmount = undefined;
                    }
                },
            },
        });
        if (Home.AccountInfo) {
            _this.model.isVip = Home.AccountInfo.isVip;
        }
        else {
            MessageCenter.register(MessageType.ReceivedAccountInfo, function (p) {
                _this.model.isVip = p.isVip;
            });
        }
        MessageCenter.register(MessageType.Logout, function (p) {
            _this.model.isVip = false;
            _this.model.isDataReady = false;
            _this.model.data = {
                balanceTreasure: {},
                distributionIncome: {}
            };
        });
        return _this;
    }
    Object.defineProperty(Assets.prototype, "needLogin", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Assets.prototype.trans2account = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ret, ret, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.model.isBusy)
                            return [2 /*return*/];
                        if (!ModelValidator.verifyToProperty(this.model, [{ propertyName: "transAmount" }], "validator"))
                            return [2 /*return*/];
                        this.model.isBusy = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, 9, 10]);
                        if (!this.model.isYEB) return [3 /*break*/, 4];
                        this.recordAction("Assets_余额宝转入");
                        console.log("开始划转余额宝");
                        return [4 /*yield*/, AccountApi.CanusedInterestTransferCanusedAmount(this, this.model.transAmount)];
                    case 2:
                        ret = _a.sent();
                        this.loadData();
                        this.model.data.balanceTreasure.totalIncome -= this.model.transAmount;
                        return [4 /*yield*/, alertWindow(textRes.items["成功转入"])];
                    case 3:
                        _a.sent();
                        this.model.isShowTransDialog = false;
                        return [3 /*break*/, 7];
                    case 4:
                        if (this.model.isVip)
                            this.recordAction("Assets_VIP邀请收益转入");
                        else
                            this.recordAction("Assets_邀请收益转入");
                        console.log("开始划转余收益");
                        return [4 /*yield*/, AccountApi.CanusedIncomeTransferCanusedAmount(this, this.model.transAmount)];
                    case 5:
                        ret = _a.sent();
                        this.loadData();
                        this.model.data.distributionIncome.totalIncome -= this.model.transAmount;
                        return [4 /*yield*/, alertWindow(textRes.items["成功转入"])];
                    case 6:
                        _a.sent();
                        this.model.isShowTransDialog = false;
                        _a.label = 7;
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        e_1 = _a.sent();
                        showError(e_1);
                        return [3 /*break*/, 10];
                    case 9:
                        this.model.isBusy = false;
                        return [7 /*endfinally*/];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    Assets.prototype.loadData = function () {
        var _this = this;
        this.model.isBusy = true;
        AccountApi.GetTradeAssetsInfo(this, function (ret, err) {
            if (err) {
                setTimeout(function () { return _this.loadData(); }, 1000);
            }
            else {
                console.log(JSON.stringify(ret));
                _this.model.isBusy = false;
                _this.model.data = ret;
                _this.model.isDataReady = true;
            }
        });
    };
    Assets.prototype.shareInCome = function (listTotal, pageTotal) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(ApiHelper.CurrentTokenInfo && this.model.isBusy)) return [3 /*break*/, 2];
                        return [4 /*yield*/, alertWindow(textRes.items['数据仍在加载中，请稍后再试'])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2:
                        navigation.push(new ShareInComeList(listTotal, pageTotal));
                        return [2 /*return*/];
                }
            });
        });
    };
    Assets.prototype.onNavigationActived = function (isResume) {
        _super.prototype.onNavigationActived.call(this, isResume);
        this.recordPageStart("资产");
        this.loadData();
    };
    Assets.prototype.onNavigationUnActived = function (ispop) {
        _super.prototype.onNavigationUnActived.call(this, ispop);
        this.recordPageEnd("资产");
    };
    Assets.prototype.repay = function () {
        navigation.push(new CreditBorrowList());
    };
    Assets.prototype.borrow = function () {
        this.recordAction("Assets_我要借款");
        navigation.push(new CreditAccount());
    };
    Assets.prototype.balanceList = function () {
        navigation.push(new BalanceList());
    };
    Assets.prototype.billList = function () {
        navigation.push(new BillList());
    };
    Assets.prototype.rechargeClick = function () {
        if (!ApiHelper.checkCertificationStatus()) {
            return;
        }
        navigation.push(new Recharge());
    };
    Assets.prototype.withdrawClick = function () {
        this.recordAction("Assets_提现");
        if (!ApiHelper.checkCertificationStatus()) {
            return;
        }
        navigation.push(new Withdraw());
    };
    Assets.prototype.creaditAccountClick = function () {
        navigation.push(new CreditAccount());
    };
    return Assets;
}(BaseComponent));
export { Assets };
//# sourceMappingURL=Assets.js.map