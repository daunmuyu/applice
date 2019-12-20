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
import { ApiHelper, CertificationStatus } from "../../ServerApis/ApiHelper";
import { RealName } from "./RealName";
import { Home } from "../Home";
import { AccountApi } from "../../ServerApis/AccountApi";
import { showError } from "../../Global";
import { SetPayPassword } from "./SetPayPassword";
import { ForgetPwd } from "../RegisterLogin/ForgetPwd";
import { setCache, getCache, alertWindow } from "../../GlobalFunc";
import { EnterPassword } from "../General/EnterPassword";
import { Login } from "../RegisterLogin/Login";
var html = require("./securityCenter.html");
var SecurityCenter = /** @class */ (function (_super) {
    __extends(SecurityCenter, _super);
    function SecurityCenter() {
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: {},
            /**安全等级，0-100*/
            safetyLevel: 10,
            phone_number: "",
            certificationstatus: "",
            certificationAuditing: false,
            certificationSuccess: false,
            canCertification: false,
            isSetedPayPassword: false,
            /**是否开启指纹登录*/
            activeFinger: false,
            isBusy: false,
        };
        _this.model.textRes = textRes;
        _this.model.activeFinger = getCache("UseFinger") === "1";
        if (_this.model.activeFinger) {
            _this.model.safetyLevel = Math.min(100, _this.model.safetyLevel + 30);
        }
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            methods: _this.getMethodObjectForVue(),
            data: _this.model,
            watch: {
                isSetedPayPassword: function (newValue) {
                    if (newValue)
                        _this.model.safetyLevel = Math.min(100, _this.model.safetyLevel + 30);
                },
                activeFinger: function (newValue, oldValue) { return __awaiter(_this, void 0, void 0, function () {
                    var touchID;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!newValue) return [3 /*break*/, 4];
                                this.model.safetyLevel = Math.min(100, this.model.safetyLevel + 30);
                                if (!window.api) return [3 /*break*/, 1];
                                touchID = window.api.require('jackTouchId');
                                touchID.isValid(function (ret, err) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (!ret.status) return [3 /*break*/, 1];
                                                setCache("UseFinger", "1");
                                                setCache("FingerInfo", ApiHelper.CurrentTokenInfo.refresh_token);
                                                this.fingerLogin();
                                                return [3 /*break*/, 3];
                                            case 1: return [4 /*yield*/, alertWindow(textRes.items['您的设备不支持指纹识别功能,或者您还没有在您的手机里录入指纹'])];
                                            case 2:
                                                _a.sent();
                                                this.model.activeFinger = false;
                                                _a.label = 3;
                                            case 3: return [2 /*return*/];
                                        }
                                    });
                                }); });
                                return [3 /*break*/, 3];
                            case 1: return [4 /*yield*/, alertWindow(textRes.items['您的设备不支持指纹识别功能,或者您还没有在您的手机里录入指纹'])];
                            case 2:
                                _a.sent();
                                this.model.activeFinger = false;
                                _a.label = 3;
                            case 3: return [3 /*break*/, 5];
                            case 4:
                                this.model.safetyLevel = Math.min(100, this.model.safetyLevel - 30);
                                setCache("UseFinger", "0");
                                setCache("FingerInfo", "");
                                _a.label = 5;
                            case 5: return [2 /*return*/];
                        }
                    });
                }); },
            },
        });
        _this.checkStatus();
        return _this;
    }
    SecurityCenter.prototype.fingerLogin = function () {
        var _this = this;
        var login = new Login();
        login.callback = function (err) {
            if (err) {
                _this.model.activeFinger = false;
            }
        };
        navigation.push(login);
    };
    SecurityCenter.prototype.activeFingerClick = function () {
        var _this = this;
        if (this.model.activeFinger) {
            this.model.activeFinger = false;
        }
        else {
            navigation.push(new EnterPassword(function (pwd) { return __awaiter(_this, void 0, void 0, function () {
                var e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.model.isBusy = true;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, 4, 5]);
                            return [4 /*yield*/, AccountApi.Login(this, ApiHelper.CurrentTokenInfo.phone_number, pwd, ApiHelper.CurrentTokenInfo.autologin)];
                        case 2:
                            _a.sent();
                            this.model.activeFinger = true;
                            return [3 /*break*/, 5];
                        case 3:
                            e_1 = _a.sent();
                            showError(e_1);
                            return [3 /*break*/, 5];
                        case 4:
                            this.model.isBusy = false;
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            }); }));
        }
    };
    SecurityCenter.prototype.checkStatus = function () {
        return __awaiter(this, void 0, void 0, function () {
            var info, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (ApiHelper.CurrentTokenInfo) {
                            this.model.phone_number = ApiHelper.CurrentTokenInfo.phone_number;
                            if (ApiHelper.CurrentTokenInfo.certificationstatus == CertificationStatus.CertificationSuccess) {
                                this.model.certificationstatus = textRes.items["已认证"];
                                this.model.certificationSuccess = true;
                                this.model.safetyLevel = Math.min(100, this.model.safetyLevel + 30);
                            }
                            else if (ApiHelper.CurrentTokenInfo.certificationstatus == CertificationStatus.CertificationFail) {
                                this.model.certificationstatus = textRes.items["认证失败"];
                                this.model.canCertification = true;
                            }
                            else if (ApiHelper.CurrentTokenInfo.certificationstatus == CertificationStatus.CertificationAuditing) {
                                this.model.certificationstatus = textRes.items["审核中..."];
                                this.model.certificationAuditing = true;
                            }
                            else if (ApiHelper.CurrentTokenInfo.certificationstatus == CertificationStatus.Uncertified || ApiHelper.CurrentTokenInfo.certificationstatus == undefined) {
                                this.model.certificationstatus = textRes.items["未认证"];
                                this.model.canCertification = true;
                            }
                        }
                        if (!Home.AccountInfo) return [3 /*break*/, 1];
                        this.model.isSetedPayPassword = Home.AccountInfo.accountMoneyInfo.issetpassword;
                        return [3 /*break*/, 6];
                    case 1:
                        this.model.isBusy = true;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, 5, 6]);
                        return [4 /*yield*/, AccountApi.GetAccountInfo(this)];
                    case 3:
                        info = _a.sent();
                        this.model.isSetedPayPassword = info.accountMoneyInfo.issetpassword;
                        return [3 /*break*/, 6];
                    case 4:
                        e_2 = _a.sent();
                        showError(e_2);
                        return [3 /*break*/, 6];
                    case 5:
                        this.model.isBusy = false;
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    SecurityCenter.prototype.realNameClick = function () {
        if (ApiHelper.CurrentTokenInfo.certificationstatus == undefined ||
            ApiHelper.CurrentTokenInfo.certificationstatus == CertificationStatus.Uncertified || ApiHelper.CurrentTokenInfo.certificationstatus == CertificationStatus.CertificationFail)
            navigation.push(new RealName());
    };
    SecurityCenter.prototype.setPayPwdClick = function () {
        navigation.push(new SetPayPassword());
    };
    SecurityCenter.prototype.modifyPwdClick = function () {
        navigation.push(new ForgetPwd());
    };
    return SecurityCenter;
}(BaseComponent));
export { SecurityCenter };
//# sourceMappingURL=SecurityCenter.js.map