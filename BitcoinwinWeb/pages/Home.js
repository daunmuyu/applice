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
import Vue from "vue";
import { Swiper } from "jack-one-script";
import { BaseComponent, StatusBarStyle } from "../BaseComponent";
import { IndexApi } from "../ServerApis/IndexApi";
import { Login } from "./RegisterLogin/Login";
import { ApiHelper } from "../ServerApis/ApiHelper";
import { MessageCenter, MessageType } from "../MessageCenter";
import { AccountApi } from "../ServerApis/AccountApi";
import { CommodityDetail } from "./CommodityDetail/CommodityDetail";
import { Ranking } from "./Home/Ranking";
import { WebBrowser } from "./WebBrowser";
import { Activity } from "./Home/Activity";
import { Popularize } from "./My/Popularize";
import { BeginnerGuide } from "./My/BeginnerGuide";
import { HongBao } from "./HongBao";
import { Recharge } from "./Assets/Recharge/Recharge";
import { CoinDogApi } from "../ServerApis/CoinDogApi";
import { News } from "./Home/News";
import { setCache, getCache } from "../GlobalFunc";
var html = require("./home.html");
var Home = /** @class */ (function (_super) {
    __extends(Home, _super);
    function Home() {
        var _this = _super.call(this, html) || this;
        _this.model = {
            safeAreaTop: 0,
            amount: "",
            textRes: {},
            notices: [],
            products: [],
            rankings: [],
            coinApi: {
                title: "",
                content: ""
            },
        };
        _this.noticeInterval = 0;
        Home.instance = _this;
        _this.model.textRes = window.textRes;
        if (window.api) {
            _this.model.safeAreaTop = window.api.safeArea.top;
        }
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
            errorCaptured: function (err, vm, info) {
                alert(JSON.stringify([err, info]));
                return false;
            },
        });
        _this.divNoticeContainer = _this.element.querySelector("#divNoticeContainer");
        _this.loadBanner();
        _this.loadRankings();
        _this.loadCoinApi();
        MessageCenter.register(MessageType.CommodityReady, function () { return _this.loadProducts(); });
        MessageCenter.register(MessageType.Logined, function () { return _this.refreshAmount(); });
        MessageCenter.register(MessageType.Logout, function () { return _this.model.amount = _this.model.textRes.items["未登录"]; });
        if (!ApiHelper.CurrentTokenInfo) {
            _this.model.amount = _this.model.textRes.items["未登录"];
        }
        else {
            _this.refreshAmount();
        }
        return _this;
    }
    Object.defineProperty(Home.prototype, "statusBarStyle", {
        get: function () {
            return StatusBarStyle.Dark;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Home.prototype, "needLogin", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Home.prototype.loadCoinApi = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ret, e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, CoinDogApi.liveList(null, 1, 1)];
                    case 1:
                        ret = _a.sent();
                        this.model.coinApi.title = ret[0].title;
                        this.model.coinApi.content = ret[0].content;
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        setTimeout(function () { return _this.loadCoinApi(); }, 1000);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Home.prototype.newsClick = function () {
        this.recordAction("News_快讯");
        navigation.push(new News());
    };
    Home.prototype.openRanking = function () {
        navigation.push(new Ranking());
    };
    Home.prototype.showBeginnerGuide = function () {
        this.recordAction("Index_新手教学");
        navigation.push(new BeginnerGuide("Index"));
    };
    /**获取推荐产品 */
    Home.prototype.loadProducts = function () {
        var _this = this;
        //先读取缓存
        var cache = getCache("ProductRecommends");
        if (cache) {
            try {
                this.model.products = JSON.parse(cache);
            }
            catch (e) {
            }
        }
        IndexApi.ProductRecommends(this, function (ret, err) {
            if (err) {
                setTimeout(function () { return _this.loadProducts(); }, 1000);
            }
            else {
                if (ret.length > 3)
                    ret.length = 3;
                _this.model.products.splice(0, _this.model.products.length);
                ret.forEach(function (item) {
                    var commodity = ApiHelper.getDescription(item.symbol);
                    if (commodity)
                        _this.model.products.push(commodity);
                    else
                        console.log("无法找到产品：" + item.symbol);
                });
                setCache("ProductRecommends", JSON.stringify(_this.model.products));
            }
        });
    };
    Home.prototype.showPopularize = function () {
        this.recordAction("Index_我的推广");
        navigation.push(new Popularize());
    };
    Home.prototype.loadRankings = function () {
        var _this = this;
        //先读取缓存
        var cache = getCache("rankings2");
        if (cache) {
            try {
                this.model.rankings = JSON.parse(cache);
            }
            catch (e) {
            }
        }
        IndexApi.rankings(this, 1, 5, function (ret, err) {
            if (err) {
                setTimeout(function () { return _this.loadRankings(); }, 1000);
            }
            else {
                _this.model.rankings.splice(0, _this.model.rankings.length);
                ret.forEach(function (item) {
                    _this.model.rankings.push(item);
                });
                setCache("rankings2", JSON.stringify(_this.model.rankings));
            }
        });
    };
    Home.prototype.refreshAmount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ret, e_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.model.amount == this.model.textRes.items["未登录"])
                            this.model.amount = "--";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, AccountApi.GetAccountInfo(this)];
                    case 2:
                        ret = _a.sent();
                        Home.AccountInfo = ret;
                        if (ret.accountMoneyInfo.isreceiveredenvelope) {
                            if (!sessionStorage.getItem(ApiHelper.CurrentTokenInfo.phone_number + "hongbao")) {
                                sessionStorage.setItem(ApiHelper.CurrentTokenInfo.phone_number + "hongbao", "1");
                                navigation.push(new HongBao(), false);
                            }
                        }
                        this.model.amount = this.formatMoney(this.toFixed(ret.accountMoneyInfo.canusedamount, 2)) + " USDT";
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        console.debug("refreshAmount error:" + JSON.stringify(e_2));
                        if (e_2 && e_2.status && e_2.status == 401) {
                            this.model.amount = this.model.textRes.items["未登录"];
                            ApiHelper.CurrentTokenInfo = null;
                        }
                        else {
                            setTimeout(function () { return _this.refreshAmount(); }, 1000);
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Home.prototype.checkNoticeContainerSize = function () {
        var _this = this;
        this.stopNoticeMove();
        if (this.divNoticeContainer.offsetWidth == 0) {
            setTimeout(function () { return _this.checkNoticeContainerSize(); }, 500);
        }
        else {
            this.startNoticeMove();
        }
    };
    /**停止公告动画 */
    Home.prototype.stopNoticeMove = function () {
        var n = this.noticeInterval;
        this.noticeInterval = 0;
        clearTimeout(n);
    };
    /**开始公告动画 */
    Home.prototype.startNoticeMove = function () {
        var _this = this;
        var moveinterval = 4000; //动画间隔
        var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
        this.noticeInterval = 1;
        var itemHeight = this.divNoticeContainer.offsetHeight;
        var scrolltop = this.divNoticeContainer.scrollTop;
        var scrolltarget = scrolltop + itemHeight;
        var func = function (time) {
            if (_this.noticeInterval === 0 || !_this.actived) {
                _this.divNoticeContainer.scrollTop = scrolltarget;
                return;
            }
            scrolltop++;
            _this.divNoticeContainer.scrollTop = scrolltop;
            if (scrolltop >= scrolltarget) {
                scrolltarget += itemHeight;
                if (scrolltarget >= _this.divNoticeContainer.scrollHeight) {
                    scrolltop = 0;
                    scrolltarget = scrolltop + itemHeight;
                    _this.divNoticeContainer.scrollTop = scrolltop;
                }
                _this.noticeInterval = setTimeout(func, moveinterval);
                return;
            }
            requestAnimationFrame(func);
        };
        this.noticeInterval = setTimeout(func, moveinterval);
    };
    Home.prototype.loginClick = function () {
        this.recordAction("Index_用户头像");
        if (!ApiHelper.CurrentTokenInfo) {
            var login = new Login();
            navigation.push(login);
        }
    };
    Home.prototype.onNavigationActived = function (isResume) {
        _super.prototype.onNavigationActived.call(this, isResume);
        console.log("Home onActived");
        if (this.swiper)
            this.swiper.start();
        this.recordPageStart("首页");
        this.refreshAmount();
        this.loadNotice();
        MessageCenter.raise(MessageType.StartRefreshQuotation, null);
    };
    /**获取广告图 */
    Home.prototype.loadBanner = function () {
        var _this = this;
        //先读取缓存
        var cache = getCache("IndexApi.ads");
        if (cache) {
            try {
                this.ads = JSON.parse(cache);
                var ele = this.element.querySelector("#banner");
                ele.style.display = "";
                var imgs = this.ads.map(function (m) { return m.imageUrl; });
                console.debug("本地 banner:" + JSON.stringify(imgs));
                this.swiper = new Swiper(ele, {
                    imgPaths: imgs,
                    imgWidth: 1035,
                    imgHeight: 450,
                    borderRadius: 0,
                    autoPlayInterval: 5000,
                });
            }
            catch (e) {
                console.log("banner cache error:" + JSON.stringify(e));
            }
        }
        console.log("从服务器读取banner");
        IndexApi.ads(this, 3, 1, 100, function (ret, err) {
            if (err) {
                console.log("banner error:" + JSON.stringify(err));
                setTimeout(function () { return _this.loadBanner(); }, 1000);
            }
            else {
                setCache("IndexApi.ads", JSON.stringify(ret));
                _this.ads = ret;
                var ele = _this.element.querySelector("#banner");
                ele.style.display = "";
                var imgs = ret.map(function (m) { return m.imageUrl; });
                console.debug("banner:" + JSON.stringify(imgs));
                if (_this.swiper) {
                    _this.swiper.dispose();
                }
                _this.swiper = new Swiper(ele, {
                    imgPaths: imgs,
                    imgWidth: 1035,
                    imgHeight: 450,
                    borderRadius: 0,
                    autoPlayInterval: 5000,
                });
            }
        });
    };
    Home.prototype.bannerClick = function () {
        var item = this.ads[this.swiper.currentIndex];
        var url = item.linkUrl;
        if (url) {
            var web = new WebBrowser({
                src: url,
                title: item.title,
                fullScreen: false,
                withbg: false,
                statusBarColor: StatusBarStyle.Dark,
                backButtonColor: "#000",
                jsAction: function (action, obj) {
                    if (action == "go") {
                        if (obj.page == "recharge") {
                            navigation.push(new Recharge());
                        }
                        else if (obj.page == "back") {
                            navigation.pop();
                        }
                    }
                    else if (action == "back") {
                        navigation.pop();
                    }
                },
            });
            navigation.push(web);
        }
    };
    Home.prototype.contactUsClick = function () {
        this.recordAction("Index_联系客服");
        var phone = "";
        var realname = "";
        if (ApiHelper.CurrentTokenInfo) {
            phone = ApiHelper.CurrentTokenInfo.phone_number;
            if (ApiHelper.CurrentTokenInfo.realname) {
                realname = encodeURIComponent(ApiHelper.CurrentTokenInfo.realname);
            }
        }
        var url = "fs://" + ApiHelper.webFolder + "/" + window.api.pageParam.folder + "/MeiQia.html?tel=" + phone + "&realname=" + realname;
        url += textRes.langName.indexOf("zh") >= 0 ? "" : "&lan=en";
        //_MEIQIA('language','en')
        var web = new WebBrowser({
            fullScreen: false,
            useOpenFrame: true,
            src: url,
            statusBarColor: StatusBarStyle.Light,
            title: ""
        });
        navigation.push(web);
        //navigation.push(new ContactUs());
    };
    Home.prototype.openActivity = function () {
        this.recordAction("Index_活动专区");
        navigation.push(new Activity());
    };
    Home.prototype.commodityClick = function (item) {
        this.recordAction("Index_" + item.marketsymbol + "x" + item.leverage);
        navigation.push(new CommodityDetail(item));
    };
    Home.prototype.loadNotice = function () {
        var _this = this;
        if (this.model.notices.length === 0) {
            IndexApi.notices(null, function (ret, err) {
                if (err) {
                    setTimeout(function () { return _this.loadNotice(); }, 1000);
                }
                else {
                    if (ret.length > 0)
                        ret.push(ret[0]);
                    ret.forEach(function (d) {
                        d.content = d.content.trim();
                        _this.model.notices.push(d);
                    });
                    setTimeout(function () { return _this.checkNoticeContainerSize(); }, 500);
                }
            });
        }
        else {
            setTimeout(function () { return _this.checkNoticeContainerSize(); }, 500);
        }
    };
    Home.prototype.recharge = function () {
        this.recordAction("Index_马上入金");
        navigation.push(new Recharge(false));
    };
    Home.prototype.rechargeCredit = function () {
        this.recordAction("Index_信用充值");
        navigation.push(new Recharge(true));
    };
    Home.prototype.onNavigationUnActived = function (isPop) {
        _super.prototype.onNavigationUnActived.call(this, isPop);
        this.recordPageEnd("首页");
        if (this.swiper)
            this.swiper.stop();
        this.stopNoticeMove();
        console.log("Home onUnActived");
        MessageCenter.raise(MessageType.StopRefreshQuotation, null);
    };
    return Home;
}(BaseComponent));
export { Home };
//# sourceMappingURL=Home.js.map