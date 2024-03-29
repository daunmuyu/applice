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
import { showError } from "../../Global";
import { AccountApi } from "../../ServerApis/AccountApi";
import { EnterPayPassword } from "../General/EnterPayPassword";
import { Home } from "../Home";
import { alertWindow } from "../../GlobalFunc";
var html = require("./setPayPassword.html");
var SetPayPassword = /** @class */ (function (_super) {
    __extends(SetPayPassword, _super);
    function SetPayPassword() {
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: {},
            isBusy: false,
            canSendSms: 0,
            password: "",
            password2: "",
            smscode: "",
        };
        _this.model.textRes = textRes;
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
        });
        return _this;
    }
    Object.defineProperty(SetPayPassword.prototype, "needLogin", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    SetPayPassword.prototype.sendSms = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.model.canSendSms > 0)
                            return [2 /*return*/];
                        this.model.isBusy = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, AccountApi.SendSetPayPwdSms(this)];
                    case 2:
                        _a.sent();
                        this.changeSeconds();
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
        });
    };
    SetPayPassword.prototype.changeSeconds = function () {
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
    SetPayPassword.prototype.submit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.model.password.length != 6)) return [3 /*break*/, 2];
                        return [4 /*yield*/, alertWindow(textRes.getItem("请输入n位支付密码", 6))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2:
                        if (!(this.model.smscode.length != 6)) return [3 /*break*/, 4];
                        return [4 /*yield*/, alertWindow(textRes.getItem("请输入n位验证码", 6))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                    case 4:
                        navigation.push(new EnterPayPassword(textRes.items["请再次输入新密码"], false, function (pwd) { return __awaiter(_this, void 0, void 0, function () {
                            var e_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        this.model.password2 = pwd;
                                        if (!(this.model.password2.length === 6)) return [3 /*break*/, 8];
                                        navigation.pop(false);
                                        if (!(this.model.password != this.model.password2)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, alertWindow(textRes.items["支付密码确认不一致"])];
                                    case 1:
                                        _a.sent();
                                        return [3 /*break*/, 8];
                                    case 2:
                                        this.model.isBusy = true;
                                        _a.label = 3;
                                    case 3:
                                        _a.trys.push([3, 6, 7, 8]);
                                        return [4 /*yield*/, AccountApi.SetUserPassword(this, this.model.password, this.model.smscode)];
                                    case 4:
                                        _a.sent();
                                        if (Home.AccountInfo)
                                            Home.AccountInfo.accountMoneyInfo.issetpassword = true;
                                        return [4 /*yield*/, alertWindow(textRes.items["成功设置支付密码"])];
                                    case 5:
                                        _a.sent();
                                        navigation.pop();
                                        return [3 /*break*/, 8];
                                    case 6:
                                        e_2 = _a.sent();
                                        showError(e_2);
                                        return [3 /*break*/, 8];
                                    case 7:
                                        this.model.isBusy = false;
                                        return [7 /*endfinally*/];
                                    case 8: return [2 /*return*/];
                                }
                            });
                        }); }), false);
                        return [2 /*return*/];
                }
            });
        });
    };
    return SetPayPassword;
}(BaseComponent));
export { SetPayPassword };
//# sourceMappingURL=SetPayPassword.js.map