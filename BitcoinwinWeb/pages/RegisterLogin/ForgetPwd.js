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
import { ApiHelper } from "../../ServerApis/ApiHelper";
import { ModelValidator, ValidateType } from "jack-one-script";
import { AccountCenterApi } from "../../ServerApis/AccountCenterApi";
import { WebBrowser } from "../WebBrowser";
import { alertWindow } from "../../GlobalFunc";
var html = require("./forgetPwd.html");
var ForgetPwd = /** @class */ (function (_super) {
    __extends(ForgetPwd, _super);
    function ForgetPwd() {
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: {},
            username: "",
            pwd1: "",
            pwd2: "",
            verifyCode: "",
            isBusy: false,
            agree: false,
            canSendSms: 0,
            validator: {},
        };
        _this.model.textRes = window.textRes;
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: {
                submit: function () { return _this.submit(); },
                sendsms: function () { return _this.sendsms(); },
                read_zc: function () { return _this.read_zc(); },
                read_fx: function () { return _this.read_fx(); },
            },
            watch: {
                verifyCode: function (newValue) {
                    if (newValue.length > 6)
                        _this.model.verifyCode = newValue.substr(0, 6);
                },
            },
        });
        return _this;
    }
    Object.defineProperty(ForgetPwd.prototype, "needLogin", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ForgetPwd.prototype, "statusBarStyle", {
        get: function () {
            return StatusBarStyle.Dark;
        },
        enumerable: true,
        configurable: true
    });
    ForgetPwd.prototype.read_zc = function () {
        var page = new WebBrowser({
            src: ApiHelper.ResourceAddress + "/RegistrationAgreement." + this.model.textRes.langName.replace("-", "_") + ".html",
            fullScreen: false,
            title: this.model.textRes.items["注册协议"]
        });
        navigation.push(page);
    };
    ForgetPwd.prototype.read_fx = function () {
        var page = new WebBrowser({
            src: ApiHelper.ResourceAddress + "/RegistrationAgreement." + this.model.textRes.langName.replace("-", "_") + ".html",
            fullScreen: false,
            title: this.model.textRes.items["风险揭示"]
        });
        navigation.push(page);
    };
    ForgetPwd.prototype.sendsms = function () {
        var _this = this;
        if (this.model.canSendSms > 0)
            return;
        var arr = [];
        arr[0] = {
            propertyName: "username",
            validateType: ValidateType.Required
        };
        var result = ModelValidator.verifyToProperty(this.model, arr, "validator");
        if (!result)
            return;
        this.model.isBusy = true;
        AccountCenterApi.SendSmsCode(this, this.model.username, 0, 2, function (ret, err) {
            _this.model.isBusy = false;
            if (err)
                showError(err);
            else {
                _this.changeSeconds();
            }
        });
    };
    ForgetPwd.prototype.changeSeconds = function () {
        var _this = this;
        this.model.canSendSms = 60;
        var startime = new Date();
        var action = function () {
            _this.model.canSendSms = Math.max(0, 60 - window.parseInt((new Date().getTime() - startime.getTime()) / 1000));
            if (_this.model.canSendSms > 0)
                setTimeout(action, 1000);
        };
        setTimeout(action, 1000);
    };
    ForgetPwd.prototype.submit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var arr, result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        arr = [
                            {
                                propertyName: "username",
                                validateType: ValidateType.Required
                            },
                            {
                                propertyName: "verifyCode",
                                validateType: ValidateType.Required
                            },
                            {
                                propertyName: "pwd1",
                                validateType: ValidateType.Required
                            },
                        ];
                        if (!(this.model.pwd1.length < 8 || this.model.pwd1.length > 16
                            || /[0-9]/.test(this.model.pwd1) === false
                            || /[a-zA-Z]/.test(this.model.pwd1) === false)) return [3 /*break*/, 2];
                        return [4 /*yield*/, alertWindow(textRes.items['请输入m密码'])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2:
                        result = ModelValidator.verifyToProperty(this.model, arr, "validator");
                        if (!result)
                            return [2 /*return*/];
                        if (!(this.model.pwd1 != this.model.pwd2)) return [3 /*break*/, 4];
                        return [4 /*yield*/, alertWindow(this.model.textRes.items["密码确认不一致"])];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                    case 4:
                        this.model.isBusy = true;
                        AccountCenterApi.CheckPhoneSmsCode(this, this.model.username, this.model.verifyCode, 2, function (ret, err) {
                            if (err) {
                                _this.model.isBusy = false;
                                showError(err);
                            }
                            else {
                                AccountCenterApi.ForgetPassword(_this, _this.model.username, _this.model.pwd1, function (ret, err) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                this.model.isBusy = false;
                                                if (!err) return [3 /*break*/, 1];
                                                showError(err);
                                                return [3 /*break*/, 3];
                                            case 1: return [4 /*yield*/, alertWindow(this.model.textRes.items["成功设置密码"])];
                                            case 2:
                                                _a.sent();
                                                navigation.pop();
                                                _a.label = 3;
                                            case 3: return [2 /*return*/];
                                        }
                                    });
                                }); });
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    return ForgetPwd;
}(BaseComponent));
export { ForgetPwd };
//# sourceMappingURL=ForgetPwd.js.map