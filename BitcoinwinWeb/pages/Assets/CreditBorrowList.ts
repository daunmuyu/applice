import { BaseComponent } from "../../BaseComponent";
import Vue from "vue";
import { TextRes } from "../../TextRes";
import { AccountApi, RepaymentItem } from "../../ServerApis/AccountApi";
import { showError } from "../../Global";
import { setTimeout } from "timers";
import { ModelValidator } from "jack-one-script";
import { EnterPayPassword } from "../General/EnterPayPassword";
import { CreditAccount } from "./CreditAccount";
import { CreditFlowList } from "./DetailLists/CreditFlowList";
import { RepayList } from "./DetailLists/RepayList";
import { ConfirmWindow } from "../General/ConfirmWindow";
import { alertWindow } from "../../GlobalFunc";
import { parse } from "querystring";

var html = require("./creditBorrowList.html");
export class CreditBorrowList extends BaseComponent {
    vm: Vue;
    model = {
        textRes: <TextRes>null,
        isBusy: 0,
        /**可用余额 */
        available: undefined,
        repayItem: <RepaymentItem>null,
        isRepayingAll: false,
        /**欠款总额*/
        loanAmount: undefined,
        repayAmount: undefined,
        /** 1: 余额还款 2：数字币还款*/
        repayMode: 1,
        /**还款币种*/
        selectedCurrency:"",
        validator: {},

        currencies: [],
        availableAmounts: [],
        approximatelyUSDT: [],

        datas: <RepaymentItem[]>[],
        pageNumber: 1,
        hasMore: true,
        dataError: false,
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
                repayAmount: (newValue) => {
                    if (newValue) {
                        var index = newValue.indexOf(".");
                        if (index >= 0 && index < newValue.length - 3) {
                            this.model.repayAmount = this.toFixed(newValue, 2, true, true);
                        }
                    }
                },
            },
            computed: {
                moretext: () => {
                    if (this.model.dataError)
                        return textRes.items["点击重新加载"];
                    else if (this.model.isBusy)
                        return textRes.items["正在加载"] + "...";
                    else if (this.model.hasMore)
                        return textRes.items["加载更多"];
                    else if (this.model.datas.length == 0)
                        return textRes.items["目前还没有数据"];
                    else
                        return textRes.items["没有更多数据了"];

                },
                available2: () => {
                    try {
                        return this.model.availableAmounts[this.model.currencies.indexOf(this.model.selectedCurrency)];
                    }
                    catch (e) {
                        return "";
                    }
                },
                needToPayCoin: () => {                   
                  
                    if (isNaN(this.model.repayAmount))
                        return "";


                    var approximatelyUSDT = this.model.approximatelyUSDT[this.model.currencies.indexOf(this.model.selectedCurrency)];
                    if (isNaN(approximatelyUSDT))
                        return "";
                    return (this.model.selectedCurrency == "USDT" ? "=" : "≈") + this.clearZero( (this.model.repayAmount / approximatelyUSDT).toFixed(8));
                },
            },
        });
    }

    getOverdays(item) {
        var freeDate = new Date(item.extData.InterestFreeTime);
        var overMillseconds = new Date().getTime() - freeDate.getTime();
        var days = (<any>window).parseInt(overMillseconds / (60000 * 60 * 24));
        if (overMillseconds % (60000 * 60 * 24) > 0)
            days++;
        return Math.max(0, days - 1);
    }

    loadCreditInfo() {
        this.model.isBusy++;
        AccountApi.GetCreditInfo(this, (ret, err) => {

            if (err) {
                setTimeout(() => this.loadCreditInfo(), 1000);
            }
            else {
                this.model.isBusy--;

                var arr = ret.items.filter(m => m.coinNum);

                arr.forEach((m, index) => {
                    this.model.currencies[index] = m.coin;
                    this.model.availableAmounts[index] = m.coinNum;
                    this.model.approximatelyUSDT[index] = m.approximatelyUSDT / m.coinNum;
                    if (index === 0)
                        this.model.selectedCurrency = m.coin;
                });
            }
        });
    }

    blankClick() {
        
    }

    loadData() {
        if (this.model.isBusy || this.model.hasMore == false)
            return;

        this.model.isBusy++;
        this.model.dataError = false;

        if (this.model.pageNumber == 1) {
            this.model.datas = [];
            this.model.hasMore = true;
        }

        AccountApi.GetRepaymentList(this, this.model.pageNumber, 30, (ret, err) => {
            this.model.isBusy--;
            if (err) {
                this.model.dataError = true;
                showError(err);
            }
            else {
                console.log(JSON.stringify(ret));
                this.model.pageNumber++;
                ret.forEach(m => {
                    //var date = this.getUTCTime(m.interestFreeTime);
                    //if ((date.getTime() - new Date().getTime()) / 1000 < 6 * 24 * 60 * 60) {
                    //    m.urgent = true;
                    //}
                    if (m.overdueDay > 0)
                        m.urgent = true;
                });
                for (var i = 0; i < ret.length; i++) {

                    this.model.datas.push(ret[i]);
                }
                this.model.hasMore = ret.length == 30;
            }
        });
    }
    loadMore() {
        this.loadData();
    }

    async getAccountInfo() {
        this.model.available = undefined;
        this.model.isBusy++;
        try {
            var ret = await AccountApi.GetAccountInfo(this);
            this.model.available = ret.accountMoneyInfo.canusedamount;
        }
        catch (e) {
            setTimeout(() => this.getAccountInfo(), 1000);
        }
        finally {
            this.model.isBusy--;
        }
    }

    repay(item: RepaymentItem) {
        this.getAccountInfo();
        this.model.repayAmount = undefined;
        this.model.repayItem = item;
    }

   async repayall() {
        if (this.model.isBusy) {
            await alertWindow(textRes.items['数据仍在加载中，请稍后再试']);
            return;
        }
        this.getAccountInfo();
        this.model.isRepayingAll = true;

        this.model.isBusy ++;

        AccountApi.GetTradeAssetsInfo(this, (ret, err) => {
            this.model.isBusy --;
            if (err)
                showError(err);
            else {
                this.model.loanAmount = ret.loanAmount;
            }
        });
    }
    submitRepayAll() {

        navigation.push(new ConfirmWindow([
            textRes.items["借款数量"] + " (USDT)",
            textRes.items["还款数量"] + " (USDT)",
        ],
            [
                this.model.loanAmount,
                this.model.loanAmount,
            ], () => {

                navigation.push(new EnterPayPassword(textRes.items['请输入支付密码'], true, (pwd) => {
                    if (pwd.length === 6) {
                        navigation.pop(false);

                        this.model.isBusy++;

                        AccountApi.ReturnCreditMoney(this, this.model.repayMode, pwd, undefined, this.model.selectedCurrency, this.model.loanAmount,async (ret, err) => {
                            this.model.isBusy--;
                            if (err)
                                showError(err);
                            else {
                                await alertWindow(textRes.items['成功还款']);
                                this.model.datas.splice(0, this.model.datas.length);
                                this.model.isRepayingAll = false;
                            }
                        });
                    }
                }));

            }));

        
    }
    listClick() {
        navigation.push(new RepayList());
    }

    submitRepay() {
        if (!ModelValidator.verifyToProperty(this.model, [
            {
                propertyName: "repayAmount"
            }
        ], "validator"))
            return;

        navigation.push(new ConfirmWindow([
            textRes.items["借款数量"] + " (USDT)",
            textRes.items["还款数量"] + " (USDT)",
            this.model.repayItem.overdueDay>0? textRes.items["逾期天数"]:null
        ],
            [
                this.model.repayItem.amount,
                this.model.repayAmount,
                textRes.getItem("n天", this.model.repayItem.overdueDay,"s")
            ], () => {

            navigation.push(new EnterPayPassword(textRes.items['请输入支付密码'], true, (pwd) => {
                if (pwd.length === 6) {
                    navigation.pop(false);

                    this.model.isBusy++;

                    AccountApi.ReturnCreditMoney(this, this.model.repayMode, pwd, this.model.repayItem.id, this.model.selectedCurrency, this.model.repayAmount,async (ret, err) => {
                        this.model.isBusy--;
                        if (err)
                            showError(err);
                        else {
                            await alertWindow(textRes.items['成功还款']);
                            if (this.model.repayAmount >= this.model.repayItem.amount) {
                                var index = this.model.datas.indexOf(this.model.repayItem);
                                this.model.datas.splice(index, 1);
                            }
                            else {
                                this.model.repayItem.amount -= this.model.repayAmount;
                            }
                            this.model.repayItem = null;
                        }
                    });
                }
            }));

        }));

      

        
    }

    onNavigationActived(isResume) {
        super.onNavigationActived(isResume);
        this.loadData();
        this.loadCreditInfo();
    }
}