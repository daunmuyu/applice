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
var html = require("./aboutus.html");
var AboutUs = /** @class */ (function (_super) {
    __extends(AboutUs, _super);
    function AboutUs() {
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: null,
            isBusy: 0,
        };
        _this.model.textRes = textRes;
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
        });
        return _this;
    }
    Object.defineProperty(AboutUs.prototype, "needLogin", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    AboutUs.prototype.aboutUsClick = function () {
        var page = new WebBrowser({
            src: ApiHelper.ResourceAddress + "/aboutus/index." + this.model.textRes.langName.replace("-", "_") + ".html",
            fullScreen: true,
            backButtonColor: "#ea3031",
        });
        navigation.push(page);
    };
    AboutUs.prototype.fengXianClick = function () {
        var page = new WebBrowser({
            src: ApiHelper.ResourceAddress + "/RegistrationAgreement." + this.model.textRes.langName.replace("-", "_") + ".html",
            fullScreen: false,
            title: this.model.textRes.items["风险揭示_我的"]
        });
        navigation.push(page);
    };
    AboutUs.prototype.licai_fengxian_click = function () {
        var page = new WebBrowser({
            src: ApiHelper.ResourceAddress + "/licai_fengxian." + this.model.textRes.langName.replace("-", "_") + ".html",
            fullScreen: false,
            title: this.model.textRes.items["理财风险揭示"]
        });
        navigation.push(page);
    };
    return AboutUs;
}(BaseComponent));
export { AboutUs };
//# sourceMappingURL=AboutUs.js.map