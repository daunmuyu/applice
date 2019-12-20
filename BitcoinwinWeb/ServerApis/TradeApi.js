var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { HttpClient } from "jack-one-script";
import { ApiHelper } from "./ApiHelper";
import { encryptDes } from "../GlobalFunc";
export var WatchItemType;
(function (WatchItemType) {
    WatchItemType[WatchItemType["TargetPriceUp"] = 1] = "TargetPriceUp";
    WatchItemType[WatchItemType["TargetPriceDown"] = 2] = "TargetPriceDown";
    WatchItemType[WatchItemType["MinutePriceUpChange"] = 3] = "MinutePriceUpChange";
    WatchItemType[WatchItemType["MinutePriceDownChange"] = 4] = "MinutePriceDownChange";
    WatchItemType[WatchItemType["Minute5PriceUpChange"] = 5] = "Minute5PriceUpChange";
    WatchItemType[WatchItemType["Minute5PriceDownChange"] = 6] = "Minute5PriceDownChange";
    WatchItemType[WatchItemType["Hour24PriceUpChange"] = 7] = "Hour24PriceUpChange";
    WatchItemType[WatchItemType["Hour24PriceDownChange"] = 8] = "Hour24PriceDownChange";
})(WatchItemType || (WatchItemType = {}));
var TradeApi = /** @class */ (function () {
    function TradeApi() {
    }
    /**
     *
     * @param symbol
     * @param marketsymbol
     * @param bstype 1:买涨 2:买跌
     * @param callback
     */
    TradeApi.GetBuyPage = function (component, symbol, marketsymbol, bstype, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return TradeApi.GetBuyPage(component, symbol, marketsymbol, bstype, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }
        var dict = {};
        dict.symbol = symbol;
        dict.marketsymbol = marketsymbol;
        dict.bstype = bstype;
        dict.currencytype = "USD";
        var http = HttpClient.postJson({
            data: dict,
            header: {
                Authorization: "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            component: component,
            url: ApiHelper.UrlAddresses.currentUrls.tradeUrl + "/api/Order/GetBuyPage",
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
     * 是否可以进行模拟交易
     * @param callback 返回剩余天数，如果是null，无法再模拟
     */
    TradeApi.IsSimulate = function (component, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return TradeApi.IsSimulate(component, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }
        console.debug("IsSimulate excuting...");
        HttpClient.send({
            method: "GET",
            header: {
                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            component: component,
            url: ApiHelper.UrlAddresses.demoApiUrls.tradeUrl + "/api/Order/IsSimulate",
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
    TradeApi.PostOrder = function (component, clientX, clientY, ordertype, symbol, price, bstype, quantity, stopProfit, stopLoss, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return TradeApi.PostOrder(component, clientX, clientY, ordertype, symbol, price, bstype, quantity, stopProfit, stopLoss, callback); }, 1000);
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
            clientX: clientX,
            clientY: clientY,
            connectionType: window.api.connectionType,
        });
        var dict = {
            latitude: ApiHelper.latitude,
            longitude: ApiHelper.longitude,
            devcieModel: devcieModel,
            deviceId: window.api.deviceId,
            deviceType: isIOS ? 1 : 2,
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
            sendInBlob: true,
            header: {
                Authorization: "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            component: component,
            url: ApiHelper.UrlAddresses.currentUrls.tradeUrl + "/api/Order/PostOrder",
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
    TradeApi.GetTradeHomeList = function (component, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return TradeApi.GetTradeHomeList(component, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }
        var dict = {};
        dict.channelId = ApiHelper.ChannelId;
        var http = HttpClient.postJson({
            data: dict,
            header: {
                Authorization: "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            component: component,
            url: ApiHelper.UrlAddresses.currentUrls.tradeUrl + "/api/Trade/GetTradeHomeList",
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
    TradeApi.PostSetProfitStopLoss = function (component, posid, stopprofit, stoploss, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return TradeApi.PostSetProfitStopLoss(component, posid, stopprofit, stoploss, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }
        var dict = {};
        dict.channelId = ApiHelper.ChannelId;
        if (stopprofit)
            dict.stopprofit = stopprofit;
        if (stoploss)
            dict.stoploss = stoploss;
        dict.posid = posid;
        var http = HttpClient.postJson({
            data: dict,
            header: {
                Authorization: "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            component: component,
            url: ApiHelper.UrlAddresses.currentUrls.tradeUrl + "/api/Trade/PostSetProfitStopLoss",
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
     * 获取交易记录
     * @param component
     * @param page
     * @param pagesize
     * @param callback
     */
    TradeApi.GetTradeDetailList = function (component, page, pagesize, opType, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return TradeApi.GetTradeDetailList(component, page, pagesize, opType, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }
        var dict = {};
        dict.channelId = ApiHelper.ChannelId;
        dict.page = page;
        dict.pagesize = pagesize;
        dict.opType = opType;
        console.log(JSON.stringify(dict));
        var http = HttpClient.postJson({
            data: dict,
            header: {
                Authorization: "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            component: component,
            url: ApiHelper.UrlAddresses.currentUrls.tradeUrl + "/api/Trade/GetTradeDetailList",
            callback: function (ret, err) {
                if (err)
                    callback(null, err);
                else {
                    console.log(ret);
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
     * 平仓
     * @param component
     * @param posid
     * @param ordertype
     * @param callback
     */
    TradeApi.PostClosepostion = function (component, clientX, clientY, posid, ordertype, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return TradeApi.PostClosepostion(component, clientX, clientY, posid, ordertype, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }
        var devcieModel = JSON.stringify({
            deviceModel: window.api.deviceModel,
            systemVersion: window.api.systemVersion,
            clientX: clientX, clientY: clientY,
            connectionType: window.api.connectionType,
        });
        var dict = {
            latitude: ApiHelper.latitude,
            longitude: ApiHelper.longitude,
            devcieModel: devcieModel,
            deviceId: window.api.deviceId,
            deviceType: isIOS ? 1 : 2,
        };
        dict.channelId = ApiHelper.ChannelId;
        dict.posid = posid;
        dict.ordertype = ordertype;
        var data = encryptDes(JSON.stringify(dict), ApiHelper.EncryptKey);
        var http = HttpClient.postJson({
            data: data,
            sendInBlob: true,
            header: {
                Authorization: "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            component: component,
            url: ApiHelper.UrlAddresses.currentUrls.tradeUrl + "/api/Order/PostClosepostion",
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
     * 获取订单状态
     * @param component
     * @param OrderNo
     */
    TradeApi.IsDeal = function (component, OrderNo) {
        if (!ApiHelper.CurrentTokenInfo) {
            throw { status: 401 };
        }
        return new Promise(function (resolve, reject) {
            var dict = {
                OrderNo: OrderNo
            };
            var http = HttpClient.send({
                data: dict,
                method: "GET",
                header: {
                    Authorization: "Bearer " + ApiHelper.CurrentTokenInfo.access_token
                },
                component: component,
                url: ApiHelper.UrlAddresses.currentUrls.tradeUrl + "/api/Trade/IsDeal",
                callback: function (ret, err) {
                    if (err)
                        reject(err);
                    else {
                        var obj;
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
    };
    /**
     * 查询一键平仓状态   返回还剩多少个没有平仓
     * @param component
     */
    TradeApi.checkAllCloseOrderStatus = function (component) {
        if (!ApiHelper.CurrentTokenInfo) {
            throw { status: 401 };
        }
        return new Promise(function (resolve, reject) {
            var dict = {
                OrderStatus: 3,
                OpenCloseType: 2,
            };
            var http = HttpClient.send({
                data: dict,
                method: "GET",
                header: {
                    Authorization: "Bearer " + ApiHelper.CurrentTokenInfo.access_token
                },
                component: component,
                url: ApiHelper.UrlAddresses.currentUrls.tradeUrl + "/api/Trade/IsAllDeal",
                callback: function (ret, err) {
                    if (err)
                        reject(err);
                    else {
                        var obj;
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
    };
    TradeApi.checkAllCancelOrderStatus = function (component) {
        if (!ApiHelper.CurrentTokenInfo) {
            throw { status: 401 };
        }
        return new Promise(function (resolve, reject) {
            var dict = {
                OrderStatus: 4,
                OpenCloseType: 3,
            };
            var http = HttpClient.send({
                data: dict,
                method: "GET",
                header: {
                    Authorization: "Bearer " + ApiHelper.CurrentTokenInfo.access_token
                },
                component: component,
                url: ApiHelper.UrlAddresses.currentUrls.tradeUrl + "/api/Trade/IsAllDeal",
                callback: function (ret, err) {
                    if (err)
                        reject(err);
                    else {
                        var obj;
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
    };
    /**
     * 一键平仓
     * @param component
     * @param callback
     */
    TradeApi.OnekeyClosePostion = function (component, clientX, clientY, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return TradeApi.OnekeyClosePostion(component, clientX, clientY, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }
        var devcieModel = JSON.stringify({
            deviceModel: window.api.deviceModel,
            systemVersion: window.api.systemVersion,
            clientX: clientX, clientY: clientY,
            connectionType: window.api.connectionType,
        });
        var dict = {
            latitude: ApiHelper.latitude,
            longitude: ApiHelper.longitude,
            devcieModel: devcieModel,
            deviceId: window.api.deviceId,
            deviceType: isIOS ? 1 : 2,
        };
        dict.channelId = ApiHelper.ChannelId;
        var http = HttpClient.postJson({
            data: dict,
            header: {
                Authorization: "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            component: component,
            url: ApiHelper.UrlAddresses.currentUrls.tradeUrl + "/api/Order/OnekeyClosePostion",
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
     * 获取委托列表
     * @param component
     * @param page
     * @param pagesize
     * @param callback
     */
    TradeApi.GetEntrustOrderList = function (component, page, pagesize, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return TradeApi.GetEntrustOrderList(component, page, pagesize, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }
        var dict = {};
        dict.channelId = ApiHelper.ChannelId;
        dict.page = page;
        dict.pagesize = pagesize;
        var http = HttpClient.postJson({
            data: dict,
            header: {
                Authorization: "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            component: component,
            url: ApiHelper.UrlAddresses.currentUrls.tradeUrl + "/api/Trade/GetEntrustOrderList",
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
    TradeApi.GetCancelOrderList = function (component, page, pagesize, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return TradeApi.GetCancelOrderList(component, page, pagesize, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }
        var dict = {};
        dict.channelId = ApiHelper.ChannelId;
        dict.page = page;
        dict.pagesize = pagesize;
        var http = HttpClient.postJson({
            data: dict,
            header: {
                Authorization: "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            component: component,
            url: ApiHelper.UrlAddresses.currentUrls.tradeUrl + "/api/Trade/GetCancelOrderList",
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
     * 取消委托单
     * @param component
     * @param orderNo 单号
     * @param callback
     */
    TradeApi.CancelOrder = function (component, clientX, clientY, orderNo, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return TradeApi.CancelOrder(component, clientX, clientY, orderNo, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }
        var devcieModel = JSON.stringify({
            deviceModel: window.api.deviceModel,
            systemVersion: window.api.systemVersion,
            clientX: clientX, clientY: clientY,
            connectionType: window.api.connectionType,
        });
        var dict = {
            latitude: ApiHelper.latitude,
            longitude: ApiHelper.longitude,
            devcieModel: devcieModel,
            deviceId: window.api.deviceId,
            deviceType: isIOS ? 1 : 2,
        };
        dict.channelId = ApiHelper.ChannelId;
        dict.orderNo = orderNo;
        var http = HttpClient.postJson({
            data: dict,
            header: {
                Authorization: "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            component: component,
            url: ApiHelper.UrlAddresses.currentUrls.tradeUrl + "/api/Order/CancelOrder",
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
     * 取消所有委托单
     * @param component
     * @param callback
     */
    TradeApi.OnekeyCancelOrder = function (component, clientX, clientY, callback) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(function () { return TradeApi.OnekeyCancelOrder(component, clientX, clientY, callback); }, 1000);
            return;
        }
        if (!ApiHelper.CurrentTokenInfo) {
            callback(null, { status: 401 });
            return;
        }
        var devcieModel = JSON.stringify({
            deviceModel: window.api.deviceModel,
            systemVersion: window.api.systemVersion,
            clientX: clientX, clientY: clientY,
            connectionType: window.api.connectionType,
        });
        var dict = {
            latitude: ApiHelper.latitude,
            longitude: ApiHelper.longitude,
            devcieModel: devcieModel,
            deviceId: window.api.deviceId,
            deviceType: isIOS ? 1 : 2,
        };
        dict.channelId = ApiHelper.ChannelId;
        var http = HttpClient.postJson({
            data: dict,
            header: {
                Authorization: "Bearer " + ApiHelper.CurrentTokenInfo.access_token
            },
            component: component,
            url: ApiHelper.UrlAddresses.currentUrls.tradeUrl + "/api/Order/OnekeyCancelOrder",
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
     * 追加保证金
     * @param component
     * @param posid
     * @param margin
     */
    TradeApi.AppendMargin = function (component, posId, margin) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!ApiHelper.UrlAddressReady) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                var ret, e_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, TradeApi.AppendMargin(component, posId, margin)];
                                        case 1:
                                            ret = _a.sent();
                                            resolve(ret);
                                            return [3 /*break*/, 3];
                                        case 2:
                                            e_1 = _a.sent();
                                            reject(e_1);
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }, 1000);
                        })];
                }
                if (!ApiHelper.CurrentTokenInfo) {
                    throw { status: 401 };
                }
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var dict, url, ret, obj, e_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    dict = {
                                        posId: posId, margin: margin
                                    };
                                    url = ApiHelper.UrlAddresses.currentUrls.tradeUrl + "/api/Trade/AppendMargin";
                                    console.log("/api/Trade/AppendMargin : " + JSON.stringify(dict));
                                    return [4 /*yield*/, HttpClient.postJsonAsync({
                                            data: dict,
                                            component: component,
                                            url: url,
                                            header: {
                                                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
                                            },
                                        })];
                                case 1:
                                    ret = _a.sent();
                                    console.log(ret);
                                    eval("obj=" + ret);
                                    if (obj.code != 200) {
                                        reject(obj);
                                    }
                                    else {
                                        resolve(obj.data);
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_2 = _a.sent();
                                    reject(e_2);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
   * 减少保证金
   * @param component
   * @param posid
   * @param margin
   */
    TradeApi.ReduceMargin = function (component, posId, margin) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!ApiHelper.UrlAddressReady) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                var ret, e_3;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, TradeApi.ReduceMargin(component, posId, margin)];
                                        case 1:
                                            ret = _a.sent();
                                            resolve(ret);
                                            return [3 /*break*/, 3];
                                        case 2:
                                            e_3 = _a.sent();
                                            reject(e_3);
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }, 1000);
                        })];
                }
                if (!ApiHelper.CurrentTokenInfo) {
                    throw { status: 401 };
                }
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var dict, url, ret, obj, e_4;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    dict = {
                                        posId: posId, margin: margin
                                    };
                                    url = ApiHelper.UrlAddresses.currentUrls.tradeUrl + "/api/Trade/ReduceMargin";
                                    return [4 /*yield*/, HttpClient.postJsonAsync({
                                            data: dict,
                                            component: component,
                                            url: url,
                                            header: {
                                                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
                                            },
                                        })];
                                case 1:
                                    ret = _a.sent();
                                    eval("obj=" + ret);
                                    if (obj.code != 200) {
                                        reject(obj);
                                    }
                                    else {
                                        resolve(obj.data);
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_4 = _a.sent();
                                    reject(e_4);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * 增加/修改盯盘
     * @param component
     * @param id empty is insert , with value is modify
     * @param symbol
     * @param subItems
     * @param notifyFrequency 0:每次,1:一天一次
     * @param notifyType
     */
    TradeApi.UpsertMarketWatch = function (component, id, symbol, subItems, notifyFrequency, notifyType) {
        if (notifyType === void 0) { notifyType = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!ApiHelper.CurrentTokenInfo) {
                    throw { status: 401 };
                }
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var dict, url, ret, obj, e_5;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    dict = {
                                        id: id, symbol: symbol, subItems: subItems, notifyFrequency: notifyFrequency, notifyType: notifyType
                                    };
                                    console.log(JSON.stringify(dict));
                                    url = ApiHelper.UrlAddresses.currentUrls.tradeUrl + "/api/MarketWatch/Upsert";
                                    return [4 /*yield*/, HttpClient.postJsonAsync({
                                            data: dict,
                                            component: component,
                                            url: url,
                                            header: {
                                                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
                                            },
                                        })];
                                case 1:
                                    ret = _a.sent();
                                    eval("obj=" + ret);
                                    if (obj.code != 200) {
                                        reject(obj);
                                    }
                                    else {
                                        resolve(obj.data);
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_5 = _a.sent();
                                    reject(e_5);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
    * 获取盯盘列表
    * @param component
    * @param symbol
    * @param subItems
    * @param notifyFrequency 0:每次,1:一天一次
    * @param notifyType
    */
    TradeApi.GetMarketWatchList = function (component) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!ApiHelper.CurrentTokenInfo) {
                    throw { status: 401 };
                }
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var dict, url, ret, obj, e_6;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    dict = {};
                                    url = ApiHelper.UrlAddresses.currentUrls.tradeUrl + "/api/MarketWatch/Get";
                                    return [4 /*yield*/, HttpClient.postJsonAsync({
                                            data: dict,
                                            component: component,
                                            url: url,
                                            header: {
                                                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
                                            },
                                        })];
                                case 1:
                                    ret = _a.sent();
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
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_6 = _a.sent();
                                    reject(e_6);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * 删除盯盘
     * @param component
     * @param id
     */
    TradeApi.RemoveMarketWatch = function (component, id) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!ApiHelper.CurrentTokenInfo) {
                    throw { status: 401 };
                }
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var dict, url, ret, obj, e_7;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    dict = {
                                        id: id
                                    };
                                    url = ApiHelper.UrlAddresses.currentUrls.tradeUrl + "/api/MarketWatch/Remove";
                                    return [4 /*yield*/, HttpClient.postJsonAsync({
                                            data: dict,
                                            component: component,
                                            url: url,
                                            header: {
                                                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
                                            },
                                        })];
                                case 1:
                                    ret = _a.sent();
                                    eval("obj=" + ret);
                                    if (obj.code != 200) {
                                        reject(obj);
                                    }
                                    else {
                                        resolve();
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_7 = _a.sent();
                                    reject(e_7);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * 设置盯盘选项
     * @param component
     * @param id
     * @param subItemType
     * @param value
     * @param enable
     */
    TradeApi.SetSubWatchItem = function (component, id, subItemType, value, enable) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!ApiHelper.CurrentTokenInfo) {
                    throw { status: 401 };
                }
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var dict, url, ret, obj, e_8;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    dict = {
                                        id: id, subItemType: subItemType, value: value, enable: enable
                                    };
                                    url = ApiHelper.UrlAddresses.currentUrls.tradeUrl + "/api/MarketWatch/SetSubWatchItem";
                                    return [4 /*yield*/, HttpClient.postJsonAsync({
                                            data: dict,
                                            component: component,
                                            url: url,
                                            header: {
                                                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
                                            },
                                        })];
                                case 1:
                                    ret = _a.sent();
                                    eval("obj=" + ret);
                                    if (obj.code != 200) {
                                        reject(obj);
                                    }
                                    else {
                                        resolve();
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_8 = _a.sent();
                                    reject(e_8);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
    * 设置盯盘的通知类型
    * @param component
    * @param id
    * @param subItemType
    * @param value
    * @param enable
    */
    TradeApi.SetWatchNotifyType = function (component, id, notifyType) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!ApiHelper.CurrentTokenInfo) {
                    throw { status: 401 };
                }
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var dict, url, ret, obj, e_9;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    dict = {
                                        id: id, notifyType: notifyType
                                    };
                                    url = ApiHelper.UrlAddresses.currentUrls.tradeUrl + "/api/MarketWatch/SetNotifyType";
                                    return [4 /*yield*/, HttpClient.postJsonAsync({
                                            data: dict,
                                            component: component,
                                            url: url,
                                            header: {
                                                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
                                            },
                                        })];
                                case 1:
                                    ret = _a.sent();
                                    eval("obj=" + ret);
                                    if (obj.code != 200) {
                                        reject(obj);
                                    }
                                    else {
                                        resolve();
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_9 = _a.sent();
                                    reject(e_9);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
    * 设置盯盘的通知频率
    * @param component
    * @param id
    * @param subItemType
    * @param value
    * @param enable
    */
    TradeApi.SetWatchNotifyFrequency = function (component, id, notifyFrequency) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!ApiHelper.CurrentTokenInfo) {
                    throw { status: 401 };
                }
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var dict, url, ret, obj, e_10;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    dict = {
                                        id: id, notifyFrequency: notifyFrequency
                                    };
                                    url = ApiHelper.UrlAddresses.currentUrls.tradeUrl + "/api/MarketWatch/SetNotifyFrequency";
                                    return [4 /*yield*/, HttpClient.postJsonAsync({
                                            data: dict,
                                            component: component,
                                            url: url,
                                            header: {
                                                "Authorization": "Bearer " + ApiHelper.CurrentTokenInfo.access_token
                                            },
                                        })];
                                case 1:
                                    ret = _a.sent();
                                    eval("obj=" + ret);
                                    if (obj.code != 200) {
                                        reject(obj);
                                    }
                                    else {
                                        resolve();
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_10 = _a.sent();
                                    reject(e_10);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    return TradeApi;
}());
export { TradeApi };
//# sourceMappingURL=TradeApi.js.map