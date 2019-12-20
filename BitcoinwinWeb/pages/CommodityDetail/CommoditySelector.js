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
import { Component } from "jack-one-script";
import Vue from "vue";
import { ApiHelper } from "../../ServerApis/ApiHelper";
import { MarketApi } from "../../ServerApis/MarketApi";
import { Main } from "../../Main";
var html = require("./commoditySelector.html");
var CommoditySelector = /** @class */ (function (_super) {
    __extends(CommoditySelector, _super);
    function CommoditySelector(param) {
        var _this = _super.call(this, html) || this;
        _this.model = {
            safeAreaTop: "",
            otherCommdities: [],
            textRes: {},
        };
        _this.canRefresh = false;
        if (window.api) {
            _this.model.safeAreaTop = window.api.safeArea.top + "px";
        }
        _this.model.textRes = window.textRes;
        _this.model.otherCommdities = param.commodities;
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
        });
        _this.divLeftMenu = _this.element.querySelector("#divLeftMenu");
        return _this;
    }
    Object.defineProperty(CommoditySelector.prototype, "needLogin", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommoditySelector.prototype, "statusBarStyle", {
        get: function () {
            return StatusBarStyle.None;
        },
        enumerable: true,
        configurable: true
    });
    CommoditySelector.prototype.onNavigationPushed = function () {
        _super.prototype.onNavigationPushed.call(this);
        this.showMenu();
    };
    CommoditySelector.prototype.showMenu = function () {
        var _this = this;
        Component.setBodyDisabled(true);
        this.animationFuncEnd = function () {
            Component.setBodyDisabled(false);
            _this.divLeftMenu.style.transform = "translate3d(0%,0px,0)";
            _this.divLeftMenu.style.animation = "";
            _this.divLeftMenu.style.webkitAnimation = "";
            _this.divLeftMenu.style.animationFillMode = "";
            _this.divLeftMenu.style.webkitAnimationFillMode = "";
            // Chrome, Safari 和 Opera 代码
            _this.divLeftMenu.removeEventListener("webkitAnimationEnd", _this.animationFuncEnd);
            // 标准语法
            _this.divLeftMenu.removeEventListener("animationend", _this.animationFuncEnd);
            _this.canRefresh = true;
            _this.refreshPrice();
        };
        // Chrome, Safari 和 Opera 代码
        this.divLeftMenu.addEventListener("webkitAnimationEnd", this.animationFuncEnd);
        // 标准语法
        this.divLeftMenu.addEventListener("animationend", this.animationFuncEnd);
        this.divLeftMenu.style.animation = "_commoditySelector_keyframe 0.25s linear";
        this.divLeftMenu.style.webkitAnimation = "_commoditySelector_keyframe 0.25s linear";
        this.divLeftMenu.style.animationFillMode = "forwards"; //这两句代码必须放在animation赋值的后面
        this.divLeftMenu.style.webkitAnimationFillMode = "forwards";
    };
    CommoditySelector.prototype.hideMenu = function () {
        var _this = this;
        this.canRefresh = false;
        Component.setBodyDisabled(true);
        this.animationFuncEnd = function () {
            Component.setBodyDisabled(false);
            _this.divLeftMenu.style.transform = "translate3d(-99%,0px,0)";
            _this.divLeftMenu.style.animation = "";
            _this.divLeftMenu.style.webkitAnimation = "";
            _this.divLeftMenu.style.animationFillMode = "";
            _this.divLeftMenu.style.webkitAnimationFillMode = "";
            // Chrome, Safari 和 Opera 代码
            _this.divLeftMenu.removeEventListener("webkitAnimationEnd", _this.animationFuncEnd);
            // 标准语法
            _this.divLeftMenu.removeEventListener("animationend", _this.animationFuncEnd);
            Main.layer.hide();
        };
        // Chrome, Safari 和 Opera 代码
        this.divLeftMenu.addEventListener("webkitAnimationEnd", this.animationFuncEnd);
        // 标准语法
        this.divLeftMenu.addEventListener("animationend", this.animationFuncEnd);
        this.divLeftMenu.style.animation = "_commoditySelector_keyframe2 0.25s linear";
        this.divLeftMenu.style.webkitAnimation = "_commoditySelector_keyframe2 0.25s linear";
        this.divLeftMenu.style.animationFillMode = "forwards"; //这两句代码必须放在animation赋值的后面
        this.divLeftMenu.style.webkitAnimationFillMode = "forwards";
    };
    CommoditySelector.prototype.otherClick = function (item) {
        window.api.sendEvent({
            name: 'changeCommodity',
            extra: {
                symbol: item.symbol
            }
        });
    };
    CommoditySelector.prototype.refreshPrice = function () {
        var _this = this;
        console.log("行情刷新价格 at selector..." + this.model.otherCommdities[0].commoditytype);
        MarketApi.GetPrice(null, this.model.otherCommdities[0].commoditytype, function (ret, err) {
            if (!_this.canRefresh)
                return;
            if (err) {
            }
            else {
                ret.forEach(function (item) {
                    var commodity = ApiHelper.getDescriptionByList(item.symbol, _this.model.otherCommdities);
                    if (commodity) {
                        commodity.bidPrice = item.bidPrice;
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
            if (_this.canRefresh) {
                setTimeout(function () { return _this.refreshPrice(); }, 3000);
            }
        });
    };
    return CommoditySelector;
}(BaseComponent));
export { CommoditySelector };
//# sourceMappingURL=CommoditySelector.js.map