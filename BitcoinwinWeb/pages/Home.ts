import { Component } from "jack-one-script";
import  Vue  from "vue";
import { Swiper } from "jack-one-script";
import { BaseComponent, StatusBarStyle } from "../BaseComponent";

import { showError } from "../Global";
import { IndexApi, ProductItem, AdsItem } from "../ServerApis/IndexApi";
import { Login } from "./RegisterLogin/Login";
import { ApiHelper, Description } from "../ServerApis/ApiHelper";
import { TextRes } from "../TextRes";
import { MessageCenter, MessageType } from "../MessageCenter";
import { AccountCenterApi } from "../ServerApis/AccountCenterApi";
import { AccountApi, AccountInfo } from "../ServerApis/AccountApi";
import { TradeApi } from "../ServerApis/TradeApi";
import { CommodityDetail } from "./CommodityDetail/CommodityDetail";
import { Ranking } from "./Home/Ranking";
import { WebBrowser } from "./WebBrowser";
import { Activity } from "./Home/Activity";
import { ContactUs } from "./My/ContactUs";
import { Popularize } from "./My/Popularize";
import { BeginnerGuide } from "./My/BeginnerGuide";
import { HongBao } from "./HongBao";
import { Recharge } from "./Assets/Recharge/Recharge";
import { MainPage } from "./MainPage";
import { CoinDogApi } from "../ServerApis/CoinDogApi";
import { News } from "./Home/News";
import { setCache, getCache } from "../GlobalFunc";
import { Setting } from "./My/Setting";

var html = require("./home.html");
export class Home extends BaseComponent
{
    get statusBarStyle(): StatusBarStyle {
        return StatusBarStyle.Dark;
    }
    static AccountInfo: AccountInfo;
    static instance: Home;
    vm: Vue;
    model = {
        safeAreaTop: 0,
        amount: "",
        textRes: <TextRes>{},
        notices: [],
        products: <Description[]>[],
        rankings: [],
        coinApi: {
            title: "",
            content:""
        },
    };
    swiper: Swiper;
    divNoticeContainer: HTMLElement;
    get needLogin() {
        return false;
    }

    constructor() {
        super(html);

        Home.instance = this;
        this.model.textRes = (<any>window).textRes;
        if ((<any>window).api) {
            this.model.safeAreaTop = (<any>window).api.safeArea.top;
        }

        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
            errorCaptured: (err, vm, info) => {
                alert(JSON.stringify([err, info]));
                return false;
            },
        });               

        this.divNoticeContainer = this.element.querySelector("#divNoticeContainer");
        

        this.loadBanner();
        this.loadRankings();
        this.loadCoinApi();

        MessageCenter.register(MessageType.CommodityReady, () => this.loadProducts());
        MessageCenter.register(MessageType.Logined, () => this.refreshAmount());
        MessageCenter.register(MessageType.Logout, () => this.model.amount = this.model.textRes.items["未登录"]);

        if (!ApiHelper.CurrentTokenInfo) {
            this.model.amount = this.model.textRes.items["未登录"];
        }
        else {
            this.refreshAmount();
        }
    }

    async loadCoinApi() {
        try {
            var ret = await CoinDogApi.liveList(null, 1, 1);
            this.model.coinApi.title = ret[0].title;
            this.model.coinApi.content = ret[0].content;

            //setTimeout(() => this.loadCoinApi(), 60000);
        }
        catch (e) {
            setTimeout(() => this.loadCoinApi(), 1000);
        }
    }
    newsClick() {
        this.recordAction("News_快讯");
        navigation.push(new News());
    }
    openRanking() {
        navigation.push(new Ranking());
    }
    showBeginnerGuide() {
        this.recordAction("Index_新手教学");
        navigation.push(new BeginnerGuide("Index"));
    }
    /**获取推荐产品 */
    loadProducts() {
        //先读取缓存
        var cache = getCache("ProductRecommends");
        if (cache) {
            try {
                this.model.products = JSON.parse(cache);
            }
            catch (e) {

            }
        }

        IndexApi.ProductRecommends(this, (ret, err) => {
            if (err) {
                setTimeout(() => this.loadProducts(), 1000);
            }
            else {
                if (ret.length > 3)
                    ret.length = 3;
                this.model.products.splice(0, this.model.products.length);

                ret.forEach(item => {
                    var commodity = ApiHelper.getDescription(item.symbol);
                    if (commodity)
                        this.model.products.push(commodity);
                    else
                        console.log("无法找到产品：" + item.symbol);
                });

                setCache("ProductRecommends", JSON.stringify(this.model.products));
            }
        });
    }

    showPopularize() {
        this.recordAction("Index_我的推广");
        navigation.push(new Popularize());
    }

    loadRankings() {
        //先读取缓存
        var cache = getCache("rankings2");
        if (cache) {
            try {
                this.model.rankings = JSON.parse(cache);
            }
            catch (e) {

            }
        }


        IndexApi.rankings(this,1,5, (ret, err) => {
            if (err) {
                setTimeout(() => this.loadRankings(), 1000);
            }
            else {
                this.model.rankings.splice(0, this.model.rankings.length);
                ret.forEach(item => {
                    this.model.rankings.push(item)
                });
                setCache("rankings2", JSON.stringify(this.model.rankings));
            }
        });
    }

    async refreshAmount() {
        if (this.model.amount == this.model.textRes.items["未登录"])
            this.model.amount = "--";

        try {
            var ret = await AccountApi.GetAccountInfo(this);

            Home.AccountInfo = ret;

            

            if (ret.accountMoneyInfo.isreceiveredenvelope) {
                if (!sessionStorage.getItem(ApiHelper.CurrentTokenInfo.phone_number + "hongbao")) {
                    sessionStorage.setItem(ApiHelper.CurrentTokenInfo.phone_number + "hongbao", "1");
                    navigation.push(new HongBao(), false);
                }
            }
            this.model.amount = this.formatMoney(this.toFixed(ret.accountMoneyInfo.canusedamount, 2)) + " USDT";
        }
        catch (e) {
            console.debug("refreshAmount error:" + JSON.stringify(e));

            if (e && e.status && e.status == 401) {
                this.model.amount = this.model.textRes.items["未登录"];

                ApiHelper.CurrentTokenInfo = null;
            }
            else {
                setTimeout(() => this.refreshAmount(), 1000);
            }
        }
    }

    private noticeInterval: any = 0;
    checkNoticeContainerSize() {
        this.stopNoticeMove();

        if (this.divNoticeContainer.offsetWidth == 0) {
            setTimeout(() => this.checkNoticeContainerSize(), 500);
        }
        else {
            this.startNoticeMove();
        }
    }

    /**停止公告动画 */
    stopNoticeMove() {
        var n = this.noticeInterval;
        this.noticeInterval = 0;
        clearTimeout(n);
    }

    /**开始公告动画 */
    startNoticeMove() { 
        var moveinterval = 4000;//动画间隔
        var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
        this.noticeInterval = 1;
        var itemHeight = this.divNoticeContainer.offsetHeight;
        var scrolltop = this.divNoticeContainer.scrollTop;
        var scrolltarget = scrolltop + itemHeight;
        var func = (time) => {
            if (this.noticeInterval === 0 || !this.actived ) {
                this.divNoticeContainer.scrollTop = scrolltarget;
                return;
            }

            scrolltop++;
            this.divNoticeContainer.scrollTop = scrolltop;
            if (scrolltop >= scrolltarget) {
                scrolltarget += itemHeight;
                if (scrolltarget >= this.divNoticeContainer.scrollHeight) {
                    scrolltop = 0;
                    scrolltarget = scrolltop + itemHeight;
                    this.divNoticeContainer.scrollTop = scrolltop;                    
                }
                this.noticeInterval = setTimeout(func, moveinterval);
                return;
            }
            requestAnimationFrame(func);
        };

        this.noticeInterval = setTimeout(func, moveinterval);
    }

    loginClick() {
        this.recordAction("Index_用户头像");
        if (!ApiHelper.CurrentTokenInfo) {
            var login = new Login();
            navigation.push(login);
        }
    }

    onNavigationActived(isResume: boolean) {
        super.onNavigationActived(isResume);
        console.log("Home onActived");
        if (this.swiper)
            this.swiper.start();

        this.recordPageStart("首页");

        this.refreshAmount();
        this.loadNotice();
        MessageCenter.raise(MessageType.StartRefreshQuotation, null);
    }

    /**获取广告图 */
    loadBanner() {

        //先读取缓存
        var cache = getCache("IndexApi.ads");
        if (cache) {
            try {

                this.ads = JSON.parse(cache);
                var ele = <HTMLElement>this.element.querySelector("#banner");
                ele.style.display = "";
               
                var imgs = this.ads.map(m => m.imageUrl);

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
        IndexApi.ads(this, 3, 1, 100, (ret, err) => {
            if (err) {
                console.log("banner error:" + JSON.stringify(err));
                setTimeout(() => this.loadBanner(), 1000);
            }
            else {
                setCache("IndexApi.ads", JSON.stringify(ret));

                this.ads = ret;
                var ele = <HTMLElement>this.element.querySelector("#banner");
                ele.style.display = "";
               
                var imgs = ret.map(m => m.imageUrl);
                console.debug("banner:" + JSON.stringify(imgs));

               
                if (this.swiper) {
                    this.swiper.dispose();
                }

                this.swiper = new Swiper(ele, {
                    imgPaths: imgs,
                    imgWidth: 1035,
                    imgHeight: 450,
                    borderRadius: 0,
                    autoPlayInterval: 5000,
                });
            }
        });
    }
    private ads: AdsItem[];
    bannerClick() {
       
        var item = this.ads[this.swiper.currentIndex];
        var url = item.linkUrl;
      
        if (url) {
            var web = new WebBrowser({
                src: url,
                title: item.title,
                fullScreen: false,
                withbg: false,
                statusBarColor: StatusBarStyle.Dark,
                backButtonColor: "#000",//表示不显示返回按钮
                jsAction: (action,obj) => {
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
    }
    contactUsClick() {
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
            useOpenFrame:true,
            src: url,
            statusBarColor: StatusBarStyle.Light,
            title: ""
        });
        navigation.push(web);
        //navigation.push(new ContactUs());
    }
  
    openActivity() {
        this.recordAction("Index_活动专区");
        navigation.push(new Activity());
    }
    commodityClick(item: Description) {
        this.recordAction(`Index_${item.marketsymbol}x${item.leverage}`);
        navigation.push(new CommodityDetail(item));
    }

    private loadNotice() {
        if (this.model.notices.length === 0) {
            IndexApi.notices(null,(ret, err) => {
                if (err)
                {
                    setTimeout(() => this.loadNotice(), 1000);
                }
                else {
                    if (ret.length > 0)
                        ret.push(ret[0]);
                    ret.forEach((d) => {
                        d.content = d.content.trim();
                        this.model.notices.push(d);
                    });
                    
                    setTimeout(() => this.checkNoticeContainerSize(), 500);
                }
            });
        }
        else {
            setTimeout(() => this.checkNoticeContainerSize(), 500);
        }
    }

    recharge() {
        this.recordAction("Index_马上入金");
        navigation.push(new Recharge(false));
    }
    rechargeCredit() {
        this.recordAction("Index_信用充值");
        navigation.push(new Recharge(true));
    }
    onNavigationUnActived(isPop: boolean) {
        super.onNavigationUnActived(isPop);

        this.recordPageEnd("首页");

        if (this.swiper)
            this.swiper.stop();

        this.stopNoticeMove();
        console.log("Home onUnActived");

        MessageCenter.raise(MessageType.StopRefreshQuotation, null);
    }
}