import { BaseComponent } from "../../../BaseComponent";
import Vue from "vue";
import { TextRes } from "../../../TextRes";
import { AccountApi, CreditFlowItem } from "../../../ServerApis/AccountApi";
import { showError } from "../../../Global";
import { isArray } from "util";
import { CreditFlowDetail } from "./CreditFlowDetail";

var html = require("./creditFlowList.html");
export class CreditFlowList extends BaseComponent {
    vm: Vue;
    model = {
        textRes: <TextRes>null,
        startDate: "2019-01-02",
        endDate: "2019-02-03",
        isBusy: false,
        /**操作类型1=借用信用金额, 2= 还信用金额, 3= 充值, 4= 提现, 5= 数字货币还款 */
        opType: undefined,
        types: [],

        datas: <CreditFlowItem[]>[],
        pageNumber: 1,
        hasMore: true,
        dataError: false,
        title : "",
    };

    get types() {
        return [
            {
                name: textRes.items['全部'],
                id: [1,2,6,7],
            },
            {
                name: textRes.items['借款'],
                id: 1,
                f: "+",
                color: textRes.items['TextColor涨'],
            },
            {
                name: textRes.items['还款'],
                id: [2,6,7],
                f: "-",
                color: textRes.items['TextColor跌'],
            },
        ];
    }

    get needLogin() {
        return true;
    }
    constructor() {
        super(html);

        this.model.title = textRes.items["明细"];
        this.model.textRes = textRes;
        this.model.types = this.types;
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

    getType(typeid) {
        if (!typeid)
            return this.model.types.find(m => m.id == this.model.opType);

        for (var i = this.model.types.length - 1; i >= 0; i--) {
            if (isArray(this.model.types[i].id) && (<any>this.model.types[i].id).indexOf(typeid) >= 0) {
                return this.model.types[i];
            }
            else if (this.model.types[i].id == typeid) {
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
    itemClick(item: CreditFlowItem) {
        if (!item.typeObj.detailClass)
            navigation.push(new CreditFlowDetail(item.typeObj.name, item.typeObj.f, item.amount, item.id, item.typeObj));
        else
            navigation.push(new item.typeObj.detailClass(item, item.typeObj));
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

        var optype = this.model.opType;

        AccountApi.GetUserCoinFlowList(this, optype, this.model.startDate, this.model.endDate,  this.model.pageNumber, 18, (ret, err) => {
            this.model.isBusy = false;
            if (err) {
                this.model.dataError = true;
                showError(err);
            }
            else {
                console.debug(JSON.stringify(ret));
                this.model.pageNumber++;
                for (var i = 0; i < ret.length; i++) {
                    ret[i].typeObj = this.getType(ret[i].opType);
                    this.model.datas.push(ret[i]);
                }
                this.model.hasMore = ret.length == 18;
            }
        });
    }
    loadMore() {
        this.loadData();
    }
}