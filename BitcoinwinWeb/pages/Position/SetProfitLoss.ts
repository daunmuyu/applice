import { BaseComponent, StatusBarStyle } from "../../BaseComponent";
import { Component } from "jack-one-script";
import Vue from "vue";
import { TextRes } from "../../TextRes";
import { showError } from "../../Global";
import { Description, ApiHelper } from "../../ServerApis/ApiHelper";
import { TradeApi } from "../../ServerApis/TradeApi";

var html = require("./setProfitLoss.html");
export class SetProfitLoss extends BaseComponent {
    vm: Vue;
    model = {
        textRes: <TextRes>{},
        isBusy: false,
        item: {
            posid:"",
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
            marginplus:0,
            stopprofitprice: "",
            stoplossprice:"",
        },
        margin:0,
        stopProfit: "",
        stopLoss: "",
        stopProfitAmount: "",
        stopLossAmount: "",
        commodity: <Description>null,
    };

    get animationOnNavigation() 
    {
        return false;
    }

    constructor(data) {
        super(html);

        this.model.textRes = (<any>window).textRes;
        if (data)
            this.model.item = data;
        this.model.stopLoss = this.model.item.stoplossprice;
        this.model.stopProfit = this.model.item.stopprofitprice;
        this.model.margin = this.model.item.margin + this.model.item.marginplus;

        this.model.commodity = ApiHelper.getDescription(data.symbol);

        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
        });

        this.calculatorProfitAmount();
        this.calculatorLossAmount();
    }
    backClick() {
        navigation.pop();
    }
    jianProfitPrice() {
        if (!this.model.stopProfit)
            this.model.stopProfit = this.model.commodity.bidPrice.toString();
        this.model.stopProfit = (parseFloat(this.model.stopProfit) - this.model.commodity.perprofitnumber).toFixed(this.model.commodity.decimalplace);
        this.calculatorProfitAmount();
    }

    jiaProfitPrice() {
        if (!this.model.stopProfit)
            this.model.stopProfit = this.model.commodity.bidPrice.toString();
        this.model.stopProfit = (parseFloat(this.model.stopProfit) + this.model.commodity.perprofitnumber).toFixed(this.model.commodity.decimalplace);
        this.calculatorProfitAmount();
    }
    jianLossPrice() {
        if (!this.model.stopLoss)
            this.model.stopLoss = this.model.commodity.bidPrice.toString();
        this.model.stopLoss = (parseFloat(this.model.stopLoss) - this.model.commodity.perprofitnumber).toFixed(this.model.commodity.decimalplace);
        this.calculatorLossAmount();
    }
    jiaLossPrice() {
        if (!this.model.stopLoss)
            this.model.stopLoss = this.model.commodity.bidPrice.toString();
        this.model.stopLoss = (parseFloat(this.model.stopLoss) + this.model.commodity.perprofitnumber).toFixed(this.model.commodity.decimalplace);
        this.calculatorLossAmount();
    }


    /**计算止盈金额 */
    calculatorProfitAmount() {

        var customProfitAmount: number;

        var curPrice = parseFloat(this.model.stopProfit);
        var openPrice = this.model.item.buyprice;

        var perrmbmargin = parseFloat(<any>this.model.item.margin);

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
    }

    /**计算止损金额 */
    calculatorLossAmount() {

        var customAmount: number;

        var curPrice = parseFloat(this.model.stopLoss);
        var openPrice = this.model.item.buyprice;


        var perrmbmargin = parseFloat(<any>this.model.item.margin);

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
    }

    calculatorProfit() {
        var customProfit: number;

        var customProfitAmount = parseFloat(this.model.stopProfitAmount);
        var openPrice = this.model.item.buyprice;

        var perrmbmargin = parseFloat(<any>this.model.item.margin);

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
    }

    calculatorLoss() {
        var customLoss: number;

        var customLossAmount = parseFloat(this.model.stopLossAmount);
        var openPrice = this.model.item.buyprice;

        var perrmbmargin = parseFloat(<any>this.model.item.margin);

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
    }

    jiaProfitAmount() {
        if (!this.model.stopProfitAmount) {
            this.model.stopProfitAmount = "0";
        }
        this.model.stopProfitAmount = (parseInt(this.model.stopProfitAmount) + 1).toFixed(2);
        this.calculatorProfit();
    }
    jianProfitAmount() {
        if (!this.model.stopProfitAmount) {
            return;
        }
        this.model.stopProfitAmount = Math.max(0, parseInt(this.model.stopProfitAmount) - 1).toFixed(2);
        this.calculatorProfit();
    }


    jiaLossAmount() {
        if (!this.model.stopLossAmount) {
            this.model.stopLossAmount = "0";
        }
        this.model.stopLossAmount = Math.min(0, parseInt(this.model.stopLossAmount) + 1).toFixed(2);
        this.calculatorLoss();
    }
    jianLossAmount() {
        var _stopLossAmount: any = this.model.stopLossAmount;
        if (!_stopLossAmount) {
            _stopLossAmount = 0;
        }
        this.model.stopLossAmount = Math.min(0, parseInt(_stopLossAmount) - 1).toFixed(2);
        this.calculatorLoss();
    }

    submit() {
        if (this.model.isBusy)
            return;
       
        if (this.model.stopProfit || this.model.stopLoss) {
            this.model.isBusy = true;

            TradeApi.PostSetProfitStopLoss(this, this.model.item.posid, this.model.stopProfit, this.model.stopLoss, (ret, err) => {
                this.model.isBusy = false;
                if (err)
                    showError(err);
                else {
                    this.model.item.stopprofitprice = this.model.stopProfit;
                    this.model.item.stoplossprice = this.model.stopLoss;
                    navigation.pop();
                }
            });
        }
        else {
            navigation.pop();
        }
    }
}