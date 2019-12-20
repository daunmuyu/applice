import { ApiHelper, ServerResult } from "./ApiHelper";
import { HttpClient } from "jack-one-script";
import { IHttpClientUsing } from "jack-one-script";
import { md5 } from "../GlobalFunc";

export interface BuyRequest {
    price: number;
    token: string;

    stamp: number;

    corderid: string;

    productid: string;

    amount: number;

    currency: string;
    paychannel: number;
    ext: string;
}

export class PayCenterApi {

    /**
     * 获取汇率，如要查看1USDT=多少CNY，那么 src_currency='USDT'  target_currency='CNY'
     * @param src_currency 源币种，如 USDT
     * @param target_currency 目标币种，如 CNY
     * @param arrow 1:recharge 2:withdraw.
     * @param payChannel 1:otc 4:旺财
     * @param callback
     */
    static GetPrice(component: IHttpClientUsing,src_currency, target_currency, arrow: number,payChannelId, callback: (ret:number, err) => void) {
        if (!ApiHelper.UrlAddressReady) {
            setTimeout(() => PayCenterApi.GetPrice(component, src_currency, target_currency, arrow, payChannelId,callback), 1000);
            return;
        }

        var request : any = {
            ProductId: src_currency,
            PriceArrow: arrow,
            PayChannel: payChannelId,
            Currency: target_currency,
            Stamp: new Date().getTime(),
            AppId: ApiHelper.PayCenterAppId,
        };

        var names = Object.keys(request).sort();
        var str = "";
        names.forEach((name) => {
            str += `${name.toLowerCase()}=${request[name]}&`;
        });
        str = str.substr(0, str.length - 1);

        var sign = md5(str + ApiHelper.OTCSecret);

        request.Sign = sign;
        console.log(request);
        HttpClient.postJson({
            data: request,
            component: component,
            url: `${ApiHelper.UrlAddresses.currentUrls.payCenterUrl}/api/price/get`,
            callback: (ret, err) => {
                if (err) {
                    callback(null, err);
                }
                else {
                    var obj: ServerResult;
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
    }

    static BuildUrl(request: BuyRequest) {

        (<any>request).ChannelId = ApiHelper.ChannelId;
        (<any>request).AppId = ApiHelper.PayCenterAppId;

        var names = Object.keys(request).sort();
        var str = "";
        names.forEach((name) => {
            str += `${name.toLowerCase()}=${request[name]}&`;
        });
        str = str.substr(0, str.length - 1);

        var sign = md5(str + ApiHelper.OTCSecret);

        return `${ApiHelper.UrlAddresses.currentUrls.payCenterUrl}/pay/do?${str}&Sign=${sign}`;
    }
}