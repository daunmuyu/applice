import { BaseComponent } from "../../BaseComponent";
import Vue from "vue";
import { TextRes } from "../../TextRes";
import { AccountApi, RepaymentItem } from "../../ServerApis/AccountApi";
import { showError } from "../../Global";
import { setTimeout } from "timers";
import { ModelValidator } from "jack-one-script";
import { EnterPayPassword } from "../General/EnterPayPassword";


var html = require("./friendList.html");
export class FriendList extends BaseComponent {
    vm: Vue;
    model = {
        textRes: <TextRes>null,
        isBusy: 0,
        level: 1,
        tabs: [{
            name: textRes.items['我邀请的好友'],
            level:1
        }, {
                name: textRes.items['好友邀请的好友'],
                level: 2
            }],

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
                level: () => this.reload(),
            },
        });
    }

   

    blankClick() {
        
    }

    reload() {
        this.model.hasMore = true;
        this.model.pageNumber = 1;
        this.loadData();
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

        AccountApi.GetGoodFriendListPageAsync(this, this.model.level, this.model.pageNumber, 30, (ret, err) => {
            this.model.isBusy--;
            if (err) {
                this.model.dataError = true;
                showError(err);
            }
            else {

                this.model.pageNumber++;
                console.log(JSON.stringify(ret));
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

    onNavigationPushed() {
        super.onNavigationPushed();
        this.loadData();
    }
}