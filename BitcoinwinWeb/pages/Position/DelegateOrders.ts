import { BaseComponent, StatusBarStyle } from "../../BaseComponent";
import { Component } from "jack-one-script";
import Vue from "vue";
import { TradeApi } from "../../ServerApis/TradeApi";
import { showError } from "../../Global";
import { TextRes } from "../../TextRes";
import { ApiHelper } from "../../ServerApis/ApiHelper";
import { CanceledOrders } from "./CanceledOrders";
import { confirmWindow } from "../../GlobalFunc";
import { AlertWindow } from "../General/AlertWindow";

var html = require("./delegateOrders.html");
export class DelegateOrders extends BaseComponent {
    vm: Vue;
    model = {
        isBusy: false,
        textRes: <TextRes>{},
        datas: [],
        pageNumber: 1,
        hasMore: true,
        dataError: false,
    };



    constructor() {
        super(html);

        var textRes: TextRes = this.model.textRes = (<any>window).textRes;

        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
            computed: {
                moretext: () => {
                    if (this.model.dataError)
                        return textRes.items["点击重新加载"];
                    else if (this.model.isBusy)
                        return textRes.items["正在加载"] + "...";
                    else if (this.model.hasMore)
                        return textRes.items["加载更多"];
                    else if (this.model.datas.length == 0)
                        return textRes.items["目前还没有数据"];
                    else
                        return textRes.items["没有更多数据了"];

                },
            },
        });

    }

    showCanceledOrders() {
        navigation.push(new CanceledOrders());
    }

    async cancelAllOrders(event: MouseEvent) {

        if (await confirmWindow(textRes.items["确定要撤销所有委托单吗"])) {
            this.model.isBusy = true;

            TradeApi.OnekeyCancelOrder(this, event.clientX, event.clientY,(ret, err) => {
                this.model.isBusy = false;
                if (err)
                    showError(err);
                else {
                    this.model.datas.splice(0, this.model.datas.length);
                    this.model.pageNumber = 1;
                    this.model.hasMore = false;
                }
            });
        }
    }

    alertWin:AlertWindow;
    cancelAllOrders_step2() {
        var hasError = false;
        var startTime = new Date().getTime();

        this.alertWin = new AlertWindow();
        this.alertWin.model.content = textRes.items["正在撤单"] + "...";
        this.alertWin.model.isBusy++;
        this.alertWin.element.style.position = "absolute";
        this.alertWin.element.style.left = "0px";
        this.alertWin.element.style.top = "0px";
        this.alertWin.setParent(document.body);

        var checkOrderAction = async () => {
            if (hasError && (new Date().getTime() - startTime) >= 20000) {
                toast(textRes.items['网络异常，请检查您的网络连接'], 3);

                this.model.datas.splice(0, this.model.datas.length);
                this.model.pageNumber = 1;
                this.model.hasMore = false;

                this.alertWin.dispose();
                return;
            }

            try {
                var status = await TradeApi.checkAllCancelOrderStatus(this);
                if (status == 0) {

                    this.model.datas.splice(0, this.model.datas.length);
                    this.model.pageNumber = 1;
                    this.model.hasMore = false;

                    this.alertWin.dispose();
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

    async cancelOrder(event: MouseEvent, item) {
        if (await confirmWindow(textRes.items["确定要撤销这个委托单吗"])) {
            this.model.isBusy = true;

            TradeApi.CancelOrder(this, event.clientX, event.clientY,  item.orderno, (ret, err) => {
                this.model.isBusy = false;
                if (err)
                    showError(err);
                else {
                    var index = this.model.datas.indexOf(item);
                    if (index >= 0)
                        this.model.datas.splice(index, 1);
                }
            });
        }
    }

    cancelOrders_step2(orderNo , item) {
        var hasError = false;
        var startTime = new Date().getTime();

        this.alertWin = new AlertWindow();
        this.alertWin.model.content = textRes.items["正在撤单"] + "...";
        this.alertWin.model.isBusy++;
        this.alertWin.element.style.position = "absolute";
        this.alertWin.element.style.left = "0px";
        this.alertWin.element.style.top = "0px";
        this.alertWin.setParent(document.body);

        var checkOrderAction = async () => {
            if (hasError && (new Date().getTime() - startTime) >= 20000) {
                toast(textRes.items['网络异常，请检查您的网络连接'], 3);

                var index = this.model.datas.indexOf(item);
                if (index >= 0)
                    this.model.datas.splice(index, 1);

                this.alertWin.dispose();
                return;
            }

            try {
                var status = await TradeApi.IsDeal(this, orderNo);
                if (status == 4) {

                    var index = this.model.datas.indexOf(item);
                    if (index >= 0)
                        this.model.datas.splice(index, 1);

                    this.alertWin.dispose();
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

    onNavigationPushed() {
        super.onNavigationPushed();

        this.loadData();
    }

    loadData() {
        if (this.model.isBusy || this.model.hasMore == false)
            return;

        this.model.isBusy = true;
        this.model.dataError = false;

        if (this.model.pageNumber == 1) {
            this.model.datas = [];
            this.model.hasMore = true;
        }

        TradeApi.GetEntrustOrderList(this, this.model.pageNumber, 20, (ret, err) => {
            this.model.isBusy = false;
            if (err) {
                this.model.dataError = true;
                showError(err);
            }
            else {
                console.log(JSON.stringify(ret));
                this.model.pageNumber++;
                for (var i = 0; i < ret.list.length; i++) {
                    this.model.datas.push(ret.list[i]);
                }
                this.model.hasMore = ret.list.length == 20;
            }
        });
    }
    loadMore() {
        this.loadData();
    }
}