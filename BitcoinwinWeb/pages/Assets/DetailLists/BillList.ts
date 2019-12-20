import { BaseComponent } from "../../../BaseComponent";
import Vue from "vue";
import { TextRes } from "../../../TextRes";
import { AccountApi, CreditFlowItem } from "../../../ServerApis/AccountApi";
import { showError } from "../../../Global";
import { RechargeDetail } from "./RechargeDetail";
import { WithdrawDetail } from "./WithdrawDetail";
import { isArray } from "util";
import { BillDetail } from "./BillDetail";
import { CreditAccount } from "../CreditAccount";
import { FllowOrderDetail } from "./FllowOrderDetail";

var html = require("./billList.html");
export class BillList extends BaseComponent {
    vm: Vue;
    model = {
        textRes: <TextRes>null,
        startDate: "2019-01-02",
        endDate: "2019-02-03",
        isBusy: false,
        /**操作类型(8=充值，9=提现，7=平仓委托成交,1=开仓,12=隔夜利息,20=收益划转,36=借用信用金额,37=信用滞纳金,43=跟单亏损赔偿) */
        opType: undefined, 
        isCreditMode:false,
        types: [
            {
                name: textRes.items['全部'],
                id: [12,20,39],
            },
            {
                name: "" ,//充值
                id: 8,
                f: "+",
                color: textRes.items['TextColor涨'],
                hasDetail: true,
                detailClass: RechargeDetail,
            },
            {
                name: "",//提现
                id: 9,
                f: "-",
                color: textRes.items['TextColor跌'],
                hasDetail: true,
                detailClass: WithdrawDetail,
            },
            //{
            //    name: textRes.items['平仓委托成交'],
            //    id: 7,
            //    f: "",
            //},
            //{
            //    name: textRes.items['开仓'],
            //    id: 1,
            //    f: "",
            //},
            {
                name: textRes.items['隔夜利息'],
                id: 12,
                f: "-",
                color: textRes.items['TextColor跌'],
                hasDetail: false,
            },
            {
                name: textRes.items['收益转入'],
                id: [20,39],
                f: "+",
                color: textRes.items['TextColor涨'],
                hasDetail: false,
            },
            {
                name: textRes.items['借款转入'],
                id: 36,
                f: "+",
                color: textRes.items['TextColor涨'],
                hasDetail: true,
            },
            {
                name: textRes.items['日逾期利息'],
                id: 37,
                f: "-",
                color: textRes.items['TextColor跌'],
                hasDetail:true,
            },
            {
                name: textRes.items['跟单亏损赔偿'],
                id: 43,
                f: "+",
                color: textRes.items['TextColor涨'],
                hasDetail: true,
                detailClass: FllowOrderDetail,
            },
        ],

        datas: <CreditFlowItem[]>[],
        pageNumber: 1,
        hasMore: true,
        dataError: false,
    };
    get needLogin() {
        return true;
    }
    constructor(optype = undefined, isCreditMode = false) {
        super(html);

        this.model.textRes = textRes;
        this.model.isCreditMode = isCreditMode;

        this.model.types[1].name = isCreditMode ? textRes.items['充值信用资本'] : textRes.items['充值'];
        this.model.types[2].name = isCreditMode ? textRes.items['提现信用资本'] : textRes.items['提现'];

        if (optype != undefined) {
            this.model.types = this.model.types.filter(m => m.id == optype);
        }

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
        if (!biztype)
            return this.model.types.find(m => m.id == this.model.opType);

        for (var i = this.model.types.length - 1; i >= 0; i--) {
            if (isArray(this.model.types[i].id) && (<any>this.model.types[i].id).indexOf(biztype) >= 0) {
                return this.model.types[i];
            }
            else if (this.model.types[i].id == biztype) {
                return this.model.types[i];
            }
        }

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


        if (this.model.opType == 8) {
            AccountApi.GetPayinList(this, this.model.isCreditMode ? 2 : 1, this.model.pageNumber, 18, (ret, err) => {
                this.model.isBusy = false;
                if (err) {
                    this.model.dataError = true;
                    showError(err);
                }
                else {
                    console.log(JSON.stringify(ret));
                    this.model.pageNumber++;
                    for (var i = 0; i < ret.length; i++) {
                        ret[i].typeObj = this.getType(ret[i].biztype);
                        if (!ret[i].typeObj)
                            ret[i].typeObj = {};
                        this.model.datas.push(ret[i]);
                    }
                    this.model.hasMore = ret.length == 18;
                }
            });
        }
        else if (this.model.opType == 9) {
            AccountApi.GetPayOutList(this, this.model.isCreditMode?2:1, this.model.pageNumber, 18, (ret, err) => {
                this.model.isBusy = false;
                if (err) {
                    this.model.dataError = true;
                    showError(err);
                }
                else {
                    console.log(JSON.stringify(ret));
                    this.model.pageNumber++;
                    for (var i = 0; i < ret.length; i++) {
                        ret[i].typeObj = this.getType(ret[i].biztype);
                        if (!ret[i].typeObj)
                            ret[i].typeObj = {};
                        this.model.datas.push(ret[i]);
                    }
                    this.model.hasMore = ret.length == 18;
                }
            });
        }
        else {
            AccountApi.GetFundAccountMoneyFlowList(this, this.model.opType, this.model.startDate, this.model.endDate, this.model.pageNumber, 18, (ret,totalIncome, err) => {

                this.model.isBusy = false;
                if (err) {
                    this.model.dataError = true;
                    showError(err);
                }
                else {
                    console.log(JSON.stringify(ret));
                    this.model.pageNumber++;
                    for (var i = 0; i < ret.length; i++) {
                        ret[i].typeObj = this.getType(ret[i].biztype);
                        if (!ret[i].typeObj)
                            ret[i].typeObj = {};
                        this.model.datas.push(ret[i]);
                    }
                    this.model.hasMore = ret.length == 18;
                }
            });
        }
    }
    itemClick(item) {
        if (!item.typeObj.hasDetail)
            return;

        var detailClass = item.typeObj.detailClass;
        if (!detailClass)
            detailClass = BillDetail;

        navigation.push(new detailClass(item, item.typeObj));
    }

    loadMore() {
        this.loadData();
    }
}