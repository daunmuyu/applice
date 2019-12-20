import { HttpClient } from "jack-one-script";
import { setCache } from "./GlobalFunc";
/**
 * 设置系统当前语言
 * @param langName
 */
export function setLanguage(langName) {
    for (var i = 0; i < supportLangObjects.length; i++) {
        if (supportLangObjects[i].langName == langName) {
            window.textRes.items = supportLangObjects[i].items;
            window.textRes.langName = supportLangObjects[i].langName;
            window.textRes.langDesc = supportLangObjects[i].langDesc;
            HttpClient.defaultHeaders["Accept-Language"] = supportLangObjects[i].langName;
            setCache("Accept-Language", supportLangObjects[i].langName);
            window.textRes.getItem = function (key) {
                var value = window.textRes.items[key];
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
export function showError(err, showLoginWhen401) {
    if (showLoginWhen401 === void 0) { showLoginWhen401 = true; }
    window.showError(err, showLoginWhen401);
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
var msgDiv;
var msgTimer;
export function showInfoForSeconds(msg, seconds) {
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
    msgTimer = setTimeout(function () {
        document.body.removeChild(msgDiv);
    }, seconds * 1000);
}
//# sourceMappingURL=Global.js.map