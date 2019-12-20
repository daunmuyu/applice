import { ApiHelper } from "./ApiHelper";
import { HttpClient } from "jack-one-script";
var MarketApi = /** @class */ (function () {
    function MarketApi() {
    }
    MarketApi.GetCommodityType = function (component, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return MarketApi.GetCommodityType(component, callback); }, 1000);
            return;
        }
        HttpClient.send({
            method: "GET",
            component: component,
            url: ApiHelper.UrlAddresses.currentUrls.marketUrl + "/api/Symbol/GetCommodityType",
            callback: function (ret, err) {
                if (err)
                    callback(null, err);
                else {
                    var obj;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        callback(obj.data, null);
                    }
                }
            }
        });
    };
    MarketApi.GetDescriptions = function (component, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return MarketApi.GetDescriptions(component, callback); }, 1000);
            return;
        }
        HttpClient.postJson({
            data: {
                channelId: ApiHelper.ChannelId
            },
            component: component,
            url: ApiHelper.UrlAddresses.currentUrls.marketUrl + "/api/Symbol/GetDescription",
            callback: function (ret, err) {
                if (err)
                    callback(null, err);
                else {
                    var obj;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        callback(obj.data.symbolInfos, null);
                    }
                }
            }
        });
    };
    MarketApi.GetPrice = function (component, commodityType, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return MarketApi.GetPrice(component, commodityType, callback); }, 1000);
            return;
        }
        var dict = {};
        if (commodityType > 0)
            dict.commoditytype = commodityType;
        dict.channelId = ApiHelper.ChannelId;
        HttpClient.postJson({
            data: dict,
            component: component,
            url: ApiHelper.UrlAddresses.currentUrls.marketUrl + "/api/Symbol/GetPrice",
            callback: function (ret, err) {
                if (err)
                    callback(null, err);
                else {
                    var obj;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        callback(obj.data, null);
                    }
                }
            }
        });
    };
    /**
     * 获取k线数据
     * @param pricetype 0:bidprice 1:offerprice
     * @param marketsymbol
     * @param starttime 如果为0，表示从最新时间取多少条，如果有值，表示从这个时间往最新时间取值
     * @param count
     * @param interval
     * @param callback
     */
    MarketApi.GetHistory = function (component, pricetype, marketsymbol, starttime, count, interval, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return MarketApi.GetHistory(component, pricetype, marketsymbol, starttime, count, interval, callback); }, 1000);
            return;
        }
        console.log(ApiHelper.UrlAddresses.currentUrls.marketUrl + "/api/KLine/GetHistory?marketsymbol=" + marketsymbol + "&pricetype=" + pricetype + "&symbol=" + marketsymbol + "|10&starttime=" + starttime + "&count=" + count + "&vol=1&interval=" + interval);
        HttpClient.send({
            method: "GET",
            component: component,
            url: ApiHelper.UrlAddresses.currentUrls.marketUrl + "/api/KLine/GetHistory?marketsymbol=" + marketsymbol + "&pricetype=" + pricetype + "&symbol=" + marketsymbol + "|10&starttime=" + starttime + "&count=" + count + "&vol=1&interval=" + interval,
            callback: function (ret, err) {
                if (err)
                    callback(null, err);
                else {
                    var obj;
                    eval("obj=" + ret);
                    if (obj.code != 200) {
                        callback(null, obj);
                    }
                    else {
                        if (!obj.data)
                            obj.data = [];
                        if (starttime > 0) {
                            obj.data = obj.data.reverse();
                        }
                        if (interval.indexOf("d") >= 0) {
                            for (var i = 0; i < obj.data.length; i++) {
                                obj.data[i].times += 8 * 60 * 60 * 1000;
                            }
                        }
                        callback(obj.data, null);
                    }
                }
            }
        });
    };
    return MarketApi;
}());
export { MarketApi };
//# sourceMappingURL=MarketApi.js.map