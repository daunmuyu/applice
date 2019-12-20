import { BaseComponent } from "../../../BaseComponent";
import Vue from "vue";
import { TextRes } from "../../../TextRes";
import { AccountApi, CreditFlowItem } from "../../../ServerApis/AccountApi";
import { showError } from "../../../Global";
import { RechargeDetail } from "./RechargeDetail";
import { WithdrawDetail } from "./WithdrawDetail";
import { BalanceDetail } from "./BalanceDetail";

var html = require("./balanceList.html");
export class BalanceList extends BaseComponent {
    vm: Vue;
    model = {
        textRes: <TextRes>null,
        startDate: "2019-01-02",
        endDate: "2019-02-03",
        isBusy: false,
        /**1=保证金，2=余额，3=信用资本 */
        opType: undefined, 
        types: [
            {
                name: textRes.items['昨日收益'],
                id: undefined,
                detailClass: BalanceDetail,
            },
            {
                name: textRes.items['保证金收益'],
                id: 1,
                detailClass: BalanceDetail,
            },
            {
                name: textRes.items['余额收益'],
                id: 2,
                detailClass: BalanceDetail,
            },
            {
                name: textRes.items['信用资本'],
                id: 3,
                detailClass: BalanceDetail,
            },
        ],

        datas: [],
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
        this.model.opType = this.model.types[0].id;
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
            },
            watch: {
                startDate: () => this.reload(),
                endDate: () => this.reload(),
                opType:()=>this.reload(),
            },
        });
    }

    getType(biztype) {
        return this.model.types.find(m => m.id == this.model.opType);
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
    async loadData() {
        if (this.model.isBusy || this.model.hasMore == false)
            return;

        try {
            this.model.isBusy = true;
            this.model.dataError = false;

            if (this.model.pageNumber == 1) {
                this.model.datas = [];
                this.model.hasMore = true;
            }


            var ret = await AccountApi.GetFundDayBalanceTreasureInterestListPaged(this, this.model.opType, this.model.startDate, this.model.endDate, this.model.pageNumber, 18);

            console.log(JSON.stringify(ret));
            this.model.pageNumber++;
            for (var i = 0; i < ret.length; i++) {
                this.model.datas.push(ret[i]);
            }
            this.model.hasMore = ret.length == 18;
        }
        catch (e) {
            this.model.dataError = true;
            showError(e);
        }
        finally {
            this.model.isBusy = false;
        }
    }
    itemClick(item) {

        try {
            var type = this.model.types.find(m => m.id == this.model.opType);
            if (type && type.detailClass)
                navigation.push(new type.detailClass(item, this.model.opType));
        }
        catch (e) {

        }
    }

    loadMore() {
        this.loadData();
    }
}