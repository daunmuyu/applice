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
var html = require("./beginnerGuide.html");
var BeginnerGuide = /** @class */ (function (_super) {
    __extends(BeginnerGuide, _super);
    function BeginnerGuide(fromWhere) {
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
    Object.defineProperty(BeginnerGuide.prototype, "needLogin", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    BeginnerGuide.prototype.open = function (imgname, count, title) {
        var page = new WebBrowser({
            src: ApiHelper.ResourceAddress + "/BeginnersGuide/index.html?imgname=" + imgname + "&lang=" + textRes.langName.replace("-", "_") + "&count=" + count,
            fullScreen: true,
            title: textRes.items[title],
            backButtonColor: "#fff",
            invokeIsReadyOnLoad: true,
            jsAction: this._finishAction,
        });
        navigation.push(page);
    };
    BeginnerGuide.prototype.positionClick = function () {
        this.recordAction(this.fromWhere + "_Teach_查看持仓");
        this._finishAction = function (action) {
            navigation.pop(false);
        };
        this.open("checkpositions", 2, "查看持仓");
    };
    BeginnerGuide.prototype.rechargeClick = function () {
        this.recordAction(this.fromWhere + "_Teach_充值");
        var imgname = encodeURIComponent("imgs_" + textRes.langName.replace("-", "_") + "/recharge.png");
        var page = new WebBrowser({
            src: ApiHelper.ResourceAddress + "/BeginnersGuide/index2.html?imgname=" + imgname,
            fullScreen: false,
            title: textRes.items["充值"],
        });
        navigation.push(page);
    };
    BeginnerGuide.prototype.withdrawClick = function () {
        this.recordAction(this.fromWhere + "_Teach_提现");
        var imgname = encodeURIComponent("imgs_" + textRes.langName.replace("-", "_") + "/withdraw.png");
        var page = new WebBrowser({
            src: ApiHelper.ResourceAddress + "/BeginnersGuide/index2.html?imgname=" + imgname,
            fullScreen: false,
            title: textRes.items["提现"],
        });
        navigation.push(page);
    };
    BeginnerGuide.prototype.orderClick = function () {
        this.recordAction(this.fromWhere + "_Teach_交易");
        var imgname = encodeURIComponent("imgs_" + textRes.langName.replace("-", "_") + "/trade.png");
        var page = new WebBrowser({
            src: ApiHelper.ResourceAddress + "/BeginnersGuide/index2.html?imgname=" + imgname,
            fullScreen: false,
            title: textRes.items["交易"],
        });
        navigation.push(page);
    };
    return BeginnerGuide;
}(BaseComponent));
export { BeginnerGuide };
//# sourceMappingURL=BeginnerGuide.js.map