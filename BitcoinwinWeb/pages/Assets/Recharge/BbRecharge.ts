import { BaseComponent } from "../../../BaseComponent";
import Vue from "vue";
import { TextRes } from "../../../TextRes";
import { showError } from "../../../Global";
import { AccountApi, AccountInfo } from "../../../ServerApis/AccountApi";
import { ModelValidator, ValidateType } from "jack-one-script";
import { Recharge } from "./Recharge";
import { Main } from "../../../Main";
import { alertWindow } from "../../../GlobalFunc";
import { Home } from "../../Home";
import { ApiHelper } from "../../../ServerApis/ApiHelper";
import { MessageType, MessageCenter } from "../../../MessageCenter";
import { setTimeout } from "timers";
var qrcode = require("qrcode");

var html = require("./bbRecharge.html");
export class BbRecharge extends BaseComponent
{
    vm: Vue;
    model = {
        accountInfo: <AccountInfo>{
            "accountMoneyInfo": {
                "payminamount": 0
            },
        },
        textRes: <TextRes>null,
        currencyItems: [
            { name: "ERC20-USDT", address: null, price: 1, WalletAddressType: 102, coin: "USDT", code: "ERC20_USDT", min: 1 },
            { name: "OMNI-USDT", address: null, price: 1, WalletAddressType: 2, coin: "USDT", code:"OMNI_USDT",min:1},           
            { name: "BTC", address: null, price: null, WalletAddressType: 1, coin: "BTC", code: "BTC" , min:0.01,},
            { name: "ETH", address: null, price: null, WalletAddressType: 101, coin: "ETH", code: "ETH" ,min:0.1},
            //{ name: "EOS", address: "bitcoinwinio", price: null, WalletAddressType: 0, coin: "", code: "" , min:10}
        ],
        selectedCurrency: "BTC",
        txid: "",
        amount: undefined,
        isBusy: false,
        validator: {},
    }; 
    constructor() {
        super(html);


        if (Recharge.IsCreditMode) {
            //删除USDT
            var index = this.model.currencyItems.findIndex(m => m.name.indexOf( "USDT") >= 0);
            if (index >= 0)
                this.model.currencyItems.splice(index, 1);

            index = this.model.currencyItems.findIndex(m => m.name.indexOf("USDT") >= 0);
            if (index >= 0)
                this.model.currencyItems.splice(index, 1);
        }
        else {
            //var index = this.model.currencyItems.findIndex(m => m.name == "EOS");
            //if (index >= 0)
            //    this.model.currencyItems.splice(index, 1);
        }

        this.model.selectedCurrency = this.model.currencyItems[0].name;
        this.model.textRes = textRes;

        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
            computed: {
                address: () => {
                    try {
                        this.model.txid = this.model.currencyItems.find(m => m.name === this.model.selectedCurrency).address;
                        return this.model.txid;
                    }
                    catch (e) {
                        return undefined;
                    }
                },
                usdtValue: () => {
                    try {
                        var val = parseFloat(this.model.amount) * this.model.currencyItems.find(m => m.name === this.model.selectedCurrency).price;
                        if (!isNaN(val))
                            return val;
                        return undefined;
                    }
                    catch (e) {
                        return undefined;
                    }
                },
                calculatorText: () => {
                    if (this.model.selectedCurrency === "EOS") {
                        var price = this.model.currencyItems.find(m => m.name === this.model.selectedCurrency).price;
                        price = Home.AccountInfo.accountMoneyInfo.payminamount / price;
                        price = parseFloat(this.toFixed(price, 1, false, true)) + 0.1;
                        return price.toFixed(1) + " " + this.model.selectedCurrency;
                    }
                    return this.model.currencyItems.find(m => m.name === this.model.selectedCurrency).min + " " + this.model.selectedCurrency;
                    //if (this.model.selectedCurrency === "USDT") {
                    //    return Home.AccountInfo.accountMoneyInfo.payminamount + "USDT";
                    //}
                    //else {
                    //    var price = this.model.currencyItems.find(m => m.name === this.model.selectedCurrency).price;
                    //    price = Home.AccountInfo.accountMoneyInfo.payminamount / price;
                    //    if (this.model.selectedCurrency === "BTC") {
                    //        price = parseFloat(this.toFixed(price, 3, false, true)) + 0.001;
                    //        return price.toFixed(3) + "" + this.model.selectedCurrency;
                    //    }
                    //    else if (this.model.selectedCurrency.indexOf("USDT") >= 0) {
                    //        return this.toFixed(price, 0, false, true) + "USDT";
                    //    }
                    //    else {
                    //        price = parseFloat(this.toFixed(price, 1, false, true)) + 0.1;
                    //        return price.toFixed(1) + "" + this.model.selectedCurrency;
                    //    }
                    //    return Home.AccountInfo.accountMoneyInfo.payminamount + "USDT≈" + price + "" + this.model.selectedCurrency;
                    //}
                },
            },
            
            watch: {
                selectedCurrency: () => {
                    
                    try {
                        this.buildQRCode();
                    }
                    catch (e) {

                    }
                },
            },
        });

        this.buildQRCode();
        this.loadPrice(0);

        this.ReceivedAccountInfoAction = (p) => {
            this.model.accountInfo = <AccountInfo>p;
        };
        if (Home.AccountInfo) {
            this.ReceivedAccountInfoAction(Home.AccountInfo);
        }
        MessageCenter.register(MessageType.ReceivedAccountInfo, this.ReceivedAccountInfoAction);
    }

    ReceivedAccountInfoAction: (p) => void;

    dispose() {
        MessageCenter.unRegister(MessageType.ReceivedAccountInfo, this.ReceivedAccountInfoAction);
        super.dispose();
    }

    loadPrice(currentIndex) {
        this.model.isBusy = currentIndex === 0;
        var item = this.model.currencyItems[currentIndex];

        if (item.price == 1) {
            this.model.isBusy = !(currentIndex === this.model.currencyItems.length - 1);
            if (this.model.isBusy) {
                this.loadPrice(currentIndex + 1);
            }
            return;
        }

        AccountApi.GetRate(this, item.name, (ret, err) => {
            
            if (err) {
                setTimeout(() => this.loadPrice(currentIndex) , 1000);
            }
            else {
                this.model.isBusy = !(currentIndex === this.model.currencyItems.length - 1);
                if (this.model.isBusy) {
                    this.loadPrice(currentIndex + 1);
                }
                this.model.currencyItems[currentIndex].price = ret;
            }
        });
    }

     screenShot() {
        var screenClip = window.api.require('screenClip');
        screenClip.screenShot({
            album:true
        }, async (ret, err) => {
                if (ret.status) {
                   await alertWindow(textRes.items["成功保存到相册"]);

            } 
        });
    }

     copyAddress() {
        var clipBoard = window.api.require('clipBoard');
        clipBoard.set({
            value: this.model.currencyItems.filter(m => m.name === this.model.selectedCurrency)[0].address
        }, async (ret, err)=> {
                if (ret) {
                    await alertWindow(textRes.items["成功复制"]);
            } else {
                showError(err.msg);
            }
        });
    }

    async buildQRCode() {
        if (this.disposed)
            return;

        var currencyItem = this.model.currencyItems.find(m => m.name === this.model.selectedCurrency);
        if (!currencyItem.address) {
            this.model.isBusy = true;
            try {
                currencyItem.address = await AccountApi.GetCoinAddress(this, currencyItem.WalletAddressType, currencyItem.coin, currencyItem.code, Recharge.IsCreditMode ? 2 :1);

                this.model.isBusy = false;
            } catch (e) {
                console.error(e);

                setTimeout(() => {
                    this.buildQRCode();
                }, 1000);
                return;
            }            
        }
       

        var ele = <HTMLElement>this.element.querySelector("#canvgQrcode");
        qrcode.toCanvas(ele,
            (<any>this.vm).address,
            {
                width: 4* window.__remConfig_flag,
                height: 4 * window.__remConfig_flag,
                margin: 0,//为0没有白边
            },
            function (error) {
                if (error)
                    showError(error);
            });    
    }

    async submit() {
        if (this.model.isBusy) {
            await alertWindow(textRes.items['数据仍在加载中，请稍后再试']);
            return;
        }
        if (!ModelValidator.verifyToProperty(this.model, [
            //{
            //    propertyName: "txid"
            //},
            {
                propertyName: "amount"
            },
            {
                propertyName: "amount",
                validateType: ValidateType.Number,
            },
        ], "validator"))
            return;

        this.model.isBusy = true;
        var selectedCurrency = this.model.selectedCurrency;
        if (selectedCurrency.indexOf("USDT") >= 0)
            selectedCurrency = "USDT";

        try {

            if (Recharge.IsCreditMode) {
                await AccountApi.PostCreditPayInMoney(this, this.model.amount, 1, selectedCurrency, this.model.txid, 1, selectedCurrency);

                await alertWindow(textRes.items['成功提交充值信息']);
                navigation.pop(false);
            }
            else {
                await AccountApi.PostPayInMoney(this, this.model.amount, 1, selectedCurrency, this.model.txid, 1);

                await alertWindow(textRes.items['成功提交充值信息']);
                navigation.pop(false);
            }
        }
        catch (e) {
            showError(e);
        }
        finally {
            this.model.isBusy = false;
        }
    }
}