import { BaseComponent, StatusBarStyle } from "../../BaseComponent";
import { Component } from "jack-one-script";
import Vue from "vue";
import { TradeApi } from "../../ServerApis/TradeApi";
import { showError } from "../../Global";
import { TextRes } from "../../TextRes";
import { ApiHelper } from "../../ServerApis/ApiHelper";
import { AccountApi } from "../../ServerApis/AccountApi";
import { Home } from "../Home";
import { shareImage, shareImageReview } from "../../GlobalFunc";

var html = require("./tradeHistory.html");
export class TradeHistory extends BaseComponent {
    vm: Vue;
    model = {
        isBusy: false,
        isDemoMode: false,
        textRes: <TextRes>{},
        datas: [],
        types: [],
        opType: undefined,
        pageNumber: 1,
        hasMore: true,
        dataError: false,
        showFilter:true,
    };

    

    constructor() {
        super(html);
        if (Home.AccountInfo && Home.AccountInfo.accountMoneyInfo.isAllowDocumentary == false)
            this.model.showFilter = false;


        var textRes: TextRes = this.model.textRes = (<any>window).textRes;
        this.model.isDemoMode = ApiHelper.IsDemoMode;

        this.model.types.push({ id: undefined, name: this.model.textRes.items['全部'] });
        this.model.types.push({ id: 2, name: this.model.textRes.items['自动跟单'] });

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
            watch: {
                opType: (newValue) => {
                    this.model.pageNumber = 1;
                    this.model.hasMore = true;
                    this.loadData();
                }
            }
        });
    }

    async share(item) {
        if (item.isBusy)
            return;
        this.recordAction("TradeHistory_分享");
        item.isBusy = true;

        var url;
        try {
            url = encodeURIComponent(Home.AccountInfo.accountMoneyInfo.registerurl);
        }
        catch (e) {
            try {
                var ret = await AccountApi.GetAccountInfo(this);
                Home.AccountInfo = ret;
                url = encodeURIComponent(ret.accountMoneyInfo.registerurl);
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
        console.log(`${ApiHelper.ResourceAddress}/share/${textRes.langName.replace("-", "_")}/SharePosition.html?currency=${symbolname}&bstype=${item.bstype}&profitRate=${item.profitRate}&profit=&newprice=${item.newprice}&buyprice=${item.buyprice}&url=${url}`);

        module.saveWebImage({
            w: 1043,
            h: 1854,
            waitForReady: true,
            url: `${ApiHelper.ResourceAddress}/share/${textRes.langName.replace("-", "_")}/SharePosition.html?currency=${symbolname}&bstype=${item.bstype}&profitRate=${item.profitRate}&profit=&newprice=${item.newprice}&buyprice=${item.buyprice}&url=${url}`,
        }, (ret, err) => {
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

        TradeApi.GetTradeDetailList(this, this.model.pageNumber, 20, this.model.opType,(ret, err) => {
            this.model.isBusy = false;
            if (err) {
                this.model.dataError = true;
                showError(err);
            }                
            else {
                this.model.pageNumber++;
                for (var i = 0; i < ret.list.length; i++) {
                    ret.list[i].isBusy = false;
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