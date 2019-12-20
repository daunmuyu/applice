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
import { BaseComponent } from "../../BaseComponent";
import Vue from "vue";
import { showError } from "../../Global";
import { ApiHelper } from "../../ServerApis/ApiHelper";
import { TradeApi } from "../../ServerApis/TradeApi";
var html = require("./setProfitLoss.html");
var SetProfitLoss = /** @class */ (function (_super) {
    __extends(SetProfitLoss, _super);
    function SetProfitLoss(data) {
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: {},
            isBusy: false,
            item: {
                posid: "",
                symbolname: "BTCUSDT",
                buyprice: 123,
                leverage: 100,
                newprice: 1212,
                profit: 38,
                bstype: 2,
                quantity: 5,
                expanded: true,
                traderate: 0.01,
                margin: 0,
                marginplus: 0,
                stopprofitprice: "",
                stoplossprice: "",
            },
            margin: 0,
            stopProfit: "",
            stopLoss: "",
            stopProfitAmount: "",
            stopLossAmount: "",
            commodity: null,
        };
        _this.model.textRes = window.textRes;
        if (data)
            _this.model.item = data;
        _this.model.stopLoss = _this.model.item.stoplossprice;
        _this.model.stopProfit = _this.model.item.stopprofitprice;
        _this.model.margin = _this.model.item.margin + _this.model.item.marginplus;
        _this.model.commodity = ApiHelper.getDescription(data.symbol);
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
        });
        _this.calculatorProfitAmount();
        _this.calculatorLossAmount();
        return _this;
    }
    Object.defineProperty(SetProfitLoss.prototype, "animationOnNavigation", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    SetProfitLoss.prototype.backClick = function () {
        navigation.pop();
    };
    SetProfitLoss.prototype.jianProfitPrice = function () {
        if (!this.model.stopProfit)
            this.model.stopProfit = this.model.commodity.bidPrice.toString();
        this.model.stopProfit = (parseFloat(this.model.stopProfit) - this.model.commodity.perprofitnumber).toFixed(this.model.commodity.decimalplace);
        this.calculatorProfitAmount();
    };
    SetProfitLoss.prototype.jiaProfitPrice = function () {
        if (!this.model.stopProfit)
            this.model.stopProfit = this.model.commodity.bidPrice.toString();
        this.model.stopProfit = (parseFloat(this.model.stopProfit) + this.model.commodity.perprofitnumber).toFixed(this.model.commodity.decimalplace);
        this.calculatorProfitAmount();
    };
    SetProfitLoss.prototype.jianLossPrice = function () {
        if (!this.model.stopLoss)
            this.model.stopLoss = this.model.commodity.bidPrice.toString();
        this.model.stopLoss = (parseFloat(this.model.stopLoss) - this.model.commodity.perprofitnumber).toFixed(this.model.commodity.decimalplace);
        this.calculatorLossAmount();
    };
    SetProfitLoss.prototype.jiaLossPrice = function () {
        if (!this.model.stopLoss)
            this.model.stopLoss = this.model.commodity.bidPrice.toString();
        this.model.stopLoss = (parseFloat(this.model.stopLoss) + this.model.commodity.perprofitnumber).toFixed(this.model.commodity.decimalplace);
        this.calculatorLossAmount();
    };
    /**计算止盈金额 */
    SetProfitLoss.prototype.calculatorProfitAmount = function () {
        var customProfitAmount;
        var curPrice = parseFloat(this.model.stopProfit);
        var openPrice = this.model.item.buyprice;
        var perrmbmargin = parseFloat(this.model.item.margin);
        if (this.model.item.bstype === 1) {
            //做多 (（当前价 - 开仓价格 ）/开仓价格)*保证金*杠杆           
            customProfitAmount = ((curPrice - openPrice) / openPrice) * perrmbmargin * this.model.commodity.leverage;
        }
        else {
            //做空 (（开仓价格 -  当前价）/开仓价格)*保证金*杠杆
            customProfitAmount = ((openPrice - curPrice) / openPrice) * perrmbmargin * this.model.commodity.leverage;
        }
        if (customProfitAmount)
            this.model.stopProfitAmount = customProfitAmount.toFixed(2);
        else
            this.model.stopProfitAmount = "";
    };
    /**计算止损金额 */
    SetProfitLoss.prototype.calculatorLossAmount = function () {
        var customAmount;
        var curPrice = parseFloat(this.model.stopLoss);
        var openPrice = this.model.item.buyprice;
        var perrmbmargin = parseFloat(this.model.item.margin);
        if (this.model.item.bstype === 1) {
            //做多 (（当前价 - 开仓价格 ）/开仓价格)*保证金*杠杆           
            customAmount = ((curPrice - openPrice) / openPrice) * perrmbmargin * this.model.commodity.leverage;
        }
        else {
            //做空 (（开仓价格 -  当前价）/开仓价格)*保证金*杠杆
            customAmount = ((openPrice - curPrice) / openPrice) * perrmbmargin * this.model.commodity.leverage;
        }
        if (customAmount)
            this.model.stopLossAmount = customAmount.toFixed(2);
        else
            this.model.stopLossAmount = "";
    };
    SetProfitLoss.prototype.calculatorProfit = function () {
        var customProfit;
        var customProfitAmount = parseFloat(this.model.stopProfitAmount);
        var openPrice = this.model.item.buyprice;
        var perrmbmargin = parseFloat(this.model.item.margin);
        if (this.model.item.bstype === 1) {
            //做多 (（当前价 - 开仓价格 ）/开仓价格)*保证金*杠杆           
            customProfit = (customProfitAmount / (perrmbmargin * this.model.commodity.leverage)) * openPrice + openPrice;
        }
        else {
            //做空 (（开仓价格 -  当前价）/开仓价格)*保证金*杠杆
            customProfit = openPrice - (customProfitAmount / (perrmbmargin * this.model.commodity.leverage)) * openPrice;
        }
        if (customProfit)
            this.model.stopProfit = customProfit.toFixed(this.model.commodity.decimalplace);
        else
            this.model.stopProfit = "";
    };
    SetProfitLoss.prototype.calculatorLoss = function () {
        var customLoss;
        var customLossAmount = parseFloat(this.model.stopLossAmount);
        var openPrice = this.model.item.buyprice;
        var perrmbmargin = parseFloat(this.model.item.margin);
        if (this.model.item.bstype === 1) {
            //做多 (（当前价 - 开仓价格 ）/开仓价格)*保证金*杠杆           
            customLoss = (customLossAmount / (perrmbmargin * this.model.commodity.leverage)) * openPrice + openPrice;
        }
        else {
            //做空 (（开仓价格 -  当前价）/开仓价格)*保证金*杠杆
            customLoss = openPrice - (customLossAmount / (perrmbmargin * this.model.commodity.leverage)) * openPrice;
        }
        if (customLoss)
            this.model.stopLoss = customLoss.toFixed(this.model.commodity.decimalplace);
        else
            this.model.stopLoss = "";
    };
    SetProfitLoss.prototype.jiaProfitAmount = function () {
        if (!this.model.stopProfitAmount) {
            this.model.stopProfitAmount = "0";
        }
        this.model.stopProfitAmount = (parseInt(this.model.stopProfitAmount) + 1).toFixed(2);
        this.calculatorProfit();
    };
    SetProfitLoss.prototype.jianProfitAmount = function () {
        if (!this.model.stopProfitAmount) {
            return;
        }
        this.model.stopProfitAmount = Math.max(0, parseInt(this.model.stopProfitAmount) - 1).toFixed(2);
        this.calculatorProfit();
    };
    SetProfitLoss.prototype.jiaLossAmount = function () {
        if (!this.model.stopLossAmount) {
            this.model.stopLossAmount = "0";
        }
        this.model.stopLossAmount = Math.min(0, parseInt(this.model.stopLossAmount) + 1).toFixed(2);
        this.calculatorLoss();
    };
    SetProfitLoss.prototype.jianLossAmount = function () {
        var _stopLossAmount = this.model.stopLossAmount;
        if (!_stopLossAmount) {
            _stopLossAmount = 0;
        }
        this.model.stopLossAmount = Math.min(0, parseInt(_stopLossAmount) - 1).toFixed(2);
        this.calculatorLoss();
    };
    SetProfitLoss.prototype.submit = function () {
        var _this = this;
        if (this.model.isBusy)
            return;
        if (this.model.stopProfit || this.model.stopLoss) {
            this.model.isBusy = true;
            TradeApi.PostSetProfitStopLoss(this, this.model.item.posid, this.model.stopProfit, this.model.stopLoss, function (ret, err) {
                _this.model.isBusy = false;
                if (err)
                    showError(err);
                else {
                    _this.model.item.stopprofitprice = _this.model.stopProfit;
                    _this.model.item.stoplossprice = _this.model.stopLoss;
                    navigation.pop();
                }
            });
        }
        else {
            navigation.pop();
        }
    };
    return SetProfitLoss;
}(BaseComponent));
export { SetProfitLoss };
//# sourceMappingURL=SetProfitLoss.js.map