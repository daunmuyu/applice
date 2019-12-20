import { BaseComponent } from "../../../BaseComponent";
import Vue from "vue";
import { TextRes } from "../../../TextRes";
import { Withdraw } from "./Withdraw";
import { Home } from "../../Home";
import { AccountApi } from "../../../ServerApis/AccountApi";
import { showError } from "../../../Global";
import { setTimeout } from "timers";
import { CreditAccount } from "../CreditAccount";
import { ModelValidator } from "jack-one-script";
import { EnterPayPassword } from "../../General/EnterPayPassword";
import { AlertWindow } from "../../General/AlertWindow";
import { alertWindow } from "../../../GlobalFunc";
var html = require("./bbWithdraw.html");
export class BbWithdraw extends BaseComponent {
    vm: Vue;
    model = {
        textRes: <TextRes>{},
        currencies: [],
        availableAmounts: [],
        approximatelyUSDT:[],
        selectedCurrency: "",
        address: "",
        amount: undefined,
        fee: undefined,
        minWithdraw: undefined,
        bbmaxwithdrawcoinnum: undefined,
        isBusy: false,
        /**成功后几秒返回，这个属性值大于0时，开始显示倒计时*/
        successedSeconds: 0,
        validator: {},
    };
    constructor() {
        super(html);

        if (Withdraw.IsCreditMode) {
            this.model.currencies = [];

            var arr = CreditAccount.CreditInfo.items.filter(m => m.coinNum);

            arr.forEach((m, index) => {
                this.model.currencies[index] = m.coin;
                this.model.availableAmounts[index] = m.coinNum;
                this.model.approximatelyUSDT[index] = m.approximatelyUSDT / m.coinNum;
            });
        }
        else {
            this.model.currencies = ["USDT"];
        }
        this.loadAccountInfo();

        this.model.textRes = textRes;
        if (this.model.currencies.length > 0)
            this.model.selectedCurrency = this.model.currencies[0];

        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
            computed: {
                available: () => {
                    try {
                        if (Withdraw.IsCreditMode) {
                            return this.toFixed(this.model.availableAmounts[this.model.currencies.indexOf(this.model.selectedCurrency)], 8, true, true);
                        }
                        else
                            return this.toFixed( this.model.availableAmounts[this.model.currencies.indexOf(this.model.selectedCurrency)] , 2 , true  ,true);
                    }
                    catch (e) {
                        return "";
                    }
                },
                arrive: () => {
                    if (!this.model.amount)
                        return "";
                    try {
                        if (Withdraw.IsCreditMode) {
                            var approximatelyUSDT = this.model.approximatelyUSDT[this.model.currencies.indexOf(this.model.selectedCurrency)];
                            var val = (this.model.amount * approximatelyUSDT - this.model.fee) / approximatelyUSDT;
                            if (!isNaN(val))
                                return (this.model.selectedCurrency == "USDT"?"":"≈") + val;
                        }
                        else {
                            var val = this.model.amount - this.model.fee;
                            if (!isNaN(val))
                                return val;
                        }
                        return "";
                    }
                    catch (e) {
                        return "";
                    }
                },
                withDrawFee: () => {
                    if (this.model.selectedCurrency.indexOf("USDT") >= 0)
                        return this.model.minWithdraw;

                    var approximatelyUSDT = this.model.approximatelyUSDT[this.model.currencies.indexOf(this.model.selectedCurrency)];
                    var price = this.model.minWithdraw / approximatelyUSDT;
                    if (this.model.selectedCurrency === "BTC") {
                        price = parseFloat(this.toFixed(price, 3, false, true)) + 0.001;
                        return price.toFixed(3)  ;
                    }
                    else {
                        price = parseFloat(this.toFixed(price, 1, false, true)) + 0.1;
                        return price.toFixed(1)  ;
                    }
                },
            },
        });
    }

    async loadAccountInfo() {
        this.model.isBusy = true;
        try {
            var ret = await AccountApi.GetAccountInfo(this);

            this.model.isBusy = false;
            this.model.fee = ret.accountMoneyInfo.withdrawcoinpoundagenum;
            this.model.minWithdraw = ret.accountMoneyInfo.minwithdrawcoinNum;
            this.model.bbmaxwithdrawcoinnum = ret.accountMoneyInfo.bbmaxwithdrawcoinnum;
            if (!Withdraw.IsCreditMode) {
                this.model.availableAmounts = [ret.accountMoneyInfo.canusedamount];
            }
        }
        catch (e) {
            setTimeout(() => this.loadAccountInfo(), 1000);
        }
        finally {
            this.model.isBusy = false;
        }
    }

    submit() {

        if (!ModelValidator.verifyToProperty(this.model, [
            {
                propertyName: "amount"
            },
            {
                propertyName: "address"
            }
        ], "validator")) {
            return;
        }

        navigation.push(new EnterPayPassword(textRes.items["请输入支付密码"], true, (pwd) => {

            if (pwd.length === 6) {
                navigation.pop(false);

                this.model.isBusy = true;

                if (Withdraw.IsCreditMode) {
                    AccountApi.PostCreditOutMoney(this, undefined, pwd, this.model.amount, 1, this.model.address, 1, this.model.selectedCurrency,async (ret, err) => {
                        this.model.isBusy = false;
                        if (err)
                            showError(err);
                        else {
                            await alertWindow(textRes.items['成功提交申请等候审批']);
                            navigation.pop();
                        }
                    });
                }
                else {
                    AccountApi.PostOutMoney(this, undefined, 1, pwd, this.model.amount, 1, this.model.address,async (ret, err) => {
                        this.model.isBusy = false;
                        if (err)
                            showError(err);
                        else {
                            await alertWindow(textRes.items['成功提交申请等候审批']);
                            navigation.pop();
                        }
                    });
                }
            }
        }), false);



    }
}