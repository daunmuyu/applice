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
import { Login } from "./pages/RegisterLogin/Login";
import { ApiHelper } from "./ServerApis/ApiHelper";
import { NavigationEvent } from "jack-one-script";
import { ShareImageReview } from "./pages/General/ShareImageReview";
import { AlertWindow } from "./pages/General/AlertWindow";
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
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7 //padding处理  
    });
    var encryptData = encrypt.ciphertext.toString(CryptoJS.enc.Hex); //加密完成后，转换成字符串  
    var bs = [];
    for (var i = 0; i < encryptData.length; i += 2) {
        bs.push(parseInt(encryptData.substr(i, 2), 16));
    }
    return new Uint8Array(bs);
}
export function initGlobalFunc() {
    var _this = this;
    var pushedLogin = false;
    navigation.addEventListener(NavigationEvent.OnBeforePush, function (component) {
        if (component && (component.constructor === Login || navigation.queue.some(function (m) { return m.constructor === Login; }))) {
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
    window.showError = function (err, showLoginWhen401) { return __awaiter(_this, void 0, void 0, function () {
        var login;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (err && err.status && err.status == 401) {
                        console.debug(JSON.stringify(err));
                        ApiHelper.CurrentTokenInfo = null;
                        if (showLoginWhen401) {
                            if (!pushedLogin) {
                                login = new Login();
                                navigation.push(login);
                            }
                        }
                        return [2 /*return*/];
                    }
                    if (err == "http aborted")
                        return [2 /*return*/];
                    if (err && (err.status == 0 || err.msg == "timeout" || err == "timeout")) {
                        toast(textRes.items['网络异常，请稍后再试'], 3);
                        return [2 /*return*/];
                    }
                    console.debug(err);
                    if (!(typeof err === "string")) return [3 /*break*/, 2];
                    return [4 /*yield*/, alertWindow(err)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 2:
                    if (!err.msg) return [3 /*break*/, 4];
                    return [4 /*yield*/, alertWindow(err.msg)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 4:
                    if (!err.message) return [3 /*break*/, 6];
                    return [4 /*yield*/, alertWindow(err.message)];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, alertWindow(JSON.stringify(err))];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8: return [2 /*return*/];
            }
        });
    }); };
}
window.toast = function (msg, seconds) {
    if (window.api) {
        window.api.toast({
            msg: msg,
            duration: seconds * 1000,
            location: 'middle'
        });
    }
};
window.navigatorPop = function () {
    navigation.pop();
};
/**输出星期几 */
window.getWeek = function () {
    var str = "";
    var week = new Date().getDay();
    if (week == 0) {
        str = textRes.items["星期日"];
    }
    else if (week == 1) {
        str = textRes.items["星期一"];
    }
    else if (week == 2) {
        str = textRes.items["星期二"];
    }
    else if (week == 3) {
        str = textRes.items["星期三"];
    }
    else if (week == 4) {
        str = textRes.items["星期四"];
    }
    else if (week == 5) {
        str = textRes.items["星期五"];
    }
    else if (week == 6) {
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
        localStorage.setItem(key, value);
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
export function shareImageReview(base64) {
    navigation.push(new ShareImageReview(base64), false);
}
/**
 * 分享图片
 * @param base64
 */
export function shareImage(base64) {
    var _this = this;
    base64 = base64.substr(base64.indexOf("base64,") + 7);
    var trans = window.api.require('trans');
    if (isIOS) {
        trans.saveImage({
            base64Str: base64,
            imgPath: "fs://",
            imgName: "screen.png"
        }, function (ret, err) { return __awaiter(_this, void 0, void 0, function () {
            var sharedModule;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!ret.status) return [3 /*break*/, 1];
                        sharedModule = window.api.require('shareAction');
                        sharedModule.share({
                            images: ["fs://screen.png"],
                            type: 'image',
                        });
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, alertWindow(err.msg)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    }
    else {
        trans.saveImage({
            base64Str: base64,
            imgPath: "fs://",
            imgName: "screen.png"
        }, function (ret, err) { return __awaiter(_this, void 0, void 0, function () {
            var module;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!ret.status) return [3 /*break*/, 1];
                        module = window.api.require('kLine');
                        module.shareImage({
                            image: "fs://screen.png",
                            title: "",
                        });
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, alertWindow(err.msg)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    }
}
export function confirmWindow(content) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var alertWin = new AlertWindow();
                    alertWin.model.content = content;
                    alertWin.model.buttons = [
                        {
                            text: textRes.items["取消"],
                            action: function () {
                                resolve(false);
                            },
                        },
                        {
                            text: textRes.items["确定"],
                            bgColor: textRes.items["超级链接颜色"],
                            action: function () {
                                resolve(true);
                            },
                        }
                    ];
                    alertWin.element.style.position = "absolute";
                    alertWin.element.style.left = "0px";
                    alertWin.element.style.top = "0px";
                    alertWin.setParent(document.body);
                })];
        });
    });
}
export function alertWindow(content) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var alertWin = new AlertWindow();
                    alertWin.model.content = content;
                    alertWin.model.buttons = [
                        {
                            text: textRes.items["确定"],
                            bgColor: textRes.items["超级链接颜色"],
                            action: function () {
                                resolve();
                            },
                        }
                    ];
                    alertWin.element.style.position = "absolute";
                    alertWin.element.style.left = "0px";
                    alertWin.element.style.top = "0px";
                    alertWin.setParent(document.body);
                })];
        });
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
//# sourceMappingURL=GlobalFunc.js.map