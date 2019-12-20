import { BaseComponent } from "../../BaseComponent";
import Vue from "vue";
import { TextRes } from "../../TextRes";
import { WebBrowser } from "../WebBrowser";
import { ApiHelper } from "../../ServerApis/ApiHelper";


var html = require("./questions.html");
export class Questions extends BaseComponent {
    vm: Vue;
    fromWhere: string;
    model = {
        textRes: <TextRes>{},
        isBusy:false,
    };
    get needLogin() {
        return false;
    }
    constructor(fromWhere: string) {
        super(html);
        this.fromWhere = fromWhere;
        this.model.textRes = textRes;

        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
        });
    }

    tradeClick() {
        this.recordAction(this.fromWhere + "_Question_交易相关");
        var page = new WebBrowser({
            src: `${ApiHelper.ResourceAddress}/Questions/trading.${this.model.textRes.langName.replace("-", "_")}.html`,
            fullScreen: false,
            title: this.model.textRes.items["交易相关"]
        });
        navigation.push(page);
    }
    rechargeClick() {
        this.recordAction(this.fromWhere + "_Question_充值相关");
        var page = new WebBrowser({
            src: `${ApiHelper.ResourceAddress}/Questions/recharge.${this.model.textRes.langName.replace("-", "_")}.html`,
            fullScreen: false,
            title: this.model.textRes.items["充值相关"]
        });
        navigation.push(page);
    }
    withdrawClick() {
        this.recordAction(this.fromWhere + "_Question_提现相关");
        var page = new WebBrowser({
            src: `${ApiHelper.ResourceAddress}/Questions/withdraw.${this.model.textRes.langName.replace("-", "_")}.html`,
            fullScreen: false,
            title: this.model.textRes.items["提现相关"]
        });
        navigation.push(page);
    }

    usdtClick() {
        this.recordAction(this.fromWhere + "_Question_USDT相关");
        var page = new WebBrowser({
            src: `${ApiHelper.ResourceAddress}/Questions/usdt.${this.model.textRes.langName.replace("-", "_")}.html`,
            fullScreen: false,
            title: this.model.textRes.items["USDT相关"]
        });
        navigation.push(page);
    }
    interestClick() {
        this.recordAction(this.fromWhere + "_Question_利息相关");
        var page = new WebBrowser({
            src: `${ApiHelper.ResourceAddress}/Questions/interest.${this.model.textRes.langName.replace("-", "_")}.html`,
            fullScreen: false,
            title: this.model.textRes.items["利息相关"]
        });
        navigation.push(page);
    }
    friendClick() {
        this.recordAction(this.fromWhere + "_Question_邀请好友相关");
        var page = new WebBrowser({
            src: `${ApiHelper.ResourceAddress}/Questions/friends.${this.model.textRes.langName.replace("-", "_")}.html`,
            fullScreen: false,
            title: this.model.textRes.items["邀请好友相关"]
        });
        navigation.push(page);
    }
    platformClick() {
        this.recordAction(this.fromWhere + "_Question_平台相关");
        var page = new WebBrowser({
            src: `${ApiHelper.ResourceAddress}/Questions/platform.${this.model.textRes.langName.replace("-", "_")}.html`,
            fullScreen: false,
            title: this.model.textRes.items["平台相关"]
        });
        navigation.push(page);
    }
    accountClick() {
        this.recordAction(this.fromWhere + "_Question_账户相关");
        var page = new WebBrowser({
            src: `${ApiHelper.ResourceAddress}/Questions/account.${this.model.textRes.langName.replace("-", "_")}.html`,
            fullScreen: false,
            title: this.model.textRes.items["账户相关"]
        });
        navigation.push(page);
    }
}