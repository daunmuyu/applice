import { ApiHelper } from "./ApiHelper";
import { HttpClient } from "jack-one-script";
var ProductItem = /** @class */ (function () {
    function ProductItem() {
    }
    return ProductItem;
}());
export { ProductItem };
var AdsItem = /** @class */ (function () {
    function AdsItem() {
    }
    return AdsItem;
}());
export { AdsItem };
var IndexApi = /** @class */ (function () {
    function IndexApi() {
    }
    IndexApi.notices = function (component, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return IndexApi.notices(component, callback); }, 1000);
            return;
        }
        HttpClient.send({
            method: "GET",
            url: ApiHelper.UrlAddresses.currentUrls.indexUrl + "/api/index/notices",
            component: component,
            callback: function (ret, err) {
                if (err)
                    callback(null, err);
                else {
                    var obj;
                    eval("obj=" + ret);
                    callback(obj, null);
                }
            }
        });
    };
    /**
     * 产品推荐列表
     * @param component
     * @param callback
     */
    IndexApi.ProductRecommends = function (component, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return IndexApi.ProductRecommends(component, callback); }, 1000);
            return;
        }
        HttpClient.send({
            method: "GET",
            url: ApiHelper.UrlAddresses.currentUrls.indexUrl + "/api/index/productrecommends",
            component: component,
            callback: function (ret, err) {
                if (err)
                    callback(null, err);
                else {
                    var obj;
                    eval("obj=" + ret);
                    callback(obj, null);
                }
            }
        });
    };
    IndexApi.rankings = function (component, page, pagesize, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return IndexApi.rankings(component, page, pagesize, callback); }, 1000);
            return;
        }
        var dict = {
            page: page,
            pagesize: pagesize
        };
        HttpClient.send({
            data: dict,
            method: "GET",
            url: ApiHelper.UrlAddresses.currentUrls.indexUrl + "/api/index/rankings",
            component: component,
            callback: function (ret, err) {
                if (err)
                    callback(null, err);
                else {
                    eval("ret=" + ret);
                    for (var i = 1; i < ret.items.length + 1; i++) {
                        ret.items[i - 1].Number = i + (page - 1) * pagesize;
                    }
                    callback(ret.items, null);
                }
            }
        });
    };
    /**
     * 广告列表
     * @param component
     * @param AdType 1=文字,2=图片,3=专题,4=外链
     * @param page
     * @param pagesize
     * @param callback
     */
    IndexApi.ads = function (component, AdType, page, pagesize, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return IndexApi.ads(component, AdType, page, pagesize, callback); }, 1000);
            return;
        }
        var dict = {
            AdType: AdType,
            page: page,
            pagesize: pagesize
        };
        HttpClient.send({
            data: dict,
            method: "GET",
            url: ApiHelper.UrlAddresses.currentUrls.indexUrl + "/api/index/ads",
            component: component,
            callback: function (ret, err) {
                if (err)
                    callback(null, err);
                else {
                    var obj;
                    eval("obj=" + ret);
                    callback(obj.items, null);
                    //IndexApi.cacheAdsImage(obj.items, callback);
                }
            }
        });
    };
    IndexApi.cacheAdsImage = function (items, callback) {
        if (!window.api) {
            items.forEach(function (item) {
                item.cacheImgUrl = item.imageUrl;
            });
            callback(items, null);
            return;
        }
        var result = [];
        items.forEach(function (item) {
            item.status = 0;
            window.api.imageCache({
                url: item.imageUrl,
                policy: "cache_only",
            }, function (ret, err) {
                if (!err && ret.status) {
                    item.status = 1;
                    if (ApiHelper.isRunningInApiCloudLocal) {
                        item.cacheImgUrl = ret.url;
                    }
                    else {
                        item.cacheImgUrl = item.imageUrl;
                    }
                    result.push(item);
                }
                else {
                    console.log("cacheAdsImage err:" + JSON.stringify(err) + "  ret:" + JSON.stringify(ret));
                    item.status = 2;
                    item.cacheImgUrl = item.imageUrl;
                    result.push(item);
                }
                if (items.some(function (m) { return !m.status; }) == false) {
                    callback(result, null);
                }
            });
        });
    };
    return IndexApi;
}());
export { IndexApi };
//# sourceMappingURL=IndexApi.js.map