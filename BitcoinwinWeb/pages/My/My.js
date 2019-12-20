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
import { BaseComponent, StatusBarStyle } from "../../BaseComponent";
import Vue from "vue";
import { showError } from "../../Global";
import { PersonInfo } from "./PersonInfo";
import { MessageCenter, MessageType } from "../../MessageCenter";
import { ApiHelper, CertificationStatus } from "../../ServerApis/ApiHelper";
import { Login } from "../RegisterLogin/Login";
import { AccountCenterApi } from "../../ServerApis/AccountCenterApi";
import { AccountApi } from "../../ServerApis/AccountApi";
import { MessageCenterPage } from "./MessageCenterPage";
import { Popularize } from "./Popularize";
import { DemoTrade } from "./DemoTrade";
import { Setting } from "./Setting";
import { WebBrowser } from "../WebBrowser";
import { Questions } from "./Questions";
import { BeginnerGuide } from "./BeginnerGuide";
import { AccountList } from "./bankAccount/AccountList";
import { TradeApi } from "../../ServerApis/TradeApi";
import { Home } from "../Home";
import { alertWindow } from "../../GlobalFunc";
import { SecurityCenter } from "./SecurityCenter";
import { AboutUs } from "./AboutUs";
var html = require("./my.html");
var My = /** @class */ (function (_super) {
    __extends(My, _super);
    function My() {
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: {},
            phone_number: "",
            certificationSuccess: false,
            safeTop: "",
            unreadCount: 0,
            isVip: false,
            isBusy: false,
        };
        _this.model.textRes = textRes;
        MessageCenter.register(MessageType.Logout, function (p) {
            _this.model.phone_number = "";
            _this.model.isVip = false;
            _this.model.certificationSuccess = false;
        });
        MessageCenter.register(MessageType.Logined, function (p) {
            _this.model.phone_number = window.hidePhone(ApiHelper.CurrentTokenInfo.phone_number);
            if (ApiHelper.CurrentTokenInfo.certificationstatus == CertificationStatus.CertificationSuccess) {
                _this.model.certificationSuccess = true;
            }
        });
        if (window.api) {
            _this.model.safeTop = window.api.safeArea.top + "px";
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
        if (Home.AccountInfo) {
            _this.model.isVip = Home.AccountInfo.isVip;
        }
        else {
            MessageCenter.register(MessageType.ReceivedAccountInfo, function (p) {
                _this.model.isVip = p.isVip;
            });
        }
        return _this;
    }
    Object.defineProperty(My.prototype, "needLogin", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    My.prototype.onNavigationUnActived = function (ispop) {
        _super.prototype.onNavigationUnActived.call(this, ispop);
        this.recordPageEnd("我的");
    };
    My.prototype.onNavigationActived = function (isResume) {
        return __awaiter(this, void 0, void 0, function () {
            var ret, e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _super.prototype.onNavigationActived.call(this, isResume);
                        this.recordPageStart("我的");
                        if (!ApiHelper.CurrentTokenInfo) return [3 /*break*/, 4];
                        this.model.phone_number = window.hidePhone(ApiHelper.CurrentTokenInfo.phone_number);
                        if (ApiHelper.CurrentTokenInfo.certificationstatus == CertificationStatus.CertificationSuccess) {
                            this.model.certificationSuccess = true;
                        }
                        AccountCenterApi.GetCertificationStatus(this, function (ret, err) {
                            if (!err && ApiHelper.CurrentTokenInfo) {
                                ApiHelper.CurrentTokenInfo.certificationstatus = ret;
                                if (ApiHelper.CurrentTokenInfo.certificationstatus == CertificationStatus.CertificationSuccess && _this.model.certificationSuccess != true) {
                                    _this.model.certificationSuccess = true;
                                    MessageCenter.raise(MessageType.CertificationStatusChanged, null);
                                }
                                console.log("实名状态：" + ret);
                            }
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, AccountApi.GetUnReadCount(this)];
                    case 2:
                        ret = _a.sent();
                        this.model.unreadCount = ret.activityUnReadTotal + ret.systemUnReadTotal + ret.userUnReadTotal;
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        this.model.unreadCount = 0;
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    My.prototype.messageCenterClick = function () {
        navigation.push(new MessageCenterPage());
    };
    My.prototype.showPopularize = function () {
        navigation.push(new Popularize());
    };
    My.prototype.loginClick = function () {
        if (!ApiHelper.CurrentTokenInfo) {
            navigation.push(new Login());
        }
    };
    My.prototype.personInfoClick = function () {
        navigation.push(new PersonInfo());
    };
    My.prototype.accountClick = function () {
        if (!ApiHelper.checkCertificationStatus()) {
            return;
        }
        navigation.push(new AccountList());
    };
    My.prototype.demoTradeClick = function () {
        var _this = this;
        this.recordAction("My_模拟交易");
        if (!ApiHelper.CurrentTokenInfo) {
            navigation.push(new Login());
            return;
        }
        if (this.model.isBusy)
            return;
        this.model.isBusy = true;
        TradeApi.IsSimulate(this, function (ret, err) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.model.isBusy = false;
                        if (!err) return [3 /*break*/, 1];
                        showError(err);
                        return [3 /*break*/, 6];
                    case 1:
                        if (!!ret) return [3 /*break*/, 3];
                        return [4 /*yield*/, alertWindow(textRes.items['目前不能进行模拟交易'])];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 3:
                        if (!!sessionStorage.getItem("demoTradeClick")) return [3 /*break*/, 5];
                        sessionStorage.setItem("demoTradeClick", "1");
                        return [4 /*yield*/, alertWindow(textRes.getItem("模拟交易操作时间还剩n天", ret))];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        navigation.push(new DemoTrade());
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        }); });
    };
    My.prototype.serviceClick = function () {
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
    };
    My.prototype.aboutUsClick = function () {
        navigation.push(new AboutUs());
    };
    My.prototype.settingClick = function () {
        try {
            navigation.push(new Setting());
        }
        catch (e) {
            showError(e);
        }
    };
    My.prototype.questionsClick = function () {
        navigation.push(new Questions("My"));
    };
    My.prototype.beginnerGuideClick = function () {
        navigation.push(new BeginnerGuide("My"));
    };
    My.prototype.securityCenterClick = function () {
        navigation.push(new SecurityCenter());
    };
    return My;
}(BaseComponent));
export { My };
//# sourceMappingURL=My.js.map