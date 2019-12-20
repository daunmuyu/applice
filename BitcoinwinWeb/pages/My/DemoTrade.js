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
import { BaseComponent, StatusBarStyle } from "../../BaseComponent";
import Vue from "vue";
import { TradeHistory } from "../Position/TradeHistory";
import { Navigation, HttpClient } from "jack-one-script";
import { Quotation } from "../Quotation";
import { Position } from "../Position/Position";
import { ApiHelper } from "../../ServerApis/ApiHelper";
var html = require("./demoTrade.html");
var Tab = /** @class */ (function () {
    function Tab() {
    }
    return Tab;
}());
var DemoTrade = /** @class */ (function (_super) {
    __extends(DemoTrade, _super);
    function DemoTrade() {
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: {},
            safeAreaTop: "",
            isBusy: false,
            tabs: [],
        };
        DemoTrade.instance = _this;
        HttpClient.defaultHeaders["IsDemo"] = "1";
        ApiHelper.UrlAddresses.currentUrls = ApiHelper.UrlAddresses.demoApiUrls;
        if (window.api) {
            window.api.sendEvent({
                name: 'DemoIn',
                extra: {
                    mode: true,
                }
            });
        }
        _this.model.textRes = textRes;
        if (window.api) {
            _this.model.safeAreaTop = window.api.safeArea.top + "px";
        }
        _this.model.tabs = [
            {
                title: textRes.items["模拟行情"],
                selected: true,
                component: new Quotation(false)
            },
            {
                title: textRes.items["模拟持仓"],
                selected: false,
                component: new Position(false)
            }
        ];
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
        });
        _this.myNavi = new Navigation();
        _this.myNavi.element.style.left = "0px";
        _this.myNavi.element.style.top = "0px";
        _this.myNavi.element.style.width = "100%";
        _this.myNavi.element.style.height = "100%";
        _this.myNavi.element.style.position = "absolute";
        _this.myNavi.setParent(_this.element.querySelector("#main"));
        _this.myNavi.push(_this.model.tabs[1].component, false);
        _this.myNavi.push(_this.model.tabs[0].component, false);
        return _this;
    }
    Object.defineProperty(DemoTrade.prototype, "needLogin", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DemoTrade.prototype, "statusBarStyle", {
        get: function () {
            return StatusBarStyle.Light;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DemoTrade.prototype, "title", {
        get: function () {
            return "模拟交易";
        },
        enumerable: true,
        configurable: true
    });
    /**切换到行情页 */
    DemoTrade.prototype.activeQuotation = function () {
        for (var i = 0; i < this.model.tabs.length; i++) {
            if (this.model.tabs[i].component.constructor === Quotation) {
                this.tabClick(this.model.tabs[i]);
                break;
            }
        }
    };
    /**切换到持仓页 */
    DemoTrade.prototype.activePosition = function () {
        for (var i = 0; i < this.model.tabs.length; i++) {
            if (this.model.tabs[i].component.constructor === Position) {
                this.tabClick(this.model.tabs[i]);
                break;
            }
        }
    };
    DemoTrade.prototype.tabClick = function (tab) {
        this.model.tabs.forEach(function (item) {
            item.selected = item === tab;
        });
        this.myNavi.bringToFront(tab.component);
    };
    DemoTrade.prototype.backClick = function () {
        navigation.pop();
    };
    DemoTrade.prototype.tradeHistoryClick = function () {
        navigation.push(new TradeHistory());
    };
    DemoTrade.prototype.onNavigationUnActived = function (isPoping) {
        if (isPoping) {
            this.myNavi.pop(false);
            this.myNavi.pop(false);
            this.myNavi.dispose();
            ApiHelper.UrlAddresses.currentUrls = ApiHelper.UrlAddresses.apiUrls;
        }
        _super.prototype.onNavigationUnActived.call(this, isPoping);
    };
    DemoTrade.prototype.onBeforeNavigationPoped = function () {
        _super.prototype.onBeforeNavigationPoped.call(this);
        delete HttpClient.defaultHeaders.IsDemo;
        if (window.api) {
            window.api.sendEvent({
                name: 'DemoIn',
                extra: {
                    mode: false,
                }
            });
        }
    };
    DemoTrade.prototype.onNavigationPoped = function () {
        _super.prototype.onNavigationPoped.call(this);
        DemoTrade.instance = undefined;
    };
    return DemoTrade;
}(BaseComponent));
export { DemoTrade };
//# sourceMappingURL=DemoTrade.js.map