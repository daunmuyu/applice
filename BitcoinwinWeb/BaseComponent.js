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
import { Component } from "jack-one-script";
import { ApiHelper } from "./ServerApis/ApiHelper";
export var StatusBarStyle;
(function (StatusBarStyle) {
    StatusBarStyle[StatusBarStyle["None"] = 0] = "None";
    StatusBarStyle[StatusBarStyle["Dark"] = 1] = "Dark";
    StatusBarStyle[StatusBarStyle["Light"] = 2] = "Light";
})(StatusBarStyle || (StatusBarStyle = {}));
var BaseComponent = /** @class */ (function (_super) {
    __extends(BaseComponent, _super);
    function BaseComponent(html) {
        var _this = _super.call(this, html) || this;
        _this.initForVerifyJPattern();
        return _this;
    }
    Object.defineProperty(BaseComponent.prototype, "statusBarStyle", {
        get: function () {
            return StatusBarStyle.Light;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseComponent.prototype, "needLogin", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseComponent.prototype, "title", {
        /**标题，主要用于统计，所以用中文即可*/
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    /**把v-model copy to _vmodel */
    BaseComponent.prototype.initForVerifyJPattern = function () {
        var items = this.element.querySelectorAll("INPUT[jpattern]");
        items.forEach(function (m) {
            var jpattern = m.getAttribute("jpattern");
            var vmodel = m.getAttribute("v-model");
            if (jpattern && vmodel) {
                m.setAttribute("_vmodel", vmodel);
            }
        });
    };
    /**
     * 开启支持verifyPattern.js
     * @param vm
     */
    BaseComponent.prototype.supportVerifyJPattern = function (vm) {
        var items = this.element.querySelectorAll("INPUT[jpattern]");
        items.forEach(function (m) {
            m._vm = vm;
        });
    };
    BaseComponent.prototype.getFontSize = function (rem, isMore) {
        if (isMore === void 0) { isMore = false; }
        return window.getFontSize(rem, isMore);
    };
    BaseComponent.prototype.hidePhone = function (phone) {
        return window.hidePhone(phone);
    };
    BaseComponent.prototype.getWeek = function () {
        return window.getWeek();
    };
    BaseComponent.prototype.formatMoney = function (pa, fh) {
        if (fh === void 0) { fh = undefined; }
        return window.formatMoney(this.clearZero(pa), fh);
    };
    BaseComponent.prototype.formatMoneyFixed = function (pa, fixed, fh) {
        if (fh === void 0) { fh = undefined; }
        if (isNaN(pa) || pa == undefined)
            return undefined;
        pa = parseFloat(pa);
        return window.formatMoney(pa.toFixed(fixed), fh);
    };
    BaseComponent.prototype.IsDemoMode = function () {
        return ApiHelper.IsDemoMode;
    };
    /**
     * 清楚小数点后面没用的0
     * @param p
     */
    BaseComponent.prototype.clearZero = function (p) {
        return BaseComponent.clearZero(p);
    };
    /**
    * 清楚小数点后面没用的0
    * @param p
    */
    BaseComponent.clearZero = function (p) {
        if (isNaN(p))
            return undefined;
        if (!p)
            return p;
        if (typeof p != "string")
            p = p + "";
        if (p.indexOf(".") < 0)
            return p;
        var ret = /[1-9]*(0+)$/.exec(p);
        if (ret) {
            p = p.substr(0, p.length - ret[1].length);
            if (p.indexOf(".") === p.length - 1)
                p = p.substr(0, p.length - 1);
            return p;
        }
        else {
            return p;
        }
    };
    /**
     *
     * @param number
     * @param fractionDigits
     * @param clearZero
     * @param noIn 是否只舍不入
     */
    BaseComponent.toFixed = function (number, fractionDigits, clearZero, noIn) {
        if (clearZero === void 0) { clearZero = true; }
        if (noIn === void 0) { noIn = false; }
        if (number && typeof number === "string")
            number = parseFloat(number);
        if (number == undefined || isNaN(number))
            return undefined;
        if (noIn == false) {
            if (clearZero)
                return BaseComponent.clearZero(number.toFixed(fractionDigits));
            else
                return number.toFixed(fractionDigits);
        }
        else {
            var flag = 1;
            for (var i = 0; i < fractionDigits; i++) {
                flag *= 10;
            }
            var value = (parseInt((number * flag)) / flag).toFixed(fractionDigits);
            if (clearZero)
                return BaseComponent.clearZero(value);
            else
                return value;
        }
    };
    /**
    *
    * @param number
    * @param fractionDigits
    * @param clearZero
    * @param noIn 是否只舍不入
    */
    BaseComponent.prototype.toFixed = function (number, fractionDigits, clearZero, noIn) {
        if (clearZero === void 0) { clearZero = true; }
        if (noIn === void 0) { noIn = false; }
        return BaseComponent.toFixed(number, fractionDigits, clearZero, noIn);
    };
    BaseComponent.prototype.getUTCTime = function (time) {
        if (!time)
            return undefined;
        time = time.replace("T", " ").replace(/\-/g, "/"); //防止浏览器不支持-
        if (time.indexOf("+") > 0) {
            time = time.substr(0, time.indexOf("+"));
        }
        var flag = /\.[0-9]+$/.exec(time);
        if (flag && flag[0].length) {
            time = time.substr(0, time.length - flag[0].length);
        }
        var date = new Date(time);
        if (textRes.langName.indexOf("zh") >= 0) {
            date = new Date(date.getTime() + 8 * 60 * 60 * 1000);
            return date;
        }
        else {
            return date;
        }
    };
    BaseComponent.prototype.showUTCTime = function (time, isDate) {
        var str = " HH:mm";
        if (isDate) {
            str = "";
        }
        try {
            if (!time)
                return "";
            time = time.replace("T", " ").replace(/\-/g, "/"); //防止浏览器不支持-
            if (time.indexOf("+") > 0) {
                time = time.substr(0, time.indexOf("+"));
            }
            var flag = /\.[0-9]+$/.exec(time);
            if (flag && flag[0].length) {
                time = time.substr(0, time.length - flag[0].length);
            }
            var date = new Date(time);
            if (isNaN(date.getFullYear()))
                return time + "!";
            if (textRes.langName.indexOf("zh") >= 0) {
                date = new Date(date.getTime() + 8 * 60 * 60 * 1000);
                return date.Format("yyyy-MM-dd" + str);
            }
            else {
                return date.Format("dd/MM/yyyy" + str + " (UTC+0)");
            }
        }
        catch (e) {
            return e.message;
        }
    };
    BaseComponent.prototype.onNavigationPushed = function () {
        _super.prototype.onNavigationPushed.call(this);
        console.log(this.constructor.name + " pushed");
        try {
            if (this.title) {
                this._pageTitle = this.title;
            }
            else {
                for (var p in this) {
                    var pvalue = this[p];
                    if (pvalue && pvalue.$children) {
                        var vm = this[p];
                        for (var i = 0; i < vm.$children.length; i++) {
                            var child = vm.$children[i];
                            if (child.$vnode.tag.endsWith("pageheader")) {
                                this._pageTitle = child.$props.title;
                                for (var textitem in textRes.items) {
                                    if (textRes.items[textitem] == this._pageTitle) {
                                        this._pageTitle = textitem;
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }
        catch (e) {
        }
        if (window.api && this._pageTitle) {
            this.recordPageStart(this._pageTitle);
        }
    };
    /**
     * 统计行为
     * @param name
     */
    BaseComponent.prototype.recordAction = function (name) {
        if (!window.api)
            return;
        var module = window.api.require('talkingData');
        if (module) {
            console.log("recordAction:" + name);
            module.onEvent({
                eventId: name,
            });
        }
    };
    /**
     * 记录页面进入
     * @param name
     */
    BaseComponent.prototype.recordPageStart = function (name) {
        if (!window.api)
            return;
        var module = window.api.require('talkingData');
        if (module) {
            console.log("onPageStart:" + name);
            module.onPageStart({ pageName: name });
        }
    };
    /**
     * 记录页面离开
     * @param name
     */
    BaseComponent.prototype.recordPageEnd = function (name) {
        if (!window.api)
            return;
        var module = window.api.require('talkingData');
        if (module) {
            console.log("onPageEnd:" + name);
            module.onPageEnd({ pageName: name });
        }
    };
    BaseComponent.prototype.dispose = function () {
        if (window.api && this._pageTitle) {
            this.recordPageEnd(this._pageTitle);
        }
        _super.prototype.dispose.call(this);
    };
    BaseComponent.prototype.onNavigationActived = function (isResume) {
        _super.prototype.onNavigationActived.call(this, isResume);
        var module;
        if (window.api) {
            module = window.api.require('kLine');
        }
        else {
            return;
        }
        if (this.statusBarStyle == StatusBarStyle.Dark) {
            if (window.api) {
                module.setStatusBarStyle({
                    style: 'dark'
                });
            }
        }
        else if (this.statusBarStyle == StatusBarStyle.Light) {
            if (window.api) {
                module.setStatusBarStyle({
                    style: 'light'
                });
            }
        }
    };
    return BaseComponent;
}(Component));
export { BaseComponent };
//# sourceMappingURL=BaseComponent.js.map