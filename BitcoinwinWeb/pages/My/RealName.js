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
import { ApiHelper, CertificationStatus } from "../../ServerApis/ApiHelper";
import { AccountCenterApi } from "../../ServerApis/AccountCenterApi";
import { ModelValidator } from "jack-one-script";
import { MessageCenter, MessageType } from "../../MessageCenter";
import { alertWindow } from "../../GlobalFunc";
var html = require("./realname.html");
var RealName = /** @class */ (function (_super) {
    __extends(RealName, _super);
    function RealName() {
        var _this = _super.call(this, html) || this;
        _this.model = {
            textRes: {},
            isBusy: false,
            /**未成年*/
            isMinor: false,
            name: "",
            number: "",
            validator: {},
            /**timeZone */
            selectedCountry: "86",
            selectedCountryText: "",
            countries: [],
            isIos: false,
        };
        _this.model.textRes = textRes;
        _this.model.isIos = isIOS;
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model,
            methods: _this.getMethodObjectForVue(),
            watch: {
                selectedCountry: function (newvalue) {
                    _this.model.selectedCountryText = _this.model.countries.filter(function (m) { return m.timeZone === newvalue; })[0].countryName;
                }
            }
        });
        return _this;
    }
    Object.defineProperty(RealName.prototype, "needLogin", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    RealName.prototype.uploadClick = function (e) {
        var input = e.target;
        var canEle;
        var ele = input.previousSibling;
        while (ele) {
            if (ele.querySelector)
                canEle = ele.querySelector("CANVAS");
            if (canEle) {
                break;
            }
            else {
                ele = ele.previousSibling;
            }
        }
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
            img.src = reader.result;
        };
        reader.readAsDataURL(input.files[0]);
    };
    RealName.prototype.onNavigationPushed = function () {
        var _this = this;
        _super.prototype.onNavigationPushed.call(this);
        this.model.isBusy = true;
        AccountCenterApi.GetCountryInfoList(this, function (ret, err) {
            _this.model.isBusy = false;
            if (err)
                showError(err);
            else {
                _this.model.countries = ret;
                _this.model.selectedCountryText = _this.model.countries.filter(function (m) { return m.timeZone == _this.model.selectedCountry; })[0].countryName;
            }
        });
    };
    RealName.prototype.submit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!ModelValidator.verifyToProperty(this.model, [{ propertyName: "name" }, { propertyName: "number" }], "validator"))
                            return [2 /*return*/];
                        if (!this.model.isBusy) return [3 /*break*/, 2];
                        return [4 /*yield*/, alertWindow(textRes.items['数据仍在加载中，请稍后再试'])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2:
                        //try {
                        //    var year = parseInt(this.model.number.substr(6, 4));
                        //    if (!isNaN(year) && new Date().getFullYear() - year < 18) {
                        //        this.model.isMinor = true;
                        //        return;
                        //    }
                        //}
                        //catch (e) {
                        //}
                        this.model.isBusy = true;
                        AccountCenterApi.Certification(this, this.model.number, this.model.name, this.model.selectedCountry == "86" ? 1 : 2, this.model.selectedCountry, function (ret, err) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        this.model.isBusy = false;
                                        if (!err) return [3 /*break*/, 1];
                                        if (err.code == 410 || err.status == 410) {
                                            //未成年
                                            this.model.isMinor = true;
                                            return [2 /*return*/];
                                        }
                                        showError(err);
                                        return [3 /*break*/, 6];
                                    case 1:
                                        if (!(this.model.selectedCountry == "86")) return [3 /*break*/, 3];
                                        ApiHelper.CurrentTokenInfo.realname = this.model.name;
                                        ApiHelper.CurrentTokenInfo.certificationstatus = CertificationStatus.CertificationSuccess;
                                        MessageCenter.raise(MessageType.CertificationStatusChanged, null);
                                        return [4 /*yield*/, alertWindow(textRes.items['认证成功'])];
                                    case 2:
                                        _a.sent();
                                        return [3 /*break*/, 5];
                                    case 3:
                                        ApiHelper.CurrentTokenInfo.certificationstatus = CertificationStatus.CertificationAuditing;
                                        MessageCenter.raise(MessageType.CertificationStatusChanged, null);
                                        return [4 /*yield*/, alertWindow(textRes.items['实名认证正在审核'])];
                                    case 4:
                                        _a.sent();
                                        _a.label = 5;
                                    case 5:
                                        navigation.pop(false);
                                        _a.label = 6;
                                    case 6: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/];
                }
            });
        });
    };
    return RealName;
}(BaseComponent));
export { RealName };
//# sourceMappingURL=RealName.js.map