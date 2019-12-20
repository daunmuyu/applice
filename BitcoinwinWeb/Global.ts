import { Navigation } from "jack-one-script";
import { Component } from "jack-one-script";
import { Home } from "./pages/Home";
import  Vue  from "vue";
import { TextRes } from "./TextRes";
import { lang_zh_CN } from "./lang_zh_CN";
import { ApiHelper } from "./ServerApis/ApiHelper";
import { lang_en_US } from "./lang_en_US";
import { HttpClient } from "jack-one-script";
import { setCache, getCache } from "./GlobalFunc";



/**
 * 设置系统当前语言
 * @param langName
 */
export function setLanguage(langName) {
    for (var i = 0; i < supportLangObjects.length; i++) {
        if (supportLangObjects[i].langName == langName) {
            (<any>window).textRes.items = supportLangObjects[i].items;
            (<any>window).textRes.langName = supportLangObjects[i].langName;
            (<any>window).textRes.langDesc = supportLangObjects[i].langDesc;
            HttpClient.defaultHeaders["Accept-Language"] = supportLangObjects[i].langName;
            setCache("Accept-Language", supportLangObjects[i].langName);

            (<any>window).textRes.getItem = function (key) {
                var value = (<any>window).textRes.items[key];
                var reg = /\{([0-9]+)\}/;
                while (true) {
                    var ret = reg.exec(value);
                    if (!ret)
                        break;
                    var index = parseInt(ret[1]);
                    var arg = arguments[index + 1];
                    if (arg == undefined)
                        arg = "";
                    value = value.replace(ret[0], arg);
                }
                return value;
            };

            break;
        }
    }
}


/**
 * 显示错误信息
 * @param err
 * @param showLoginWhen401 如果401，则跳转登录窗口
 */
export function showError(err,showLoginWhen401=true) {
    (<any>window).showError(err, showLoginWhen401);
}

export function clone(obj) {
    if (!obj)
        return obj;
    var str = JSON.stringify(obj);
    var item;
    eval("item=" + str);
    return item;
}


/**
 * 显示一段信息
 * @param msg
 * @param seconds 显示几秒
 */
var msgDiv: HTMLElement;
var msgTimer : any;
export function showInfoForSeconds(msg: string, seconds: number) {
    clearTimeout(msgTimer);
    if (!msgDiv) {
        msgDiv = document.createElement("DIV");                
        msgDiv.className = "msgbox";
        msgDiv.style.zIndex = "888";
    }
    msgDiv.style.visibility = "hidden";
    msgDiv.innerHTML = msg;
    if (!msgDiv.parentElement)
        document.body.appendChild(msgDiv);
    var rect = msgDiv.getBoundingClientRect();
    msgDiv.style.left = (window.innerWidth - rect.width) / 2 + "px";
    msgDiv.style.top = (window.innerHeight - rect.height) / 2 + "px";
    msgDiv.style.visibility = "";

    msgTimer = setTimeout(() => {
        document.body.removeChild(msgDiv);
    }, seconds * 1000);
}

