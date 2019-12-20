import { ApiHelper } from "../ServerApis/ApiHelper";
import { MarketApi } from "../ServerApis/MarketApi";
import { Component } from "jack-one-script";
import { getCache } from "../GlobalFunc";
var KLineDataRefresh = /** @class */ (function () {
    function KLineDataRefresh(commodity, interval) {
        var _this = this;
        /**0:bidprice 1:offerprice*/
        this.priceType = 0;
        /**多少毫秒刷新一次*/
        this.refreshInSeconds = 3000;
        this.refreshTimer = 0;
        this.disposed = false;
        this.commodity = commodity;
        this.interval = interval;
        if (this.interval == "1m" || this.interval == "1minute") {
            this.pageCount = 1000;
        }
        else {
            this.pageCount = 500;
        }
        this.initWebSocket();
        this.refreshingComponent = new Component();
        this.visibilitychangeEventHandler = function () {
            try {
                if (document.hidden) {
                    _this.isDocumentHidden = true;
                    if (_this.websocketTimer) {
                        window.clearTimeout(_this.websocketTimer);
                        _this.websocketTimer = 0;
                    }
                    _this.refreshingComponent.abortHttps();
                    if (_this.refreshTimer) {
                        window.clearTimeout(_this.refreshTimer);
                        _this.refreshTimer = 0;
                    }
                    if (_this.websocket) {
                        var socket = _this.websocket;
                        _this.websocket = null;
                        socket.close();
                    }
                }
                else {
                    _this.isDocumentHidden = false;
                    _this.websocketTimer = window.setTimeout(function () {
                        _this.initWebSocket();
                    }, 1000);
                    //开始刷新数据
                    if (_this.datas)
                        _this.refreshTimer = window.setTimeout(function () { return _this.refreshData(); }, _this.refreshInSeconds);
                    else
                        _this.refreshTimer = window.setTimeout(function () { return _this.loadFirstData(); }, _this.refreshInSeconds);
                }
            }
            catch (e) {
            }
        };
        document.addEventListener("visibilitychange", this.visibilitychangeEventHandler);
    }
    KLineDataRefresh.prototype.initWebSocket = function () {
        var _this = this;
        if (this.websocketTimer) {
            window.clearTimeout(this.websocketTimer);
            this.websocketTimer = 0;
        }
        var priceType = 0;
        try {
            if (getCache("setting_priceType")) {
                priceType = parseInt(getCache("setting_priceType"));
            }
        }
        catch (e) {
        }
        try {
            if (this.disposed)
                return;
            this.websocket = new WebSocket(ApiHelper.UrlAddresses.currentUrls.marketWS);
            this.websocket.onmessage = function (ev) {
                try {
                    if (_this.disposed) {
                        if (_this.websocket) {
                            var socket = _this.websocket;
                            _this.websocket = null;
                            socket.close();
                        }
                        return;
                    }
                    var data = ev.data.substr(ev.data.indexOf("{"));
                    //console.log("websocket:%c " + data , "#0000aa");
                    eval("data=" + data);
                    if (data.BidPrice) {
                        var commodity = _this.commodity;
                        commodity.bidPrice = data.BidPrice;
                        commodity.offerPrice = data.OfferPrice;
                        //commodity.showPrice = (commodity.bidPrice + commodity.offerPrice) / 2;
                        commodity.showPrice = priceType == 0 ? data.BidPrice : data.OfferPrice;
                        commodity.status = data.Status;
                        if (_this.priceType == 0) {
                            commodity.preClose = data.PreClose;
                            commodity.high = data.High;
                            commodity.low = data.Low;
                            commodity.open = data.Open;
                        }
                        else {
                            commodity.preClose = data.AskPreClose;
                            commodity.high = data.AskHigh;
                            commodity.low = data.AskLow;
                            commodity.open = data.AskOpen;
                        }
                        var upv = (commodity.bidPrice - commodity.preClose);
                        if (upv >= 0)
                            commodity.updownValue = "+" + upv.toFixed(commodity.decimalplace);
                        else
                            commodity.updownValue = upv.toFixed(commodity.decimalplace);
                        var percent = (upv * 100) / commodity.preClose;
                        if (percent >= 0) {
                            commodity.isDown = false;
                            commodity.percent = "+" + percent.toFixed(2) + "%";
                        }
                        else {
                            commodity.isDown = true;
                            commodity.percent = percent.toFixed(2) + "%";
                        }
                        if (_this.onTick && _this.datas && _this.datas.length > 0) {
                            //var regx = /[0-9]+/;
                            //var number = parseInt(regx.exec(this.interval)[0]);
                            //var timestamp;
                            //if (this.interval == "minute" || this.interval.indexOf("m") >= 0) {
                            //    timestamp = data.UtcTimeStamp - data.UtcTimeStamp % (1000 * 60 * number);
                            //}
                            //else if (this.interval.indexOf("h") >= 0) {
                            //    timestamp = data.UtcTimeStamp - data.UtcTimeStamp % (1000 * 60 * 60 * number);
                            //}
                            //else if (this.interval.indexOf("d") >= 0) {             
                            //    timestamp = data.UtcTimeStamp - data.UtcTimeStamp % (1000 * 60 * 60 * 24 * number);
                            //}
                            //this.onTick(this, timestamp);
                            _this.onTick(_this, data.UtcTimeStamp);
                        }
                    }
                }
                catch (e) {
                }
            };
            this.websocket.onopen = function () {
                try {
                    console.log("websocket \u5DF2\u8FDE\u63A5 10001|0|2|{\"Symbol\":\"" + _this.commodity.marketsymbol + "\",\"Operate\":1}");
                    _this.websocket.send("10001|0|2|{\"Symbol\":\"" + _this.commodity.marketsymbol + "\",\"Operate\":1}");
                }
                catch (e) {
                }
            };
            this.websocket.onerror = function (ev) {
                if (_this.websocket && !_this.disposed) {
                    _this.websocket = null;
                    _this.websocketTimer = window.setTimeout(function () {
                        _this.initWebSocket();
                    }, 1000);
                }
            };
            this.websocket.onclose = function () {
                console.log("websocket close");
                if (_this.websocket && !_this.disposed) {
                    _this.websocket = null;
                    _this.websocketTimer = window.setTimeout(function () {
                        _this.initWebSocket();
                    }, 1000);
                }
            };
        }
        catch (e) {
            this.websocketTimer = window.setTimeout(function () { return _this.initWebSocket(); }, 1000);
        }
    };
    /**检查是否有缓存 */
    KLineDataRefresh.checkHasCache = function (commodity, interval, priceType) {
        interval = interval == "1minute" ? "1m" : interval;
        var storageItemName = "5_" + commodity.marketsymbol + "_" + interval + "_" + priceType;
        var existDatas = parseInt(sessionStorage.getItem(storageItemName + "_timestamp2"));
        if (existDatas) {
            var diff = (new Date().getTime() - existDatas) / 1000;
            var regx = /[0-9]+/;
            var number = parseInt(regx.exec(interval)[0]);
            if (interval == "minute" || interval.indexOf("m") >= 0) {
                var count = (diff / 60) / number;
                if (count > 30)
                    return false;
            }
            else if (interval.indexOf("h") >= 0) {
                var count = (diff / 3600) / number;
                if (count > 30)
                    return false;
            }
            else if (interval.indexOf("d") >= 0) {
                var count = (diff / (3600 * 24)) / number;
                if (count > 30)
                    return false;
            }
            return true;
        }
        return false;
    };
    KLineDataRefresh.prototype.loadFirstData = function () {
        var _this = this;
        if (this.disposed)
            return;
        var interval = this.interval == "1minute" ? "1m" : this.interval;
        var storageItemName = "5_" + this.commodity.marketsymbol + "_" + interval + "_" + this.priceType;
        var existDatas = false;
        if (KLineDataRefresh.checkHasCache(this.commodity, this.interval, this.priceType)) {
            existDatas = sessionStorage.getItem(storageItemName);
        }
        if (existDatas) {
            eval("existDatas=" + existDatas);
            //这里必须使用setTimeout，否则有问题
            this.datas = existDatas;
            window.setTimeout(function () {
                if (_this.onLoadedFirstData) {
                    _this.onLoadedFirstData(_this, _this.datas);
                }
                //开始刷新数据
                if (_this.datas.length >= _this.pageCount)
                    _this.refreshTimer = window.setTimeout(function () { return _this.refreshData(); }, _this.refreshInSeconds);
                else
                    _this.refreshData();
            }, 0);
            return;
        }
        MarketApi.GetHistory(this.refreshingComponent, this.priceType, this.commodity.marketsymbol, 0, this.pageCount, interval, function (ret, err) {
            if (_this.disposed)
                return;
            if (err || ret.length == 0) {
                console.log("%c GetHistory发生错误:", "color:#f00;");
                _this.refreshTimer = window.setTimeout(function () { return _this.loadFirstData(); }, 500);
            }
            else {
                _this.datas = ret;
                if (_this.onLoadedFirstData) {
                    _this.onLoadedFirstData(_this, ret);
                }
                //开始刷新数据
                _this.refreshTimer = window.setTimeout(function () { return _this.refreshData(); }, _this.refreshInSeconds);
            }
        });
    };
    KLineDataRefresh.prototype.refreshData = function () {
        var _this = this;
        if (this.disposed || this.isDocumentHidden)
            return;
        if (!this.datas || this.datas.length == 0) {
            this.refreshTimer = window.setTimeout(function () { return _this.refreshData(); }, this.refreshInSeconds);
            return;
        }
        var interval = this.interval == "1minute" ? "1m" : this.interval;
        var starttime = 0;
        if (this.datas && this.datas.length > 2)
            starttime = this.datas[2].times;
        MarketApi.GetHistory(this.refreshingComponent, this.priceType, this.commodity.marketsymbol, starttime, this.pageCount, this.interval == "1minute" ? "1m" : this.interval, function (ret, err) {
            if (_this.disposed || _this.isDocumentHidden)
                return;
            if (err) {
                _this.refreshTimer = window.setTimeout(function () { return _this.refreshData(); }, 1000);
            }
            else {
                if (ret.length > 0) {
                    //写缓存
                    var startindex = ret.length - 1;
                    for (var i = ret.length - 1; i >= 0; i--) {
                        var retitem = ret[i];
                        for (var j = 0; j < _this.datas.length; j++) {
                            if (_this.datas[j].times < retitem.times)
                                break;
                            else if (_this.datas[j].times == retitem.times) {
                                _this.datas[j] = retitem;
                                startindex = i - 1;
                                break;
                            }
                        }
                    }
                    for (var i = startindex; i >= 0; i--) {
                        _this.datas.splice(0, 0, ret[i]);
                    }
                    while (_this.datas.length > _this.pageCount)
                        _this.datas.pop();
                    if (_this.onRefreshData) {
                        _this.onRefreshData(_this, ret);
                    }
                }
                _this.refreshTimer = window.setTimeout(function () { return _this.refreshData(); }, _this.refreshInSeconds);
            }
        });
    };
    KLineDataRefresh.prototype.saveCache = function () {
        if (this.datas && this.datas.length > 0) {
            var interval = this.interval == "1minute" ? "1m" : this.interval;
            var storageItemName = "5_" + this.commodity.marketsymbol + "_" + interval + "_" + this.priceType;
            console.debug("\u5199\u5165\u7F13\u5B58\uFF1A" + storageItemName + " len:" + this.datas.length);
            sessionStorage.setItem(storageItemName, JSON.stringify(this.datas));
            sessionStorage.setItem(storageItemName + "_timestamp2", this.datas[0].times.toString());
        }
    };
    KLineDataRefresh.prototype.dispose = function () {
        if (this.disposed)
            return;
        this.saveCache();
        document.removeEventListener("visibilitychange", this.visibilitychangeEventHandler);
        if (this.websocketTimer) {
            window.clearTimeout(this.websocketTimer);
            this.websocketTimer = 0;
        }
        this.onRefreshData = null;
        this.onLoadedFirstData = null;
        this.disposed = true;
        if (this.websocket) {
            var socket = this.websocket;
            this.websocket = null;
            socket.close();
        }
        window.clearTimeout(this.refreshTimer);
        this.refreshTimer = 0;
    };
    return KLineDataRefresh;
}());
export { KLineDataRefresh };
//# sourceMappingURL=KLineDataRefresh.js.map