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
import { BaseComponent, StatusBarStyle } from "../BaseComponent";
import Vue from "vue";
var html = require("./webBrowser.html");
var WebBrowser = /** @class */ (function (_super) {
    __extends(WebBrowser, _super);
    function WebBrowser(pa) {
        var _this = _super.call(this, html) || this;
        _this.model = {
            src: "",
            title: "",
            isIOS: false,
            fullScreen: true,
            backButtonColor: "#fff",
            trueSrc: "",
            isBusy: true,
            /**使用openFrame去打开网页*/
            useOpenFrame: false,
            invokeIsReadyOnLoad: false,
            useCache: false,
            withbg: true,
            statusBarColor: StatusBarStyle.None
        };
        var safeAreaTop = "0px";
        if (window.api) {
            safeAreaTop = window.api.safeArea.top + "px";
        }
        _this.model.safeAreaTop = safeAreaTop;
        for (var p in pa) {
            if (pa[p] !== undefined) {
                _this.model[p] = pa[p];
            }
        }
        _this.model.isIOS = isIOS;
        _this.vm = new Vue({
            el: _this.getViewModelElement(),
            data: _this.model
        });
        return _this;
    }
    Object.defineProperty(WebBrowser.prototype, "title", {
        get: function () {
            return this.model.title;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebBrowser.prototype, "needLogin", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebBrowser.prototype, "statusBarStyle", {
        get: function () {
            if (this.model.statusBarColor != StatusBarStyle.None)
                return this.model.statusBarColor;
            return this.model.fullScreen ? StatusBarStyle.Dark : StatusBarStyle.Light;
        },
        enumerable: true,
        configurable: true
    });
    WebBrowser.prototype.onNavigationPushed = function () {
        var _this = this;
        _super.prototype.onNavigationPushed.call(this);
        setTimeout(function () {
            var frame = _this.element.getElementsByTagName("IFRAME")[0];
            frame.addEventListener("load", function () {
                _this.model.isBusy = false;
                if (_this.model.invokeIsReadyOnLoad && frame.contentWindow.postMessage) {
                    frame.contentWindow.postMessage("IsReady()", "*");
                }
                _this._onmesssage = function (e) {
                    if (_this.model.jsAction && e.data.jsAction) {
                        _this.model.jsAction(e.data.jsAction, e.data);
                    }
                };
                window.addEventListener("message", _this._onmesssage);
            });
            var url = _this.model.src;
            if (_this.model.useCache == false) {
                if (url.indexOf("?") > 0)
                    url += "&" + new Date().getTime();
                else
                    url += "?" + new Date().getTime();
            }
            if (_this.model.useOpenFrame) {
                var rect = frame.getBoundingClientRect();
                if (window.api) {
                    window.api.openFrame({
                        name: 'webbrowser_0',
                        url: url,
                        rect: {
                            x: rect.left,
                            y: rect.top,
                            w: rect.width,
                            h: rect.height
                        },
                        allowEdit: true,
                        bounces: false,
                        useWKWebView: true,
                        //customRefreshHeader: 'UIPullRefreshMotive',
                        bgColor: 'rgba(0,0,0,0)',
                        vScrollBarEnabled: true,
                        hScrollBarEnabled: true,
                        progress: {
                            type: "page",
                            height: 5
                        },
                    });
                }
            }
            else {
                _this.model.trueSrc = url;
            }
        }, 100);
    };
    WebBrowser.prototype.onBeforeNavigationPoped = function () {
        _super.prototype.onBeforeNavigationPoped.call(this);
        if (this.model.useOpenFrame) {
            window.api.closeFrame({
                name: 'webbrowser_0'
            });
        }
    };
    WebBrowser.prototype.onNavigationPoped = function () {
        _super.prototype.onNavigationPoped.call(this);
        if (this._onmesssage)
            window.removeEventListener("message", this._onmesssage);
    };
    return WebBrowser;
}(BaseComponent));
export { WebBrowser };
//# sourceMappingURL=WebBrowser.js.map