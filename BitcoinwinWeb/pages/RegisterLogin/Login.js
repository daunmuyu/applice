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
import { AccountApi } from "../../ServerApis/AccountApi";
import { showError } from "../../Global";
import { ApiHelper } from "../../ServerApis/ApiHelper";
import { Register } from "./Register";
import { ForgetPwd } from "./ForgetPwd";
import { getCache, setCache, removeCache, alertWindow } from "../../GlobalFunc";
import { setTimeout } from "timers";
var html = require("./login.html");
var Login = /** @class */ (function (_super) {
    __extends(Login, _super);
    function Login() {
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: {},
            username: "",
            password: "",
            isIOS: false,
            fingerLogin: false,
            fingerShake: false,
            fingerHasUI: false,
            autologin: true,
            isBusy: false,
            showHead: false,
            mainColor: null,
        };
        if (window.api && getCache("UseFinger") === "1" && getCache("FingerInfo")) {
            var touchID = window.api.require('jackTouchId');
            if (touchID.hasUI) {
                touchID.hasUI(function (ret, err) {
                    _this.model.fingerHasUI = ret.result;
                    touchID.isValid(function (ret, err) {
                        if (ret.status) {
                            _this.model.fingerLogin = true;
                            _this.goFingerLogin();
                        }
                    });
                });
            }
            else {
                _this.model.fingerHasUI = false;
                touchID.isValid(function (ret, err) {
                    if (ret.status) {
                        _this.model.fingerLogin = true;
                        _this.goFingerLogin();
                    }
                });
            }
        }
        _this.model.showHead = ApiHelper.IsDemoMode;
        _this.model.isIOS = isIOS;
        _this.model.textRes = textRes;
        _this.model.mainColor = ApiHelper.MainColor;
        _this.model.username = getCache("username");
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
        });
        return _this;
    }
    Object.defineProperty(Login.prototype, "animationOnNavigation", {
        get: function () {
            if (getCache("UseFinger") === "1")
                return false;
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Login.prototype, "needLogin", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Login.prototype, "statusBarStyle", {
        get: function () {
            return StatusBarStyle.Dark;
        },
        enumerable: true,
        configurable: true
    });
    Login.prototype.showIcon = function () {
        if (!this.model.showHead)
            return;
        var src = getCache("myhead");
        if (src) {
            var canEle = this.element.querySelector("#icon");
            canEle.width = canEle.offsetWidth;
            canEle.height = canEle.offsetHeight;
            var img = new Image();
            img.onload = function () {
                var ctx = canEle.getContext("2d");
                ctx.clearRect(0, 0, canEle.width, canEle.height);
                ctx.drawImage(img, 0, 0, canEle.width, canEle.height);
            };
            img.src = src;
        }
    };
    Login.prototype.photoChange = function (e) {
        var input = e.target;
        var canEle = this.element.querySelector("#icon");
        canEle.width = canEle.offsetWidth;
        canEle.height = canEle.offsetHeight;
        var reader = new FileReader();
        reader.onload = function (e) {
            var img = new Image();
            img.onload = function () {
                var ctx = canEle.getContext("2d");
                ctx.clearRect(0, 0, canEle.width, canEle.height);
                ctx.drawImage(img, 0, 0, canEle.width, canEle.height);
            };
            setCache("myhead", reader.result);
            img.src = reader.result;
        };
        reader.readAsDataURL(input.files[0]);
    };
    Login.prototype.onNavigationPushed = function () {
        _super.prototype.onNavigationPushed.call(this);
        this.showIcon();
    };
    Login.prototype.cancelFinger = function () {
        var touchID = window.api.require('jackTouchId');
        if (touchID.cancel)
            touchID.cancel();
        navigation.pop();
    };
    Login.prototype.enterPassword = function () {
        var touchID = window.api.require('jackTouchId');
        if (touchID.cancel)
            touchID.cancel();
        this.model.fingerLogin = false;
    };
    Login.prototype.goFingerLogin = function () {
        var _this = this;
        var touchID = window.api.require('jackTouchId');
        touchID.verify({
            title: textRes.items['指纹验证'],
            usePasswordDesc: textRes.items['输入密码']
        }, function (ret) { return __awaiter(_this, void 0, void 0, function () {
            var e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!ret.status) return [3 /*break*/, 6];
                        //如果有回调，那么，直接返回
                        if (this.callback) {
                            navigation.pop(false);
                            this.callback(false);
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        this.model.isBusy = true;
                        return [4 /*yield*/, AccountApi.RefreshTokenByToken(getCache("FingerInfo"), false)];
                    case 2:
                        _a.sent();
                        navigation.pop();
                        return [3 /*break*/, 5];
                    case 3:
                        e_1 = _a.sent();
                        if (e_1.code && e_1.code == 402) {
                            setCache("FingerInfo", "");
                            this.model.fingerLogin = false;
                        }
                        else {
                            navigation.pop();
                            showError(e_1);
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        this.model.isBusy = false;
                        return [7 /*endfinally*/];
                    case 5: return [3 /*break*/, 15];
                    case 6:
                        if (!(ret.code == 0)) return [3 /*break*/, 7];
                        //await alertWindow(textRes.items['用户选择手动输入']);
                        //如果有回调，那么，直接返回
                        if (this.callback) {
                            navigation.pop(false);
                            this.callback(true);
                            return [2 /*return*/];
                        }
                        this.model.fingerLogin = false;
                        return [3 /*break*/, 15];
                    case 7:
                        if (!(ret.code == 1)) return [3 /*break*/, 8];
                        //用户取消验证
                        //如果有回调，那么，直接返回
                        if (this.callback) {
                            navigation.pop(false);
                            this.callback(true);
                            return [2 /*return*/];
                        }
                        navigation.pop();
                        return [3 /*break*/, 15];
                    case 8:
                        if (!(ret.code == 2)) return [3 /*break*/, 10];
                        //api.alert({ msg: "验证三次失败" });
                        return [4 /*yield*/, alertWindow(textRes.items['指纹验证失败'])];
                    case 9:
                        //api.alert({ msg: "验证三次失败" });
                        _a.sent();
                        //如果有回调，那么，直接返回
                        if (this.callback) {
                            navigation.pop(false);
                            this.callback(true);
                            return [2 /*return*/];
                        }
                        navigation.pop();
                        return [3 /*break*/, 15];
                    case 10:
                        if (!(ret.code == 3)) return [3 /*break*/, 12];
                        //api.alert({ msg: "多次验证失败请锁定手机" });
                        //如果有回调，那么，直接返回
                        if (this.callback) {
                            navigation.pop(false);
                            this.callback(true);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, alertWindow(textRes.items['指纹多次验证失败，app将退出'])];
                    case 11:
                        _a.sent();
                        window.api.closeWidget({
                            silent: true
                        });
                        return [3 /*break*/, 15];
                    case 12:
                        if (!(ret.code == 6)) return [3 /*break*/, 13];
                        //指纹验证失败，但仍然可以继续尝试
                        this.model.fingerShake = true;
                        setTimeout(function () { _this.model.fingerShake = false; }, 1000);
                        return [3 /*break*/, 15];
                    case 13: return [4 /*yield*/, alertWindow(textRes.items['指纹验证失败'])];
                    case 14:
                        _a.sent();
                        //如果有回调，那么，直接返回
                        if (this.callback) {
                            navigation.pop(false);
                            this.callback(true);
                            return [2 /*return*/];
                        }
                        navigation.pop();
                        _a.label = 15;
                    case 15: return [2 /*return*/];
                }
            });
        }); });
    };
    Login.prototype.register = function () {
        this.recordAction("Login_去注册按钮");
        var page = new Register();
        navigation.push(page);
    };
    Login.prototype.forgetPwd = function () {
        navigation.push(new ForgetPwd());
    };
    Login.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.model.isBusy)
                            return [2 /*return*/];
                        if (!(this.model.password.length < 8 || this.model.password.length > 16
                            || /[0-9]/.test(this.model.password) === false
                            || /[a-zA-Z]/.test(this.model.password) === false)) return [3 /*break*/, 2];
                        return [4 /*yield*/, alertWindow(textRes.items['请输入m密码'])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2:
                        this.recordAction("Login_提交按钮");
                        this.model.isBusy = true;
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, 6, 7]);
                        return [4 /*yield*/, AccountApi.Login(this, this.model.username, this.model.password, this.model.autologin)];
                    case 4:
                        _a.sent();
                        setCache("username", this.model.username);
                        if (this.model.autologin) {
                            setCache("CurrentTokenInfo", JSON.stringify(ApiHelper.CurrentTokenInfo));
                        }
                        else {
                            removeCache("CurrentTokenInfo");
                        }
                        setCache("CurrentTokenInfo2", JSON.stringify(ApiHelper.CurrentTokenInfo));
                        navigation.pop();
                        return [3 /*break*/, 7];
                    case 5:
                        e_2 = _a.sent();
                        showError(e_2, false);
                        return [3 /*break*/, 7];
                    case 6:
                        this.model.isBusy = false;
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return Login;
}(BaseComponent));
export { Login };
//# sourceMappingURL=Login.js.map