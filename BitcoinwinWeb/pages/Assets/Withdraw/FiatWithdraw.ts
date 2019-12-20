import { BaseComponent } from "../../../BaseComponent";
import Vue from "vue";
import { TextRes } from "../../../TextRes";
import { AccountApi, PayoutBank, CreditInfo, AccountInfo } from "../../../ServerApis/AccountApi";
import { setTimeout } from "timers";
import { MessageCenter, MessageType } from "../../../MessageCenter";
import {  showError } from "../../../Global";
import { BindingAccount } from "../../My/bankAccount/BindingAccount";
import { CreditAccount } from "../CreditAccount";
import { ModelValidator } from "jack-one-script";
import { Home } from "../../Home";
import { EnterPayPassword } from "../../General/EnterPayPassword";
import { Withdraw } from "./Withdraw";
import { PayCenterApi } from "../../../ServerApis/PayCenterApi";
import { ApiHelper, PayChannel } from "../../../ServerApis/ApiHelper";
import { alertWindow } from "../../../GlobalFunc";

var html = require("./fiatWithdraw.html");
export class FiatWithdraw extends BaseComponent {
    vm: Vue;
    model = {
        textRes: <TextRes>{},
        payChannels: <PayChannel[]>[],
        selectedPayChannel:0,
        banks: <PayoutBank[]>null,
        selectedBankId: null,
        accountInfo: <AccountInfo>null,
        creditInfo: <CreditInfo>null,
        fee: undefined,
        minWithdraw: undefined,
        amount: undefined,
        /**提现费率 */
        ratio: undefined,
        isBusy: 0,
        /**成功后几秒返回，这个属性值大于0时，开始显示倒计时*/
        successedSeconds: 0,
        validator: {},
    };

    private onUserAccountChanged;
    private onAccountInfo;
    constructor() {
        super(html);

        this.model.payChannels = ApiHelper.SupportedPayChannels;
        this.model.selectedPayChannel = this.model.payChannels[0].id;

        this.model.textRes = textRes;
        if (Withdraw.IsCreditMode) {
            if (CreditAccount.CreditInfo)
                this.model.creditInfo = CreditAccount.CreditInfo;
            else {
                this.loadCreditInfo();
            }
        }


        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
            computed: {
                selectedBankDesc: () => {
                    try {
                        var bank = this.model.banks.find(m => m.id == this.model.selectedBankId);
                        return bank.bankName + " " + this.hidePhone(bank.bankNo);
                    }
                    catch (e) {
                        return "";
                    }
                },
                selectedPayChannelDesc: () => {
                    try {
                        var item = this.model.payChannels.find(m => m.id == this.model.selectedPayChannel);
                        return item.name;
                    }
                    catch (e) {
                        return "";
                    }
                },
                canWithdrawAmout: () => {
                    try {
                        if (Withdraw.IsCreditMode)
                            return this.toFixed( this.model.creditInfo.canuseCreditMoney , 8,true,true);
                        else
                            return this.toFixed(this.model.accountInfo.accountMoneyInfo.canusedamount, 2, true, true);
                    }
                    catch (e) {
                        return undefined;
                    }
                },
                arrive: () => {
                    try {
                        console.log("this.model.amount:" + this.model.amount + " " + ApiHelper.SupportedPayChannels[0].price);
                        var val = this.model.amount - this.model.fee;
                       
                        var price = ApiHelper.SupportedPayChannels[0].price;
                        val = price * val;

                        if (isNaN(val))
                            return undefined;

                        return this.toFixed(val, 2);
                    } catch (e) {
                        return undefined;
                    }
                },
            },
        });

        this.loadPrice(0);
        this.loadBanks();
        this.onUserAccountChanged = () => {
            this.loadBanks();
        };
        //如果银行卡列表发生变化，那么，重新loadBanks
        MessageCenter.register(MessageType.BankAccountsChanged, this.onUserAccountChanged);

        this.onAccountInfo = (accoutInfo) => {
            this.model.accountInfo = accoutInfo;
            this.model.fee = this.model.accountInfo.accountMoneyInfo.withdrawcoinpoundagenum;
            this.model.minWithdraw = this.model.accountInfo.accountMoneyInfo.minwithdrawcoinNum;
            this.model.ratio = (<AccountInfo>accoutInfo).accountMoneyInfo.withdrawcashpoundageratio;
        };
        if (Home.AccountInfo) {
            this.onAccountInfo(Home.AccountInfo);
        } 
        MessageCenter.register(MessageType.ReceivedAccountInfo, this.onAccountInfo);
    }

    /**获取充值渠道的汇率 */
    loadPrice(currentIndex) {
        this.model.isBusy++;

        PayCenterApi.GetPrice(this, "USDT", "CNY", 2, ApiHelper.SupportedPayChannels[currentIndex].id, (ret, err) => {
            this.model.isBusy--;
            if (err)
                setTimeout(() => this.loadPrice(currentIndex), 1000);
            else {
                ApiHelper.SupportedPayChannels[currentIndex].price = ret;
                currentIndex++;
                if (currentIndex < ApiHelper.SupportedPayChannels.length)
                    this.loadPrice(currentIndex);

            }
        });

    }

    loadCreditInfo() {
        this.model.isBusy++;
        
        AccountApi.GetCreditInfo(this, (ret, err) => {
            this.model.isBusy--;
            if (err)
                setTimeout(() => this.loadCreditInfo(), 1000);
            else {
                this.model.creditInfo = ret;
            }
        });
    }

    loadBanks() {
        this.model.isBusy ++;
        AccountApi.GetPayoutBanks(this,async (ret, err) => {            
            if (err)
                setTimeout(() => this.loadBanks, 1000);
            else {
                this.model.isBusy --;
                this.model.banks = ret;
                if (ret.length > 0) {
                    this.model.selectedBankId = ret[0].id;
                }
                else {
                    await alertWindow(textRes.items['请先绑定银行卡']);
                    navigation.push(new BindingAccount());
                }
            }
        });
    }

    submit() {
        if (!ModelValidator.verifyToProperty(this.model, [
            {
            propertyName: "amount"
            },
            {
                propertyName: "selectedPayChannel"
            },
            {
                propertyName:"selectedBankId"
            }
        ], "validator")) {
            return;
        }

        navigation.push(new EnterPayPassword(textRes.items["请输入支付密码"], true, (pwd) => {

            if (pwd.length === 6) {
                navigation.pop(false);

                this.model.isBusy++;
                var channel = this.model.selectedPayChannel;

                if (Withdraw.IsCreditMode) {
                    AccountApi.PostCreditOutMoney(this, this.model.selectedBankId, pwd, this.model.amount, 2, undefined, channel, "CNY",async (ret, err) => {
                        this.model.isBusy --;
                        if (err)
                            showError(err);
                        else {
                            await alertWindow(textRes.items['成功提交申请等候审批']);
                            navigation.pop();
                        }
                    });
                }
                else {
                    AccountApi.PostOutMoney(this, this.model.selectedBankId, channel, pwd, this.model.amount, 2, undefined,async (ret, err) => {
                        this.model.isBusy --;
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

    dispose() {
        super.dispose();
        MessageCenter.unRegister(MessageType.BankAccountsChanged, this.onUserAccountChanged);
        MessageCenter.unRegister(MessageType.ReceivedAccountInfo, this.onAccountInfo);
    }

    backToPersonCenter() {
       
    }
}