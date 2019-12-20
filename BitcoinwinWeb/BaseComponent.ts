import { Component } from "jack-one-script";
import { RealName } from "./pages/My/RealName";
import { ApiHelper, CertificationStatus } from "./ServerApis/ApiHelper";

import Vue from "vue";
export enum StatusBarStyle {
    None = 0,
    Dark = 1,
    Light = 2
}
export class BaseComponent extends Component {
    private originalStyle: StatusBarStyle;
    get statusBarStyle(): StatusBarStyle {
        return StatusBarStyle.Light;
    }

    get needLogin(): boolean {
        return true;
    }

    /**标题，主要用于统计，所以用中文即可*/
    get title(): string {
        return null;
    }

    constructor(html: string) {
        super(html);

        this.initForVerifyJPattern();
    }

    /**把v-model copy to _vmodel */
    initForVerifyJPattern() {
        var items = this.element.querySelectorAll("INPUT[jpattern]");
        items.forEach(m => {
            var jpattern = m.getAttribute("jpattern");
            var vmodel = m.getAttribute("v-model");
            if (jpattern && vmodel) {
                m.setAttribute("_vmodel", vmodel);
            }
        });
    }

    /**
     * 开启支持verifyPattern.js
     * @param vm
     */
    supportVerifyJPattern(vm) {

        var items = this.element.querySelectorAll("INPUT[jpattern]");
        items.forEach(m => {
            (<any>m)._vm = vm;
        });
    }

    getFontSize(rem, isMore = false) {
        return (<any>window).getFontSize(rem, isMore);
    }
    hidePhone(phone) {
        return (<any>window).hidePhone(phone);
    }
    getWeek() {
        return (<any>window).getWeek();
    }
    formatMoney(pa, fh = undefined) {
       
        return (<any>window).formatMoney(this.clearZero(pa), fh);
    }
    formatMoneyFixed(pa, fixed, fh = undefined) {
        if (isNaN(pa) || pa == undefined)
            return undefined;
        pa = parseFloat(pa);
        return (<any>window).formatMoney(pa.toFixed(fixed), fh);
    }
    IsDemoMode() {
        return ApiHelper.IsDemoMode;
    }
    /**
     * 清楚小数点后面没用的0
     * @param p
     */
    clearZero(p: string) {
        return BaseComponent.clearZero(p);
    }
    /**
    * 清楚小数点后面没用的0
    * @param p
    */
    static clearZero(p: string) {
        if (isNaN(<any>p))
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
    }
    /**
     * 
     * @param number
     * @param fractionDigits
     * @param clearZero
     * @param noIn 是否只舍不入
     */
    static toFixed(number: number, fractionDigits, clearZero = true, noIn = false) {
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
            var value = (parseInt(<any>(number * flag)) / flag).toFixed(fractionDigits);

            if (clearZero)
                return BaseComponent.clearZero(value);
            else
                return value;
        }
    }

    /**
    *
    * @param number
    * @param fractionDigits
    * @param clearZero
    * @param noIn 是否只舍不入
    */
    toFixed(number: number, fractionDigits, clearZero = true, noIn = false) {
        return BaseComponent.toFixed(number, fractionDigits, clearZero, noIn);
    }
    getUTCTime(time: string): Date {
        if (!time)
            return undefined;

        time = time.replace("T", " ").replace(/\-/g, "/");//防止浏览器不支持-
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
    }
    showUTCTime(time: string, isDate) {
        var str = " HH:mm";
        if (isDate) {
            str = "";
        }
        try {
            if (!time)
                return "";

            time = time.replace("T", " ").replace(/\-/g, "/");//防止浏览器不支持-
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
                return (<any>date).Format("yyyy-MM-dd" + str);
            }
            else {
                return (<any>date).Format("dd/MM/yyyy" + str+" (UTC+0)");
            }
        }
        catch (e) {
            return e.message;
        }
    }

    private _pageTitle: string;
    onNavigationPushed() {
        super.onNavigationPushed();

        console.log(this.constructor.name + " pushed");

        try {
            if (this.title) {
                this._pageTitle = this.title;
            }
            else {
                for (var p in this) {
                    var pvalue: any = <any>this[p];
                    if (pvalue && pvalue.$children) {
                        var vm: Vue = <any>this[p];
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
    }

    /**
     * 统计行为
     * @param name
     */
    recordAction(name: string) {
        if (!window.api)
            return;

        var module = window.api.require('talkingData');
        if (module) {
            console.log("recordAction:" + name);

            module.onEvent({
                eventId: name,
            });

        }
    }

    /**
     * 记录页面进入
     * @param name
     */
    recordPageStart(name: string) {
        if (!window.api)
            return;

        var module = window.api.require('talkingData');
        if (module) {
            console.log("onPageStart:" + name);
            module.onPageStart({ pageName: name });
        }
    }
    /**
     * 记录页面离开
     * @param name
     */
    recordPageEnd(name: string) {
        if (!window.api)
            return;

        var module = window.api.require('talkingData');
        if (module) {
            console.log("onPageEnd:" + name);
            module.onPageEnd({ pageName: name });
        }
    }
    dispose() {
        if (window.api && this._pageTitle) {
            this.recordPageEnd(this._pageTitle);
        }
        super.dispose();
    }

    onNavigationActived(isResume: boolean) {
        super.onNavigationActived(isResume);

        var module;
        if ((<any>window).api) {
            module = (<any>window).api.require('kLine');
        }
        else {
            return;
        }

        if (this.statusBarStyle == StatusBarStyle.Dark) {
            if ((<any>window).api) {

                module.setStatusBarStyle({
                    style: 'dark'
                });
            }
        }
        else if (this.statusBarStyle == StatusBarStyle.Light) {
            if ((<any>window).api) {

                module.setStatusBarStyle({
                    style: 'light'
                });
            }
        }
    }

    
}