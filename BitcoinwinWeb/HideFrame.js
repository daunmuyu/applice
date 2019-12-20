import { setLanguage } from "./Global";
import { Order } from "./pages/CommodityDetail/Order";
import { ApiHelper } from "./ServerApis/ApiHelper";
import { CommoditySelector } from "./pages/CommodityDetail/CommoditySelector";
import { Order_L } from "./pages/CommodityDetail/Order_L";
import { MessageCenter, MessageType } from "./MessageCenter";
import { getCache } from "./GlobalFunc";
import { Main } from "./Main";
import { HttpClient } from "jack-one-script";
var HideFrame = /** @class */ (function () {
    function HideFrame() {
    }
    HideFrame.start = function () {
        navigation.setParent(document.body);
        //注册页面的名称
        HideFrame.registerPages["Order"] = Order;
        HideFrame.registerPages["Order_L"] = Order_L;
        HideFrame.registerPages["CommoditySelector"] = CommoditySelector;
        HideFrame.lookupPushPage();
        HideFrame.registerBackButton();
        HideFrame.lookupLogin();
        HideFrame.lookupDemoMode();
    };
    HideFrame.lookupPushPage = function () {
        window.api.addEventListener({
            name: 'PushPage'
        }, function (ret, err) {
            try {
                var param = ret.value;
                if (textRes.langName != getCache("Accept-Language")) {
                    setLanguage(getCache("Accept-Language"));
                }
                var classname = HideFrame.registerPages[param.name];
                var page = new classname(param);
                navigation.push(page, false);
            }
            catch (e) {
                alert(e.message);
                Main.layer.hide();
            }
        });
    };
    HideFrame.lookupDemoMode = function () {
        window.api.addEventListener({
            name: 'DemoIn'
        }, function (ret, err) {
            if (ret.value.mode == true) {
                HttpClient.defaultHeaders["IsDemo"] = "1";
                ApiHelper.UrlAddresses.currentUrls = ApiHelper.UrlAddresses.demoApiUrls;
            }
            else {
                delete HttpClient.defaultHeaders.IsDemo;
                ApiHelper.UrlAddresses.currentUrls = ApiHelper.UrlAddresses.apiUrls;
            }
        });
    };
    HideFrame.lookupLogin = function () {
        if (window.api) {
            window.api.addEventListener({
                name: 'Logined'
            }, function (ret, err) {
                var tokenStr = ret.value.tokenStr;
                if (tokenStr) {
                    eval("tokenStr=" + tokenStr);
                    ApiHelper.CurrentTokenInfo = tokenStr;
                }
                //同一个frame，addEventListener只能有一个，不能多个同时监听Logined
                MessageCenter.raise(MessageType.Logined, null);
            });
        }
        //先同步用户token
        var token = getCache("CurrentTokenInfo");
        if (token) {
            eval("token=" + token);
            ApiHelper.CurrentTokenInfo = token;
            console.debug("同步登陆信息到hideFrame");
        }
    };
    /**处理后退按钮事件 */
    HideFrame.registerBackButton = function () {
        if (window.api) {
            window.api.addEventListener({
                name: 'onBackKeyPressed'
            }, function (ret, err) {
                //只有hideFrame在前面，才处理
                if (Main.layer.isOnFront) {
                    if (navigation.queue.length > 1) {
                        navigation.pop(false);
                    }
                    else {
                        Main.layer.hide();
                    }
                }
            });
        }
    };
    HideFrame.registerPages = {};
    return HideFrame;
}());
export { HideFrame };
//# sourceMappingURL=HideFrame.js.map