var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { ApiHelper, CertificationStatus } from "./ServerApis/ApiHelper";
import { MainPage } from "./pages/MainPage";
import { AccountApi } from "./ServerApis/AccountApi";
import { MarketApi } from "./ServerApis/MarketApi";
import { initGlobalFunc, setCache, getCache } from "./GlobalFunc";
import { MessageCenter, MessageType } from "./MessageCenter";
import { HideFrame } from "./HideFrame";
import { registerPageHeader } from "./pageComponents/PageHeader";
import { registerSwitcher } from "./pageComponents/Switcher";
import { registerCheck } from "./pageComponents/Check";
import { registerLoading } from "jack-one-script";
import { Component } from "jack-one-script";
import { FiatRecharge } from "./pages/Assets/Recharge/FiatRecharge";
import { BbRecharge } from "./pages/Assets/Recharge/BbRecharge";
import { registerNumberPanel } from "./pageComponents/NumberPanel";
import "./scss/app.scss";
import { NavigationEvent, Navigation } from "jack-one-script";
import { Login } from "./pages/RegisterLogin/Login";
import { Setting } from "./pages/My/Setting";
import { FiatWithdraw } from "./pages/Assets/Withdraw/FiatWithdraw";
import { BbWithdraw } from "./pages/Assets/Withdraw/BbWithdraw";
import { registerWaiting } from "./pageComponents/Waiting";
import { StartGuide } from "./pages/StartGuide/StartGuide";
import { BankAccount } from "./pages/My/bankAccount/BankAccount";
import { EPayAcount } from "./pages/My/bankAccount/EPayAcount";
import { setTimeout } from "timers";
import { SetPayPassword } from "./pages/My/SetPayPassword";
import { Home } from "./pages/Home";
import { EnterPayPassword } from "./pages/General/EnterPayPassword";
import { HttpClient } from "jack-one-script";
import { Layer } from "./Layer";
import { TextRes } from "./TextRes";
import { lang_en_US } from "./lang_en_US";
import { lang_zh_CN } from "./lang_zh_CN";
import { setLanguage } from "./Global";
import { lang_zh_TW } from "./lang_zh_TW";
var Main = /** @class */ (function () {
    function Main() {
    }
    Main.start = function () {
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
        var mainEle = document.body.querySelector("#main");
        navigation.visible = false;
        navigation.setParent(mainEle);
        if (!ApiHelper.IsDemoMode && !getCache("showedStartGuide")) {
            var startguide = new StartGuide(function () {
                setTimeout(function () { return Main.startForReady(); }, 500);
            });
            startguide.setParent(mainEle);
            setCache("showedStartGuide", "1");
            navigation.visible = true;
            //隐藏开机画面
            if (window.api)
                setTimeout(function () { return window.api.removeLaunchView(); }, 1000);
        }
        else {
            Main.startForReady();
        }
    };
    Main.init = function () {
        window.isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        window.navigation = new Navigation();
        window.textRes = new TextRes();
        window.supportLangObjects = [lang_en_US, lang_zh_CN, lang_zh_TW];
        var defaultLang = getCache("Accept-Language");
        if (!defaultLang) {
            defaultLang = supportLangObjects[0].langName;
            var language = navigator.language ? navigator.language : navigator.browserLanguage;
            var item = supportLangObjects.find(function (m) { return m.langName == language; });
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
    };
    Main.updateColorType = function (type) {
        var obj = TextRes.colorDict[type];
        supportLangObjects.forEach(function (item) {
            for (var p in obj) {
                item.items[p] = obj[p];
            }
        });
    };
    Main.startForReady = function () {
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
        Component.registerForVue(FiatRecharge, "fiatrecharge");
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
            var tokenStr = getCache("CurrentTokenInfo");
            if (tokenStr) {
                console.log("%c 找到token", "color:#00ff00");
                console.log(tokenStr);
                eval("tokenStr=" + tokenStr);
                ApiHelper.CurrentTokenInfo = tokenStr;
                if (window.api) {
                    window.api.sendEvent({
                        name: 'Logined',
                        extra: { tokenStr: tokenStr }
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
        MessageCenter.register(MessageType.LanguageChanged, function (p) {
            if (ApiHelper.CommodityTypes) {
                Main.loadCommodityType();
            }
            if (ApiHelper.Descriptions) {
                Main.loadDescriptions();
            }
        });
        navigation.push(Main.mainPage, false);
        //配置httpClient
        HttpClient.BeforeSend = function (option) {
            if (ApiHelper.RefreshingToken && option.url.indexOf("/api/Userinfo/GetToken") < 0) {
                //如果正在刷新token，则网络访问会推迟
                console.log("%c 正在刷新token，则网络访问会推迟" + option.url, "#f00");
                setTimeout(function () { return HttpClient.send(option); }, 100);
                return true;
            }
            else if (option.header) {
                try {
                    option.header.Authorization = "Bearer " + ApiHelper.CurrentTokenInfo.access_token;
                }
                catch (e) {
                }
            }
        };
        //setTimeout(UnitTest.start, 100);
        Main.lookupLogin();
        Main.registerBackButton();
        navigation.addEventListener(NavigationEvent.OnBeforePush, function (component) {
            if (component.needLogin && !ApiHelper.CurrentTokenInfo) {
                navigation.push(new Login());
                return true;
            }
        });
        navigation.addEventListener(NavigationEvent.OnBeforePush, function (component) {
            if (component.constructor == EnterPayPassword) {
                if (Home.AccountInfo && !Home.AccountInfo.accountMoneyInfo.issetpassword && !navigation.queue.find(function (m) { return m.constructor == SetPayPassword; })) {
                    navigation.push(new SetPayPassword());
                    return true;
                }
            }
        });
        //实名状态如果发生变化，马上刷新token
        MessageCenter.register(MessageType.CertificationStatusChanged, function (p) {
            if (ApiHelper.CurrentTokenInfo && ApiHelper.CurrentTokenInfo.certificationstatus == CertificationStatus.CertificationSuccess)
                Main.refreshToken(true);
        });
        if (window.api) {
            window.api.require('MNPopups');
            //隐藏开机画面
            setTimeout(function () { return window.api.removeLaunchView(); }, 500);
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
        MessageCenter.register(MessageType.GetPushToken, function (p) { return Main.onGetPushToken(p); });
        Main.bindPushReceiver();
        //var rrr = /([0-9]|\.){1,3}/.exec("awfeawe7.327283723");
        //alert(rrr[0]);
    };
    /**绑定推送接收器 */
    Main.bindPushReceiver = function () {
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
            }
            else {
                //alert(JSON.stringify(err));
            }
        });
    };
    Main.onGetPushToken = function (ret) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, AccountApi.UpdateUserDevice(ret.deviceToken, ret.channel)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        //showError(e);
                        window.setTimeout(function () {
                            Main.onGetPushToken(ret);
                        }, 1000);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Main.startLocation = function () {
        if (!window.api)
            return;
        window.api.startLocation({
            accuracy: "100m"
        }, function (ret, err) {
            if (ret && ret.status) {
                //获取位置信息成功
                ApiHelper.longitude = ret.longitude;
                ApiHelper.latitude = ret.latitude;
            }
        });
    };
    Main.lookupLogin = function () {
        if (window.api) {
            window.api.addEventListener({
                name: 'Logined'
            }, function (ret, err) {
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
    };
    /**处理后退按钮事件 */
    Main.registerBackButton = function () {
        if (window.api) {
            window.api.addEventListener({
                name: 'onBackKeyPressed'
            }, function (ret, err) {
                //只有当hideFrame不在前面时，这里才处理后退按键，否则应该时HideFrame.ts去处理
                if (Main.layer.isOnFront == false) {
                    if (navigation.queue.length > 1) {
                        navigation.pop();
                    }
                    else {
                        window.api.closeWidget({ silent: false });
                    }
                }
            });
        }
    };
    /**刷新token */
    Main.refreshToken = function (refreshNow) {
        if (refreshNow === void 0) { refreshNow = false; }
        return __awaiter(this, void 0, void 0, function () {
            var e_2, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        if (!(refreshNow || (ApiHelper.CurrentTokenInfo && ApiHelper.CurrentTokenInfo.expires_time - new Date().getTime() <= 10 * 60000))) return [3 /*break*/, 5];
                        console.log("开始刷新token 原定过期" + ApiHelper.CurrentTokenInfo.expires_in + "秒");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, AccountApi.RefreshToken()];
                    case 2:
                        _a.sent();
                        console.log("刷新token成功");
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        console.log("刷新token Server Error:" + JSON.stringify(e_2));
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        if (ApiHelper.CurrentTokenInfo) {
                            console.log("%c 跳过刷新 原定过期" + ApiHelper.CurrentTokenInfo.expires_in + "秒", "color:#00ff00");
                        }
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        e_3 = _a.sent();
                        console.log("刷新token 错误:" + e_3.message);
                        console.log(JSON.stringify(ApiHelper.CurrentTokenInfo));
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Main.loadCommodityType = function () {
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
        MarketApi.GetCommodityType(null, function (ret, err) {
            if (!err) {
                if (ApiHelper.CommodityTypes) {
                    if (ApiHelper.CommodityTypes.length == ret.length) {
                        var canreturn = true;
                        ret.forEach(function (ctype) {
                            var item = ApiHelper.CommodityTypes.find(function (t) { return t.commoditytypeid == ctype.commoditytypeid; });
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
                ApiHelper.CommodityTypes.forEach(function (item, index) { return item.selected = (index == 0); });
                console.debug(ApiHelper.CommodityTypes);
                if (ApiHelper.Descriptions) {
                    MessageCenter.raise(MessageType.CommodityReady, null);
                }
            }
            else {
                setTimeout(Main.loadCommodityType, 1000);
            }
        });
    };
    Main.loadDescriptions = function () {
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
        MarketApi.GetDescriptions(null, function (ret, err) {
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
                ret.forEach(function (item) {
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
    };
    Main.isIPhoneX = false;
    Main.started = false;
    return Main;
}());
export { Main };
//# sourceMappingURL=Main.js.map