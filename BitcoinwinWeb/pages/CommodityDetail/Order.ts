import { BaseComponent, StatusBarStyle } from "../../BaseComponent";
import { Component } from "jack-one-script";
import Vue from "vue";
import { Description, ApiHelper } from "../../ServerApis/ApiHelper";
import { showError } from "../../Global";
import { BuyInfo, TradeApi } from "../../ServerApis/TradeApi";
import { KLineDataRefresh } from "../../libs/KLineDataRefresh";
import { MessageCenter, MessageType } from "../../MessageCenter";
import { Recharge } from "../Assets/Recharge/Recharge";
import { Main } from "../../Main";
import { alertWindow } from "../../GlobalFunc";
import { AlertWindow } from "../General/AlertWindow";
var html = require("./order.html");


export class Order extends BaseComponent {
    vm: Vue;
    klineRefresh: KLineDataRefresh;
    alertWin: AlertWindow;
    model = {
        isDemoMode:false,
        textRes: <any>{},
        isBusy: false,
        isConfig: false,
        commodity: <Description>{},
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
        buyinfo: <BuyInfo>{},
    };

    get statusBarStyle() {
        return StatusBarStyle.None;
    }

    get animationOnNavigation(): boolean {
        return false;
    }

    constructor(param, content:string) {
        super(content || html);

        this.model.bstype = param.bstype;
        this.model.textRes = (<any>window).textRes;
        this.model.commodity = param.commodity;
        if (!this.model.commodity.offerPrice)
            this.model.commodity.offerPrice = 0;

        this.model.isMarkPrice = true;
        this.model.setProfit = false;
        this.model.customHand = "";
        this.model.customPrice = "";
        this.model.customProfit = "";
        this.model.customLoss = "";
        this.model.buyinfo = <BuyInfo>{};

        this.model.isDemoMode = (ApiHelper.UrlAddresses.currentUrls == ApiHelper.UrlAddresses.demoApiUrls);

        if (!this.vm) {
            this.vm = new Vue({
                el: this.getViewModelElement(),
                data: this.model,
                methods: this.getMethodObjectForVue(),
                computed: {
                    total_financingamount: function () {
                        var buyinfo: BuyInfo = this.buyinfo;
                        if (!buyinfo || !buyinfo.newpx)
                            return "--";
                        return buyinfo.financingamount * this.selectedHand;
                    },
                    Perrmbmargin: function () {
                        var buyinfo: BuyInfo = this.buyinfo;
                        if (!buyinfo || !buyinfo.newpx)
                            return "--";
                        return buyinfo.margin * this.selectedHand;
                    },
                    PerrmbfeeRate: function () {
                        var buyinfo: BuyInfo = this.buyinfo;
                        if (!buyinfo || !buyinfo.newpx)
                            return "--";
                        return buyinfo.traderate * 100 + "%";
                    },
                },
                watch: {
                    customHand: (newvalue) => {
                        if (newvalue.length == 0) {
                            if (this.model.hands.indexOf(this.model.selectedHand) < 0) {
                                this.model.selectedHand = 1;
                            }
                            return;
                        }

                        if (newvalue.indexOf(".") >= 0) {
                            this.model.customHand = parseInt(newvalue.substr(0, newvalue.indexOf("."))).toString();
                        }
                        else {
                            var val = parseInt(newvalue);
                            //if (val > 100) {
                            //    alert(this.model.textRes.getItem("最大只能n手", 100));
                            //    this.model.customHand = "100";
                            //    val = 100;
                            //}
                            this.model.selectedHand = val;
                        }
                    },
                    customPrice: (newvalue) => {
                        this.calculatorProfitAmount();
                        this.calculatorLossAmount();
                    }
                }
            });
        }

      

        this.klineRefresh = new KLineDataRefresh(<Description>this.model.commodity, "1m");

        this.loginedAction = (p) => {
            this.onLogined();
        }
        MessageCenter.register(MessageType.Logined, this.loginedAction);
    }

    onNavigationPushed() {
        super.onNavigationPushed();
        this.getBuyInfo();
    }

    private loginedAction;
    onNavigationPoped() {
        super.onNavigationPoped();

        MessageCenter.unRegister(MessageType.Logined, this.loginedAction);
    }
    onLogined() {
        if (Main.layer.isOnFront && (<any>this.model.buyinfo).balance == undefined) {
            this.getBuyInfo();
        }
    }
    onNavigationActived(isResume: boolean) {
        super.onNavigationActived(isResume);

        

        if (isResume && !ApiHelper.CurrentTokenInfo) {
            this.close();
        }
    }
    getBuyInfo() {
        var commodity: Description = <Description>this.model.commodity;
        this.model.isBusy = true;
        TradeApi.GetBuyPage(this, commodity.symbol, commodity.marketsymbol, this.model.bstype, (ret, err) => {


            this.model.isBusy = false;
            if (err)
                showError(err);
            else {
                this.model.buyinfo = ret;
                console.debug(JSON.stringify(this.model.buyinfo));
            }
        });
    }

    recharge() {
        navigation.push(new Recharge(false));
    }

    async submit1() {
        if (this.model.isMarkPrice == false && isNaN(parseFloat(this.model.customPrice))) {
            await alertWindow((<any>this.model.textRes).items["请输入价格"]);
            return;
        }
        if (this.model.isMarkPrice == false && parseFloat(this.model.customPrice) <= 0) {
            await alertWindow((<any>this.model.textRes).getItem("价格必须大于", 0));
            return;
        }
        
        this.model.isConfig = true;

        this.recordAction(`Detail_${(this.model.isMarkPrice ? '市价' : '限价')}_${(this.model.bstype == 1 ? '买多' :'卖空')}`);

    }

    submit2(event: MouseEvent) {
        this.model.isConfig = false;
        

        //显示"等待成交中"
        this.alertWin = new AlertWindow();
        this.alertWin.model.content = textRes.items["等待成交中"];
        this.alertWin.model.isBusy++;
        this.alertWin.model.buttons = [];
        this.alertWin.element.style.position = "absolute";
        this.alertWin.element.style.left = "0px";
        this.alertWin.element.style.top = "0px";
        this.alertWin.setParent(document.body);


         TradeApi.PostOrder(this, event.clientX, event.clientY, 
            this.model.isMarkPrice ? 2 : 1,
            (<Description>this.model.commodity).symbol,
            this.model.isMarkPrice ? (<BuyInfo>this.model.buyinfo).newpx : this.model.customPrice,
            this.model.bstype, this.model.selectedHand,
            this.model.setProfit ? this.model.customProfit : null,
            this.model.setProfit ? this.model.customLoss : null,
             (ret, err) => {
                 this.alertWin.dispose();

                if (err)
                    showError(err);
                else {
                    this.close();
                    window.api.execScript({
                        frameName: 'main',
                        script: "go2position();"
                    });
                }
            }
        );


        //this.model.isConfig = false;
        //TradeApi.PostOrder(this, event.clientX, event.clientY, 
        //    this.model.isMarkPrice ? 2 : 1,
        //    (<Description>this.model.commodity).symbol,
        //    this.model.isMarkPrice ? (<BuyInfo>this.model.buyinfo).newpx : this.model.customPrice,
        //    this.model.bstype, this.model.selectedHand,
        //    this.model.setProfit ? this.model.customProfit : null,
        //    this.model.setProfit ? this.model.customLoss : null,
        //    async (ret, err) => {
        //        this.model.isBusy = false;
        //        if (err)
        //            showError(err);
        //        else {
        //            if (this.model.isMarkPrice) {
        //                this.submit3(ret);
        //            }
        //            else {
        //                await alertWindow((<any>this.model.textRes).items["您的委托单已提交"]);
        //                this.close();
        //                window.api.execScript({
        //                    frameName: 'main',
        //                    script: "go2position();"
        //                });
        //            }
                   
        //        }
        //    }
        //);
    }

    submit3(orderNo) {
        var exited = false;
        var hasError = false;
        var startTime = new Date().getTime();
        var go2QuotationAction = () => {
            exited = true;
            this.alertWin.dispose();
            this.close();
            //window.api.execScript({
            //    frameName: 'main',
            //    script: "go2Quotation();"
            //});
        };
        var go2PositionAction = () => {
            exited = true;
            this.alertWin.dispose();
            this.close();
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

        var checkOrderAction = async () => {
            if (hasError && (new Date().getTime() - startTime) >= 10000) {
                toast(textRes.items['网络异常'], 3);
                this.alertWin.dispose();
                this.close();
                return;
            }
            try {
                var status = await TradeApi.IsDeal(this, orderNo);
                if (exited)
                    return;

                if (status == 3) {
                   
                    go2PositionAction();
                    return;
                }
            }
            catch (e) {
                hasError = true;
            }

            setTimeout(() => {
                checkOrderAction();
            }, 1000);
        };

        setTimeout(() => {
            checkOrderAction();
        }, 1000);
    }

    close() {
        this.klineRefresh.dispose();
        Main.layer.hide();
    }
    

    handClick(item) {
        this.recordAction(`Detail_${(this.model.isMarkPrice ? '市价' : '限价')}_${item}手`);
        this.model.selectedHand = item;
        this.model.customHand = "";
    }


    jiaPrice() {
        if (!this.model.customPrice)
            this.model.customPrice = this.model.commodity.bidPrice.toString();
        this.model.customPrice = (parseFloat(this.model.customPrice) + this.model.commodity.perprofitnumber).toFixed(this.model.commodity.decimalplace);
    }
    jianPrice() {
        if (!this.model.customPrice)
            this.model.customPrice = this.model.commodity.bidPrice.toString();
        this.model.customPrice = (parseFloat(this.model.customPrice) - this.model.commodity.perprofitnumber).toFixed(this.model.commodity.decimalplace);
    }
    jiaProfit() {
        if (!this.model.customProfit) {
            if (this.model.isMarkPrice == false && this.model.customPrice)
                this.model.customProfit = this.model.customPrice;
            else
                this.model.customProfit = this.model.commodity.bidPrice.toString();
        }
        this.model.customProfit = (parseFloat(this.model.customProfit) + this.model.commodity.perprofitnumber).toFixed(this.model.commodity.decimalplace);
        this.calculatorProfitAmount();
    }
    jianProfit() {
        if (!this.model.customProfit) {
            if (this.model.isMarkPrice == false && this.model.customPrice)
                this.model.customProfit = this.model.customPrice;
            else
                this.model.customProfit = this.model.commodity.bidPrice.toString();
        }
        this.model.customProfit = (parseFloat(this.model.customProfit) - this.model.commodity.perprofitnumber).toFixed(this.model.commodity.decimalplace);
        this.calculatorProfitAmount();
    }

    /**计算止盈金额 */
    calculatorProfitAmount() {

        var customProfitAmount: number;

        var curPrice = parseFloat(this.model.customProfit);
        var openPrice = this.model.bstype === 1 ? this.model.commodity.bidPrice : this.model.commodity.offerPrice;
        if (this.model.isMarkPrice == false)
            openPrice = parseFloat(this.model.customPrice);

        var perrmbmargin = parseFloat((<any>this.vm).Perrmbmargin);

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
    }

    /**计算止损金额 */
    calculatorLossAmount() {

        var customAmount: number;

        var curPrice = parseFloat(this.model.customLoss);
        var openPrice = this.model.bstype === 1 ? this.model.commodity.bidPrice : this.model.commodity.offerPrice;
        if (this.model.isMarkPrice == false)
            openPrice = parseFloat(this.model.customPrice);

        var perrmbmargin = parseFloat((<any>this.vm).Perrmbmargin);

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
    }

    calculatorProfit() {
        var customProfit: number;

        var customProfitAmount = parseFloat(this.model.customProfitAmount);
        var openPrice = this.model.bstype === 1 ? this.model.commodity.bidPrice : this.model.commodity.offerPrice;
        if (this.model.isMarkPrice == false)
            openPrice = parseFloat(this.model.customPrice);

        var perrmbmargin = parseFloat((<any>this.vm).Perrmbmargin);

        if (this.model.bstype === 1) {
            //做多 (（当前价 - 开仓价格 ）/开仓价格)*保证金*杠杆           
            customProfit = (customProfitAmount / (perrmbmargin * this.model.commodity.leverage)) * openPrice + openPrice;
        }
        else {
            //做空 (（开仓价格 -  当前价）/开仓价格)*保证金*杠杆
            customProfit = openPrice - (customProfitAmount / (perrmbmargin * this.model.commodity.leverage)) * openPrice ;
        }

        if (customProfit)
            this.model.customProfit = customProfit.toFixed(this.model.commodity.decimalplace);
        else
            this.model.customProfit = "";
    }

    calculatorLoss() {
        var customLoss: number;

        var customLossAmount = parseFloat(this.model.customLossAmount);
        var openPrice = this.model.bstype === 1 ? this.model.commodity.bidPrice : this.model.commodity.offerPrice;
        if (this.model.isMarkPrice == false)
            openPrice = parseFloat(this.model.customPrice);

        var perrmbmargin = parseFloat((<any>this.vm).Perrmbmargin);

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
    }

    jiaProfitAmount() {
        if (!this.model.customProfitAmount) {
            this.model.customProfitAmount = "0";
        }
        this.model.customProfitAmount = (parseInt(this.model.customProfitAmount) + 1).toFixed(2);
        this.calculatorProfit();
    }
    jianProfitAmount() {
        if (!this.model.customProfitAmount) {
            return;
        }
        this.model.customProfitAmount = Math.max(0, parseInt(this.model.customProfitAmount) - 1).toFixed(2);
        this.calculatorProfit();
    }

    jiaLoss() {
        if (!this.model.customLoss) {
            if (this.model.isMarkPrice == false && this.model.customPrice)
                this.model.customLoss = this.model.customPrice;
            else
                this.model.customLoss = this.model.commodity.bidPrice.toString();
        }
        this.model.customLoss = (parseFloat(this.model.customLoss) + this.model.commodity.perprofitnumber).toFixed(this.model.commodity.decimalplace);
        this.calculatorLossAmount();
    }
    jianLoss() {
        if (!this.model.customLoss) {
            if (this.model.isMarkPrice == false && this.model.customPrice)
                this.model.customLoss = this.model.customPrice;
            else
                this.model.customLoss = this.model.commodity.bidPrice.toString();
        }
        this.model.customLoss = (parseFloat(this.model.customLoss) - this.model.commodity.perprofitnumber).toFixed(this.model.commodity.decimalplace);
        this.calculatorLossAmount();
    }

    jiaLossAmount() {
        if (!this.model.customLossAmount) {
            this.model.customLossAmount = "0";
        }
        this.model.customLossAmount = Math.min(0, parseInt(this.model.customLossAmount) + 1).toFixed(2);
        this.calculatorLoss();
    }
    jianLossAmount() {
        var _customLossAmount: any = this.model.customLossAmount;
        if (!_customLossAmount) {
            _customLossAmount = 0;
        }

        this.model.customLossAmount = Math.min(0, parseInt(_customLossAmount) - 1).toFixed(2);
        this.calculatorLoss();
    }
}