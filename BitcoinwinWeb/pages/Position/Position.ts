import { BaseComponent, StatusBarStyle } from "../../BaseComponent";
import { Component } from "jack-one-script";
import Vue from "vue";
import { TextRes } from "../../TextRes";
import { TradeApi } from "../../ServerApis/TradeApi";
import { showError } from "../../Global";
import { SetProfitLoss } from "./SetProfitLoss";
import { CommodityDetail } from "../CommodityDetail/CommodityDetail";
import { ApiHelper } from "../../ServerApis/ApiHelper";
import { MessageCenter, MessageType } from "../../MessageCenter";
import { TradeHistory } from "./TradeHistory";
import { DelegateOrders } from "./DelegateOrders";
import { MainPage } from "../MainPage";
import { DemoTrade } from "../My/DemoTrade";
import { ModelValidator } from "jack-one-script";
import { shareImage, shareImageReview, confirmWindow } from "../../GlobalFunc";
import { Home } from "../Home";
import { AccountApi } from "../../ServerApis/AccountApi";
import { Setting } from "../My/Setting";
import { AlertWindow } from "../General/AlertWindow";

var html = require("./position.html");
export class Position extends BaseComponent {
    vm: Vue;

    model = {
        textRes: <TextRes>{},
        isDemoMode:false,
        isBusy: false,
        isBusy2: false,
        isAdditionalMargin: <any>false,
        additionalMargin: undefined,
        targetPrice: undefined,
        isReductionMargin: <any>false,
        showTitle:true,
        ListInfo: {
            totalamount: "--",
            totalprofit: "--",
            canusedamount: "--",
            frozenamout: "--",
            totalposprice: "--",
            toatlfinancingamount: "--",
            list:[],
        },
        validator: {},
    };

    get statusBarStyle() {
        return StatusBarStyle.Light;
    }

    get needLogin() {
        return true;
    }

    constructor(showtitle=true) {
        super(html);

        this.model.isDemoMode = ApiHelper.IsDemoMode;
        this.model.showTitle = showtitle;
        this.model.textRes = (<any>window).textRes;
        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
            computed: {
                isDemo: () => ApiHelper.isDemoMode(),
                canCloseAllOrder: () => this.model.ListInfo.list.some(m => m.opType != 2),
            },
            errorCaptured: (err, vm, info) => {
                alert(JSON.stringify([err, info]));
                return false;
            },
            watch: {
                additionalMargin: (newValue) => {
                    
                    if (!newValue) {
                        this.model.targetPrice = undefined ;
                    }                       
                    else {
                        if (newValue.indexOf(".") >= 0) {
                            this.model.additionalMargin = this.toFixed(newValue, 0, true, true);
                            return;
                        }

                        var item = this.model.isAdditionalMargin || this.model.isReductionMargin;
                        newValue = parseFloat(newValue);
                        if (this.model.isAdditionalMargin)
                            newValue += item.marginplus;
                        else
                            newValue = item.marginplus - newValue;
                        var commodity = ApiHelper.getDescription(item.symbol);

                        //总保证金
                        var totalMargin = item.margin + newValue;

                        var stopProfitOrLoss = totalMargin * (item.closerate - 1);
                        var targetPrice = 0;
                        if (item.bstype == 1) {
                            targetPrice = ((0.01 - 1) * totalMargin) / (item.margin * item.leverage) * item.buyprice + item.buyprice;

                            //做多，进0.01
                            targetPrice += 1 / Math.pow(10, commodity.decimalplace);
                        }
                        else {
                            targetPrice = item.buyprice - ((0.01 - 1) * totalMargin) / (item.margin * item.leverage) * item.buyprice;
                        }
                        

                        this.model.targetPrice = this.toFixed(targetPrice, commodity.decimalplace, true, true);
                    }
                },
            },
        });


        MessageCenter.register(MessageType.Logout, (p) => {
            this.model.ListInfo = {
                totalamount: "--",
                totalprofit: "--",
                canusedamount: "--",
                frozenamout: "--",
                totalposprice: "--",
                toatlfinancingamount: "--",
                list: [],
            }
        });
    }

    private _titleClickCount = 0;
    private _titleClickTime = new Date().getTime();
    async titleClick() {

        if (!ApiHelper.IsDemoMode)
            return;
    }

    go2CommodityClick(item) {
        var page = new CommodityDetail(ApiHelper.getDescription(item.symbol));
        navigation.push(page);
    }

    delegateClick() {
        this.recordAction("Position_委托");
        navigation.push(new DelegateOrders());
    }
    go2quotation() {
        MainPage.instance.activeQuotation();
    }
    async closeAllOrder(event: MouseEvent) {
        this.recordAction("Position_一键平仓");
        if (this.model.isBusy)
            return;
        if (await confirmWindow(this.model.textRes.items["确定要关闭所有持仓吗"])) {
            clearTimeout(this.timer);
            this.model.isBusy = true;

            this.alertWin = new AlertWindow();
            this.alertWin.model.content = textRes.items["正在平仓"] + "...";
            this.alertWin.model.isBusy++;
            this.alertWin.element.style.position = "absolute";
            this.alertWin.element.style.left = "0px";
            this.alertWin.element.style.top = "0px";
            this.alertWin.setParent(document.body);

            TradeApi.OnekeyClosePostion(this, event.clientX, event.clientY , (ret, err) => {
                this.model.isBusy = false;
                if (err)
                    showError(err);
                else {
                    this.alertWin.dispose();
                    for (var i = 0; i < this.model.ListInfo.list.length; i++) {
                        if (this.model.ListInfo.list[i].opType != 2) {
                            this.model.ListInfo.list.splice(i, 1);
                            i--;
                        }
                    }
                    this.timer = <any>setTimeout(() => this.refreshList(), 3000);
                    //this.closeAllOrder_step2();
                }
                this.timer = <any>setTimeout(() => this.refreshList(), 3000);
            });
        }      
    }


    closeAllOrder_step2() {
        var hasError = false;
        var startTime = new Date().getTime();

        this.alertWin = new AlertWindow();
        this.alertWin.model.content = textRes.items["正在平仓"] + "...";
        this.alertWin.model.isBusy++;
        this.alertWin.element.style.position = "absolute";
        this.alertWin.element.style.left = "0px";
        this.alertWin.element.style.top = "0px";
        this.alertWin.setParent(document.body);

        var checkOrderAction = async () => {
            if (hasError && (new Date().getTime() - startTime) >= 20000) {
                toast(textRes.items['网络异常，请检查您的网络连接'], 3);
              
                for (var i = 0; i < this.model.ListInfo.list.length; i++) {
                    if (this.model.ListInfo.list[i].opType != 2) {
                        this.model.ListInfo.list.splice(i, 1);
                        i--;
                    }
                }

                this.alertWin.dispose();
                return;
            }

            try {
                var status = await TradeApi.checkAllCloseOrderStatus(this);
                if (status == 0) {

                    clearTimeout(this.timer);

                    for (var i = 0; i < this.model.ListInfo.list.length; i++) {
                        if (this.model.ListInfo.list[i].opType != 2) {
                            this.model.ListInfo.list.splice(i, 1);
                            i--;
                        }
                    }
                    this.refreshList();

                    this.alertWin.dispose();

                    toast(textRes.items['平仓成功'] , 3);

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

    /**追加保证金 */
    async additionalMarginClick() {
        if (this.model.isBusy || this.model.isBusy2)
            return;

        if (!ModelValidator.verifyToProperty(this.model, [
            { propertyName:"additionalMargin" }
        ], "validator"))
            return;

        this.model.isBusy2 = true;
        try {
            await TradeApi.AppendMargin(this, this.model.isAdditionalMargin.posid, this.model.additionalMargin);
            //this.model.isAdditionalMargin就是当前的数据item
            this.model.isAdditionalMargin.marginplus = parseFloat(this.model.isAdditionalMargin.marginplus) + parseFloat(this.model.additionalMargin);
            this.model.isAdditionalMargin.forcecloseprice = this.model.targetPrice;
            this.model.isAdditionalMargin = false;

            this.model.additionalMargin = undefined;
        }
        catch (e) {
            showError(e);
        }
        finally {
            this.model.isBusy2 = false;
        }
    }
    /**减少保证金 */
    async reduceMarginClick() {
        if (this.model.isBusy || this.model.isBusy2)
            return;

        if (!ModelValidator.verifyToProperty(this.model, [
            { propertyName: "additionalMargin" }
        ], "validator"))
            return;

        this.model.isBusy2 = true;
        try {
            await TradeApi.ReduceMargin(this, this.model.isReductionMargin.posid, this.model.additionalMargin);
            //this.model.isReductionMargin 就是当前的数据item
            this.model.isReductionMargin.marginplus = parseFloat(this.model.isReductionMargin.marginplus) - parseFloat(this.model.additionalMargin);
            this.model.isReductionMargin.forcecloseprice = this.model.targetPrice;
            this.model.isReductionMargin = false;
            this.model.additionalMargin = undefined;
        }
        catch (e) {
            showError(e);
        }
        finally {
            this.model.isBusy2 = false;
        }
    }

    async closeOrder(event: MouseEvent, item) {
        if (this.model.isBusy)
            return;
        
        if (await confirmWindow(this.model.textRes.items["确定平仓吗"])) {
            clearTimeout(this.timer);
            this.model.isBusy = true;


            this.alertWin = new AlertWindow();
            this.alertWin.model.content = textRes.items["正在平仓"] + "...";
            this.alertWin.model.isBusy++;
            this.alertWin.element.style.position = "absolute";
            this.alertWin.element.style.left = "0px";
            this.alertWin.element.style.top = "0px";
            this.alertWin.setParent(document.body);

            TradeApi.PostClosepostion(this, event.clientX, event.clientY, item.showno, item.ordertype, (ret, err) => {

                this.model.isBusy = false;
                if (err)
                    showError(err);
                else {
                    this.alertWin.dispose();

                    for (var i = 0; i < this.model.ListInfo.list.length; i++) {
                        if (this.model.ListInfo.list[i].posid === item.posid) {
                            this.model.ListInfo.list.splice(i, 1);
                            break;
                        }
                    }

                    this.timer = <any>setTimeout(() => this.refreshList(), 3000);
                    //this.closeOrder_step2(ret,item.posid);
                }
               
            });
        }        
    }


    alertWin: AlertWindow;
    closeOrder_step2(orderNo,posid) {
        var hasError = false;
        var startTime = new Date().getTime();

        this.alertWin = new AlertWindow();
        this.alertWin.model.content = textRes.items["正在平仓"] + "...";
        this.alertWin.model.isBusy++;
        this.alertWin.element.style.position = "absolute";
        this.alertWin.element.style.left = "0px";
        this.alertWin.element.style.top = "0px";
        this.alertWin.setParent(document.body);

        var checkOrderAction = async () => {
            if (hasError && (new Date().getTime() - startTime) >= 20000) {
                toast(textRes.items['网络异常，请检查您的网络连接'], 3);

                for (var i = 0; i < this.model.ListInfo.list.length; i++) {
                    if (this.model.ListInfo.list[i].posid === posid) {
                        this.model.ListInfo.list.splice(i, 1);
                        break;
                    }
                }

                this.alertWin.dispose();
                return;
            }

            try {
                var status = await TradeApi.IsDeal(this, orderNo);
                if (status == 3) {

                    clearTimeout(this.timer);

                    for (var i = 0; i < this.model.ListInfo.list.length; i++) {
                        if (this.model.ListInfo.list[i].posid === posid) {
                            this.model.ListInfo.list.splice(i, 1);
                            break;
                        }
                    }

                    this.refreshList();

                    this.alertWin.dispose();
                    toast(textRes.items['平仓成功'], 3);

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

    async share(item) {
        if (item.isBusy)
            return;
        this.recordAction("Position_分享");
        item.isBusy = true;

        var url;
        try {
            url = encodeURIComponent( Home.AccountInfo.accountMoneyInfo.registerurl);
        }
        catch (e) {
            try {
                var ret = await AccountApi.GetAccountInfo(this);
                Home.AccountInfo = ret;
                url = encodeURIComponent(  ret.accountMoneyInfo.registerurl);
            }
            catch (e) {
                showError(e);
                item.isBusy = false;
                return;
            }
        }

        var symbolname = item.symbolname.split('/')[1];
        if (!symbolname)
            symbolname = item.symbolname;


        var module = window.api.require('kLine');
        console.log(`${ApiHelper.ResourceAddress}/share/${textRes.langName.replace("-", "_")}/SharePosition.html?currency=${symbolname}&bstype=${item.bstype}&profit=&profitRate=${item.profitRate}&newprice=${item.newprice}&buyprice=${item.buyprice}&url=${url}`);

        module.saveWebImage({
            w: 1043,
            h: 1854,
            waitForReady:true,
            url: `${ApiHelper.ResourceAddress}/share/${textRes.langName.replace("-", "_")}/SharePosition.html?currency=${symbolname}&bstype=${item.bstype}&profit=&profitRate=${item.profitRate}&newprice=${item.newprice}&buyprice=${item.buyprice}&url=${url}`,
        }, (ret, err)=> {
                if (!this.actived)
                    return;

                if (err) {
                    item.isBusy = false;
                    if (this.actived)
                        showError("timeout");
                }
                else if (ret.status == 1) {
                    item.isBusy = false;

                    if (this.actived)
                        shareImageReview(ret.data);
                }
        });
    }

    tradeHistoryClick() {
        this.recordAction("Position_交易按钮");
        navigation.push(new TradeHistory());
    }
    setProfitClick(item) {
        var page = new SetProfitLoss(item);
        navigation.push(page);

        if (this.timer == 0)
            this.refreshList();
    }
    expandedClick(item) {
        if (!item.expanded)
            this.recordAction("Position_查看详情");
        item.expanded = !item.expanded;
    }

    onNavigationActived(isResume:boolean) {
        super.onNavigationActived(isResume);
        console.info("Position page actived");

        this.recordPageStart("持仓");

        if (isResume) {
            if (this.model.ListInfo.list.length > 0 && this.model.ListInfo.list.every(m => m.expanded) == false) {
                this.model.ListInfo.list[0].expanded = true;
            }
        }

        if (!this.timer) {
            this.refreshList();
        }
    }

    onNavigationUnActived(isPoping: boolean) {
        super.onNavigationUnActived(isPoping);
        this.recordPageEnd("持仓");

        console.info("Position page unactived");

        clearTimeout(this.timer);
        this.timer = 0;

    }

    private timer: number = 0;
    refreshList() {
        console.debug("持仓刷新价格...");
        
        TradeApi.GetTradeHomeList(this, (ret, err) => {
            if (this.model.isBusy || this.model.isBusy2) {
                this.timer = <any>setTimeout(() => this.refreshList(), 3000);
                return;
            }
            if (this.actived || navigation.queue.some(m => m.constructor == SetProfitLoss)) {
                this.timer = <any>setTimeout(() => this.refreshList(), 3000);
            }
            else {
                this.timer = 0;
            }
           
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

                if (this.model.ListInfo.list.length == 0) {
                    this.model.ListInfo = ret;
                }
                else {
                    var currentList = this.model.ListInfo.list;
                   
                    for (var i = 0; i < ret.list.length; i++) {
                        var existItems = currentList.filter(item => item.posid === ret.list[i].posid);
                        if (existItems.length > 0)
                        {
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
                    
                    this.model.ListInfo = ret;
                    
                }
            }
        });
    }
}