import { BaseComponent } from "../../BaseComponent";
import Vue from "vue";
import { TextRes } from "../../TextRes";
import { showError } from "../../Global";
import { Recharge } from "./Recharge/Recharge";
import { CreditAccount } from "./CreditAccount";
import { Withdraw } from "./Withdraw/Withdraw";
import { AccountApi, TradeAssetsInfo, AccountInfo } from "../../ServerApis/AccountApi";
import { BillList } from "./DetailLists/BillList";
import { CreditBorrowList } from "./CreditBorrowList";
import { Home } from "../Home";
import { MessageType, MessageCenter } from "../../MessageCenter";
import { ShareInComeList } from "./DetailLists/ShareInComeList";
import { ModelValidator } from "jack-one-script";
import { ApiHelper, CertificationStatus } from "../../ServerApis/ApiHelper";
import { RealName } from "../My/RealName";
import { BalanceList } from "./DetailLists/BalanceList";
import { alertWindow } from "../../GlobalFunc";

var html = require("./assets.html");
export class Assets extends BaseComponent {
    vm: Vue;
    model = {
        textRes: <TextRes>null,
        /**是否划转的是余额宝*/
        isYEB: false,
        isDataReady:false,
        canTransAmount: undefined,
        isShowTransDialog:false,
        safeTop: "",
        isBusy: false,
        isVip: false,

        transAmount: undefined,
        validator: {},

        data: <TradeAssetsInfo>{
            balanceTreasure: {},
            distributionIncome: {}
        },
    };
    get needLogin() {
        return true;
    }
    constructor() {
        super(html);

        this.model.textRes = textRes;
        if (window.api) {
            this.model.safeTop = window.api.safeArea.top + "px";
        }

        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
            watch: {
                isShowTransDialog: (newValue) => {
                    if (newValue == false) {
                        this.model.isYEB = false;
                        this.model.transAmount = undefined;
                    }
                },
            },
        });

        if (Home.AccountInfo) {
            this.model.isVip = Home.AccountInfo.isVip;
        }
        else {
            MessageCenter.register(MessageType.ReceivedAccountInfo, (p) => {
                this.model.isVip = (<AccountInfo>p).isVip;
            });
        }

        MessageCenter.register(MessageType.Logout, (p) => {
            this.model.isVip = false;
            this.model.isDataReady = false;
            this.model.data = <TradeAssetsInfo>{
                balanceTreasure: {},
                distributionIncome: {}
            }
        });
    }
    
    async trans2account() {
        if (this.model.isBusy)
            return;

        if (!ModelValidator.verifyToProperty(this.model, [{ propertyName:"transAmount" }] , "validator"))
            return;
       
        this.model.isBusy = true;

        try {
            if (this.model.isYEB) {
                this.recordAction("Assets_余额宝转入");
                console.log("开始划转余额宝");
                var ret = await AccountApi.CanusedInterestTransferCanusedAmount(this, this.model.transAmount);

                this.loadData();
                this.model.data.balanceTreasure.totalIncome -= this.model.transAmount;
                await alertWindow(textRes.items["成功转入"]);
                this.model.isShowTransDialog = false;
            }
            else {
                if (this.model.isVip)
                    this.recordAction("Assets_VIP邀请收益转入");
                else
                    this.recordAction("Assets_邀请收益转入");

                console.log("开始划转余收益");
               var ret = await AccountApi.CanusedIncomeTransferCanusedAmount(this, this.model.transAmount);

                this.loadData();
                this.model.data.distributionIncome.totalIncome -= this.model.transAmount;
                await alertWindow(textRes.items["成功转入"]);
                this.model.isShowTransDialog = false;
            }
        }
        catch (e) {
            showError(e);
        }
        finally {
            this.model.isBusy = false;
        }
        
    }

    loadData() {
        this.model.isBusy = true;
        AccountApi.GetTradeAssetsInfo(this, (ret, err) => {
            
            if (err) {
                setTimeout(() => this.loadData(), 1000);
            }
            else {
                console.log(JSON.stringify(ret));
                this.model.isBusy = false;
                this.model.data = ret;
                this.model.isDataReady = true;
            }
        });
    }
    async shareInCome(listTotal, pageTotal) {
        if (ApiHelper.CurrentTokenInfo &&  this.model.isBusy) {
            await alertWindow(textRes.items['数据仍在加载中，请稍后再试']);
            return;
        }
        navigation.push(new ShareInComeList(listTotal, pageTotal));
    }
    onNavigationActived(isResume) {
        super.onNavigationActived(isResume);

        this.recordPageStart("资产");

        this.loadData();
    }
    onNavigationUnActived(ispop) {
        super.onNavigationUnActived(ispop);

        this.recordPageEnd("资产");
    }
    repay() {
        navigation.push(new CreditBorrowList());
    }
    borrow() {
        this.recordAction("Assets_我要借款");
        navigation.push(new CreditAccount());
    }
    balanceList() {
        navigation.push(new BalanceList());
    }
    billList() {
        navigation.push(new BillList());
    }
    rechargeClick() {
        if (!ApiHelper.checkCertificationStatus()) {
            return;
        }
       
        navigation.push(new Recharge());
    }
    withdrawClick() {
        this.recordAction("Assets_提现");
        if (!ApiHelper.checkCertificationStatus()) {
            return;
        }

        navigation.push(new Withdraw());
    }
    creaditAccountClick() {
        navigation.push(new CreditAccount());
    }
}