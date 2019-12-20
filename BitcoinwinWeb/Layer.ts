import { getCache, setCache } from "./GlobalFunc";
import { ApiHelper } from "./ServerApis/ApiHelper";

export class Layer {
    name: string;
    /**是否显示在前面了*/
    get isOnFront(): boolean {
        return getCache("hideFrameIsOnFront") === "1";
    }
    set isOnFront(v: boolean) {
        setCache('hideFrameIsOnFront',v?"1" : "0");
    }
    constructor(name: string) {
        this.name = name;
        this.isOnFront = false;

        if (window.api && location.href.indexOf("?" + this.name) > 0) {
            window.api.addEventListener({ name: "hidePage" }, () => {
                navigation.pop(false);
                window.api.sendFrameToBack({
                    from: this.name
                });
                this.isOnFront = false;
            });
        }
    }

    load(): void {

        if (!window.api)
            return;

        var url = "main.html";
        if (window.api.pageParam.folder) {
            url = "fs://" + ApiHelper.webFolder + "/" + window.api.pageParam.folder + "/main.html";
        }
        else {
            alert(JSON.stringify(window.api.pageParam));
        }

        window.api.openFrame({
            name: this.name,
            url: `${url}?${this.name}=1`,
            pageParam: window.api.pageParam,
            rect: {
                x: 0,
                y: 0,
                w: "auto",
                h: "auto"
            },
            allowEdit: true,
            bounces: false,
            useWKWebView: true,
            //customRefreshHeader: 'UIPullRefreshMotive',
            bgColor: 'rgba(0,0,0,0)',
            vScrollBarEnabled: false,
            hScrollBarEnabled: false,
        });
        window.api.sendFrameToBack({
            from: this.name
        });

    }

    pushPage(name: string, param = undefined) {
        var extra : any = {};
        if (param) {
            for (var pn in param) {
                extra[pn] = param[pn];
            }
        }
        extra.name = name;

        (<any>window).api.sendEvent({
            name: 'PushPage',
            extra: extra
        });
        (<any>window).api.bringFrameToFront({
            from: this.name
        });
        this.isOnFront = true;
    }

    /**隐藏当前页面 */
    hide() {
        window.api.sendEvent({ name: "hidePage" });
    }
    
}