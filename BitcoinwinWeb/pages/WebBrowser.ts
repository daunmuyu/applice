import { BaseComponent, StatusBarStyle } from "../BaseComponent";
import { Component } from "jack-one-script";
import Vue from "vue";

var html = require("./webBrowser.html");

export interface WebBrowserParameter {
    src: string;
    title?: string;
    /**是否全屏 */
    fullScreen?: boolean;
    backButtonColor?: string;
    /**网页端，调用parent.postMessage({
            jsAction:"your action name"
        }, "*");方法的响应函数 */
    jsAction?: (action: string, arg: any) => void;
    /**页面加载完毕后，是否调用IsReady方法，页面必须处理window.onmessage事件 */
    invokeIsReadyOnLoad?: boolean;
    /**允许缓存 */
    useCache?: boolean;
    /**标题栏显示底色 */
    withbg?: boolean;
    statusBarColor?: StatusBarStyle;
    /**使用openFrame去打开网页*/
    useOpenFrame?: boolean,
}

export class WebBrowser extends BaseComponent {
    vm: Vue;
    model: WebBrowserParameter = <any>{
        src: "",
        title: "",
        isIOS:false,
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

    get title(): string {
        return this.model.title;
    }

    get needLogin() {
        return false;
    }
    get statusBarStyle() {
        if (this.model.statusBarColor != StatusBarStyle.None)
            return this.model.statusBarColor;
        return this.model.fullScreen ? StatusBarStyle.Dark : StatusBarStyle.Light;
    }
    constructor(pa: WebBrowserParameter) {
        super(html);

        var safeAreaTop = "0px";
        if (window.api) {
            safeAreaTop = window.api.safeArea.top + "px";
        }
        (<any>this.model).safeAreaTop = safeAreaTop;

        for (var p in pa) {
            if (pa[p] !== undefined) {
                this.model[p] = pa[p];
            }
        }

        (<any>this.model).isIOS = isIOS;
        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model
        });


    }

    private _onmesssage: any;
    onNavigationPushed() {
        super.onNavigationPushed();
        setTimeout(() => {
            var frame = <HTMLIFrameElement>this.element.getElementsByTagName("IFRAME")[0];
            frame.addEventListener("load", () => {
                (<any>this.model).isBusy = false;

                if (this.model.invokeIsReadyOnLoad && (<any>frame.contentWindow).postMessage) {
                    (<any>frame.contentWindow).postMessage("IsReady()", "*");
                }

                this._onmesssage = (e: MessageEvent) => {
                    if (this.model.jsAction && e.data.jsAction) {
                        this.model.jsAction(e.data.jsAction, e.data);
                    }
                }

                window.addEventListener("message", this._onmesssage);
            });

            var url = this.model.src;
            if (this.model.useCache == false) {
                if (url.indexOf("?") > 0)
                    url += "&" + new Date().getTime();
                else
                    url += "?" + new Date().getTime();
            }


            if (this.model.useOpenFrame) {
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
                            height:5
                        },
                    });
                }
            }
            else {
                (<any>this.model).trueSrc = url;
            }

        }, 100);

    }

    onBeforeNavigationPoped() {
        super.onBeforeNavigationPoped();
        if (this.model.useOpenFrame) {
            window.api.closeFrame({
                name: 'webbrowser_0'
            });
        }
    }

    onNavigationPoped() {
        super.onNavigationPoped();
        if (this._onmesssage)
            window.removeEventListener("message", this._onmesssage);
    }

}