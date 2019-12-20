import { BaseComponent, StatusBarStyle } from "../../BaseComponent";
import Vue from "vue";
import { TextRes } from "../../TextRes";
import { showInfoForSeconds, showError } from "../../Global";
import { PersonInfo } from "./PersonInfo";
import { MessageCenter, MessageType } from "../../MessageCenter";
import { ApiHelper, CertificationStatus } from "../../ServerApis/ApiHelper";
import { Login } from "../RegisterLogin/Login";
import { AccountCenterApi } from "../../ServerApis/AccountCenterApi";
import { AccountApi, AccountInfo } from "../../ServerApis/AccountApi";
import { MessageCenterPage } from "./MessageCenterPage";
import { Popularize } from "./Popularize";
import { DemoTrade } from "./DemoTrade";
import { Setting } from "./Setting";
import { WebBrowser } from "../WebBrowser";
import { Questions } from "./Questions";
import { BeginnerGuide } from "./BeginnerGuide";
import { BindingAccount } from "./bankAccount/BindingAccount";
import { AccountList } from "./bankAccount/AccountList";
import { TradeApi } from "../../ServerApis/TradeApi";
import { log } from "util";
import { Home } from "../Home";
import { RealName } from "./RealName";
import { alertWindow } from "../../GlobalFunc";
import { SecurityCenter } from "./SecurityCenter";
import { AboutUs } from "./AboutUs";
var html = require("./my.html");
export class My extends BaseComponent {
    vm: Vue;
    model = {
        textRes: <TextRes>{},
        phone_number: "",
        certificationSuccess:false,
        safeTop: "",
        unreadCount: 0,
        isVip: false,
        isBusy:false,
    };
    get needLogin() {
        return true;
    }
     
    constructor() {
        super(html);

        this.model.textRes = textRes;

        MessageCenter.register(MessageType.Logout, (p) => {
            this.model.phone_number = "";
            this.model.isVip = false;
            this.model.certificationSuccess = false;
        });
        MessageCenter.register(MessageType.Logined, (p) => {
            this.model.phone_number = (<any>window).hidePhone(ApiHelper.CurrentTokenInfo.phone_number);
            if (ApiHelper.CurrentTokenInfo.certificationstatus == CertificationStatus.CertificationSuccess) {
                this.model.certificationSuccess = true;
            }
        });

        
        if (window.api) {
            this.model.safeTop = window.api.safeArea.top + "px";
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

        if (Home.AccountInfo) {
            this.model.isVip = Home.AccountInfo.isVip;
        }
        else {
            MessageCenter.register(MessageType.ReceivedAccountInfo, (p) => {
                this.model.isVip = (<AccountInfo>p).isVip;
            });
        }
    }
    onNavigationUnActived(ispop) {
        super.onNavigationUnActived(ispop);

        this.recordPageEnd("我的");
    }
    async onNavigationActived(isResume) {
        super.onNavigationActived(isResume);

        this.recordPageStart("我的");

        if (ApiHelper.CurrentTokenInfo) {
            this.model.phone_number = (<any>window).hidePhone(ApiHelper.CurrentTokenInfo.phone_number);
            if (ApiHelper.CurrentTokenInfo.certificationstatus == CertificationStatus.CertificationSuccess) {
                this.model.certificationSuccess = true;
            }

            AccountCenterApi.GetCertificationStatus(this, (ret, err) => {

                if (!err && ApiHelper.CurrentTokenInfo) {
                    ApiHelper.CurrentTokenInfo.certificationstatus = ret;
                    if (ApiHelper.CurrentTokenInfo.certificationstatus == CertificationStatus.CertificationSuccess && this.model.certificationSuccess != true) {
                        this.model.certificationSuccess = true;
                        MessageCenter.raise(MessageType.CertificationStatusChanged , null);
                    }

                    console.log("实名状态：" + ret);
                }
            });

            try {
                var ret = await AccountApi.GetUnReadCount(this);
                this.model.unreadCount = ret.activityUnReadTotal + ret.systemUnReadTotal + ret.userUnReadTotal;
            }
            catch (e) {
                this.model.unreadCount = 0;
            }
        }
    }
    messageCenterClick() {
        navigation.push(new MessageCenterPage());
    }
    showPopularize() {
        navigation.push(new Popularize());
    }
    loginClick() {
        if (!ApiHelper.CurrentTokenInfo) {
            navigation.push(new Login());
        }
    }

    personInfoClick() {
        navigation.push(new PersonInfo());
    }
    accountClick() {
        if (!ApiHelper.checkCertificationStatus()) {
            return;
        }
        navigation.push(new AccountList());
    }
    demoTradeClick() {
        this.recordAction("My_模拟交易");
        if (!ApiHelper.CurrentTokenInfo) {
            navigation.push(new Login());
            return;
        }

        if (this.model.isBusy)
            return;

        this.model.isBusy = true;
        TradeApi.IsSimulate(this,async (ret, err) => {
            this.model.isBusy = false;
            if (err)
                showError(err);
            else {
                if (!ret) {
                    await  alertWindow(textRes.items['目前不能进行模拟交易']);
                }
                else {
                    if (!sessionStorage.getItem("demoTradeClick")) {
                        sessionStorage.setItem("demoTradeClick", "1");
                        await  alertWindow(textRes.getItem("模拟交易操作时间还剩n天", ret));
                    }                   
                    navigation.push(new DemoTrade());
                }
            }
        });
    }
    serviceClick() {
        this.recordAction("My_联系客服");

        var phone = "";
        var realname = "";
        if (ApiHelper.CurrentTokenInfo) {

            phone = ApiHelper.CurrentTokenInfo.phone_number;
            if (ApiHelper.CurrentTokenInfo.realname)
                realname = encodeURIComponent(ApiHelper.CurrentTokenInfo.realname);
        }

        var url = "fs://" + ApiHelper.webFolder + "/" + window.api.pageParam.folder + "/MeiQia.html?tel=" + phone + "&realname=" + realname;
        url += textRes.langName.indexOf("zh") >= 0 ? "" : "&lan=en";

        var web = new WebBrowser({
            fullScreen: false,
            useOpenFrame: true,
            src: url,
            statusBarColor: StatusBarStyle.Light,
            title: ""
        });
        navigation.push(web);
    }

    aboutUsClick() {

        navigation.push(new AboutUs());
    }
    settingClick() {

        try {
            navigation.push(new Setting());
        }
        catch (e) {
            showError(e);
        }
    }

   
    questionsClick() {
        navigation.push(new Questions("My"));
    }
    beginnerGuideClick() {
        navigation.push(new BeginnerGuide("My"));
    }
    securityCenterClick() {
        navigation.push(new SecurityCenter());
    }
}