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
import { MessageCenter, MessageType } from "../../MessageCenter";
import { FriendList } from "./FriendList";
import { ApiHelper } from "../../ServerApis/ApiHelper";
import { shareImageReview, alertWindow } from "../../GlobalFunc";
import { Home } from "../Home";
var qrcode = require("qrcode");
var html = require("./popularize.html");
var Popularize = /** @class */ (function (_super) {
    __extends(Popularize, _super);
    function Popularize() {
        var _this = _super.call(this, html) || this;
        _this.model = {
            isBusy: 0,
            textRes: {},
            isShowedPanel: undefined,
            tradeAssetInfo: {},
            accountInfo: {
                "accountMoneyInfo": {}
            }
        };
        _this.model.textRes = textRes;
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
        });
        _this.loginedAction = function (p) {
            _this.loaddata();
        };
        MessageCenter.register(MessageType.Logined, _this.loginedAction);
        return _this;
    }
    Object.defineProperty(Popularize.prototype, "needLogin", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Popularize.prototype.showPanel = function () {
        if (this.model.isShowedPanel == undefined)
            this.model.isShowedPanel = false;
        this.model.isShowedPanel = !this.model.isShowedPanel;
    };
    Popularize.prototype.onNavigationPushed = function () {
        _super.prototype.onNavigationPushed.call(this);
        this.getTradeAssetsInfo();
        this.loaddata();
    };
    Popularize.prototype.friendList = function () {
        navigation.push(new FriendList());
    };
    Popularize.prototype.friendInComeList = function () {
        //navigation.push(new ShareInComeList(undefined));
    };
    Popularize.prototype.onNavigationPoped = function () {
        _super.prototype.onNavigationPoped.call(this);
        MessageCenter.unRegister(MessageType.Logined, this.loginedAction);
    };
    Popularize.prototype.screenShot = function () {
        return __awaiter(this, void 0, void 0, function () {
            var url, e_1, ret, e_2, module;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.model.isBusy)
                            return [2 /*return*/];
                        this.model.isBusy++;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 2, , 7]);
                        url = encodeURIComponent(Home.AccountInfo.accountMoneyInfo.registerurl);
                        return [3 /*break*/, 7];
                    case 2:
                        e_1 = _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, AccountApi.GetAccountInfo(this)];
                    case 4:
                        ret = _a.sent();
                        Home.AccountInfo = ret;
                        url = encodeURIComponent(ret.accountMoneyInfo.registerurl);
                        return [3 /*break*/, 6];
                    case 5:
                        e_2 = _a.sent();
                        showError(e_2);
                        this.model.isBusy--;
                        return [2 /*return*/];
                    case 6: return [3 /*break*/, 7];
                    case 7:
                        module = window.api.require('kLine');
                        console.log(ApiHelper.ResourceAddress + "/share/" + textRes.langName.replace("-", "_") + "/tuiguang.html?url=" + url);
                        module.saveWebImage({
                            w: 750,
                            h: 1285,
                            waitForReady: true,
                            url: ApiHelper.ResourceAddress + "/share/" + textRes.langName.replace("-", "_") + "/tuiguang.html?url=" + url,
                        }, function (ret, err) {
                            if (err) {
                                _this.model.isBusy--;
                                if (_this.actived)
                                    showError(err);
                            }
                            else if (ret.status == 1) {
                                _this.model.isBusy--;
                                if (_this.actived)
                                    shareImageReview(ret.data);
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    Popularize.prototype.trans2account = function () {
        return __awaiter(this, void 0, void 0, function () {
            var amount, ret, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.model.isBusy)
                            return [2 /*return*/];
                        this.model.isBusy++;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, 5, 6]);
                        amount = this.model.accountInfo.accountMoneyInfo.canusedincome;
                        return [4 /*yield*/, AccountApi.CanusedIncomeTransferCanusedAmount(this, amount)];
                    case 2:
                        ret = _a.sent();
                        this.model.accountInfo.accountMoneyInfo.canusedincome -= amount;
                        return [4 /*yield*/, alertWindow(textRes.items["成功转入"])];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        e_3 = _a.sent();
                        showError(e_3);
                        return [3 /*break*/, 6];
                    case 5:
                        this.model.isBusy--;
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Popularize.prototype.getContentText = function () {
        try {
            if (this.model.accountInfo.accountMoneyInfo.distributionFirstTradeCommission == undefined) {
                return "";
            }
            if (this.model.accountInfo.accountMoneyInfo.distributionFirstTradeCommission > 0) {
                return textRes.getItem('推广员升级规则_内容_VIP', this.model.tradeAssetInfo.distributionIncome.inviteFriendsAnnual + "%", this.model.tradeAssetInfo.distributionIncome.friendsShareGiftsAnnual + "%", this.model.tradeAssetInfo.distributionIncome.inviteFriendsCommissionRate + "%", this.model.tradeAssetInfo.distributionIncome.friendsShareGiftsCommissionRate + "%").replace(/\n/g, '<br>');
            }
            else {
                return textRes.getItem('推广员升级规则_内容', this.model.tradeAssetInfo.distributionIncome.inviteFriendsAnnual + '%', this.model.tradeAssetInfo.distributionIncome.friendsShareGiftsAnnual + '%').replace(/\n/g, '<br>');
            }
        }
        catch (e) {
            return "";
        }
    };
    Popularize.prototype.loaddata = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ret, ele, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.model.isBusy++;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, AccountApi.GetAccountInfo(this)];
                    case 2:
                        ret = _a.sent();
                        MessageCenter.unRegister(MessageType.Logined, this.loginedAction);
                        this.model.accountInfo = ret;
                        if (this.model.isShowedPanel == undefined && this.model.accountInfo.accountMoneyInfo.totalfriendcount > 0) {
                            this.model.isShowedPanel = true;
                        }
                        ele = this.element.querySelector("#canvgQrcode");
                        qrcode.toCanvas(ele, this.model.accountInfo.accountMoneyInfo.registerurl, {
                            width: ele.offsetWidth,
                            height: ele.offsetHeight,
                            margin: 0,
                        }, function (error) {
                            if (error)
                                showError(error);
                        });
                        return [3 /*break*/, 5];
                    case 3:
                        e_4 = _a.sent();
                        showError(e_4);
                        return [3 /*break*/, 5];
                    case 4:
                        this.model.isBusy--;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Popularize.prototype.getTradeAssetsInfo = function () {
        var _this = this;
        this.model.isBusy++;
        AccountApi.GetTradeAssetsInfo(this, function (ret, err) {
            if (err) {
                setTimeout(function () { return _this.getTradeAssetsInfo(); }, 1000);
            }
            else {
                console.log(JSON.stringify(ret));
                _this.model.isBusy--;
                _this.model.tradeAssetInfo = ret;
            }
        });
    };
    return Popularize;
}(BaseComponent));
export { Popularize };
//# sourceMappingURL=Popularize.js.map