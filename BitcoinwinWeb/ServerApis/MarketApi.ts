import { ApiHelper, ServerResult, CommodityType, Description } from "./ApiHelper";
import { HttpClient } from "jack-one-script";
import { IHttpClientUsing } from "jack-one-script";

export interface MarketPrice {
    bidPrice: number;
    offerPrice: number;
    preClose: number;
    status: number;
    symbol: string;
    tradestatus: number;
    volume: number;
}

export interface PriceHistory {
    close: number;
    high: number;
    low: number;
    open: number;
    times: number;
    val: number;
    vol: number;
}

export class MarketApi {
    static GetCommodityType(component: IHttpClientUsing, callback: (ret: CommodityType[], err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => MarketApi.GetCommodityType(component, callback), 1000);
            return;
        }

        HttpClient.send({
            method: "GET",
            component: component,
            url: `${ApiHelper.UrlAddresses.currentUrls.marketUrl}/api/Symbol/GetCommodityType`,
            callback: (ret, err) => {
                if (err)
                    callback(null, err);
                else {
                    var obj: ServerResult;
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
    }

    static GetDescriptions(component: IHttpClientUsing, callback: (ret: Description[], err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => MarketApi.GetDescriptions(component, callback), 1000);
            return;
        }

        HttpClient.postJson({
            data: {
                channelId: ApiHelper.ChannelId
            },
            component: component,
            url: `${ApiHelper.UrlAddresses.currentUrls.marketUrl}/api/Symbol/GetDescription`,
            callback: (ret, err) => {
                if (err)
                    callback(null, err);
                else {
                    var obj: ServerResult;
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
    }

    static GetPrice(component: IHttpClientUsing, commodityType: number, callback: (ret: MarketPrice[], err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => MarketApi.GetPrice(component, commodityType, callback), 1000);
            return;
        }

        var dict : any = {};
        if (commodityType > 0)
            dict.commoditytype = commodityType;
        dict.channelId = ApiHelper.ChannelId;

        HttpClient.postJson({
            data: dict,
            component: component,
            url: `${ApiHelper.UrlAddresses.currentUrls.marketUrl}/api/Symbol/GetPrice`,
            callback: (ret, err) => {
                if (err)
                    callback(null, err);
                else {
                    var obj: ServerResult;
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
    }

    /**
     * 获取k线数据
     * @param pricetype 0:bidprice 1:offerprice
     * @param marketsymbol
     * @param starttime 如果为0，表示从最新时间取多少条，如果有值，表示从这个时间往最新时间取值
     * @param count
     * @param interval
     * @param callback 
     */
    static GetHistory(component: IHttpClientUsing, pricetype:number, marketsymbol: string,starttime:number, count: number, interval: string, callback: (ret: PriceHistory[], err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => MarketApi.GetHistory(component, pricetype ,marketsymbol, starttime, count, interval, callback), 1000);
            return;
        }
        console.log(`${ApiHelper.UrlAddresses.currentUrls.marketUrl}/api/KLine/GetHistory?marketsymbol=${marketsymbol}&pricetype=${pricetype}&symbol=${marketsymbol}|10&starttime=${starttime}&count=${count}&vol=1&interval=${interval}`);
        HttpClient.send({
            method: "GET",
            component: component,
            url: `${ApiHelper.UrlAddresses.currentUrls.marketUrl}/api/KLine/GetHistory?marketsymbol=${marketsymbol}&pricetype=${pricetype}&symbol=${marketsymbol}|10&starttime=${starttime}&count=${count}&vol=1&interval=${interval}`,
            callback: (ret, err) => {
                if (err)
                    callback(null, err);
                else {
                    var obj: ServerResult;
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
    }
}