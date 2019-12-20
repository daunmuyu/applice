﻿import { BaseComponent, StatusBarStyle } from "../../BaseComponent";
import { Component } from "jack-one-script";
import Vue from "vue";
import { TradeApi } from "../../ServerApis/TradeApi";
import { showError } from "../../Global";
import { TextRes } from "../../TextRes";
import { ApiHelper } from "../../ServerApis/ApiHelper";
import { IndexApi } from "../../ServerApis/IndexApi";

var html = require("./ranking.html");
export class Ranking extends BaseComponent {
    vm: Vue;
    model = {
        isBusy: false,
        textRes: <TextRes>{},
        datas: [],
        pageNumber: 1,
        hasMore: true,
        dataError: false,
    };
    get needLogin() {
        return false;
    }


    constructor() {
        super(html);

        this.model.textRes = textRes;

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

        IndexApi.rankings(this, this.model.pageNumber, 18, (ret, err) => {
            this.model.isBusy = false;
            if (err) {
                this.model.dataError = true;
                showError(err);
            }
            else {
                this.model.pageNumber++;
                for (var i = 0; i < ret.length; i++) {
                    this.model.datas.push(ret[i]);
                }
                this.model.hasMore = ret.length == 18;
            }
        });
    }
    loadMore() {
        this.loadData();
    }
}