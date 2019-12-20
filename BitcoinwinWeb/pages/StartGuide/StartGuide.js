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
import { Swiper } from "jack-one-script";
import Vue from "vue";
var html = require("./startGuide.html");
var StartGuide = /** @class */ (function (_super) {
    __extends(StartGuide, _super);
    function StartGuide(action) {
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: null,
            isEnd: false
        };
        _this.action = action;
        _this.model.textRes = textRes;
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            methods: _this.getMethodObjectForVue(),
            data: _this.model,
        });
        _this.element.style.position = "absolute";
        _this.element.style.left = "0px";
        _this.element.style.top = "0px";
        return _this;
    }
    StartGuide.prototype.onViewReady = function () {
        var _this = this;
        _super.prototype.onViewReady.call(this);
        var html1 = require("./1.html").replace("{{1}}", textRes.items["法币入金出金流程快捷安全"])
            .replace("{{2}}", textRes.items["推荐好友可获丰厚返利"]);
        var html2 = require("./2.html").replace("{{1}}", textRes.getItem("交易保证金年化收益n", "25%"))
            .replace("{{2}}", textRes.items["低至10USDT一手"]);
        var html3 = require("./3.html").replace("{{1}}", textRes.items["不发币"])
            .replace("{{2}}", textRes.items["只服务主流数字资产"]);
        this.swiper = new Swiper(this.element.querySelector("#main"), {
            autoPlayInterval: 0,
            borderRadius: 0,
            defaultScale: 1,
            imgPaths: [html1, html2, html3],
            imgHeight: 0,
            imgWidth: 0,
            canRepeat: false,
            paginationBgColor: "#D8D8D8",
            paginationBottom: window.parseInt(1.05 * window.__remConfig_flag),
            paginationCurrentBgColor: "#EA3131",
            paginationMargin: window.parseInt(0.33 * window.__remConfig_flag),
            paginationSize: window.parseInt(0.3 * window.__remConfig_flag),
            showPagination: true,
        });
        this.swiper.currentIndexChange = function (s, index) {
            _this.model.isEnd = index === 2;
            if (_this.model.isEnd && _this.action) {
                _this.action();
                _this.action = null;
            }
        };
    };
    StartGuide.prototype.endClick = function () {
        this.swiper.dispose();
        this.dispose();
    };
    return StartGuide;
}(BaseComponent));
export { StartGuide };
//# sourceMappingURL=StartGuide.js.map