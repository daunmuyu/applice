import { Login } from "./pages/RegisterLogin/Login";

import { ApiHelper } from "./ServerApis/ApiHelper";
import { NavigationEvent } from "jack-one-script";
import { ShareImageReview } from "./pages/General/ShareImageReview";
import { AlertWindow } from "./pages/General/AlertWindow";
import { resolve } from "url";
import { rejects } from "assert";

var CryptoJS = require("crypto-js");
// 加载des算法
require("crypto-js/tripledes");
var cryptoMd5 = require("crypto-js/md5");

export function md5(content) {
    return cryptoMd5(content).toString();
}
export function encryptDes(message, key) {
    var base64 = CryptoJS.enc.Utf8.parse(key);

    var encrypt = CryptoJS.TripleDES.encrypt(message, base64, {
        //iv: CryptoJS.enc.Utf8.parse('01234567'),//iv偏移量  
        //mode: CryptoJS.mode.CBC,  //CBC模式  
        mode: CryptoJS.mode.ECB,  //ECB模式  
        padding: CryptoJS.pad.Pkcs7//padding处理  
    }
    );
 
    var encryptData = encrypt.ciphertext.toString(CryptoJS.enc.Hex); //加密完成后，转换成字符串  

    var bs = [];
    for (var i = 0; i < encryptData.length; i += 2) {
        bs.push(parseInt(encryptData.substr(i, 2), 16));
    }
    return new Uint8Array(bs);
}

export function initGlobalFunc() {
    var pushedLogin = false;
    navigation.addEventListener(NavigationEvent.OnBeforePush, (component) => {
        if (component && ((<any>component).constructor === Login || navigation.queue.some(m => (<any>m).constructor === Login))) {
            pushedLogin = true;
        }
        else {
            //if (component)
            //    console.debug((<any>component).constructor + ".OnBeforePush set pushedLogin=false");
            //else
            //    console.debug("null.OnBeforePush set pushedLogin=false");
            pushedLogin = false;
        }
    });

    (<any>window).showError = async (err, showLoginWhen401)=> {
        if (err && err.status && err.status == 401) {            
            console.debug(JSON.stringify(err));
            ApiHelper.CurrentTokenInfo = null;

            if (showLoginWhen401) {
                if (!pushedLogin) {
                    var login = new Login();
                    navigation.push(login);
                }
            }
            return;
        }
        if (err == "http aborted")
            return;
        if (err && (err.status == 0 || err.msg == "timeout" || err == "timeout")) {
            toast(textRes.items['网络异常，请稍后再试'] , 3 );
            return;
        }

        console.debug(err);
        if (typeof err === "string")
           await alertWindow(err);
        else if (err.msg)
            await alertWindow(err.msg);
        else if (err.message)
            await alertWindow(err.message);
        else
            await alertWindow(JSON.stringify(err));
    }
}

(<any>window).toast = function (msg, seconds) {
    if (window.api) {
        window.api.toast({
            msg: msg,
            duration: seconds * 1000,
            location: 'middle'
        });
    }
};

(<any>window).navigatorPop = function () {
    navigation.pop();
};

/**输出星期几 */
(<any>window).getWeek = function () {
    var str = "";
    var week = new Date().getDay();
    if (week == 0) {
        str = textRes.items["星期日"];
    } else if (week == 1) {
        str = textRes.items["星期一"];
    } else if (week == 2) {
        str = textRes.items["星期二"];
    } else if (week == 3) {
        str = textRes.items["星期三"];
    } else if (week == 4) {
        str = textRes.items["星期四"];
    } else if (week == 5) {
        str = textRes.items["星期五"];
    } else if (week == 6) {
        str = textRes.items["星期六"];
    }
    return str;
};

export function setCache(key, value) {
    if (window.api) {
        window.api.setPrefs({
            key: key,
            value: value
        });
    }
    else {
        localStorage.setItem(key,value);
    }
}
export function getCache(key) {
    if (window.api) {
        return window.api.getPrefs({
            sync: true,
            key: key
        });
    }
    else {
        return localStorage.getItem(key);
    }
}
export function removeCache(key) {
    if (window.api) {
        window.api.removePrefs({
            key: key
        });
    }
    else {
        localStorage.removeItem(key);
    }
}


export function shareImageReview(base64: string) {
    navigation.push(new ShareImageReview(base64) ,false);
}

/**
 * 分享图片
 * @param base64
 */
export function shareImage(base64: string) {
    base64 = base64.substr(base64.indexOf("base64,") + 7);
    var trans = window.api.require('trans');
    if (isIOS) {
        trans.saveImage({
            base64Str: base64,
            imgPath: "fs://",
            imgName: "screen.png"
        }, async (ret, err)=> {

            if (ret.status) {
                var sharedModule = window.api.require('shareAction');
                sharedModule.share({
                    images: ["fs://screen.png"],
                    type: 'image',
                });

            } else {
                await alertWindow(err.msg);
            }
        });
    }
    else {
        trans.saveImage({
            base64Str: base64,
            imgPath: "fs://",
            imgName: "screen.png"
        },  async (ret, err)=> {

            if (ret.status) {
                var module = window.api.require('kLine');
                module.shareImage({
                    image: "fs://screen.png",
                    title: "",
                });

            } else {
                await alertWindow(err.msg);
            }
        });

    }
}


export async function confirmWindow(content: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        var alertWin = new AlertWindow();
        alertWin.model.content = content;
        alertWin.model.buttons = [
            {
                text: textRes.items["取消"],
                action: () => {
                    resolve(false);
                },
            },
            {
                text: textRes.items["确定"],
                bgColor: textRes.items["超级链接颜色"],
                action: () => {
                    resolve(true);
                },
            }
        ];
        alertWin.element.style.position = "absolute";
        alertWin.element.style.left = "0px";
        alertWin.element.style.top = "0px";
        alertWin.setParent(document.body);
    });
}

export async function alertWindow(content: string): Promise<void> {
    return new Promise((resolve, reject) => {
        var alertWin = new AlertWindow();
        alertWin.model.content = content;
        alertWin.model.buttons = [
            {
                text: textRes.items["确定"],
                bgColor: textRes.items["超级链接颜色"],
                action: () => {
                    resolve();
                },
            }
        ];
        alertWin.element.style.position = "absolute";
        alertWin.element.style.left = "0px";
        alertWin.element.style.top = "0px";
        alertWin.setParent(document.body);
        
    });
}

//export function svgToImage(svgEle: HTMLElement, bgSrc: string , callback:(content:string)=>void) {

//    var rect = svgEle.getBoundingClientRect();
//    var canvas = document.createElement('canvas');  //准备空画布
//    canvas.style.width = rect.width + "px";
//    canvas.style.height = rect.height + "px";
//    canvas.width = rect.width ;
//    canvas.height = rect.height;

//    if (bgSrc) {
//        var image = new Image();
//        image.src = bgSrc;
//        image.onload = () => {
//            var ctx = canvas.getContext("2d");
//            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
//            //canvg(canvas, svgEle.outerHTML);
//            callback(canvas.toDataURL("image/png"));
//        };
//    }
//    else {
//        canvg(canvas, svgEle.outerHTML);
//        callback(canvas.toDataURL("image/png"));
//    }
//}