import { ApiHelper } from "./ApiHelper";
import { HttpClient } from "jack-one-script";
import { md5 } from "../GlobalFunc";
var PayCenterApi = /** @class */ (function () {
    function PayCenterApi() {
    }
    /**
     * 获取汇率，如要查看1USDT=多少CNY，那么 src_currency='USDT'  target_currency='CNY'
     * @param src_currency 源币种，如 USDT
     * @param target_currency 目标币种，如 CNY
     * @param arrow 1:recharge 2:withdraw.
     * @param payChannel 1:otc 4:旺财
     * @param callback
     */
    PayCenterApi.GetPrice = function (component, src_currency, target_currency, arrow, payChannelId, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return PayCenterApi.GetPrice(component, src_currency, target_currency, arrow, payChannelId, callback); }, 1000);
            return;
        }
        var request = {
            ProductId: src_currency,
            PriceArrow: arrow,
            PayChannel: payChannelId,
            Currency: target_currency,
            Stamp: new Date().getTime(),
            AppId: ApiHelper.PayCenterAppId,
        };
        var names = Object.keys(request).sort();
        var str = "";
        names.forEach(function (name) {
            str += name.toLowerCase() + "=" + request[name] + "&";
        });
        str = str.substr(0, str.length - 1);
        var sign = md5(str + ApiHelper.OTCSecret);
        request.Sign = sign;
        console.log(request);
        HttpClient.postJson({
            data: request,
            component: component,
            url: ApiHelper.UrlAddresses.currentUrls.payCenterUrl + "/api/price/get",
            callback: function (ret, err) {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj;
                    eval("obj=" + ret);
                    if (obj.code != 200 && obj.code != 0) {
                        callback(null, obj);
                    }
                    else {
                        callback(obj.data.price, null);
                    }
                }
            },
        });
    };
    PayCenterApi.BuildUrl = function (request) {
        request.ChannelId = ApiHelper.ChannelId;
        request.AppId = ApiHelper.PayCenterAppId;
        var names = Object.keys(request).sort();
        var str = "";
        names.forEach(function (name) {
            str += name.toLowerCase() + "=" + request[name] + "&";
        });
        str = str.substr(0, str.length - 1);
        var sign = md5(str + ApiHelper.OTCSecret);
        return ApiHelper.UrlAddresses.currentUrls.payCenterUrl + "/pay/do?" + str + "&Sign=" + sign;
    };
    return PayCenterApi;
}());
export { PayCenterApi };
//# sourceMappingURL=PayCenterApi.js.map