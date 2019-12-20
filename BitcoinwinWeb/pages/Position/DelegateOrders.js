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
import { TradeApi } from "../../ServerApis/TradeApi";
import { showError } from "../../Global";
import { CanceledOrders } from "./CanceledOrders";
import { confirmWindow } from "../../GlobalFunc";
import { AlertWindow } from "../General/AlertWindow";
var html = require("./delegateOrders.html");
var DelegateOrders = /** @class */ (function (_super) {
    __extends(DelegateOrders, _super);
    function DelegateOrders() {
        var _this = _super.call(this, html) || this;
        _this.model = {
            isBusy: false,
            textRes: {},
            datas: [],
            pageNumber: 1,
            hasMore: true,
            dataError: false,
        };
        var textRes = _this.model.textRes = window.textRes;
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
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
            },
        });
        return _this;
    }
    DelegateOrders.prototype.showCanceledOrders = function () {
        navigation.push(new CanceledOrders());
    };
    DelegateOrders.prototype.cancelAllOrders = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, confirmWindow(textRes.items["确定要撤销所有委托单吗"])];
                    case 1:
                        if (_a.sent()) {
                            this.model.isBusy = true;
                            TradeApi.OnekeyCancelOrder(this, event.clientX, event.clientY, function (ret, err) {
                                _this.model.isBusy = false;
                                if (err)
                                    showError(err);
                                else {
                                    _this.cancelAllOrders_step2();
                                }
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    DelegateOrders.prototype.cancelAllOrders_step2 = function () {
        var _this = this;
        var hasError = false;
        var startTime = new Date().getTime();
        this.alertWin = new AlertWindow();
        this.alertWin.model.content = textRes.items["正在撤单"] + "...";
        this.alertWin.model.isBusy++;
        this.alertWin.element.style.position = "absolute";
        this.alertWin.element.style.left = "0px";
        this.alertWin.element.style.top = "0px";
        this.alertWin.setParent(document.body);
        var checkOrderAction = function () { return __awaiter(_this, void 0, void 0, function () {
            var status, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (hasError && (new Date().getTime() - startTime) >= 20000) {
                            toast(textRes.items['网络异常，请检查您的网络连接'], 3);
                            this.model.datas.splice(0, this.model.datas.length);
                            this.model.pageNumber = 1;
                            this.model.hasMore = false;
                            this.alertWin.dispose();
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, TradeApi.checkAllCancelOrderStatus(this)];
                    case 2:
                        status = _a.sent();
                        if (status == 0) {
                            this.model.datas.splice(0, this.model.datas.length);
                            this.model.pageNumber = 1;
                            this.model.hasMore = false;
                            this.alertWin.dispose();
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
    DelegateOrders.prototype.cancelOrder = function (event, item) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, confirmWindow(textRes.items["确定要撤销这个委托单吗"])];
                    case 1:
                        if (_a.sent()) {
                            this.model.isBusy = true;
                            TradeApi.CancelOrder(this, event.clientX, event.clientY, item.orderno, function (ret, err) {
                                _this.model.isBusy = false;
                                if (err)
                                    showError(err);
                                else {
                                    _this.cancelOrders_step2(ret, item);
                                }
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    DelegateOrders.prototype.cancelOrders_step2 = function (orderNo, item) {
        var _this = this;
        var hasError = false;
        var startTime = new Date().getTime();
        this.alertWin = new AlertWindow();
        this.alertWin.model.content = textRes.items["正在撤单"] + "...";
        this.alertWin.model.isBusy++;
        this.alertWin.element.style.position = "absolute";
        this.alertWin.element.style.left = "0px";
        this.alertWin.element.style.top = "0px";
        this.alertWin.setParent(document.body);
        var checkOrderAction = function () { return __awaiter(_this, void 0, void 0, function () {
            var index, status, index, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (hasError && (new Date().getTime() - startTime) >= 20000) {
                            toast(textRes.items['网络异常，请检查您的网络连接'], 3);
                            index = this.model.datas.indexOf(item);
                            if (index >= 0)
                                this.model.datas.splice(index, 1);
                            this.alertWin.dispose();
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, TradeApi.IsDeal(this, orderNo)];
                    case 2:
                        status = _a.sent();
                        if (status == 4) {
                            index = this.model.datas.indexOf(item);
                            if (index >= 0)
                                this.model.datas.splice(index, 1);
                            this.alertWin.dispose();
                            return [2 /*return*/];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
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
    DelegateOrders.prototype.onNavigationPushed = function () {
        _super.prototype.onNavigationPushed.call(this);
        this.loadData();
    };
    DelegateOrders.prototype.loadData = function () {
        var _this = this;
        if (this.model.isBusy || this.model.hasMore == false)
            return;
        this.model.isBusy = true;
        this.model.dataError = false;
        if (this.model.pageNumber == 1) {
            this.model.datas = [];
            this.model.hasMore = true;
        }
        TradeApi.GetEntrustOrderList(this, this.model.pageNumber, 20, function (ret, err) {
            _this.model.isBusy = false;
            if (err) {
                _this.model.dataError = true;
                showError(err);
            }
            else {
                console.log(JSON.stringify(ret));
                _this.model.pageNumber++;
                for (var i = 0; i < ret.list.length; i++) {
                    _this.model.datas.push(ret.list[i]);
                }
                _this.model.hasMore = ret.list.length == 20;
            }
        });
    };
    DelegateOrders.prototype.loadMore = function () {
        this.loadData();
    };
    return DelegateOrders;
}(BaseComponent));
export { DelegateOrders };
//# sourceMappingURL=DelegateOrders.js.map