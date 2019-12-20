import { BaseComponent } from "../../../BaseComponent";
import Vue from "vue";
import { TextRes } from "../../../TextRes";
import { ApiHelper, PayChannel } from "../../../ServerApis/ApiHelper";
import { PayCenterApi } from "../../../ServerApis/PayCenterApi";
import { setTimeout } from "timers";
import { AccountCenterApi } from "../../../ServerApis/AccountCenterApi";
import { AccountApi, BuyRequest, AccountInfo } from "../../../ServerApis/AccountApi";
import { showError } from "../../../Global";
import { HttpClient } from "jack-one-script";
import { WebBrowser } from "../../WebBrowser";
import { Recharge } from "./Recharge";
import { alertWindow } from "../../../GlobalFunc";
import { NavigationEvent } from "jack-one-script";
import { MessageCenter, MessageType } from "../../../MessageCenter";
import { Home } from "../../Home";

var html = require("./fiatRecharge.html");


/**法币充值 */
export class FiatRecharge extends BaseComponent {
    vm: Vue;
    model = {
        textRes: <TextRes>null,
        currencyItems: [],
        accountInfo: <AccountInfo>{
            "accountMoneyInfo": {
                "payminamount": 0
            },
        },
        selectedCurrency: undefined,
        channels: <PayChannel[]>null,
        expended: false,
        isCreditMode: false,
        isBusy: 0,
        amount: 2000,
        /**最小充值金额*/
        minRechargeAmount: undefined,
        customAmount: "",
    };
    constructor() {
        super(html);

        this.model.textRes = textRes;
        this.model.isCreditMode = Recharge.IsCreditMode;
        if (Recharge.IsCreditMode) {
            this.model.currencyItems = [
                { name: "BTC", price: 1 },
                { name: "ETH", price: 1 }
            ];
        }
        else {
            this.model.currencyItems = [
                { name: "USDT", price: 1 }
            ]
        }

        ApiHelper.SupportedPayChannels.forEach(m => m.price = undefined);
        this.model.channels = ApiHelper.SupportedPayChannels;

        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
            watch: {
                customAmount: (newValue) => {
                    if (newValue != "") {
                        var value = parseFloat(newValue);
                        if (!isNaN(value)) {
                            this.model.amount = value;
                        }
                    }
                },
                selectedCurrency: (newValue) => {

                    if (Recharge.IsCreditMode) {
                        var selectedChannel;
                        if (this.model.channels.length > 0)
                            selectedChannel = this.model.channels[0];
                        var channels = ApiHelper.SupportedPayChannels.filter(m => m.supportedCurrencies.indexOf(newValue) >= 0);
                        if (selectedChannel) {
                            var index = channels.indexOf(selectedChannel);
                            if (index >= 0) {
                                channels.splice(index, 1);
                                channels.splice(0, 0, selectedChannel);
                            }
                        }

                        this.model.channels = channels;
                    }

                },
            },
            computed: {
                countAmount: () => {

                    if (this.model.selectedCurrency == undefined)
                        return undefined;


                    this.model.minRechargeAmount = this.toFixed(this.model.accountInfo.accountMoneyInfo.payminamount * this.model.channels[0].price, 2);
                    var f = this.model.amount / this.model.channels[0].price;
                    if (!isNaN(f))
                        return this.toFixed(f, 2);
                    else
                        return undefined;
                },
            }
        });

        this.model.selectedCurrency = this.model.currencyItems[0].name;

        this.loadPrice(0);

        if (Recharge.IsCreditMode)
            this.loadCoinPrice(0);

        this.ReceivedAccountInfoAction = (p) => {
            this.model.accountInfo = <AccountInfo>p;
            this.model.minRechargeAmount = this.toFixed(this.model.accountInfo.accountMoneyInfo.payminamount * this.model.channels[0].price, 2);
            ApiHelper.SupportedPayChannels.forEach(m => m.limit = this.model.accountInfo.accountMoneyInfo.payminamount + "-7000");
        };
        if (Home.AccountInfo) {
            this.ReceivedAccountInfoAction(Home.AccountInfo);
        }
        MessageCenter.register(MessageType.ReceivedAccountInfo, this.ReceivedAccountInfoAction);
    }
    ReceivedAccountInfoAction: (p) => void;

    amountClick(value) {
        this.model.customAmount = "";
        this.model.amount = value;
    }

    dispose() {
        MessageCenter.unRegister(MessageType.ReceivedAccountInfo, this.ReceivedAccountInfoAction);
        super.dispose();
    }

    channelClick(channel: PayChannel) {
        this.recordAction("Recharge_" + channel.name);

        var index = this.model.channels.indexOf(channel);
        if (index === 0)
            return;

        this.model.channels.splice(index, 1);
        this.model.channels.splice(0, 0, channel);
        this.model.expended = false;
    }

    loadCoinPrice(index) {
        if (this.disposed)
            return;

        this.model.isBusy++;
        AccountApi.GetRate(this, this.model.currencyItems[index].name, (ret, err) => {
            this.model.isBusy--;
            if (err)
                setTimeout(() => this.loadCoinPrice(index), 1000);
            else {

                this.model.currencyItems[index].price = ret;
                index++;
                if (index == this.model.currencyItems.length)
                    return;
                else
                    this.loadCoinPrice(index);
            }
        });
    }

    /**获取充值渠道的汇率 */
    loadPrice(currentIndex) {
        if (this.disposed)
            return;

        this.model.isBusy++;

        PayCenterApi.GetPrice(this, "USDT", "CNY", 1, this.model.channels[currentIndex].id, (ret, err) => {
            this.model.isBusy--;
            if (err) {
                setTimeout(() => this.loadPrice(currentIndex), 1000);
            }
            else {
                this.model.channels[currentIndex].price = ret;
                currentIndex++;
                if (currentIndex < this.model.channels.length)
                    this.loadPrice(currentIndex);

            }
        });

    }

    async submit() {
        if (this.model.isBusy) {
            await alertWindow(textRes.items['数据仍在加载中，请稍后再试']);
            return;
        }

        this.model.isBusy++;
        try {
            var usdtvalue = null;

            var func = (ret) => {

                var request: BuyRequest = {
                    Amount: usdtvalue,
                    PayAmount: 0,
                    AppId: ApiHelper.PayCenterAppId,
                    ChannelId: ApiHelper.ChannelId,
                    CorderId: ret,
                    Currency: "CNY",
                    Language: HttpClient.defaultHeaders["Accept-Language"],
                    PayChannel: this.model.channels[0].id,
                    Price: 0,
                    Ext: "",
                    ProductId: this.model.selectedCurrency,
                    Stamp: new Date().getTime(),
                    Token: ApiHelper.CurrentTokenInfo.access_token
                };
                var url = AccountApi.BuildInMoneyUrl(request);
                console.log(url);

                if (false && isIOS) {
                    ApiHelper.openUrl(url);
                    navigation.pop(false);
                }
                else {
                    var web = new WebBrowser({
                        fullScreen: false,
                        src: url,
                        useOpenFrame:true,
                        title: Recharge.IsCreditMode ? textRes.items['充值信用资本'] : textRes.items['充值'],
                    });

                    if (!sessionStorage.getItem("alertOnRecharge")) {
                        var action = async (component) => {
                            if (component.constructor == WebBrowser) {
                                sessionStorage.setItem("alertOnRecharge", "1");
                                navigation.removeEventListener(NavigationEvent.OnBeforePop, action);
                                await alertWindow(textRes.items['充值返回提示']);
                                return true;
                            }
                        };
                        navigation.addEventListener(NavigationEvent.OnBeforePop, action);
                    }
                    navigation.push(web);
                }

            };


            if (Recharge.IsCreditMode) {
                var ret = await AccountApi.PostCreditPayInMoney(this, this.model.amount, 2, "CNY", undefined, this.model.channels[0].channel, this.model.selectedCurrency);
                console.log("coinNum:" + JSON.stringify(ret));
                usdtvalue = ret.coinNum;
                func(ret.orderid);
            }
            else {
                var ret = await AccountApi.PostPayInMoney(this, this.model.amount, 2, "CNY", undefined, this.model.channels[0].channel);
                console.log("coinNum:" + JSON.stringify(ret));
                usdtvalue = ret.coinNum;
                func(ret.orderid);
            }

        }
        catch (e) {
            showError(e);
        }
        finally {
            this.model.isBusy--;
        }
    }
}