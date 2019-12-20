import { ApiHelper, CertificationStatus } from "./ServerApis/ApiHelper";
import Vue from "vue";
import { SwiperTest } from "./pages/SwiperTest";
import { MainPage } from "./pages/MainPage";
import { AccountApi } from "./ServerApis/AccountApi";

import { MarketApi } from "./ServerApis/MarketApi";

import { initGlobalFunc, setCache, getCache, alertWindow } from "./GlobalFunc";
import { MessageCenter, MessageType } from "./MessageCenter";
import { HideFrame } from "./HideFrame";
import { registerPageHeader } from "./pageComponents/PageHeader";
import { registerSwitcher } from "./pageComponents/Switcher";
import { registerCheck } from "./pageComponents/Check";
import { registerLoading } from "jack-one-script";
import { My } from "./pages/My/My";
import { Recharge } from "./pages/Assets/Recharge/Recharge";
import { Component } from "jack-one-script";
import { FiatRecharge } from "./pages/Assets/Recharge/FiatRecharge";
import { BbRecharge } from "./pages/Assets/Recharge/BbRecharge";
import { registerNumberPanel } from "./pageComponents/NumberPanel";

import "./scss/app.scss";
import { NavigationEvent, Navigation } from "jack-one-script";
import { BaseComponent } from "./BaseComponent";
import { Login } from "./pages/RegisterLogin/Login";
import { CreditAccount } from "./pages/Assets/CreditAccount";
import { Assets } from "./pages/Assets/Assets";
import { RechargeDetail } from "./pages/Assets/DetailLists/RechargeDetail";
import { Setting } from "./pages/My/Setting";
import { Withdraw } from "./pages/Assets/Withdraw/Withdraw";
import { FiatWithdraw } from "./pages/Assets/Withdraw/FiatWithdraw";
import { BbWithdraw } from "./pages/Assets/Withdraw/BbWithdraw";
import { RealName } from "./pages/My/RealName";
import { registerWaiting } from "./pageComponents/Waiting";
import { Swiper } from "jack-one-script";
import { StartGuide } from "./pages/StartGuide/StartGuide";
import { MessageList } from "./pages/My/MessageList";
import { MessageDetail } from "./pages/My/MessageDetail";
import { BankAccount } from "./pages/My/bankAccount/BankAccount";
import { BindingAccount } from "./pages/My/bankAccount/BindingAccount";
import { EPayAcount } from "./pages/My/bankAccount/EPayAcount";
import { Unit_Credit_Test } from "./Unit_Credit_Test";
import { Translate } from "./pages/Translate";
import { setTimeout } from "timers";
import { SetPayPassword } from "./pages/My/SetPayPassword";
import { Home } from "./pages/Home";
import { EnterPayPassword } from "./pages/General/EnterPayPassword";
import { HttpClient } from "jack-one-script";
import { debug } from "util";
import { CoinDogApi } from "./ServerApis/CoinDogApi";
import { Layer } from "./Layer";
import { Rule } from "./pages/CommodityDetail/Rule";
import { AlertWindow } from "./pages/General/AlertWindow";
import { TextRes } from "./TextRes";
import { lang_en_US } from "./lang_en_US";
import { lang_zh_CN } from "./lang_zh_CN";
import { setLanguage, showError } from "./Global";
import { KlineSetting } from "./pages/CommodityDetail/KlineSetting";
import { WatchPriceAssistant } from "./pages/My/WatchPriceAssistant";
import { WatchPriceAssistantEditor } from "./pages/My/WatchPriceAssistantEditor";
import { Order } from "./pages/CommodityDetail/Order";
import { lang_zh_TW } from "./lang_zh_TW";



export class Main {
    static mainPage: MainPage;
    static layer: Layer;
    static isIPhoneX = false;

    private static started = false;
    static start() {
        if (Main.started)
            return;

        Main.started = true;

        Main.init();

        try {
            var ret = /iPhone[ ]*([0-9]+)/.exec(window.api.deviceModel);
            if (parseInt(ret[1]) > 8) {
                Main.isIPhoneX = true;
            }
        }
        catch (e) {

        }

        var mainEle = <HTMLElement>document.body.querySelector("#main");
        navigation.visible = false;
        navigation.setParent(mainEle);        

        if (!ApiHelper.IsDemoMode && !getCache("showedStartGuide")) {
            var startguide = new StartGuide(() => {
                Main.startForReady();
            });
            startguide.setParent(mainEle);
            setCache("showedStartGuide", "1");
            navigation.visible = true;
            //隐藏开机画面
            if (window.api)
                setTimeout(() => window.api.removeLaunchView(), 1000);
        }
        else {
            Main.startForReady();
        }

        
    }

    static init() {
        (<any>window).isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        (<any>window).navigation = new Navigation();
        (<any>window).textRes = new TextRes();
        (<any>window).supportLangObjects = [lang_en_US, lang_zh_CN, lang_zh_TW];

        var defaultLang = getCache("Accept-Language");
        if (!defaultLang) {
            defaultLang = supportLangObjects[0].langName;
            var language = navigator.language ? navigator.language : (<any>navigator).browserLanguage;
            var item = supportLangObjects.find(m => m.langName == language);
            if (item)
                defaultLang = item.langName;
        }
        setLanguage(defaultLang);

        TextRes.colorDict = [
            {},
            {
                "行情列表-涨": "#f5221a",
                "行情列表-跌": "#0ea41a",
                "交易列表按钮涨": "#f5221a,#f5221a",
                "交易列表按钮跌": "#0ea41a,#0ea41a",
                "TextColor涨": "#EA3131",
                "TextColor跌": "#0EA41A",
                "K线Tip涨": "#fd8366",
                "K线Tip跌": "#47f03f",
                "KLineUpColor": "#f34a4c",
                "KLineDownColor": "#1cbc79",
            },
            {
                "行情列表-涨": "#0ea41a",
                "行情列表-跌": "#f5221a",
                "交易列表按钮涨": "#0ea41a,#0ea41a",
                "交易列表按钮跌": "#f5221a,#f5221a",
                "TextColor涨": "#0ea41a",
                "TextColor跌": "#EA3131",
                "K线Tip涨": "#47f03f",
                "K线Tip跌": "#fd8366",
                "KLineUpColor": "#1cbc79",
                "KLineDownColor": "#f34a4c",
            }
        ];

        var settingColorType = getCache("klineColorType3");

        if (!settingColorType) {
            if (textRes.langName == "en-US")
                settingColorType = 2;
            else
                settingColorType = 1;
        }

        Main.updateColorType(settingColorType);

        ApiHelper.Init();
    }


    static updateColorType(type) {
        var obj = TextRes.colorDict[type];
        supportLangObjects.forEach(item => {
            for (var p in obj) {
                item.items[p] = obj[p];
            }
        });
       
    }

    static startForReady() {
        navigation.visible = true;

        if (window.api) {
            ApiHelper.EncryptKey = window.api.pageParam.EncryptKey;
        }

        registerPageHeader();
        registerSwitcher();
        registerCheck();
        registerWaiting();
        registerNumberPanel();
        registerLoading("loading");
        Component.registerForVue(FiatRecharge,"fiatrecharge");
        Component.registerForVue(BbRecharge, "bbrecharge");
        Component.registerForVue(FiatWithdraw, "fiatwithdraw");
        Component.registerForVue(BbWithdraw, "bbwithdraw");
        Component.registerForVue(BankAccount, "bankaccount");
        Component.registerForVue(EPayAcount, "epayacount");
        initGlobalFunc();

        //不要报警报的错误
        //Vue.config.silent = true;

        if (location.href.indexOf("?hideFrame=1") >= 0) {
            //这里是在layer里面执行的代码
            Main.layer = new Layer("hideFrame");
            HideFrame.start();
            return;
        }

        //if (true) {
        //    //隐藏开机画面
        //    if(window.api)
        //        setTimeout(() => window.api.removeLaunchView(), 1000);

        //    navigation.setParent(document.body.querySelector("#main"));
        //    navigation.push(new Order({} , ""), false);
        //    return;
        //}
        //if (location.href.indexOf('translate=') > 0) {
        //    navigation.setParent(document.body.querySelector("#main"));
        //    navigation.push(new Translate(), false);
        //    return;
        //    //Unit_Credit_Test.start();
        //    //navigation.setParent(document.body.querySelector("#main"));
        //    //navigation.push(new CreaditBorrowList(), false);
        //    //return;
        //}

        if (isIOS) {
            document.body.querySelector("#main").className += " main_ios";
        }
        else {
            document.body.querySelector("#main").className += " main_android";
        }
        
        //加载需要另外openFrame的页面
        Main.layer = new Layer("hideFrame");
        Main.layer.load();

        if (getCache("UseFinger") === "1" && getCache("FingerInfo")) {
            //如果使用指纹，则不自动登录
        }
        else {
            var tokenStr: any = getCache("CurrentTokenInfo");

            if (tokenStr) {
                console.log("%c 找到token", "color:#00ff00");
                console.log(tokenStr);
                eval("tokenStr=" + tokenStr);
                ApiHelper.CurrentTokenInfo = tokenStr;
                if ((<any>window).api) {

                    (<any>window).api.sendEvent({
                        name: 'Logined',
                        extra: { tokenStr }
                    });
                }
                else {
                    //如果是apicloud，那么会从Main.lookupLogin触发这个事件，放在那里，因为hideFrame的登录事件也能catch到
                    MessageCenter.raise(MessageType.Logined, null);
                }
                Main.refreshToken(false);
            }
        }

        //检查更新
        if (!ApiHelper.IsDemoMode) {
            Setting.checkUpdate();
        }

        setInterval(Main.refreshToken, 60000);

        Main.mainPage = new MainPage();
       
        //加载产品信息
        Main.loadCommodityType();
        Main.loadDescriptions();

        //语言变化后，需要重新加载“产品分类名字和产品名字”
        MessageCenter.register(MessageType.LanguageChanged, (p) => {
            if (ApiHelper.CommodityTypes) {
                Main.loadCommodityType();
            }
            if (ApiHelper.Descriptions) {
                Main.loadDescriptions();
            }
        });

        navigation.push(Main.mainPage, false);

        //配置httpClient
        HttpClient.BeforeSend = (option) => {

            if (ApiHelper.RefreshingToken && option.url.indexOf("/api/Userinfo/GetToken") < 0) {
                //如果正在刷新token，则网络访问会推迟
                console.log("%c 正在刷新token，则网络访问会推迟" + option.url, "#f00");
                setTimeout(() => HttpClient.send(option), 100);
                return true;
            }
            else if (option.header) {
                try {
                    option.header.Authorization = `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`;
                }
                catch (e) {

                }
            }
        };

        //setTimeout(UnitTest.start, 100);

        Main.lookupLogin();



        Main.registerBackButton();

        navigation.addEventListener(NavigationEvent.OnBeforePush, (component) => {
            if ((<BaseComponent>component).needLogin && !ApiHelper.CurrentTokenInfo) {
                navigation.push(new Login());
                return true;
            }
        });

        navigation.addEventListener(NavigationEvent.OnBeforePush, (component) => {
            if (component.constructor == EnterPayPassword) {
                if (Home.AccountInfo && !Home.AccountInfo.accountMoneyInfo.issetpassword && !navigation.queue.find(m => m.constructor == SetPayPassword)) {
                    navigation.push(new SetPayPassword());
                    return true;
                }
            }
        });

        //实名状态如果发生变化，马上刷新token
        MessageCenter.register(MessageType.CertificationStatusChanged, (p) => {
            if (ApiHelper.CurrentTokenInfo && ApiHelper.CurrentTokenInfo.certificationstatus == CertificationStatus.CertificationSuccess)
                Main.refreshToken(true);
        });

        if (window.api) {
            window.api.require('MNPopups');
            //隐藏开机画面
            setTimeout(() => window.api.removeLaunchView() , 500);
        }


        //获取客户位置
        if (!ApiHelper.IsDemoMode && window.api) {            
            if (isIOS) {
                Main.startLocation();
            }
            else {
                var module = window.api.require('kLine');
                //请求用户定位权限
                module.requestPermissions({
                    permissions: ['android.permission.ACCESS_FINE_LOCATION']
                }, function (ret, err) {

                    var result = ret.result[0];

                    if (result.granted) {
                        Main.startLocation();
                    }
                });
            }
        }

        //绑定推送信息的回调     
        MessageCenter.register(MessageType.GetPushToken, (p) => Main.onGetPushToken(p));

        Main.bindPushReceiver();

        //var rrr = /([0-9]|\.){1,3}/.exec("awfeawe7.327283723");
        //alert(rrr[0]);
    }

    /**绑定推送接收器 */
    static bindPushReceiver() {
        if (!window.api)
            return;

        var module = window.api.require('jackPush');
        if (!module)
            return;
        
        module.init(function (ret, err) {
            if (ret) {
                //alert(JSON.stringify(ret));

                if (ret.type === "init") {
                    MessageCenter.raise(MessageType.GetPushToken, ret);
                }                    
                else if (ret.type === "click") {
                    if (isIOS) {
                        window.api.setAppIconBadge({
                            badge: 0
                        });
                    }
                }
            } else {
                window.setTimeout(Main.bindPushReceiver, 2000);
            }
        });
        
    }


    static async onGetPushToken(ret) {
        try {
            await AccountApi.UpdateUserDevice(ret.deviceToken, ret.channel);
            //alert("成功update device");
        }
        catch (e) {
            //showError(e);
            window.setTimeout(() => {
                Main.onGetPushToken(ret);
            }, 1000);
        }
    }

    static startLocation() {
        if (!window.api)
            return;

        window.api.startLocation({
            accuracy: "100m"
        }, (ret, err) => {
            if (ret && ret.status) {
                //获取位置信息成功
                ApiHelper.longitude = ret.longitude;
                ApiHelper.latitude = ret.latitude;

               
            }
        });

    }

    static lookupLogin() {
        if ((<any>window).api) {
            (<any>window).api.addEventListener({
                name: 'Logined'
            }, (ret, err) => {
                if (Main.layer.isOnFront) {
                    //需要同步token
                    console.debug("hideFrame登陆了，需要同步登陆信息");
                    var token = ret.value.tokenStr;
                    if (token) {
                        eval("token=" + token);
                        ApiHelper.CurrentTokenInfo = token;

                        console.debug("成功同步登陆信息");
                    }
                }
                MessageCenter.raise(MessageType.Logined, null);
            });
        }
    }


    /**处理后退按钮事件 */
    static registerBackButton() {
        if ((<any>window).api) {
            (<any>window).api.addEventListener({
                name: 'onBackKeyPressed'
            }, function (ret, err) {
                    //只有当hideFrame不在前面时，这里才处理后退按键，否则应该时HideFrame.ts去处理
                    if (Main.layer.isOnFront == false) {
                        if (navigation.queue.length > 1) {
                            navigation.pop();
                        }
                        else {
                            (<any>window).api.closeWidget({ silent: false });
                        }
                    }
            });
        }
    }

    /**刷新token */
    static async refreshToken(refreshNow = false) {
        try {
            if (refreshNow || (ApiHelper.CurrentTokenInfo && ApiHelper.CurrentTokenInfo.expires_time - new Date().getTime() <= 10 * 60000)) {
                console.log("开始刷新token 原定过期" + ApiHelper.CurrentTokenInfo.expires_in + "秒");
                try {
                    await AccountApi.RefreshToken();
                    console.log("刷新token成功");
                }
                catch (e) {
                    console.log("刷新token Server Error:" + JSON.stringify(e));
                }
            }
            else {
                if (ApiHelper.CurrentTokenInfo) {
                    console.log("%c 跳过刷新 原定过期" + ApiHelper.CurrentTokenInfo.expires_in + "秒", "color:#00ff00");
                }
            }
        }
        catch (e) {
            console.log("刷新token 错误:" + e.message);
            console.log(JSON.stringify(ApiHelper.CurrentTokenInfo));
        }
    }

    static loadCommodityType() {

        var cache = getCache("CommodityTypes");
        if (cache) {
            try {
                ApiHelper.CommodityTypes = JSON.parse(cache);

                if (ApiHelper.Descriptions) {
                    MessageCenter.raise(MessageType.CommodityReady, null);
                }
            }
            catch (e) {

            }
        }


        //加载commodityType
        MarketApi.GetCommodityType(null, (ret, err) => {
            if (!err) {
                if (ApiHelper.CommodityTypes) {
                    if (ApiHelper.CommodityTypes.length == ret.length) {
                        var canreturn = true;
                        ret.forEach((ctype) => {
                            var item = ApiHelper.CommodityTypes.find((t) => t.commoditytypeid == ctype.commoditytypeid);
                            if (item) {
                                item.commoditytypename = ctype.commoditytypename;
                            }
                            else {
                                canreturn = false;
                            }
                        });

                        if (canreturn)
                            return;
                    }
                }
                setCache("CommodityTypes", JSON.stringify(ret));
                ApiHelper.CommodityTypes = ret;
                ApiHelper.CommodityTypes.forEach((item, index) => item.selected = (index == 0));
                console.debug(ApiHelper.CommodityTypes);
                if (ApiHelper.Descriptions) {
                    MessageCenter.raise(MessageType.CommodityReady, null);
                }
            }
            else {
                setTimeout(Main.loadCommodityType, 1000);
            }
        });
    }

    static loadDescriptions() {

        var cache = getCache("Descriptions");
        if (cache) {
            try {
                ApiHelper.Descriptions = JSON.parse(cache);

                if (ApiHelper.CommodityTypes) {
                    MessageCenter.raise(MessageType.CommodityReady, null);
                }
            }
            catch (e) {

            }
        }

        //加载Descriptions
        MarketApi.GetDescriptions(null, (ret, err) => {

            if (!err) {
                console.log(JSON.stringify(ret));


                //if (ApiHelper.Descriptions) {
                //    if (ApiHelper.Descriptions.length == ret.length) {
                //        var canreturn = true;
                //        ret.forEach((commodity) => {
                //            var item = ApiHelper.Descriptions.find((t) => t.symbol == commodity.symbol && t.commoditytype == commodity.commoditytype);
                //            if (item) {
                //                item.symbolname = commodity.symbolname;
                //            }
                //            else {
                //                //找不到，品种变化了
                //                canreturn = false;
                //            }
                //        });

                //        if (canreturn)
                //            return;
                //    }
                //}

                
                ApiHelper.Descriptions = ret;
                ret.forEach((item) => {
                    item.bidPrice = 0;
                    item.preClose = 0;
                    item.tradestatus = 0;
                    item.status = 0;
                    item.updownValue = "--";
                    item.isDown = false;
                    item.percent = "--";
                    item.high = "--";
                    item.open = "--";
                    item.preClose = "--";
                    item.low = "--";
                    if (!item.marketsymbol)
                        item.marketsymbol = item.symbol;
                });

                setCache("Descriptions", JSON.stringify(ret));

                if (ApiHelper.CommodityTypes) {
                    MessageCenter.raise(MessageType.CommodityReady, null);
                }
            }
            else {
                setTimeout(Main.loadDescriptions, 1000);
            }
        });
    }
}


