//import { BaseComponent } from "../../../BaseComponent";
//import Vue from "vue";
//import { TextRes } from "../../../TextRes";
//import { AccountApi, CreditFlowItem } from "../../../ServerApis/AccountApi";
//import { showError } from "../../../Global";

//var html = require("./friendInComeList.html");
//export class FriendInComeList extends BaseComponent {
//    vm: Vue;
//    model = {
//        textRes: <TextRes>null,
//        startDate: "2019-01-02",
//        endDate: "2019-02-03",
//        isBusy: false,
//        level: 1,
//        incomeTotal: undefined,
//        tabs: [
//            {
//                name: textRes.items['分享好友收获'],
//                level: 1,
//            },
//            {
//                name: textRes.items['好友分享获赠'],
//                level: 2,
//            }
//        ],

//        datas: <CreditFlowItem[]>[],
//        pageNumber: 1,
//        hasMore: true,
//        dataError: false,
//    };
//    get needLogin() {
//        return true;
//    }
//    constructor() {
//        super(html);

//        this.model.textRes = textRes;
//        var now = new Date();

//        this.model.startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).toLocaleDateString();
//        this.model.endDate = now.toLocaleDateString();

//        this.vm = new Vue({
//            el: this.getViewModelElement(),
//            data: this.model,
//            methods: this.getMethodObjectForVue(),
//            computed: {
//                moretext: () => {
//                    if (this.model.isBusy)
//                        return textRes.items["正在加载"] + "...";
//                    else if (this.model.hasMore)
//                        return textRes.items["加载更多"];
//                    else if (this.model.dataError)
//                        return textRes.items["点击重新加载"];
//                    else if (this.model.datas.length == 0)
//                        return textRes.items["目前还没有数据"];
//                    else
//                        return textRes.items["没有更多数据了"];

//                },
//            },
//            watch: {
//                startDate: () => this.reload(),
//                endDate: () => this.reload(),
//                level:()=>this.reload(),
//            },
//        });
//    }

//    onNavigationPushed() {
//        super.onNavigationPushed();

//        this.loadData();
//    }
//    reload() {
//        this.model.hasMore = true;
//        this.model.pageNumber = 1;
//        this.loadData();
//    }
//    loadData() {
//        if (this.model.isBusy || this.model.hasMore == false)
//            return;

//        this.model.isBusy = true;
//        this.model.dataError = false;

//        if (this.model.pageNumber == 1) {
//            this.model.datas = [];
//            this.model.hasMore = true;
//        }

//        AccountApi.GetDistributionIncomeListPageAsync(this, this.model.level, this.model.startDate, this.model.endDate, this.model.pageNumber, 18, (ret, err) => {
//            this.model.isBusy = false;
//            if (err) {
//                this.model.dataError = true;
//                showError(err);
//            }
//            else {
//                if (this.model.level == 1)
//                    this.model.incomeTotal = ret.sharefriendincome;
//                else
//                    this.model.incomeTotal = ret.friendshareincome;

//                this.model.pageNumber++;
//                for (var i = 0; i < ret.list.length; i++) {
//                    this.model.datas.push(ret.list[i]);
//                }
//                this.model.hasMore = ret.length == 18;
//            }
//        });
//    }
//    loadMore() {
//        this.loadData();
//    }
//}