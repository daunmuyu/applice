import { BaseComponent } from "../../BaseComponent";
import Vue from "vue";
import { TextRes } from "../../TextRes";
import { AccountApi, CreditInfo } from "../../ServerApis/AccountApi";
import { showError } from "../../Global";
import { Recharge } from "./Recharge/Recharge";
import { Withdraw } from "./Withdraw/Withdraw";
import { CreditBorrowList } from "./CreditBorrowList";
import { CreditFlowList } from "./DetailLists/CreditFlowList";
import { CreditRechargeList } from "./DetailLists/CreditRechargeList";
import { ApiHelper } from "../../ServerApis/ApiHelper";
import { ModelValidator } from "jack-one-script";
import { ConfirmWindow } from "../General/ConfirmWindow";
import { WebBrowser } from "../WebBrowser";
import { fail } from "assert";
import { alertWindow } from "../../GlobalFunc";

var html = require("./creditAccount.html");
export class CreditAccount extends BaseComponent {
    static CreditInfo: CreditInfo;
    vm: Vue;
    model = {
        textRes: <TextRes>null,
        isBusy: true,
        creditInfo: <CreditInfo>{},
        isShowBorrowDialog: false,
        borrowAmount: undefined,
        validator: {},
    };
    get needLogin() {
        return true;
    }
    constructor() {
        super(html);

        this.model.textRes = textRes;

        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
            watch: {
                borrowAmount: (newValue)=>
                {
                    if (newValue) {
                        var index = newValue.indexOf(".");
                        if (index >= 0 && index < newValue.length - 3) {
                            this.model.borrowAmount = this.toFixed(newValue, 2, true, true);
                        }
                    }
                },
            },
        });
    }

    loadData() {
        this.model.isBusy = true;
        AccountApi.GetCreditInfo(this, (ret, err) => {
            
            if (err) {
                setTimeout(() => this.loadData() , 1000);
            }
            else {
                this.model.isBusy = false;
                this.model.creditInfo = ret;
                CreditAccount.CreditInfo = ret;
            }
        });
    }
    ruleClick() {
        this.recordAction("Credit_帮助");
        var page = new WebBrowser({
            src: `${ApiHelper.ResourceAddress}/asset/index.${this.model.textRes.langName.replace("-", "_")}.html`,
            fullScreen: false,
            title: this.model.textRes.items["信用资本"]
        });
        navigation.push(page);
    }
    creditRechargeList() {
        navigation.push(new CreditRechargeList());
    }
    blankClick() {
        
    }
    rechargeHistory() {
        this.recordAction("Credit_历史记录");
        navigation.push(new CreditFlowList());
    }
    recharge() {
        if (!ApiHelper.checkCertificationStatus())
            return;

        navigation.push(new Recharge(true));
    }

    async withdraw() {
        if (this.model.isBusy) {
            await alertWindow("数据仍在加载中，请稍后再试");
            return;
        }

        if (CreditAccount.CreditInfo.items.some(m => m.coinNum > 0) == false) {
            await alertWindow(textRes.items["没有可用的信用资本可以提现"]);
            return;
        }

        if (!ApiHelper.checkCertificationStatus())
            return;
        navigation.push(new Withdraw(true));
    }

    async showBorrowDialog() {
        if (!this.model.isBusy) {
            if (this.model.creditInfo.canuseCreditMoney < 0.01) {
                await alertWindow(textRes.items["您的信用额度已被全部取用，需还款后可再度借用哦！"]);
                return;
            }
            this.model.isShowBorrowDialog = true;
        }
    }

    submitBorrow() {
        if (!ModelValidator.verifyToProperty(this.model, [
            { propertyName:"borrowAmount" }
        ], "validator"))
            return;

        navigation.push(new ConfirmWindow([textRes.items["借款数量"] + " (USDT)"], [this.model.borrowAmount], () => {
            this.model.isBusy = true;
            AccountApi.BorrowCreditMoney(this, this.model.borrowAmount, async (ret, err) => {
                this.model.isBusy = false;
                if (err)
                    showError(err);
                else {
                    await alertWindow(textRes.items['借款成功']);
                    this.loadData();
                    this.model.borrowAmount = undefined;
                    this.model.isShowBorrowDialog = false;
                }
            });
        }));
        
    }
    repay() {
        navigation.push(new CreditBorrowList());
    }
    onNavigationActived(isResume) {
        super.onNavigationActived(isResume);
        this.loadData();
    }
}