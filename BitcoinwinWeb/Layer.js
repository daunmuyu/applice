import { getCache, setCache } from "./GlobalFunc";
import { ApiHelper } from "./ServerApis/ApiHelper";
var Layer = /** @class */ (function () {
    function Layer(name) {
        var _this = this;
        this.name = name;
        if (window.api && location.href.indexOf("?" + this.name) > 0) {
            window.api.addEventListener({ name: "hidePage" }, function () {
                navigation.pop(false);
                window.api.sendFrameToBack({
                    from: _this.name
                });
                _this.isOnFront = false;
            });
        }
    }
    Object.defineProperty(Layer.prototype, "isOnFront", {
        /**是否显示在前面了*/
        get: function () {
            return getCache("hideFrameIsOnFront") === "1";
        },
        set: function (v) {
            setCache('hideFrameIsOnFront', v ? "1" : "0");
        },
        enumerable: true,
        configurable: true
    });
    Layer.prototype.load = function () {
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
            url: url + "?" + this.name + "=1",
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
    };
    Layer.prototype.pushPage = function (name, param) {
        if (param === void 0) { param = undefined; }
        var extra = {};
        if (param) {
            for (var pn in param) {
                extra[pn] = param[pn];
            }
        }
        extra.name = name;
        window.api.sendEvent({
            name: 'PushPage',
            extra: extra
        });
        window.api.bringFrameToFront({
            from: this.name
        });
        this.isOnFront = true;
    };
    /**隐藏当前页面 */
    Layer.prototype.hide = function () {
        window.api.sendEvent({ name: "hidePage" });
    };
    return Layer;
}());
export { Layer };
//# sourceMappingURL=Layer.js.map