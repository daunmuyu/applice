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
import { WebBrowser } from "../WebBrowser";
import { ApiHelper } from "../../ServerApis/ApiHelper";
var html = require("./questions.html");
var Questions = /** @class */ (function (_super) {
    __extends(Questions, _super);
    function Questions(fromWhere) {
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: {},
            isBusy: false,
        };
        _this.fromWhere = fromWhere;
        _this.model.textRes = textRes;
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
        });
        return _this;
    }
    Object.defineProperty(Questions.prototype, "needLogin", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Questions.prototype.tradeClick = function () {
        this.recordAction(this.fromWhere + "_Question_交易相关");
        var page = new WebBrowser({
            src: ApiHelper.ResourceAddress + "/Questions/trading." + this.model.textRes.langName.replace("-", "_") + ".html",
            fullScreen: false,
            title: this.model.textRes.items["交易相关"]
        });
        navigation.push(page);
    };
    Questions.prototype.rechargeClick = function () {
        this.recordAction(this.fromWhere + "_Question_充值相关");
        var page = new WebBrowser({
            src: ApiHelper.ResourceAddress + "/Questions/recharge." + this.model.textRes.langName.replace("-", "_") + ".html",
            fullScreen: false,
            title: this.model.textRes.items["充值相关"]
        });
        navigation.push(page);
    };
    Questions.prototype.withdrawClick = function () {
        this.recordAction(this.fromWhere + "_Question_提现相关");
        var page = new WebBrowser({
            src: ApiHelper.ResourceAddress + "/Questions/withdraw." + this.model.textRes.langName.replace("-", "_") + ".html",
            fullScreen: false,
            title: this.model.textRes.items["提现相关"]
        });
        navigation.push(page);
    };
    Questions.prototype.usdtClick = function () {
        this.recordAction(this.fromWhere + "_Question_USDT相关");
        var page = new WebBrowser({
            src: ApiHelper.ResourceAddress + "/Questions/usdt." + this.model.textRes.langName.replace("-", "_") + ".html",
            fullScreen: false,
            title: this.model.textRes.items["USDT相关"]
        });
        navigation.push(page);
    };
    Questions.prototype.interestClick = function () {
        this.recordAction(this.fromWhere + "_Question_利息相关");
        var page = new WebBrowser({
            src: ApiHelper.ResourceAddress + "/Questions/interest." + this.model.textRes.langName.replace("-", "_") + ".html",
            fullScreen: false,
            title: this.model.textRes.items["利息相关"]
        });
        navigation.push(page);
    };
    Questions.prototype.friendClick = function () {
        this.recordAction(this.fromWhere + "_Question_邀请好友相关");
        var page = new WebBrowser({
            src: ApiHelper.ResourceAddress + "/Questions/friends." + this.model.textRes.langName.replace("-", "_") + ".html",
            fullScreen: false,
            title: this.model.textRes.items["邀请好友相关"]
        });
        navigation.push(page);
    };
    Questions.prototype.platformClick = function () {
        this.recordAction(this.fromWhere + "_Question_平台相关");
        var page = new WebBrowser({
            src: ApiHelper.ResourceAddress + "/Questions/platform." + this.model.textRes.langName.replace("-", "_") + ".html",
            fullScreen: false,
            title: this.model.textRes.items["平台相关"]
        });
        navigation.push(page);
    };
    Questions.prototype.accountClick = function () {
        this.recordAction(this.fromWhere + "_Question_账户相关");
        var page = new WebBrowser({
            src: ApiHelper.ResourceAddress + "/Questions/account." + this.model.textRes.langName.replace("-", "_") + ".html",
            fullScreen: false,
            title: this.model.textRes.items["账户相关"]
        });
        navigation.push(page);
    };
    return Questions;
}(BaseComponent));
export { Questions };
//# sourceMappingURL=Questions.js.map