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
import { BaseComponent, StatusBarStyle } from "../../BaseComponent";
import Vue from "vue";
import { TradeApi } from "../../ServerApis/TradeApi";
import { showError } from "../../Global";
import { SetProfitLoss } from "./SetProfitLoss";
import { CommodityDetail } from "../CommodityDetail/CommodityDetail";
import { ApiHelper } from "../../ServerApis/ApiHelper";
import { MessageCenter, MessageType } from "../../MessageCenter";
import { TradeHistory } from "./TradeHistory";
import { DelegateOrders } from "./DelegateOrders";
import { MainPage } from "../MainPage";
import { ModelValidator } from "jack-one-script";
import { shareImageReview, confirmWindow } from "../../GlobalFunc";
import { Home } from "../Home";
import { AccountApi } from "../../ServerApis/AccountApi";
import { AlertWindow } from "../General/AlertWindow";
var html = require("./position.html");
var Position = /** @class */ (function (_super) {
    __extends(Position, _super);
    function Position(showtitle) {
        if (showtitle === void 0) { showtitle = true; }
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: {},
            isDemoMode: false,
            isBusy: true,
            isBusy2: false,
            isAdditionalMargin: false,
            additionalMargin: undefined,
            targetPrice: undefined,
            isReductionMargin: false,
            showTitle: true,
            ListInfo: {
                totalamount: "--",
                totalprofit: "--",
                canusedamount: "--",
                frozenamout: "--",
                totalposprice: "--",
                toatlfinancingamount: "--",
                list: [],
            },
            validator: {},
        };
        _this._titleClickCount = 0;
        _this._titleClickTime = new Date().getTime();
        _this.timer = 0;
        _this.model.isDemoMode = ApiHelper.IsDemoMode;
        _this.model.showTitle = showtitle;
        _this.model.textRes = window.textRes;
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
            computed: {
                isDemo: function () { return ApiHelper.isDemoMode(); },
                canCloseAllOrder: function () { return _this.model.ListInfo.list.some(function (m) { return m.opType != 2; }); },
            },
            errorCaptured: function (err, vm, info) {
                alert(JSON.stringify([err, info]));
                return false;
            },
            watch: {
                additionalMargin: function (newValue) {
                    if (!newValue) {
                        _this.model.targetPrice = undefined;
                    }
                    else {
                        if (newValue.indexOf(".") >= 0) {
                            _this.model.additionalMargin = _this.toFixed(newValue, 0, true, true);
                            return;
                        }
                        var item = _this.model.isAdditionalMargin || _this.model.isReductionMargin;
                        newValue = parseFloat(newValue);
                        if (_this.model.isAdditionalMargin)
                            newValue += item.marginplus;
                        else
                            newValue = item.marginplus - newValue;
                        var stopProfitOrLoss = (item.margin + newValue) * (item.closerate - 1);
                        var targetPrice = 0;
                        if (item.bstype == 1) {
                            targetPrice = stopProfitOrLoss / (item.margin * item.leverage) * item.buyprice + item.buyprice;
                        }
                        else {
                            targetPrice = item.buyprice - stopProfitOrLoss / (item.margin * item.leverage) * item.buyprice;
                        }
                        var commodity = ApiHelper.getDescription(item.symbol);
                        _this.model.targetPrice = _this.toFixed(targetPrice, commodity.decimalplace, true, true);
                    }
                },
            },
        });
        MessageCenter.register(MessageType.Logout, function (p) {
            _this.model.ListInfo = {
                totalamount: "--",
                totalprofit: "--",
                canusedamount: "--",
                frozenamout: "--",
                totalposprice: "--",
                toatlfinancingamount: "--",
                list: [],
            };
        });
        return _this;
    }
    Object.defineProperty(Position.prototype, "statusBarStyle", {
        get: function () {
            return StatusBarStyle.Light;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Position.prototype, "needLogin", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Position.prototype.titleClick = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!ApiHelper.IsDemoMode)
                    return [2 /*return*/];
                return [2 /*return*/];
            });
        });
    };
    Position.prototype.go2CommodityClick = function (item) {
        var page = new CommodityDetail(ApiHelper.getDescription(item.symbol));
        navigation.push(page);
    };
    Position.prototype.delegateClick = function () {
        this.recordAction("Position_委托");
        navigation.push(new DelegateOrders());
    };
    Position.prototype.go2quotation = function () {
        MainPage.instance.activeQuotation();
    };
    Position.prototype.closeAllOrder = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.recordAction("Position_一键平仓");
                        if (this.model.isBusy)
                            return [2 /*return*/];
                        return [4 /*yield*/, confirmWindow(this.model.textRes.items["确定要关闭所有持仓吗"])];
                    case 1:
                        if (_a.sent()) {
                            clearTimeout(this.timer);
                            this.model.isBusy = true;
                            TradeApi.OnekeyClosePostion(this, event.clientX, event.clientY, function (ret, err) {
                                _this.model.isBusy = false;
                                if (err)
                                    showError(err);
                                else {
                                    _this.closeAllOrder_step2();
                                }
                                _this.timer = setTimeout(function () { return _this.refreshList(); }, 3000);
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Position.prototype.closeAllOrder_step2 = function () {
        var _this = this;
        var hasError = false;
        var startTime = new Date().getTime();
        this.alertWin = new AlertWindow();
        this.alertWin.model.content = textRes.items["正在平仓"] + "...";
        this.alertWin.model.isBusy++;
        this.alertWin.element.style.position = "absolute";
        this.alertWin.element.style.left = "0px";
        this.alertWin.element.style.top = "0px";
        this.alertWin.setParent(document.body);
        var checkOrderAction = function () { return __awaiter(_this, void 0, void 0, function () {
            var i, status, i, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (hasError && (new Date().getTime() - startTime) >= 20000) {
                            toast(textRes.items['网络异常，请检查您的网络连接'], 3);
                            for (i = 0; i < this.model.ListInfo.list.length; i++) {
                                if (this.model.ListInfo.list[i].opType != 2) {
                                    this.model.ListInfo.list.splice(i, 1);
                                    i--;
                                }
                            }
                            this.alertWin.dispose();
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, TradeApi.checkAllCloseOrderStatus(this)];
                    case 2:
                        status = _a.sent();
                        if (status == 0) {
                            for (i = 0; i < this.model.ListInfo.list.length; i++) {
                                if (this.model.ListInfo.list[i].opType != 2) {
                                    this.model.ListInfo.list.splice(i, 1);
                                    i--;
                                }
                            }
                            this.alertWin.dispose();
                            toast(textRes.items['平仓成功'], 3);
                            return [2 /*return*/];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        hasError = true;
                        return [3 /*break*/, 4];
                    case 4:
                        setTimeout(function () {
                            checkOrderAction();
                        }, 1000);
                        return [2 /*return*/];
                }
            });
        }); };
        setTimeout(function () {
            checkOrderAction();
        }, 1000);
    };
    /**追加保证金 */
    Position.prototype.additionalMarginClick = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.model.isBusy)
                            return [2 /*return*/];
                        if (!ModelValidator.verifyToProperty(this.model, [
                            { propertyName: "additionalMargin" }
                        ], "validator"))
                            return [2 /*return*/];
                        this.model.isBusy = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, TradeApi.AppendMargin(this, this.model.isAdditionalMargin.posid, this.model.additionalMargin)];
                    case 2:
                        _a.sent();
                        //this.model.isAdditionalMargin就是当前的数据item
                        this.model.isAdditionalMargin.marginplus = parseFloat(this.model.isAdditionalMargin.marginplus) + parseFloat(this.model.additionalMargin);
                        this.model.isAdditionalMargin.forcecloseprice = this.model.targetPrice;
                        this.model.isAdditionalMargin = false;
                        this.model.additionalMargin = undefined;
                        return [3 /*break*/, 5];
                    case 3:
                        e_2 = _a.sent();
                        showError(e_2);
                        return [3 /*break*/, 5];
                    case 4:
                        this.model.isBusy = false;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**减少保证金 */
    Position.prototype.reduceMarginClick = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.model.isBusy)
                            return [2 /*return*/];
                        if (!ModelValidator.verifyToProperty(this.model, [
                            { propertyName: "additionalMargin" }
                        ], "validator"))
                            return [2 /*return*/];
                        this.model.isBusy = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, TradeApi.ReduceMargin(this, this.model.isReductionMargin.posid, this.model.additionalMargin)];
                    case 2:
                        _a.sent();
                        //this.model.isReductionMargin 就是当前的数据item
                        this.model.isReductionMargin.marginplus = parseFloat(this.model.isReductionMargin.marginplus) - parseFloat(this.model.additionalMargin);
                        this.model.isReductionMargin.forcecloseprice = this.model.targetPrice;
                        this.model.isReductionMargin = false;
                        this.model.additionalMargin = undefined;
                        return [3 /*break*/, 5];
                    case 3:
                        e_3 = _a.sent();
                        showError(e_3);
                        return [3 /*break*/, 5];
                    case 4:
                        this.model.isBusy = false;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Position.prototype.closeOrder = function (event, item) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.model.isBusy)
                            return [2 /*return*/];
                        return [4 /*yield*/, confirmWindow(this.model.textRes.items["确定平仓吗"])];
                    case 1:
                        if (_a.sent()) {
                            clearTimeout(this.timer);
                            this.model.isBusy = true;
                            TradeApi.PostClosepostion(this, event.clientX, event.clientY, item.posid, item.ordertype, function (ret, err) {
                                _this.model.isBusy = false;
                                if (err)
                                    showError(err);
                                else {
                                    _this.closeOrder_step2(ret, item.posid);
                                }
                                _this.timer = setTimeout(function () { return _this.refreshList(); }, 3000);
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Position.prototype.closeOrder_step2 = function (orderNo, posid) {
        var _this = this;
        var hasError = false;
        var startTime = new Date().getTime();
        this.alertWin = new AlertWindow();
        this.alertWin.model.content = textRes.items["正在平仓"] + "...";
        this.alertWin.model.isBusy++;
        this.alertWin.element.style.position = "absolute";
        this.alertWin.element.style.left = "0px";
        this.alertWin.element.style.top = "0px";
        this.alertWin.setParent(document.body);
        var checkOrderAction = function () { return __awaiter(_this, void 0, void 0, function () {
            var i, status, i, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (hasError && (new Date().getTime() - startTime) >= 20000) {
                            toast(textRes.items['网络异常，请检查您的网络连接'], 3);
                            for (i = 0; i < this.model.ListInfo.list.length; i++) {
                                if (this.model.ListInfo.list[i].posid === posid) {
                                    this.model.ListInfo.list.splice(i, 1);
                                    break;
                                }
                            }
                            this.alertWin.dispose();
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, TradeApi.IsDeal(this, orderNo)];
                    case 2:
                        status = _a.sent();
                        if (status == 3) {
                            for (i = 0; i < this.model.ListInfo.list.length; i++) {
                                if (this.model.ListInfo.list[i].posid === posid) {
                                    this.model.ListInfo.list.splice(i, 1);
                                    break;
                                }
                            }
                            this.alertWin.dispose();
                            toast(textRes.items['平仓成功'], 3);
                            return [2 /*return*/];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_4 = _a.sent();
                        hasError = true;
                        return [3 /*break*/, 4];
                    case 4:
                        setTimeout(function () {
                            checkOrderAction();
                        }, 1000);
                        return [2 /*return*/];
                }
            });
        }); };
        setTimeout(function () {
            checkOrderAction();
        }, 1000);
    };
    Position.prototype.share = function (item) {
        return __awaiter(this, void 0, void 0, function () {
            var url, e_5, ret, e_6, symbolname, module;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (item.isBusy)
                            return [2 /*return*/];
                        this.recordAction("Position_分享");
                        item.isBusy = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 2, , 7]);
                        url = encodeURIComponent(Home.AccountInfo.accountMoneyInfo.registerurl);
                        return [3 /*break*/, 7];
                    case 2:
                        e_5 = _a.sent();
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
                        e_6 = _a.sent();
                        showError(e_6);
                        item.isBusy = false;
                        return [2 /*return*/];
                    case 6: return [3 /*break*/, 7];
                    case 7:
                        symbolname = item.symbolname.split('/')[1];
                        if (!symbolname)
                            symbolname = item.symbolname;
                        module = window.api.require('kLine');
                        console.log(ApiHelper.ResourceAddress + "/share/" + textRes.langName.replace("-", "_") + "/SharePosition.html?currency=" + symbolname + "&bstype=" + item.bstype + "&profit=&profitRate=" + item.profitRate + "&newprice=" + item.newprice + "&buyprice=" + item.buyprice + "&url=" + url);
                        module.saveWebImage({
                            w: 1043,
                            h: 1854,
                            waitForReady: true,
                            url: ApiHelper.ResourceAddress + "/share/" + textRes.langName.replace("-", "_") + "/SharePosition.html?currency=" + symbolname + "&bstype=" + item.bstype + "&profit=&profitRate=" + item.profitRate + "&newprice=" + item.newprice + "&buyprice=" + item.buyprice + "&url=" + url,
                        }, function (ret, err) {
                            if (!_this.actived)
                                return;
                            if (err) {
                                item.isBusy = false;
                                if (_this.actived)
                                    showError("timeout");
                            }
                            else if (ret.status == 1) {
                                item.isBusy = false;
                                if (_this.actived)
                                    shareImageReview(ret.data);
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    Position.prototype.tradeHistoryClick = function () {
        this.recordAction("Position_交易按钮");
        navigation.push(new TradeHistory());
    };
    Position.prototype.setProfitClick = function (item) {
        var page = new SetProfitLoss(item);
        navigation.push(page);
        if (this.timer == 0)
            this.refreshList();
    };
    Position.prototype.expandedClick = function (item) {
        if (!item.expanded)
            this.recordAction("Position_查看详情");
        item.expanded = !item.expanded;
    };
    Position.prototype.onNavigationActived = function (isResume) {
        _super.prototype.onNavigationActived.call(this, isResume);
        console.info("Position page actived");
        this.recordPageStart("持仓");
        if (isResume) {
            if (this.model.ListInfo.list.length > 0 && this.model.ListInfo.list.every(function (m) { return m.expanded; }) == false) {
                this.model.ListInfo.list[0].expanded = true;
            }
        }
        else {
            this.model.isBusy = true;
        }
        if (!this.timer) {
            this.refreshList();
        }
    };
    Position.prototype.onNavigationUnActived = function (isPoping) {
        _super.prototype.onNavigationUnActived.call(this, isPoping);
        this.recordPageEnd("持仓");
        console.info("Position page unactived");
        clearTimeout(this.timer);
        this.timer = 0;
    };
    Position.prototype.refreshList = function () {
        var _this = this;
        console.debug("持仓刷新价格...");
        TradeApi.GetTradeHomeList(this, function (ret, err) {
            if (_this.actived || navigation.queue.some(function (m) { return m.constructor == SetProfitLoss; })) {
                _this.timer = setTimeout(function () { return _this.refreshList(); }, 3000);
            }
            else {
                _this.timer = 0;
            }
            _this.model.isBusy = false;
            if (err) {
            }
            else {
                console.log(JSON.stringify(ret.list));
                var newList = [];
                for (var i = 0; i < ret.list.length; i++) {
                    ret.list[i].expanded = false;
                    ret.list[i].isBusy = false;
                    if (ret.list[i].quantity != 0) {
                        newList.push(ret.list[i]);
                    }
                }
                ret.list = newList;
                if (_this.model.ListInfo.list.length == 0) {
                    _this.model.ListInfo = ret;
                }
                else {
                    var currentList = _this.model.ListInfo.list;
                    for (var i = 0; i < ret.list.length; i++) {
                        var existItems = currentList.filter(function (item) { return item.posid === ret.list[i].posid; });
                        if (existItems.length > 0) {
                            existItems[0].newprice = ret.list[i].newprice;
                            existItems[0].profit = ret.list[i].profit;
                            existItems[0].profitRate = ret.list[i].profitRate;
                            existItems[0].stopprofitprice = ret.list[i].stopprofitprice;
                            existItems[0].stoplossprice = ret.list[i].stoplossprice;
                            existItems[0].marginplus = ret.list[i].marginplus;
                            existItems[0].forcecloseprice = ret.list[i].forcecloseprice;
                            existItems[0].reducableMarin = ret.list[i].reducableMarin;
                            ret.list[i] = existItems[0];
                        }
                    }
                    _this.model.ListInfo = ret;
                }
            }
        });
    };
    return Position;
}(BaseComponent));
export { Position };
//# sourceMappingURL=Position.js.map