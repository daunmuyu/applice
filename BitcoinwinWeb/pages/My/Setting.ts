import { BaseComponent } from "../../BaseComponent";
import Vue from "vue";
import { TextRes } from "../../TextRes";
import { setLanguage, showError } from "../../Global";
import { MessageCenter, MessageType } from "../../MessageCenter";
import { ApiHelper } from "../../ServerApis/ApiHelper";
import { setTimeout } from "timers";
import { settings } from "cluster";
import { CoinDogApi } from "../../ServerApis/CoinDogApi";
import { alertWindow, confirmWindow, getCache, setCache } from "../../GlobalFunc";
import { win32 } from "path";
import { parse } from "querystring";
import { Home } from "../Home";
import { AccountApi } from "../../ServerApis/AccountApi";
import { KlineSetting } from "../CommodityDetail/KlineSetting";
import { WatchPriceAssistant } from "./WatchPriceAssistant";
import { Main } from "../../Main";
interface IosAppStore {
    "appVersion": string;
    "appMinVersion": string;
    "source_ios": string;
    "tips": any;
}
interface AppVersion {
    appVersion: string;
    appMinVersion: string;
}
interface VersionInfo {
    "currentVersion": number;
    "minVersion": number;
    "android": AppVersion;
    "ios": AppVersion;
    "source_android": string;
    "source_ios": string;
    "iosAppStore": IosAppStore;
    "tips": any;
}

var html = require("./setting.html");
export class Setting extends BaseComponent {
    vm: Vue;
    model = {
        textRes: <TextRes>{},
        isBusy: false,
        currentLangName:"",
        supportLangs: [],
        lineColors: [],
        currentLineColor: undefined,

        appVersion: "--",
        logined: false,
        priceType: 0,
        isAllowFllowOrder:false,
        isFllowOrder: false,
        isShowFllowConfirm:false,
        fllowOrderConfirmSec : 0,
        priceItems: [],
    };


    get needLogin() {
        return false;
    }
    constructor() {
        super(html);

        this.model.lineColors = [
            {
                text: textRes.items["红涨绿跌"],
                value:1,
            }, {
                text: textRes.items["绿涨红跌"],
                value: 2,
            }
        ];
        this.model.priceItems = [
            {
                text: textRes.items["卖价K线图"],
                value: 0
            },
            {
                text: textRes.items["买价K线图"],
                value: 1
            }
        ];

        this.model.currentLineColor = getCache("klineColorType3");
        if (!this.model.currentLineColor) {
            if (textRes.langName == "en-US")
                this.model.currentLineColor = 2;
            else
                this.model.currentLineColor = 1;
        }

        if (ApiHelper.CurrentTokenInfo) {
            this.model.logined = true;
            this.getAccountInfo();
        }

        try {
            if (getCache("setting_priceType")) {
                this.model.priceType = parseInt(getCache("setting_priceType"));
            }
        }
        catch (e) {
            showError(e);
        }

        this.model.textRes = textRes;
        this.model.supportLangs = supportLangObjects;
        this.model.currentLangName = textRes.langName;
        if (window.api) {
            var versionFileContent = window.api.readFile({
                path: 'fs://' + ApiHelper.webFolder + '/version.txt',
                sync: true
            });
            eval("versionFileContent=" + versionFileContent);
            if (ApiHelper.IsFromAppStoreApp) {
                this.model.appVersion = "Store " + window.api.appVersion + " core:" + versionFileContent.version;
            }
            else {
                this.model.appVersion = window.api.appVersion + " core:" + versionFileContent.version;
            }
           
        }

        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
            watch: {
                currentLangName: (newValue) => {
                    if (newValue) {
                        setLanguage(newValue);
                        MessageCenter.raise(MessageType.LanguageChanged, null);

                        this.model.lineColors = [
                            {
                                text: textRes.items["红涨绿跌"],
                                value: 1,
                            }, {
                                text: textRes.items["绿涨红跌"],
                                value: 2,
                            }
                        ];
                        this.model.priceItems = [
                            {
                                text: textRes.items["卖价K线图"],
                                value: 0
                            },
                            {
                                text: textRes.items["买价K线图"],
                                value: 1
                            }
                        ];

                    }
                },
                priceType: (newValue) => {
                    setCache("setting_priceType", newValue + "");
                },
                isFllowOrder: (newValue) => {
                    if (newValue) {
                        this.model.isShowFllowConfirm = true;
                        this.model.fllowOrderConfirmSec = 8;
                        window.setTimeout(() => this.checkConfirmSec(), 1000);
                    }
                    else {
                        this.setFllowOrder(false);
                    }
                },
                currentLineColor: (newValue) => {
                    setCache("klineColorType3", newValue);
                    Main.updateColorType(newValue);
                },
            },
            computed: {
                selectedPriceType: () => {
                    try {
  
                        return this.model.priceItems.find(m => m.value == this.model.priceType).text;
                    }
                    catch (e) {
                        return "";
                    }
                },
                selectedLineColorText: () => {
                    if (this.model.currentLineColor == undefined)
                        return "";
                    return this.model.lineColors.find(m => m.value == this.model.currentLineColor).text;
                },
            },
        });
    }

    checkConfirmSec() {
        this.model.fllowOrderConfirmSec--;
        if (this.model.fllowOrderConfirmSec > 0)
            window.setTimeout(() => this.checkConfirmSec(), 1000);
    }

    cancelFllowOrder() {
        this.model.isShowFllowConfirm = false;
        this.model.fllowOrderConfirmSec = 0;
        this.model.isFllowOrder = false;
    }

    confirmFllowOrder() {
        if (this.model.fllowOrderConfirmSec == 0) {
            this.model.isShowFllowConfirm = false;
            this.setFllowOrder(true);
        }
    }

    async setFllowOrder(value) {
        this.model.isBusy = true;
        try {

            await AccountApi.SetIsDocumentary(null, value);
            if (Home.AccountInfo)
                Home.AccountInfo.accountMoneyInfo.isDocumentary = value;
        }
        catch (e) {
            this.model.isFllowOrder = !value;
            showError(e);
        }
        finally {
            this.model.isBusy = false;
        }
    }

    async getAccountInfo() {
        try {

            if (!Home.AccountInfo) {
                this.model.isBusy = true;
                var info = await AccountApi.GetAccountInfo(this);
                Home.AccountInfo = info;
            }

            this.model.isAllowFllowOrder = Home.AccountInfo.accountMoneyInfo.isAllowDocumentary;
            this.model.isFllowOrder = Home.AccountInfo.accountMoneyInfo.isDocumentary;
        }
        catch (e) {
            showError(e);
        }
        finally {
            this.model.isBusy = false;
        }
    }

    /**从app store模拟交易环境，转为实盘 */
    static changeFromAppStore() {
        if (ApiHelper.IsDemoMode) {
            window.api.writeFile({
                path: 'fs://' + ApiHelper.webFolder + '/appstore.txt',
                data: new Date().toString()
            }, async (ret, err)=> {
                if (ret.status) {

                    Setting.changeFromAppStore_step2();
                } else if (err) {
                    await  alertWindow(err);
                }
            });
        }
    }

    private static changeFromAppStore_step2() {
        if (ApiHelper.IsDemoMode) {
            window.api.writeFile({
                path: 'fs://' + ApiHelper.webFolder + '/serverUrl.txt',
                data: window.api.pageParam.serverUrl
            }, async (ret, err)=> {
                if (ret.status) {
                    window.api.rebootApp();
                } else if (err) {
                    await   alertWindow(err);
                }
            });
        }
    }

    static checkUpdate(model = null, showAlert = false) {
        if (!window.api || window.api.debug)
            return;

        if (!ApiHelper.ResourceAddress) {
            setTimeout(() => Setting.checkUpdate(model, showAlert), 500);
            return;
        }
        if (!window.api)
            return;

        if (!model)
            model = { isBusy:false};
      model.isBusy = true;

        var versionRet = {
            update: false,
            closed: false,
            version:"",
            source: "",
            tips:null,
        };

        var url = `${window.api.pageParam.serverUrl}/version.txt?t=${new Date().getTime()}`;
        if (window.api.debug) {
            url = `http://192.168.0.80:8988/version.txt?t=${new Date().getTime()}`;
        }
        console.log("%c 访问" + url, "color:#0f0;");


        window.api.ajax({
            url: url,
            method: 'get',
            timeout: 5,
            dataType: 'text',
            cache: false
        },async (ret: VersionInfo, err) => {
                model.isBusy = false;
                console.log("%c version.txt内容：" + JSON.stringify([ret, err]), "color:#0f0;");


            if (ret) {
                eval("ret=" + ret);

                if (isIOS) {
                    if (ApiHelper.IsFromAppStoreApp) {
                        for (var p in ret.iosAppStore) {
                            ret.ios[p] = ret.iosAppStore[p];
                        }
                    }
                }

                versionRet.tips = ret.tips;

                if (isIOS) {
                    versionRet.source = ret.source_ios;
                }
                else
                    versionRet.source = ret.source_android;

                var curVersion: string[] = window.api.appVersion.split('.');
                var appVersionInfo: AppVersion = ret.android;
                if (isIOS)
                    appVersionInfo = ret.ios;

                var serverVersion: string[] = appVersionInfo.appVersion.split('.');
                var serverMinVersion: string[] = appVersionInfo.appMinVersion.split('.');

                for (var i = 0; i < curVersion.length; i++) {
                    if (parseInt(curVersion[i]) < parseInt(serverVersion[i])) {
                        versionRet.update = true;
                        break;
                    }
                    else if (parseInt(curVersion[i]) > parseInt(serverVersion[i])) {
                        break;
                    }
                }

                for (var i = 0; i < curVersion.length; i++) {
                    if (parseInt(curVersion[i]) < parseInt(serverMinVersion[i])) {
                        versionRet.closed = true;
                        break;
                    }
                    else if (parseInt(curVersion[i]) > parseInt(serverMinVersion[i])) {
                        break;
                    }
                }

                versionRet.version = appVersionInfo.appVersion;
                console.log("%c 结果：" + JSON.stringify(versionRet), "color:#0f0;");
                if (versionRet.update) {
                    Setting.update(versionRet, showAlert)
                }
                else {
                    if (showAlert) {
                        await  alertWindow(textRes.items["已经是最新版本"]);
                    }
                }
            } 
        });
    }

    static installApp(savePath) {
        if (!window.api.debug) {

            window.api.installApp({
                appUri: savePath
            });

            setTimeout(() => {
                window.api.closeWidget({
                    silent: true
                });
            }, 1000);
        }
    }

    static beforeInstall(savePath) {
        var module = window.api.require('kLine');
        if (!module.canRequestPackageInstalls) {
            //老版本app
            window.api.installApp({
                appUri: savePath
            });
            return;
        }
        module.canRequestPackageInstalls(async (ret, err) => {
            if (err)
                await  alertWindow(err.msg);
            else {
                if (!ret.result) {

                    await alertWindow(textRes.items['提示用户允许安装未知来源应用程序']);                

                    module.requestPackageInstalls(async (ret, err)=> {
                        if (err)
                            await   alertWindow(err.msg);
                        else {
                            if (ret.result) {
                                Setting.installApp(savePath);
                            }
                            else {
                               
                                Setting.beforeInstall(savePath);
                            }
                        }
                    });

                }
                else {
                    Setting.installApp(savePath);
                }
            }
        });
    }

    static async update(versionRet, showAlert = false) {
        var api = window.api;

        var action = (url) => {
            if (api.systemType == "android") {
                if (url.indexOf("?") >= 0)
                    url += "&";
                else
                    url += "?";
                url += "vertime=" + new Date().getTime();

                api.showProgress({
                    title: textRes.items["正在下载应用"],
                    text: "0%",
                    modal: true
                });

                api.download({
                    url: url,
                    report: true
                }, function (ret, err) {
                    if (ret && 0 == ret.state) {/* 下载进度 */
                        api.showProgress({
                            title: textRes.items["正在下载应用"],
                            text: ret.percent + "%",
                            modal: true
                        });

                    }
                    if (ret && 1 == ret.state) {/* 下载完成 */
                        api.hideProgress();
                        var savePath = ret.savePath;
                        console.log("下载应用完毕");

                        Setting.beforeInstall(savePath);
                       
                    }
                });
            }

            if (api.systemType == "ios") {              

                if (!api.debug) {
                    window.api.openApp({
                        iosUrl: url
                    }, function (ret, err) {
                        });

                    setTimeout(() => {
                        window.api.closeWidget({
                            silent: true
                        });
                    }, 1000);
                }
            }
        };

    /*
    -无更新：{update:false,closed:false}
-有更新：{update:true,closed:false}
-有更新，强制更新：{update:true,closed:true}
-无更新，强制关闭：{update:false,closed:true}
   */

        if (versionRet.update == true && versionRet.closed == false) {
            if (showAlert || getCache("alertedVersion") != versionRet.version) {//如果没有提示过
                var text;
                if (versionRet.tips && versionRet.tips[textRes.langName]) {
                    text = versionRet.tips[textRes.langName];
                }
                else
                    text = textRes.items['有新的版本,是否下载并安装'];

                var doaction = await confirmWindow(text);               

                if (doaction) {
                    action(versionRet.source);
                }
                else {
                    //表示为已经提示过了
                    setCache("alertedVersion", versionRet.version);
                }
            }
            
        }
        else if (versionRet.update == true && versionRet.closed == true) {
            //强制更新
            if (versionRet.tips && versionRet.tips[textRes.langName]) {
                await alertWindow(versionRet.tips[textRes.langName]);
            }
            else
                await alertWindow(textRes.items['发现新版本,即将进行安装']);

            action(versionRet.source);
        }
        else {
            if (showAlert)
                await alertWindow(textRes.items['已经是最新版本']);
        }
    }
   
    /**
     * 检查app版本
     * @param showAlert 是否弹出错误信息或者版本情况
     */
    checkUpdate() {

        this.model.isBusy = true;
        Setting.checkUpdate(this.model , true);
    }

    watchPriceClick() {
        navigation.push(new WatchPriceAssistant());
    }

    logout() {
        this.model.isBusy = true;
        if (ApiHelper.RefreshingToken) {
            setTimeout(() => this.logout(), 100);
            return;
        }
        ApiHelper.CurrentTokenInfo = null;
        this.model.isBusy = false;
        navigation.pop();
    }

    showfiles() {
        
    }
}