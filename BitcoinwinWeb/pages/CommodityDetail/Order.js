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
import { ApiHelper } from "../../ServerApis/ApiHelper";
import { showError } from "../../Global";
import { TradeApi } from "../../ServerApis/TradeApi";
import { KLineDataRefresh } from "../../libs/KLineDataRefresh";
import { MessageCenter, MessageType } from "../../MessageCenter";
import { Recharge } from "../Assets/Recharge/Recharge";
import { Main } from "../../Main";
import { alertWindow } from "../../GlobalFunc";
import { AlertWindow } from "../General/AlertWindow";
var html = require("./order.html");
var Order = /** @class */ (function (_super) {
    __extends(Order, _super);
    function Order(param, content) {
        var _this = _super.call(this, content || html) || this;
        _this.model = {
            isDemoMode: false,
            textRes: {},
            isBusy: false,
            isConfig: false,
            commodity: {},
            isMarkPrice: true,
            hands: [1, 10, 100, 500],
            selectedHand: 1,
            customHand: "",
            customPrice: "",
            setProfit: false,
            customProfit: "",
            customLoss: "",
            customProfitAmount: "",
            customLossAmount: "",
            /**1:看涨 2：看空 */
            bstype: 1,
            buyinfo: {},
        };
        _this.model.bstype = param.bstype;
        _this.model.textRes = window.textRes;
        _this.model.commodity = param.commodity;
        if (!_this.model.commodity.offerPrice)
            _this.model.commodity.offerPrice = 0;
        _this.model.isMarkPrice = true;
        _this.model.setProfit = false;
        _this.model.customHand = "";
        _this.model.customPrice = "";
        _this.model.customProfit = "";
        _this.model.customLoss = "";
        _this.model.buyinfo = {};
        _this.model.isDemoMode = (ApiHelper.UrlAddresses.currentUrls == ApiHelper.UrlAddresses.demoApiUrls);
        if (!_this.vm) {
            _this.vm = new Vue({
                el: _this.getViewModelElement(),
                data: _this.model,
                methods: _this.getMethodObjectForVue(),
                computed: {
                    total_financingamount: function () {
                        var buyinfo = this.buyinfo;
                        if (!buyinfo || !buyinfo.newpx)
                            return "--";
                        return buyinfo.financingamount * this.selectedHand;
                    },
                    Perrmbmargin: function () {
                        var buyinfo = this.buyinfo;
                        if (!buyinfo || !buyinfo.newpx)
                            return "--";
                        return buyinfo.margin * this.selectedHand;
                    },
                    PerrmbfeeRate: function () {
                        var buyinfo = this.buyinfo;
                        if (!buyinfo || !buyinfo.newpx)
                            return "--";
                        return buyinfo.traderate * 100 + "%";
                    },
                },
                watch: {
                    customHand: function (newvalue) {
                        if (newvalue.length == 0) {
                            if (_this.model.hands.indexOf(_this.model.selectedHand) < 0) {
                                _this.model.selectedHand = 1;
                            }
                            return;
                        }
                        if (newvalue.indexOf(".") >= 0) {
                            _this.model.customHand = parseInt(newvalue.substr(0, newvalue.indexOf("."))).toString();
                        }
                        else {
                            var val = parseInt(newvalue);
                            //if (val > 100) {
                            //    alert(this.model.textRes.getItem("最大只能n手", 100));
                            //    this.model.customHand = "100";
                            //    val = 100;
                            //}
                            _this.model.selectedHand = val;
                        }
                    },
                    customPrice: function (newvalue) {
                        _this.calculatorProfitAmount();
                        _this.calculatorLossAmount();
                    }
                }
            });
        }
        _this.klineRefresh = new KLineDataRefresh(_this.model.commodity, "1m");
        _this.loginedAction = function (p) {
            _this.onLogined();
        };
        MessageCenter.register(MessageType.Logined, _this.loginedAction);
        return _this;
    }
    Object.defineProperty(Order.prototype, "statusBarStyle", {
        get: function () {
            return StatusBarStyle.None;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Order.prototype, "animationOnNavigation", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Order.prototype.onNavigationPushed = function () {
        _super.prototype.onNavigationPushed.call(this);
        this.getBuyInfo();
    };
    Order.prototype.onNavigationPoped = function () {
        _super.prototype.onNavigationPoped.call(this);
        MessageCenter.unRegister(MessageType.Logined, this.loginedAction);
    };
    Order.prototype.onLogined = function () {
        if (Main.layer.isOnFront && this.model.buyinfo.balance == undefined) {
            this.getBuyInfo();
        }
    };
    Order.prototype.onNavigationActived = function (isResume) {
        _super.prototype.onNavigationActived.call(this, isResume);
        if (isResume && !ApiHelper.CurrentTokenInfo) {
            this.close();
        }
    };
    Order.prototype.getBuyInfo = function () {
        var _this = this;
        var commodity = this.model.commodity;
        this.model.isBusy = true;
        TradeApi.GetBuyPage(this, commodity.symbol, commodity.marketsymbol, this.model.bstype, function (ret, err) {
            _this.model.isBusy = false;
            if (err)
                showError(err);
            else {
                _this.model.buyinfo = ret;
                console.debug(JSON.stringify(_this.model.buyinfo));
            }
        });
    };
    Order.prototype.recharge = function () {
        navigation.push(new Recharge(false));
    };
    Order.prototype.submit1 = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.model.isMarkPrice == false && isNaN(parseFloat(this.model.customPrice)))) return [3 /*break*/, 2];
                        return [4 /*yield*/, alertWindow(this.model.textRes.items["请输入价格"])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2:
                        if (!(this.model.isMarkPrice == false && parseFloat(this.model.customPrice) <= 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, alertWindow(this.model.textRes.getItem("价格必须大于", 0))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                    case 4:
                        this.model.isBusy = true;
                        this.model.isConfig = true;
                        this.recordAction("Detail_" + (this.model.isMarkPrice ? '市价' : '限价') + "_" + (this.model.bstype == 1 ? '买多' : '卖空'));
                        return [2 /*return*/];
                }
            });
        });
    };
    Order.prototype.submit2 = function (event) {
        var _this = this;
        this.model.isConfig = false;
        TradeApi.PostOrder(this, event.clientX, event.clientY, this.model.isMarkPrice ? 2 : 1, this.model.commodity.symbol, this.model.isMarkPrice ? this.model.buyinfo.newpx : this.model.customPrice, this.model.bstype, this.model.selectedHand, this.model.setProfit ? this.model.customProfit : null, this.model.setProfit ? this.model.customLoss : null, function (ret, err) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.model.isBusy = false;
                        if (!err) return [3 /*break*/, 1];
                        showError(err);
                        return [3 /*break*/, 4];
                    case 1:
                        if (!this.model.isMarkPrice) return [3 /*break*/, 2];
                        this.submit3(ret);
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, alertWindow(this.model.textRes.items["您的委托单已提交"])];
                    case 3:
                        _a.sent();
                        this.close();
                        window.api.execScript({
                            frameName: 'main',
                            script: "go2position();"
                        });
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    Order.prototype.submit3 = function (orderNo) {
        var _this = this;
        var exited = false;
        var hasError = false;
        var startTime = new Date().getTime();
        var go2QuotationAction = function () {
            exited = true;
            _this.alertWin.dispose();
            _this.close();
            //window.api.execScript({
            //    frameName: 'main',
            //    script: "go2Quotation();"
            //});
        };
        var go2PositionAction = function () {
            exited = true;
            _this.alertWin.dispose();
            _this.close();
            window.api.execScript({
                frameName: 'main',
                script: "go2position();"
            });
        };
        this.alertWin = new AlertWindow();
        this.alertWin.model.content = textRes.items["订单撮合中"];
        this.alertWin.model.isBusy++;
        this.alertWin.model.buttons = [
            {
                text: textRes.items["继续下单"],
                bgColor: textRes.items["超级链接颜色"],
                action: go2QuotationAction,
            },
            {
                text: textRes.items["查看持仓"],
                bgColor: textRes.items["超级链接颜色"],
                action: go2PositionAction,
            }
        ];
        this.alertWin.element.style.position = "absolute";
        this.alertWin.element.style.left = "0px";
        this.alertWin.element.style.top = "0px";
        this.alertWin.setParent(document.body);
        var checkOrderAction = function () { return __awaiter(_this, void 0, void 0, function () {
            var status, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (hasError && (new Date().getTime() - startTime) >= 10000) {
                            toast(textRes.items['网络异常'], 3);
                            this.alertWin.dispose();
                            this.close();
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, TradeApi.IsDeal(this, orderNo)];
                    case 2:
                        status = _a.sent();
                        if (exited)
                            return [2 /*return*/];
                        if (status == 3) {
                            go2PositionAction();
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
    Order.prototype.close = function () {
        this.klineRefresh.dispose();
        Main.layer.hide();
    };
    Order.prototype.handClick = function (item) {
        this.recordAction("Detail_" + (this.model.isMarkPrice ? '市价' : '限价') + "_" + item + "\u624B");
        this.model.selectedHand = item;
        this.model.customHand = "";
    };
    Order.prototype.jiaPrice = function () {
        if (!this.model.customPrice)
            this.model.customPrice = this.model.commodity.bidPrice.toString();
        this.model.customPrice = (parseFloat(this.model.customPrice) + this.model.commodity.perprofitnumber).toFixed(this.model.commodity.decimalplace);
    };
    Order.prototype.jianPrice = function () {
        if (!this.model.customPrice)
            this.model.customPrice = this.model.commodity.bidPrice.toString();
        this.model.customPrice = (parseFloat(this.model.customPrice) - this.model.commodity.perprofitnumber).toFixed(this.model.commodity.decimalplace);
    };
    Order.prototype.jiaProfit = function () {
        if (!this.model.customProfit) {
            if (this.model.isMarkPrice == false && this.model.customPrice)
                this.model.customProfit = this.model.customPrice;
            else
                this.model.customProfit = this.model.commodity.bidPrice.toString();
        }
        this.model.customProfit = (parseFloat(this.model.customProfit) + this.model.commodity.perprofitnumber).toFixed(this.model.commodity.decimalplace);
        this.calculatorProfitAmount();
    };
    Order.prototype.jianProfit = function () {
        if (!this.model.customProfit) {
            if (this.model.isMarkPrice == false && this.model.customPrice)
                this.model.customProfit = this.model.customPrice;
            else
                this.model.customProfit = this.model.commodity.bidPrice.toString();
        }
        this.model.customProfit = (parseFloat(this.model.customProfit) - this.model.commodity.perprofitnumber).toFixed(this.model.commodity.decimalplace);
        this.calculatorProfitAmount();
    };
    /**计算止盈金额 */
    Order.prototype.calculatorProfitAmount = function () {
        var customProfitAmount;
        var curPrice = parseFloat(this.model.customProfit);
        var openPrice = this.model.bstype === 1 ? this.model.commodity.bidPrice : this.model.commodity.offerPrice;
        if (this.model.isMarkPrice == false)
            openPrice = parseFloat(this.model.customPrice);
        var perrmbmargin = parseFloat(this.vm.Perrmbmargin);
        if (this.model.bstype === 1) {
            //做多 (（当前价 - 开仓价格 ）/开仓价格)*保证金*杠杆           
            customProfitAmount = ((curPrice - openPrice) / openPrice) * perrmbmargin * this.model.commodity.leverage;
        }
        else {
            //做空 (（开仓价格 -  当前价）/开仓价格)*保证金*杠杆
            customProfitAmount = ((openPrice - curPrice) / openPrice) * perrmbmargin * this.model.commodity.leverage;
        }
        if (customProfitAmount)
            this.model.customProfitAmount = customProfitAmount.toFixed(2);
        else
            this.model.customProfitAmount = "";
    };
    /**计算止损金额 */
    Order.prototype.calculatorLossAmount = function () {
        var customAmount;
        var curPrice = parseFloat(this.model.customLoss);
        var openPrice = this.model.bstype === 1 ? this.model.commodity.bidPrice : this.model.commodity.offerPrice;
        if (this.model.isMarkPrice == false)
            openPrice = parseFloat(this.model.customPrice);
        var perrmbmargin = parseFloat(this.vm.Perrmbmargin);
        if (this.model.bstype === 1) {
            //做多 (（当前价 - 开仓价格 ）/开仓价格)*保证金*杠杆           
            customAmount = ((curPrice - openPrice) / openPrice) * perrmbmargin * this.model.commodity.leverage;
        }
        else {
            //做空 (（开仓价格 -  当前价）/开仓价格)*保证金*杠杆
            customAmount = ((openPrice - curPrice) / openPrice) * perrmbmargin * this.model.commodity.leverage;
        }
        if (customAmount)
            this.model.customLossAmount = customAmount.toFixed(2);
        else
            this.model.customLossAmount = "";
    };
    Order.prototype.calculatorProfit = function () {
        var customProfit;
        var customProfitAmount = parseFloat(this.model.customProfitAmount);
        var openPrice = this.model.bstype === 1 ? this.model.commodity.bidPrice : this.model.commodity.offerPrice;
        if (this.model.isMarkPrice == false)
            openPrice = parseFloat(this.model.customPrice);
        var perrmbmargin = parseFloat(this.vm.Perrmbmargin);
        if (this.model.bstype === 1) {
            //做多 (（当前价 - 开仓价格 ）/开仓价格)*保证金*杠杆           
            customProfit = (customProfitAmount / (perrmbmargin * this.model.commodity.leverage)) * openPrice + openPrice;
        }
        else {
            //做空 (（开仓价格 -  当前价）/开仓价格)*保证金*杠杆
            customProfit = openPrice - (customProfitAmount / (perrmbmargin * this.model.commodity.leverage)) * openPrice;
        }
        if (customProfit)
            this.model.customProfit = customProfit.toFixed(this.model.commodity.decimalplace);
        else
            this.model.customProfit = "";
    };
    Order.prototype.calculatorLoss = function () {
        var customLoss;
        var customLossAmount = parseFloat(this.model.customLossAmount);
        var openPrice = this.model.bstype === 1 ? this.model.commodity.bidPrice : this.model.commodity.offerPrice;
        if (this.model.isMarkPrice == false)
            openPrice = parseFloat(this.model.customPrice);
        var perrmbmargin = parseFloat(this.vm.Perrmbmargin);
        if (this.model.bstype === 1) {
            //做多 (（当前价 - 开仓价格 ）/开仓价格)*保证金*杠杆           
            customLoss = (customLossAmount / (perrmbmargin * this.model.commodity.leverage)) * openPrice + openPrice;
        }
        else {
            //做空 (（开仓价格 -  当前价）/开仓价格)*保证金*杠杆
            customLoss = openPrice - (customLossAmount / (perrmbmargin * this.model.commodity.leverage)) * openPrice;
        }
        if (customLoss)
            this.model.customLoss = customLoss.toFixed(this.model.commodity.decimalplace);
        else
            this.model.customLoss = "";
    };
    Order.prototype.jiaProfitAmount = function () {
        if (!this.model.customProfitAmount) {
            this.model.customProfitAmount = "0";
        }
        this.model.customProfitAmount = (parseInt(this.model.customProfitAmount) + 1).toFixed(2);
        this.calculatorProfit();
    };
    Order.prototype.jianProfitAmount = function () {
        if (!this.model.customProfitAmount) {
            return;
        }
        this.model.customProfitAmount = Math.max(0, parseInt(this.model.customProfitAmount) - 1).toFixed(2);
        this.calculatorProfit();
    };
    Order.prototype.jiaLoss = function () {
        if (!this.model.customLoss) {
            if (this.model.isMarkPrice == false && this.model.customPrice)
                this.model.customLoss = this.model.customPrice;
            else
                this.model.customLoss = this.model.commodity.bidPrice.toString();
        }
        this.model.customLoss = (parseFloat(this.model.customLoss) + this.model.commodity.perprofitnumber).toFixed(this.model.commodity.decimalplace);
        this.calculatorLossAmount();
    };
    Order.prototype.jianLoss = function () {
        if (!this.model.customLoss) {
            if (this.model.isMarkPrice == false && this.model.customPrice)
                this.model.customLoss = this.model.customPrice;
            else
                this.model.customLoss = this.model.commodity.bidPrice.toString();
        }
        this.model.customLoss = (parseFloat(this.model.customLoss) - this.model.commodity.perprofitnumber).toFixed(this.model.commodity.decimalplace);
        this.calculatorLossAmount();
    };
    Order.prototype.jiaLossAmount = function () {
        if (!this.model.customLossAmount) {
            this.model.customLossAmount = "0";
        }
        this.model.customLossAmount = Math.min(0, parseInt(this.model.customLossAmount) + 1).toFixed(2);
        this.calculatorLoss();
    };
    Order.prototype.jianLossAmount = function () {
        var _customLossAmount = this.model.customLossAmount;
        if (!_customLossAmount) {
            _customLossAmount = 0;
        }
        this.model.customLossAmount = Math.min(0, parseInt(_customLossAmount) - 1).toFixed(2);
        this.calculatorLoss();
    };
    return Order;
}(BaseComponent));
export { Order };
//# sourceMappingURL=Order.js.map