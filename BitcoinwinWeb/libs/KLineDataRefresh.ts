import { Description, ApiHelper } from "../ServerApis/ApiHelper";
import { MarketApi, PriceHistory } from "../ServerApis/MarketApi";

import { Component } from "jack-one-script";
import { setTimeout } from "timers";
import { getCache } from "../GlobalFunc";

export class KLineDataRefresh {
    commodity: Description;
    interval: string;
    /**0:bidprice 1:offerprice*/
    priceType: number = 0;
    pageCount: number;
    /**多少毫秒刷新一次*/
    refreshInSeconds: number = 3000;
    datas: PriceHistory[];
   
    onLoadedFirstData: (sender: KLineDataRefresh, ret: PriceHistory[]) => void;
    onRefreshData: (sender: KLineDataRefresh, ret: PriceHistory[]) => void;
    /**收到tick数据，并且已经赋值给commodity */
    onTick: (sender: KLineDataRefresh,time:number) => void;

    private refreshTimer: any = 0;
    private disposed: boolean = false;
    private websocket: WebSocket;
    private websocketTimer;

    private refreshingComponent: Component;

    private visibilitychangeEventHandler;
    private isDocumentHidden;
    constructor(commodity: Description, interval: string) {
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

         this.visibilitychangeEventHandler = () => {
            try {
                if (document.hidden) {
                    this.isDocumentHidden = true;
                    if (this.websocketTimer) {
                        window.clearTimeout(this.websocketTimer);
                        this.websocketTimer = 0;
                    }

                    this.refreshingComponent.abortHttps();

                    if (this.refreshTimer) {
                        window.clearTimeout(this.refreshTimer);
                        this.refreshTimer = 0;
                    }
                    if (this.websocket) {
                        var socket = this.websocket;
                        this.websocket = null;
                        socket.close();
                    }
                }
                else {
                    this.isDocumentHidden = false;
                    this.websocketTimer = window.setTimeout(() => {
                        this.initWebSocket();
                    }, 1000);
                    //开始刷新数据
                    if (this.datas)
                        this.refreshTimer = window.setTimeout(() => this.refreshData(), this.refreshInSeconds);
                    else
                        this.refreshTimer = window.setTimeout(() => this.loadFirstData(), this.refreshInSeconds);
                }
            }
            catch (e) {

            }
        };
        document.addEventListener("visibilitychange", this.visibilitychangeEventHandler);
    }

    setInterval(interval) {
        window.clearTimeout(this.refreshTimer);
        this.interval = interval;
        if (this.interval == "1m" || this.interval == "1minute") {
            this.pageCount = 1000;
        }
        else {
            this.pageCount = 500;
        }
    }

    initWebSocket() {
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
            this.websocket.onmessage = (ev) => {
                try {
                    if (this.disposed) {
                        if (this.websocket) {
                            var socket = this.websocket;
                            this.websocket = null;
                            socket.close();
                        }
                        return;
                    }

                    var data = ev.data.substr(ev.data.indexOf("{"));
                    //console.log("websocket:%c " + data , "#0000aa");
                    eval("data=" + data);
                    if (data.BidPrice) {
                        var commodity = this.commodity;
                        commodity.bidPrice = data.BidPrice;
                        commodity.offerPrice = data.OfferPrice;
                        //commodity.showPrice = (commodity.bidPrice + commodity.offerPrice) / 2;
                        commodity.showPrice = priceType == 0 ? data.BidPrice : data.OfferPrice;
                        commodity.status = data.Status;

                        if (this.priceType == 0) {
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

                        var upv = (commodity.bidPrice - commodity.open);
                        if (upv >= 0)
                            commodity.updownValue = "+" + upv.toFixed(commodity.decimalplace);
                        else
                            commodity.updownValue = upv.toFixed(commodity.decimalplace);

                        var percent = (upv * 100) / commodity.open;
                        if (percent >= 0) {
                            commodity.isDown = false;
                            commodity.percent = "+" + percent.toFixed(2) + "%";
                        }
                        else {
                            commodity.isDown = true;
                            commodity.percent = percent.toFixed(2) + "%";
                        }

                        if (this.onTick && this.datas && this.datas.length > 0) {

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
                            this.onTick(this, data.UtcTimeStamp);
                        }
                    }
                }
                catch (e) {

                }
            };
            this.websocket.onopen = () => {
                try {
                    console.log(`websocket 已连接 10001|0|2|{"Symbol":"${this.commodity.marketsymbol}","Operate":1}`);
                    this.websocket.send(`10001|0|2|{"Symbol":"${this.commodity.marketsymbol}","Operate":1}`);
                }
                catch (e) {

                }
            };
            this.websocket.onerror = (ev) => {
                if (this.websocket && !this.disposed) {
                    this.websocket = null;
                    this.websocketTimer = window.setTimeout(() => {
                        this.initWebSocket();
                    }, 1000);
                }
            };
            this.websocket.onclose = () => {
                console.log("websocket close");
                if (this.websocket && !this.disposed) {
                    this.websocket = null;
                    this.websocketTimer = window.setTimeout(() => {
                        this.initWebSocket();
                    }, 1000);
                }
            };
        }
        catch (e) {
            this.websocketTimer = window.setTimeout(() => this.initWebSocket() , 1000);
        }

    }

    /**检查是否有缓存 */
    static checkHasCache(commodity: Description, interval: string, priceType: number): boolean {
        interval = interval == "1minute" ? "1m" : interval;
        var storageItemName = `5_${commodity.marketsymbol}_${interval}_${priceType}`;
        var existDatas: any = parseInt(sessionStorage.getItem(storageItemName + "_timestamp2"));

       
        if (existDatas) {
            var diff = (new Date().getTime() - existDatas) / 1000;
            var regx = /[0-9]+/;
            var number = parseInt(regx.exec(interval)[0]);

            if (interval == "minute" || interval.indexOf("m") >= 0) {
                var count = (diff/60) / number;
                if (count > 30)
                    return false;
            }
            else if (interval.indexOf("h") >= 0) {
                var count = (diff / 3600) / number;
                if (count > 30)
                    return false;
            }
            else if (interval.indexOf("d") >= 0) {
                var count = (diff / (3600*24)) / number;
                if (count > 30)
                    return false;
            }

            return true;
        }
        return false;
    }

    loadFirstData() {

        if (this.disposed)
            return;

        var interval = this.interval == "1minute" ? "1m" : this.interval;
        var storageItemName = `5_${this.commodity.marketsymbol}_${interval}_${this.priceType}`;
        var existDatas: any = false;

        if (KLineDataRefresh.checkHasCache(this.commodity, this.interval, this.priceType)) {
            existDatas = sessionStorage.getItem(storageItemName);
        } 
        if (existDatas) {
            eval("existDatas=" + existDatas);
            //这里必须使用setTimeout，否则有问题
            this.datas = <PriceHistory[]>existDatas;

            window.setTimeout(() => {
                if (this.onLoadedFirstData) {
                    this.onLoadedFirstData(this, this.datas);
                }
                //开始刷新数据
                if (this.datas.length >= this.pageCount)
                    this.refreshTimer = window.setTimeout(() => this.refreshData(), this.refreshInSeconds);
                else
                    this.refreshData();
            }, 0);
            

            return;
        }

        MarketApi.GetHistory(this.refreshingComponent, this.priceType, this.commodity.marketsymbol, 0, this.pageCount, interval, (ret, err) => {

            if (this.disposed)
                return;
            
            if (err || ret.length == 0) {
                console.log("%c GetHistory发生错误:" , "color:#f00;");
                this.refreshTimer = window.setTimeout(() => this.loadFirstData(), 500);
            }
            else {
                this.datas = ret;
                this.saveCache();

                if (this.onLoadedFirstData) {
                    this.onLoadedFirstData(this, ret);
                }
                

                //开始刷新数据
                this.refreshTimer = window.setTimeout(() => this.refreshData(), this.refreshInSeconds);
            }
        });
    }

    refreshData() {
        if (this.disposed || this.isDocumentHidden)
            return;

        if (!this.datas || this.datas.length == 0) {
            this.refreshTimer = window.setTimeout(() => this.refreshData(), this.refreshInSeconds);
            return;
        }

        var interval = this.interval == "1minute" ? "1m" : this.interval;
       

        var starttime = 0;
        if (this.datas && this.datas.length > 2)
            starttime = this.datas[2].times;

        MarketApi.GetHistory(this.refreshingComponent, this.priceType, this.commodity.marketsymbol, starttime, this.pageCount, this.interval == "1minute" ? "1m" : this.interval, (ret, err) => {
            if (this.disposed || this.isDocumentHidden)
                return;

            if (err) {
                this.refreshTimer = window.setTimeout(() => this.refreshData(), 1000);
            }
            else {

                if (ret.length > 0) {
                    //写缓存
                    var startindex = ret.length - 1;

                    for (var i = ret.length - 1; i >= 0; i--)  {
                        var retitem = ret[i];
                        for (var j = 0; j < this.datas.length; j++) {
                            if (this.datas[j].times < retitem.times)
                                break;
                            else if (this.datas[j].times == retitem.times) {
                                this.datas[j] = retitem;
                                startindex = i - 1;
                                break;
                            }
                        }
                    }

                    for (var i = startindex; i >= 0; i--) {
                        this.datas.splice(0, 0, ret[i]);
                    }
                    while (this.datas.length > this.pageCount)
                        this.datas.pop();

                    if (this.onRefreshData) {
                        this.onRefreshData(this, ret);
                    }
                }

               this.refreshTimer =  window.setTimeout(() => this.refreshData(), this.refreshInSeconds);
            }
        });

    }

    private saveCache() {
        if (this.datas && this.datas.length > 0) {
            var interval = this.interval == "1minute" ? "1m" : this.interval;
            var storageItemName = `5_${this.commodity.marketsymbol}_${interval}_${this.priceType}`;
            console.debug(`写入缓存：${storageItemName} len:${this.datas.length}`);

            sessionStorage.setItem(storageItemName, JSON.stringify(this.datas));
            sessionStorage.setItem(storageItemName + "_timestamp2", this.datas[0].times.toString());
        }
    }

    dispose() {
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
    }
}