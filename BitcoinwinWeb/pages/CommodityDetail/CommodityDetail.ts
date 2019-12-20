import { BaseComponent, StatusBarStyle } from "../../BaseComponent";
import Vue from "vue";
import { Component } from "jack-one-script";
import { showError } from "../../Global";
import { Description, ApiHelper } from "../../ServerApis/ApiHelper";
import { KLineDataRefresh } from "../../libs/KLineDataRefresh";

import { Order } from "./Order";
import { MarketApi } from "../../ServerApis/MarketApi";
import { TradeApi, BuyInfo } from "../../ServerApis/TradeApi";
import { TextRes } from "../../TextRes";
import { Login } from "../RegisterLogin/Login";
import { WebBrowser } from "../WebBrowser";
import { fail } from "assert";
import { debug } from "util";
import { MainPage } from "../MainPage";
import { Main } from "../../Main";
import { Rule } from "./Rule";
import { alertWindow, getCache, setCache } from "../../GlobalFunc";
import { KlineSetting } from "./KlineSetting";
import { WatchPriceAssistant } from "../My/WatchPriceAssistant";

var html = require("./commodityDetail.html");
var klineoptionkey = "klineoption0";
export class CommodityDetail extends BaseComponent {
    vm: Vue;
    imgEle: HTMLImageElement;
    divtab: HTMLElement;

    get needLogin() {
        return false;
    }

    klineModule: any;
    klineOption: any;
    /**是否已经设置了一次Orientation为auto*/
    settedScreenOrientation = false;

    dynamicValueWidth = 0;
    klineRefresh: KLineDataRefresh;
    model = {
        textRes: <TextRes>{},
        commodity: <Description>{},
        safeAreaTop: "0px",
        safeAreaBottom: "0px",
        isIPhoneX: false,
        isAppStore:false,
        priceColor: "",
        klineready: false,
        isLandscape: false,
        showConfig: false,
        /**0:ma 1:boll*/
        mainGragh:0,
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
                type:[0,0],
            },
            {
                text: "n分钟",
                text1: 1,
                text2:"",
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

    orientationchangeAction: () => void;

    get title(): string {
        if (this.model.isLandscape)
            return "K线页面 - 横屏";

        return "K线页面";
    }

    get statusBarStyle() {
        return StatusBarStyle.Dark;
    }

    get priceType() {
        var priceType = 0; 
        if (getCache("setting_priceType"))
            priceType = parseInt(getCache("setting_priceType"));
        return priceType;
    }

    get currentTab(): any {
        for (var i = 0; i < this.model.tabs.length; i++) {
            if (this.model.tabs[i].selected)
                return this.model.tabs[i];
        }
        for (var i = 0; i < this.model.moreTabs.length; i++) {
            if (this.model.moreTabs[i].selected)
                return this.model.moreTabs[i];
        }
    }


    constructor(commodity: Description) {
        super(html);

        this.model.isAppStore = ApiHelper.IsDemoMode;
        this.model.isIPhoneX = Main.isIPhoneX;
        this.model.commodity = commodity;
        this.model.textRes = (<any>window).textRes;      
        if (window.api) {
            this.model.safeAreaTop = window.api.safeArea.top + "px";
            this.model.safeAreaBottom = window.api.safeArea.bottom + "px";
        }
        this.model.priceColor = commodity.isDown ? (<any>this.model.textRes).items["行情列表-跌"] : (<any>this.model.textRes).items["行情列表-涨"];

        this.dynamicValueWidth = Math.min(window.screen.width, window.screen.height) * 0.16;

        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            computed: {
                tradetime: () => {
                    var arr = (<any>this.model.commodity).tradetime.split('-');
                    if (arr[0] === arr[1])
                        return (<any>this.model.textRes).items["7x24小时"];
                    else
                        return (<any>this.model.commodity).tradetime;
                },
                hasSub: () => {
                    return this.model.subGraghs.some(m => m.selected);
                },
                landscapeTabs: () => {
                    var arr = [];

                    this.model.tabs.forEach(m => {
                        if (m.isMore == false)
                            arr.push(m);
                    });
                    this.model.moreTabs.forEach(m => {
                        if (m.isMore == false)
                            arr.push(m);
                    });
                    arr = arr.sort((a, b) => {
                        if (a.type[0] != b.type[0])
                            return a.type[0] - b.type[0];
                        else
                            return a.type[1] - b.type[1];
                    });
                    return arr;
                },
            },
            methods: this.getMethodObjectForVue(),
        });

        this.imgEle = (<HTMLImageElement>this.element.querySelector("#imgkline"));
        this.divtab = (<HTMLImageElement>this.element.querySelector("#divtab"));

        if (window.api) {
            (<any>window).api.addEventListener({
                name: 'changeCommodity'
            }, (ret, err) => {
                this.changeCommodity(ret.value.symbol);
            });
        }            
        (<any>window).go2Quotation = () => this.go2Quotation();
        (<any>window).go2position = () => this.go2position();
    }

    klineSettingClick() {
        navigation.push(new KlineSetting(this));
    }

    

    setMainGragh(mode) {
        if (this.model.mainGragh == mode) {
            this.model.mainGragh = 999;            
        }
        else
            this.model.mainGragh = mode;

        if (this.klineModule) {
            this.klineOption.mainLineMode = this.model.mainGragh;
            setCache(klineoptionkey , JSON.stringify(this.klineOption));

            this.klineModule.setOption({
                option: this.klineOption
            });
        }
        
    }
    setSubGragh(item) {
        if (item === undefined) {
            this.model.subGraghs.forEach(m => {
                m.selected = false;
            });
        }
        else {
            if (item.selected) {
                item.selected = false;
            }
            else {
                var count = 0;
                this.model.subGraghs.forEach(m => {
                    if (m.selected)
                        count++;
                });
                if (count == 2) {
                    //清空现有
                    this.model.subGraghs.forEach(m => {
                        m.selected = false;
                    });
                }
                item.selected = true;
            }
        }
       

        if (this.klineModule) {

            this.model.subGraghs.forEach(m => {
                if (m.selected) {
                    this.klineOption[m.text.toLocaleLowerCase() + "AreaWeight"] = 0.15;
                }
                else {
                    this.klineOption[m.text.toLocaleLowerCase() + "AreaWeight"] = 0;
                }
            });


            setCache(klineoptionkey, JSON.stringify(this.klineOption));

            this.klineModule.setOption({
                option: this.klineOption
            });
        }
    }
    go2Quotation() {
        navigation.pop(false);
        MainPage.instance.activeQuotation();
    }
    go2position() {
        //跳转到持仓
        navigation.pop(false);
        MainPage.instance.activePosition();
    }

    ruleClick() {
        this.recordAction("Detail_规则表");
        navigation.push(new Rule(this.model.commodity));
    }

    backClick() {
        this.hideApiModule(() => {
            navigation.pop();
        });        
    }

    landscapeClick() {
        this.recordAction("Detail_横屏按钮");

        if (this.model.klineready == false)
            return;

        this.recordPageEnd(this.title);
        this.model.isLandscape = true;
        this.recordPageStart(this.title);

        window.api.setScreenOrientation({
            orientation: 'landscape_left'
        });

        var action = () => {
            this.imgEle = (<HTMLImageElement>this.element.querySelector("#imgkline2"));
            if (!this.imgEle || window.innerWidth < window.innerHeight) {
                setTimeout(action, 10);
                return;
            }
            this.divtab = (<HTMLImageElement>this.element.querySelector("#divtab2"));
            this.setKlinePosition();        
        };
        setTimeout(action, 10);
    }

    openOrder(bstype: number) {
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

    }

    buyShortClick() {
       
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
       
    }

    buyLongClick() {

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
    }


    hideApiModule(callback:()=>void=null) {
        if (this.klineModule) {
            this.klineModule.hide(callback);
        }
        else {
            if (callback)
                callback();
        }
    }

    /**
     * 点击其他产品
     * @param commodity
     */
    changeCommodity(symbol: string) {        
        this.model.commodity = ApiHelper.getDescription(symbol);

        this.model.priceColor = (<Description>this.model.commodity).isDown ? (<any>this.model.textRes).items["行情列表-跌"] : (<any>this.model.textRes).items["行情列表-涨"];
        this.resetKLineRefresh();
    }

    animationFuncEnd: any;
    documentClick() {
        this.model.showConfig = false;
    }
    titleClick() {
        this.recordAction("Detail_品种列表选择按钮");
        var commodities = [];
        ApiHelper.Descriptions.forEach((item) => {
            if (item !== this.model.commodity && item.commoditytype === (<any>this.model.commodity).commoditytype) {
                if (!item.isdemo || ApiHelper.isDemoMode())
                    commodities.push(item);
            }
        });
        Main.layer.pushPage("CommoditySelector", {
            commodities: commodities
        });
    }

    tabClick(tabitem) {
   
        if (tabitem.isMore === false) {
            this.model.tabs.forEach((tab) => {
                tab.selected = tab === tabitem;
            });
            this.model.moreTabs.forEach((tab) => {
                tab.selected = tab === tabitem;
            });

            if (this.currentTab.interval != this.klineRefresh.interval) {
                this.resetKLineRefresh();
            }
        }
        else {

            var divMoreTabs = <HTMLElement>this.element.querySelector("#divMoreTabs");
            if (this.model.isLandscape)
                divMoreTabs = <HTMLElement>this.element.querySelector("#divMoreTabs2");
            var rect = divMoreTabs.getBoundingClientRect();

            var datas = [];
            this.model.moreTabs.forEach((item, index) => {
                datas.push({ title: (<any>this.model.textRes).getItem(item.text, item.text1, item.text2), icon: item.selected?"widget://image/check.png":""});
            });

            var mnPopups = (<any>window).api.require('MNPopups');
            mnPopups.open({
                rect: {
                    w: 100,
                    h: datas.length*35
                },
                position: {
                    x: rect.right,
                    y: rect.top
                },
                animation:false,
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
                        separateLine: {              //（可选项）JSON 类型；分割线的样式设置
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
            }, (ret)=> {
                if (ret && ret.eventType === "click") {
                    var index = ret.index;
                    console.debug("click" + index);
                    this.tabClick(this.model.moreTabs[index]);
                }
            });
        }
    }

    showMenu() {
        var rect = this.element.querySelector("#divMenu").getBoundingClientRect();
        if (isIOS) {
            var datas = [
                { title: textRes.items["交易规则"] },
                { title: textRes.items["持仓列表"] }
            ];

            var mnPopups = (<any>window).api.require('MNPopups');
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
                        separateLine: {              //（可选项）JSON 类型；分割线的样式设置
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
            }, (ret) => {
                if (ret && ret.eventType === "click") {
                    var index = ret.index;
                    if (index == 0) {
                        this.ruleClick();
                    }
                    else if (index == 1) {
                        navigation.pop(false);
                        this.recordAction("Detail_持仓列表");
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

            var mnPopups = (<any>window).api.require('MNPopups');
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
                        separateLine: {              //（可选项）JSON 类型；分割线的样式设置
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
            }, (ret) => {
                if (ret && ret.eventType === "click") {
                    var index = ret.index;
                    if (index == 0) {
                        this.ruleClick();
                    }
                    else if (index == 1) {

                        this.share();
                    }
                    else if (index == 2) {
                        navigation.pop(false);
                        this.recordAction("Detail_持仓列表");
                        MainPage.instance.activePosition();
                    }
                }
            });
        }
        
    }

    portraitClick() {
        if (window.api && this.model.isLandscape) {
            this.recordPageEnd(this.title);

            this.model.isLandscape = false;
            this.recordPageStart(this.title);


            window.api.setScreenOrientation({
                orientation: 'portrait_up'
            });

            var action = () => {
                this.imgEle = (<HTMLImageElement>this.element.querySelector("#imgkline"));
                if (!this.imgEle || window.innerWidth > window.innerHeight) {
                    setTimeout(action, 10);
                    return;
                }
                this.divtab = (<HTMLImageElement>this.element.querySelector("#divtab"));
                this.setKlinePosition();
            };
            setTimeout(action, 10);
        }
    }

    resetOptionForSetting() {
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
       
    }

    onNavigationActived(isResume: boolean) {
        super.onNavigationActived(isResume);

        if (this.klineModule)
            this.klineModule.show();

    }

    onNavigationUnActived(isPop: boolean) {
        super.onNavigationUnActived(isPop);
        this.hideApiModule();

    }

    onBeforeNavigationPoped() {
        super.onBeforeNavigationPoped();

        //document.removeEventListener("visibilitychange", this.visibilitychangeEventHandler);

        if (this.klineRefresh) {
            this.klineRefresh.dispose();
        }

        if (this.klineModule)
            this.klineModule.close();

        
    }

    checkIngEleTimer: number;
    onNavigationPushed() {
        super.onNavigationPushed(); 

        this.orientationchangeAction = () => {

            if (Main.layer.isOnFront) {
                Main.layer.hide();
            }

            var action;

            if (window.orientation == 0 || window.orientation == 180) {
                //竖屏
                this.model.isLandscape = false;

                window.clearTimeout(this.checkIngEleTimer);
                this.checkIngEleTimer = 0;

                this.imgEle = (<HTMLImageElement>this.element.querySelector("#imgkline"));
                this.divtab = (<HTMLImageElement>this.element.querySelector("#divtab"));

                if (this.klineModule) {
                    this.setKlinePosition();
                }
                
            }
            else {
                this.model.isLandscape = true;
                if (CommodityDetail._initKLinePosition2) {
                    window.clearTimeout(this.checkIngEleTimer);
                    this.checkIngEleTimer = 0;

                    this.imgEle = (<HTMLImageElement>this.element.querySelector("#imgkline2"));
                    this.divtab = (<HTMLImageElement>this.element.querySelector("#divtab2"));

                    if (this.klineModule) {
                        this.setKlinePosition();
                    }
                    return;
                }
                action = () => {
                    this.imgEle = (<HTMLImageElement>this.element.querySelector("#imgkline2"));
                    if (!this.imgEle || this.imgEle.getBoundingClientRect().width < this.imgEle.getBoundingClientRect().height) {
                        this.checkIngEleTimer = window.setTimeout(action, 10);
                        return;
                    }
                    this.checkIngEleTimer = 0;
                    this.divtab = (<HTMLImageElement>this.element.querySelector("#divtab2"));
                    if (this.klineModule) {
                        this.klineModule.show();
                        this.setKlinePosition();
                    }
                };

                window.clearTimeout(this.checkIngEleTimer);
                this.checkIngEleTimer = 0;

                if (this.klineModule) {
                    this.klineModule.hide();
                }
                this.checkIngEleTimer = window.setTimeout(action, 500);
            }
           
        };
        window.addEventListener("orientationchange", this.orientationchangeAction);


        this.resetKLineRefresh();
    }

    onNavigationPoped() {
        super.onNavigationPoped();
        window.clearTimeout(this.checkIngEleTimer);
        window.removeEventListener("orientationchange", this.orientationchangeAction);

        if (window.api) {
            window.api.setScreenOrientation({
                orientation: "portrait_up"
            });
        }
    }

    resetKLineRefresh() {
        this.model.klineready = false;

        if (KLineDataRefresh.checkHasCache(<Description>this.model.commodity, this.currentTab.interval, this.priceType)) {
          
            this.resetKLineRefresh2();
        }
        else if (this.klineModule) {
            //没有缓存，隐藏一下，可以显示转圈
            this.klineModule.hide((ret, err) => this.resetKLineRefresh2());
        }
        else {
            this.resetKLineRefresh2();
        }
    }

    share() {
        if (!window.api)
            return;

        this.recordAction("Detail_分享按钮");

        var screenClip = window.api.require('screenClip');
        screenClip.screenShot({
            imgPath: "fs://",
            imgName:"screen.png",
        }, (ret, err) => {
            console.log(JSON.stringify([ret,err]));
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
    }

    _initKLinePosition = null;
    /**横屏的坐标*/
    static _initKLinePosition2 = null;
    /**设置k线模块的位置 */
    setKlinePosition() {
        var rect = this.imgEle.getBoundingClientRect();
       
        this.imgEle.style.width = parseInt(<any>rect.width) + "px";
        this.imgEle.style.height = parseInt(<any>rect.height) + "px";
        rect = this.imgEle.getBoundingClientRect();

        if (!this.klineModule)
            this.klineModule = (<any>window).api.require('kLine');  

        if (this.model.isLandscape == false) {
            if (!this._initKLinePosition) {
                this._initKLinePosition = rect;
            }
            else if (this._initKLinePosition) {
                //竖屏，采用初始的位置
                rect = this._initKLinePosition;
            }
        }
        else if (this.model.isLandscape) {
            if (!CommodityDetail._initKLinePosition2) {
                CommodityDetail._initKLinePosition2 = rect;
            }
            else if (CommodityDetail._initKLinePosition2) {
                //竖屏，采用初始的位置
                rect = CommodityDetail._initKLinePosition2;
            }
        }
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
    }

    resetKLineRefresh2() {

        //this.visibilitychangeEventHandlerTimer = 0;
        var myinterval = this.currentTab.interval;      

        if (!this.klineRefresh || this.klineRefresh.commodity.marketsymbol != this.model.commodity.marketsymbol) {
            if (this.klineRefresh) {
                try {
                    this.klineRefresh.dispose();
                }
                catch (e) { }
            }
            this.klineRefresh = new KLineDataRefresh(this.model.commodity, myinterval);
        }
        else
            this.klineRefresh.setInterval(myinterval);

        this.klineRefresh.priceType = this.priceType;

        this.klineRefresh.onLoadedFirstData = (sender, ret) => {

            if ((<any>window).api && this.actived && !this.klineModule) {

                this.klineModule = (<any>window).api.require('kLine');

                var myTipText = [];
                myTipText[0] = (<any>this.model.textRes).items["时间"];
                myTipText[1] = (<any>this.model.textRes).items["开"];
                myTipText[2] = (<any>this.model.textRes).items["高"];
                myTipText[3] = (<any>this.model.textRes).items["低"];
                myTipText[4] = (<any>this.model.textRes).items["收"];
                myTipText[5] = (<any>this.model.textRes).items["涨跌额"];
                myTipText[6] = (<any>this.model.textRes).items["涨跌幅"];
                myTipText[7] = (<any>this.model.textRes).items["成交量"];

                this.klineOption = getCache(klineoptionkey);

                if (!this.klineOption) {
                    this.klineOption = {
                        tipText: myTipText,
                        isMinute: myinterval == "1minute",
                        macdAreaWeight: 0.15,
                        volAreaWeight: 0.15,
                        drawDynamicValue: false,
                        pillarWidth: 16,
                        currentPriceDescText: this.model.textRes.items["当前价"],
                        stopProfitLossOnTopDown: false,
                        timeDifference: 0,
                        decimalplace: (<Description>this.model.commodity).decimalplace,


                        maItems : [5, 10, 30],
                        maColors: ["#35c8b1", "#e7b574", "#cf16d2"],

                        boll_n: 20,
                        boll_k: 2,

                        macdConfig: [12, 26, 9],

                        rsi_N: [6, 12, 24],
                        wr_N: [10,6],
                    };
                  
                    
                }
                else {
                    this.klineOption = JSON.parse(this.klineOption);
                }

                this.klineOption.drawDynamicValue = false;
                this.klineOption.dynamicValueWidth = parseInt(<any>this.dynamicValueWidth);
                this.klineOption.tipTextColorForUp = textRes.items["K线Tip涨"];
                this.klineOption.tipTextColorForDown = textRes.items["K线Tip跌"];
                this.klineOption.colorForKlineUp = textRes.items["KLineUpColor"];
                this.klineOption.colorForKlineDown = textRes.items["KLineDownColor"];

                if (this.klineOption.mainLineMode !== undefined)
                    this.model.mainGragh = this.klineOption.mainLineMode;

                this.model.subGraghs.forEach(item => {
                    var name = item.text.toLocaleLowerCase();
                    if (this.klineOption[name + "AreaWeight"])
                        item.selected = true;
                });

                var settingOption = KlineSetting.lineViewOption;
                for (var p in settingOption) {
                    if (this.klineOption[p] != undefined)
                        this.klineOption[p] = settingOption[p];
                }
                

                this.setKlinePosition();
            }

            if (this.klineModule) {
                this.klineModule.setDatas({
                    datas: ret
                });
                if (ret.length > 0) {
                    this.klineModule.setPrice({
                        leftPrice: ret[0].close.toFixed(this.model.commodity.decimalplace),
                    });
                }
                this.klineOption.isMinute = myinterval == "1minute";
                this.klineOption.timeFormat = this.currentTab.format;
                this.klineOption.decimalplace = (<Description>this.model.commodity).decimalplace;
                this.klineModule.setOption({
                    option: this.klineOption
                });
                //alert(JSON.stringify(this.klineOption));
                this.klineModule.show();
            }

            this.model.klineready = true;
        };
        this.klineRefresh.onRefreshData = (sender, ret) => {
            if (this.klineModule) {
                this.klineModule.setPrice({
                    datas: ret
                });
            }
        };
        this.klineRefresh.onTick = (sender, time) => {
            //如果是买价K线，不把tick同步到k线中
            //if (this.priceType == 1)
            //    return;

            //console.log(time + "," + this.klineRefresh.datas[0].times);
            var dataitem = this.klineRefresh.datas[0];
            dataitem = JSON.parse(JSON.stringify(dataitem));
            console.log(JSON.stringify(dataitem));

            if (true || dataitem.times >= time) {
                //dataitem.times = time;
                dataitem.close = this.priceType == 0 ? this.model.commodity.bidPrice : this.model.commodity.offerPrice;

                if (dataitem.close > dataitem.high)
                    dataitem.high = dataitem.close;
                if (dataitem.close < dataitem.low)
                    dataitem.low = dataitem.close;

                if (this.klineModule) {

                    this.klineModule.setPrice({
                        leftPrice: dataitem.close.toFixed(this.model.commodity.decimalplace),
                        datas: [dataitem]
                    });
                }
            }
            else {
                console.log("tick时间对不上：tick:" + new Date(time).toLocaleString() + "\r\n对比数据：" + new Date(dataitem.times).toLocaleString());
            }
        };
        this.klineRefresh.loadFirstData();
    }

    openWatchList() {
        navigation.push(new WatchPriceAssistant());
    }
}