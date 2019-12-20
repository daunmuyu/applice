import { HttpClient } from "jack-one-script";
import { ApiHelper, ServerResult } from "./ApiHelper";
import { IHttpClientUsing } from "jack-one-script";
import { encryptDes } from "../GlobalFunc";

export interface BuyInfo {
    balance: number;
    financingamount: number;
    leverage: number;
    margin: number;
    maydealpx: number;
    newpx: number;
    perrmbfee: number;
    perrmbmargin: number;
    rate: number;
    stoploss: number;
    stoplossratio: number;
    stopprofit: number;
    stopprofitlosstimes: number;
    traderate: number;
    tradestatus: number;
    updown: number;
    updownRate: number;
}

export enum WatchItemType {
    TargetPriceUp = 1,
    TargetPriceDown,
    MinutePriceUpChange,
    MinutePriceDownChange,
    Minute5PriceUpChange,
    Minute5PriceDownChange,
    Hour24PriceUpChange,
    Hour24PriceDownChange,
}

export class TradeApi {
    /**
     * 
     * @param symbol
     * @param marketsymbol
     * @param bstype 1:买涨 2:买跌
     * @param callback
     */
    static GetBuyPage(component: IHttpClientUsing, symbol: string, marketsymbol: string, bstype: number, callback: (ret: BuyInfo, err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => TradeApi.GetBuyPage(component,symbol, marketsymbol, bstype, callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }

        var dict: any = {};
        dict.symbol = symbol;
        dict.marketsymbol = marketsymbol;
        dict.bstype = bstype;
        dict.currencytype = "USD";

        var http = HttpClient.postJson({
            data: dict,
            header: {
                Authorization: `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            component: component,
            url: `${ApiHelper.UrlAddresses.currentUrls.tradeUrl}/api/Order/GetBuyPage`,
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
     * 是否可以进行模拟交易
     * @param callback 返回剩余天数，如果是null，无法再模拟
     */
    static IsSimulate(component: IHttpClientUsing, callback: (ret: string, err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => TradeApi.IsSimulate(component,callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }
        
        console.debug("IsSimulate excuting...");
        HttpClient.send({
            method:"GET",
            header: {
                "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            component: component,
            url: `${ApiHelper.UrlAddresses.demoApiUrls.tradeUrl}/api/Order/IsSimulate`,
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
     * 
     * @param component
     * @param ordertype 1:限价 2：市价
     * @param symbol
     * @param price
     * @param bstype
     * @param quantity
     * @param stopProfit
     * @param stopLoss
     * @param callback
     */
    static PostOrder(component: IHttpClientUsing, clientX, clientY,  ordertype, symbol, price, bstype, quantity, stopProfit, stopLoss, callback: (ret: string, err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => TradeApi.PostOrder(component, clientX, clientY, ordertype, symbol, price, bstype, quantity, stopProfit, stopLoss, callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }

        if (stopProfit && typeof stopProfit == "string")
            stopProfit = stopProfit.trim();
        if (stopLoss && typeof stopLoss == "string")
            stopLoss = stopLoss.trim();

        var devcieModel = JSON.stringify({
            deviceModel: window.api.deviceModel,
            systemVersion: window.api.systemVersion,
            clientX,
            clientY,
            connectionType: window.api.connectionType,
        });
        
        var dict: any = {
            latitude: ApiHelper.latitude,
            longitude: ApiHelper.longitude,
            devcieModel,
            deviceId: window.api.deviceId,
            deviceType: isIOS ? 1: 2,
        };

        dict.channelId = ApiHelper.ChannelId;
        dict.ordertype = ordertype;
        dict.symbol = symbol;
        dict.price = price;
        dict.bstype = bstype;
        dict.quantity = quantity;
        if (stopProfit && stopProfit)
            dict.stopProfit = stopProfit;
        if (stopLoss && stopLoss)
            dict.stopLoss = stopLoss;
        dict.stoplosstimes = 1;


        var data = encryptDes(JSON.stringify(dict), ApiHelper.EncryptKey);

        var http = HttpClient.postJson({
            data: data,
            sendInBlob:true,
            header: {
                Authorization: `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            component: component,
            url: `${ApiHelper.UrlAddresses.currentUrls.tradeUrl}/api/Order/PostOrder`,
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

    static GetTradeHomeList(component: IHttpClientUsing, callback: (ret, err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => TradeApi.GetTradeHomeList(component, callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }

        var dict: any = {};
        dict.channelId = ApiHelper.ChannelId;
        

        var http = HttpClient.postJson({
            data: dict,
            header: {
                Authorization: `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            component: component,
            url: `${ApiHelper.UrlAddresses.currentUrls.tradeUrl}/api/Trade/GetTradeHomeList`,
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

    static PostSetProfitStopLoss(component: IHttpClientUsing, posid, stopprofit,  stoploss ,callback: (ret, err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => TradeApi.PostSetProfitStopLoss(component, posid, stopprofit,  stoploss , callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }

        var dict: any = {};
        dict.channelId = ApiHelper.ChannelId;
        if (stopprofit)
            dict.stopprofit = stopprofit;
        if (stoploss)
            dict.stoploss = stoploss;
        dict.posid = posid;

        var http = HttpClient.postJson({
            data: dict,
            header: {
                Authorization: `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            component: component,
            url: `${ApiHelper.UrlAddresses.currentUrls.tradeUrl}/api/Trade/PostSetProfitStopLoss`,
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
     * 获取交易记录
     * @param component
     * @param page
     * @param pagesize
     * @param callback
     */
    static GetTradeDetailList(component: IHttpClientUsing,  page,  pagesize,opType, callback: (ret, err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => TradeApi.GetTradeDetailList(component, page, pagesize, opType, callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }

        var dict: any = {};
        dict.channelId = ApiHelper.ChannelId;
        dict.page = page;
        dict.pagesize = pagesize;
        dict.opType = opType;

        console.log(JSON.stringify(dict));
        var http = HttpClient.postJson({
            data: dict,
            header: {
                Authorization: `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            component: component,
            url: `${ApiHelper.UrlAddresses.currentUrls.tradeUrl}/api/Trade/GetTradeDetailList`,
            callback: (ret, err) => {
                if (err)
                    callback(null, err);
                else {
                    console.log(ret);

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
     * 平仓
     * @param component
     * @param posid
     * @param ordertype
     * @param callback
     */
    static PostClosepostion(component: IHttpClientUsing, clientX, clientY, orderno, ordertype, callback: (ret, err) => void) {

        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }

        var devcieModel = JSON.stringify({
            deviceModel: window.api.deviceModel,
            systemVersion: window.api.systemVersion,
            clientX, clientY,
            connectionType: window.api.connectionType,
        });

        var dict: any = {
            latitude: ApiHelper.latitude,
            longitude: ApiHelper.longitude,
            devcieModel,
            deviceId: window.api.deviceId,
            deviceType: isIOS ? 1 : 2,
        };

        dict.channelId = ApiHelper.ChannelId;
        dict.orderno = orderno;
        dict.ordertype = ordertype;


        var data = encryptDes(JSON.stringify(dict), ApiHelper.EncryptKey);

        var http = HttpClient.postJson({
            data: data,
            sendInBlob:true,
            header: {
                Authorization: `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            component: component,
            url: `${ApiHelper.UrlAddresses.currentUrls.tradeUrl}/api/Order/PostClosepostion`,
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
    * 获取订单状态
    * @param component
    * @param OrderNo
    */
    static IsDeal(component: IHttpClientUsing, OrderNo): Promise<number> {

        if (!ApiHelper.CurrentTokenInfo) {
            throw { status: 401 };
        }

        return new Promise((resolve, reject) => {

            var dict: any = {
                OrderNo: OrderNo
            };

            var http = HttpClient.send({
                data: dict,
                method:"GET",
                header: {
                    Authorization: `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
                },
                component: component,
                url: `${ApiHelper.UrlAddresses.currentUrls.tradeUrl}/api/Trade/IsDeal`,
                callback: (ret, err) => {
                    if (err)
                        reject(err);
                    else {
                        var obj: ServerResult;
                        eval("obj=" + ret);
                        if (obj.code != 200) {
                            reject(obj);
                        }
                        else {
                            resolve(obj.data);
                        }
                    }
                }
            });

        });

        
    }

    /**
     * 查询一键平仓状态   返回还剩多少个没有平仓
     * @param component
     */
    static checkAllCloseOrderStatus(component: IHttpClientUsing): Promise<number> {

        if (!ApiHelper.CurrentTokenInfo) {
            throw { status: 401 };
        }

        return new Promise((resolve, reject) => {

            var dict: any = {
                OrderStatus: 3,
                OpenCloseType:2,
            };

            var http = HttpClient.send({
                data: dict,
                method: "GET",
                header: {
                    Authorization: `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
                },
                component: component,
                url: `${ApiHelper.UrlAddresses.currentUrls.tradeUrl}/api/Trade/IsAllDeal`,
                callback: (ret, err) => {
                    if (err)
                        reject(err);
                    else {
                        var obj: ServerResult;
                        eval("obj=" + ret);
                        if (obj.code != 200) {
                            reject(obj);
                        }
                        else {
                           
                            resolve(obj.data);
                        }
                    }
                }
            });

        });


    }


    static checkAllCancelOrderStatus(component: IHttpClientUsing): Promise<number> {

        if (!ApiHelper.CurrentTokenInfo) {
            throw { status: 401 };
        }

        return new Promise((resolve, reject) => {

            var dict: any = {
                OrderStatus: 4,
                OpenCloseType: 3,
            };

            var http = HttpClient.send({
                data: dict,
                method: "GET",
                header: {
                    Authorization: `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
                },
                component: component,
                url: `${ApiHelper.UrlAddresses.currentUrls.tradeUrl}/api/Trade/IsAllDeal`,
                callback: (ret, err) => {
                    if (err)
                        reject(err);
                    else {
                        var obj: ServerResult;
                        eval("obj=" + ret);
                        if (obj.code != 200) {
                            reject(obj);
                        }
                        else {

                            resolve(obj.data);
                        }
                    }
                }
            });

        });


    }

    /**
     * 一键平仓
     * @param component
     * @param callback
     */
    static OnekeyClosePostion(component: IHttpClientUsing, clientX, clientY, callback: (ret, err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => TradeApi.OnekeyClosePostion(component, clientX, clientY, callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }

        var devcieModel = JSON.stringify({
            deviceModel: window.api.deviceModel,
            systemVersion: window.api.systemVersion,
            clientX, clientY,
            connectionType: window.api.connectionType,
        });

        var dict: any = {
            latitude: ApiHelper.latitude,
            longitude: ApiHelper.longitude,
            devcieModel,
            deviceId: window.api.deviceId,
            deviceType: isIOS ? 1 : 2,
        };
        dict.channelId = ApiHelper.ChannelId;

        var http = HttpClient.postJson({
            data: dict,
            header: {
                Authorization: `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            component: component,
            url: `${ApiHelper.UrlAddresses.currentUrls.tradeUrl}/api/Order/OnekeyClosePostion`,
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
     * 获取委托列表
     * @param component
     * @param page
     * @param pagesize
     * @param callback
     */
    static GetEntrustOrderList(component: IHttpClientUsing, page, pagesize, callback: (ret, err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => TradeApi.GetEntrustOrderList(component,page, pagesize, callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }

        var dict: any = {};
        dict.channelId = ApiHelper.ChannelId;
        dict.page = page;
        dict.pagesize = pagesize;

        var http = HttpClient.postJson({
            data: dict,
            header: {
                Authorization: `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            component: component,
            url: `${ApiHelper.UrlAddresses.currentUrls.tradeUrl}/api/Trade/GetEntrustOrderList`,
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


    
    static GetCancelOrderList(component: IHttpClientUsing, page, pagesize, callback: (ret, err) => void) {
    if (!ApiHelper.UrlAddressReady) {
        setTimeout(() => TradeApi.GetCancelOrderList(component, page, pagesize, callback), 1000);
        return;
    }
    if (!ApiHelper.CurrentTokenInfo) {
        callback(null, { status: 401 });
        return;
    }

    var dict: any = {};
    dict.channelId = ApiHelper.ChannelId;
    dict.page = page;
    dict.pagesize = pagesize;

    var http = HttpClient.postJson({
        data: dict,
        header: {
            Authorization: `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
        },
        component: component,
        url: `${ApiHelper.UrlAddresses.currentUrls.tradeUrl}/api/Trade/GetCancelOrderList`,
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
     * 取消委托单
     * @param component
     * @param orderNo 单号
     * @param callback
     */
    static CancelOrder(component: IHttpClientUsing, clientX, clientY,orderNo, callback: (ret, err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => TradeApi.CancelOrder(component, clientX, clientY, orderNo, callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }

        var devcieModel = JSON.stringify({
            deviceModel: window.api.deviceModel,
            systemVersion: window.api.systemVersion,
            clientX, clientY,
            connectionType: window.api.connectionType,
        });

        var dict: any = {
            latitude: ApiHelper.latitude,
            longitude: ApiHelper.longitude,
            devcieModel,
            deviceId: window.api.deviceId,
            deviceType: isIOS ? 1 : 2,
        };

        dict.channelId = ApiHelper.ChannelId;
        dict.orderNo = orderNo;

        var http = HttpClient.postJson({
            data: dict,
            header: {
                Authorization: `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            component: component,
            url: `${ApiHelper.UrlAddresses.currentUrls.tradeUrl}/api/Order/CancelOrder`,
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
     * 取消所有委托单
     * @param component
     * @param callback
     */
    static OnekeyCancelOrder(component: IHttpClientUsing, clientX, clientY,callback: (ret, err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => TradeApi.OnekeyCancelOrder(component, clientX, clientY, callback), 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }

        var devcieModel = JSON.stringify({
            deviceModel: window.api.deviceModel,
            systemVersion: window.api.systemVersion,
            clientX, clientY,
            connectionType: window.api.connectionType,
        });

        var dict: any = {
            latitude: ApiHelper.latitude,
            longitude: ApiHelper.longitude,
            devcieModel,
            deviceId: window.api.deviceId,
            deviceType: isIOS ? 1 : 2,
        };
        dict.channelId = ApiHelper.ChannelId;

        var http = HttpClient.postJson({
            data: dict,
            header: {
                Authorization: `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
            },
            component: component,
            url: `${ApiHelper.UrlAddresses.currentUrls.tradeUrl}/api/Order/OnekeyCancelOrder`,
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
    * 追加保证金
    * @param component
    * @param posid
    * @param margin
    */
    static async AppendMargin(component: IHttpClientUsing, posId, margin): Promise<any> {

        if (!ApiHelper.UrlAddressReady) {
            return new Promise((resolve, reject) => {
                setTimeout(async () => {
                    try {
                        var ret = await TradeApi.AppendMargin(component, posId, margin);
                        resolve(ret);
                    }
                    catch (e) {
                        reject(e);
                    }
                }, 1000);
            });
        }
        if (!ApiHelper.CurrentTokenInfo) {
            throw { status: 401 };
        }

        return new Promise(async (resolve, reject) => {
            try {
                var dict = {
                    posId, margin
                };

                var url = `${ApiHelper.UrlAddresses.currentUrls.tradeUrl}/api/Trade/AppendMargin`;

                console.log("/api/Trade/AppendMargin : " + JSON.stringify(dict));
                var ret = await HttpClient.postJsonAsync({
                    data: dict,
                    component: component,
                    url: url,
                    header: {
                        "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
                    },
                });
                console.log(ret);
                var obj: ServerResult;
                eval("obj=" + ret);
                if (obj.code != 200) {
                    reject(obj);
                }
                else {
                    resolve(obj.data);
                }
            }
            catch (e) {
                reject(e);
            }
        });
    }

    /**
   * 减少保证金
   * @param component
   * @param posid
   * @param margin
   */
    static async ReduceMargin(component: IHttpClientUsing, posId, margin): Promise<any> {

        if (!ApiHelper.UrlAddressReady) {
            return new Promise((resolve, reject) => {
                setTimeout(async () => {
                    try {
                        var ret = await TradeApi.ReduceMargin(component, posId, margin);
                        resolve(ret);
                    }
                    catch (e) {
                        reject(e);
                    }
                }, 1000);
            });
        }
        if (!ApiHelper.CurrentTokenInfo) {
            throw { status: 401 };
        }

        return new Promise(async (resolve, reject) => {
            try {
                var dict = {
                    posId, margin
                };

                var url = `${ApiHelper.UrlAddresses.currentUrls.tradeUrl}/api/Trade/ReduceMargin`;

                var ret = await HttpClient.postJsonAsync({
                    data: dict,
                    component: component,
                    url: url,
                    header: {
                        "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
                    },
                });

                var obj: ServerResult;
                eval("obj=" + ret);
                if (obj.code != 200) {
                    reject(obj);
                }
                else {
                    resolve(obj.data);
                }
            }
            catch (e) {
                reject(e);
            }
        });
    }


    /**
     * 增加/修改盯盘
     * @param component
     * @param id empty is insert , with value is modify
     * @param symbol
     * @param subItems
     * @param notifyFrequency 0:每次,1:一天一次
     * @param notifyType
     */
    static async UpsertMarketWatch(component: IHttpClientUsing, id , symbol, subItems, notifyFrequency, notifyType = 0): Promise<any> {

        if (!ApiHelper.CurrentTokenInfo) {
            throw { status: 401 };
        }

        return new Promise(async (resolve, reject) => {
            try {
                var dict = {
                    id , symbol, subItems, notifyFrequency, notifyType
                };

                console.log(JSON.stringify(dict));
                var url = `${ApiHelper.UrlAddresses.currentUrls.tradeUrl}/api/MarketWatch/Upsert`;

                var ret = await HttpClient.postJsonAsync({
                    data: dict,
                    component: component,
                    url: url,
                    header: {
                        "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
                    },
                });

                var obj: ServerResult;
                eval("obj=" + ret);
                if (obj.code != 200) {
                    reject(obj);
                }
                else {
                    resolve(obj.data);
                }
            }
            catch (e) {
                reject(e);
            }
        });
    }

    /**
    * 获取盯盘列表
    * @param component
    * @param symbol
    * @param subItems
    * @param notifyFrequency 0:每次,1:一天一次
    * @param notifyType
    */
    static async GetMarketWatchList(component: IHttpClientUsing): Promise<any[]> {

        if (!ApiHelper.CurrentTokenInfo) {
            throw { status: 401 };
        }

        return new Promise(async (resolve, reject) => {
            try {
                var dict = {
                    
                };

                

                var url = `${ApiHelper.UrlAddresses.currentUrls.tradeUrl}/api/MarketWatch/Get`;

                var ret = await HttpClient.postJsonAsync({
                    data: dict,
                    component: component,
                    url: url,
                    header: {
                        "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
                    },
                });

                var obj: ServerResult;
                eval("obj=" + ret);
                if (obj.code != 200) {
                    reject(obj);
                }
                else {
                    if (!obj.data)
                        obj.data = [];
                    console.log(JSON.stringify(obj.data));
                    resolve(obj.data);
                }
            }
            catch (e) {
                reject(e);
            }
        });
    }


    /**
     * 删除盯盘
     * @param component
     * @param id
     */
    static async RemoveMarketWatch(component: IHttpClientUsing, id): Promise<void> {

        if (!ApiHelper.CurrentTokenInfo) {
            throw { status: 401 };
        }

        return new Promise(async (resolve, reject) => {
            try {
                var dict = {
                    id
                };

                var url = `${ApiHelper.UrlAddresses.currentUrls.tradeUrl}/api/MarketWatch/Remove`;

                var ret = await HttpClient.postJsonAsync({
                    data: dict,
                    component: component,
                    url: url,
                    header: {
                        "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
                    },
                });

                var obj: ServerResult;
                eval("obj=" + ret);
                if (obj.code != 200) {
                    reject(obj);
                }
                else {
                    resolve();
                }
            }
            catch (e) {
                reject(e);
            }
        });
    }

    /**
     * 设置盯盘选项
     * @param component
     * @param id
     * @param subItemType
     * @param value
     * @param enable
     */
    static async SetSubWatchItem(component: IHttpClientUsing, id, subItemType, value, enable): Promise<void> {

        if (!ApiHelper.CurrentTokenInfo) {
            throw { status: 401 };
        }

        return new Promise(async (resolve, reject) => {
            try {
                var dict = {
                    id, subItemType, value, enable
                };

                var url = `${ApiHelper.UrlAddresses.currentUrls.tradeUrl}/api/MarketWatch/SetSubWatchItem`;

                var ret = await HttpClient.postJsonAsync({
                    data: dict,
                    component: component,
                    url: url,
                    header: {
                        "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
                    },
                });

                var obj: ServerResult;
                eval("obj=" + ret);
                if (obj.code != 200) {
                    reject(obj);
                }
                else {
                    resolve();
                }
            }
            catch (e) {
                reject(e);
            }
        });
    }

    /**
    * 设置盯盘的通知类型
    * @param component
    * @param id
    * @param subItemType
    * @param value
    * @param enable
    */
    static async SetWatchNotifyType(component: IHttpClientUsing, id, notifyType): Promise<void> {

        if (!ApiHelper.CurrentTokenInfo) {
            throw { status: 401 };
        }

        return new Promise(async (resolve, reject) => {
            try {
                var dict = {
                    id, notifyType
                };

                var url = `${ApiHelper.UrlAddresses.currentUrls.tradeUrl}/api/MarketWatch/SetNotifyType`;

                var ret = await HttpClient.postJsonAsync({
                    data: dict,
                    component: component,
                    url: url,
                    header: {
                        "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
                    },
                });

                var obj: ServerResult;
                eval("obj=" + ret);
                if (obj.code != 200) {
                    reject(obj);
                }
                else {
                    resolve();
                }
            }
            catch (e) {
                reject(e);
            }
        });
    }

    /**
    * 设置盯盘的通知频率
    * @param component
    * @param id
    * @param subItemType
    * @param value
    * @param enable
    */
    static async SetWatchNotifyFrequency(component: IHttpClientUsing, id, notifyFrequency): Promise<void> {

        if (!ApiHelper.CurrentTokenInfo) {
            throw { status: 401 };
        }

        return new Promise(async (resolve, reject) => {
            try {
                var dict = {
                    id, notifyFrequency
                };

                var url = `${ApiHelper.UrlAddresses.currentUrls.tradeUrl}/api/MarketWatch/SetNotifyFrequency`;

                var ret = await HttpClient.postJsonAsync({
                    data: dict,
                    component: component,
                    url: url,
                    header: {
                        "Authorization": `Bearer ${ApiHelper.CurrentTokenInfo.access_token}`
                    },
                });

                var obj: ServerResult;
                eval("obj=" + ret);
                if (obj.code != 200) {
                    reject(obj);
                }
                else {
                    resolve();
                }
            }
            catch (e) {
                reject(e);
            }
        });
    }
}