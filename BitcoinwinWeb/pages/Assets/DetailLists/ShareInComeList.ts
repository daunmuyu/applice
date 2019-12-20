import { BaseComponent } from "../../../BaseComponent";
import Vue from "vue";
import { TextRes } from "../../../TextRes";
import { AccountApi, CreditFlowItem, DistributionIncomeItem } from "../../../ServerApis/AccountApi";
import { showError } from "../../../Global";
import { ShareInComeDetail } from "./shareInComeDetail";
import { Home } from "../../Home";

var html = require("./shareInComeList.html");
export class ShareInComeList extends BaseComponent {
    vm: Vue;
    model = {
        textRes: <TextRes>null,
        startDate: "2019-01-02",
        endDate: "2019-02-03",
        isBusy: false,
        totalIncome: undefined,
        level: undefined, 
        types: [
            {
                name: textRes.items['昨日收益'],
                level: undefined,
            },
            {
                name: textRes.items['分享好友收获'],
                level: 1,
                isDistributionTradeIncomeList: false,
            },
            {
                name: textRes.items['好友分享获赠'],
                level: 2,
            }
        ],

        listTotal: undefined,
        pageTotal: undefined,

        datas: <DistributionIncomeItem[]>[],
        pageNumber: 1,
        hasMore: true,
        dataError: false,
    };
    get needLogin() {
        return true;
    }
    constructor(listTotal, pageTotal) {
        super(html);

        if (Home.AccountInfo && Home.AccountInfo.isVip) {
            this.model.types.push({
                name: textRes.items['手续费返佣收益'],
                level: 100,
            });
            this.model.types.push({
                name: textRes.items['首次入金奖励'],
                level: 101,
            });
        }

        this.model.textRes = textRes;
        this.model.listTotal = listTotal;
        this.model.pageTotal = pageTotal;
        var now = new Date();

        this.model.startDate = (<any>new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())).Format("yyyy-MM-dd");
        this.model.endDate = (<any>now).Format("yyyy-MM-dd");

        this.vm = new Vue({
            el: this.getViewModelElement(),
            data: this.model,
            methods: this.getMethodObjectForVue(),
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
                currentTypeName: () => {
                    return this.model.types.find(m => m.level == this.model.level).name;
                },
            },
            watch: {
                startDate: () => this.reload(),
                endDate: () => this.reload(),
                level:()=>this.reload(),
            },
        });
    }

    onNavigationPushed() {
        super.onNavigationPushed();

        this.loadData();
    }
    reload() {
        this.model.hasMore = true;
        this.model.pageNumber = 1;
        this.loadData();
    }
    loadData() {
        if (this.model.isBusy || this.model.hasMore == false)
            return;

        this.model.isBusy = true;
        this.model.dataError = false;

        if (this.model.pageNumber == 1) {
            this.model.datas = [];
            this.model.hasMore = true;
        }

       
        if (this.model.level == 100) {
            //手续费返佣列表
            AccountApi.GetTotalFundDistributionTradeIncomeListPaged(this, this.model.startDate, this.model.endDate, this.model.pageNumber, 18, (ret, totalIncome, err) => {
                this.model.isBusy = false;
                if (err) {
                    this.model.dataError = true;
                    showError(err);
                }
                else {
                    console.log(JSON.stringify(ret));
                    this.model.totalIncome = totalIncome;
                    this.model.pageNumber++;
                    for (var i = 0; i < ret.length; i++) {
                        this.model.datas.push(ret[i]);
                    }
                    this.model.hasMore = ret.length == 18;
                }
            });
        }
        else if (this.model.level == 101)
        {
            /*
             {"flowid":1691,"fundaccountid":8000041,"biztime":"2019-05-29 07:58:21","biztype":33,
             "bizname":"用户首冲赠送分销用户","currenttype":"USDT","amount":10,"objectid":"8000042","canusedamount":10,
             "orderno":0,"contractid":0,"quantity":0,"tradefee":0,"margin":0,"profit":0,
             "symbol":null,"marketsymbol":null,"leverage":null,"financingamount":0,"extdata":null,"extData":{}}]
             */
            AccountApi.GetFundAccountMoneyFlowList(this, 33, this.model.startDate, this.model.endDate, this.model.pageNumber, 18, (ret, totalIncome, err) => {
                this.model.isBusy = false;
                if (err) {
                    this.model.dataError = true;
                    showError(err);
                }
                else {
                    console.log(JSON.stringify(ret));
                    this.model.pageNumber++;
                    this.model.totalIncome = totalIncome;
                    for (var i = 0; i < ret.length; i++) {
                        this.model.datas.push(ret[i]);
                    }
                    this.model.hasMore = ret.length == 18;
                }
            });
        }
        else if (this.model.level) {
            AccountApi.GetTotalFundDayDistributionIncomeListPaged(this, this.model.level, this.model.startDate, this.model.endDate, this.model.pageNumber, 18, (ret,totalIncome, err) => {
                this.model.isBusy = false;
                if (err) {
                    this.model.dataError = true;
                    showError(err);
                }
                else {
                    console.log(JSON.stringify(ret));
                    this.model.pageNumber++;
                    this.model.totalIncome = totalIncome;
                    for (var i = 0; i < ret.length; i++) {
                        this.model.datas.push(ret[i]);
                    }
                    this.model.hasMore = ret.length == 18;
                }
            });
        }
        else {
            AccountApi.GetFundDayTotalIncomeListPaged(this, this.model.startDate, this.model.endDate, this.model.pageNumber, 18, (ret, totalIncome, err) => {
                this.model.isBusy = false;
                if (err) {
                    this.model.dataError = true;
                    showError(err);
                }
                else {
                    console.log(JSON.stringify(ret));
                    this.model.pageNumber++;
                    this.model.totalIncome = totalIncome;
                    for (var i = 0; i < ret.length; i++) {
                        this.model.datas.push(ret[i]);
                    }
                    this.model.hasMore = ret.length == 18;
                }
            });
        }
    }
    detail(date, id, amount) {
        //if (this.model.level != 101)
        //    navigation.push(new ShareInComeDetail((<any>this.vm).currentTypeName, date, id, amount, this.model.level));
    }
    loadMore() {
        this.loadData();
    }
}