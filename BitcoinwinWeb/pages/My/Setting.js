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
import { BaseComponent } from "../../BaseComponent";
import Vue from "vue";
import { setLanguage, showError } from "../../Global";
import { MessageCenter, MessageType } from "../../MessageCenter";
import { ApiHelper } from "../../ServerApis/ApiHelper";
import { setTimeout } from "timers";
import { alertWindow, confirmWindow, getCache, setCache } from "../../GlobalFunc";
import { Home } from "../Home";
import { AccountApi } from "../../ServerApis/AccountApi";
import { WatchPriceAssistant } from "./WatchPriceAssistant";
import { Main } from "../../Main";
var html = require("./setting.html");
var Setting = /** @class */ (function (_super) {
    __extends(Setting, _super);
    function Setting() {
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: {},
            isBusy: false,
            currentLangName: "",
            supportLangs: [],
            lineColors: [],
            currentLineColor: undefined,
            appVersion: "--",
            logined: false,
            priceType: 0,
            isAllowFllowOrder: false,
            isFllowOrder: false,
            isShowFllowConfirm: false,
            fllowOrderConfirmSec: 0,
            priceItems: [],
        };
        _this.model.lineColors = [
            {
                text: textRes.items["红涨绿跌"],
                value: 1,
            }, {
                text: textRes.items["绿涨红跌"],
                value: 2,
            }
        ];
        _this.model.priceItems = [
            {
                text: textRes.items["卖价K线图"],
                value: 0
            },
            {
                text: textRes.items["买价K线图"],
                value: 1
            }
        ];
        _this.model.currentLineColor = getCache("klineColorType3");
        if (!_this.model.currentLineColor) {
            if (textRes.langName == "en-US")
                _this.model.currentLineColor = 2;
            else
                _this.model.currentLineColor = 1;
        }
        if (ApiHelper.CurrentTokenInfo) {
            _this.model.logined = true;
            _this.getAccountInfo();
        }
        try {
            if (getCache("setting_priceType")) {
                _this.model.priceType = parseInt(getCache("setting_priceType"));
            }
        }
        catch (e) {
            showError(e);
        }
        _this.model.textRes = textRes;
        _this.model.supportLangs = supportLangObjects;
        _this.model.currentLangName = textRes.langName;
        if (window.api) {
            var versionFileContent = window.api.readFile({
                path: 'fs://' + ApiHelper.webFolder + '/version.txt',
                sync: true
            });
            eval("versionFileContent=" + versionFileContent);
            if (ApiHelper.IsFromAppStoreApp) {
                _this.model.appVersion = "Store " + window.api.appVersion + " core:" + versionFileContent.version;
            }
            else {
                _this.model.appVersion = window.api.appVersion + " core:" + versionFileContent.version;
            }
        }
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
            watch: {
                currentLangName: function (newValue) {
                    if (newValue) {
                        setLanguage(newValue);
                        MessageCenter.raise(MessageType.LanguageChanged, null);
                        _this.model.lineColors = [
                            {
                                text: textRes.items["红涨绿跌"],
                                value: 1,
                            }, {
                                text: textRes.items["绿涨红跌"],
                                value: 2,
                            }
                        ];
                        _this.model.priceItems = [
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
                priceType: function (newValue) {
                    setCache("setting_priceType", newValue + "");
                },
                isFllowOrder: function (newValue) {
                    if (newValue) {
                        _this.model.isShowFllowConfirm = true;
                        _this.model.fllowOrderConfirmSec = 8;
                        window.setTimeout(function () { return _this.checkConfirmSec(); }, 1000);
                    }
                    else {
                        _this.setFllowOrder(false);
                    }
                },
                currentLineColor: function (newValue) {
                    setCache("klineColorType3", newValue);
                    Main.updateColorType(newValue);
                },
            },
            computed: {
                selectedPriceType: function () {
                    try {
                        return _this.model.priceItems.find(function (m) { return m.value == _this.model.priceType; }).text;
                    }
                    catch (e) {
                        return "";
                    }
                },
                selectedLineColorText: function () {
                    if (_this.model.currentLineColor == undefined)
                        return "";
                    return _this.model.lineColors.find(function (m) { return m.value == _this.model.currentLineColor; }).text;
                },
            },
        });
        return _this;
    }
    Object.defineProperty(Setting.prototype, "needLogin", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Setting.prototype.checkConfirmSec = function () {
        var _this = this;
        this.model.fllowOrderConfirmSec--;
        if (this.model.fllowOrderConfirmSec > 0)
            window.setTimeout(function () { return _this.checkConfirmSec(); }, 1000);
    };
    Setting.prototype.cancelFllowOrder = function () {
        this.model.isShowFllowConfirm = false;
        this.model.fllowOrderConfirmSec = 0;
        this.model.isFllowOrder = false;
    };
    Setting.prototype.confirmFllowOrder = function () {
        if (this.model.fllowOrderConfirmSec == 0) {
            this.model.isShowFllowConfirm = false;
            this.setFllowOrder(true);
        }
    };
    Setting.prototype.setFllowOrder = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.model.isBusy = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, AccountApi.SetIsDocumentary(null, value)];
                    case 2:
                        _a.sent();
                        if (Home.AccountInfo)
                            Home.AccountInfo.accountMoneyInfo.isDocumentary = value;
                        return [3 /*break*/, 5];
                    case 3:
                        e_1 = _a.sent();
                        this.model.isFllowOrder = !value;
                        showError(e_1);
                        return [3 /*break*/, 5];
                    case 4:
                        this.model.isBusy = false;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Setting.prototype.getAccountInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var info, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, 4, 5]);
                        if (!!Home.AccountInfo) return [3 /*break*/, 2];
                        this.model.isBusy = true;
                        return [4 /*yield*/, AccountApi.GetAccountInfo(this)];
                    case 1:
                        info = _a.sent();
                        Home.AccountInfo = info;
                        _a.label = 2;
                    case 2:
                        this.model.isAllowFllowOrder = Home.AccountInfo.accountMoneyInfo.isAllowDocumentary;
                        this.model.isFllowOrder = Home.AccountInfo.accountMoneyInfo.isDocumentary;
                        return [3 /*break*/, 5];
                    case 3:
                        e_2 = _a.sent();
                        showError(e_2);
                        return [3 /*break*/, 5];
                    case 4:
                        this.model.isBusy = false;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**从app store模拟交易环境，转为实盘 */
    Setting.changeFromAppStore = function () {
        var _this = this;
        if (ApiHelper.IsDemoMode) {
            window.api.writeFile({
                path: 'fs://' + ApiHelper.webFolder + '/appstore.txt',
                data: new Date().toString()
            }, function (ret, err) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!ret.status) return [3 /*break*/, 1];
                            Setting.changeFromAppStore_step2();
                            return [3 /*break*/, 3];
                        case 1:
                            if (!err) return [3 /*break*/, 3];
                            return [4 /*yield*/, alertWindow(err)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
        }
    };
    Setting.changeFromAppStore_step2 = function () {
        var _this = this;
        if (ApiHelper.IsDemoMode) {
            window.api.writeFile({
                path: 'fs://' + ApiHelper.webFolder + '/serverUrl.txt',
                data: window.api.pageParam.serverUrl
            }, function (ret, err) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!ret.status) return [3 /*break*/, 1];
                            window.api.rebootApp();
                            return [3 /*break*/, 3];
                        case 1:
                            if (!err) return [3 /*break*/, 3];
                            return [4 /*yield*/, alertWindow(err)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
        }
    };
    Setting.checkUpdate = function (model, showAlert) {
        var _this = this;
        if (model === void 0) { model = null; }
        if (showAlert === void 0) { showAlert = false; }
        if (!window.api || window.api.debug)
            return;
        if (!ApiHelper.ResourceAddress) {
            setTimeout(function () { return Setting.checkUpdate(model, showAlert); }, 500);
            return;
        }
        if (!window.api)
            return;
        if (!model)
            model = { isBusy: false };
        model.isBusy = true;
        var versionRet = {
            update: false,
            closed: false,
            version: "",
            source: "",
            tips: null,
        };
        var url = window.api.pageParam.serverUrl + "/version.txt?t=" + new Date().getTime();
        if (window.api.debug) {
            url = "http://192.168.0.80:8988/version.txt?t=" + new Date().getTime();
        }
        console.log("%c 访问" + url, "color:#0f0;");
        window.api.ajax({
            url: url,
            method: 'get',
            timeout: 5,
            dataType: 'text',
            cache: false
        }, function (ret, err) { return __awaiter(_this, void 0, void 0, function () {
            var p, curVersion, appVersionInfo, serverVersion, serverMinVersion, i, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        model.isBusy = false;
                        console.log("%c version.txt内容：" + JSON.stringify([ret, err]), "color:#0f0;");
                        if (!ret) return [3 /*break*/, 3];
                        eval("ret=" + ret);
                        if (isIOS) {
                            if (ApiHelper.IsFromAppStoreApp) {
                                for (p in ret.iosAppStore) {
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
                        curVersion = window.api.appVersion.split('.');
                        appVersionInfo = ret.android;
                        if (isIOS)
                            appVersionInfo = ret.ios;
                        serverVersion = appVersionInfo.appVersion.split('.');
                        serverMinVersion = appVersionInfo.appMinVersion.split('.');
                        for (i = 0; i < curVersion.length; i++) {
                            if (parseInt(curVersion[i]) < parseInt(serverVersion[i])) {
                                versionRet.update = true;
                                break;
                            }
                            else if (parseInt(curVersion[i]) > parseInt(serverVersion[i])) {
                                break;
                            }
                        }
                        for (i = 0; i < curVersion.length; i++) {
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
                        if (!versionRet.update) return [3 /*break*/, 1];
                        Setting.update(versionRet, showAlert);
                        return [3 /*break*/, 3];
                    case 1:
                        if (!showAlert) return [3 /*break*/, 3];
                        return [4 /*yield*/, alertWindow(textRes.items["已经是最新版本"])];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    Setting.installApp = function (savePath) {
        if (!window.api.debug) {
            window.api.installApp({
                appUri: savePath
            });
            setTimeout(function () {
                window.api.closeWidget({
                    silent: true
                });
            }, 1000);
        }
    };
    Setting.beforeInstall = function (savePath) {
        var _this = this;
        var module = window.api.require('kLine');
        if (!module.canRequestPackageInstalls) {
            //老版本app
            window.api.installApp({
                appUri: savePath
            });
            return;
        }
        module.canRequestPackageInstalls(function (ret, err) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!err) return [3 /*break*/, 2];
                        return [4 /*yield*/, alertWindow(err.msg)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 2:
                        if (!!ret.result) return [3 /*break*/, 4];
                        return [4 /*yield*/, alertWindow(textRes.items['提示用户允许安装未知来源应用程序'])];
                    case 3:
                        _a.sent();
                        module.requestPackageInstalls(function (ret, err) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!err) return [3 /*break*/, 2];
                                        return [4 /*yield*/, alertWindow(err.msg)];
                                    case 1:
                                        _a.sent();
                                        return [3 /*break*/, 3];
                                    case 2:
                                        if (ret.result) {
                                            Setting.installApp(savePath);
                                        }
                                        else {
                                            Setting.beforeInstall(savePath);
                                        }
                                        _a.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [3 /*break*/, 5];
                    case 4:
                        Setting.installApp(savePath);
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    Setting.update = function (versionRet, showAlert) {
        if (showAlert === void 0) { showAlert = false; }
        return __awaiter(this, void 0, void 0, function () {
            var api, action, text, doaction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        api = window.api;
                        action = function (url) {
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
                                    if (ret && 0 == ret.state) { /* 下载进度 */
                                        api.showProgress({
                                            title: textRes.items["正在下载应用"],
                                            text: ret.percent + "%",
                                            modal: true
                                        });
                                    }
                                    if (ret && 1 == ret.state) { /* 下载完成 */
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
                                    setTimeout(function () {
                                        window.api.closeWidget({
                                            silent: true
                                        });
                                    }, 1000);
                                }
                            }
                        };
                        if (!(versionRet.update == true && versionRet.closed == false)) return [3 /*break*/, 3];
                        if (!(showAlert || getCache("alertedVersion") != versionRet.version)) return [3 /*break*/, 2];
                        if (versionRet.tips && versionRet.tips[textRes.langName]) {
                            text = versionRet.tips[textRes.langName];
                        }
                        else
                            text = textRes.items['有新的版本,是否下载并安装'];
                        return [4 /*yield*/, confirmWindow(text)];
                    case 1:
                        doaction = _a.sent();
                        if (doaction) {
                            action(versionRet.source);
                        }
                        else {
                            //表示为已经提示过了
                            setCache("alertedVersion", versionRet.version);
                        }
                        _a.label = 2;
                    case 2: return [3 /*break*/, 10];
                    case 3:
                        if (!(versionRet.update == true && versionRet.closed == true)) return [3 /*break*/, 8];
                        if (!(versionRet.tips && versionRet.tips[textRes.langName])) return [3 /*break*/, 5];
                        return [4 /*yield*/, alertWindow(versionRet.tips[textRes.langName])];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, alertWindow(textRes.items['发现新版本,即将进行安装'])];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        action(versionRet.source);
                        return [3 /*break*/, 10];
                    case 8:
                        if (!showAlert) return [3 /*break*/, 10];
                        return [4 /*yield*/, alertWindow(textRes.items['已经是最新版本'])];
                    case 9:
                        _a.sent();
                        _a.label = 10;
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 检查app版本
     * @param showAlert 是否弹出错误信息或者版本情况
     */
    Setting.prototype.checkUpdate = function () {
        this.model.isBusy = true;
        Setting.checkUpdate(this.model, true);
    };
    Setting.prototype.watchPriceClick = function () {
        navigation.push(new WatchPriceAssistant());
    };
    Setting.prototype.logout = function () {
        var _this = this;
        this.model.isBusy = true;
        if (ApiHelper.RefreshingToken) {
            setTimeout(function () { return _this.logout(); }, 100);
            return;
        }
        ApiHelper.CurrentTokenInfo = null;
        this.model.isBusy = false;
        navigation.pop();
    };
    Setting.prototype.showfiles = function () {
    };
    return Setting;
}(BaseComponent));
export { Setting };
//# sourceMappingURL=Setting.js.map