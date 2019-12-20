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
import { ApiHelper } from "../../ServerApis/ApiHelper";
import { KLineDataRefresh } from "../../libs/KLineDataRefresh";
import { Login } from "../RegisterLogin/Login";
import { MainPage } from "../MainPage";
import { Main } from "../../Main";
import { Rule } from "./Rule";
import { getCache, setCache } from "../../GlobalFunc";
import { KlineSetting } from "./KlineSetting";
import { WatchPriceAssistant } from "../My/WatchPriceAssistant";
var html = require("./commodityDetail.html");
var klineoptionkey = "klineoption0";
var CommodityDetail = /** @class */ (function (_super) {
    __extends(CommodityDetail, _super);
    function CommodityDetail(commodity) {
        var _this = _super.call(this, html) || this;
        /**是否已经设置了一次Orientation为auto*/
        _this.settedScreenOrientation = false;
        _this.dynamicValueWidth = 0;
        _this.model = {
            textRes: {},
            commodity: {},
            safeAreaTop: "0px",
            safeAreaBottom: "0px",
            isIPhoneX: false,
            isAppStore: false,
            priceColor: "",
            klineready: false,
            isLandscape: false,
            showConfig: false,
            /**0:ma 1:boll*/
            mainGragh: 0,
            subGraghs: [
                { text: "VOL", selected: false },
                { text: "MACD", selected: false },
                { text: "KDJ", selected: false },
                { text: "RSI", selected: false },
                { text: "WR", selected: false },
            ],
            tabs: [
                {
                    text: "分时",
                    text1: "",
                    text2: "",
                    isMore: false,
                    selected: false,
                    interval: "1minute",
                    format: "MM-dd HH:mm",
                    /**用于横屏排序，表示[ 类型id , 类型子id ]*/
                    type: [0, 0],
                },
                {
                    text: "n分钟",
                    text1: 1,
                    text2: "",
                    isMore: false,
                    selected: false,
                    interval: "1m",
                    format: "MM-dd HH:mm",
                    type: [1, 1],
                },
                {
                    text: "n分钟",
                    text1: 5,
                    text2: "s",
                    isMore: false,
                    selected: true,
                    interval: "5m",
                    format: "MM-dd HH:mm",
                    type: [1, 5],
                },
                {
                    text: "n小时",
                    text1: 1,
                    text2: "",
                    isMore: false,
                    selected: false,
                    interval: "1h",
                    format: "MM-dd HH:mm",
                    type: [2, 1],
                },
                {
                    text: "日K",
                    text1: "",
                    text2: "",
                    isMore: false,
                    selected: false,
                    interval: "1d",
                    format: "MM-dd",
                    type: [3, 1],
                },
                {
                    text: "更多",
                    text1: "",
                    text2: "",
                    isMore: true,
                    selected: false,
                    interval: "",
                },
            ],
            moreTabs: [
                {
                    text: "n分钟",
                    text1: 3,
                    text2: "s",
                    isMore: false,
                    selected: false,
                    interval: "3m",
                    format: "MM-dd HH:mm",
                    type: [1, 3],
                },
                {
                    text: "n分钟",
                    text1: 15,
                    text2: "s",
                    isMore: false,
                    selected: false,
                    interval: "15m",
                    format: "MM-dd HH:mm",
                    type: [1, 15],
                },
                {
                    text: "n分钟",
                    text1: 30,
                    text2: "s",
                    isMore: false,
                    selected: false,
                    interval: "30m",
                    format: "MM-dd HH:mm",
                    type: [1, 30],
                },
                {
                    text: "n小时",
                    text1: 4,
                    text2: "s",
                    isMore: false,
                    selected: false,
                    interval: "4h",
                    format: "MM-dd HH:mm",
                    type: [2, 4],
                }
            ],
        };
        _this.model.isAppStore = ApiHelper.IsDemoMode;
        _this.model.isIPhoneX = Main.isIPhoneX;
        _this.model.commodity = commodity;
        _this.model.textRes = window.textRes;
        if (window.api) {
            _this.model.safeAreaTop = window.api.safeArea.top + "px";
            _this.model.safeAreaBottom = window.api.safeArea.bottom + "px";
        }
        _this.model.priceColor = commodity.isDown ? _this.model.textRes.items["行情列表-跌"] : _this.model.textRes.items["行情列表-涨"];
        _this.dynamicValueWidth = Math.min(window.screen.width, window.screen.height) * 0.16;
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            computed: {
                tradetime: function () {
                    var arr = _this.model.commodity.tradetime.split('-');
                    if (arr[0] === arr[1])
                        return _this.model.textRes.items["7x24小时"];
                    else
                        return _this.model.commodity.tradetime;
                },
                hasSub: function () {
                    return _this.model.subGraghs.some(function (m) { return m.selected; });
                },
                landscapeTabs: function () {
                    var arr = [];
                    _this.model.tabs.forEach(function (m) {
                        if (m.isMore == false)
                            arr.push(m);
                    });
                    _this.model.moreTabs.forEach(function (m) {
                        if (m.isMore == false)
                            arr.push(m);
                    });
                    arr = arr.sort(function (a, b) {
                        if (a.type[0] != b.type[0])
                            return a.type[0] - b.type[0];
                        else
                            return a.type[1] - b.type[1];
                    });
                    return arr;
                },
            },
            methods: _this.getMethodObjectForVue(),
        });
        _this.imgEle = _this.element.querySelector("#imgkline");
        _this.divtab = _this.element.querySelector("#divtab");
        if (window.api) {
            window.api.addEventListener({
                name: 'changeCommodity'
            }, function (ret, err) {
                _this.changeCommodity(ret.value.symbol);
            });
        }
        window.go2Quotation = function () { return _this.go2Quotation(); };
        window.go2position = function () { return _this.go2position(); };
        return _this;
    }
    Object.defineProperty(CommodityDetail.prototype, "needLogin", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommodityDetail.prototype, "title", {
        get: function () {
            if (this.model.isLandscape)
                return "K线页面 - 横屏";
            return "K线页面";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommodityDetail.prototype, "statusBarStyle", {
        get: function () {
            return StatusBarStyle.Dark;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommodityDetail.prototype, "priceType", {
        get: function () {
            var priceType = 0;
            if (getCache("setting_priceType"))
                priceType = parseInt(getCache("setting_priceType"));
            return priceType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommodityDetail.prototype, "currentTab", {
        get: function () {
            for (var i = 0; i < this.model.tabs.length; i++) {
                if (this.model.tabs[i].selected)
                    return this.model.tabs[i];
            }
            for (var i = 0; i < this.model.moreTabs.length; i++) {
                if (this.model.moreTabs[i].selected)
                    return this.model.moreTabs[i];
            }
        },
        enumerable: true,
        configurable: true
    });
    CommodityDetail.prototype.klineSettingClick = function () {
        navigation.push(new KlineSetting(this));
    };
    CommodityDetail.prototype.setMainGragh = function (mode) {
        if (this.model.mainGragh == mode) {
            this.model.mainGragh = 999;
        }
        else
            this.model.mainGragh = mode;
        if (this.klineModule) {
            this.klineOption.mainLineMode = this.model.mainGragh;
            setCache(klineoptionkey, JSON.stringify(this.klineOption));
            this.klineModule.setOption({
                option: this.klineOption
            });
        }
    };
    CommodityDetail.prototype.setSubGragh = function (item) {
        var _this = this;
        if (item === undefined) {
            this.model.subGraghs.forEach(function (m) {
                m.selected = false;
            });
        }
        else {
            if (item.selected) {
                item.selected = false;
            }
            else {
                var count = 0;
                this.model.subGraghs.forEach(function (m) {
                    if (m.selected)
                        count++;
                });
                if (count == 2) {
                    //清空现有
                    this.model.subGraghs.forEach(function (m) {
                        m.selected = false;
                    });
                }
                item.selected = true;
            }
        }
        if (this.klineModule) {
            this.model.subGraghs.forEach(function (m) {
                if (m.selected) {
                    _this.klineOption[m.text.toLocaleLowerCase() + "AreaWeight"] = 0.15;
                }
                else {
                    _this.klineOption[m.text.toLocaleLowerCase() + "AreaWeight"] = 0;
                }
            });
            setCache(klineoptionkey, JSON.stringify(this.klineOption));
            this.klineModule.setOption({
                option: this.klineOption
            });
        }
    };
    CommodityDetail.prototype.go2Quotation = function () {
        navigation.pop(false);
        MainPage.instance.activeQuotation();
    };
    CommodityDetail.prototype.go2position = function () {
        //跳转到持仓
        navigation.pop(false);
        MainPage.instance.activePosition();
    };
    CommodityDetail.prototype.ruleClick = function () {
        this.recordAction("Detail_规则表");
        navigation.push(new Rule(this.model.commodity));
    };
    CommodityDetail.prototype.backClick = function () {
        this.hideApiModule(function () {
            navigation.pop();
        });
    };
    CommodityDetail.prototype.landscapeClick = function () {
        var _this = this;
        this.recordAction("Detail_横屏按钮");
        if (this.model.klineready == false)
            return;
        this.recordPageEnd(this.title);
        this.model.isLandscape = true;
        this.recordPageStart(this.title);
        window.api.setScreenOrientation({
            orientation: 'landscape_left'
        });
        var action = function () {
            _this.imgEle = _this.element.querySelector("#imgkline2");
            if (!_this.imgEle || window.innerWidth < window.innerHeight) {
                setTimeout(action, 10);
                return;
            }
            _this.divtab = _this.element.querySelector("#divtab2");
            _this.setKlinePosition();
        };
        setTimeout(action, 10);
    };
    CommodityDetail.prototype.openOrder = function (bstype) {
        if (Main.layer.isOnFront)
            return;
        var extra = {
            commodity: this.model.commodity,
            bstype: bstype,
            isLandscape: this.model.isLandscape
        };
        if (this.model.isLandscape) {
            Main.layer.pushPage("Order_L", extra);
        }
        else {
            Main.layer.pushPage("Order", extra);
        }
    };
    CommodityDetail.prototype.buyShortClick = function () {
        if (this.model.klineready == false) {
            alert(textRes.items["数据仍在加载中，请稍后再试"]);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            navigation.push(new Login());
        }
        else {
            this.openOrder(2);
        }
    };
    CommodityDetail.prototype.buyLongClick = function () {
        if (this.model.klineready == false) {
            alert(textRes.items["数据仍在加载中，请稍后再试"]);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            navigation.push(new Login());
        }
        else {
            this.openOrder(1);
        }
    };
    CommodityDetail.prototype.hideApiModule = function (callback) {
        if (callback === void 0) { callback = null; }
        if (this.klineModule) {
            this.klineModule.hide(callback);
        }
        else {
            if (callback)
                callback();
        }
    };
    /**
     * 点击其他产品
     * @param commodity
     */
    CommodityDetail.prototype.changeCommodity = function (symbol) {
        this.model.commodity = ApiHelper.getDescription(symbol);
        this.model.priceColor = this.model.commodity.isDown ? this.model.textRes.items["行情列表-跌"] : this.model.textRes.items["行情列表-涨"];
        this.resetKLineRefresh();
    };
    CommodityDetail.prototype.documentClick = function () {
        this.model.showConfig = false;
    };
    CommodityDetail.prototype.titleClick = function () {
        var _this = this;
        this.recordAction("Detail_品种列表选择按钮");
        var commodities = [];
        ApiHelper.Descriptions.forEach(function (item) {
            if (item !== _this.model.commodity && item.commoditytype === _this.model.commodity.commoditytype) {
                if (!item.isdemo || ApiHelper.isDemoMode())
                    commodities.push(item);
            }
        });
        Main.layer.pushPage("CommoditySelector", {
            commodities: commodities
        });
    };
    CommodityDetail.prototype.tabClick = function (tabitem) {
        var _this = this;
        if (tabitem.isMore === false) {
            this.model.tabs.forEach(function (tab) {
                tab.selected = tab === tabitem;
            });
            this.model.moreTabs.forEach(function (tab) {
                tab.selected = tab === tabitem;
            });
            if (this.currentTab.interval != this.klineRefresh.interval) {
                this.resetKLineRefresh();
            }
        }
        else {
            var divMoreTabs = this.element.querySelector("#divMoreTabs");
            if (this.model.isLandscape)
                divMoreTabs = this.element.querySelector("#divMoreTabs2");
            var rect = divMoreTabs.getBoundingClientRect();
            var datas = [];
            this.model.moreTabs.forEach(function (item, index) {
                datas.push({ title: _this.model.textRes.getItem(item.text, item.text1, item.text2), icon: item.selected ? "widget://image/check.png" : "" });
            });
            var mnPopups = window.api.require('MNPopups');
            mnPopups.open({
                rect: {
                    w: 100,
                    h: datas.length * 35
                },
                position: {
                    x: rect.right,
                    y: rect.top
                },
                animation: false,
                styles: {
                    mask: 'rgba(0,0,0,0)',
                    bg: 'rgba(0,0,0,0.5)',
                    corner: 5,
                    cell: {
                        bg: {
                            normal: 'rgba(0,0,0,0)',
                            highlight: 'rgba(0,0,0,0)'
                        },
                        h: 35,
                        title: {
                            marginL: 25,
                            color: '#ffffff',
                            size: 13,
                        },
                        icon: {
                            marginL: 5,
                            w: 16,
                            h: 16,
                            corner: 2
                        },
                        separateLine: {
                            width: 0
                        }
                    },
                    pointer: {
                        size: 7,
                        xPercent: 90,
                        yPercent: 0,
                        orientation: 'downward'
                    }
                },
                datas: datas,
            }, function (ret) {
                if (ret && ret.eventType === "click") {
                    var index = ret.index;
                    console.debug("click" + index);
                    _this.tabClick(_this.model.moreTabs[index]);
                }
            });
        }
    };
    CommodityDetail.prototype.showMenu = function () {
        var _this = this;
        var rect = this.element.querySelector("#divMenu").getBoundingClientRect();
        if (isIOS) {
            var datas = [
                { title: textRes.items["交易规则"] },
                { title: textRes.items["持仓列表"] }
            ];
            var mnPopups = window.api.require('MNPopups');
            mnPopups.open({
                rect: {
                    w: textRes.langName.indexOf("zh") >= 0 ? 120 : 170,
                    h: datas.length * 35
                },
                position: {
                    x: rect.right,
                    y: rect.top + rect.height
                },
                animation: false,
                styles: {
                    mask: 'rgba(0,0,0,0)',
                    bg: 'rgba(0,0,0,0.5)',
                    corner: 5,
                    cell: {
                        bg: {
                            normal: 'rgba(0,0,0,0)',
                            highlight: 'rgba(0,0,0,0)'
                        },
                        h: 35,
                        title: {
                            marginL: 25,
                            color: '#ffffff',
                            size: 13,
                        },
                        icon: {
                            marginL: 5,
                            w: 16,
                            h: 16,
                            corner: 2
                        },
                        separateLine: {
                            width: 0
                        }
                    },
                    pointer: {
                        size: 7,
                        xPercent: 90,
                        yPercent: 0,
                        orientation: 'downward'
                    }
                },
                datas: datas,
            }, function (ret) {
                if (ret && ret.eventType === "click") {
                    var index = ret.index;
                    if (index == 0) {
                        _this.ruleClick();
                    }
                    else if (index == 1) {
                        navigation.pop(false);
                        _this.recordAction("Detail_持仓列表");
                        MainPage.instance.activePosition();
                    }
                }
            });
        }
        else {
            var datas = [
                { title: textRes.items["交易规则"] },
                { title: textRes.items["分享"] },
                //{ title: textRes.items["查看大图"] },
                { title: textRes.items["持仓列表"] }
            ];
            var mnPopups = window.api.require('MNPopups');
            mnPopups.open({
                rect: {
                    w: textRes.langName.indexOf("zh") >= 0 ? 120 : 170,
                    h: datas.length * 35
                },
                position: {
                    x: rect.right,
                    y: rect.top + rect.height
                },
                animation: false,
                styles: {
                    mask: 'rgba(0,0,0,0)',
                    bg: 'rgba(0,0,0,0.5)',
                    corner: 5,
                    cell: {
                        bg: {
                            normal: 'rgba(0,0,0,0)',
                            highlight: 'rgba(0,0,0,0)'
                        },
                        h: 35,
                        title: {
                            marginL: 25,
                            color: '#ffffff',
                            size: 13,
                        },
                        icon: {
                            marginL: 5,
                            w: 16,
                            h: 16,
                            corner: 2
                        },
                        separateLine: {
                            width: 0
                        }
                    },
                    pointer: {
                        size: 7,
                        xPercent: 90,
                        yPercent: 0,
                        orientation: 'downward'
                    }
                },
                datas: datas,
            }, function (ret) {
                if (ret && ret.eventType === "click") {
                    var index = ret.index;
                    if (index == 0) {
                        _this.ruleClick();
                    }
                    else if (index == 1) {
                        _this.share();
                    }
                    else if (index == 2) {
                        navigation.pop(false);
                        _this.recordAction("Detail_持仓列表");
                        MainPage.instance.activePosition();
                    }
                }
            });
        }
    };
    CommodityDetail.prototype.portraitClick = function () {
        var _this = this;
        if (window.api && this.model.isLandscape) {
            this.recordPageEnd(this.title);
            this.model.isLandscape = false;
            this.recordPageStart(this.title);
            window.api.setScreenOrientation({
                orientation: 'portrait_up'
            });
            var action = function () {
                _this.imgEle = _this.element.querySelector("#imgkline");
                if (!_this.imgEle || window.innerWidth > window.innerHeight) {
                    setTimeout(action, 10);
                    return;
                }
                _this.divtab = _this.element.querySelector("#divtab");
                _this.setKlinePosition();
            };
            setTimeout(action, 10);
        }
    };
    CommodityDetail.prototype.resetOptionForSetting = function () {
        if (this.klineOption) {
            var settingOption = KlineSetting.lineViewOption;
            for (var p in settingOption) {
                if (this.klineOption[p] != undefined)
                    this.klineOption[p] = settingOption[p];
            }
            this.klineModule.setOption({
                option: this.klineOption
            });
        }
    };
    CommodityDetail.prototype.onNavigationActived = function (isResume) {
        _super.prototype.onNavigationActived.call(this, isResume);
        if (this.klineModule)
            this.klineModule.show();
    };
    CommodityDetail.prototype.onNavigationUnActived = function (isPop) {
        _super.prototype.onNavigationUnActived.call(this, isPop);
        this.hideApiModule();
    };
    CommodityDetail.prototype.onBeforeNavigationPoped = function () {
        _super.prototype.onBeforeNavigationPoped.call(this);
        //document.removeEventListener("visibilitychange", this.visibilitychangeEventHandler);
        if (this.klineRefresh) {
            this.klineRefresh.dispose();
        }
        if (this.klineModule)
            this.klineModule.close();
    };
    CommodityDetail.prototype.onNavigationPushed = function () {
        var _this = this;
        _super.prototype.onNavigationPushed.call(this);
        this.orientationchangeAction = function () {
            if (Main.layer.isOnFront) {
                Main.layer.hide();
            }
            var action;
            if (window.orientation == 0 || window.orientation == 180) {
                //竖屏
                _this.model.isLandscape = false;
                action = function () {
                    _this.imgEle = _this.element.querySelector("#imgkline");
                    if (!_this.imgEle || window.innerWidth > window.innerHeight) {
                        _this.checkIngEleTimer = window.setTimeout(action, 10);
                        return;
                    }
                    _this.checkIngEleTimer = 0;
                    _this.divtab = _this.element.querySelector("#divtab");
                    _this.setKlinePosition();
                };
            }
            else {
                _this.model.isLandscape = true;
                action = function () {
                    _this.imgEle = _this.element.querySelector("#imgkline2");
                    if (!_this.imgEle || window.innerWidth < window.innerHeight) {
                        _this.checkIngEleTimer = window.setTimeout(action, 10);
                        return;
                    }
                    _this.checkIngEleTimer = 0;
                    _this.divtab = _this.element.querySelector("#divtab2");
                    _this.setKlinePosition();
                };
            }
            window.clearTimeout(_this.checkIngEleTimer);
            _this.checkIngEleTimer = window.setTimeout(action, 10);
        };
        window.addEventListener("orientationchange", this.orientationchangeAction);
        this.resetKLineRefresh();
    };
    CommodityDetail.prototype.onNavigationPoped = function () {
        _super.prototype.onNavigationPoped.call(this);
        window.clearTimeout(this.checkIngEleTimer);
        window.removeEventListener("orientationchange", this.orientationchangeAction);
        if (window.api) {
            window.api.setScreenOrientation({
                orientation: "portrait_up"
            });
        }
    };
    CommodityDetail.prototype.resetKLineRefresh = function () {
        var _this = this;
        this.model.klineready = false;
        if (this.klineRefresh)
            this.klineRefresh.dispose();
        if (KLineDataRefresh.checkHasCache(this.model.commodity, this.currentTab.interval, this.priceType)) {
            this.resetKLineRefresh2();
        }
        else if (this.klineModule) {
            //没有缓存，隐藏一下，可以显示转圈
            this.klineModule.hide(function (ret, err) { return _this.resetKLineRefresh2(); });
        }
        else {
            this.resetKLineRefresh2();
        }
    };
    CommodityDetail.prototype.share = function () {
        if (!window.api)
            return;
        this.recordAction("Detail_分享按钮");
        var screenClip = window.api.require('screenClip');
        screenClip.screenShot({
            imgPath: "fs://",
            imgName: "screen.png",
        }, function (ret, err) {
            console.log(JSON.stringify([ret, err]));
            if (ret.status) {
                try {
                    if (isIOS) {
                        var sharedModule = window.api.require('shareAction');
                        sharedModule.shareImage({
                            images: ["fs://screen.png"]
                        });
                    }
                    else {
                        var module = window.api.require('kLine');
                        module.shareImage({
                            image: "fs://screen.png",
                            title: "",
                        });
                    }
                }
                catch (e) {
                }
            }
        });
    };
    /**设置k线模块的位置 */
    CommodityDetail.prototype.setKlinePosition = function () {
        var rect = this.imgEle.getBoundingClientRect();
        this.imgEle.style.width = parseInt(rect.width) + "px";
        this.imgEle.style.height = parseInt(rect.height) + "px";
        rect = this.imgEle.getBoundingClientRect();
        if (!this.klineModule)
            this.klineModule = window.api.require('kLine');
        var param = {
            x: rect.left,
            y: rect.top,
            w: rect.width,
            h: rect.height,
            option: this.klineOption,
        };
        try {
            this.klineModule.open(param);
        }
        catch (e) {
            alert(1);
            alert(e.message);
        }
        if (!this.settedScreenOrientation) {
            this.settedScreenOrientation = true;
            if (window.api) {
                window.api.setScreenOrientation({
                    orientation: "auto"
                });
            }
        }
    };
    CommodityDetail.prototype.resetKLineRefresh2 = function () {
        var _this = this;
        //this.visibilitychangeEventHandlerTimer = 0;
        var myinterval = this.currentTab.interval;
        if (this.klineRefresh) {
            try {
                this.klineRefresh.dispose();
            }
            catch (e) { }
        }
        this.klineRefresh = new KLineDataRefresh(this.model.commodity, myinterval);
        this.klineRefresh.priceType = this.priceType;
        this.klineRefresh.onLoadedFirstData = function (sender, ret) {
            if (window.api && _this.actived && !_this.klineModule) {
                _this.klineModule = window.api.require('kLine');
                var myTipText = [];
                myTipText[0] = _this.model.textRes.items["时间"];
                myTipText[1] = _this.model.textRes.items["开"];
                myTipText[2] = _this.model.textRes.items["高"];
                myTipText[3] = _this.model.textRes.items["低"];
                myTipText[4] = _this.model.textRes.items["收"];
                myTipText[5] = _this.model.textRes.items["涨跌额"];
                myTipText[6] = _this.model.textRes.items["涨跌幅"];
                myTipText[7] = _this.model.textRes.items["成交量"];
                _this.klineOption = getCache(klineoptionkey);
                if (!_this.klineOption) {
                    _this.klineOption = {
                        tipText: myTipText,
                        isMinute: myinterval == "1minute",
                        macdAreaWeight: 0.15,
                        volAreaWeight: 0.15,
                        drawDynamicValue: false,
                        pillarWidth: 16,
                        currentPriceDescText: _this.model.textRes.items["当前价"],
                        stopProfitLossOnTopDown: false,
                        timeDifference: 0,
                        decimalplace: _this.model.commodity.decimalplace,
                        maItems: [5, 10, 30],
                        maColors: ["#35c8b1", "#e7b574", "#cf16d2"],
                        boll_n: 20,
                        boll_k: 2,
                        macdConfig: [12, 26, 9],
                        rsi_N: [6, 12, 24],
                        wr_N: [10, 6],
                    };
                }
                else {
                    _this.klineOption = JSON.parse(_this.klineOption);
                }
                _this.klineOption.drawDynamicValue = false;
                _this.klineOption.dynamicValueWidth = parseInt(_this.dynamicValueWidth);
                _this.klineOption.tipTextColorForUp = textRes.items["K线Tip涨"];
                _this.klineOption.tipTextColorForDown = textRes.items["K线Tip跌"];
                _this.klineOption.colorForKlineUp = textRes.items["KLineUpColor"];
                _this.klineOption.colorForKlineDown = textRes.items["KLineDownColor"];
                if (_this.klineOption.mainLineMode !== undefined)
                    _this.model.mainGragh = _this.klineOption.mainLineMode;
                _this.model.subGraghs.forEach(function (item) {
                    var name = item.text.toLocaleLowerCase();
                    if (_this.klineOption[name + "AreaWeight"])
                        item.selected = true;
                });
                var settingOption = KlineSetting.lineViewOption;
                for (var p in settingOption) {
                    if (_this.klineOption[p] != undefined)
                        _this.klineOption[p] = settingOption[p];
                }
                _this.setKlinePosition();
            }
            if (_this.klineModule) {
                _this.klineModule.setDatas({
                    datas: ret
                });
                if (ret.length > 0) {
                    _this.klineModule.setPrice({
                        leftPrice: ret[0].close.toFixed(_this.model.commodity.decimalplace),
                    });
                }
                _this.klineOption.isMinute = myinterval == "1minute";
                _this.klineOption.timeFormat = _this.currentTab.format;
                _this.klineOption.decimalplace = _this.model.commodity.decimalplace;
                _this.klineModule.setOption({
                    option: _this.klineOption
                });
                //alert(JSON.stringify(this.klineOption));
                _this.klineModule.show();
            }
            _this.model.klineready = true;
        };
        this.klineRefresh.onRefreshData = function (sender, ret) {
            if (_this.klineModule) {
                _this.klineModule.setPrice({
                    datas: ret
                });
            }
        };
        this.klineRefresh.onTick = function (sender, time) {
            //如果是买价K线，不把tick同步到k线中
            //if (this.priceType == 1)
            //    return;
            //console.log(time + "," + this.klineRefresh.datas[0].times);
            var dataitem = _this.klineRefresh.datas[0];
            dataitem = JSON.parse(JSON.stringify(dataitem));
            console.log(JSON.stringify(dataitem));
            if (true || dataitem.times >= time) {
                //dataitem.times = time;
                dataitem.close = _this.priceType == 0 ? _this.model.commodity.bidPrice : _this.model.commodity.offerPrice;
                if (dataitem.close > dataitem.high)
                    dataitem.high = dataitem.close;
                if (dataitem.close < dataitem.low)
                    dataitem.low = dataitem.close;
                if (_this.klineModule) {
                    _this.klineModule.setPrice({
                        leftPrice: dataitem.close.toFixed(_this.model.commodity.decimalplace),
                        datas: [dataitem]
                    });
                }
            }
            else {
                console.log("tick时间对不上：tick:" + new Date(time).toLocaleString() + "\r\n对比数据：" + new Date(dataitem.times).toLocaleString());
            }
        };
        this.klineRefresh.loadFirstData();
    };
    CommodityDetail.prototype.openWatchList = function () {
        navigation.push(new WatchPriceAssistant());
    };
    return CommodityDetail;
}(BaseComponent));
export { CommodityDetail };
//# sourceMappingURL=CommodityDetail.js.map