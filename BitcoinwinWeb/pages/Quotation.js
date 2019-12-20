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
import Vue from "vue";
import { ApiHelper } from "../ServerApis/ApiHelper";
import { BaseComponent, StatusBarStyle } from "../BaseComponent";
import { MarketApi } from "../ServerApis/MarketApi";
import { CommodityDetail } from "./CommodityDetail/CommodityDetail";
import { MessageType, MessageCenter } from "../MessageCenter";
import { setTimeout } from "timers";
import { getCache } from "../GlobalFunc";
var html = require("./quotation.html");
var Quotation = /** @class */ (function (_super) {
    __extends(Quotation, _super);
    function Quotation(showtitle) {
        if (showtitle === void 0) { showtitle = true; }
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: {},
            commodityTypes: [],
            commodities: [],
            showTitle: true,
        };
        _this.refreshPriceTimer = 0;
        _this.canRefresh = false;
        _this.model.showTitle = showtitle;
        _this.model.textRes = window.textRes;
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
            errorCaptured: function (err, vm, info) {
                alert(JSON.stringify([err, info]));
                return false;
            },
        });
        if (ApiHelper.CommodityTypes) {
            _this.bind();
        }
        else {
            MessageCenter.register(MessageType.CommodityReady, function () {
                _this.bind();
            });
        }
        MessageCenter.register(MessageType.StartRefreshQuotation, function () {
            _this.canRefresh = true;
            _this.refreshPriceTimer = setTimeout(function () { return _this.refreshPrice(); }, 100);
        });
        MessageCenter.register(MessageType.StopRefreshQuotation, function () {
            _this.canRefresh = false;
            if (_this.refreshPriceTimer) {
                clearTimeout(_this.refreshPriceTimer);
                _this.refreshPriceTimer = 0;
            }
        });
        return _this;
    }
    Object.defineProperty(Quotation.prototype, "statusBarStyle", {
        get: function () {
            return StatusBarStyle.Dark;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Quotation.prototype, "needLogin", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Quotation.prototype.typeClick = function (type) {
        this.model.commodityTypes.forEach(function (item) {
            item.selected = item === type;
        });
        this.bindCommodities();
    };
    ;
    Quotation.prototype.itemClick = function (commodity) {
        this.recordAction("Market_" + commodity.marketsymbol + "x" + commodity.leverage);
        var page = new CommodityDetail(commodity);
        navigation.push(page);
    };
    Quotation.prototype.bind = function () {
        var _this = this;
        this.model.commodityTypes.splice(0, this.model.commodityTypes.length);
        ApiHelper.CommodityTypes.forEach(function (item, index) {
            item.selected = index == 0;
            _this.model.commodityTypes.push(item);
        });
        this.bindCommodities();
        this.refreshPrice();
    };
    Quotation.prototype.bindCommodities = function () {
        var _this = this;
        this.model.commodities.splice(0, this.model.commodities.length);
        var typeid = 0;
        ApiHelper.CommodityTypes.forEach(function (item) {
            if (item.selected) {
                typeid = item.commoditytypeid;
            }
        });
        ApiHelper.Descriptions.forEach(function (item) {
            if (item.commoditytype == typeid) {
                if (!item.isdemo || ApiHelper.isDemoMode()) {
                    _this.model.commodities.push(item);
                }
            }
        });
    };
    Quotation.prototype.refreshPrice = function () {
        var _this = this;
        console.log("行情刷新价格...");
        var priceType = 0;
        try {
            if (getCache("setting_priceType")) {
                priceType = parseInt(getCache("setting_priceType"));
            }
        }
        catch (e) {
        }
        MarketApi.GetPrice(null, 0, function (ret, err) {
            if (err) {
            }
            else {
                ret.forEach(function (item) {
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
            if (_this.canRefresh) {
                _this.refreshPriceTimer = setTimeout(function () { return _this.refreshPrice(); }, 3000);
            }
        });
    };
    Quotation.prototype.onNavigationActived = function (isResume) {
        _super.prototype.onNavigationActived.call(this, isResume);
        this.recordPageStart("行情");
        this.canRefresh = true;
        if (this.model.commodities.length > 0) {
            MessageCenter.raise(MessageType.StartRefreshQuotation, null);
        }
    };
    Quotation.prototype.onNavigationUnActived = function (isPop) {
        _super.prototype.onNavigationUnActived.call(this, isPop);
        this.recordPageEnd("行情");
        this.canRefresh = false;
        MessageCenter.raise(MessageType.StopRefreshQuotation, null);
    };
    return Quotation;
}(BaseComponent));
export { Quotation };
//# sourceMappingURL=Quotation.js.map