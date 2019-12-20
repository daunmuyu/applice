import { ApiHelper, ServerResult } from "./ApiHelper";
import { HttpClient } from "jack-one-script";
import { IHttpClientUsing } from "jack-one-script";

export class ProductItem {
    symbol: string;
    marketSymbol: string;
    name: string;
    leverage: number;
}

export class AdsItem {
    title: string;
    adType: number;
    imageUrl: string;
    linkUrl: string;
    linkTarget: number;
    updateTime: string;

    /**0:正在加载图片 1：加载成功 2：加载失败 */
    status: number;
    cacheImgUrl: string;
}

export class IndexApi {
    static notices(component: IHttpClientUsing, callback: (ret: any[], err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => IndexApi.notices(component,callback), 1000);
            return;
        }

        HttpClient.send({
            method:"GET",
            url: `${ApiHelper.UrlAddresses.currentUrls.indexUrl}/api/index/notices`,
            component: component,
            callback: (ret, err) => {
                if (err)
                    callback(null, err);
                else {
                    var obj: any[];
                    eval("obj=" + ret);
                    callback(obj, null);
                }
            }
        });
    }

    /**
     * 产品推荐列表
     * @param component
     * @param callback
     */
    static ProductRecommends(component: IHttpClientUsing, callback: (ret: ProductItem[], err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => IndexApi.ProductRecommends(component, callback), 1000);
            return;
        }

        HttpClient.send({
            method: "GET",
            url: `${ApiHelper.UrlAddresses.currentUrls.indexUrl}/api/index/productrecommends`,
            component: component,
            callback: (ret, err) => {
                if (err)
                    callback(null, err);
                else {
                    var obj: ProductItem[];
                    eval("obj=" + ret);
                    callback(obj, null);
                }
            }
        });
    }

    
    static rankings(component: IHttpClientUsing,  page, pagesize, callback: (ret: any[], err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => IndexApi.rankings(component,  page, pagesize, callback), 1000);
            return;
        }

        var dict = {
            page: page,
            pagesize: pagesize
        };

        HttpClient.send({
            data: dict,
            method: "GET",
            url: `${ApiHelper.UrlAddresses.currentUrls.indexUrl}/api/index/rankings`,
            component: component,
            callback: (ret, err) => {
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
    }

    /**
     * 广告列表
     * @param component
     * @param AdType 1=文字,2=图片,3=专题,4=外链
     * @param page
     * @param pagesize
     * @param callback
     */
    static ads(component: IHttpClientUsing, AdType, page, pagesize, callback: (ret: AdsItem[], err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => IndexApi.ads(component,AdType, page, pagesize, callback), 1000);
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
            url: `${ApiHelper.UrlAddresses.currentUrls.indexUrl}/api/index/ads`,
            component: component,
            callback: (ret, err) => {
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
    }

    static cacheAdsImage(items: AdsItem[], callback: (ret: AdsItem[], err) => void) {
        if (!(<any>window).api) {
            items.forEach((item) => {
                item.cacheImgUrl = item.imageUrl;
            });
            callback(items, null);
            return;
        }
        var result : AdsItem[] = [];
        items.forEach((item) => {
            item.status = 0;

            (<any>window).api.imageCache({
                url: item.imageUrl,
                policy: "cache_only",//只从缓存中读取
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

                if (items.some(m => !m.status) == false) {
                    callback(result, null);
                }
            });
        });
    }
}