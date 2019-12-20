import { Component } from "jack-one-script";
import Vue from "vue";

import { ApiHelper, Description } from "../ServerApis/ApiHelper";
import { clone, showError } from "../Global";
import { BaseComponent, StatusBarStyle } from "../BaseComponent";
import { MarketApi } from "../ServerApis/MarketApi";
import { PullToRefresh } from "jack-one-script";
import { CommodityDetail } from "./CommodityDetail/CommodityDetail";
import { MessageType, MessageCenter } from "../MessageCenter";
import { setTimeout } from "timers";
import { getCache } from "../GlobalFunc";

var html = require("./quotation.html");

export class Quotation extends BaseComponent {
    get statusBarStyle(): StatusBarStyle {
        return StatusBarStyle.Dark;
    }

    get needLogin() {
        return false;
    }

    vm: Vue;
    model = {
        textRes: {},
        commodityTypes: [],
        commodities: [],
        showTitle:true,
    };
    private refreshPriceTimer: number = 0;

    constructor(showtitle=true) {
        super(html);

        this.model.showTitle = showtitle;
        this.model.textRes = (<any>window).textRes;      
        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
            errorCaptured: (err, vm, info) => {
                alert(JSON.stringify([err, info]));
                return false;
            },
        });

        if (ApiHelper.CommodityTypes) {
            this.bind();
        }
        else {
            MessageCenter.register(MessageType.CommodityReady, () => {
                this.bind();
            });
        }


        MessageCenter.register(MessageType.StartRefreshQuotation, () => {
            this.canRefresh = true;
            this.refreshPriceTimer = <any>setTimeout(() => this.refreshPrice(), 100);
        });
        MessageCenter.register(MessageType.StopRefreshQuotation, () => {
            this.canRefresh = false;
            if (this.refreshPriceTimer) {
                clearTimeout(this.refreshPriceTimer);
                this.refreshPriceTimer = 0;
            }
        });
    }

    typeClick(type) {
        this.model.commodityTypes.forEach((item) => {
            item.selected = item === type;
        });
        this.bindCommodities();
    };

    itemClick(commodity: Description) {
        this.recordAction(`Market_${commodity.marketsymbol}x${commodity.leverage}`);
        var page = new CommodityDetail(commodity);
        navigation.push(page);
    }

    bind() {
        this.model.commodityTypes.splice(0, this.model.commodityTypes.length);

        ApiHelper.CommodityTypes.forEach((item, index) => {
            item.selected = index == 0;
            this.model.commodityTypes.push(item);
        });

        this.bindCommodities();
        this.refreshPrice();
    }

    bindCommodities() {
        this.model.commodities.splice(0, this.model.commodities.length);
        var typeid = 0;
        ApiHelper.CommodityTypes.forEach((item) => {
            if (item.selected) {
                typeid = item.commoditytypeid;
            }
        });

        ApiHelper.Descriptions.forEach((item) => {
            if (item.commoditytype == typeid) {
                if (!item.isdemo || ApiHelper.isDemoMode()) {
                    this.model.commodities.push(item);
                }                   
            }
        });
        
    }

    private refreshPrice() {

        console.log("行情刷新价格...");
        var priceType = 0;
        try {
            if (getCache("setting_priceType")) {
                priceType = parseInt(getCache("setting_priceType"));
            }
        }
        catch (e) {
        }

        MarketApi.GetPrice(null,0, (ret, err) => {
            if (err) {
            }
            else {
               
                ret.forEach((item) => {
                    var commodity = ApiHelper.getDescription(item.symbol);
                    if (commodity) {
                        commodity.bidPrice = item.bidPrice;

                        commodity.showPrice = priceType == 0 ? item.bidPrice : item.offerPrice;
                        commodity.preClose = item.preClose;
                        commodity.tradestatus = item.tradestatus;
                        commodity.status = item.status;

                        var upv = (item.bidPrice - item.preClose);
                        if (upv >= 0)
                            commodity.updownValue = "+" + upv.toFixed(commodity.decimalplace);
                        else
                            commodity.updownValue = upv.toFixed(commodity.decimalplace);

                        var percent = (upv * 100) / item.preClose;
                        if (percent >= 0) {
                            commodity.isDown = false;
                            commodity.percent = "+" + percent.toFixed(2) + "%";
                        }
                        else {
                            commodity.isDown = true;
                            commodity.percent = percent.toFixed(2) + "%";
                        }
                    }
                });
            }

            if (this.canRefresh) {
                this.refreshPriceTimer = <any>setTimeout(() => this.refreshPrice(), 3000);
            }
        });
    }

    private canRefresh = false;
    onNavigationActived(isResume: boolean) {
        super.onNavigationActived(isResume);

        this.recordPageStart("行情");

        this.canRefresh = true;
        if (this.model.commodities.length > 0) {
            MessageCenter.raise(MessageType.StartRefreshQuotation, null);
        }
    }

    onNavigationUnActived(isPop: boolean) {
        super.onNavigationUnActived(isPop);

        this.recordPageEnd("行情");

        this.canRefresh = false;
        MessageCenter.raise(MessageType.StopRefreshQuotation, null);
    }
}